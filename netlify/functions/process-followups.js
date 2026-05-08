"use strict";

const { getSupabaseTables } = require("./_supabaseTables");

function jsonResponse(statusCode, payload) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || "";
  return { url: url, serviceRoleKey: serviceRoleKey };
}

function getEmailConfig() {
  const fromEmail = process.env.OPERON_FROM_EMAIL
    || process.env.OPERON_QUOTE_FROM_EMAIL
    || process.env.QUOTE_FROM_EMAIL
    || "quotes@operonflooring.com.au";
  return {
    resendApiKey: process.env.RESEND_API_KEY || "",
    fromEmail: fromEmail,
    fromName: process.env.OPERON_FROM_NAME || "Operon Flooring",
    replyTo: process.env.OPERON_REPLY_TO || process.env.OPERON_QUOTE_REPLY_TO || fromEmail
  };
}

function formatFromAddress(config) {
  return config.fromName ? config.fromName + " <" + config.fromEmail + ">" : config.fromEmail;
}

async function supabaseRequest(path, options) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const settings = Object.assign({
    method: "GET",
    query: null,
    body: null,
    headers: {}
  }, options || {});
  const url = new URL(config.url + "/rest/v1/" + path);
  if (settings.query) {
    Object.keys(settings.query).forEach(function (key) {
      url.searchParams.set(key, settings.query[key]);
    });
  }

  const headers = Object.assign({
    apikey: config.serviceRoleKey,
    Authorization: "Bearer " + config.serviceRoleKey,
    Accept: "application/json"
  }, settings.headers || {});
  if (settings.body !== null && typeof settings.body !== "undefined") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url.toString(), {
    method: settings.method,
    headers: headers,
    body: settings.body !== null && typeof settings.body !== "undefined"
      ? JSON.stringify(settings.body)
      : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Supabase request failed for " + path + ": " + text);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function getSendEnabled() {
  const value = String(process.env.OPERON_FOLLOWUP_SEND_ENABLED || process.env.ENABLE_FOLLOWUP_SEND || "true").trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHtml(text) {
  return "<div style=\"font-family:Arial,sans-serif;line-height:1.55;color:#142f38;font-size:16px;\">"
    + escapeHtml(text).replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>")
    + "</div>";
}

async function sendResendEmail(message) {
  const config = getEmailConfig();
  if (!config.resendApiKey || !config.fromEmail) {
    throw new Error("Follow-up email is not configured. Add RESEND_API_KEY and OPERON_FROM_EMAIL in Netlify.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + config.resendApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: formatFromAddress(config),
      to: [message.to],
      reply_to: config.replyTo ? [config.replyTo] : undefined,
      subject: message.subject,
      html: message.html,
      text: message.text
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Follow-up email failed: " + text);
  }

  return response.json();
}

async function markMessage(messageId, status, details) {
  const tables = getSupabaseTables();
  await supabaseRequest(tables.followupMessages, {
    method: "PATCH",
    query: { id: "eq." + messageId },
    headers: { Prefer: "return=minimal" },
    body: {
      status: status,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      provider_response: details.provider_response || null,
      error_message: details.error_message || null
    }
  });
}

async function updateQuoteFollowupStatus(quoteRequestId, status) {
  if (!quoteRequestId) return;

  const tables = getSupabaseTables();
  const queuedRows = await supabaseRequest(tables.followupMessages, {
    query: {
      quote_request_id: "eq." + quoteRequestId,
      status: "eq.queued",
      channel: "eq.email",
      select: "scheduled_for",
      order: "scheduled_for.asc",
      limit: "1"
    }
  });
  const nextFollowupAt = Array.isArray(queuedRows) && queuedRows[0] ? queuedRows[0].scheduled_for : null;

  await supabaseRequest(tables.quoteRequests, {
    method: "PATCH",
    query: { id: "eq." + quoteRequestId },
    headers: { Prefer: "return=minimal" },
    body: {
      followup_status: nextFollowupAt ? "queued" : status,
      last_followup_at: status === "sent" ? new Date().toISOString() : undefined,
      next_followup_at: nextFollowupAt
    }
  });
}

function buildEmailFromMessage(message) {
  const payload = message.payload && typeof message.payload === "object" ? message.payload : {};
  const to = String(payload.to_email || "").trim();
  const subject = String(payload.subject || "Your flooring estimate - next steps").trim();
  const text = String(payload.body || "").trim();

  if (!to || !/.+@.+\..+/.test(to)) {
    throw new Error("Queued follow-up has no valid customer email.");
  }
  if (!text) {
    throw new Error("Queued follow-up has no message body.");
  }

  return {
    to: to,
    subject: subject,
    text: text,
    html: textToHtml(text)
  };
}

async function processMessage(message, sendEnabled) {
  if (!sendEnabled) {
    return { id: message.id, status: "queued", skipped: "sending_disabled" };
  }

  try {
    const email = buildEmailFromMessage(message);
    const providerResponse = await sendResendEmail(email);
    await markMessage(message.id, "sent", { provider_response: providerResponse });
    await updateQuoteFollowupStatus(message.quote_request_id, "sent");
    return { id: message.id, status: "sent" };
  } catch (error) {
    await markMessage(message.id, "failed", {
      error_message: error && error.message ? error.message : "Follow-up email failed."
    });
    await updateQuoteFollowupStatus(message.quote_request_id, "failed");
    return {
      id: message.id,
      status: "failed",
      error: error && error.message ? error.message : "Follow-up email failed."
    };
  }
}

async function processDueFollowups(limit) {
  const tables = getSupabaseTables();
  const dueRows = await supabaseRequest(tables.followupMessages, {
    query: {
      status: "eq.queued",
      channel: "eq.email",
      scheduled_for: "lte." + new Date().toISOString(),
      select: "id,quote_request_id,lead_id,channel,template_key,scheduled_for,status,payload",
      order: "scheduled_for.asc",
      limit: String(limit || 25)
    }
  });
  const sendEnabled = getSendEnabled();
  const results = [];

  for (const message of Array.isArray(dueRows) ? dueRows : []) {
    results.push(await processMessage(message, sendEnabled));
  }

  return {
    sendEnabled: sendEnabled,
    processed: results.length,
    results: results
  };
}

exports.config = {
  schedule: "*/10 * * * *"
};

exports.handler = async function (event) {
  if (event.httpMethod && event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  try {
    const params = new URLSearchParams(event.rawQuery || "");
    const limit = Math.max(1, Math.min(100, Math.round(Number(params.get("limit") || 25))));
    const result = await processDueFollowups(limit);
    return jsonResponse(200, Object.assign({ ok: true }, result));
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Follow-up processing failed."
    });
  }
};
