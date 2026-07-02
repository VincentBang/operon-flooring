"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const docPath = path.join(repoRoot, "docs", "operon-flooring-floorplan-phase-3-review-packet-runbook.md");
const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function scrubAllowedInstructionText(markdown) {
  const allowed = [
    "temporary access links",
    "raw OCR or quote text",
    "internal rates"
  ];
  return allowed.reduce(function (text, phrase) {
    return text.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "");
  }, markdown);
}

(function testReviewPacketRunbookExistsAndContainsRequiredCommands() {
  assert.ok(fs.existsSync(docPath), "Phase 3 review packet runbook should exist.");
  const markdown = fs.readFileSync(docPath, "utf8");
  assert.ok(markdown.includes("# Operon Flooring Floorplan Phase 3 Review Packet Runbook"));
  assert.ok(markdown.includes("npm run benchmark:floorplan:phase3-packet"));
  assert.ok(markdown.includes("floorplanPhase3ReviewPacketContract.test.js"));
  assert.ok(markdown.includes("npm run test:floorplan-full"));
  assert.ok(markdown.includes("does not approve"));
  assert.ok(markdown.includes("customer-visible detection remains blocked"));
  assert.ok(markdown.includes("real reviewed sample intake remains blocked"));
})();

(function testReviewPacketRunbookDoesNotContainConcreteSensitiveValues() {
  const markdown = fs.readFileSync(docPath, "utf8");
  assert.equal(SENSITIVE_PATTERN.test(scrubAllowedInstructionText(markdown)), false, "Runbook should not contain concrete sensitive values.");
})();

console.log("floorplanPhase3ReviewPacketDocsContract.test.js passed");
