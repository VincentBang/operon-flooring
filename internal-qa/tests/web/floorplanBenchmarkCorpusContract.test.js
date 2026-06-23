"use strict";

const assert = require("assert");
const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Harness = require("../../lib/floorplanBenchmarkHarness");

(function testCorpusHasUsefulCoverage() {
  assert.ok(Array.isArray(corpus), "Floorplan benchmark corpus must export an array.");
  assert.ok(corpus.length >= 10, "Phase 2.5 benchmark corpus should contain at least 10 known-safe cases.");

  const ids = new Set(corpus.map(function (item) { return item.id; }));
  assert.equal(ids.size, corpus.length, "Benchmark item ids must be unique.");

  const qualities = new Set(corpus.map(function (item) { return item.plan_quality; }));
  assert.ok(qualities.has("clean_vector"), "Corpus should include clean vector-like plan cases.");
  assert.ok(qualities.has("low_contrast_scan"), "Corpus should include low-confidence scan-like cases.");
  assert.ok(qualities.has("mixed_boundary"), "Corpus should include ambiguous boundary cases.");

  const hasExcludedSection = corpus.some(function (item) {
    return item.reviewed.sections.some(function (section) {
      return section.selection_state === "exclude";
    });
  });
  const hasNotSureSection = corpus.some(function (item) {
    return item.reviewed.sections.some(function (section) {
      return section.selection_state === "not_sure";
    });
  });
  assert.ok(hasExcludedSection, "Corpus should include excluded sections.");
  assert.ok(hasNotSureSection, "Corpus should include not-sure sections.");
})();

(function testBenchmarkHarnessPassesReviewedFixtures() {
  const report = Harness.runBenchmark(corpus);
  assert.equal(report.benchmark_version, "floorplan-phase-2.5-v1");
  assert.equal(report.item_count, corpus.length);
  assert.equal(report.failed_count, 0, JSON.stringify(report.results.filter(function (result) {
    return !result.passed;
  }), null, 2));
  assert.equal(report.ready_for_phase3_detection_spike, true, "Phase 3 detection work should only start after the benchmark harness passes.");
})();

(function testHarnessRejectsInternalCommercialLanguage() {
  assert.throws(function () {
    Harness.scoreItem(Object.assign({}, corpus[0], {
      id: "bad-sensitive-fixture",
      reviewer_notes: "This fixture mentions supplier cost and should fail."
    }));
  }, /sensitive fixture text/i);
})();

(function testHarnessRejectsGeometryMismatch() {
  const bad = JSON.parse(JSON.stringify(corpus[0]));
  bad.id = "bad-area-mismatch";
  bad.expected_reviewed_area_m2 = 999;
  const scored = Harness.scoreItem(bad);
  assert.equal(scored.passed, false);
  assert.ok(scored.failures.includes("reviewed_area_mismatch"));
})();

console.log("floorplanBenchmarkCorpusContract.test.js passed");
