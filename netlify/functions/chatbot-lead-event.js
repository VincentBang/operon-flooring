"use strict";

const Security = require("./_security");
const LeadWriter = require("./shared/leadWriter");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "POST, OPTIONS",
    allowHeaders: "content-type"
  });
}

function toText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength || 160);
}

function normaliseChoice(value, allowed, fallback) {
  const text = toText(value, 80);
  return allowed.indexOf(text) >= 0 ? text : fallback;
}

function normaliseIntent(value) {
  return normaliseChoice(value, [
    "start_quote",
    "existing_quote_review",
    "product_help",
    "floorplan_help",
    "price_question",
    "stairs_removal_scope",
    "suburb_service",
    "contact_human",
    "general_question",
    "quote_review_result_explanation",
    "quick_quote_completeness",
    "document_quote_review"
  ], "general_question");
}

function normaliseEventType(value) {
  return normaliseChoice(value, [
    "chatbot_handoff",
    "chatbot_quote_prequalification_completed",
    "chatbot_quote_review_handoff",
    "chatbot_products_handoff",
    "chatbot_floorplan_handoff",
    "chatbot_contact_handoff"
  ], "chatbot_handoff");
}

function normaliseDeviceType(value) {
  return normaliseChoice(value, ["desktop", "tablet", "mobile", "unknown"], "unknown");
}

