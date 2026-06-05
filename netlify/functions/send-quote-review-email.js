"use strict";

const Security = require("./_security");

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
    replyTo: process.env.OPERON_REPLY_TO || process.env.OPERON_QUOTE_REPLY_TO || fromEmail
  };
}

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

async function sendResendEmail(message) {
  const config = getEmailConfig();
  if (!config.resendApiKey || !config.fromEmail) {
    throw new Error("Quote review email is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + config.resendApiKey
    },
    body: JSON.stringify({
      from: config.fromName + " <" + config.fromEmail + ">",
      to: [message.to],
      reply_to: config.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Email send failed: " + text);
  }

  return response.json().catch(function () {
    return {};
  });
}

function buildReviewEmail(payload) {
  const emailTo = clean(payload.emailTo);
  const review = payload.review || {};
  const readiness = clean(review.quoteReadinessLabel || review.quoteReadiness || "Quote review");
  const confidence = clean(review.reportConfidence || "Not shown");
  const documentQuality = clean(review.documentQuality || "Not shown");
  const questions = toArray(review.questionsToAsk).slice(0, 8);
  const topItems = toArray(review.topItemsToConfirm).slice(0, 3);
  const extractedRows = toArray(review.extractedRows).slice(0, 8);
  const summary = clean(review.summary);

  const topItemsHtml = topItems.length
    ? "<ul>" + topItems.map(function (item) {
      return "<li><strong>" + escapeHtml(item.label || item.title || "Confirm item") + "</strong> - " + escapeHtml(item.note || item.body || "") + "</li>";
    }).join("") + "</ul>"
    : "<p>No priority items were flagged in this review.</p>";

  const questionsHtml = questions.length
    ? "<ol>" + questions.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("") + "</ol>"
    : "<p>No additional questions were generated.</p>";

  const extractedHtml = extractedRows.length
    ? "<ul>" + extractedRows.map(function (item) {
      return "<li><strong>" + escapeHtml(item.label || "") + "</strong>: " + escapeHtml(item.value || "") + "</li>";
    }).join("") + "</ul>"
    : "";

  const html = [
    "<div style=\"font-family:Inter,Arial,sans-serif;background:#faf8f4;padding:32px;color:#111820;\">",
    "<div style=\"max-width:720px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;border:1px solid #e8e2d8;\">",
    "<p style=\"margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a67c52;\">Operon Flooring</p>",
    "<h1 style=\"margin:0 0 12px;font-size:28px;line-height:1.2;color:#111820;\">Your quote review summary</h1>",
    "<p style=\"margin:0 0 20px;color:#4b5563;line-height:1.6;\">" + escapeHtml(summary || "Here is the quote review summary you asked us to send.") + "</p>",
    "<div style=\"border:1px solid #e8e2d8;border-radius:16px;padding:20px;margin-bottom:24px;background:#f6f2ec;\">",
    "<div style=\"display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;\">",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Quote readiness</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(readiness) + "</span></div>",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Review confidence</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(confidence) + "</span></div>",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Document quality</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(documentQuality) + "</span></div>",
    "</div></div>",
    "<h2 style=\"font-size:18px;margin:0 0 10px;color:#111820;\">Top 3 items to confirm</h2>",
    topItemsHtml,
    "<h2 style=\"font-size:18px;margin:24px 0 10px;color:#111820;\">Questions to ask</h2>",
    questionsHtml,
    extractedHtml ? "<h2 style=\"font-size:18px;margin:24px 0 10px;color:#111820;\">Extracted quote basis</h2>" + extractedHtml : "",
    "<p style=\"margin:24px 0 0;color:#4b5563;line-height:1.6;\">If you want a like-for-like comparison, start a structured Operon quote with the reviewed details attached.</p>",
    "</div></div>"
  ].join("");

  const text = [
    "Operon Flooring quote review summary",
    "",
    "Quote readiness: " + readiness,
    "Review confidence: " + confidence,
    "Document quality: " + documentQuality,
    summary ? "" : "",
    summary,
    "",
    "Top 3 items to confirm:",
    topItems.map(function (item) {
      return "- " + clean(item.label || item.title) + (clean(item.note || item.body) ? ": " + clean(item.note || item.body) : "");
    }).join("\n"),
    "",
    "Questions to ask:",
    questions.map(function (item) { return "- " + clean(item); }).join("\n"),
    extractedRows.length ? "" : "",
    extractedRows.length ? "Extracted quote basis:" : "",
    extractedRows.map(function (item) {
      return "- " + clean(item.label) + ": " + clean(item.value);
    }).join("\n")
  ].filter(Boolean).join("\n");

  return {
    to: emailTo,
    subject: "Your Operon quote review summary",
    html: html,
    text: text
  };
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

  const largeBodyResponse = Security.rejectLargeBody(event, 250 * 1024);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "quote-review-email",
    limit: 10,
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

  const emailTo = clean(body.emailTo);
  if (!/.+@.+\..+/.test(emailTo)) {
    return jsonResponse(event, 400, { ok: false, error: "A valid email address is required." });
  }

  const turnstileToken = body.turnstileToken || body.turnstile_token || "";
  if (turnstileToken) {
    const turnstile = await Security.verifyTurnstile(event, turnstileToken);
    if (!turnstile.ok) {
      return Security.botChallengeResponse(event, turnstile);
    }
  }

  try {
    const message = buildReviewEmail(body);
    await sendResendEmail(message);
    return jsonResponse(event, 200, { ok: true });
  } catch (error) {
    return jsonResponse(event, 500, {
      ok: false,
      error: "Quote review email could not be sent right now."
    });
  }
};
