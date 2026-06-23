"use strict";

const assert = require("assert");

const Comparator = require("../../lib/floorplanBenchmarkReportComparator");

function report(id, options) {
  const settings = Object.assign({
    failed_count: 0,
    itemErrors: [4, 8],
    contractPass: [true, true]
  }, options || {});
  return {
    benchmark_version: "floorplan-phase-2.5-v1",
    failed_count: settings.failed_count,
    artifact_metadata: {
      report_id: id
    },
    quick_room_baseline: {
      results: [
        {
          id: "synthetic-rectangle-clean",
          area_error_percent: settings.itemErrors[0],
          passed_contract: settings.contractPass[0]
        },
        {
          id: "synthetic-long-open-plan",
          area_error_percent: settings.itemErrors[1],
          passed_contract: settings.contractPass[1]
        }
      ]
    }
  };
}

(function testComparisonAllowsNonRegressingCandidate() {
  const comparison = Comparator.compareReports(
    report("baseline", { itemErrors: [4, 8] }),
    report("candidate", { itemErrors: [3, 7] })
  );
  assert.equal(comparison.safe_to_continue_detection_spike, true);
  assert.equal(comparison.regression_count, 0);
  assert.equal(comparison.baseline_average_candidate_area_error_percent, 6);
  assert.equal(comparison.candidate_average_candidate_area_error_percent, 5);
  assert.ok(Comparator.renderComparisonMarkdown(comparison).includes("Safe to continue detection spike: yes"));
})();

(function testComparisonBlocksRegression() {
  const comparison = Comparator.compareReports(
    report("baseline", { itemErrors: [4, 8] }),
    report("candidate", { itemErrors: [7, 14], contractPass: [true, false] })
  );
  assert.equal(comparison.safe_to_continue_detection_spike, false);
  assert.equal(comparison.regression_count, 2);
  assert.equal(comparison.quick_room_contract_pass_delta, -1);
})();

(function testComparisonRejectsSensitiveReportText() {
  assert.throws(function () {
    Comparator.compareReports(
      report("baseline"),
      Object.assign(report("candidate"), { storage_path: "private/path.pdf" })
    );
  }, /sensitive text/i);
})();

console.log("floorplanBenchmarkComparatorContract.test.js passed");
