"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const Worksheet = require("../../lib/floorplanRealSampleWorksheet");
const Validator = require("../../scripts/validateFloorplanRealSampleFixture");

const repoRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(repoRoot, "internal-qa", "scripts", "writeFloorplanRealSampleWorksheet.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertSafe(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testWorksheetListsAllRequiredSlotsButIsNotFixtureData() {
  const worksheet = Worksheet.buildFloorplanRealSampleWorksheet();
  assert.equal(worksheet.worksheet_type, "floorplan_real_sample_intake_worksheet");
  assert.equal(worksheet.local_only, true);
  assert.equal(worksheet.customer_visible, false);
  assert.equal(worksheet.requested_slot_count, 5);
  assert.ok(worksheet.worksheet_rows.some(function (row) {
    return row.slot_key === "low_contrast_scan" && row.required === true;
  }));
  assert.ok(worksheet.validation_note.includes("not a benchmark fixture"));
  assertSafe(JSON.stringify(worksheet), "worksheet JSON");
})();

(function testWorksheetMarkdownAndCliArtifactsAreSafe() {
  const worksheet = Worksheet.buildFloorplanRealSampleWorksheet();
  const markdown = Worksheet.renderFloorplanRealSampleWorksheetMarkdown(worksheet);
  assert.ok(markdown.includes("# Floorplan Real Sample Intake Worksheet"));
  assert.ok(markdown.includes("not a benchmark fixture"));
  assert.ok(markdown.includes("low_contrast_scan"));
  assertSafe(markdown, "worksheet markdown");

  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-real-sample-worksheet-"));
  const run = childProcess.spawnSync(process.execPath, [
    scriptPath,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.requested_slot_count, 5);
  assert.ok(fs.existsSync(parsed.artifacts.json_path));
  assert.ok(fs.existsSync(parsed.artifacts.markdown_path));
  assertSafe(fs.readFileSync(parsed.artifacts.json_path, "utf8"), "worksheet JSON artifact");
  assertSafe(fs.readFileSync(parsed.artifacts.markdown_path, "utf8"), "worksheet markdown artifact");
})();

(function testWorksheetCannotAccidentallyPassFixtureValidator() {
  const result = Validator.validateFixtures(Worksheet.buildFloorplanRealSampleWorksheet());
  assert.equal(result.ok, false);
  assert.ok(result.fixture_rows[0].errors.some(function (error) {
    return error.includes("Fixture must be an object") || error.includes("fixture_origin");
  }));
})();

console.log("floorplanRealSampleWorksheetContract.test.js passed");
