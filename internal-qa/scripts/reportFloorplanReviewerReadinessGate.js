#!/usr/bin/env node
"use strict";

const Gate = require("../lib/floorplanReviewerReadinessGateReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const report = Gate.buildFloorplanReviewerReadinessGateReport();

if (writeArtifacts) {
  const artifact = Gate.writeFloorplanReviewerReadinessGateArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote floorplan reviewer readiness gate artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(report.ready_for_reviewer_qa ? 0 : 1);
}

process.stdout.write(Gate.renderFloorplanReviewerReadinessGateMarkdown(report));
process.exit(report.ready_for_reviewer_qa ? 0 : 1);
