#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const Converter = require("../lib/floorplanRealSampleWorksheetConverter");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

function loadJson(filePath) {
  const absolute = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolute)) throw new Error("Worksheet file does not exist.");
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

function writeOutput(result, outputPath) {
  const absolute = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, JSON.stringify(result.fixtures, null, 2) + "\n");
  return absolute;
}

function main() {
  const worksheetFile = argValue("--worksheet-file=", "");
  const outputFile = argValue("--output-file=", "");
  if (!worksheetFile) {
    console.error("Usage: node internal-qa/scripts/convertFloorplanRealSampleWorksheet.js --worksheet-file=<path> --output-file=<path>");
    process.exit(1);
  }
  try {
    const result = Converter.convertAndValidateWorksheet(loadJson(worksheetFile));
    const response = {
      ok: result.ok,
      fixture_count: result.fixture_count,
      ready_for_real_sample_benchmark_batch: result.ready_for_real_sample_benchmark_batch,
      validation: result.validation,
      output_file: outputFile ? writeOutput(result, outputFile) : null
    };
    process.stdout.write(JSON.stringify(response, null, 2) + "\n");
    process.exit(response.ok ? 0 : 1);
  } catch (error) {
    console.error(error && error.message ? error.message : String(error));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
