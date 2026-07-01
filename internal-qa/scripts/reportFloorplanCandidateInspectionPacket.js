#!/usr/bin/env node
"use strict";

const Packet = require("../lib/floorplanCandidateInspectionPacketReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const report = Packet.buildFloorplanCandidateInspectionPacketReport();

if (writeArtifacts) {
  const artifact = Packet.writeFloorplanCandidateInspectionPacketArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote floorplan candidate inspection packet artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(report.ready_for_reviewer_packet ? 0 : 1);
}

process.stdout.write(Packet.renderFloorplanCandidateInspectionPacketMarkdown(report));
process.exit(report.ready_for_reviewer_packet ? 0 : 1);
