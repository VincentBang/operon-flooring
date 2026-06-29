#!/usr/bin/env node
"use strict";

const DecisionReport = require("../lib/floorplanHybridSelectorDecisionReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const report = DecisionReport.buildHybridSelectorDecisionReport();

if (writeArtifacts) {
  const artifact = DecisionReport.writeHybridSelectorDecisionArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote hybrid selector decision artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(report.safe_to_continue_detection_spike ? 0 : 1);
}

process.stdout.write(DecisionReport.renderHybridSelectorDecisionMarkdown(report));
process.exit(report.safe_to_continue_detection_spike ? 0 : 1);
