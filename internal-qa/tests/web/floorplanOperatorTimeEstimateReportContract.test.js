"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const TimeEstimates = require("../../lib/floorplanOperatorTimeEstimateReport");

const repoRoot = path.resolve(__dirname, "../../..");
const estimateScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanOperatorTimeEstimates.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testOperatorTimeReportIsLocalAndActionable() {
  const report = TimeEstimates.buildFloorplanOperatorTimeEstimateReport(corpus);
  assert.equal(report.report_type, "floorplan_operator_time_estimate_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.fixture_count, corpus.length);
  assert.equal(report.safe_for_internal_planning, true);
  assert.ok(report.total_baseline_manual_minutes > 0);
  assert.ok(report.total_candidate_review_minutes > 0);
  assert.ok(report.total_estimated_minutes_saved > 0);
  assert.ok(report.average_estimated_minutes_saved > 0);
  assert.ok(Object.keys(report.taxonomy_mix).length >= 2);
  assert.equal(report.estimate_rows.length, corpus.length);
  assert.ok(report.estimate_rows.every(function (row) {
    return row.baseline_manual_minutes >= row.candidate_review_minutes
      && row.estimated_minutes_saved >= 0
      && row.reviewed_section_count >= 1
      && row.reviewer_time_action;
  }));
  assertNoSensitiveText(JSON.stringify(report), "operator time report JSON");
})();

(function testOperatorTimeMarkdownIsReadableAndSafe() {
  const report = TimeEstimates.buildFloorplanOperatorTimeEstimateReport(corpus);
  const markdown = TimeEstimates.renderFloorplanOperatorTimeEstimateMarkdown(report, {
    report_id: "test-time-estimates",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Operator Time Estimate Report"));
  assert.ok(markdown.includes("## Review Outcome Mix"));
  assert.ok(markdown.includes("## Fixture Estimates"));
  assert.ok(markdown.includes("does not change public floorplan behaviour"));
  assertNoSensitiveText(markdown, "operator time markdown");
})();

(function testOperatorTimeCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-time-estimates-"));
  const json = childProcess.spawnSync(process.execPath, [
    estimateScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"safe_for_internal_planning\": true"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Operator time CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Operator time CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "operator-time-estimates");
  assert.equal(parsed.safe_for_internal_planning, true);
  assert.ok(markdown.includes("Fixture Estimates"));
  assertNoSensitiveText(JSON.stringify(parsed), "written operator time JSON");
  assertNoSensitiveText(markdown, "written operator time markdown");
})();

console.log("floorplanOperatorTimeEstimateReportContract.test.js passed");
