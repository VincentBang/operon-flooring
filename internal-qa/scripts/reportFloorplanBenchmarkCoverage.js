#!/usr/bin/env node
"use strict";

const Coverage = require("../lib/floorplanBenchmarkCoverageReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const report = Coverage.buildFloorplanBenchmarkCoverageReport();

if (writeArtifacts) {
  const artifact = Coverage.writeFloorplanBenchmarkCoverageArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote floorplan benchmark coverage artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(report.ready_for_local_detection_spike ? 0 : 1);
}

process.stdout.write(Coverage.renderFloorplanBenchmarkCoverageMarkdown(report));
process.exit(report.ready_for_local_detection_spike ? 0 : 1);
