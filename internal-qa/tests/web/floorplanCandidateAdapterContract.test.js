"use strict";

const assert = require("assert");
const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Harness = require("../../lib/floorplanBenchmarkHarness");
const Geometry = require("../../../netlify/functions/shared/floorplanGeometry");

function fixtureCandidateFromReviewed(item) {
  return {
    method: "fixture_adapter",
    final: false,
    customer_visible: false,
    candidates: item.reviewed.sections.map(function (section, index) {
      return {
        candidate_id: "candidate-" + (index + 1),
        label: section.label,
        section_type: section.section_type || "room",
        confidence: index === 0 ? "medium" : "low",
        selection_state: "not_sure",
        points: section.points,
        coordinate_space: section.coordinate_space || "normalized_page"
      };
    })
  };
}

(function testCandidateAdapterKeepsCandidatesReviewOnly() {
  const item = corpus[0];
  const adapted = Harness.adaptCandidatePayload(item, fixtureCandidateFromReviewed(item));
  const validated = Geometry.validateMeasurementPayload(adapted, { forceReviewRequired: true });

  assert.equal(adapted.measurement_mode, "candidate_adapter");
  assert.equal(adapted.version_source, "system");
  assert.equal(validated.review_required, true, "Candidate measurements must require review.");
  assert.equal(validated.selected_area_m2, 0, "Candidate not-sure areas must not become selected quote area.");
  assert.equal(validated.measured_area_m2, item.expected_reviewed_area_m2, "Candidate measured area can be scored against reviewed geometry.");
  assert.ok(validated.sections.every(function (section) {
    return section.selection_state === "not_sure";
  }), "Every candidate section must remain not_sure.");
})();

(function testCandidateScoringDoesNotApproveCandidates() {
  const item = corpus[2];
  const result = Harness.scoreCandidatePayload(item, fixtureCandidateFromReviewed(item));

  assert.equal(result.passed_contract, true);
  assert.equal(result.final, false);
  assert.equal(result.customer_visible, false);
  assert.equal(result.review_required, true);
  assert.equal(result.candidate_selected_area_m2, 0);
  assert.equal(result.candidate_measured_area_m2, item.expected_reviewed_area_m2);
})();

(function testCandidateAdapterRejectsFinalOrCustomerVisibleCandidates() {
  const item = corpus[0];
  assert.throws(function () {
    Harness.adaptCandidatePayload(item, Object.assign({}, fixtureCandidateFromReviewed(item), { final: true }));
  }, /must not be final/i);
  assert.throws(function () {
    Harness.adaptCandidatePayload(item, Object.assign({}, fixtureCandidateFromReviewed(item), { customer_visible: true }));
  }, /customer-visible/i);
  assert.throws(function () {
    Harness.adaptCandidatePayload(item, Object.assign({}, fixtureCandidateFromReviewed(item), { handoff_url: "/quote.html" }));
  }, /handoff/i);
})();

(function testCandidateAdapterRejectsUnsafeSectionStateAndConfidence() {
  const item = corpus[0];
  const includeCandidate = fixtureCandidateFromReviewed(item);
  includeCandidate.candidates[0].selection_state = "include";
  assert.throws(function () {
    Harness.adaptCandidatePayload(item, includeCandidate);
  }, /not_sure/i);

  const highConfidenceCandidate = fixtureCandidateFromReviewed(item);
  highConfidenceCandidate.candidates[0].confidence = "high";
  assert.throws(function () {
    Harness.adaptCandidatePayload(item, highConfidenceCandidate);
  }, /high confidence/i);
})();

(function testCandidateAdapterRejectsSensitiveFields() {
  const item = corpus[0];
  const sensitiveCandidate = fixtureCandidateFromReviewed(item);
  sensitiveCandidate.candidates[0].pricing = { internal_rate: 100 };
  assert.throws(function () {
    Harness.adaptCandidatePayload(item, sensitiveCandidate);
  }, /unsupported sensitive fields|sensitive/i);
})();

console.log("floorplanCandidateAdapterContract.test.js passed");
