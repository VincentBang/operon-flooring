"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");
const Geometry = require("./shared/floorplanGeometry");
const Store = require("./shared/floorplanMeasurementStore");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "POST, OPTIONS",
    allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") return Security.optionsResponse(event, { methods: "POST, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) return jsonResponse(event, admin.status, { ok: false, error: admin.error });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
  }
  if (!Geometry.isUuid(body.session_id) || !Geometry.isUuid(body.version_id)) {
    return jsonResponse(event, 400, { ok: false, error: "Valid session_id and version_id are required." });
  }
  try {
    const version = await Store.approveVersion(body.session_id, body.version_id, "admin");
    return jsonResponse(event, 200, {
      ok: true,
      status: "approved",
      measurement_session_id: body.session_id,
      approved_version_id: version.id,
      approved_area_m2: version.selected_area_m2,
      confidence_level: version.confidence_level
    });
  } catch (error) {
    console.warn("Floorplan approval failed", { reason: Security.safeLogReason(error) });
    return jsonResponse(event, 500, { ok: false, error: "Floorplan measurement could not be approved." });
  }
};
