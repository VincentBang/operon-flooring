"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");

const responseOptions = {
  methods: "GET, OPTIONS",
  allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
};

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, responseOptions);
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, responseOptions);
  }

  if (event.httpMethod !== "GET") {
    return jsonResponse(event, 405, {
      ok: false,
      error: "Method not allowed."
    });
  }

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "admin-session-status",
    limit: 120,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit, responseOptions);
  }

  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) {
    return jsonResponse(event, admin.status, {
      ok: false,
      authenticated: false,
      error: admin.error
    });
  }

  return jsonResponse(event, 200, {
    ok: true,
    authenticated: true,
    role: "admin",
    access: "admin_shell"
  });
};

exports._test = {
  requireAdmin: AdminAuth.requireAdmin
};
