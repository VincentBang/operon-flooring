"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const benchmarkScript = path.join(repoRoot, "internal-qa", "scripts", "runFloorplanBenchmark.js");
const rankingScript = path.join(repoRoot, "internal-qa", "scripts", "rankFloorplanBenchmarkMethods.js");

const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testRankingCliRanksSavedBenchmarkReport() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-ranking-cli-"));
  const benchmark = childProcess.spawnSync(process.execPath, [
    benchmarkScript,
    "--write-artifacts",
    "--json",
    "--method=ranking-contract",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(benchmark.status, 0, benchmark.stderr || benchmark.stdout);
  const reportFile = fs.readdirSync(outputDir).find(function (file) {
    return file.endsWith(".json");
  });
  assert.ok(reportFile, "Benchmark writer should create a JSON report.");
  const reportPath = path.join(outputDir, reportFile);

  const markdown = childProcess.spawnSync(process.execPath, [
    rankingScript,
    "--report=" + reportPath
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(markdown.status, 0, markdown.stderr || markdown.stdout);
  assert.ok(markdown.stdout.includes("# Floorplan Candidate Method Ranking"));
  assert.ok(markdown.stdout.includes("quick-room baseline"));
  assert.ok(markdown.stdout.includes("manual-seed baseline"));
  assert.ok(markdown.stdout.includes("classical contour spike"));
  assert.ok(markdown.stdout.includes("seed-box spike"));
  assert.ok(markdown.stdout.includes("hybrid selector spike"));
  assertNoSensitiveText(markdown.stdout, "ranking markdown");

  const json = childProcess.spawnSync(process.execPath, [
    rankingScript,
    "--report=" + reportPath,
    "--json"
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  const parsed = JSON.parse(json.stdout);
  assert.equal(parsed.local_only, true);
  assert.equal(parsed.customer_visible, false);
  assert.equal(parsed.safe_to_continue_detection_spike, true);
  assert.ok(parsed.method_summary.length >= 3);
  assert.ok(parsed.method_summary.some(function (method) {
    return method.method_key === "seed_box_spike";
  }));
  assert.ok(parsed.method_summary.some(function (method) {
    return method.method_key === "hybrid_selector_spike";
  }));
  assert.ok(parsed.fixture_rankings.length >= 10);
  assert.ok(parsed.fixture_rankings.every(function (fixture) {
    return fixture.best_method_key;
  }));
  assertNoSensitiveText(json.stdout, "ranking JSON");
})();

console.log("floorplanBenchmarkMethodRankingCliContract.test.js passed");
