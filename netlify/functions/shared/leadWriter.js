"use strict";

const LEADS_TABLE = "operon_leads";
const LEAD_EVENTS_TABLE = "operon_lead_events";

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

function normaliseText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength || 500);
}

function normaliseEmail(value) {
  return normaliseText(value, 220).toLowerCase();
}

function toNumberOrNull(value) {
  if (value === "" || value === null || typeof value === "undefined") {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map(function (item) {
      if (typeof item === "string") return normaliseText(item, 220);
      if (item && typeof item === "object") return item;
      return null;
    })
    .filter(Boolean)
    .slice(0, 24);
}

function toSafeJsonObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const json = JSON.stringify(value, function (key, entry) {
    const lowerKey = String(key || "").toLowerCase();
    if (
      lowerKey.includes("service_role")
      || lowerKey.includes("secret")
      || lowerKey.includes("token")
      || lowerKey.includes("raw_ocr")
      || lowerKey.includes("rawocr")
      || lowerKey.includes("raw_quote")
      || lowerKey.includes("rawquote")
      || lowerKey.includes("extracted_text")
      || lowerKey.includes("extractedtext")
      || lowerKey.includes("storage_bucket")
      || lowerKey.includes("storagebucket")
      || lowerKey.includes("file_path")
      || lowerKey.includes("filepath")
      || lowerKey.includes("signed_url")
      || lowerKey.includes("signedurl")
      || lowerKey.includes("internal_rate")
      || lowerKey.includes("internalrate")
      || lowerKey.includes("supplier_cost")
      || lowerKey.includes("suppliercost")
      || lowerKey.includes("gross_margin")
      || lowerKey.includes("grossmargin")
      || lowerKey.includes("margin")
      || lowerKey.includes("access_factor")
      || lowerKey.includes("accessfactor")
      || lowerKey.includes("installrates")
      || lowerKey.includes("removalrates")
      || lowerKey.includes("stairrates")
      || lowerKey.includes("locationzones")
      || lowerKey.includes("pricingrules")
    ) {
      return undefined;
    }
    if (typeof entry === "string") {
      return entry.slice(0, 500);
    }
    return entry;
  });
  return JSON.parse(json || "{}");
}

function normaliseStatus(value) {
  const allowed = new Set(["New", "Needs review", "Waiting customer", "Quote sent", "Site measure booked", "Won", "Lost", "Archived"]);
  return allowed.has(value) ? value : "New";
}

function normalisePriority(value) {
  const allowed = new Set(["low", "normal", "high", "urgent"]);
  return allowed.has(value) ? value : "normal";
}

function normaliseSource(value) {
  const allowed = new Set(["quote", "contact", "quote_review", "upload", "floorplan", "product", "chatbot", "operator", "system"]);
  return allowed.has(value) ? value : "quote";
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
    throw new Error("Supabase lead request failed for " + path + ": " + text.slice(0, 400));
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
}

function getFirstRow(value) {
  return Array.isArray(value) && value.length ? value[0] : null;
}

function buildLeadRow(input) {
  const customer = input.customer || {};
  const project = input.project || {};
  const quote = input.quote || {};
  const statuses = input.statuses || {};

  return {
    primary_source: normaliseSource(input.primarySource),
    source_detail: normaliseText(input.sourceDetail, 120) || null,
    status: normaliseStatus(statuses.status),
    priority: normalisePriority(statuses.priority),
    customer_name: normaliseText(customer.name, 160) || null,
    email: normaliseEmail(customer.email) || null,
    phone: normaliseText(customer.phone, 80) || null,
    suburb: normaliseText(project.suburb, 160) || null,
    postcode: normaliseText(project.postcode, 20) || null,
    product_category: normaliseText(project.productCategory, 80) || null,
    product_name: normaliseText(project.productName, 180) || null,
    area_m2: toNumberOrNull(project.areaM2),
    estimated_order_area_m2: toNumberOrNull(project.estimatedOrderAreaM2),
    estimate_total_inc_gst: toNumberOrNull(quote.totalIncGst),
    confidence_score: toNumberOrNull(quote.confidenceScore),
    confidence_level: normaliseText(quote.confidenceLevel, 80) || null,
    missing_info_flags: toArray(quote.missingInfoFlags),
    risk_flags: toArray(quote.riskFlags),
    quote_review_status: normaliseText(statuses.quoteReviewStatus, 80) || "none",
    floorplan_status: normaliseText(statuses.floorplanStatus, 80) || "none",
    contact_status: normaliseText(statuses.contactStatus, 80) || "none",
    follow_up_status: normaliseText(statuses.followUpStatus, 80) || "none",
    next_action: normaliseText(input.nextAction, 280) || null,
    last_activity_at: new Date().toISOString(),
    metadata: toSafeJsonObject(input.metadata)
  };
}

