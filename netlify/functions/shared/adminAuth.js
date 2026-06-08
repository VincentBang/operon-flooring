"use strict";

const crypto = require("crypto");

const ADMIN_ALLOW_HEADERS = "authorization, content-type, x-operon-admin-token";

function getHeader(headers, key) {
  if (!headers) return "";
  return headers[key] || headers[key.toLowerCase()] || headers[key.toUpperCase()] || "";
}

function getAdminToken(event) {
  const headers = event && event.headers || {};
  const headerToken = getHeader(headers, "x-operon-admin-token");
  const auth = getHeader(headers, "authorization");
  if (headerToken) return String(headerToken).trim();
  if (/^Bearer\s+/i.test(auth)) {
    return String(auth).replace(/^Bearer\s+/i, "").trim();
  }
  return "";
}

function getExpectedAdminToken() {
  return String(process.env.OPERON_ADMIN_TOKEN || process.env.OPERON_LEAD_ADMIN_TOKEN || "").trim();
}

function safeCompare(left, right) {
  const leftValue = String(left || "");
  const rightValue = String(right || "");
  if (!leftValue || !rightValue) return false;
  const leftBuffer = Buffer.from(leftValue);
  const rightBuffer = Buffer.from(rightValue);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function requireAdmin(event) {
  const expectedToken = getExpectedAdminToken();
  if (!expectedToken) {
    return {
      ok: false,
      status: 503,
      error: "Admin access is not configured."
    };
  }

  const suppliedToken = getAdminToken(event);
  if (!suppliedToken) {
    return {
      ok: false,
      status: 401,
      error: "Admin authentication required."
    };
  }

  if (!safeCompare(suppliedToken, expectedToken)) {
    return {
      ok: false,
      status: 403,
      error: "Admin access denied."
    };
  }

  return { ok: true, role: "admin" };
}

module.exports = {
  ADMIN_ALLOW_HEADERS: ADMIN_ALLOW_HEADERS,
  getAdminToken: getAdminToken,
  requireAdmin: requireAdmin,
  _test: {
    safeCompare: safeCompare
  }
};
