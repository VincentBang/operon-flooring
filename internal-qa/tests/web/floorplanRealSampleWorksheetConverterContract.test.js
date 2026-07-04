"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const Worksheet = require("../../lib/floorplanRealSampleWorksheet");
const Converter = require("../../lib/floorplanRealSampleWorksheetConverter");

const repoRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(repoRoot, "internal-qa", "scripts", "convertFloorplanRealSampleWorksheet.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertSafe(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

function points(x1, y1, x2, y2) {
  return [
    { x: x1, y: y1 },
    { x: x2, y: y1 },
    { x: x2, y: y2 },
    { x: x1, y: y2 }
  ];
}

function completeWorksheet() {
  const worksheet = Worksheet.buildFloorplanRealSampleWorksheet();
  worksheet.worksheet_rows.forEach(function (row, index) {
    const slotToQuality = {
      low_contrast_scan: "low_contrast_scan",
      mixed_boundary: "mixed_boundary",
      void_or_stairs: "mixed_boundary",
      multipage_pdf: "clear_vector",
      irregular_geometry: "mixed_boundary"
    };
    const slotToFileType = {
      multipage_pdf: "reviewed-pdf-page"
    };
    const baseSection = {
      client_section_id: row.slot_key + "-main",
      label: "Main area",
      section_type: "room",
      selection_state: "include",
      confidence: row.slot_key === "low_contrast_scan" ? "low" : "medium",
      points: points(0.1, 0.1, 0.45 + index * 0.02, 0.45)
    };
    if (row.slot_key === "irregular_geometry") {
      baseSection.points = [
        { x: 0.1, y: 0.1 },
        { x: 0.5, y: 0.1 },
        { x: 0.5, y: 0.28 },
        { x: 0.38, y: 0.28 },
        { x: 0.38, y: 0.48 },
        { x: 0.1, y: 0.48 }
      ];
    }
    const sections = [baseSection];
    if (row.slot_key === "mixed_boundary") {
      sections.push({
        client_section_id: "entry-area",
        label: "Entry area",
        section_type: "room",
        selection_state: "include",
        confidence: "medium",
        points: points(0.52, 0.12, 0.76, 0.46)
      });
    }
    if (row.slot_key === "void_or_stairs") {
      sections.push({
        client_section_id: "stair-void",
        label: "Stair void",
        section_type: "void",
        selection_state: "exclude",
        confidence: "medium",
        points: points(0.52, 0.12, 0.66, 0.3)
      });
    }
    row.fill_in_fields = {
      fixture_id: "reviewed-sample-" + row.slot_key.replace(/_/g, "-") + "-test",
      plan_quality: slotToQuality[row.slot_key],
      file_type: slotToFileType[row.slot_key] || "reviewed-json",
      page_count: row.slot_key === "multipage_pdf" ? 2 : 1,
      scale_basis: "known_wall",
      reviewed_total_area_m2: 20 + index,
      reviewed_section_count: sections.length,
      expected_confidence: row.slot_key === "low_contrast_scan" ? "low" : "medium",
      reviewed_sections_redacted: sections,
      reviewer_notes: "Redacted reviewed worksheet contract fixture.",
      redaction_checked_by: "reviewer",
      approval_checked_by: "reviewer"
    };
  });
  return worksheet;
}

(function testBlankWorksheetDoesNotPassConversionGate() {
  const result = Converter.convertAndValidateWorksheet(Worksheet.buildFloorplanRealSampleWorksheet());
  assert.equal(result.ok, false);
  assert.equal(result.fixture_count, 5);
  assert.ok(result.validation.coverage_gap_count > 0);
})();

(function testCompletedWorksheetConvertsToValidatorReadyFixtures() {
  const result = Converter.convertAndValidateWorksheet(completeWorksheet());
  assert.equal(result.ok, true, JSON.stringify(result.validation.fixture_rows, null, 2));
  assert.equal(result.fixture_count, 5);
  assert.equal(result.ready_for_real_sample_benchmark_batch, true);
  assertSafe(JSON.stringify(result.fixtures), "converted fixtures");
})();

(function testConverterCliWritesFixtureBatch() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-worksheet-converter-"));
  const worksheetPath = path.join(tempDir, "completed-worksheet.json");
  const outputPath = path.join(tempDir, "converted-fixtures.json");
  fs.writeFileSync(worksheetPath, JSON.stringify(completeWorksheet(), null, 2) + "\n");
  const run = childProcess.spawnSync(process.execPath, [
    scriptPath,
    "--worksheet-file=" + worksheetPath,
    "--output-file=" + outputPath
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.fixture_count, 5);
  assert.ok(fs.existsSync(outputPath));
  assertSafe(fs.readFileSync(outputPath, "utf8"), "converted fixture file");
})();

console.log("floorplanRealSampleWorksheetConverterContract.test.js passed");
