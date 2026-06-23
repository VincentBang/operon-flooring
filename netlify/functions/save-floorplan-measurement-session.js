"use strict";

const Security = require("./_security");
const Geometry = require("./shared/floorplanGeometry");
const Store = require("./shared/floorplanMeasurementStore");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "POST, OPTIONS",
    allowHeaders: "content-type"
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, { methods: "POST, OPTIONS", allowHeaders: "content-type" });
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }
  const largeBodyResponse = Security.rejectLargeBody(event, 96 * 1024, {
    methods: "POST, OPTIONS",
    allowHeaders: "content-type"
  });
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "save-floorplan-measurement-session",
    limit: 20,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit);
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
  }

  let payload;
  try {
    payload = Geometry.validateMeasurementPayload(body, {
      forceReviewRequired: body && body.uploaded_file_id && !body.upload_receipt
    });
    if (body && body.uploaded_file_id && !body.upload_receipt) {
      payload.uploaded_file_id = null;
      payload.metadata.upload_link_status = "ignored_without_server_receipt";
    }
  } catch (error) {
    return jsonResponse(event, 400, {
      ok: false,
      error: error && error.message ? error.message : "Invalid floorplan measurement."
    });
  }

  try {
    const result = await Store.createCustomerSubmission(payload);
    return jsonResponse(event, 200, {
      ok: true,
      status: "customer_submitted",
      measurement_session_id: result.session && result.session.id || null,
      customer_version_id: result.version && result.version.id || null,
      selected_area_m2: payload.selected_area_m2,
      measured_area_m2: payload.measured_area_m2,
      confidence_level: payload.confidence_level,
      review_required: payload.review_required,
      idempotent: Boolean(result.idempotent)
    });
  } catch (error) {
    console.warn("Floorplan measurement save failed", {
      reason: Security.safeLogReason(error)
    });
    return jsonResponse(event, 500, {
      ok: false,
      error: "Floorplan measurement could not be saved."
    });
  }
};

module.exports._test = {
  validateMeasurementPayload: Geometry.validateMeasurementPayload
};
