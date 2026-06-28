"use strict";

const Geometry = require("../../netlify/functions/shared/floorplanGeometry");

const SENSITIVE_TEXT_PATTERN = /\b(price|pricing|rate|rates|margin|markup|supplier|cost|secret|token|ocr|transcript|phone|email|address)\b|service[_ -]?role|storage[_ -]?(bucket|path)|file[_ -]?path|signed[_ -]?url|raw[_ -]?text/i;
const ALLOWED_CONFIDENCE = new Set(["low", "medium", "high"]);
const ALLOWED_CANDIDATE_METHODS = new Set(["quick_room_baseline", "classical_vision_spike", "manual_seed_spike", "fixture_adapter"]);

function roundTo(value, places) {
  const factor = Math.pow(10, places || 2);
  return Math.round((Number(value) || 0) * factor) / factor;
}

function walkStrings(value, visitor) {
  if (Array.isArray(value)) {
    value.forEach(function (item) {
      walkStrings(item, visitor);
    });
    return;
  }
  if (value && typeof value === "object") {
    Object.keys(value).forEach(function (key) {
      visitor(key);
      walkStrings(value[key], visitor);
    });
    return;
  }
  if (typeof value === "string") {
    visitor(value);
  }
}

function assertNoSensitiveFixtureText(item) {
  const hits = [];
  walkStrings(item, function (value) {
    if (SENSITIVE_TEXT_PATTERN.test(value)) hits.push(value);
  });
  if (hits.length) {
    throw new Error("Benchmark item " + item.id + " contains sensitive fixture text: " + hits.slice(0, 3).join(", "));
  }
}

function assertBenchmarkShape(item) {
  if (!item || typeof item !== "object") throw new Error("Benchmark item must be an object.");
  if (!/^[a-z0-9-]+$/.test(item.id || "")) throw new Error("Benchmark item id must be a safe slug.");
  if (!item.title || item.title.length < 8) throw new Error("Benchmark item " + item.id + " needs a useful title.");
  if (!item.file_type) throw new Error("Benchmark item " + item.id + " needs file_type.");
  if (!item.plan_quality) throw new Error("Benchmark item " + item.id + " needs plan_quality.");
  if (!item.scale_availability) throw new Error("Benchmark item " + item.id + " needs scale_availability.");
  if (!ALLOWED_CONFIDENCE.has(item.expected_confidence)) throw new Error("Benchmark item " + item.id + " has invalid expected confidence.");
  if (!(Number(item.expected_reviewed_area_m2) > 0)) throw new Error("Benchmark item " + item.id + " needs expected reviewed area.");
  if (!(Number(item.expected_section_count) > 0)) throw new Error("Benchmark item " + item.id + " needs expected section count.");
  if (!item.reviewer_notes || item.reviewer_notes.length < 24) throw new Error("Benchmark item " + item.id + " needs reviewer notes.");
  assertNoSensitiveFixtureText(item);
}

function validateFixturePayload(item, kind) {
  const payload = item[kind];
  if (!payload) return null;
  return Geometry.validateMeasurementPayload(payload, { forceReviewRequired: false });
}

function assertCandidateShape(candidate) {
  if (!candidate || typeof candidate !== "object") throw new Error("Candidate section must be an object.");
  if (candidate.final === true || candidate.approved === true || candidate.customer_visible === true) {
    throw new Error("Floorplan candidates must not be final, approved or customer-visible.");
  }
  if (!Array.isArray(candidate.points) || candidate.points.length < 3) {
    throw new Error("Candidate section needs at least three points.");
  }
  if (candidate.selection_state && candidate.selection_state !== "not_sure") {
    throw new Error("Candidate sections must enter review as not_sure.");
  }
  const confidence = String(candidate.confidence || "low").toLowerCase();
  if (confidence === "high") {
    throw new Error("Candidate adapter must not accept high confidence as final truth.");
  }
}

