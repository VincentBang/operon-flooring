"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Taxonomy = require("../../lib/floorplanCandidateReviewTaxonomy");

const repoRoot = path.resolve(__dirname, "../../..");
const taxonomyScript = path.join(repoRoot, "internal-qa", "scripts", "reportFloorplanCandidateReviewTaxonomy.js");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function assertNoSensitiveText(value, label) {
  assert.equal(SENSITIVE_PATTERN.test(String(value)), false, label + " should not include sensitive fields.");
}

(function testTaxonomyReportIsReviewerSafe() {
  const report = Taxonomy.buildCandidateReviewTaxonomyReport(corpus);
  assert.equal(report.report_type, "floorplan_candidate_review_taxonomy");
  assert.equal(report.local_only, true);
  assert.equal(report.customer_visible, false);
  assert.equal(report.safe_for_reviewer_qa, true);
  assert.equal(report.fixture_count, corpus.length);
  assert.ok(report.taxonomy_count >= 8);
  assert.equal(report.taxonomy_rows.length, report.taxonomy_count);
  assert.ok(report.fixture_review_rows.length >= 8);
  assert.ok(report.taxonomy_rows.every(function (row) {
    return row.key
      && row.label
      && row.reviewer_prompt.length > 30
      && row.allowed_next_actions.length > 0
      && row.blocks_auto_approval === true
      && row.customer_visible === false;
  }));
  assert.ok(report.fixture_review_rows.every(function (row) {
    return Taxonomy.taxonomyKeys().includes(row.taxonomy_key)
      && row.next_action
      && row.review_required === true;
  }));
  assertNoSensitiveText(JSON.stringify(report), "taxonomy report JSON");
})();

(function testOutcomeClassificationRules() {
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true,
    measured_area_warning: true
  }), "adjust_boundary");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true,
    area_warning: true
  }), "exclude_section");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true,
    plan_quality: "low_contrast_scan"
  }), "low_confidence_fallback");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true,
    plan_quality: "mixed_boundary"
  }), "split_or_merge_sections");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: false,
    review_required: true
  }), "needs_manual_trace");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true,
    section_count_delta: 1
  }), "extra_false_positive");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true,
    section_count_delta: -1
  }), "missing_room");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true,
    failures: ["scale_missing"]
  }), "scale_or_page_issue");
  assert.equal(Taxonomy.classifyCandidateReviewOutcome({
    selected_area_safe: true,
    review_required: true
  }), "accept_after_review");
})();

(function testTaxonomyMarkdownIsReadableAndSafe() {
  const report = Taxonomy.buildCandidateReviewTaxonomyReport(corpus);
  const markdown = Taxonomy.renderCandidateReviewTaxonomyMarkdown(report, {
    report_id: "test-review-taxonomy",
    created_at: "2026-07-01T00:00:00.000Z"
  });
  assert.ok(markdown.includes("# Floorplan Candidate Review Taxonomy"));
  assert.ok(markdown.includes("## Outcome Counts"));
  assert.ok(markdown.includes("## Fixture Classifications"));
  assert.ok(markdown.includes("Every outcome blocks automated approval"));
  assertNoSensitiveText(markdown, "taxonomy markdown");
})();

(function testTaxonomyCliWritesArtifactsAndJson() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-review-taxonomy-"));
  const json = childProcess.spawnSync(process.execPath, [
    taxonomyScript,
    "--json",
    "--write-artifacts",
    "--output-dir=" + outputDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(json.status, 0, json.stderr || json.stdout);
  assert.ok(json.stdout.includes("\"safe_for_reviewer_qa\": true"));

  const files = fs.readdirSync(outputDir);
  const jsonFile = files.find(function (file) { return file.endsWith(".json"); });
  const markdownFile = files.find(function (file) { return file.endsWith(".md"); });
  assert.ok(jsonFile, "Taxonomy CLI should write a JSON artifact.");
  assert.ok(markdownFile, "Taxonomy CLI should write a Markdown artifact.");

  const parsed = JSON.parse(fs.readFileSync(path.join(outputDir, jsonFile), "utf8"));
  const markdown = fs.readFileSync(path.join(outputDir, markdownFile), "utf8");
  assert.equal(parsed.artifact_metadata.method, "candidate-review-taxonomy");
  assert.equal(parsed.safe_for_reviewer_qa, true);
  assert.ok(markdown.includes("Fixture Classifications"));
  assertNoSensitiveText(JSON.stringify(parsed), "written taxonomy JSON");
  assertNoSensitiveText(markdown, "written taxonomy markdown");
})();

console.log("floorplanCandidateReviewTaxonomyContract.test.js passed");
