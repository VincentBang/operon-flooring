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
          measured_area_error_percent: settings.itemErrors[0],
          passed_contract: settings.contractPass[0],
          review_required: true,
          candidate_selected_area_m2: 0
        },
        {
          id: "synthetic-long-open-plan",
          area_error_percent: settings.itemErrors[1],
          measured_area_error_percent: settings.itemErrors[1],
          passed_contract: settings.contractPass[1],
          review_required: true,
          candidate_selected_area_m2: 0
        }
      ]
    },
    manual_seed_baseline: {
      results: [
        {
          id: "synthetic-rectangle-clean",
          area_error_percent: 4,
          measured_area_error_percent: 4,
          passed_contract: true,
          review_required: true,
          candidate_selected_area_m2: 0
        },
        {
          id: "synthetic-long-open-plan",
          area_error_percent: 3,
          measured_area_error_percent: 3,
          passed_contract: true,
          review_required: true,
          candidate_selected_area_m2: 0
        }
      ]
    },
    classical_contour_spike: {
      results: [
        {
          id: "synthetic-rectangle-clean",
          area_error_percent: 2,
          measured_area_error_percent: 2,
          passed_contract: true,
          review_required: true,
          candidate_selected_area_m2: 0
        },
        {
          id: "synthetic-long-open-plan",
          area_error_percent: 14,
          measured_area_error_percent: 14,
          measured_area_warning: true,
          passed_contract: true,
          review_required: true,
          candidate_selected_area_m2: 0
        }
      ]
    },
    seed_box_spike: {
      results: [
        {
          id: "synthetic-rectangle-clean",
          area_error_percent: 9,
          measured_area_error_percent: 9,
          passed_contract: true,
          review_required: true,
          candidate_selected_area_m2: 0
        },
        {
          id: "synthetic-long-open-plan",
          area_error_percent: 12,
          measured_area_error_percent: 12,
          measured_area_warning: true,
          passed_contract: true,
          review_required: true,
          candidate_selected_area_m2: 0
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

(function testMethodRankingChoosesBestSafeMethodPerFixture() {
  const ranking = Comparator.rankMethodsInReport(report("ranked"));
  assert.equal(ranking.local_only, true);
  assert.equal(ranking.customer_visible, false);
  assert.equal(ranking.safe_to_continue_detection_spike, true);
  assert.equal(ranking.method_summary.length, 4);
  assert.equal(ranking.fixture_rankings.length, 2);
  assert.equal(ranking.fixture_rankings.find(function (fixture) {
    return fixture.fixture_id === "synthetic-rectangle-clean";
  }).best_method_key, "classical_contour_spike");
  assert.equal(ranking.fixture_rankings.find(function (fixture) {
    return fixture.fixture_id === "synthetic-long-open-plan";
  }).best_method_key, "manual_seed_baseline");
  const markdown = Comparator.renderMethodRankingMarkdown(ranking);
  assert.ok(markdown.includes("# Floorplan Candidate Method Ranking"));
  assert.ok(markdown.includes("classical contour spike"));
  assert.ok(markdown.includes("seed-box spike"));
  assert.ok(markdown.includes("Candidate selected area must remain `0` until reviewed."));
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
