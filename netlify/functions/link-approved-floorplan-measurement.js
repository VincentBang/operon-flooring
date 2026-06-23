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
  if (!Geometry.isUuid(body.session_id)) {
    return jsonResponse(event, 400, { ok: false, error: "Valid session_id is required." });
  }
  if (body.quote_request_id && !Geometry.isUuid(body.quote_request_id)) {
    return jsonResponse(event, 400, { ok: false, error: "quote_request_id must be a UUID when supplied." });
  }
  try {
    const link = await Store.linkApprovedMeasurement(body.session_id, body.quote_request_id, "admin");
    return jsonResponse(event, 200, {
      ok: true,
      status: "linked",
      measurement_session_id: body.session_id,
      link_id: link && link.id || null,
      quote_request_id: link && link.quote_request_id || null,
      approved_area_m2: link && link.approved_area_m2 || null
    });
  } catch (error) {
    console.warn("Floorplan quote link failed", { reason: Security.safeLogReason(error) });
    return jsonResponse(event, 500, { ok: false, error: "Approved floorplan measurement could not be linked." });
  }
};
