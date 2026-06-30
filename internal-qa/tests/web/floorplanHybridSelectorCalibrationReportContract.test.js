"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Calibration = require("../../lib/floorplanHybridSelectorCalibrationReport");

const repoRoot = path.resolve(__dirname, "../../..");
const calibrationScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanHybridSelectorCalibration.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testCalibrationReportComparesSelectorToBestMethod() {
  const report = Calibration.buildHybridSelectorCalibrationReport(corpus);
  assert.equal(report.report_type, "floorplan_hybrid_selector_calibration_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.item_count, corpus.length);
  assert.equal(report.tolerance_percent, 2);
  assert.ok(report.exact_match_count >= 1);
  assert.ok(report.best_underlying_match_count >= 1);
  assert.equal(report.within_tolerance_count, corpus.length);
  assert.equal(report.measured_warning_count, 0);
  assert.ok(report.average_error_delta_from_best_percent <= 2);
  assert.ok(report.average_selected_measured_error_percent < 4);
  assert.equal(report.safe_to_continue_detection_spike, true);
  assert.equal(report.calibration_rows.length, corpus.length);
  assert.ok(report.calibration_rows.every(function (row) {
    return row.selection_reason.length > 20
      && row.ranked_method_order.length >= 1
      && row.selected_area_safe
      && row.review_required;
  }));
  assert.ok(report.calibration_rows.some(function (row) {
    return !row.exact_selector_match && row.within_tolerance;
  }), "Calibration should show conservative near-best choices, not only exact wins.");
  assertNoSensitiveText(JSON.stringify(report), "calibration report JSON");
})();

(function testCalibrationMarkdownIsReadableAndSafe() {
  const report = Calibration.buildHybridSelectorCalibrationReport(corpus);
  const markdown = Calibration.renderHybridSelectorCalibrationMarkdown(report, {
    report_id: "test-calibration",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Hybrid Selector Calibration Report"));
  assert.ok(markdown.includes("## Calibration Rows"));
  assert.ok(markdown.includes("## Method Order"));
  assert.ok(markdown.includes("Delta from best"));
  assert.ok(markdown.includes("Candidate selected area remains `0`"));
  assertNoSensitiveText(markdown, "calibration markdown");
})();

(function testCalibrationCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-hybrid-calibration-"));
  const json = childProcess.spawnSync(process.execPath, [
    calibrationScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"safe_to_continue_detection_spike\": true"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Calibration CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Calibration CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "hybrid-selector-calibration");
  assert.equal(parsed.safe_to_continue_detection_spike, true);
  assert.ok(markdown.includes("Calibration Rows"));
  assertNoSensitiveText(JSON.stringify(parsed), "written calibration JSON");
  assertNoSensitiveText(markdown, "written calibration markdown");
})();

console.log("floorplanHybridSelectorCalibrationReportContract.test.js passed");
