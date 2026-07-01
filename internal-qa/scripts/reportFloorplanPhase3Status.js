#!/usr/bin/env node
"use strict";

const Status = require("../lib/floorplanPhase3StatusReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const report = Status.buildFloorplanPhase3StatusReport();

if (writeArtifacts) {
  const artifact = Status.writeFloorplanPhase3StatusArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote floorplan Phase 3 status artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(0);
}

process.stdout.write(Status.renderFloorplanPhase3StatusMarkdown(report));
process.exit(0);
