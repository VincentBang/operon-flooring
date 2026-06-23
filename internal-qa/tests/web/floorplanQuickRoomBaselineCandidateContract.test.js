"use strict";

const assert = require("assert");
const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Baseline = require("../../fixtures/floorplanQuickRoomBaselineCandidates");
const Harness = require("../../lib/floorplanBenchmarkHarness");

function eligibleItems() {
  return corpus.filter(function (item) {
    return item.plan_quality === "clean_vector" && Number(item.expected_section_count) <= 2;
  });
}

(function testQuickRoomBaselineProducesCandidates() {
  const item = corpus.find(function (entry) {
    return entry.id === "synthetic-rectangle-clean";
  });
  const payload = Baseline.quickRoomCandidatePayloadForItem(item);

  assert.equal(payload.method, "quick_room_baseline");
  assert.equal(payload.final, false);
  assert.equal(payload.customer_visible, false);
  assert.ok(payload.candidates.length >= 1, "Quick-room baseline should produce at least one candidate for a clean rectangle.");
  assert.ok(payload.candidates.every(function (candidate) {
    return candidate.selection_state === "not_sure";
  }), "Quick-room baseline candidates must enter the adapter as not_sure.");
  assert.ok(payload.candidates.every(function (candidate) {
    return candidate.confidence === "low" || candidate.confidence === "medium";
  }), "Quick-room baseline candidates must be downshifted before adapter scoring.");
})();

(function testQuickRoomBaselineCandidateCanBeScoredWithoutApproval() {
  const item = corpus.find(function (entry) {
    return entry.id === "synthetic-rectangle-clean";
  });
  const result = Harness.scoreCandidatePayload(item, Baseline.quickRoomCandidatePayloadForItem(item));

  assert.equal(result.candidate_method, "quick_room_baseline");
  assert.equal(result.passed_contract, true);
  assert.equal(result.final, false);
  assert.equal(result.customer_visible, false);
  assert.equal(result.review_required, true);
  assert.equal(result.candidate_selected_area_m2, 0);
  assert.ok(result.candidate_measured_area_m2 > 0);
})();

(function testQuickRoomBaselineCoverageSet() {
  const items = eligibleItems();
  assert.ok(items.length >= 5, "Quick-room baseline fixture set should cover several clean benchmark cases.");

  const results = items.map(function (item) {
    const payload = Baseline.quickRoomCandidatePayloadForItem(item);
    assert.ok(payload.candidates.length >= 1, "Expected at least one quick-room candidate for " + item.id);
    return Harness.scoreCandidatePayload(item, payload);
  });

  assert.ok(results.every(function (result) {
    return result.passed_contract;
  }), "All quick-room baseline candidates should satisfy the review-only adapter contract.");
  assert.ok(results.every(function (result) {
    return result.candidate_selected_area_m2 === 0;
  }), "Quick-room candidate areas must not become selected quote area.");
})();

(function testNoCustomerHandoffOrApprovalFields() {
  const item = corpus[0];
  const serialized = JSON.stringify(Baseline.quickRoomCandidatePayloadForItem(item));
  assert.equal(serialized.includes("handoff_url"), false);
  assert.equal(serialized.includes("quote_handoff_url"), false);
  assert.equal(serialized.includes("approved"), false);
  assert.equal(serialized.includes("customer_visible\":true"), false);
})();

console.log("floorplanQuickRoomBaselineCandidateContract.test.js passed");
