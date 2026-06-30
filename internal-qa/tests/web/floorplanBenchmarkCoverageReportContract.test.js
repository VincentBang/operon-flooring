"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Coverage = require("../../lib/floorplanBenchmarkCoverageReport");

const repoRoot = path.resolve(__dirname, "../../..");
const coverageScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanBenchmarkCoverage.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testCoverageReportShowsCurrentGaps() {
  const report = Coverage.buildFloorplanBenchmarkCoverageReport(corpus);
  assert.equal(report.report_type, "floorplan_benchmark_coverage_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.fixture_count, corpus.length);
  assert.ok(report.reviewed_section_count >= corpus.length);
  assert.equal(report.ready_for_real_detection_training, false);
  assert.equal(report.ready_for_local_detection_spike, true);
  assert.ok(report.covered_target_count >= 3);
  assert.ok(report.gap_target_count >= 1);
  assert.ok(report.coverage_rows.some(function (row) {
    return row.key === "real_reviewed_samples" && row.status === "gap";
  }));
  assert.ok(report.recommended_next_fixtures.length >= 1);
  assertNoSensitiveText(JSON.stringify(report), "coverage report JSON");
})();

(function testCoverageMarkdownIsReadableAndSafe() {
  const report = Coverage.buildFloorplanBenchmarkCoverageReport(corpus);
  const markdown = Coverage.renderFloorplanBenchmarkCoverageMarkdown(report, {
    report_id: "test-coverage",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Benchmark Coverage Report"));
  assert.ok(markdown.includes("## Coverage Targets"));
  assert.ok(markdown.includes("## Recommended Next Fixtures"));
  assert.ok(markdown.includes("Ready for real detection training"));
  assertNoSensitiveText(markdown, "coverage markdown");
})();

(function testCoverageCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-coverage-"));
  const json = childProcess.spawnSync(process.execPath, [
    coverageScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"ready_for_local_detection_spike\": true"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Coverage CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Coverage CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "floorplan-benchmark-coverage");
  assert.equal(parsed.ready_for_local_detection_spike, true);
  assert.ok(markdown.includes("Coverage Targets"));
  assertNoSensitiveText(JSON.stringify(parsed), "written coverage JSON");
  assertNoSensitiveText(markdown, "written coverage markdown");
})();

console.log("floorplanBenchmarkCoverageReportContract.test.js passed");
