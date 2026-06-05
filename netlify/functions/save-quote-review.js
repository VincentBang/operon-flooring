"use strict";

const { getSupabaseTables } = require("./_supabaseTables");
const Security = require("./_security");
const LeadWriter = require("./shared/leadWriter");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "POST, OPTIONS",
    allowHeaders: "content-type"
  });
}

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

function toNumberOrNull(value) {
  if (value === "" || value === null || typeof value === "undefined") {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toText(value, maxLength) {
  const text = String(value || "").trim();
  return text.slice(0, maxLength || 500);
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function truncateText(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function getJsonSize(value) {
  try {
    return JSON.stringify(value || {}).length;
  } catch (error) {
    return 0;
  }
}

function buildStoredOcr(payload) {
  const extractedText = String(payload.ocr_extracted_text || "");
  const maxTextLength = 50000;
  return {
    status: toText(payload.ocr_status, 80),
    confidence: toNumberOrNull(payload.ocr_confidence),
    engine: toText(payload.ocr_engine, 120),
    extracted_text: truncateText(extractedText, maxTextLength),
    extracted_text_truncated: extractedText.length > maxTextLength
  };
}

function buildStoredDatabaseComparison(payload) {
  const comparison = toObject(payload.database_comparison);
  if (!Object.keys(comparison).length) {
    return null;
  }

  const priceGuide = toObject(comparison.priceGuide);
  return {
    status: toText(comparison.status, 80),
    notes: toText(comparison.notes, 1000),
    comparisonLevel: toText(comparison.comparisonLevel, 120),
    category: toObject(comparison.category),
    productMatches: toArray(comparison.productMatches).slice(0, 5),
    priceGuide: {
      quoteTotalIncGst: toNumberOrNull(priceGuide.quoteTotalIncGst),
      quotedAreaM2: toNumberOrNull(priceGuide.quotedAreaM2),
      quotedRateIncGstPerM2: toNumberOrNull(priceGuide.quotedRateIncGstPerM2),
      operonGuideRateIncGstPerM2: toNumberOrNull(priceGuide.operonGuideRateIncGstPerM2),
      operonGuideTotalIncGst: toNumberOrNull(priceGuide.operonGuideTotalIncGst),
      position: toObject(priceGuide.position)
    },
    scopeComparison: toArray(comparison.scopeComparison)
  };
}

function buildStoredAdvisorSummary(payload) {
  const summary = Object.assign({}, toObject(payload.advisor_summary));
  const documentReview = {
    uploaded_quote_reference: toText(payload.uploaded_quote_reference, 260),
    ocr: buildStoredOcr(payload),
    extracted_quote_fields: toObject(payload.extracted_quote_fields),
    database_comparison: buildStoredDatabaseComparison(payload),
    missing_items: toArray(payload.missing_items),
    unknown_items: toArray(payload.unknown_items),
    questions_to_ask: toArray(summary.questions_to_ask || payload.questions_to_ask),
    saved_for_followup: true
  };

  summary.document_review = documentReview;

  if (getJsonSize(summary) > 900000) {
    summary.document_review.ocr.extracted_text = truncateText(summary.document_review.ocr.extracted_text, 15000);
    summary.document_review.ocr.extracted_text_truncated = true;
  }

  return summary;
}

function normaliseMode(value) {
  return value === "detailed" ? "detailed" : "quick";
}

function normaliseRiskLevel(value) {
  const text = String(value || "").toLowerCase();
  if (["low", "moderate", "high"].includes(text)) {
    return text;
  }
  return "not_assessed";
}

function normaliseConfidenceLevel(value) {
  const text = String(value || "").toLowerCase();
  if (["low", "medium", "high"].includes(text)) {
    return text;
  }
  return "not_assessed";
}

function buildQuoteReviewRow(payload) {
  return {
    review_mode: normaliseMode(payload.review_mode),
    customer_name: toText(payload.customer_name, 160),
    phone: toText(payload.phone, 80),
    email: toText(payload.email, 160),
    suburb: toText(payload.suburb, 120),
    postcode: toText(payload.postcode, 20),
    flooring_type: toText(payload.flooring_type, 80),
    area_m2: toNumberOrNull(payload.area_m2),
    uploaded_quote_url: toText(payload.uploaded_quote_url, 1000) || null,
    quote_total: toNumberOrNull(payload.quote_total),
    quote_provider_name: toText(payload.quote_provider_name, 180),
    included_items: toArray(payload.included_items),
    missing_items: toArray(payload.missing_items),
    risk_items: toArray(payload.risk_items),
    clarity_score: toNumberOrNull(payload.clarity_score),
    risk_level: normaliseRiskLevel(payload.risk_level),
    confidence_level: normaliseConfidenceLevel(payload.confidence_level),
    advisor_summary: buildStoredAdvisorSummary(payload),
    next_step_taken: toText(payload.next_step_taken, 120),
    converted_to_quote: !!payload.converted_to_quote,
    linked_quote_lead_id: payload.linked_quote_lead_id || null
  };
}

async function insertQuoteReview(row) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const response = await fetch(config.url + "/rest/v1/" + getSupabaseTables().quoteReviews, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: "Bearer " + config.serviceRoleKey,
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(row)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Quote review insert failed: " + text);
  }

  const rows = await response.json();
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

function getReviewLeadPriority(row) {
  if (row.risk_level === "high") return "high";
  if (Number(row.quote_total || 0) >= 12000) return "high";
  if (row.confidence_level === "low") return "high";
  return "normal";
}

async function safelyRecordQuoteReviewLead(row, inserted) {
  try {
    const reviewId = inserted && inserted.id;
    const mode = row.review_mode === "detailed" ? "uploaded_quote_review" : "quick_check";
    const leadResult = await LeadWriter.createOrUpdateLead({
      primarySource: "quote_review",
      sourceDetail: mode,
      sourceTable: getSupabaseTables().quoteReviews,
      sourceId: reviewId,
      customer: {
        name: row.customer_name,
        email: row.email,
        phone: row.phone
      },
      project: {
        suburb: row.suburb,
        postcode: row.postcode,
        productCategory: row.flooring_type,
        areaM2: row.area_m2
      },
      quote: {
        totalIncGst: row.quote_total,
        confidenceLevel: row.confidence_level,
        missingInfoFlags: row.missing_items,
        riskFlags: row.risk_items
      },
      statuses: {
        status: "Needs review",
        priority: getReviewLeadPriority(row),
        quoteReviewStatus: "saved"
      },
      nextAction: "Review quote comparison and offer Operon comparison quote",
      metadata: {
        review_mode: row.review_mode,
        risk_level: row.risk_level,
        confidence_level: row.confidence_level,
        missing_item_count: Array.isArray(row.missing_items) ? row.missing_items.length : 0,
        risk_item_count: Array.isArray(row.risk_items) ? row.risk_items.length : 0,
        converted_to_quote: Boolean(row.converted_to_quote)
      }
    });

    if (leadResult && leadResult.leadId) {
      await LeadWriter.recordLeadEvent({
        leadId: leadResult.leadId,
        eventType: "quote_review_saved",
        source: "save-quote-review",
        sourceTable: getSupabaseTables().quoteReviews,
        sourceId: reviewId,
        metadata: {
          review_mode: row.review_mode,
          source_detail: mode,
          risk_level: row.risk_level,
          confidence_level: row.confidence_level
        }
      });
    }
  } catch (error) {
    console.warn("Non-blocking lead write failed for quote review", {
      reviewId: inserted && inserted.id || "",
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
    return jsonResponse(event, 405, { error: "Method not allowed" });
  }

  const largeBodyResponse = Security.rejectLargeBody(event, 950 * 1024);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "save-quote-review",
    limit: 30,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit);
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const turnstile = await Security.verifyTurnstile(event, body.turnstileToken || body.turnstile_token || "");
    if (!turnstile.ok) {
      return Security.botChallengeResponse(event, turnstile);
    }
    const payload = body.quoteReviewPayload || body;
    const row = buildQuoteReviewRow(payload);
    const inserted = await insertQuoteReview(row);
    await safelyRecordQuoteReviewLead(row, inserted);
    return jsonResponse(event, 200, {
      ok: true,
      review_id: inserted && inserted.id || null
    });
  } catch (error) {
    console.warn("Quote review save unavailable", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 200, {
      ok: false,
      warning: "Quote review was kept locally. Server save is unavailable.",
      message: "server_save_unavailable"
    });
  }
};
