"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Packet = require("../../lib/floorplanCandidateInspectionPacketReport");

const repoRoot = path.resolve(__dirname, "../../..");
const packetScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanCandidateInspectionPacket.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

function assertNoGeometry(value, label) {
  const serialized = JSON.stringify(value);
  assert.equal(serialized.includes("\"points\""), false, label + " should not include geometry points.");
  assert.equal(serialized.includes("\"sections\""), false, label + " should not include raw sections.");
  assert.equal(serialized.includes("\"geometry_json\""), false, label + " should not include geometry JSON.");
}

(function testInspectionPacketIsReviewerSafe() {
  const report = Packet.buildFloorplanCandidateInspectionPacketReport(corpus);
  assert.equal(report.report_type, "floorplan_candidate_inspection_packet");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.fixture_count, corpus.length);
  assert.equal(report.ready_for_reviewer_packet, true);
  assert.ok(report.total_candidate_count >= corpus.length);
  assert.ok(Object.keys(report.taxonomy_mix).length >= 2);
  assert.ok(Object.keys(report.method_mix).length >= 2);
  assert.equal(report.inspection_rows.length, corpus.length);
  assert.ok(report.inspection_rows.every(function (row) {
    return row.review_required === true
      && row.selected_area_m2 === 0
      && row.measured_area_m2 > 0
      && row.geometry_redacted === true
      && row.save_performed === false
      && row.next_action;
  }));
  assertNoSensitiveText(JSON.stringify(report), "inspection packet JSON");
  assertNoGeometry(report, "inspection packet JSON");
})();

(function testInspectionPacketMarkdownIsReadableAndSafe() {
  const report = Packet.buildFloorplanCandidateInspectionPacketReport(corpus);
  const markdown = Packet.renderFloorplanCandidateInspectionPacketMarkdown(report, {
    report_id: "test-inspection-packet",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Candidate Inspection Packet"));
  assert.ok(markdown.includes("## Method Mix"));
  assert.ok(markdown.includes("## Fixture Packet"));
  assert.ok(markdown.includes("Geometry is redacted"));
  assertNoSensitiveText(markdown, "inspection packet markdown");
})();

(function testInspectionPacketCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-inspection-packet-"));
  const json = childProcess.spawnSync(process.execPath, [
    packetScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"ready_for_reviewer_packet\": true"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Inspection packet CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Inspection packet CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "candidate-inspection-packet");
  assert.equal(parsed.ready_for_reviewer_packet, true);
  assert.ok(markdown.includes("Fixture Packet"));
  assertNoSensitiveText(JSON.stringify(parsed), "written inspection packet JSON");
  assertNoSensitiveText(markdown, "written inspection packet markdown");
  assertNoGeometry(parsed, "written inspection packet JSON");
})();

console.log("floorplanCandidateInspectionPacketContract.test.js passed");
