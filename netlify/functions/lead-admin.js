"use strict";

const { getSupabaseTables } = require("./_supabaseTables");
const Security = require("./_security");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "GET, POST, OPTIONS",
    allowHeaders: "authorization, content-type, x-operon-admin-token"
  });
}

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || "";
  return { url: url, serviceRoleKey: serviceRoleKey };
}

function getAdminToken(event) {
  const headers = event.headers || {};
  const headerToken = headers["x-operon-admin-token"] || headers["X-Operon-Admin-Token"] || "";
  const auth = headers.authorization || headers.Authorization || "";
  if (headerToken) return String(headerToken).trim();
  if (/^Bearer\s+/i.test(auth)) return String(auth).replace(/^Bearer\s+/i, "").trim();
  return "";
}

function requireAdmin(event) {
  const expectedToken = process.env.OPERON_ADMIN_TOKEN || process.env.OPERON_LEAD_ADMIN_TOKEN || "";
  if (!expectedToken) {
    return { ok: false, status: 503, error: "Lead admin is not configured. Add OPERON_ADMIN_TOKEN in Netlify." };
  }
  if (getAdminToken(event) !== expectedToken) {
    return { ok: false, status: 401, error: "Admin token required." };
  }
  return { ok: true };
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
    const text = await response.text();
    throw new Error("Supabase request failed for " + path + ": " + text);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function parseLimit(value) {
  const limit = Number(value || 50);
  if (!Number.isFinite(limit)) return 50;
  return Math.max(1, Math.min(150, Math.round(limit)));
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getPriorityForStatus(status, fallback) {
  if (status === "Site confirmation eligible" || status === "Site confirmation booked") return "A";
  if (status === "Manual review required") return "D";
  if (status === "Low priority" || status === "Lost") return "C";
  return fallback || "B";
}

function getNextActionForStatus(status, fallback) {
  if (status === "Site confirmation booked" || status === "Site confirmation eligible") return "book site confirmation";
  if (status === "Needs missing info") return "request missing information";
  if (status === "Manual review required") return "founder review";
  if (status === "Low priority") return "mark low priority";
  if (status === "Remote estimate sent" || status === "Quoted") return "send estimate explanation";
  return fallback || "call customer";
}

async function listLeads(event) {
  const tables = getSupabaseTables();
  const params = new URLSearchParams(event.rawQuery || "");
  const limit = parseLimit(params.get("limit"));
  const priority = String(params.get("priority") || "all").trim();
  const status = String(params.get("status") || "all").trim();
  const query = {
    select: [
      "id",
      "created_at",
      "updated_at",
      "customer_name",
      "phone",
      "email",
      "site_address",
      "suburb",
      "postcode",
      "quote_mode",
      "product_category",
      "product_name",
      "measurement_method",
      "real_area",
      "total_inc_gst",
      "manual_review_required",
      "status",
      "source_page",
      "lead_status",
      "lead_priority",
      "lead_qualification",
      "lead_qualification_fields",
      "lead_risk_flags",
      "lead_missing_fields",
      "lead_next_action",
      "lead_followup_template_key",
      "customer_accepted_range",
      "floorplan_attached",
      "quote_review_attached",
      "estimated_job_size",
      "confidence_level",
      "review_required",
      "site_confirmation_booked_at",
      "lead_status_updated_at"
    ].join(","),
    order: "lead_status_updated_at.desc",
    limit: String(limit)
  };

  if (priority && priority !== "all") {
    query.lead_priority = "eq." + priority;
  }
  if (status && status !== "all") {
    query.lead_status = "eq." + status;
  }

  const leads = await supabaseRequest(tables.quoteRequests, { query: query });
  return { leads: Array.isArray(leads) ? leads : [] };
}

async function updateLead(body) {
  const tables = getSupabaseTables();
  const quoteRequestId = String(body.quote_request_id || body.quoteRequestId || "").trim();
  const status = String(body.lead_status || body.leadStatus || "").trim();
  const currentPriority = String(body.lead_priority || body.leadPriority || "").trim();
  const nextAction = String(body.lead_next_action || body.leadNextAction || "").trim();

  if (!isUuid(quoteRequestId)) {
    throw new Error("A valid quote_request_id is required.");
  }
  if (!status) {
    throw new Error("lead_status is required.");
  }

  const patch = {
    lead_status: status,
    lead_priority: getPriorityForStatus(status, currentPriority),
    lead_next_action: getNextActionForStatus(status, nextAction),
    lead_status_updated_at: new Date().toISOString()
  };

  if (status === "Site confirmation booked") {
    patch.site_confirmation_booked_at = new Date().toISOString();
  }

  const updated = await supabaseRequest(tables.quoteRequests, {
    method: "PATCH",
    query: { id: "eq." + quoteRequestId },
    headers: { Prefer: "return=representation" },
    body: patch
  });

  return { lead: Array.isArray(updated) ? updated[0] || null : updated };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, {
      methods: "GET, POST, OPTIONS",
      allowHeaders: "authorization, content-type, x-operon-admin-token"
    });
  }

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "lead-admin",
    limit: 120,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit, {
      methods: "GET, POST, OPTIONS",
      allowHeaders: "authorization, content-type, x-operon-admin-token"
    });
  }

  const admin = requireAdmin(event);
  if (!admin.ok) {
    return jsonResponse(event, admin.status, { ok: false, error: admin.error });
  }

  try {
    if (event.httpMethod === "GET") {
      return jsonResponse(event, 200, Object.assign({ ok: true }, await listLeads(event)));
    }

    if (event.httpMethod !== "POST") {
      return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
    }

    const largeBodyResponse = Security.rejectLargeBody(event, 64 * 1024, {
      methods: "GET, POST, OPTIONS",
      allowHeaders: "authorization, content-type, x-operon-admin-token"
    });
    if (largeBodyResponse) return largeBodyResponse;

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (error) {
      return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
    }

    const action = String(body.action || "update_lead").trim();
    if (action !== "update_lead") {
      return jsonResponse(event, 400, { ok: false, error: "Unknown lead admin action." });
    }

    return jsonResponse(event, 200, Object.assign({ ok: true }, await updateLead(body)));
  } catch (error) {
    console.warn("Lead admin request failed", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 500, {
      ok: false,
      error: Security.safePublicError("Lead admin request failed.")
    });
  }
};
