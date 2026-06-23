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
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, { methods: "POST, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  }
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) return jsonResponse(event, admin.status, { ok: false, error: admin.error });
  const largeBodyResponse = Security.rejectLargeBody(event, 96 * 1024, { methods: "POST, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  if (largeBodyResponse) return largeBodyResponse;

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
  }
  if (!Geometry.isUuid(body.session_id)) {
    return jsonResponse(event, 400, { ok: false, error: "Valid session_id is required." });
  }
  let payload;
  try {
    payload = Geometry.validateMeasurementPayload(Object.assign({}, body, {
      version_source: "reviewer"
    }));
  } catch (error) {
    return jsonResponse(event, 400, { ok: false, error: error && error.message || "Invalid review draft." });
  }
  try {
    const version = await Store.createReviewDraft(body.session_id, payload, body.parent_version_id, "admin");
    return jsonResponse(event, 200, {
      ok: true,
      status: "review_draft",
      measurement_session_id: body.session_id,
      review_version_id: version.id,
      selected_area_m2: version.selected_area_m2
    });
  } catch (error) {
    console.warn("Floorplan review draft save failed", { reason: Security.safeLogReason(error) });
    return jsonResponse(event, 500, { ok: false, error: "Review draft could not be saved." });
  }
};
