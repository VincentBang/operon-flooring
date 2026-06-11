"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");

const responseOptions = {
  methods: "GET, POST, OPTIONS",
  allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
};

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, responseOptions);
}

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function sanitizeText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength || 500);
}

function parseLimit(value) {
  const limit = Number(value || 50);
  if (!Number.isFinite(limit)) return 50;
  return Math.max(1, Math.min(100, Math.round(limit)));
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
    throw new Error("Supabase follow-up admin request failed.");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function quoteUuidList(ids) {
  return "(" + ids.map(function (id) {
    return "\"" + String(id).replace(/"/g, "\\\"") + "\"";
  }).join(",") + ")";
}

function safeLeadSummary(row) {
  return {
    id: row.id,
    customer_name: row.customer_name,
    primary_source: row.primary_source,
    source_detail: row.source_detail,
    status: row.status,
    priority: row.priority,
    suburb: row.suburb,
    product_category: row.product_category,
    estimate_total_inc_gst: row.estimate_total_inc_gst,
    last_activity_at: row.last_activity_at,
    next_action: row.next_action
  };
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeMetadata(row) {
  const metadata = row && typeof row.metadata === "object" && !Array.isArray(row.metadata)
    ? row.metadata
    : {};
  return {
    task_type: sanitizeText(metadata.task_type, 80),
    reason: sanitizeText(metadata.reason, 240),
    priority: sanitizeText(metadata.priority, 40),
    suggested_message: sanitizeText(metadata.suggested_message, 420),
    source: sanitizeText(metadata.source, 80),
    source_event_id: sanitizeText(metadata.source_event_id, 80),
    qualification_id: sanitizeText(metadata.qualification_id, 80),
    dry_run_only: metadata.dry_run_only === true
  };
}

function getDueAt(priority) {
  const date = new Date();
  if (priority === "high") {
    date.setHours(date.getHours() + 2);
    return date.toISOString();
  }
  if (priority === "low") {
    date.setDate(date.getDate() + 3);
    date.setHours(9, 0, 0, 0);
    return date.toISOString();
  }
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
}

function normalizeSignal(value) {
  return sanitizeText(value, 80).toLowerCase();
}

function isUnknown(value) {
  return ["", "unknown", "not_sure", "not sure", "skipped", "skip", "unsure"].indexOf(normalizeSignal(value)) >= 0;
}

function isYes(value) {
  return ["yes", "has_quote", "has quote", "has_floorplan", "has floorplan", "uploaded", "true"].indexOf(normalizeSignal(value)) >= 0;
}

function deriveDryRunTask(qualification) {
  const reasons = [];
  let taskType = "review_chatbot_lead";
  let priority = "normal";
  let nextAction = "Review chatbot qualification and check whether the customer completed the handoff.";
  let suggestedMessage = "Review the chatbot summary, then decide whether a manual follow-up is useful.";

  if (qualification.intent === "contact_human") {
    taskType = "priority_contact_follow_up";
    priority = "high";
    reasons.push("Customer asked to contact Operon.");
    nextAction = "Review contact request and follow up manually.";
    suggestedMessage = "Thanks for contacting Operon Flooring. We can help clarify the next step for your flooring project.";
  }

  if (qualification.intent === "start_quote" && qualification.confidence === "high") {
    taskType = taskType === "review_chatbot_lead" ? "quote_intent_follow_up" : taskType;
    reasons.push("High-confidence quote intent from chatbot.");
    nextAction = "Check quote form completion and follow up if contact details are available.";
    suggestedMessage = "I noticed you were starting a flooring quote. If you need help with product, area, stairs or removal details, we can review it with you.";
  }

  if (isUnknown(qualification.product_category)) {
    taskType = "product_guide_follow_up";
    reasons.push("Product category is unknown.");
    nextAction = "Suggest product guide or products page before quote follow-up.";
    suggestedMessage = "If you are not sure which flooring type suits the project, start with hybrid, laminate and engineered timber options before finalising the quote scope.";
  }

  if (isUnknown(qualification.area_status)) {
    taskType = "area_or_floorplan_follow_up";
    reasons.push("Floor area is unknown.");
    nextAction = "Ask for approximate area or a floor plan.";
    suggestedMessage = "If the area is not known yet, a floor plan or rough room measurements can help prepare a clearer flooring estimate.";
  }

  if (isYes(qualification.existing_quote_status)) {
    taskType = "quote_review_follow_up";
    reasons.push("Customer has an existing written quote.");
    nextAction = "Suggest quote-review before comparing or accepting the quote.";
    suggestedMessage = "If you already have a written quote, Operon can review what is clear, what is missing and what questions to ask before comparing.";
  }

  if (isYes(qualification.floorplan_status)) {
    taskType = "floorplan_review_follow_up";
    reasons.push("Customer has a floor plan.");
    nextAction = "Suggest floor plan upload or manual review.";
    suggestedMessage = "A floor plan can help confirm approximate area and make the quote scope easier to review.";
  }

  if (qualification.urgency === "asap") {
    priority = "high";
    reasons.push("Urgency is ASAP.");
  }
  if (qualification.urgency === "just_researching") {
    priority = priority === "high" ? "high" : "low";
    reasons.push("Customer is still researching.");
  }

  if (!reasons.length) {
    reasons.push("Chatbot qualification created a safe lead event.");
  }

  return {
    task_type: taskType,
    priority: priority,
    reason: reasons.join(" "),
    due_at: getDueAt(priority),
    next_action: nextAction,
    suggested_message: suggestedMessage
  };
}

async function listFollowUps(event) {
  const params = new URLSearchParams(event.rawQuery || "");
  const status = sanitizeText(params.get("status") || "open", 40);
  const limit = parseLimit(params.get("limit"));
  const query = {
    select: "id,lead_id,due_at,status,channel,next_action,assigned_to,created_at,updated_at,metadata",
    order: "due_at.asc.nullslast",
    limit: String(limit)
  };
  if (status && status !== "all") {
    query.status = "eq." + status;
  }

  const followUps = await supabaseRequest("operon_follow_ups", { query: query });
  const leadIds = Array.from(new Set((Array.isArray(followUps) ? followUps : [])
    .map(function (item) { return item.lead_id; })
    .filter(isUuid)));
  let leadsById = {};

  if (leadIds.length) {
    const leads = await supabaseRequest("operon_leads", {
      query: {
        id: "in." + quoteUuidList(leadIds),
        select: "id,customer_name,primary_source,source_detail,status,priority,suburb,product_category,estimate_total_inc_gst,last_activity_at,next_action"
      }
    });
    leadsById = (Array.isArray(leads) ? leads : []).reduce(function (accumulator, lead) {
      accumulator[lead.id] = safeLeadSummary(lead);
      return accumulator;
    }, {});
  }

  return {
    ok: true,
    follow_ups: (Array.isArray(followUps) ? followUps : []).map(function (item) {
      return Object.assign({}, item, {
        metadata: safeMetadata(item),
        lead: item.lead_id ? leadsById[item.lead_id] || null : null
      });
    })
  };
}

async function generateDryRunFollowUps(event) {
  const params = new URLSearchParams(event.rawQuery || "");
  const limit = parseLimit(params.get("limit"));
  const qualifications = await supabaseRequest("operon_chatbot_qualifications", {
    query: {
      select: "id,lead_id,event_id,created_at,source_page,intent,suburb,property_type,product_category,area_status,stairs_status,removal_status,floorplan_status,existing_quote_status,urgency,next_action,handoff_url,missing_info,confidence",
      order: "created_at.desc",
      limit: String(limit)
    }
  });
  const rows = Array.isArray(qualifications) ? qualifications : [];
  const leadIds = Array.from(new Set(rows.map(function (row) { return row.lead_id; }).filter(isUuid)));

  if (!leadIds.length) {
    return {
      ok: true,
      created: 0,
      skipped: rows.length,
      reason: "No chatbot qualifications with lead_id were available."
    };
  }

  const existingRows = await supabaseRequest("operon_follow_ups", {
    query: {
      lead_id: "in." + quoteUuidList(leadIds),
      select: "id,lead_id,metadata",
      limit: "500"
    }
  });
  const existingKeys = new Set((Array.isArray(existingRows) ? existingRows : []).map(function (row) {
    const metadata = row && typeof row.metadata === "object" && !Array.isArray(row.metadata) ? row.metadata : {};
    return String(metadata.qualification_id || metadata.source_event_id || "");
  }).filter(Boolean));

  const inserts = [];
  let skipped = 0;
  rows.forEach(function (qualification) {
    if (!isUuid(qualification.lead_id)) {
      skipped += 1;
      return;
    }
    const key = String(qualification.id || qualification.event_id || "");
    if (key && existingKeys.has(key)) {
      skipped += 1;
      return;
    }
    const task = deriveDryRunTask(qualification);
    inserts.push({
      lead_id: qualification.lead_id,
      due_at: task.due_at,
      status: "open",
      channel: "manual",
      next_action: task.next_action,
      assigned_to: "operator",
      metadata: {
        dry_run_only: true,
        source: "chatbot_qualification",
        qualification_id: qualification.id,
        source_event_id: qualification.event_id,
        task_type: task.task_type,
        reason: task.reason,
        priority: task.priority,
        suggested_message: task.suggested_message,
        source_page: qualification.source_page,
        handoff_url: qualification.handoff_url,
        missing_info: toArray(qualification.missing_info).slice(0, 12)
      }
    });
    if (key) existingKeys.add(key);
  });

  if (inserts.length) {
    await supabaseRequest("operon_follow_ups", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: inserts
    });
  }

  return {
    ok: true,
    created: inserts.length,
    skipped: skipped,
    dry_run_only: true
  };
}

async function insertFollowUpEvent(leadId, eventType, metadata) {
  await supabaseRequest("operon_lead_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: {
      lead_id: leadId,
      event_type: eventType,
      source: "admin",
      source_table: "operon_follow_ups",
      customer_safe: false,
      metadata: metadata || {}
    }
  });
}

