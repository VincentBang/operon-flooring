"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const Handoff = require("../../scripts/prepareFloorplanPhase3ReviewerHandoff");

const repoRoot = path.resolve(__dirname, "../../..");
const handoffScript = path.join(repoRoot, "internal-qa", "scripts", "prepareFloorplanPhase3ReviewerHandoff.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertSafe(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testPrepareHandoffWritesAndValidatesLocalArtifacts() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-handoff-"));
  const handoff = Handoff.prepareHandoff({
    packetDir: path.join(baseDir, "packet"),
    requestDir: path.join(baseDir, "request")
  });
  assert.equal(handoff.handoff_type, "floorplan_phase3_reviewer_handoff");
  assert.equal(handoff.local_only, true);
  assert.equal(handoff.customer_visible, false);
  assert.equal(handoff.packet_valid, true);
  assert.equal(handoff.packet_report_count, 9);
  assert.equal(handoff.requested_sample_slots, 5);
  assert.ok(handoff.request_artifacts);
  assert.ok(fs.existsSync(path.join(handoff.packet_dir, "packet-manifest.json")));
  assert.ok(fs.existsSync(handoff.request_artifacts.markdown_path));
  assertSafe(JSON.stringify(handoff), "handoff JSON");
})();

(function testPrepareHandoffCliOutputsSafeJson() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-handoff-cli-"));
  const run = childProcess.spawnSync(process.execPath, [
    handoffScript,
    "--json",
    "--packet-dir=" + path.join(baseDir, "packet"),
    "--request-dir=" + path.join(baseDir, "request")
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.packet_valid, true);
  assert.equal(parsed.requested_sample_slots, 5);
  assertSafe(run.stdout, "handoff CLI JSON");
})();

console.log("floorplanPhase3ReviewerHandoffContract.test.js passed");
