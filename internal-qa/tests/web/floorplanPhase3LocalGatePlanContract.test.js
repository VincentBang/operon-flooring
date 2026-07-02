"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const path = require("path");

const GatePlan = require("../../scripts/reportFloorplanPhase3LocalGatePlan");

const repoRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanPhase3LocalGatePlan.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertSafe(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive terms.");
}

(function testGatePlanContainsRequiredLocalCommands() {
  const report = GatePlan.buildReport();
  assert.equal(report.report_type, "floorplan_phase3_local_gate_plan");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.deploy_required, false);
  assert.equal(report.supabase_change_required, false);
  assert.ok(report.gate_commands.some(function (row) {
    return row.command === "npm run test:floorplan-full";
  }));
  assert.ok(report.gate_commands.some(function (row) {
    return row.command.includes("benchmark:floorplan:phase3-packet");
  }));
  assert.ok(report.production_boundary.includes("does not approve production deploy"));
  assertSafe(JSON.stringify(report), "gate plan JSON");
})();

(function testGatePlanCliOutputsJsonAndMarkdown() {
  const jsonRun = childProcess.spawnSync(process.execPath, [scriptPath, "--json"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(jsonRun.status, 0, jsonRun.stderr || jsonRun.stdout);
  const parsed = JSON.parse(jsonRun.stdout);
  assert.equal(parsed.command_count, parsed.gate_commands.length);
  assertSafe(jsonRun.stdout, "gate plan CLI JSON");

  const markdownRun = childProcess.spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(markdownRun.status, 0, markdownRun.stderr || markdownRun.stdout);
  assert.ok(markdownRun.stdout.includes("# Floorplan Phase 3 Local Gate Plan"));
  assert.ok(markdownRun.stdout.includes("Deploy required: no"));
  assertSafe(markdownRun.stdout, "gate plan CLI markdown");
})();

console.log("floorplanPhase3LocalGatePlanContract.test.js passed");
