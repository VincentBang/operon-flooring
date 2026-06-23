"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const compareScript = path.join(repoRoot, "internal-qa", "scripts", "compareFloorplanBenchmarkReports.js");

const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function writeReport(dir, name, overrides) {
  const report = Object.assign({
    benchmark_version: "floorplan-phase-2.5-v1",
    item_count: 2,
    failed_count: 0,
    results: [
      { id: "synthetic-rectangle-clean", failures: [], passed: true },
      { id: "synthetic-two-room-apartment", failures: [], passed: true }
    ],
    quick_room_baseline: {
      item_count: 2,
      passed_contract_count: 2,
      results: [
        { id: "synthetic-rectangle-clean", area_error_percent: 4, passed_contract: true },
        { id: "synthetic-two-room-apartment", area_error_percent: 6, passed_contract: true }
      ]
    }
  }, overrides || {});
  const filePath = path.join(dir, name + ".json");
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2) + "\n");
  return filePath;
}

function runCompare(args) {
  return childProcess.spawnSync(process.execPath, [compareScript].concat(args), {
    cwd: repoRoot,
    encoding: "utf8"
  });
}

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testCompareCliRendersMarkdownAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-compare-cli-"));
  const baseline = writeReport(outputDir, "baseline");
  const candidate = writeReport(outputDir, "candidate", {
    quick_room_baseline: {
      item_count: 2,
      passed_contract_count: 2,
      results: [
        { id: "synthetic-rectangle-clean", area_error_percent: 3, passed_contract: true },
        { id: "synthetic-two-room-apartment", area_error_percent: 5, passed_contract: true }
      ]
    }
  });

  const markdownResult = runCompare(["--baseline=" + baseline, "--candidate=" + candidate]);
  assert.equal(markdownResult.status, 0, markdownResult.stderr || markdownResult.stdout);
  assert.ok(markdownResult.stdout.includes("# Floorplan Benchmark Comparison"));
  assert.ok(markdownResult.stdout.includes("Safe to continue detection spike"));
  assertNoSensitiveText(markdownResult.stdout, "comparison markdown");

  const jsonResult = runCompare(["--baseline=" + baseline, "--candidate=" + candidate, "--json"]);
  assert.equal(jsonResult.status, 0, jsonResult.stderr || jsonResult.stdout);
  const parsed = JSON.parse(jsonResult.stdout);
  assert.equal(parsed.safe_to_continue_detection_spike, true);
  assert.equal(parsed.regression_count, 0);
  assertNoSensitiveText(jsonResult.stdout, "comparison JSON");
})();

(function testCompareCliFailsUnsafeRegression() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-compare-cli-fail-"));
  const baseline = writeReport(outputDir, "baseline");
  const candidate = writeReport(outputDir, "candidate", {
    failed_count: 1,
    quick_room_baseline: {
      item_count: 2,
      passed_contract_count: 1,
      results: [
        { id: "synthetic-rectangle-clean", area_error_percent: 4, passed_contract: true },
        { id: "synthetic-two-room-apartment", area_error_percent: 19, passed_contract: false }
      ]
    }
  });

  const result = runCompare(["--baseline=" + baseline, "--candidate=" + candidate, "--json"]);
  assert.equal(result.status, 1, "Unsafe comparison should exit non-zero.");
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.safe_to_continue_detection_spike, false);
  assert.ok(parsed.regression_count >= 1);
  assertNoSensitiveText(result.stdout, "unsafe comparison JSON");
})();

console.log("floorplanBenchmarkCompareCliContract.test.js passed");
