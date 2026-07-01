#!/usr/bin/env node
"use strict";

const Gate = require("../lib/floorplanRealSampleIntakeGateReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const report = Gate.buildFloorplanRealSampleIntakeGateReport();

if (writeArtifacts) {
  const artifact = Gate.writeFloorplanRealSampleIntakeGateArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote floorplan real sample intake gate artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(0);
}

process.stdout.write(Gate.renderFloorplanRealSampleIntakeGateMarkdown(report));
process.exit(0);
