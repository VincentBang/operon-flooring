"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(repoRoot, "internal-qa", "scripts", "runFloorplanBenchmark.js");

const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testBenchmarkCliWritesLocalArtifacts() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-benchmark-cli-"));
  const result = childProcess.spawnSync(process.execPath, [
    scriptPath,
    "--write-artifacts",
    "--json",
    "--method=quick-room-baseline-contract",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(result.stdout.includes("\"benchmark_version\": \"floorplan-phase-2.5-v1\""), "CLI JSON should include benchmark version.");
  assert.ok(result.stdout.includes("\"quick_room_baseline\""), "CLI JSON should include quick-room baseline summary.");
  assert.ok(result.stdout.includes("\"manual_seed_baseline\""), "CLI JSON should include manual-seed baseline summary.");
  assertNoSensitiveText(result.stdout, "CLI stdout");

  const files = fs.readdirSync(outputDir).sort();
  const jsonFiles = files.filter(function (file) { return file.endsWith(".json"); });
  const markdownFiles = files.filter(function (file) { return file.endsWith(".md"); });
  assert.equal(jsonFiles.length, 1, "CLI should write one JSON artifact.");
  assert.equal(markdownFiles.length, 1, "CLI should write one Markdown artifact.");
  assert.ok(jsonFiles[0].includes("quick-room-baseline-contract"), "JSON artifact should include safe method slug.");
  assert.ok(markdownFiles[0].includes("quick-room-baseline-contract"), "Markdown artifact should include safe method slug.");

  const json = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFiles[0]), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFiles[0]), "utf8");
  assert.equal(json.artifact_metadata.method, "quick-room-baseline-contract");
  assert.equal(json.failed_count, 0);
  assert.equal(json.quick_room_baseline.passed_contract_count, json.quick_room_baseline.item_count);
  assert.equal(json.manual_seed_baseline.passed_contract_count, json.manual_seed_baseline.item_count);
  assert.ok(markdown.includes("Local only: yes"));
  assert.ok(markdown.includes("Candidate measurements are not final and are not customer-visible."));
  assert.ok(markdown.includes("Manual-Seed Baseline Candidates"));
  assert.ok(markdown.includes("Measured error"));
  assert.ok(Object.prototype.hasOwnProperty.call(json.manual_seed_baseline.results[0], "measured_area_error_percent"));
  assertNoSensitiveText(JSON.stringify(json), "JSON artifact");
  assertNoSensitiveText(markdown, "Markdown artifact");
})();

console.log("floorplanBenchmarkCliContract.test.js passed");
