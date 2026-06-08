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

async function listFollowUps(event) {
  const params = new URLSearchParams(event.rawQuery || "");
  const status = sanitizeText(params.get("status") || "open", 40);
  const limit = parseLimit(params.get("limit"));
  const query = {
    select: "id,lead_id,due_at,status,channel,next_action,assigned_to,created_at,updated_at",
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
        lead: item.lead_id ? leadsById[item.lead_id] || null : null
      });
    })
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
  const allowedActions = ["mark_done", "cancel", "snooze", "update_next_action"];

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
  parseLimit: parseLimit
};
