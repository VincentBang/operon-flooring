"use strict";

const assert = require("assert");
const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Hybrid = require("../../fixtures/floorplanHybridSelectorCandidates");
const Harness = require("../../lib/floorplanBenchmarkHarness");

(function testHybridSelectorProducesReviewOnlyCandidatesForCorpus() {
  const results = corpus.map(function (item) {
    const payload = Hybrid.hybridSelectorCandidatePayloadForItem(item);
    assert.equal(payload.method, "hybrid_selector_spike");
    assert.equal(payload.final, false);
    assert.equal(payload.customer_visible, false);
    assert.ok(payload.selected_method_key, "Hybrid payload should record selected method.");
    assert.ok(payload.selection_reason.length > 20, "Hybrid payload should record a reviewer-facing selection reason.");
    assert.ok(payload.candidates.length >= 1, "Expected at least one hybrid candidate for " + item.id);
    assert.ok(payload.candidates.every(function (candidate) {
      return candidate.selection_state === "not_sure";
    }), "Hybrid candidates must enter review as not_sure.");
    return Harness.scoreCandidatePayload(item, payload);
  });

  assert.equal(results.length, corpus.length);
  assert.ok(results.every(function (result) {
    return result.passed_contract;
  }), "All hybrid selector candidates should satisfy the review-only adapter contract.");
  assert.ok(results.every(function (result) {
    return result.candidate_selected_area_m2 === 0;
  }), "Hybrid candidate areas must not become selected quote area.");
})();

(function testHybridSelectorRulesAreExplicit() {
  const byId = corpus.reduce(function (map, item) {
    map[item.id] = item;
    return map;
  }, {});
  assert.equal(Hybrid.chooseHybridMethodForItem(byId["synthetic-rectangle-clean"]).method_key, "classical_contour_spike");
  assert.equal(Hybrid.chooseHybridMethodForItem(byId["synthetic-two-room-apartment"]).method_key, "classical_contour_spike");
  assert.equal(Hybrid.chooseHybridMethodForItem(byId["synthetic-l-shaped-living"]).method_key, "manual_seed_baseline");
  assert.equal(Hybrid.chooseHybridMethodForItem(byId["synthetic-low-confidence-scan"]).method_key, "manual_seed_baseline");
  assert.equal(Hybrid.chooseHybridMethodForItem(byId["synthetic-irregular-hallway"]).method_key, "manual_seed_baseline");
  assert.equal(Hybrid.chooseHybridMethodForItem(byId["synthetic-stairs-void-excluded"]).method_key, "quick_room_baseline");
})();

(function testHybridSelectorKeepsWarningProfileLow() {
  const results = corpus.map(function (item) {
    return Harness.scoreCandidatePayload(item, Hybrid.hybridSelectorCandidatePayloadForItem(item));
  });
  assert.equal(results.filter(function (result) {
    return result.measured_area_warning;
  }).length, 0, "Hybrid selector should avoid measured-area warning cases in the current corpus.");
  const average = results.reduce(function (sum, result) {
    return sum + Number(result.measured_area_error_percent);
  }, 0) / results.length;
  assert.ok(average < 4, "Hybrid selector average measured error should stay below 4% on synthetic corpus.");
})();

(function testHybridSelectorPayloadContainsNoCustomerHandoffFields() {
  const serialized = JSON.stringify(Hybrid.hybridSelectorCandidatePayloadForItem(corpus[0]));
  assert.equal(serialized.includes("handoff_url"), false);
  assert.equal(serialized.includes("quote_handoff_url"), false);
  assert.equal(serialized.includes("approved"), false);
  assert.equal(serialized.includes("customer_visible\":true"), false);
})();

console.log("floorplanHybridSelectorCandidateContract.test.js passed");
