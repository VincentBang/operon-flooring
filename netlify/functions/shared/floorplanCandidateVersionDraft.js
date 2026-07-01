"use strict";

const Geometry = require("./floorplanGeometry");
const CandidateRequest = require("./floorplanCandidateRequest");

const FORBIDDEN_KEY_PATTERN = /(price|pricing|rate|rates|margin|markup|supplier|cost|service[_-]?role|secret|token|storage[_-]?(bucket|path)|file[_-]?path|signed[_-]?url|ocr|transcript|raw[_-]?text|upload[_-]?content|document[_-]?content|approved|publish|handoff)/i;

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

function normalizeContext(context) {
  const source = context || {};
  const pageWidth = Number(source.page_width || source.pageWidth);
  const pageHeight = Number(source.page_height || source.pageHeight);
  const pixelsPerMetre = Number(source.pixels_per_metre || source.pixelsPerMetre);
  if (!(pageWidth > 0) || !(pageHeight > 0) || !(pixelsPerMetre > 0)) {
    throw new Error("Candidate page context is incomplete.");
  }
  return {
    page_width: Geometry.roundTo(pageWidth, 2),
    page_height: Geometry.roundTo(pageHeight, 2),
    pixels_per_metre: Geometry.roundTo(pixelsPerMetre, 6),
    coordinate_space: Geometry.toSafeText(source.coordinate_space || source.coordinateSpace || "normalized_page", 80)
  };
}

function candidateToSection(candidate, index) {
  const section = candidate || {};
  if (!Array.isArray(section.points) || section.points.length < 3) {
    throw new Error("Candidate section needs a usable outline.");
  }
  return {
    client_section_id: Geometry.toSafeText(section.candidate_id || section.id || "candidate-" + (index + 1), 80),
    label: Geometry.toSafeText(section.label || "Candidate area " + (index + 1), 120),
    section_type: Geometry.toSafeText(section.section_type || "room", 40),
    selection_state: "not_sure",
    confidence: String(section.confidence || "low").toLowerCase() === "medium" ? "medium" : "low",
    points: section.points,
    coordinate_space: Geometry.toSafeText(section.coordinate_space || "normalized_page", 80),
    notes: "Candidate only. Internal reviewer must inspect before approval."
  };
}

function buildCandidateVersionDraftPayload(requestBody, candidatePayload, pageContext) {
  const request = CandidateRequest.normalizeCandidateRequest(requestBody);
  const payload = candidatePayload || {};
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid candidate payload.");
  }
  if (containsForbiddenShape(payload)) {
    throw new Error("Candidate payload includes unsupported fields.");
  }
  const candidates = Array.isArray(payload.candidates) ? payload.candidates : [];
  if (!candidates.length) {
    throw new Error("Candidate payload needs at least one section.");
  }
  if (candidates.length > request.max_candidates) {
    throw new Error("Candidate payload exceeds the requested limit.");
  }
  const context = normalizeContext(pageContext);
  const draftPayload = {
    source: "floorplan_detection_candidate",
    measurement_mode: "candidate_review",
    version_source: "system",
    confidence_level: "low",
    page_key: request.page_key,
    page_width: context.page_width,
    page_height: context.page_height,
    pixels_per_metre: context.pixels_per_metre,
    coordinate_space: context.coordinate_space,
    sections: candidates.map(candidateToSection)
  };
  const normalized = Geometry.validateMeasurementPayload(draftPayload, { forceReviewRequired: true });
  return {
    request: request,
    payload: normalized,
    safe_summary: {
      candidate_count: normalized.sections.length,
      selected_area_m2: normalized.selected_area_m2,
      measured_area_m2: normalized.measured_area_m2,
      review_required: normalized.review_required,
      version_source: normalized.version_source
    }
  };
}

module.exports = {
  buildCandidateVersionDraftPayload: buildCandidateVersionDraftPayload,
  _test: {
    containsForbiddenShape: containsForbiddenShape,
    normalizeContext: normalizeContext
  }
};