function normaliseHandoffPath(value) {
  const text = toText(value, 300);
  if (/^\/(quote|products|quote-review|floorplan|contact)\.html(?:[?#][^<>"']*)?$/i.test(text)) {
    return text;
  }
  return "";
}

function eventTypeForHandoff(eventType, handoffPath) {
  if (eventType !== "chatbot_handoff") {
    return eventType;
  }
  if (handoffPath.indexOf("/quote-review.html") === 0) return "chatbot_quote_review_handoff";
  if (handoffPath.indexOf("/products.html") === 0) return "chatbot_products_handoff";
  if (handoffPath.indexOf("/floorplan.html") === 0) return "chatbot_floorplan_handoff";
  if (handoffPath.indexOf("/contact.html") === 0) return "chatbot_contact_handoff";
  return eventType;
}

function normaliseSessionId(value) {
  const text = toText(value, 100);
  return /^chat_[a-z0-9_-]{8,90}$/i.test(text) ? text : "";
}

function normaliseUuid(value) {
  const text = toText(value, 80);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text) ? text : "";
}

function isUnsafeFreeText(value) {
  const text = String(value || "");
  return text.length > 140
    || /[\r\n]/.test(text)
    || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
    || /\b(?:\+?61|0)[2-478](?:[\s-]?\d){8}\b/.test(text)
    || /\$\s*\d|\btotal\b|\binc\s*gst\b|\bex\s*gst\b|\bquote\s*(?:no|number|total)\b|\bsupplier\b|\bmargin\b|\brate\b|\bfile_path\b|\bstorage_bucket\b/i.test(text);
}

function normaliseMissingInfo(value) {
  return (Array.isArray(value) ? value : [])
    .map(function (item) {
      return toText(item, 120);
    })
    .filter(function (item) {
      return item && !isUnsafeFreeText(item);
    })
    .slice(0, 14);
}

function normaliseSummary(input) {
  const summary = input && typeof input === "object" ? input : {};
  const productCategory = normaliseChoice(summary.product_category, ["hybrid", "laminate", "engineered", "not_sure", "skipped"], "not_sure");
  const propertyType = normaliseChoice(summary.property_type, ["house", "townhouse", "unit_apartment", "commercial_other", "not_sure", "skipped"], "not_sure");
  const areaStatus = /^known(?::\d+(\.\d+)?)?$/.test(toText(summary.area_status, 80))
    ? toText(summary.area_status, 80)
    : normaliseChoice(summary.area_status, ["not_sure", "skipped"], "not_sure");
  const yesNoUnsure = ["yes", "no", "not_sure", "skipped"];

  return {
    intent: "start_quote",
    suburb: toText(summary.suburb, 80),
    property_type: propertyType,
    product_category: productCategory,
    area_status: areaStatus,
    stairs_status: normaliseChoice(summary.stairs_status, yesNoUnsure, "not_sure"),
    removal_status: normaliseChoice(summary.removal_status, yesNoUnsure, "not_sure"),
    existing_quote_status: normaliseChoice(summary.existing_quote_status, yesNoUnsure, "not_sure"),
    floorplan_status: normaliseChoice(summary.floorplan_status, yesNoUnsure, "not_sure"),
    next_action: "start_quote_form"
  };
}

function normaliseLeadSummary(input, fallbackIntent) {
  const summary = normaliseSummary(input);
  summary.intent = normaliseIntent(summary.intent || fallbackIntent);
  return summary;
}

function areaM2FromStatus(areaStatus) {
  if (!/^known:\d+(\.\d+)?$/.test(areaStatus || "")) {
    return null;
  }
  const value = Number(String(areaStatus).replace("known:", ""));
  return Number.isFinite(value) && value > 0 ? value : null;
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

  const largeBodyResponse = Security.rejectLargeBody(event, 40 * 1024);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "chatbot-lead-event",
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

  const requestedEventType = normaliseEventType(body.eventType);
  const intent = normaliseIntent(body.intent || (body.summary && body.summary.intent));
  const summary = normaliseLeadSummary(body.leadSummary || body.summary, intent);
  const pageKey = toText(body.sourcePageKey || body.pageKey, 80);
  const sourcePage = toText(body.sourcePage, 180);
  const handoffPath = normaliseHandoffPath(body.handoffPath || body.routeHref);
  const eventType = eventTypeForHandoff(requestedEventType, handoffPath);
  const chatbotSessionId = normaliseSessionId(body.chatbotSessionId || body.sessionId);
  const deviceType = normaliseDeviceType(body.deviceType);
  const missingInfo = normaliseMissingInfo(body.missingInfo);
  const nextAction = toText(body.nextAction || summary.next_action || "Review chatbot handoff", 180);
  const createdAt = toText(body.timestamp, 80);
  const linkedLeadId = normaliseUuid(body.linkedLead && body.linkedLead.leadId || body.linkedLeadId);

  try {
    const leadResult = await LeadWriter.createOrUpdateLead({
      primarySource: "chatbot",
      sourceDetail: eventType === "chatbot_quote_prequalification_completed" ? "quote_prequalification" : "route_handoff",
      project: {
        suburb: summary.suburb,
        productCategory: summary.product_category === "not_sure" || summary.product_category === "skipped" ? "" : summary.product_category,
        areaM2: areaM2FromStatus(summary.area_status)
      },
      statuses: {
        status: "Waiting customer",
        priority: "normal",
        contactStatus: "none",
        quoteReviewStatus: intent === "existing_quote_review" || handoffPath.indexOf("/quote-review.html") === 0
          ? "chatbot_handoff"
          : (summary.existing_quote_status === "yes" ? "customer_has_written_quote" : "none"),
        floorplanStatus: intent === "floorplan_help" || handoffPath.indexOf("/floorplan.html") === 0
          ? "chatbot_handoff"
          : (summary.floorplan_status === "yes" ? "customer_has_floorplan" : "none"),
        followUpStatus: "none"
      },
      quote: {
        missingInfoFlags: missingInfo
      },
      nextAction: nextAction,
      metadata: {
        chatbot_session_id: chatbotSessionId,
        intent: summary.intent,
        selected_intent: intent,
        page_key: pageKey,
        source_page: sourcePage,
        handoff_path: handoffPath,
        device_type: deviceType,
        client_timestamp: createdAt,
        property_type: summary.property_type,
        area_status: summary.area_status,
        stairs_status: summary.stairs_status,
        removal_status: summary.removal_status,
        existing_quote_status: summary.existing_quote_status,
        floorplan_status: summary.floorplan_status,
        missing_info: missingInfo,
        next_action: nextAction,
        linked_lead_id: linkedLeadId || null
      }
    });

    if (leadResult && leadResult.leadId) {
      await LeadWriter.recordLeadEvent({
        leadId: leadResult.leadId,
        eventType: eventType,
        source: "chatbot-lead-event",
        metadata: {
          chatbot_session_id: chatbotSessionId,
          page_key: pageKey,
          source_page: sourcePage,
          handoff_path: handoffPath,
          device_type: deviceType,
          client_timestamp: createdAt,
          intent: summary.intent,
          selected_intent: intent,
          suburb_present: Boolean(summary.suburb),
          product_category: summary.product_category,
          area_status: summary.area_status,
          stairs_status: summary.stairs_status,
          removal_status: summary.removal_status,
          existing_quote_status: summary.existing_quote_status,
          floorplan_status: summary.floorplan_status,
          missing_info: missingInfo,
          next_action: nextAction,
          linked_lead_id: linkedLeadId || null
        }
      });
    }

    return jsonResponse(event, 200, {
      ok: true,
      stored: Boolean(leadResult && leadResult.leadId)
    });
  } catch (error) {
    return jsonResponse(event, 200, {
      ok: true,
      stored: false
    });
  }
};
