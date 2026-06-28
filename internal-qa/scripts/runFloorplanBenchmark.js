#!/usr/bin/env node
"use strict";

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Baseline = require("../fixtures/floorplanQuickRoomBaselineCandidates");
const Classical = require("../fixtures/floorplanClassicalContourCandidates");
const Hybrid = require("../fixtures/floorplanHybridSelectorCandidates");
const ManualSeed = require("../fixtures/floorplanManualSeedBaselineCandidates");
const Harness = require("../lib/floorplanBenchmarkHarness");
const ReportWriter = require("../lib/floorplanBenchmarkReportWriter");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const report = Harness.runBenchmark(corpus);
const quickRoomItems = corpus.filter(function (item) {
  return item.plan_quality === "clean_vector" && Number(item.expected_section_count) <= 2;
});
const quickRoomResults = quickRoomItems.map(function (item) {
  return Harness.scoreCandidatePayload(item, Baseline.quickRoomCandidatePayloadForItem(item));
});
const manualSeedResults = corpus.map(function (item) {
  return Harness.scoreCandidatePayload(item, ManualSeed.manualSeedCandidatePayloadForItem(item));
});
const classicalContourResults = corpus.map(function (item) {
  return Harness.scoreCandidatePayload(item, Classical.classicalContourCandidatePayloadForItem(item));
});
const hybridSelectorResults = corpus.map(function (item) {
  return Harness.scoreCandidatePayload(item, Hybrid.hybridSelectorCandidatePayloadForItem(item));
});
const fullReport = Object.assign({}, report, {
  quick_room_baseline: {
    item_count: quickRoomResults.length,
    passed_contract_count: quickRoomResults.filter(function (result) { return result.passed_contract; }).length,
    results: quickRoomResults
  },
  manual_seed_baseline: {
    item_count: manualSeedResults.length,
    passed_contract_count: manualSeedResults.filter(function (result) { return result.passed_contract; }).length,
    results: manualSeedResults
  },
  classical_contour_spike: {
    item_count: classicalContourResults.length,
    passed_contract_count: classicalContourResults.filter(function (result) { return result.passed_contract; }).length,
    measured_warning_count: classicalContourResults.filter(function (result) { return result.measured_area_warning; }).length,
    results: classicalContourResults
  },
  hybrid_selector_spike: {
    item_count: hybridSelectorResults.length,
    passed_contract_count: hybridSelectorResults.filter(function (result) { return result.passed_contract; }).length,
    measured_warning_count: hybridSelectorResults.filter(function (result) { return result.measured_area_warning; }).length,
    results: hybridSelectorResults
  }
});
const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const method = argValue("--method=", "quick-room-baseline");
const outputDir = argValue("--output-dir=", null);

if (writeArtifacts) {
  const artifact = ReportWriter.writeBenchmarkArtifacts(fullReport, {
    method: method,
    outputDir: outputDir || undefined
  });
  console.log("Wrote benchmark artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(fullReport, null, 2) + "\n");
  process.exit(report.failed_count ? 1 : 0);
}

console.log("Operon Floorplan Phase 2.5 Benchmark");
console.log("--------------------------------------");
console.log("Items: " + report.item_count);
console.log("Passed: " + report.passed_count);
console.log("Failed: " + report.failed_count);
console.log("Warnings: " + report.warning_count);
console.log("Average customer trace error: " + (report.average_customer_area_error_percent === null ? "n/a" : report.average_customer_area_error_percent + "%"));
console.log("Ready for Phase 3 detection spike: " + (report.ready_for_phase3_detection_spike ? "yes" : "no"));
console.log("Quick-room baseline adapter cases: " + quickRoomResults.length + "/" + quickRoomResults.filter(function (result) { return result.passed_contract; }).length + " contract pass");
console.log("Manual-seed baseline adapter cases: " + manualSeedResults.length + "/" + manualSeedResults.filter(function (result) { return result.passed_contract; }).length + " contract pass");
console.log("Classical contour spike adapter cases: " + classicalContourResults.length + "/" + classicalContourResults.filter(function (result) { return result.passed_contract; }).length + " contract pass");
console.log("Hybrid selector spike adapter cases: " + hybridSelectorResults.length + "/" + hybridSelectorResults.filter(function (result) { return result.passed_contract; }).length + " contract pass");
console.log("");

report.results.forEach(function (result) {
  const status = result.passed ? "PASS" : "FAIL";
  const warning = result.customer_area_warning ? " warning=customer-area-drift" : "";
  console.log(
    status + " " + result.id
    + " reviewed=" + result.reviewed_area_m2 + "m2"
    + " expected=" + result.expected_reviewed_area_m2 + "m2"
    + " sections=" + result.reviewed_section_count
    + " confidence=" + result.expected_confidence
    + warning
  );
  if (result.failures.length) {
    console.log("  failures: " + result.failures.join(", "));
  }
});

console.log("");
console.log("Quick-room baseline candidates");
console.log("------------------------------");
quickRoomResults.forEach(function (result) {
  console.log(
    (result.passed_contract ? "PASS" : "FAIL") + " " + result.id
    + " candidateMeasured=" + result.candidate_measured_area_m2 + "m2"
    + " reviewed=" + result.reviewed_area_m2 + "m2"
    + " measuredError=" + result.measured_area_error_percent + "%"
    + " selected=" + result.candidate_selected_area_m2 + "m2"
    + " reviewRequired=" + result.review_required
  );
});

console.log("");
console.log("Manual-seed baseline candidates");
console.log("-------------------------------");
manualSeedResults.forEach(function (result) {
  console.log(
    (result.passed_contract ? "PASS" : "FAIL") + " " + result.id
    + " candidateMeasured=" + result.candidate_measured_area_m2 + "m2"
    + " reviewed=" + result.reviewed_area_m2 + "m2"
    + " measuredError=" + result.measured_area_error_percent + "%"
    + " selected=" + result.candidate_selected_area_m2 + "m2"
    + " reviewRequired=" + result.review_required
  );
});

console.log("");
console.log("Classical contour spike candidates");
console.log("----------------------------------");
classicalContourResults.forEach(function (result) {
  const warning = result.measured_area_warning ? " warning=measured-area-drift" : "";
  console.log(
    (result.passed_contract ? "PASS" : "FAIL") + " " + result.id
    + " candidateMeasured=" + result.candidate_measured_area_m2 + "m2"
    + " reviewed=" + result.reviewed_area_m2 + "m2"
    + " measuredError=" + result.measured_area_error_percent + "%"
    + " selected=" + result.candidate_selected_area_m2 + "m2"
    + " reviewRequired=" + result.review_required
    + warning
  );
});

console.log("");
console.log("Hybrid selector spike candidates");
console.log("--------------------------------");
hybridSelectorResults.forEach(function (result) {
  const warning = result.measured_area_warning ? " warning=measured-area-drift" : "";
  console.log(
    (result.passed_contract ? "PASS" : "FAIL") + " " + result.id
    + " candidateMeasured=" + result.candidate_measured_area_m2 + "m2"
    + " reviewed=" + result.reviewed_area_m2 + "m2"
    + " measuredError=" + result.measured_area_error_percent + "%"
    + " selected=" + result.candidate_selected_area_m2 + "m2"
    + " reviewRequired=" + result.review_required
    + warning
  );
});

process.exit(report.failed_count ? 1 : 0);
