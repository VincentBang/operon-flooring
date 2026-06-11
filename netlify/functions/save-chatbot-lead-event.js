"use strict";

const Security = require("./_security");
const LeadWriter = require("./shared/leadWriter");

const LEAD_EVENTS_TABLE = "operon_lead_events";
const CHATBOT_QUALIFICATIONS_TABLE = "operon_chatbot_qualifications";

const ALLOWED_FIELDS = new Set([
  "chatbot_session_id",
  "source_page",
  "source_url",
  "intent",
  "suburb",
  "property_type",
  "product_category",
  "area_status",
  "approx_area_m2",
  "stairs_status",
  "removal_status",
  "floorplan_status",
  "existing_quote_status",
  "urgency",
  "next_action",
  "handoff_url",
  "missing_info",
  "confidence",
  "event_type",
  "device_type",
  "page_key",
  "timestamp"
]);

const INTENTS = new Set([
  "start_quote",
  "existing_quote_review",
  "product_help",
  "floorplan_help",
  "price_question",
  "stairs_removal_scope",
  "suburb_service",
  "contact_human",
  "general_question"
]);
const PROPERTY_TYPES = new Set(["house", "townhouse", "apartment", "unit_apartment", "commercial", "commercial_other", "not_sure", "skipped"]);
const PRODUCT_CATEGORIES = new Set(["hybrid", "laminate", "engineered", "engineered_timber", "timber", "not_sure", "skipped"]);
const AREA_STATUSES = new Set(["known", "unknown", "not_sure", "skipped"]);
const YES_NO_UNSURE = new Set(["yes", "no", "not_sure", "skipped"]);
const URGENCIES = new Set(["now", "soon", "planning", "flexible", "not_sure", "skipped"]);
const CONFIDENCES = new Set(["low", "medium", "high", "unknown"]);
const DEVICE_TYPES = new Set(["desktop", "tablet", "mobile", "unknown"]);
const EVENT_TYPES = new Set([
  "chatbot_qualified",
  "chatbot_handoff",
  "chatbot_quote_prequalification_completed",
  "chatbot_quote_handoff",
  "chatbot_quote_review_handoff",
  "chatbot_products_handoff",
  "chatbot_floorplan_handoff",
  "chatbot_contact_handoff"
]);

const FORBIDDEN_KEY_PATTERN = /(transcript|conversation|messages|raw[_-]?(quote|ocr|text)|quote[_-]?text|ocr[_-]?(text|result)|extracted[_-]?text|upload(ed)?[_-]?(file|content|data)|file[_-]?(content|data|path)|storage[_-]?(bucket|path)|signed[_-]?url|public[_-]?url|pricing|price[_-]?rule|rate|rates|margin|markup|supplier[_-]?cost|internal|secret|token|service[_-]?role|api[_-]?key)/i;
const FORBIDDEN_TEXT_PATTERN = /(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|\b(?:\+?61|0)[2-478](?:[\s-]?\d){8}\b|\$\s*\d|\braw quote\b|\bocr text\b|\bsupplier cost\b|\bmargin\b|\binternal rate\b|\bpricing rule\b)/i;

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

function toText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength || 160);
}

function hasForbiddenShape(value, path) {
  if (Array.isArray(value)) {
    return value.some(function (entry, index) {
      return hasForbiddenShape(entry, path + "." + index);
    });
  }
  if (value && typeof value === "object") {
    return Object.keys(value).some(function (key) {
      return FORBIDDEN_KEY_PATTERN.test(key) || hasForbiddenShape(value[key], path + "." + key);
    });
  }
  if (typeof value === "string") {
    return FORBIDDEN_TEXT_PATTERN.test(value);
  }
  return false;
}

function assertOnlyAllowedFields(body) {
  const keys = Object.keys(body || {});
  const unknown = keys.filter(function (key) {
    return !ALLOWED_FIELDS.has(key);
  });
  if (unknown.length) {
    throw new Error("Unsupported field: " + unknown[0]);
  }
  if (hasForbiddenShape(body, "body")) {
    throw new Error("Payload includes unsupported sensitive data.");
  }
}

function normaliseEnum(value, allowed, fallback, fieldName, required) {
  const text = toText(value, 80);
  if (!text && !required) return fallback || "";
  if (allowed.has(text)) return text;
  throw new Error("Invalid " + fieldName + ".");
}

