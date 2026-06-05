"use strict";

const Security = require("./_security");
const LeadWriter = require("./shared/leadWriter");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "POST, OPTIONS",
    allowHeaders: "content-type"
  });
}

function getEmailConfig() {
  const fromEmail = process.env.OPERON_FROM_EMAIL
    || process.env.OPERON_QUOTE_FROM_EMAIL
    || process.env.QUOTE_FROM_EMAIL
    || "quotes@operonflooring.com.au";

  return {
    resendApiKey: process.env.RESEND_API_KEY || "",
    fromEmail: fromEmail,
    fromName: process.env.OPERON_FROM_NAME || "Operon Flooring Quotes",
    replyTo: process.env.OPERON_REPLY_TO || process.env.OPERON_QUOTE_REPLY_TO || fromEmail,
    internalEmail: process.env.OPERON_INTERNAL_EMAIL || fromEmail
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatFromAddress(config) {
  const name = String(config.fromName || "").replace(/"/g, "").trim();
  return name ? name + " <" + config.fromEmail + ">" : config.fromEmail;
}

function toText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength || 500);
}

function toParagraph(value) {
  return String(value || "").trim().slice(0, 2000);
}

function isValidEmail(value) {
  return /.+@.+\..+/.test(String(value || "").trim());
}

function getTranscriptLines(transcript) {
  return (Array.isArray(transcript) ? transcript : []).slice(-12).map(function (item) {
    const role = item && item.role === "user" ? "Customer" : "Assistant";
    return role + ": " + toParagraph(item && item.text);
  }).filter(function (line) {
    return line.replace(/^Customer: |^Assistant: /, "").trim();
  });
}

function buildInternalEmail(payload, requestId) {
  const customer = payload.customer || {};
  const transcriptLines = getTranscriptLines(payload.transcript);
  const pageUrl = toText(payload.pageUrl, 1000);
  const structuredOutput = payload.structuredOutput && typeof payload.structuredOutput === "object"
    ? JSON.stringify(payload.structuredOutput, null, 2)
    : "";

  const text = [
    "New online operator request",
    "",
    "Request ID: " + requestId,
    "Submitted: " + new Date().toISOString(),
    "Page: " + pageUrl,
    "",
    "Customer",
    "Name: " + toText(customer.name, 160),
    "Phone: " + toText(customer.phone, 80),
    "Email: " + toText(customer.email, 160),
    "",
    "Message",
    toParagraph(payload.message) || "No message supplied.",
    "",
    "Recent chatbot conversation",
    transcriptLines.length ? transcriptLines.join("\n") : "No transcript supplied.",
    "",
    "Structured context",
    structuredOutput || "No structured context supplied."
  ].join("\n");

  return {
    subject: "Online operator request - " + (toText(customer.name, 80) || "Website customer"),
    text: text,
    html: "<pre style=\"font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.5;color:#111827;\">" + escapeHtml(text) + "</pre>"
  };
}

function buildCustomerEmail(payload) {
  const customer = payload.customer || {};
  const name = toText(customer.name, 80) || "there";
  const text = [
    "Hi " + name + ",",
    "",
    "We received your request to speak with an Operon Flooring team member.",
    "A real person will review your message and follow up using the contact details you provided.",
    "",
    "Your message:",
    toParagraph(payload.message) || "Operator follow-up requested.",
    "",
    "Operon Flooring"
  ].join("\n");

  return {
    subject: "We received your operator request - Operon Flooring",
    text: text,
    html: "<p>Hi " + escapeHtml(name) + ",</p>"
      + "<p>We received your request to speak with an Operon Flooring team member. A real person will review your message and follow up using the contact details you provided.</p>"
      + "<p><strong>Your message:</strong><br>" + escapeHtml(toParagraph(payload.message) || "Operator follow-up requested.") + "</p>"
      + "<p>Operon Flooring</p>"
  };
}

async function sendResendEmail(message) {
  const config = getEmailConfig();

  if (!config.resendApiKey || !config.fromEmail || !config.internalEmail) {
    throw new Error("Operator email is not configured. Add RESEND_API_KEY, OPERON_FROM_EMAIL and OPERON_INTERNAL_EMAIL in Netlify.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + config.resendApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: formatFromAddress(config),
      to: Array.isArray(message.to) ? message.to : [message.to],
      reply_to: message.replyTo ? [message.replyTo] : (config.replyTo ? [config.replyTo] : undefined),
      subject: message.subject,
      html: message.html,
      text: message.text
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Operator email failed: " + text);
  }

  return response.json();
}

function getStructuredOutputKeys(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }
  return Object.keys(value).slice(0, 20);
}

async function safelyRecordOperatorLead(payload, requestId, customerEmailSent) {
  try {
    const customer = payload.customer || {};
    const transcript = Array.isArray(payload.transcript) ? payload.transcript : [];
    const structuredOutput = payload.structuredOutput && typeof payload.structuredOutput === "object"
      ? payload.structuredOutput
      : {};
    const leadResult = await LeadWriter.createOrUpdateLead({
      primarySource: "chatbot",
      sourceDetail: "operator_request",
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      },
      statuses: {
        status: "New",
        priority: "normal",
        contactStatus: customerEmailSent ? "customer_and_internal_email_sent" : "internal_notification_sent"
      },
      nextAction: "Review operator request",
      metadata: {
        request_id: requestId,
        page_url: toText(payload.pageUrl, 1000),
        message_length: String(payload.message || "").length,
        transcript_message_count: transcript.length,
        structured_output_keys: getStructuredOutputKeys(structuredOutput)
      }
    });

    if (leadResult && leadResult.leadId) {
      await LeadWriter.recordLeadEvent({
        leadId: leadResult.leadId,
        eventType: "operator_request_submitted",
        source: "operator-chat-request",
        metadata: {
          request_id: requestId,
          page_url: toText(payload.pageUrl, 1000),
          customer_email_sent: Boolean(customerEmailSent),
          transcript_message_count: transcript.length
        }
      });
    }
  } catch (error) {
    console.warn("Non-blocking lead write failed for operator request", {
      requestId: requestId || "",
      reason: Security.safeLogReason(error)
    });
  }
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, {
      methods: "POST, OPTIONS",
      allowHeaders: "content-type"
    });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }

  const largeBodyResponse = Security.rejectLargeBody(event, 150 * 1024);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "operator-chat-request",
    limit: 8,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit);
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
  }

  const turnstile = await Security.verifyTurnstile(event, body.turnstileToken || body.turnstile_token || "");
  if (!turnstile.ok) {
    return Security.botChallengeResponse(event, turnstile);
  }

  const customer = body.customer || {};
  const name = toText(customer.name, 160);
  const phone = toText(customer.phone, 80);
  const email = toText(customer.email, 160);
  const message = toParagraph(body.message);

  if (!name) {
    return jsonResponse(event, 400, { ok: false, error: "Name is required." });
  }

  if (!phone && !email) {
    return jsonResponse(event, 400, { ok: false, error: "Phone or email is required." });
  }

  if (email && !isValidEmail(email)) {
    return jsonResponse(event, 400, { ok: false, error: "Email format looks invalid." });
  }

  const requestId = "operator-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const payload = Object.assign({}, body, {
    customer: {
      name: name,
      phone: phone,
      email: email
    },
    message: message || "Operator follow-up requested."
  });
  const config = getEmailConfig();

  try {
    const internalEmail = buildInternalEmail(payload, requestId);
    await sendResendEmail({
      to: config.internalEmail,
      replyTo: email || config.replyTo,
      subject: internalEmail.subject,
      html: internalEmail.html,
      text: internalEmail.text
    });

    let customerEmailSent = false;
    if (email) {
      const customerEmail = buildCustomerEmail(payload);
      await sendResendEmail({
        to: email,
        subject: customerEmail.subject,
        html: customerEmail.html,
        text: customerEmail.text
      });
      customerEmailSent = true;
    }

    await safelyRecordOperatorLead(payload, requestId, customerEmailSent);

    return jsonResponse(event, 200, {
      ok: true,
      requestId: requestId,
      internalNotificationSent: true,
      customerEmailSent: customerEmailSent
    });
  } catch (error) {
    console.warn("Operator request failed", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 500, {
      ok: false,
      error: Security.safePublicError("Operator request failed. Please try again or contact Operon.")
    });
  }
};
