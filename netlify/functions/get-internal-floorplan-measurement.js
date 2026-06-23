"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");
const Geometry = require("./shared/floorplanGeometry");
const Store = require("./shared/floorplanMeasurementStore");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "GET, OPTIONS",
    allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, { methods: "GET, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }
  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) return jsonResponse(event, admin.status, { ok: false, error: admin.error });

  const params = new URLSearchParams(event.rawQuery || "");
  const sessionId = params.get("session_id") || "";
  if (!Geometry.isUuid(sessionId)) {
    return jsonResponse(event, 400, { ok: false, error: "Valid session_id is required." });
  }
  try {
    const detail = await Store.getSessionDetail(sessionId);
    if (!detail) return jsonResponse(event, 404, { ok: false, error: "Floorplan measurement not found." });
    return jsonResponse(event, 200, Object.assign({ ok: true }, detail));
  } catch (error) {
    console.warn("Floorplan measurement detail failed", { reason: Security.safeLogReason(error) });
    return jsonResponse(event, 500, { ok: false, error: "Floorplan measurement could not be loaded." });
  }
};
