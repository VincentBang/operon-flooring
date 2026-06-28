"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(repoRoot, "internal-qa", "scripts", "runFloorplanManualSeedExperiment.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function run(args) {
  return childProcess.spawnSync(process.execPath, [scriptPath].concat(args), {
    cwd: repoRoot,
    encoding: "utf8"
  });
}

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testManualSeedExperimentJson() {
  const result = run([
    "--fixture=synthetic-two-room-apartment",
    "--seed=0.2,0.2",
    "--seed=0.6,0.2",
    "--json"
  ]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.benchmark_version, "floorplan-manual-seed-experiment-v1");
  assert.equal(parsed.local_only, true);
  assert.equal(parsed.fixture_id, "synthetic-two-room-apartment");
  assert.equal(parsed.seed_points.length, 2);
  assert.equal(parsed.candidate_quality_summary.seed_count, 2);
  assert.equal(parsed.candidate_quality_summary.accepted_seed_count, 2);
  assert.equal(parsed.candidate_quality_summary.rejected_seed_count, 0);
  assert.deepEqual(parsed.candidate_quality_summary.rejected_seed_reasons, {});
  assert.deepEqual(parsed.candidate_quality_summary.candidate_section_labels, ["Living room candidate", "Bedroom candidate"]);
  assert.equal(parsed.candidate_quality_summary.experiment_area_error_band, "low_0_to_5_percent");
  assert.equal(parsed.candidate_quality_summary.experiment_measured_area_error_band, "low_0_to_5_percent");
  assert.equal(parsed.experiment.candidate_method, "manual_seed_spike");
  assert.ok(Object.prototype.hasOwnProperty.call(parsed.experiment, "measured_area_error_percent"));
  assert.equal(parsed.experiment.candidate_selected_area_m2, 0);
  assert.equal(parsed.experiment.review_required, true);
  assert.equal(parsed.experiment.final, false);
  assert.equal(parsed.experiment.customer_visible, false);
  assert.equal(parsed.comparison.safe_to_continue_local_experiment, true);
  assertNoSensitiveText(result.stdout, "manual seed JSON stdout");
})();

(function testManualSeedExperimentReportsMixedRejectedSeedReasons() {
  const result = run([
    "--fixture=synthetic-rectangle-clean",
    "--seed=0.2,0.2",
    "--seed=0.95,0.95",
    "--json"
  ]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.candidate_quality_summary.seed_count, 2);
  assert.equal(parsed.candidate_quality_summary.accepted_seed_count, 1);
  assert.equal(parsed.candidate_quality_summary.rejected_seed_count, 1);
  assert.equal(parsed.candidate_quality_summary.rejected_seed_reasons.outside_reviewed_section, 1);
  assert.deepEqual(parsed.candidate_quality_summary.candidate_section_labels, ["Living and dining candidate"]);
  assert.equal(parsed.experiment.candidate_selected_area_m2, 0);
  assert.equal(parsed.comparison.safe_to_continue_local_experiment, true);
  assertNoSensitiveText(result.stdout, "mixed manual seed JSON stdout");
})();

(function testManualSeedExperimentRejectsSeedOutsideFixtureSection() {
  const result = run([
    "--fixture=synthetic-rectangle-clean",
    "--seed=0.95,0.95",
    "--json"
  ]);

  assert.equal(result.status, 1, "Seed outside reviewed section should fail.");
  assert.ok(result.stderr.includes("No accepted seed points"));
  assert.ok(result.stderr.includes("outside_reviewed_section=1"));
  assertNoSensitiveText(result.stderr, "manual seed error stderr");
})();

(function testManualSeedExperimentWritesLocalArtifactsOnlyWhenRequested() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-manual-seed-"));
  const result = run([
    "--fixture=synthetic-rectangle-clean",
    "--seed=0.2,0.2",
    "--write-artifacts",
    "--output-dir=" + outputDir,
    "--json"
  ]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const files = fs.readdirSync(outputDir).sort();
  const jsonFiles = files.filter(function (file) { return file.endsWith(".json"); });
  const markdownFiles = files.filter(function (file) { return file.endsWith(".md"); });
  assert.equal(jsonFiles.length, 1);
  assert.equal(markdownFiles.length, 1);
  assert.ok(jsonFiles[0].includes("manual-seed-synthetic-rectangle-clean"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFiles[0]), "utf8");
  assert.ok(markdown.includes("# Floorplan Manual-Seed Experiment"));
  assert.ok(markdown.includes("Candidate Quality Summary"));
  assert.ok(markdown.includes("Accepted seeds"));
  assert.ok(markdown.includes("does not write Supabase rows"));
  assertNoSensitiveText(markdown, "manual seed markdown artifact");
})();

(function testManualSeedExperimentWriteArtifactsUsesDefaultOutputDir() {
  const result = run([
    "--fixture=synthetic-rectangle-clean",
    "--seed=0.2,0.2",
    "--write-artifacts",
    "--json"
  ]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(result.stderr.includes("internal-qa/reports/floorplan-manual-seed-experiments"), "default artifact path should be reported.");
  assertNoSensitiveText(result.stderr, "default artifact stderr");
  result.stderr.split(/\r?\n/).forEach(function (line) {
    const match = line.match(/- (?:JSON|Markdown): (.+)$/);
    if (match && fs.existsSync(match[1])) {
      fs.unlinkSync(match[1]);
    }
  });
})();

console.log("floorplanManualSeedExperimentCliContract.test.js passed");
