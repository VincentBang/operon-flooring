"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");
const Store = require("./shared/floorplanMeasurementStore");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "GET, OPTIONS",
    allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, {
      methods: "GET, OPTIONS",
      allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
    });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }
  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) return jsonResponse(event, admin.status, { ok: false, error: admin.error });

  try {
    const params = new URLSearchParams(event.rawQuery || "");
    const rows = await Store.listSessions(params.get("limit") || 50, params.get("status") || "");
    return jsonResponse(event, 200, { ok: true, sessions: rows });
  } catch (error) {
    console.warn("Floorplan measurement list failed", { reason: Security.safeLogReason(error) });
    return jsonResponse(event, 500, { ok: false, error: "Floorplan measurements could not be loaded." });
  }
};
