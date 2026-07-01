"use strict";

const Geometry = require("./floorplanGeometry");

const CANDIDATE_METHODS = new Set([
  "hybrid_selector_spike",
  "manual_seed_assisted",
  "classical_contour_spike",
  "quick_room_baseline"
]);

const PLAN_QUALITY_PRESETS = new Set([
  "clean_vector",
  "mixed_boundary",
  "low_contrast_scan",
  "unknown"
]);

const FORBIDDEN_KEY_PATTERN = /(price|pricing|rate|rates|margin|markup|supplier|cost|service[_-]?role|secret|token|storage[_-]?(bucket|path)|file[_-]?path|signed[_-]?url|ocr|transcript|raw[_-]?text|upload[_-]?content|document[_-]?content)/i;

function containsForbiddenShape(value) {
  if (Array.isArray(value)) {
    return value.some(containsForbiddenShape);
  }
  if (value && typeof value === "object") {
    return Object.keys(value).some(function (key) {
      return FORBIDDEN_KEY_PATTERN.test(key) || containsForbiddenShape(value[key]);
    });
  }
  return false;
}

function toInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) ? number : fallback;
}

function normalizeCandidateRequest(body) {
  const payload = body || {};
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid candidate request.");
  }
  if (containsForbiddenShape(payload)) {
    throw new Error("Candidate request includes unsupported sensitive fields.");
  }

  const measurementSessionId = Geometry.toSafeText(payload.measurement_session_id, 80);
  if (!Geometry.isUuid(measurementSessionId)) {
    throw new Error("A valid measurement session is required.");
  }

  const uploadedFileId = Geometry.toSafeText(payload.uploaded_file_id, 80);
  if (uploadedFileId && !Geometry.isUuid(uploadedFileId)) {
    throw new Error("Uploaded file reference is invalid.");
  }

  const method = Geometry.toSafeText(payload.candidate_method || "hybrid_selector_spike", 80);
  if (!CANDIDATE_METHODS.has(method)) {
    throw new Error("Unsupported candidate method.");
  }

  const planQuality = Geometry.toSafeText(payload.plan_quality || "unknown", 80);
  if (!PLAN_QUALITY_PRESETS.has(planQuality)) {
    throw new Error("Unsupported plan quality preset.");
  }

  const pageNumber = toInteger(payload.page_number || payload.page, 1);
  if (pageNumber < 1 || pageNumber > 50) {
    throw new Error("Candidate page number is outside the supported range.");
  }

  const maxCandidates = toInteger(payload.max_candidates, 20);
  if (maxCandidates < 1 || maxCandidates > 80) {
    throw new Error("Candidate limit is outside the supported range.");
  }

  return {
    measurement_session_id: measurementSessionId,
    uploaded_file_id: uploadedFileId || null,
    page_key: Geometry.toSafeText(payload.page_key || "floorplan-page-" + pageNumber, 100),
    page_number: pageNumber,
    candidate_method: method,
    plan_quality: planQuality,
    max_candidates: maxCandidates,
    review_required: true
  };
}

module.exports = {
  CANDIDATE_METHODS: CANDIDATE_METHODS,
  PLAN_QUALITY_PRESETS: PLAN_QUALITY_PRESETS,
  normalizeCandidateRequest: normalizeCandidateRequest,
  _test: {
    containsForbiddenShape: containsForbiddenShape
  }
};
