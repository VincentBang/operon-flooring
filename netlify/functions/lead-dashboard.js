"use strict";

const Security = require("./_security");

const LEAD_COLUMNS = [
  "id",
  "created_at",
  "updated_at",
  "last_activity_at",
  "primary_source",
  "source_detail",
  "status",
  "priority",
  "customer_name",
  "email",
  "phone",
  "suburb",
  "postcode",
  "product_category",
  "product_name",
  "area_m2",
  "estimated_order_area_m2",
  "estimate_total_inc_gst",
  "confidence_score",
  "confidence_level",
  "missing_info_flags",
  "risk_flags",
  "quote_review_status",
  "floorplan_status",
  "contact_status",
  "follow_up_status",
  "next_action"
];

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "GET, OPTIONS",
    allowHeaders: "authorization, content-type, x-operon-admin-token"
  });
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
    return { ok: false, status: 503, error: "Admin dashboard is not configured." };
  }
  if (getAdminToken(event) !== expectedToken) {
    return { ok: false, status: 401, error: "Admin authentication required." };
  }
  return { ok: true };
}

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

async function supabaseRequest(path, options) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const settings = Object.assign({ query: null }, options || {});
  const url = new URL(config.url + "/rest/v1/" + path);
  if (settings.query) {
    Object.keys(settings.query).forEach(function (key) {
      if (settings.query[key] !== null && typeof settings.query[key] !== "undefined") {
        url.searchParams.set(key, settings.query[key]);
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: "Bearer " + config.serviceRoleKey,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Supabase dashboard read failed.");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function parseLimit(value, fallback, max) {
  const limit = Number(value || fallback);
  if (!Number.isFinite(limit)) return fallback;
  return Math.max(1, Math.min(max, Math.round(limit)));
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function summarizeLead(row) {
  return {
    id: row.id,
    created_at: row.created_at,
    last_activity_at: row.last_activity_at,
    primary_source: row.primary_source,
    source_detail: row.source_detail,
    status: row.status,
    priority: row.priority,
    customer_name: row.customer_name,
    suburb: row.suburb,
    postcode: row.postcode,
    product_category: row.product_category,
    area_m2: row.area_m2,
    estimate_total_inc_gst: row.estimate_total_inc_gst,
    confidence_level: row.confidence_level,
    missing_info_count: toArray(row.missing_info_flags).length,
    risk_flag_count: toArray(row.risk_flags).length,
    quote_review_status: row.quote_review_status,
    floorplan_status: row.floorplan_status,
    contact_status: row.contact_status,
    follow_up_status: row.follow_up_status,
    next_action: row.next_action
  };
}

function formatLeadDetail(row) {
  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    last_activity_at: row.last_activity_at,
    primary_source: row.primary_source,
    source_detail: row.source_detail,
    status: row.status,
    priority: row.priority,
    customer: {
      name: row.customer_name,
      email: row.email,
      phone: row.phone
    },
    project: {
      suburb: row.suburb,
      postcode: row.postcode,
      product_category: row.product_category,
      product_name: row.product_name,
      area_m2: row.area_m2,
      estimated_order_area_m2: row.estimated_order_area_m2
    },
    quote: {
      estimate_total_inc_gst: row.estimate_total_inc_gst,
      confidence_score: row.confidence_score,
      confidence_level: row.confidence_level,
      missing_info_flags: toArray(row.missing_info_flags),
      risk_flags: toArray(row.risk_flags)
    },
    statuses: {
      quote_review_status: row.quote_review_status,
      floorplan_status: row.floorplan_status,
      contact_status: row.contact_status,
      follow_up_status: row.follow_up_status
    },
    next_action: row.next_action
  };
}

function applyListFilters(query, params) {
  [
    ["status", "status"],
    ["source", "primary_source"],
    ["priority", "priority"],
    ["product_category", "product_category"],
    ["suburb", "suburb"]
  ].forEach(function (pair) {
    const value = String(params.get(pair[0]) || "").trim();
    if (value && value !== "all") query[pair[1]] = "eq." + value;
  });
  return query;
}

async function listLeads(event) {
  const params = new URLSearchParams(event.rawQuery || "");
  const limit = parseLimit(params.get("limit"), 50, 150);
  const query = applyListFilters({
    select: LEAD_COLUMNS.join(","),
    order: "last_activity_at.desc",
    limit: String(limit)
  }, params);
  const rows = await supabaseRequest("operon_leads", { query: query });
  return {
    ok: true,
    leads: (Array.isArray(rows) ? rows : []).map(summarizeLead),
    next_cursor: null
  };
}

async function leadDetail(event) {
  const params = new URLSearchParams(event.rawQuery || "");
  const leadId = String(params.get("lead_id") || "").trim();
  if (!isUuid(leadId)) {
    return { ok: false, status: 400, payload: { ok: false, error: "A valid lead_id is required." } };
  }
  const rows = await supabaseRequest("operon_leads", {
    query: {
      id: "eq." + leadId,
      select: LEAD_COLUMNS.join(","),
      limit: "1"
    }
  });
  const lead = Array.isArray(rows) ? rows[0] || null : null;
  if (!lead) {
    return { ok: false, status: 404, payload: { ok: false, error: "Lead not found." } };
  }

  const events = await supabaseRequest("operon_lead_events", {
    query: {
      lead_id: "eq." + leadId,
      select: "id,created_at,event_type,source,source_table,source_id,customer_safe,metadata",
      order: "created_at.desc",
      limit: "50"
    }
  });
  const notes = await supabaseRequest("operon_lead_notes", {
    query: {
      lead_id: "eq." + leadId,
      select: "id,created_at,updated_at,note,note_type,created_by",
      order: "created_at.desc",
      limit: "50"
    }
  });
  const files = await supabaseRequest("operon_lead_files", {
    query: {
      lead_id: "eq." + leadId,
      select: "id,created_at,uploaded_file_id,file_role,safe_filename,file_type,file_size_bytes,storage_status",
      order: "created_at.desc",
      limit: "50"
    }
  });

  return {
    ok: true,
    payload: {
      ok: true,
      lead: formatLeadDetail(lead),
      events: Array.isArray(events) ? events : [],
      notes: Array.isArray(notes) ? notes : [],
      files: Array.isArray(files) ? files : []
    }
  };
}

async function reportSummary() {
  const rows = await supabaseRequest("operon_leads", {
    query: {
      select: "primary_source,status,product_category,suburb,quote_review_status,floorplan_status,priority",
      limit: "1000"
    }
  });
  const summary = {
    total: 0,
    by_status: {},
    by_source: {},
    by_product_category: {},
    by_suburb: {},
    quote_review_count: 0,
    floorplan_count: 0,
    open_high_priority_count: 0
  };
  (Array.isArray(rows) ? rows : []).forEach(function (row) {
    summary.total += 1;
    summary.by_status[row.status || "unknown"] = (summary.by_status[row.status || "unknown"] || 0) + 1;
    summary.by_source[row.primary_source || "unknown"] = (summary.by_source[row.primary_source || "unknown"] || 0) + 1;
    if (row.product_category) {
      summary.by_product_category[row.product_category] = (summary.by_product_category[row.product_category] || 0) + 1;
    }
    if (row.suburb) {
      summary.by_suburb[row.suburb] = (summary.by_suburb[row.suburb] || 0) + 1;
    }
    if (row.quote_review_status && row.quote_review_status !== "none") summary.quote_review_count += 1;
    if (row.floorplan_status && row.floorplan_status !== "none") summary.floorplan_count += 1;
    if (row.priority === "high" || row.priority === "urgent") summary.open_high_priority_count += 1;
  });
  return { ok: true, summary: summary };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, {
      methods: "GET, OPTIONS",
      allowHeaders: "authorization, content-type, x-operon-admin-token"
    });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "lead-dashboard",
    limit: 120,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit, {
      methods: "GET, OPTIONS",
      allowHeaders: "authorization, content-type, x-operon-admin-token"
    });
  }

  const admin = requireAdmin(event);
  if (!admin.ok) {
    return jsonResponse(event, admin.status, { ok: false, error: admin.error });
  }

  try {
    const params = new URLSearchParams(event.rawQuery || "");
    const action = String(params.get("action") || "list").trim();
    if (action === "list") {
      return jsonResponse(event, 200, await listLeads(event));
    }
    if (action === "detail") {
      const result = await leadDetail(event);
      return jsonResponse(event, result.status || 200, result.payload);
    }
    if (action === "summary") {
      return jsonResponse(event, 200, await reportSummary());
    }
    return jsonResponse(event, 400, { ok: false, error: "Unknown dashboard action." });
  } catch (error) {
    console.warn("Lead dashboard request failed", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 500, {
      ok: false,
      error: Security.safePublicError("Lead dashboard request failed.")
    });
  }
};
