"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const RequestPacket = require("../../lib/floorplanRealSampleRequestPacket");

const repoRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanRealSampleRequestPacket.js");
const runbookPath = path.join(repoRoot, "docs", "operon-flooring-floorplan-real-sample-request-runbook.md");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text)\b/i;

function assertSafe(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testRequestPacketListsMissingSlotsAndValidationCommands() {
  const packet = RequestPacket.buildFloorplanRealSampleRequestPacket();
  assert.equal(packet.packet_type, "floorplan_real_sample_request_packet");
  assert.equal(packet.local_only, true);
  assert.equal(packet.customer_visible, false);
  assert.equal(packet.requested_slot_count, 5);
  assert.ok(packet.request_rows.some(function (row) {
    return row.slot_key === "low_contrast_scan" && row.requested === true;
  }));
  assert.ok(packet.validation_commands.some(function (command) {
    return command.includes("validate-real-sample");
  }));
  assert.ok(packet.approval_boundary.includes("does not approve training"));
  assertSafe(JSON.stringify(packet), "request packet JSON");
})();

(function testRequestPacketMarkdownAndCliAreSafe() {
  const packet = RequestPacket.buildFloorplanRealSampleRequestPacket();
  const markdown = RequestPacket.renderFloorplanRealSampleRequestPacketMarkdown(packet);
  assert.ok(markdown.includes("# Floorplan Real Sample Request Packet"));
  assert.ok(markdown.includes("Requested Slots"));
  assert.ok(markdown.includes("Must Remove"));
  assertSafe(markdown, "request packet markdown");

  const run = childProcess.spawnSync(process.execPath, [scriptPath, "--json"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const parsed = JSON.parse(run.stdout);
  assert.equal(parsed.packet_type, "floorplan_real_sample_request_packet");
  assert.equal(parsed.requested_slot_count, 5);
  assertSafe(run.stdout, "request packet CLI JSON");
})();

(function testRequestPacketCliWritesArtifacts() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-real-sample-request-"));
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
  assert.ok(parsed.artifacts, "CLI should report written artifacts.");
  assert.ok(fs.existsSync(parsed.artifacts.json_path), "JSON artifact should exist.");
  assert.ok(fs.existsSync(parsed.artifacts.markdown_path), "Markdown artifact should exist.");
  assertSafe(fs.readFileSync(parsed.artifacts.json_path, "utf8"), "request packet JSON artifact");
  assertSafe(fs.readFileSync(parsed.artifacts.markdown_path, "utf8"), "request packet Markdown artifact");
})();

(function testRequestPacketRunbookDocumentsArtifactCommand() {
  assert.ok(fs.existsSync(runbookPath), "Real sample request runbook should exist.");
  const markdown = fs.readFileSync(runbookPath, "utf8");
  assert.ok(markdown.includes("# Operon Flooring Floorplan Real Sample Request Runbook"));
  assert.ok(markdown.includes("benchmark:floorplan:real-sample-request"));
  assert.ok(markdown.includes("--write-artifacts"));
  assert.ok(markdown.includes("floorplan-real-sample-request-packet.md"));
  assert.ok(markdown.includes("low_contrast_scan"));
  assert.ok(markdown.includes("Do not add samples to the active benchmark corpus until validation and intake both pass."));
  assertSafe(markdown, "request packet runbook");
})();

console.log("floorplanRealSampleRequestPacketContract.test.js passed");
