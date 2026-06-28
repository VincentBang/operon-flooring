#!/usr/bin/env node
"use strict";

const Comparator = require("../lib/floorplanBenchmarkReportComparator");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const reportPath = argValue("--report=", "");
const jsonMode = process.argv.includes("--json");

if (!reportPath) {
  console.error("Usage: node internal-qa/scripts/rankFloorplanBenchmarkMethods.js --report=<report.json> [--json]");
  process.exit(2);
}

try {
  const ranking = Comparator.rankMethodsInReport(Comparator.readReport(reportPath));
  if (jsonMode) {
    process.stdout.write(JSON.stringify(ranking, null, 2) + "\n");
  } else {
    process.stdout.write(Comparator.renderMethodRankingMarkdown(ranking));
  }
  process.exit(ranking.safe_to_continue_detection_spike ? 0 : 1);
} catch (error) {
  console.error(error && error.message || error);
  process.exit(1);
}
