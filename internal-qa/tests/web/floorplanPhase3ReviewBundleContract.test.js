"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Bundle = require("../../lib/floorplanPhase3ReviewBundleReport");

const repoRoot = path.resolve(__dirname, "../../..");
const bundleScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanPhase3ReviewBundle.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testReviewBundleSummarizesPhase3Gates() {
  const report = Bundle.buildFloorplanPhase3ReviewBundleReport(corpus);
  assert.equal(report.report_type, "floorplan_phase3_review_bundle_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.fixture_count, corpus.length);
  assert.equal(report.ready_for_reviewer_qa, true);
  assert.equal(report.ready_for_real_sample_benchmark_batch, false);
  assert.equal(report.ready_for_customer_visible_detection, false);
  assert.ok(report.candidate_section_count >= corpus.length);
  assert.ok(report.estimated_minutes_saved > 0);
  assert.equal(report.seed_box_spike_summary.method_key, "seed_box_spike");
  assert.equal(report.seed_box_spike_summary.contract_pass_count, corpus.length);
  assert.equal(report.seed_box_spike_summary.selected_area_safe_count, corpus.length);
  assert.ok(report.seed_box_spike_summary.average_measured_area_error_percent > 8);
  assert.ok(report.seed_box_spike_summary.recommendation.includes("contract test only"));
  assert.ok(report.summary_rows.some(function (row) {
    return row.key === "real_sample_intake" && row.status === "blocked";
  }));
  assert.ok(report.local_gate_commands.some(function (command) {
    return command.includes("test:floorplan-full");
  }));
  assertNoSensitiveText(JSON.stringify(report), "Phase 3 review bundle JSON");
})();

(function testReviewBundleMarkdownAndCliAreSafe() {
  const report = Bundle.buildFloorplanPhase3ReviewBundleReport(corpus);
  const markdown = Bundle.renderFloorplanPhase3ReviewBundleMarkdown(report, {
    report_id: "test-phase3-review-bundle",
    created_at: "2026-07-02T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Phase 3 Review Bundle"));
  assert.ok(markdown.includes("## Readiness Rows"));
  assert.ok(markdown.includes("## Seed-Box Spike Summary"));
  assert.ok(markdown.includes("contract test only"));
  assert.ok(markdown.includes("## Local Gate Commands"));
  assert.ok(markdown.includes("does not approve customer-visible detection"));
  assertNoSensitiveText(markdown, "Phase 3 review bundle markdown");

  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-bundle-"));
  const run = childProcess.spawnSync(process.execPath, [
    bundleScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.equal(run.status, 0, run.stderr || run.stdout);
  assert.ok(run.stdout.includes("\"ready_for_reviewer_qa\": true"));
  assert.ok(run.stdout.includes("\"ready_for_customer_visible_detection\": false"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Phase 3 bundle CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Phase 3 bundle CLI should write a Markdown artifact.");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"), "written Phase 3 bundle JSON");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, markdownFile), "utf8"), "written Phase 3 bundle markdown");
})();

console.log("floorplanPhase3ReviewBundleContract.test.js passed");
