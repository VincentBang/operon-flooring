"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");
const CandidateRequest = require("./shared/floorplanCandidateRequest");

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "POST, OPTIONS",
    allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
  });
}

function isEnabled() {
  return String(process.env.OPERON_FLOORPLAN_CANDIDATES_ENABLED || "").toLowerCase() === "true";
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, {
      methods: "POST, OPTIONS",
      allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS
    });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }

  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) return jsonResponse(event, admin.status, { ok: false, error: admin.error });

  if (!isEnabled()) {
    return jsonResponse(event, 501, {
      ok: false,
      status: "disabled",
      error: "Floorplan candidate generation is disabled.",
      candidate_count: 0,
      review_required: true
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." });
  }

  try {
    CandidateRequest.normalizeCandidateRequest(body);
  } catch (error) {
    return jsonResponse(event, 400, {
      ok: false,
      error: error && error.message ? error.message : "Invalid candidate request."
    });
  }

  return jsonResponse(event, 501, {
    ok: false,
    status: "not_implemented",
    error: "Floorplan candidate generation is not implemented.",
    candidate_count: 0,
    review_required: true
  });
};
