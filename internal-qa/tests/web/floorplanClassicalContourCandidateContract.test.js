"use strict";

const assert = require("assert");
const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Classical = require("../../fixtures/floorplanClassicalContourCandidates");
const Harness = require("../../lib/floorplanBenchmarkHarness");

(function testClassicalContourProducesReviewOnlyCandidatesForCorpus() {
  const results = corpus.map(function (item) {
    const payload = Classical.classicalContourCandidatePayloadForItem(item);
    assert.equal(payload.method, "classical_vision_spike");
    assert.equal(payload.final, false);
    assert.equal(payload.customer_visible, false);
    assert.equal(payload.benchmark_item_id, item.id);
    assert.ok(payload.candidates.length >= 1, "Expected at least one classical contour candidate for " + item.id);
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.selection_state === "not_sure";
    }), "Classical contour candidates must enter review as not_sure.");
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.confidence === "low" || candidate.confidence === "medium";
    }), "Classical contour candidates must not claim high confidence.");
    return Harness.scoreCandidatePayload(item, payload);
  });

  assert.equal(results.length, corpus.length);
  assert.ok(results.every(function (result) {
    return result.passed_contract;
  }), "All classical contour candidates should satisfy the review-only adapter contract.");
  assert.ok(results.every(function (result) {
    return result.candidate_selected_area_m2 === 0;
  }), "Classical contour candidate areas must not become selected quote area.");
})();

(function testClassicalContourSkipsExcludedSections() {
  const item = corpus.find(function (entry) {
    return entry.id === "synthetic-wet-area-excluded";
  });
  const payload = Classical.classicalContourCandidatePayloadForItem(item);
  assert.deepEqual(payload.candidates.map(function (candidate) {
    return candidate.label;
  }), ["Living contour candidate", "Bedroom contour candidate"]);
  const serialized = JSON.stringify(payload);
  assert.equal(serialized.includes("Bathroom contour candidate"), false);
})();

(function testClassicalContourKeepsReviewRiskVisibleForIrregularShapes() {
  const item = corpus.find(function (entry) {
    return entry.id === "synthetic-l-shaped-living";
  });
  const result = Harness.scoreCandidatePayload(item, Classical.classicalContourCandidatePayloadForItem(item));
  assert.equal(result.passed_contract, true);
  assert.equal(result.review_required, true);
  assert.equal(result.candidate_selected_area_m2, 0);
  assert.equal(result.measured_area_warning, true, "Bounding-contour spike should flag irregular L-shape drift for reviewer validation.");
})();

(function testClassicalContourPayloadContainsNoCustomerHandoffFields() {
  const item = corpus[0];
  const serialized = JSON.stringify(Classical.classicalContourCandidatePayloadForItem(item));
  assert.equal(serialized.includes("handoff_url"), false);
  assert.equal(serialized.includes("quote_handoff_url"), false);
  assert.equal(serialized.includes("approved"), false);
  assert.equal(serialized.includes("customer_visible\":true"), false);
})();

console.log("floorplanClassicalContourCandidateContract.test.js passed");
