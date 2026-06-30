"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Tuning = require("../../lib/floorplanHybridSelectorTuningReport");

const repoRoot = path.resolve(__dirname, "../../..");
const tuningScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanHybridSelectorTuning.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testTuningReportCreatesActionableRows() {
  const report = Tuning.buildHybridSelectorTuningReport(corpus);
  assert.equal(report.report_type, "floorplan_hybrid_selector_tuning_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.item_count, corpus.length);
  assert.equal(report.ready_for_next_detection_spike, true);
  assert.equal(report.tuning_rows.length, corpus.length);
  assert.ok(report.priority_counts.keep_rule >= 1);
  assert.ok(report.priority_counts.watch_near_best_tradeoff >= 1 || report.priority_counts.minor_tuning >= 1);
  assert.ok(report.method_tuning_summary.length >= 3);
  assert.ok(report.tuning_rows.every(function (row) {
    return row.priority
      && row.suggested_action.length > 20
      && row.selector_reason.length > 20
      && row.within_tolerance;
  }));
  assertNoSensitiveText(JSON.stringify(report), "tuning report JSON");
})();

(function testTuningMarkdownIsReadableAndSafe() {
  const report = Tuning.buildHybridSelectorTuningReport(corpus);
  const markdown = Tuning.renderHybridSelectorTuningMarkdown(report, {
    report_id: "test-tuning",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Hybrid Selector Tuning Report"));
  assert.ok(markdown.includes("## Priority Counts"));
  assert.ok(markdown.includes("## Method Tuning Summary"));
  assert.ok(markdown.includes("## Fixture Actions"));
  assert.ok(markdown.includes("Internal reviewer approval remains required"));
  assertNoSensitiveText(markdown, "tuning markdown");
})();

(function testTuningCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-hybrid-tuning-"));
  const json = childProcess.spawnSync(process.execPath, [
    tuningScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"ready_for_next_detection_spike\": true"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Tuning CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Tuning CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "hybrid-selector-tuning");
  assert.equal(parsed.ready_for_next_detection_spike, true);
  assert.ok(markdown.includes("Fixture Actions"));
  assertNoSensitiveText(JSON.stringify(parsed), "written tuning JSON");
  assertNoSensitiveText(markdown, "written tuning markdown");
})();

console.log("floorplanHybridSelectorTuningReportContract.test.js passed");
