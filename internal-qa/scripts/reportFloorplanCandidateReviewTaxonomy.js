#!/usr/bin/env node
"use strict";

const Taxonomy = require("../lib/floorplanCandidateReviewTaxonomy");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

const jsonMode = process.argv.includes("--json");
const writeArtifacts = process.argv.includes("--write-artifacts");
const outputDir = argValue("--output-dir=", null);
const report = Taxonomy.buildCandidateReviewTaxonomyReport();

if (writeArtifacts) {
  const artifact = Taxonomy.writeCandidateReviewTaxonomyArtifacts(report, {
    outputDir: outputDir || undefined
  });
  console.log("Wrote candidate review taxonomy artifacts:");
  console.log("- JSON: " + artifact.json_path);
  console.log("- Markdown: " + artifact.markdown_path);
  if (!jsonMode) console.log("");
}

if (jsonMode) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(report.safe_for_reviewer_qa ? 0 : 1);
}

process.stdout.write(Taxonomy.renderCandidateReviewTaxonomyMarkdown(report));
process.exit(report.safe_for_reviewer_qa ? 0 : 1);
