#!/usr/bin/env node
"use strict";

const Comparator = require("../lib/floorplanBenchmarkReportComparator");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const baselinePath = argValue("--baseline=", "");
const candidatePath = argValue("--candidate=", "");
const jsonMode = process.argv.includes("--json");

if (!baselinePath || !candidatePath) {
  console.error("Usage: node internal-qa/scripts/compareFloorplanBenchmarkReports.js --baseline=<report.json> --candidate=<report.json> [--json]");
  process.exit(2);
}

try {
  const comparison = Comparator.compareReports(
    Comparator.readReport(baselinePath),
    Comparator.readReport(candidatePath)
  );
  if (jsonMode) {
    process.stdout.write(JSON.stringify(comparison, null, 2) + "\n");
  } else {
    process.stdout.write(Comparator.renderComparisonMarkdown(comparison));
  }
  process.exit(comparison.safe_to_continue_detection_spike ? 0 : 1);
} catch (error) {
  console.error(error && error.message || error);
  process.exit(1);
}
