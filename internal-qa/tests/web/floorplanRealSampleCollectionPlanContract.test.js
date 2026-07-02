"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const path = require("path");

const Plan = require("../../lib/floorplanRealSampleCollectionPlan");

const repoRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanRealSampleCollectionPlan.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertSafe(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testCollectionPlanReflectsMissingRealSampleSlots() {
  const report = Plan.buildFloorplanRealSampleCollectionPlan();
  assert.equal(report.report_type, "floorplan_real_sample_collection_plan");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.ready_for_real_sample_benchmark_batch, false);
  assert.equal(report.missing_sample_slot_count, 5);
  assert.ok(report.required_rows.some(function (row) {
    return row.key === "low_contrast_scan" && row.minimum_needed === 1;
  }));
  assert.ok(report.guardrails.some(function (item) {
    return item.includes("Do not include customer identifiers");
  }));
  assertSafe(JSON.stringify(report), "collection plan JSON");
})();

(function testCollectionPlanMarkdownAndCliAreSafe() {
  const markdown = Plan.renderFloorplanRealSampleCollectionPlanMarkdown(Plan.buildFloorplanRealSampleCollectionPlan());
  assert.ok(markdown.includes("# Floorplan Real Sample Collection Plan"));
  assert.ok(markdown.includes("Required Sample Slots"));
  assert.ok(markdown.includes("low_contrast_scan"));
  assertSafe(markdown, "collection plan markdown");

  const run = childProcess.spawnSync(process.execPath, [scriptPath, "--json"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.report_type, "floorplan_real_sample_collection_plan");
  assertSafe(run.stdout, "collection plan CLI JSON");
})();

console.log("floorplanRealSampleCollectionPlanContract.test.js passed");
