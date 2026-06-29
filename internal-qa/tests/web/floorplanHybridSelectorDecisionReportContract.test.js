"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const DecisionReport = require("../../lib/floorplanHybridSelectorDecisionReport");

const repoRoot = path.resolve(__dirname, "../../..");
const decisionScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanHybridSelectorDecisions.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testDecisionReportExplainsEveryFixture() {
  const report = DecisionReport.buildHybridSelectorDecisionReport(corpus);
  assert.equal(report.report_type, "floorplan_hybrid_selector_decision_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.item_count, corpus.length);
  assert.equal(report.passed_contract_count, corpus.length);
  assert.equal(report.selected_area_safe_count, corpus.length);
  assert.equal(report.measured_warning_count, 0);
  assert.ok(report.average_measured_area_error_percent < 4);
  assert.equal(report.safe_to_continue_detection_spike, true);
  assert.ok(report.method_counts.classical_contour_spike >= 1);
  assert.ok(report.method_counts.manual_seed_baseline >= 1);
  assert.ok(report.method_counts.quick_room_baseline >= 1);
  assert.equal(report.decisions.length, corpus.length);
  assert.ok(report.decisions.every(function (row) {
    return row.selection_reason.length > 20
      && row.candidate_section_labels.length >= 1
      && row.selected_area_safe
      && row.review_required;
  }));
  assertNoSensitiveText(JSON.stringify(report), "decision report JSON");
})();

(function testDecisionMarkdownIsReviewerReadable() {
  const report = DecisionReport.buildHybridSelectorDecisionReport(corpus);
  const markdown = DecisionReport.renderHybridSelectorDecisionMarkdown(report, {
    report_id: "test-report",
    created_at: "2026-06-29T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Hybrid Selector Decision Report"));
  assert.ok(markdown.includes("## Method Mix"));
  assert.ok(markdown.includes("## Fixture Decisions"));
  assert.ok(markdown.includes("## Section Labels"));
  assert.ok(markdown.includes("Classical contour spike"));
  assert.ok(markdown.includes("Manual-seed baseline"));
  assert.ok(markdown.includes("Quick-room baseline"));
  assert.ok(markdown.includes("Selected quote area stays at `0`"));
  assertNoSensitiveText(markdown, "decision markdown");
})();

(function testDecisionCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-hybrid-decisions-"));
  const json = childProcess.spawnSync(process.execPath, [
    decisionScript,
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
  assert.ok(jsonFile, "Decision CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Decision CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "hybrid-selector-decisions");
  assert.equal(parsed.safe_to_continue_detection_spike, true);
  assert.ok(markdown.includes("Fixture Decisions"));
  assertNoSensitiveText(JSON.stringify(parsed), "written decision JSON");
  assertNoSensitiveText(markdown, "written decision markdown");
})();

(function testDecisionCliUsesDefaultOutputDirectory() {
  const json = childProcess.spawnSync(process.execPath, [
    decisionScript,
    "--json",
    "--write-artifacts"
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"safe_to_continue_detection_spike\": true"));
})();

console.log("floorplanHybridSelectorDecisionReportContract.test.js passed");
