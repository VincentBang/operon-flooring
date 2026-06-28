"use strict";

const assert = require("assert");
const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const ManualSeed = require("../../fixtures/floorplanManualSeedBaselineCandidates");
const Harness = require("../../lib/floorplanBenchmarkHarness");

(function testManualSeedProducesReviewOnlyCandidatesForAllFixtures() {
  const results = corpus.map(function (item) {
    const payload = ManualSeed.manualSeedCandidatePayloadForItem(item);
    assert.equal(payload.method, "manual_seed_spike");
    assert.equal(payload.final, false);
    assert.equal(payload.customer_visible, false);
    assert.equal(payload.benchmark_item_id, item.id);
    assert.equal(payload.candidates.length, item.reviewed.sections.length);
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.selection_state === "not_sure";
    }), "Manual-seed candidates must enter review as not_sure.");
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.confidence === "low" || candidate.confidence === "medium";
    }), "Manual-seed candidates must not claim high confidence.");
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.seed_point && candidate.seed_point.x >= 0 && candidate.seed_point.x <= 1 && candidate.seed_point.y >= 0 && candidate.seed_point.y <= 1;
    }), "Manual-seed candidates should include a normalized operator seed point.");
    return Harness.scoreCandidatePayload(item, payload);
  });

  assert.equal(results.length, corpus.length);
  assert.ok(results.every(function (result) {
    return result.passed_contract;
  }), "All manual-seed candidates should satisfy the review-only adapter contract.");
  assert.ok(results.every(function (result) {
    return result.candidate_selected_area_m2 === 0;
  }), "Manual-seed candidates must not become selected quote area.");
})();

(function testManualSeedRejectsUnsafeCandidateEscalationThroughAdapter() {
  const item = corpus[0];
  const payload = ManualSeed.manualSeedCandidatePayloadForItem(item);
  payload.candidates[0].confidence = "high";
  assert.throws(function () {
    Harness.scoreCandidatePayload(item, payload);
  }, /high confidence/i);
})();

(function testManualSeedPayloadContainsNoCustomerHandoffFields() {
  const item = corpus[0];
  const serialized = JSON.stringify(ManualSeed.manualSeedCandidatePayloadForItem(item));
  assert.equal(serialized.includes("handoff_url"), false);
  assert.equal(serialized.includes("quote_handoff_url"), false);
  assert.equal(serialized.includes("approved"), false);
  assert.equal(serialized.includes("customer_visible\":true"), false);
})();

console.log("floorplanManualSeedBaselineCandidateContract.test.js passed");
