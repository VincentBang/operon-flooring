"use strict";

const Security = require("./_security");
const LeadWriter = require("./shared/leadWriter");

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

function parseBody(event) {
  const contentType = String(event.headers && (event.headers["content-type"] || event.headers["Content-Type"]) || "");
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : (event.body || "");

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(rawBody || "{}");
    } catch (error) {
      return {};
    }
  }

  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength || 500);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderRows(rows) {
  return rows.map(function (row) {
    return "<tr><td style=\"padding:8px 12px;border-bottom:1px solid #dde5e2;color:#5e6a74;width:160px;\">"
      + escapeHtml(row[0])
      + "</td><td style=\"padding:8px 12px;border-bottom:1px solid #dde5e2;color:#17232d;font-weight:600;\">"
      + escapeHtml(row[1] || "Not provided")
      + "</td></tr>";
  }).join("");
}

async function sendResendEmail(message) {
  const config = getEmailConfig();
  if (!config.resendApiKey || !config.fromEmail || !config.internalEmail) {
    throw new Error("Contact email is not configured. Add RESEND_API_KEY, OPERON_FROM_EMAIL and OPERON_INTERNAL_EMAIL in Netlify.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + config.resendApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: config.fromName + " <" + config.fromEmail + ">",
      to: [config.internalEmail],
      reply_to: message.replyTo ? [message.replyTo] : [config.replyTo],
      subject: message.subject,
      html: message.html,
      text: message.text
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Resend contact email failed: " + text);
  }

  return response.json();
}

async function safelyRecordContactLead(data) {
  try {
    const leadResult = await LeadWriter.createOrUpdateLead({
      primarySource: "contact",
      sourceDetail: "contact_form",
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone
      },
      project: {
        suburb: data.suburb
      },
      statuses: {
        status: "New",
        priority: "normal",
        contactStatus: "internal_notification_sent"
      },
      nextAction: "Review contact enquiry",
      metadata: {
        topic: data.topic || "",
        timing: data.timing || "",
        message_length: String(data.message || "").length,
        source_page: "contact.html"
      }
    });

    if (leadResult && leadResult.leadId) {
      await LeadWriter.recordLeadEvent({
        leadId: leadResult.leadId,
        eventType: "contact_submitted",
        source: "contact-enquiry",
        metadata: {
          source_page: "contact.html",
          topic: data.topic || "",
          timing: data.timing || "",
          message_length: String(data.message || "").length
        }
      });
    }
  } catch (error) {
    console.warn("Non-blocking lead write failed for contact enquiry", {
      reason: Security.safeLogReason(error)
    });
  }
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST, OPTIONS" },
      body: "Method not allowed"
    };
  }

  const data = parseBody(event);
  if (cleanText(data["bot-field"], 120)) {
    return {
      statusCode: 303,
      headers: { Location: "/contact-thank-you.html" },
      body: ""
    };
  }

  const name = cleanText(data.name, 160);
  const email = cleanText(data.email, 220);
  const phone = cleanText(data.phone, 80);
  const suburb = cleanText(data.suburb, 160);
  const topic = cleanText(data.topic, 180);
  const timing = cleanText(data.timing, 180);
  const message = cleanText(data.message, 2000);

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Please provide your name, email and message."
    };
  }

  const submittedAt = new Date().toISOString();
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Suburb", suburb],
    ["Enquiry type", topic],
    ["Project timing", timing],
    ["Submitted", submittedAt],
    ["Source", "contact.html"]
  ];

  const html = "<div style=\"font-family:Inter,Arial,sans-serif;color:#17232d;line-height:1.5;\">"
    + "<h1 style=\"font-size:24px;margin:0 0 16px;\">New Operon contact enquiry</h1>"
    + "<table style=\"border-collapse:collapse;width:100%;max-width:720px;border:1px solid #dde5e2;\">"
    + renderRows(rows)
    + "</table>"
    + "<h2 style=\"font-size:18px;margin:22px 0 8px;\">Message</h2>"
    + "<p style=\"white-space:pre-wrap;background:#f6f8f7;border:1px solid #dde5e2;border-radius:12px;padding:14px;max-width:720px;\">"
    + escapeHtml(message)
    + "</p>"
    + "</div>";

  const text = [
    "New Operon contact enquiry",
    "",
    "Name: " + name,
    "Email: " + email,
    "Phone: " + (phone || "Not provided"),
    "Suburb: " + (suburb || "Not provided"),
    "Enquiry type: " + (topic || "Not provided"),
    "Project timing: " + (timing || "Not provided"),
    "Submitted: " + submittedAt,
    "",
    "Message:",
    message
  ].join("\n");

  try {
    await sendResendEmail({
      replyTo: email,
      subject: "New Operon contact enquiry - " + (suburb || "Website"),
      html: html,
      text: text
    });
    await safelyRecordContactLead({
      name: name,
      email: email,
      phone: phone,
      suburb: suburb,
      topic: topic,
      timing: timing,
      message: message
    });
  } catch (error) {
    console.error("Contact enquiry failed", {
      reason: Security.safeLogReason(error)
    });
    return {
      statusCode: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Contact enquiry could not be sent. Please email quotes@operonflooring.com.au."
    };
  }

  return {
    statusCode: 303,
    headers: { Location: "/contact-thank-you.html" },
    body: ""
  };
};