async function updateFollowUp(body) {
  const action = sanitizeText(body.action, 60);
  const followUpId = String(body.follow_up_id || body.followUpId || "").trim();
  const leadId = String(body.lead_id || body.leadId || "").trim();
  const allowedActions = ["mark_done", "cancel", "archive", "snooze", "update_next_action"];

  if (allowedActions.indexOf(action) < 0) {
    return { status: 400, payload: { ok: false, error: "Unknown follow-up action." } };
  }
  if (!isUuid(followUpId)) {
    return { status: 400, payload: { ok: false, error: "A valid follow_up_id is required." } };
  }
  if (!isUuid(leadId)) {
    return { status: 400, payload: { ok: false, error: "A valid lead_id is required." } };
  }

  const patch = { updated_at: new Date().toISOString() };
  let eventType = "follow_up_updated";

  if (action === "mark_done") {
    patch.status = "done";
    eventType = "follow_up_done";
  }
  if (action === "cancel") {
    patch.status = "cancelled";
    eventType = "follow_up_cancelled";
  }
  if (action === "archive") {
    patch.status = "cancelled";
    eventType = "follow_up_archived";
  }
  if (action === "snooze") {
    const dueAt = new Date(String(body.due_at || body.dueAt || ""));
    if (Number.isNaN(dueAt.getTime())) {
      return { status: 400, payload: { ok: false, error: "A valid due_at is required." } };
    }
    patch.status = "snoozed";
    patch.due_at = dueAt.toISOString();
    eventType = "follow_up_snoozed";
  }
  if (action === "update_next_action") {
    const nextAction = sanitizeText(body.next_action || body.nextAction, 220);
    if (!nextAction) {
      return { status: 400, payload: { ok: false, error: "next_action is required." } };
    }
    patch.next_action = nextAction;
    eventType = "follow_up_next_action_updated";
  }

  await supabaseRequest("operon_follow_ups", {
    method: "PATCH",
    query: { id: "eq." + followUpId, lead_id: "eq." + leadId },
    headers: { Prefer: "return=minimal" },
    body: patch
  });
  await insertFollowUpEvent(leadId, eventType, {
    follow_up_id: followUpId,
    action: action
  });

  return { status: 200, payload: { ok: true } };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, responseOptions);
  }

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "lead-followup-admin",
    limit: 120,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit, responseOptions);
  }

  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) {
    return jsonResponse(event, admin.status, { ok: false, error: admin.error });
  }

  try {
    if (event.httpMethod === "GET") {
      return jsonResponse(event, 200, await listFollowUps(event));
    }

    if (event.httpMethod !== "POST") {
      return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
    }

    const largeBodyResponse = Security.rejectLargeBody(event, 24 * 1024, responseOptions);
    if (largeBodyResponse) return largeBodyResponse;

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (error) {
      return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
    }

    if (sanitizeText(body.action, 60) === "generate_dry_run") {
      return jsonResponse(event, 200, await generateDryRunFollowUps(event));
    }

    const result = await updateFollowUp(body);
    return jsonResponse(event, result.status, result.payload);
  } catch (error) {
    console.warn("Lead follow-up admin request failed", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 500, {
      ok: false,
      error: Security.safePublicError("Lead follow-up admin request failed.")
    });
  }
};

exports._test = {
  isUuid: isUuid,
  sanitizeText: sanitizeText,
  parseLimit: parseLimit,
  deriveDryRunTask: deriveDryRunTask
};
