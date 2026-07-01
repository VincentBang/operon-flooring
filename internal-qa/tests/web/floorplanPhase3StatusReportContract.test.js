"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Status = require("../../lib/floorplanPhase3StatusReport");

const repoRoot = path.resolve(__dirname, "../../..");
const statusScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanPhase3Status.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testPhase3StatusReflectsCurrentGateState() {
  const report = Status.buildFloorplanPhase3StatusReport(corpus);
  assert.equal(report.report_type, "floorplan_phase3_status_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.fixture_count, corpus.length);
  assert.equal(report.ready_for_reviewer_qa, true);
  assert.equal(report.ready_for_real_sample_benchmark_batch, false);
  assert.equal(report.ready_for_customer_visible_detection, false);
  assert.equal(report.hybrid_selector_ready, true);
  assert.ok(report.total_candidate_count >= corpus.length);
  assert.ok(report.status_rows.some(function (row) {
    return row.area === "real_sample_intake" && row.status === "blocked";
  }));
  assert.ok(report.status_rows.some(function (row) {
    return row.area === "customer_visible_detection" && row.status === "blocked";
  }));
  assert.ok(report.next_safe_task.includes("approved real reviewed sample batch"));
  assertNoSensitiveText(JSON.stringify(report), "Phase 3 status report JSON");
})();

(function testPhase3StatusMarkdownAndCliAreSafe() {
  const report = Status.buildFloorplanPhase3StatusReport(corpus);
  const markdown = Status.renderFloorplanPhase3StatusMarkdown(report, {
    report_id: "test-phase3-status",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Phase 3 Status Report"));
  assert.ok(markdown.includes("## Status Rows"));
  assert.ok(markdown.includes("does not approve deployment"));
  assertNoSensitiveText(markdown, "Phase 3 status markdown");

  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-status-"));
  const json = childProcess.spawnSync(process.execPath, [
    statusScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"ready_for_reviewer_qa\": true"));
  assert.ok(json.stdout.includes("\"ready_for_customer_visible_detection\": false"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Phase 3 status CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Phase 3 status CLI should write a Markdown artifact.");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"), "written Phase 3 status JSON");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, markdownFile), "utf8"), "written Phase 3 status markdown");
})();

console.log("floorplanPhase3StatusReportContract.test.js passed");
