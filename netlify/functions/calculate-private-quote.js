"use strict";

const { jsonResponse, calculatePrivateQuote } = require("./_supabasePricing");
const Security = require("./_security");

const PRIVATE_QUOTE_RESPONSE_BLOCKLIST = new Set([
  "labourSubtotalBeforeMultipliers",
  "labourSubtotalAfterMultipliers",
  "accessFactor",
  "smallJobFactor",
  "zoneMultiplier",
  "locationSurchargePercent",
  "minimumJobFee",
  "roundingAdjustment",
  "minimumChargeApplied",
  "travelFeeTotal",
  "locationTotal",
  "installationTotal",
  "installationAdjustedTotal",
  "pricingSourceProductId",
  "pricingSourceProductLabel",
  "stairWidthTier",
  "stairWidthTierLabel",
  "stairWidthAssumed",
  "stairGuideWidthMm",
  "stairRangeId"
]);

function sanitizeLineItem(line) {
  const source = line && typeof line === "object" ? line : {};
  return {
    label: source.label || "",
    qty: source.qty || "",
    quantity: source.quantity || source.qty || "",
    note: source.note || "",
    amount: Number(source.amount || source.total || 0),
    total: Number(source.amount || source.total || 0)
  };
}

function sanitizePrivateQuoteResponse(result) {
  const source = result && typeof result === "object" ? result : {};
  const safe = {};

  Object.keys(source).forEach(function (key) {
    if (PRIVATE_QUOTE_RESPONSE_BLOCKLIST.has(key)) {
      return;
    }
    safe[key] = source[key];
  });

  safe.quoteLines = Array.isArray(source.quoteLines)
    ? source.quoteLines.map(sanitizeLineItem)
    : [];
  safe.quoteTotal = Number(source.totalIncGst || 0);
  safe.lineItems = safe.quoteLines;
  safe.estimateStatus = source.pricePending ? "pending" : "ready";
  safe.confidence = source.quoteConfidence || source.confidenceLevel || "";
  safe.customerNotes = Array.isArray(source.warnings) ? source.warnings : [];
  safe.includedScope = safe.quoteLines.map(function (line) { return line.label; }).filter(Boolean);
  safe.itemsToConfirm = Array.isArray(source.warnings) ? source.warnings : [];

  return safe;
}

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
      quote: sanitizePrivateQuoteResponse(result)
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Private quote calculation failed."
    });
  }
};
