"use strict";

const { jsonResponse, calculatePrivateQuote } = require("./_supabasePricing");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
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