function normaliseAreaStatus(body) {
  const raw = toText(body.area_status, 80);
  const area = toNumberOrNull(body.approx_area_m2);
  if (/^known:\d+(\.\d+)?$/.test(raw)) {
    return {
      areaStatus: "known",
      approxAreaM2: toNumberOrNull(raw.replace("known:", "")) || area
    };
  }
  if (AREA_STATUSES.has(raw)) {
    return { areaStatus: raw, approxAreaM2: area };
  }
  if (!raw) {
    return { areaStatus: area ? "known" : "not_sure", approxAreaM2: area };
  }
  throw new Error("Invalid area_status.");
}

function toNumberOrNull(value) {
  if (value === "" || value === null || typeof value === "undefined") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 10000) return null;
  return number;
}

function normaliseSessionId(value) {
  const text = toText(value, 100);
  return /^chat_[a-z0-9_-]{8,90}$/i.test(text) ? text : "";
}

function normalisePath(value, maxLength) {
  const text = toText(value, maxLength || 400);
  if (!text) return "";
  try {
    const url = new URL(text, "https://operonflooring.com.au");
    const path = url.pathname + url.search + url.hash;
    if (/^\/(?:quote|products|quote-review|floorplan|contact|blog|flooring-[a-z0-9-]+|[a-z0-9-]+\.html|)(?:[/?#][^<>"']*)?$/i.test(path)) {
      return path.slice(0, maxLength || 400);
    }
  } catch (error) {
    return "";
  }
  return "";
}

function normaliseSourceUrl(value) {
  const text = toText(value, 500);
  if (!text) return "";
  try {
    const url = new URL(text, "https://operonflooring.com.au");
    if (url.hostname !== "operonflooring.com.au" && url.hostname !== "www.operonflooring.com.au") {
      return "";
    }
    return (url.pathname + url.search + url.hash).slice(0, 500);
  } catch (error) {
    return "";
  }
}

function normaliseMissingInfo(value) {
  return (Array.isArray(value) ? value : [])
    .map(function (item) {
      return toText(item, 120);
    })
    .filter(Boolean)
    .filter(function (item) {
      return !FORBIDDEN_TEXT_PATTERN.test(item);
    })
    .slice(0, 14);
}

function getNextAction(body, intent, handoffUrl) {
  const requested = toText(body.next_action, 160);
  if (requested) return requested;
  if (intent === "existing_quote_review") return "review_existing_quote";
  if (intent === "product_help") return "choose_product";
  if (intent === "floorplan_help") return "upload_floorplan";
  if (intent === "contact_human") return "review_contact_request";
  if (handoffUrl.indexOf("/quote.html") === 0) return "start_quote_form";
  return "review_chatbot_handoff";
}

function normalisePayload(body) {
  assertOnlyAllowedFields(body);
  const area = normaliseAreaStatus(body);
  const intent = normaliseEnum(body.intent || "general_question", INTENTS, "general_question", "intent", true);
  const handoffUrl = normalisePath(body.handoff_url, 400);
  const sourcePage = normalisePath(body.source_page, 220) || "/";
  const nextAction = getNextAction(body, intent, handoffUrl);

  return {
    chatbotSessionId: normaliseSessionId(body.chatbot_session_id),
    sourcePage: sourcePage,
    sourceUrl: normaliseSourceUrl(body.source_url),
    eventType: normaliseEnum(body.event_type || "chatbot_qualified", EVENT_TYPES, "chatbot_qualified", "event_type", false),
    intent: intent,
    suburb: toText(body.suburb, 80),
    propertyType: normaliseEnum(body.property_type || "not_sure", PROPERTY_TYPES, "not_sure", "property_type", false),
    productCategory: normaliseEnum(body.product_category || "not_sure", PRODUCT_CATEGORIES, "not_sure", "product_category", false),
    areaStatus: area.areaStatus,
    approxAreaM2: area.approxAreaM2,
    stairsStatus: normaliseEnum(body.stairs_status || "not_sure", YES_NO_UNSURE, "not_sure", "stairs_status", false),
    removalStatus: normaliseEnum(body.removal_status || "not_sure", YES_NO_UNSURE, "not_sure", "removal_status", false),
    floorplanStatus: normaliseEnum(body.floorplan_status || "not_sure", YES_NO_UNSURE, "not_sure", "floorplan_status", false),
    existingQuoteStatus: normaliseEnum(body.existing_quote_status || "not_sure", YES_NO_UNSURE, "not_sure", "existing_quote_status", false),
    urgency: normaliseEnum(body.urgency || "not_sure", URGENCIES, "not_sure", "urgency", false),
    nextAction: nextAction,
    handoffUrl: handoffUrl,
    missingInfo: normaliseMissingInfo(body.missing_info),
    confidence: normaliseEnum(body.confidence || "unknown", CONFIDENCES, "unknown", "confidence", false),
    deviceType: normaliseEnum(body.device_type || "unknown", DEVICE_TYPES, "unknown", "device_type", false),
    pageKey: toText(body.page_key, 80),
    timestamp: toText(body.timestamp, 80)
  };
}

function getLeadStatus(payload) {
  if (payload.intent === "contact_human") return "New";
  return "Waiting customer";
}

function getLeadPriority(payload) {
  if (payload.intent === "contact_human" && payload.urgency === "now") return "high";
  if (payload.intent === "start_quote" && payload.confidence === "high") return "normal";
  return "normal";
}

function getSourceDetail(payload) {
  if (payload.eventType === "chatbot_quote_prequalification_completed" || payload.intent === "start_quote") {
    return "quote_prequalification";
  }
  if (payload.intent === "existing_quote_review") return "quote_review_handoff";
  if (payload.intent === "product_help") return "product_handoff";
  if (payload.intent === "floorplan_help") return "floorplan_handoff";
  if (payload.intent === "contact_human") return "contact_handoff";
  return "chatbot_qualification";
}

function getQuoteReviewStatus(payload) {
  if (payload.intent === "existing_quote_review" || payload.existingQuoteStatus === "yes") return "chatbot_handoff";
  return "none";
}

function getFloorplanStatus(payload) {
  if (payload.intent === "floorplan_help" || payload.floorplanStatus === "yes") return "chatbot_handoff";
  return "none";
}

function getFollowUpStatus(payload) {
  return payload.intent === "contact_human" ? "manual_needed" : "none";
}

function eventTypeForPayload(payload) {
  if (payload.eventType !== "chatbot_handoff") return payload.eventType;
  if (payload.handoffUrl.indexOf("/quote-review.html") === 0) return "chatbot_quote_review_handoff";
  if (payload.handoffUrl.indexOf("/products.html") === 0) return "chatbot_products_handoff";
  if (payload.handoffUrl.indexOf("/floorplan.html") === 0) return "chatbot_floorplan_handoff";
  if (payload.handoffUrl.indexOf("/contact.html") === 0) return "chatbot_contact_handoff";
  if (payload.handoffUrl.indexOf("/quote.html") === 0) return "chatbot_quote_handoff";
  return "chatbot_qualified";
}

async function supabaseRequest(path, options) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }
  const settings = Object.assign({
    method: "GET",
    body: null,
    headers: {}
  }, options || {});
  const response = await fetch(config.url + "/rest/v1/" + path, {
    method: settings.method,
    headers: Object.assign({
      apikey: config.serviceRoleKey,
      Authorization: "Bearer " + config.serviceRoleKey,
      Accept: "application/json"
    }, settings.headers || {}),
    body: settings.body === null || typeof settings.body === "undefined" ? undefined : JSON.stringify(settings.body)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("Supabase chatbot lead request failed: " + text.slice(0, 300));
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function insertLeadEvent(payload, leadId) {
  const rows = await supabaseRequest(LEAD_EVENTS_TABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: {
      lead_id: leadId,
      event_type: eventTypeForPayload(payload),
      source: "save-chatbot-lead-event",
      customer_safe: true,
      metadata: LeadWriter.toSafeJsonObject({
        chatbot_session_id: payload.chatbotSessionId,
        page_key: payload.pageKey,
        source_page: payload.sourcePage,
        source_url: payload.sourceUrl,
        handoff_url: payload.handoffUrl,
        device_type: payload.deviceType,
        client_timestamp: payload.timestamp,
        intent: payload.intent,
        suburb_present: Boolean(payload.suburb),
        product_category: payload.productCategory,
        area_status: payload.areaStatus,
        stairs_status: payload.stairsStatus,
        removal_status: payload.removalStatus,
        existing_quote_status: payload.existingQuoteStatus,
        floorplan_status: payload.floorplanStatus,
        urgency: payload.urgency,
        missing_info: payload.missingInfo,
        confidence: payload.confidence,
        next_action: payload.nextAction
      })
    }
  });
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function insertQualification(payload, leadId, eventId) {
  const rows = await supabaseRequest(CHATBOT_QUALIFICATIONS_TABLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: {
      lead_id: leadId,
      event_id: eventId || null,
      chatbot_session_id: payload.chatbotSessionId || null,
      source_page: payload.sourcePage || null,
      source_url: payload.sourceUrl || null,
      intent: payload.intent,
      suburb: payload.suburb || null,
      property_type: payload.propertyType || null,
      product_category: payload.productCategory || null,
      area_status: payload.areaStatus || null,
      approx_area_m2: payload.approxAreaM2,
      stairs_status: payload.stairsStatus || null,
      removal_status: payload.removalStatus || null,
      floorplan_status: payload.floorplanStatus || null,
      existing_quote_status: payload.existingQuoteStatus || null,
      urgency: payload.urgency || null,
      next_action: payload.nextAction || null,
      handoff_url: payload.handoffUrl || null,
      missing_info: payload.missingInfo,
      confidence: payload.confidence || null,
      metadata: LeadWriter.toSafeJsonObject({
        page_key: payload.pageKey,
        device_type: payload.deviceType,
        event_type: eventTypeForPayload(payload),
        client_timestamp: payload.timestamp
      })
    }
  });
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
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

  const largeBodyResponse = Security.rejectLargeBody(event, 24 * 1024);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "save-chatbot-lead-event",
    limit: 30,
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

  let payload;
  try {
    payload = normalisePayload(body);
  } catch (error) {
    return jsonResponse(event, 400, {
      ok: false,
      error: error && error.message ? error.message : "Invalid chatbot lead event."
    });
  }

  try {
    const leadResult = await LeadWriter.createOrUpdateLead({
      primarySource: "chatbot",
      sourceDetail: getSourceDetail(payload),
      project: {
        suburb: payload.suburb,
        productCategory: payload.productCategory === "not_sure" || payload.productCategory === "skipped" ? "" : payload.productCategory,
        areaM2: payload.approxAreaM2
      },
      statuses: {
        status: getLeadStatus(payload),
        priority: getLeadPriority(payload),
        quoteReviewStatus: getQuoteReviewStatus(payload),
        floorplanStatus: getFloorplanStatus(payload),
        contactStatus: "none",
        followUpStatus: getFollowUpStatus(payload)
      },
      quote: {
        confidenceLevel: payload.confidence,
        missingInfoFlags: payload.missingInfo
      },
      nextAction: payload.nextAction,
      metadata: {
        chatbot_session_id: payload.chatbotSessionId,
        intent: payload.intent,
        page_key: payload.pageKey,
        source_page: payload.sourcePage,
        source_url: payload.sourceUrl,
        handoff_url: payload.handoffUrl,
        device_type: payload.deviceType,
        area_status: payload.areaStatus,
        stairs_status: payload.stairsStatus,
        removal_status: payload.removalStatus,
        existing_quote_status: payload.existingQuoteStatus,
        floorplan_status: payload.floorplanStatus,
        urgency: payload.urgency,
        confidence: payload.confidence
      }
    });

    if (!leadResult || !leadResult.leadId) {
      throw new Error("Lead write failed.");
    }

    const leadEvent = await insertLeadEvent(payload, leadResult.leadId);
    try {
      await insertQualification(payload, leadResult.leadId, leadEvent && leadEvent.id);
    } catch (error) {
      // Additive table rollout should not block lead/event capture or customer
      // handoff if the migration has not been applied to the target database yet.
      console.warn("Non-blocking chatbot qualification write failed", {
        leadId: leadResult.leadId,
        reason: Security.safeLogReason(error)
      });
    }

    return jsonResponse(event, 200, {
      ok: true,
      event_id: leadEvent && leadEvent.id || null,
      lead_id: leadResult.leadId,
      next_action: payload.nextAction
    });
  } catch (error) {
    console.warn("Chatbot lead event write failed", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 500, {
      ok: false,
      error: "Chatbot lead event could not be saved."
    });
  }
};
