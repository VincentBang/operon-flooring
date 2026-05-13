"use strict";

const { jsonResponse, calculatePrivateQuote } = require("./_supabasePricing");
const Security = require("./_security");

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, {
      methods: "POST, OPTIONS",
      allowHeaders: "content-type"
    });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const largeBodyResponse = Security.rejectLargeBody(event, 250 * 1024);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "calculate-private-quote",
    limit: 120,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(400, { error: "Invalid JSON payload." });
  }

  try {
    const result = await calculatePrivateQuote(payload || {});
    return jsonResponse(200, {
      ok: true,
      source: "supabase_private_pricing",
      quote: result
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Private quote calculation failed."
    });
  }
};
