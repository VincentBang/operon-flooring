"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");

const STATUS_OPTIONS = [
  "New",
  "Needs review",
  "Waiting customer",
  "Quote sent",
  "Site measure booked",
  "Won",
  "Lost",
  "Archived"
];

const responseOptions = {
  methods: "POST, OPTIONS",
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

function sanitizeReason(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 500);
}

function validatePayload(body) {
  const leadId = String(body.lead_id || body.leadId || "").trim();
  const status = String(body.status || "").trim();
  const reason = sanitizeReason(body.reason);

  if (!isUuid(leadId)) {
    return { ok: false, status: 400, error: "A valid lead_id is required." };
  }
  if (STATUS_OPTIONS.indexOf(status) < 0) {
    return { ok: false, status: 400, error: "A valid lead status is required." };
  }

  return {
    ok: true,
    leadId: leadId,
    status: status,
    reason: reason
  };
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
    throw new Error("Supabase lead status write failed.");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function updateLeadStatus(payload) {
  const existingRows = await supabaseRequest("operon_leads", {
    query: {
      id: "eq." + payload.leadId,
      select: "id,status",
      limit: "1"
    }
  });
  const existingLead = Array.isArray(existingRows) ? existingRows[0] || null : null;
  if (!existingLead) {
    return { ok: false, status: 404, payload: { ok: false, error: "Lead not found." } };
  }

  const now = new Date().toISOString();
  const updatedRows = await supabaseRequest("operon_leads", {
    method: "PATCH",
    query: { id: "eq." + payload.leadId },
    headers: { Prefer: "return=representation" },
    body: {
      status: payload.status,
      updated_at: now,
      last_activity_at: now
    }
  });
  const updatedLead = Array.isArray(updatedRows) ? updatedRows[0] || null : null;

  await supabaseRequest("operon_lead_status_history", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: {
      lead_id: payload.leadId,
      from_status: existingLead.status || null,
      to_status: payload.status,
      changed_by: "admin",
      reason: payload.reason || null,
      metadata: {}
    }
  });

  await supabaseRequest("operon_lead_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: {
      lead_id: payload.leadId,
      event_type: "lead_status_changed",
      source: "admin",
      source_table: "operon_leads",
      source_id: payload.leadId,
      customer_safe: false,
      metadata: {
        from_status: existingLead.status || null,
        to_status: payload.status,
        reason: payload.reason || null
      }
    }
  });

  return {
    ok: true,
    status: 200,
    payload: {
      ok: true,
      lead: {
        id: payload.leadId,
        status: updatedLead && updatedLead.status || payload.status,
        last_activity_at: updatedLead && updatedLead.last_activity_at || now
      }
    }
  };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, responseOptions);
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "lead-status-admin",
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

  const largeBodyResponse = Security.rejectLargeBody(event, 24 * 1024, responseOptions);
  if (largeBodyResponse) return largeBodyResponse;

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
  }

  const validated = validatePayload(body);
  if (!validated.ok) {
    return jsonResponse(event, validated.status, { ok: false, error: validated.error });
  }

  try {
    const result = await updateLeadStatus(validated);
    return jsonResponse(event, result.status, result.payload);
  } catch (error) {
    console.warn("Lead status admin request failed", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 500, {
      ok: false,
      error: Security.safePublicError("Lead status admin request failed.")
    });
  }
};

exports._test = {
  STATUS_OPTIONS: STATUS_OPTIONS,
  validatePayload: validatePayload,
  sanitizeReason: sanitizeReason
};