function candidateSectionToMeasurementSection(candidate, index) {
  assertCandidateShape(candidate);
  return {
    client_section_id: String(candidate.candidate_id || candidate.id || "candidate-" + (index + 1)).slice(0, 80),
    label: String(candidate.label || "Candidate area " + (index + 1)).slice(0, 120),
    section_type: candidate.section_type || "room",
    selection_state: "not_sure",
    confidence: String(candidate.confidence || "low").toLowerCase() === "medium" ? "medium" : "low",
    points: candidate.points,
    coordinate_space: candidate.coordinate_space || "normalized_page",
    notes: "Candidate only. Reviewer must inspect before use."
  };
}

function adaptCandidatePayload(item, candidatePayload, options) {
  assertBenchmarkShape(item);
  const settings = options || {};
  const payload = candidatePayload || {};
  assertNoSensitiveFixtureText(Object.assign({ id: item.id + "-candidate-payload" }, payload));
  if (payload.final === true || payload.approved === true || payload.customer_visible === true) {
    throw new Error("Candidate payload must not be final, approved or customer-visible.");
  }
  if (payload.handoff_url || payload.quote_handoff_url || payload.publish_to_customer) {
    throw new Error("Candidate payload must not include customer handoff or publish fields.");
  }
  if (payload.method && !ALLOWED_CANDIDATE_METHODS.has(payload.method)) {
    throw new Error("Unsupported candidate method.");
  }
  const candidateSections = Array.isArray(payload.candidates) ? payload.candidates : [];
  if (!candidateSections.length) {
    throw new Error("Candidate payload must include candidate sections.");
  }
  if (candidateSections.length > 80) {
    throw new Error("Candidate payload has too many candidate sections.");
  }
  const reviewedPayload = item.reviewed || {};
  const adapted = {
    source: "floorplan_candidate_benchmark",
    measurement_mode: "candidate_adapter",
    version_source: "system",
    confidence_level: "low",
    page_key: item.id + "-candidate",
    page_width: reviewedPayload.page_width,
    page_height: reviewedPayload.page_height,
    pixels_per_metre: reviewedPayload.pixels_per_metre,
    coordinate_space: reviewedPayload.coordinate_space || "normalized_page",
    sections: candidateSections.map(candidateSectionToMeasurementSection)
  };
  if (settings.allowMetadata) {
    adapted.method = payload.method || "fixture_adapter";
  }
  return adapted;
}

function scoreCandidatePayload(item, candidatePayload, options) {
  const settings = Object.assign({ areaWarningThresholdPercent: 10 }, options || {});
  const reviewed = validateFixturePayload(item, "reviewed");
  const adaptedPayload = adaptCandidatePayload(item, candidatePayload);
  const candidate = Geometry.validateMeasurementPayload(adaptedPayload, { forceReviewRequired: true });
  const areaErrorPercent = reviewed.selected_area_m2 > 0
    ? roundTo(Math.abs(candidate.measured_area_m2 - reviewed.selected_area_m2) / reviewed.selected_area_m2 * 100, 2)
    : null;
  const measuredAreaErrorPercent = reviewed.measured_area_m2 > 0
    ? roundTo(Math.abs(candidate.measured_area_m2 - reviewed.measured_area_m2) / reviewed.measured_area_m2 * 100, 2)
    : null;
  const failures = [];
  if (!candidate.review_required) {
    failures.push("candidate_must_require_review");
  }
  if (candidate.sections.some(function (section) { return section.selection_state !== "not_sure"; })) {
    failures.push("candidate_sections_must_be_not_sure");
  }
  if (candidate.version_source !== "system") {
    failures.push("candidate_source_must_be_system");
  }
  return {
    id: item.id,
    candidate_method: candidatePayload && candidatePayload.method || "fixture_adapter",
    reviewed_area_m2: reviewed.selected_area_m2,
    candidate_measured_area_m2: candidate.measured_area_m2,
    candidate_selected_area_m2: candidate.selected_area_m2,
    candidate_section_count: candidate.sections.length,
    area_error_percent: areaErrorPercent,
    measured_area_error_percent: measuredAreaErrorPercent,
    area_warning: areaErrorPercent !== null && areaErrorPercent > settings.areaWarningThresholdPercent,
    measured_area_warning: measuredAreaErrorPercent !== null && measuredAreaErrorPercent > settings.areaWarningThresholdPercent,
    review_required: candidate.review_required,
    final: false,
    customer_visible: false,
    failures: failures,
    passed_contract: failures.length === 0
  };
}

