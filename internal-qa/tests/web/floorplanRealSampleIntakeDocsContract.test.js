"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const docPath = path.join(repoRoot, "docs", "operon-flooring-floorplan-real-sample-intake-checklist.md");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

(function testRealSampleChecklistExistsAndContainsRequiredGates() {
  assert.ok(fs.existsSync(docPath), "Real sample intake checklist should exist.");
  const markdown = fs.readFileSync(docPath, "utf8");
  assert.ok(markdown.includes("# Operon Flooring Floorplan Real Sample Intake Checklist"));
  assert.ok(markdown.includes("fixture_origin: \"approved_real_reviewed_sample\""));
  assert.ok(markdown.includes("usage_status: \"approved_for_internal_benchmark\""));
  assert.ok(markdown.includes("privacy_status: \"customer_identifiers_removed\""));
  assert.ok(markdown.includes("customer_identifiers_removed: true"));
  assert.ok(markdown.includes("npm run test:floorplan-full"));
  assert.ok(markdown.includes("npm run benchmark:floorplan:real-sample-collection -- --json"));
  assert.ok(markdown.includes("npm run benchmark:floorplan:coverage -- --json"));
  assert.ok(markdown.includes("does not approve"));
})();

(function testChecklistDoesNotContainConcreteSensitiveValues() {
  const markdown = fs.readFileSync(docPath, "utf8");
  const allowedInstructionText = [
    "remove phone number",
    "remove email address",
    "remove street address",
    "remove exact property address",
    "remove storage bucket names",
    "remove storage paths",
    "remove signed URLs",
    "remove raw file names",
    "remove OCR text or quote text",
    "remove supplier costs, margins, rates and private pricing notes",
    "no storage path or file path",
    "if they identify a customer or address",
    "include address fragments"
  ];
  const scrubbed = allowedInstructionText.reduce(function (text, phrase) {
    return text.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "");
  }, markdown);
  assert.equal(SENSITIVE_PATTERN.test(scrubbed), false, "Checklist should not contain concrete sensitive values.");
})();

console.log("floorplanRealSampleIntakeDocsContract.test.js passed");
