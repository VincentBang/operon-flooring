"use strict";

const crypto = require("crypto");

const DEFAULT_ALLOWED_ORIGINS = [
  "https://operonflooring.com.au",
  "https://www.operonflooring.com.au"
];
const LOCAL_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
const NETLIFY_PREVIEW_ORIGIN_PATTERN = /^https:\/\/[a-z0-9-]+--operonflooring\.netlify\.app$/i;
const buckets = new Map();

function getAllowedOrigins() {
  const configured = String(process.env.OPERON_ALLOWED_ORIGINS || "")
    .split(",")
    .map(function (origin) { return origin.trim().replace(/\/$/, ""); })
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
}

function getOrigin(event) {
  const headers = event && event.headers || {};
  return String(headers.origin || headers.Origin || "").trim().replace(/\/$/, "");
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (LOCAL_ORIGIN_PATTERN.test(origin)) return true;
  if (NETLIFY_PREVIEW_ORIGIN_PATTERN.test(origin)) return true;
  return getAllowedOrigins().indexOf(origin) >= 0;
}

function getCorsOrigin(event) {
  const origin = getOrigin(event);
  if (isAllowedOrigin(origin)) return origin;
  return getAllowedOrigins()[0];
}

function headers(event, options) {
  const settings = Object.assign({
    methods: "POST, OPTIONS",
    allowHeaders: "content-type",
    cacheControl: "no-store"
  }, options || {});
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": settings.cacheControl,
    "Access-Control-Allow-Origin": getCorsOrigin(event),
    "Vary": "Origin",
    "Access-Control-Allow-Headers": settings.allowHeaders,
    "Access-Control-Allow-Methods": settings.methods
  };
}

function jsonResponse(event, statusCode, payload, options) {
  return {
    statusCode: statusCode,
    headers: headers(event, options),
    body: JSON.stringify(payload)
  };
}

function optionsResponse(event, options) {
  return {
    statusCode: 204,
    headers: headers(event, options),
    body: ""
  };
}

function getClientIp(event) {
  const headers = event && event.headers || {};
  const forwarded = String(headers["x-forwarded-for"] || headers["X-Forwarded-For"] || "").split(",")[0].trim();
  return String(
    headers["x-nf-client-connection-ip"] ||
    headers["client-ip"] ||
    headers["x-real-ip"] ||
    forwarded ||
    "unknown"
  ).trim();
}

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

function hashClient(value) {
  const salt = process.env.OPERON_RATE_LIMIT_SALT || process.env.OPERON_ADMIN_TOKEN || "operon-rate-limit";
  return crypto.createHash("sha256").update(String(salt) + ":" + String(value || "unknown")).digest("hex");
}

function checkRateLimit(event, options) {
  const settings = Object.assign({
    scope: "default",
    limit: 30,
    windowMs: 10 * 60 * 1000
  }, options || {});
  const now = Date.now();
  const key = settings.scope + ":" + getClientIp(event);
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + settings.windowMs });
    return { allowed: true, remaining: Math.max(0, settings.limit - 1), resetAt: now + settings.windowMs };
  }

  current.count += 1;
  buckets.set(key, current);

  if (current.count > settings.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  return { allowed: true, remaining: Math.max(0, settings.limit - current.count), resetAt: current.resetAt };
}

async function checkDurableRateLimit(event, options) {
  const settings = Object.assign({
    scope: "default",
    limit: 30,
    windowMs: 10 * 60 * 1000
  }, options || {});
  const config = getSupabaseConfig();
  const clientHash = hashClient(getClientIp(event));
  const key = settings.scope + ":" + clientHash;

  if (!config.url || !config.serviceRoleKey) {
    return checkRateLimit(event, settings);
  }

  try {
    const response = await fetch(config.url + "/rest/v1/rpc/operon_check_rate_limit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.serviceRoleKey,
        Authorization: "Bearer " + config.serviceRoleKey
      },
      body: JSON.stringify({
        p_key: key,
        p_scope: settings.scope,
        p_client_hash: clientHash,
        p_limit: settings.limit,
        p_window_seconds: Math.max(1, Math.ceil(settings.windowMs / 1000))
      })
    });

    if (!response.ok) {
      return checkRateLimit(event, settings);
    }

    const result = await response.json();
    return {
      allowed: result && result.allowed !== false,
      remaining: Number(result && result.remaining) || 0,
      resetAt: Number(result && result.resetAt) || Date.now() + settings.windowMs,
      durable: true
    };
  } catch (error) {
    return checkRateLimit(event, settings);
  }
}

function getTurnstileSecret() {
  return String(process.env.OPERON_TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY || "").trim();
}

function turnstileConfigured() {
  return Boolean(getTurnstileSecret());
}

async function verifyTurnstile(event, token) {
  const secret = getTurnstileSecret();
  if (!secret) {
    return { ok: true, skipped: true };
  }
  if (!token) {
    return { ok: false, error: "Bot check is required." };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", String(token || ""));
  const ip = getClientIp(event);
  if (ip && ip !== "unknown") {
    body.set("remoteip", ip);
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    });
    const result = await response.json().catch(function () { return null; });
    if (response.ok && result && result.success === true) {
      return { ok: true };
    }
  } catch (error) {
    return { ok: false, error: "Bot check could not be verified." };
  }

  return { ok: false, error: "Bot check failed. Please try again." };
}

function botChallengeResponse(event, result, options) {
  return jsonResponse(event, 403, {
    ok: false,
    error: result && result.error || "Bot check failed. Please try again."
  }, options);
}

function rateLimitResponse(event, result, options) {
  const retryAfter = Math.max(1, Math.ceil(((result && result.resetAt || Date.now()) - Date.now()) / 1000));
  const responseHeaders = headers(event, options);
  responseHeaders["Retry-After"] = String(retryAfter);
  return {
    statusCode: 429,
    headers: responseHeaders,
    body: JSON.stringify({
      ok: false,
      error: "Too many requests. Please wait a moment and try again."
    })
  };
}

function getBodySize(event) {
  return Buffer.byteLength(String(event && event.body || ""), "utf8");
}

function rejectLargeBody(event, maxBytes, options) {
  if (getBodySize(event) <= maxBytes) return null;
  return jsonResponse(event, 413, {
    ok: false,
    error: "Request is too large."
  }, options);
}

function safePublicError(fallback) {
  return String(fallback || "Something went wrong. Please try again.");
}

function safeLogReason(error, maxLength) {
  const limit = Math.max(40, Number(maxLength) || 220);
  const message = error && error.message
    ? error.message
    : (typeof error === "string" ? error : "unknown");
  return String(message || "unknown")
    .replace(/(service[_-]?role|api[_-]?key|secret|token|password|authorization|bearer)\s*[:=]\s*[^,\s)]+/gi, "$1=[redacted]")
    .replace(/\b(sk|re)_[A-Za-z0-9_-]{12,}\b/g, "[redacted-key]")
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[redacted-email]")
    .slice(0, limit);
}

module.exports = {
  botChallengeResponse: botChallengeResponse,
  checkRateLimit: checkRateLimit,
  checkDurableRateLimit: checkDurableRateLimit,
  getAllowedOrigins: getAllowedOrigins,
  headers: headers,
  isAllowedOrigin: isAllowedOrigin,
  jsonResponse: jsonResponse,
  optionsResponse: optionsResponse,
  rateLimitResponse: rateLimitResponse,
  rejectLargeBody: rejectLargeBody,
  safeLogReason: safeLogReason,
  safePublicError: safePublicError,
  turnstileConfigured: turnstileConfigured,
  verifyTurnstile: verifyTurnstile
};
