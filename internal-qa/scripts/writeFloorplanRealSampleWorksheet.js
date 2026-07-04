#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const Worksheet = require("../lib/floorplanRealSampleWorksheet");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

function writeArtifacts(worksheet, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, "floorplan-real-sample-intake-worksheet.json");
  const markdownPath = path.join(outputDir, "floorplan-real-sample-intake-worksheet.md");
  fs.writeFileSync(jsonPath, JSON.stringify(worksheet, null, 2) + "\n");
  fs.writeFileSync(markdownPath, Worksheet.renderFloorplanRealSampleWorksheetMarkdown(worksheet));
  return {
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

const worksheet = Worksheet.buildFloorplanRealSampleWorksheet();
const outputDir = path.resolve(process.cwd(), argValue("--output-dir=", path.join("internal-qa", "reports", "floorplan-real-sample-worksheet")));

if (process.argv.includes("--write-artifacts")) {
  worksheet.artifacts = writeArtifacts(worksheet, outputDir);
}

if (process.argv.includes("--json")) {
  process.stdout.write(JSON.stringify(worksheet, null, 2) + "\n");
} else {
  process.stdout.write(Worksheet.renderFloorplanRealSampleWorksheetMarkdown(worksheet));
}