async function createLead(input) {
  const rows = await supabaseRequest(LEADS_TABLE, {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: buildLeadRow(input || {})
  });
  return getFirstRow(rows);
}

async function patchLead(leadId, input) {
  if (!leadId) return null;
  const rows = await supabaseRequest(LEADS_TABLE, {
    method: "PATCH",
    query: {
      id: "eq." + leadId
    },
    headers: {
      Prefer: "return=representation"
    },
    body: buildLeadRow(input || {})
  });
  return getFirstRow(rows);
}

async function getLeadIdFromSource(sourceTable, sourceId) {
  if (!sourceTable || !sourceId) return "";
  const rows = await supabaseRequest(sourceTable, {
    query: {
      id: "eq." + sourceId,
      select: "lead_id"
    }
  });
  const row = getFirstRow(rows);
  return row && row.lead_id ? row.lead_id : "";
}

async function linkLeadToSource(options) {
  const leadId = options && options.leadId;
  const table = options && options.table;
  const sourceId = options && options.sourceId;
  const column = options && options.column || "lead_id";
  if (!leadId || !table || !sourceId) {
    return null;
  }
  return supabaseRequest(table, {
    method: "PATCH",
    query: {
      id: "eq." + sourceId
    },
    headers: {
      Prefer: "return=minimal"
    },
    body: {
      [column]: leadId
    }
  });
}

async function createOrUpdateLead(input) {
  const sourceTable = input && input.sourceTable;
  const sourceId = input && input.sourceId;
  let existingLeadId = "";
  try {
    existingLeadId = await getLeadIdFromSource(sourceTable, sourceId);
  } catch (error) {
    existingLeadId = "";
  }
  const lead = existingLeadId
    ? await patchLead(existingLeadId, input)
    : await createLead(input);
  if (lead && lead.id && sourceTable && sourceId) {
    try {
      await linkLeadToSource({ leadId: lead.id, table: sourceTable, sourceId: sourceId });
    } catch (error) {
      // Linking is additive. Keep the parent lead write successful if legacy tables
      // have not received their nullable lead_id column yet.
    }
  }
  return {
    ok: Boolean(lead && lead.id),
    leadId: lead && lead.id || existingLeadId || null
  };
}

async function recordLeadEvent(options) {
  const leadId = options && options.leadId;
  const eventType = normaliseText(options && options.eventType, 120);
  if (!leadId || !eventType) {
    return null;
  }
  return supabaseRequest(LEAD_EVENTS_TABLE, {
    method: "POST",
    headers: {
      Prefer: "return=minimal"
    },
    body: {
      lead_id: leadId,
      event_type: eventType,
      source: normaliseText(options && options.source, 80) || null,
      source_table: normaliseText(options && options.sourceTable, 120) || null,
      source_id: options && options.sourceId || null,
      customer_safe: options && options.customerSafe === false ? false : true,
      metadata: toSafeJsonObject(options && options.metadata)
    }
  });
}

module.exports = {
  createOrUpdateLead: createOrUpdateLead,
  linkLeadToSource: linkLeadToSource,
  recordLeadEvent: recordLeadEvent,
  toSafeJsonObject: toSafeJsonObject
};
