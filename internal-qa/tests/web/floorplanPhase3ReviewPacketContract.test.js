"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const packetScript = path.join(repoRoot, "internal-qa", "scripts", "writeFloorplanPhase3ReviewPacket.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testPhase3PacketWriterCreatesLocalReviewPacket() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-packet-"));
  const run = childProcess.spawnSync(process.execPath, [
    packetScript,
    "--json",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.equal(run.status, 0, run.stderr || run.stdout);
  const packet = JSON.parse(run.stdout);
  assert.equal(packet.packet_type, "floorplan_phase3_review_packet");
  assert.equal(packet.local_only, true);
  assert.equal(packet.customer_visible, false);
  assert.equal(packet.report_count, 7);
  assert.ok(packet.reports.every(function (report) {
    return report.local_only === true && report.customer_visible === false;
  }));
  assert.ok(packet.reports.some(function (report) {
    return report.key === "phase3-next-actions";
  }));
  assert.ok(packet.reports.some(function (report) {
    return report.key === "phase3-local-gates";
  }));
  assert.ok(fs.existsSync(packet.manifest_path));
  packet.reports.forEach(function (report) {
    assert.ok(fs.existsSync(report.json_path), report.key + " JSON should exist.");
    assert.ok(fs.existsSync(report.markdown_path), report.key + " Markdown should exist.");
    assertNoSensitiveText(fs.readFileSync(report.json_path, "utf8"), report.key + " JSON");
    assertNoSensitiveText(fs.readFileSync(report.markdown_path, "utf8"), report.key + " Markdown");
  });
  assertNoSensitiveText(JSON.stringify(packet), "packet stdout");
})();

console.log("floorplanPhase3ReviewPacketContract.test.js passed");
