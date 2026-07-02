"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Gate = require("../../lib/floorplanRealSampleIntakeGateReport");

const repoRoot = path.resolve(__dirname, "../../..");
const gateScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanRealSampleIntakeGate.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

function cloneAsApprovedReal(item, suffix, overrides) {
  return Object.assign({}, item, overrides || {}, {
    id: "reviewed-sample-" + suffix,
    title: "Reviewed sample " + suffix,
    file_type: overrides && overrides.file_type || "reviewed-json",
    fixture_origin: "approved_real_reviewed_sample",
    usage_status: "approved_for_internal_benchmark",
    privacy_status: "customer_identifiers_removed",
    customer_identifiers_removed: true
  });
}

function buildPassingSampleBatch() {
  const byId = corpus.reduce(function (map, item) {
    map[item.id] = item;
    return map;
  }, {});
  return [
    cloneAsApprovedReal(byId["synthetic-low-confidence-scan"], "low-contrast-01", { file_type: "reviewed-image" }),
    cloneAsApprovedReal(byId["synthetic-not-sure-balcony"], "mixed-boundary-01"),
    cloneAsApprovedReal(byId["synthetic-stairs-void-excluded"], "void-stairs-01"),
    cloneAsApprovedReal(byId["synthetic-multipage-ground"], "multipage-01", { file_type: "reviewed-pdf-page", page_count: 2 }),
    cloneAsApprovedReal(byId["synthetic-l-shaped-living"], "irregular-01")
  ];
}

(function testCurrentCorpusKeepsRealSampleGateBlocked() {
  const report = Gate.buildFloorplanRealSampleIntakeGateReport(corpus);
  assert.equal(report.report_type, "floorplan_real_sample_intake_gate");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.real_sample_count, 0);
  assert.equal(report.approved_real_sample_count, 0);
  assert.equal(report.ready_for_real_sample_benchmark_batch, false);
  assert.equal(report.ready_to_add_real_samples_to_training, false);
  assert.equal(report.coverage_gap_count, Gate.REQUIRED_REAL_SAMPLE_COVERAGE.length);
  assert.ok(report.next_required_action.includes("approved real reviewed samples"));
  assertNoSensitiveText(JSON.stringify(report), "real sample intake report JSON");
})();

(function testApprovedRealSampleBatchCanPassBenchmarkBatchGate() {
  const sampleBatch = buildPassingSampleBatch();
  const report = Gate.buildFloorplanRealSampleIntakeGateReport(sampleBatch);
  assert.equal(report.real_sample_count, 5);
  assert.equal(report.approved_real_sample_count, 5);
  assert.equal(report.manifest_block_count, 0);
  assert.equal(report.coverage_gap_count, 0);
  assert.equal(report.ready_for_real_sample_benchmark_batch, true);
  assert.equal(report.ready_to_add_real_samples_to_training, false);
  assertNoSensitiveText(JSON.stringify(report), "approved sample intake report JSON");
})();

(function testIntakeGateCliCanDryRunProposedFixtureBatch() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-real-sample-fixture-batch-"));
  const fixturePath = path.join(outputDir, "approved-real-sample-batch.json");
  fs.writeFileSync(fixturePath, JSON.stringify(buildPassingSampleBatch(), null, 2) + "\n");

  const run = childProcess.spawnSync(process.execPath, [
    gateScript,
    "--fixture-file=" + fixturePath,
    "--json"
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.equal(run.status, 0, run.stderr || run.stdout);
  assert.ok(run.stdout.includes("\"ready_for_real_sample_benchmark_batch\": true"));
  assert.ok(run.stdout.includes("\"ready_to_add_real_samples_to_training\": false"));
  assertNoSensitiveText(run.stdout, "dry-run fixture batch output");
})();

(function testIntakeGateMarkdownAndCliAreSafe() {
  const report = Gate.buildFloorplanRealSampleIntakeGateReport(corpus);
  const markdown = Gate.renderFloorplanRealSampleIntakeGateMarkdown(report, {
    report_id: "test-real-sample-intake",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Real Sample Intake Gate"));
  assert.ok(markdown.includes("## Required Coverage"));
  assert.ok(markdown.includes("does not approve training"));
  assertNoSensitiveText(markdown, "real sample intake markdown");

  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-real-sample-intake-"));
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
  assert.ok(json.stdout.includes("\"ready_for_real_sample_benchmark_batch\": false"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Real sample intake CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Real sample intake CLI should write a Markdown artifact.");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"), "written intake JSON");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, markdownFile), "utf8"), "written intake markdown");
})();

console.log("floorplanRealSampleIntakeGateContract.test.js passed");
