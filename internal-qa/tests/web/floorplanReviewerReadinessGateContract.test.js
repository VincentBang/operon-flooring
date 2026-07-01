"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Gate = require("../../lib/floorplanReviewerReadinessGateReport");

const repoRoot = path.resolve(__dirname, "../../..");
const gateScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanReviewerReadinessGate.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testReviewerReadinessGateRollsUpCurrentState() {
  const report = Gate.buildFloorplanReviewerReadinessGateReport(corpus);
  assert.equal(report.report_type, "floorplan_reviewer_readiness_gate");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.fixture_count, corpus.length);
  assert.equal(report.ready_for_reviewer_qa, true);
  assert.equal(report.ready_for_real_detection_training, false);
  assert.equal(report.ready_for_customer_visible_detection, false);
  assert.ok(report.pass_count >= 5);
  assert.ok(report.block_count >= 1);
  assert.ok(report.gate_rows.some(function (row) {
    return row.key === "real_reviewed_samples" && row.status === "block";
  }));
  assert.ok(report.next_required_action.includes("real reviewed samples"));
  assertNoSensitiveText(JSON.stringify(report), "reviewer readiness report JSON");
})();

(function testReviewerReadinessMarkdownIsReadableAndSafe() {
  const report = Gate.buildFloorplanReviewerReadinessGateReport(corpus);
  const markdown = Gate.renderFloorplanReviewerReadinessGateMarkdown(report, {
    report_id: "test-reviewer-readiness",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Reviewer Readiness Gate"));
  assert.ok(markdown.includes("## Gate Rows"));
  assert.ok(markdown.includes("Customer-visible detection remains blocked"));
  assertNoSensitiveText(markdown, "reviewer readiness markdown");
})();

(function testReviewerReadinessCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-readiness-"));
  const json = childProcess.spawnSync(process.execPath, [
    gateScript,
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
  assert.ok(jsonFile, "Reviewer readiness CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Reviewer readiness CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "reviewer-readiness-gate");
  assert.equal(parsed.ready_for_reviewer_qa, true);
  assert.equal(parsed.ready_for_real_detection_training, false);
  assert.ok(markdown.includes("Gate Rows"));
  assertNoSensitiveText(JSON.stringify(parsed), "written reviewer readiness JSON");
  assertNoSensitiveText(markdown, "written reviewer readiness markdown");
})();

console.log("floorplanReviewerReadinessGateContract.test.js passed");
