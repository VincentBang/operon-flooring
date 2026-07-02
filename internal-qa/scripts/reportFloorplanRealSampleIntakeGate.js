#!/usr/bin/env node
"use strict";

const Gate = require("../lib/floorplanRealSampleIntakeGateReport");
const Validator = require("./validateFloorplanRealSampleFixture");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const fixtureFile = argValue("--fixture-file=", null);

let report;
if (fixtureFile) {
  const fixtures = Validator.loadFixture(fixtureFile);
  const validation = Validator.validateFixtures(fixtures);
  if (!validation.ok) {
    process.stderr.write(JSON.stringify(validation, null, 2) + "\n");
    process.exit(1);
  }
  report = Gate.buildFloorplanRealSampleIntakeGateReport(Array.isArray(fixtures) ? fixtures : [fixtures]);
} else {
  report = Gate.buildFloorplanRealSampleIntakeGateReport();
}

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
