"use strict";

const assert = require("assert");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Harness = require("../../lib/floorplanBenchmarkHarness");
const SeedBox = require("../../fixtures/floorplanSeedBoxCandidates");

(function testSeedBoxProducesReviewOnlyCandidatesForAllFixtures() {
  const results = corpus.map(function (item) {
    const payload = SeedBox.seedBoxCandidatePayloadForItem(item);
    assert.equal(payload.method, "manual_seed_spike");
    assert.equal(payload.selected_method_key, "seed_box_spike");
    assert.equal(payload.final, false);
    assert.equal(payload.customer_visible, false);
    assert.equal(payload.benchmark_item_id, item.id);
    assert.ok(payload.candidates.length >= 1);
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.selection_state === "not_sure";
    }));
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.confidence === "low";
    }));
    return Harness.scoreCandidatePayload(item, payload, { areaWarningThresholdPercent: 80 });
  });

  assert.equal(results.length, corpus.length);
  assert.ok(results.every(function (result) {
    return result.passed_contract;
  }), "Seed-box candidates should satisfy the review-only adapter contract.");
  assert.ok(results.every(function (result) {
    return result.candidate_selected_area_m2 === 0;
  }), "Seed-box candidates must not become selected quote area.");
})();

(function testSeedBoxRejectsUnsafeOrExcludedSeeds() {
  const item = corpus.find(function (entry) {
    return entry.id === "synthetic-wet-area-excluded";
  });
  const result = SeedBox.seedBoxCandidatePayloadForSeedsWithQuality(item, [
    { x: 0.2, y: 0.2 },
    { x: 0.2, y: 0.55 },
    { x: 0.95, y: 0.95 }
  ]);

  assert.equal(result.quality_summary.accepted_seed_count, 1);
  assert.equal(result.quality_summary.rejected_seed_count, 2);
  assert.equal(result.quality_summary.rejected_seed_reasons.excluded_reviewed_section, 1);
  assert.equal(result.quality_summary.rejected_seed_reasons.outside_reviewed_section, 1);
})();

(function testSeedBoxGeometryIsSafeAndBounded() {
  const points = SeedBox._test.squareAroundSeed({ x: 0.02, y: 0.98 }, 0.09);
  assert.equal(points.length, 4);
  assert.ok(points.every(function (point) {
    return point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1;
  }));
})();

(function testSeedBoxPayloadContainsNoCustomerHandoffFields() {
  const item = corpus[0];
  const serialized = JSON.stringify(SeedBox.seedBoxCandidatePayloadForItem(item));
  assert.equal(serialized.includes("handoff_url"), false);
  assert.equal(serialized.includes("quote_handoff_url"), false);
  assert.equal(serialized.includes("approved"), false);
  assert.equal(serialized.includes("customer_visible\":true"), false);
})();

console.log("floorplanSeedBoxCandidateContract.test.js passed");
