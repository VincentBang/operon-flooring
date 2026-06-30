#!/usr/bin/env node
"use strict";

const Tuning = require("../lib/floorplanHybridSelectorTuningReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const toleranceArg = Number(argValue("--tolerance-percent=", "2"));
const report = Tuning.buildHybridSelectorTuningReport(null, {
  tolerancePercent: Number.isFinite(toleranceArg) ? toleranceArg : 2
});

if (writeArtifacts) {
  const artifact = Tuning.writeHybridSelectorTuningArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote hybrid selector tuning artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(report.ready_for_next_detection_spike ? 0 : 1);
}

process.stdout.write(Tuning.renderHybridSelectorTuningMarkdown(report));
process.exit(report.ready_for_next_detection_spike ? 0 : 1);
