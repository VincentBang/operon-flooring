"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const NextActions = require("../../lib/floorplanPhase3NextActionsReport");

const repoRoot = path.resolve(__dirname, "../../..");
const nextActionsScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanPhase3NextActions.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testNextActionsReflectCurrentPhase3State() {
  const report = NextActions.buildFloorplanPhase3NextActionsReport();
  assert.equal(report.report_type, "floorplan_phase3_next_actions_report");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.ready_for_reviewer_qa, true);
  assert.equal(report.ready_for_real_sample_benchmark_batch, false);
  assert.equal(report.ready_for_customer_visible_detection, false);
  assert.ok(report.next_action_rows.some(function (row) {
    return row.action === "collect_redacted_real_sample_batch" && row.priority === "P0";
  }));
  assert.ok(report.next_action_rows.some(function (row) {
    return row.action === "customer_visible_detection" && row.status === "blocked";
  }));
  assert.ok(report.gate_commands.some(function (command) {
    return command.includes("validate-real-sample");
  }));
  assertNoSensitiveText(JSON.stringify(report), "Phase 3 next-actions JSON");
})();

(function testNextActionsMarkdownAndCliAreSafe() {
  const report = NextActions.buildFloorplanPhase3NextActionsReport();
  const markdown = NextActions.renderFloorplanPhase3NextActionsMarkdown(report, {
    report_id: "test-phase3-next-actions",
    created_at: "2026-07-02T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Phase 3 Next Actions"));
  assert.ok(markdown.includes("collect_redacted_real_sample_batch"));
  assert.ok(markdown.includes("does not approve deployment"));
  assertNoSensitiveText(markdown, "Phase 3 next-actions markdown");

  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-next-actions-"));
  const run = childProcess.spawnSync(process.execPath, [
    nextActionsScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.equal(run.status, 0, run.stderr || run.stdout);
  assert.ok(run.stdout.includes("\"ready_for_customer_visible_detection\": false"));
  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Next-actions CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Next-actions CLI should write a Markdown artifact.");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"), "written next-actions JSON");
  assertNoSensitiveText(fs.readFileSync(path.join(outputDir, markdownFile), "utf8"), "written next-actions markdown");
})();

console.log("floorplanPhase3NextActionsContract.test.js passed");
