"use strict";

const { getSupabaseTables } = require("./_supabaseTables");

function jsonResponse(statusCode, payload) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type, x-operon-admin-token",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    },
    body: JSON.stringify(payload)
  };
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
  const expectedToken = process.env.OPERON_ADMIN_TOKEN || process.env.OPERON_FOLLOWUP_ADMIN_TOKEN || "";
  if (!expectedToken) {
    return { ok: false, status: 503, error: "Follow-up admin is not configured. Add OPERON_ADMIN_TOKEN in Netlify." };
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
  const limit = Number(value || 25);
  if (!Number.isFinite(limit)) return 25;
  return Math.max(1, Math.min(100, Math.round(limit)));
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(value);
}

async function listFollowups(event) {
  const tables = getSupabaseTables();
  const params = new URLSearchParams(event.rawQuery || "");
  const limit = parseLimit(params.get("limit"));
  const status = String(params.get("status") || "queued").trim();
  const query = {
    select: "id,quote_request_id,lead_id,channel,template_key,scheduled_for,sent_at,status,payload,error_message,created_at",
    order: "scheduled_for.asc",
    limit: String(limit)
  };

  if (status && status !== "all") {
    query.status = "eq." + status;
  }

  const messages = await supabaseRequest(tables.followupMessages, { query: query });
  const quoteIds = Array.from(new Set((Array.isArray(messages) ? messages : [])
    .map(function (message) { return message.quote_request_id; })
    .filter(Boolean)));
  let quotesById = {};

  if (quoteIds.length) {
    const quotedIds = "(" + quoteIds.map(function (id) { return "\"" + String(id).replace(/"/g, "\\\"") + "\""; }).join(",") + ")";
    const quotes = await supabaseRequest(tables.quoteRequests, {
      query: {
        id: "in." + quotedIds,
        select: "id,customer_name,phone,email,suburb,product_category,product_name,total_inc_gst,lead_stage,followup_status,followup_paused,next_followup_at,status"
      }
    });
    quotesById = (Array.isArray(quotes) ? quotes : []).reduce(function (accumulator, quote) {
      accumulator[quote.id] = quote;
      return accumulator;
    }, {});
  }

  return {
    messages: (Array.isArray(messages) ? messages : []).map(function (message) {
      return Object.assign({}, message, {
        quote: message.quote_request_id ? quotesById[message.quote_request_id] || null : null
      });
    })
  };
}

async function pauseQuote(quoteRequestId) {
  const tables = getSupabaseTables();
  await supabaseRequest(tables.quoteRequests, {
    method: "PATCH",
    query: {
      id: "eq." + quoteRequestId
    },
    headers: {
      Prefer: "return=minimal"
    },
    body: {
      followup_paused: true,
      followup_status: "paused",
      next_followup_at: null
    }
  });
  await supabaseRequest(tables.followupMessages, {
    method: "PATCH",
    query: {
      quote_request_id: "eq." + quoteRequestId,
      status: "eq.queued"
    },
    headers: {
      Prefer: "return=minimal"
    },
    body: {
      status: "cancelled",
      error_message: "Cancelled by admin pause control."
    }
  });
  return { paused: true };
}

async function resumeQuote(quoteRequestId) {
  const tables = getSupabaseTables();
  await supabaseRequest(tables.quoteRequests, {
    method: "PATCH",
    query: {
      id: "eq." + quoteRequestId
    },
    headers: {
      Prefer: "return=minimal"
    },
    body: {
      followup_paused: false,
      followup_status: "pending"
    }
  });
  return { resumed: true, note: "Resume clears the pause flag. New follow-ups are queued by the submit or queue function." };
}

async function cancelMessage(messageId) {
  const tables = getSupabaseTables();
  await supabaseRequest(tables.followupMessages, {
    method: "PATCH",
    query: {
      id: "eq." + messageId,
      status: "eq.queued"
    },
    headers: {
      Prefer: "return=minimal"
    },
    body: {
      status: "cancelled",
      error_message: "Cancelled by admin."
    }
  });
  return { cancelled: true };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {});
  }

  const admin = requireAdmin(event);
  if (!admin.ok) {
    return jsonResponse(admin.status, { ok: false, error: admin.error });
  }

  try {
    if (event.httpMethod === "GET") {
      const payload = await listFollowups(event);
      return jsonResponse(200, Object.assign({ ok: true }, payload));
    }

    if (event.httpMethod !== "POST") {
      return jsonResponse(405, { ok: false, error: "Method not allowed." });
    }

    const body = JSON.parse(event.body || "{}");
    const action = String(body.action || "").trim();
    const quoteRequestId = String(body.quote_request_id || body.quoteRequestId || "").trim();
    const messageId = String(body.message_id || body.messageId || "").trim();

    if ((action === "pause_quote" || action === "resume_quote") && !isUuid(quoteRequestId)) {
      return jsonResponse(400, { ok: false, error: "A valid quote_request_id is required." });
    }
    if (action === "cancel_message" && !isUuid(messageId)) {
      return jsonResponse(400, { ok: false, error: "A valid message_id is required." });
    }

    if (action === "pause_quote") {
      return jsonResponse(200, Object.assign({ ok: true }, await pauseQuote(quoteRequestId)));
    }
    if (action === "resume_quote") {
      return jsonResponse(200, Object.assign({ ok: true }, await resumeQuote(quoteRequestId)));
    }
    if (action === "cancel_message") {
      return jsonResponse(200, Object.assign({ ok: true }, await cancelMessage(messageId)));
    }

    return jsonResponse(400, { ok: false, error: "Unknown follow-up admin action." });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Follow-up admin request failed."
    });
  }
};