function scoreItem(item, options) {
  const settings = Object.assign({ areaToleranceM2: 0.08, customerWarningThresholdPercent: 7 }, options || {});
  assertBenchmarkShape(item);

  const reviewed = validateFixturePayload(item, "reviewed");
  const customer = validateFixturePayload(item, "customer");
  const expectedArea = roundTo(item.expected_reviewed_area_m2, 2);
  const reviewedAreaDeltaM2 = roundTo(reviewed.selected_area_m2 - expectedArea, 3);
  const measuredExpected = Number(item.expected_measured_area_m2 || item.expected_reviewed_area_m2);
  const measuredAreaDeltaM2 = roundTo(reviewed.measured_area_m2 - measuredExpected, 3);
  const sectionCountDelta = reviewed.sections.length - Number(item.expected_section_count);
  const customerAreaErrorPercent = customer
    ? roundTo(Math.abs(customer.selected_area_m2 - reviewed.selected_area_m2) / reviewed.selected_area_m2 * 100, 2)
    : null;

  const failures = [];
  if (Math.abs(reviewedAreaDeltaM2) > settings.areaToleranceM2) {
    failures.push("reviewed_area_mismatch");
  }
  if (Math.abs(measuredAreaDeltaM2) > settings.areaToleranceM2) {
    failures.push("measured_area_mismatch");
  }
  if (sectionCountDelta !== 0) {
    failures.push("section_count_mismatch");
  }
  if (item.expected_confidence === "low" && !reviewed.review_required) {
    failures.push("low_confidence_should_require_review");
  }

  return {
    id: item.id,
    title: item.title,
    file_type: item.file_type,
    plan_quality: item.plan_quality,
    expected_confidence: item.expected_confidence,
    expected_reviewed_area_m2: expectedArea,
    reviewed_area_m2: reviewed.selected_area_m2,
    reviewed_area_delta_m2: reviewedAreaDeltaM2,
    measured_area_m2: reviewed.measured_area_m2,
    measured_area_delta_m2: measuredAreaDeltaM2,
    reviewed_section_count: reviewed.sections.length,
    section_count_delta: sectionCountDelta,
    review_required: reviewed.review_required,
    customer_area_error_percent: customerAreaErrorPercent,
    customer_area_warning: customerAreaErrorPercent !== null && customerAreaErrorPercent > settings.customerWarningThresholdPercent,
    failures: failures,
    passed: failures.length === 0
  };
}

function runBenchmark(corpus, options) {
  const items = Array.isArray(corpus) ? corpus : [];
  const results = items.map(function (item) {
    return scoreItem(item, options);
  });
  const failed = results.filter(function (result) {
    return !result.passed;
  });
  const warnings = results.filter(function (result) {
    return result.customer_area_warning;
  });
  const averageCustomerAreaErrorPercent = warnings.length || results.some(function (result) { return result.customer_area_error_percent !== null; })
    ? roundTo(results.reduce(function (sum, result) {
      return sum + (Number(result.customer_area_error_percent) || 0);
    }, 0) / results.filter(function (result) { return result.customer_area_error_percent !== null; }).length, 2)
    : null;

  return {
    benchmark_version: "floorplan-phase-2.5-v1",
    item_count: results.length,
    passed_count: results.length - failed.length,
    failed_count: failed.length,
    warning_count: warnings.length,
    average_customer_area_error_percent: averageCustomerAreaErrorPercent,
    ready_for_phase3_detection_spike: failed.length === 0 && results.length >= 10,
    results: results
  };
}

module.exports = {
  adaptCandidatePayload: adaptCandidatePayload,
  runBenchmark: runBenchmark,
  scoreCandidatePayload: scoreCandidatePayload,
  scoreItem: scoreItem,
  _test: {
    assertBenchmarkShape: assertBenchmarkShape,
    assertCandidateShape: assertCandidateShape,
    assertNoSensitiveFixtureText: assertNoSensitiveFixtureText
  }
};
