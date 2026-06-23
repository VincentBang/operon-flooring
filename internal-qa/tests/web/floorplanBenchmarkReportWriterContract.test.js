"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const corpus = require("../../fixtures/floorplanBenchmarkCorpus");
const Baseline = require("../../fixtures/floorplanQuickRoomBaselineCandidates");
const Harness = require("../../lib/floorplanBenchmarkHarness");
const Writer = require("../../lib/floorplanBenchmarkReportWriter");

function makeReport() {
  const report = Harness.runBenchmark(corpus);
  const quickRoomItems = corpus.filter(function (item) {
    return item.plan_quality === "clean_vector" && Number(item.expected_section_count) <= 2;
  });
  const quickRoomResults = quickRoomItems.map(function (item) {
    return Harness.scoreCandidatePayload(item, Baseline.quickRoomCandidatePayloadForItem(item));
  });
  return Object.assign({}, report, {
    quick_room_baseline: {
      item_count: quickRoomResults.length,
      passed_contract_count: quickRoomResults.filter(function (result) { return result.passed_contract; }).length,
      results: quickRoomResults
    }
  });
}

(function testSlugAndTimestampAreStable() {
  assert.equal(Writer.safeSlug("Quick Room / Baseline v1"), "quick-room-baseline-v1");
  assert.equal(Writer.makeTimestamp(new Date(2026, 5, 23, 10, 11, 12)), "20260623-101112");
})();

(function testWriterCreatesJsonAndMarkdownArtifacts() {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-benchmark-"));
  const artifact = Writer.writeBenchmarkArtifacts(makeReport(), {
    outputDir: outputDir,
    method: "quick-room-baseline",
    date: new Date(2026, 5, 23, 10, 11, 12)
  });

  assert.equal(path.basename(artifact.json_path), "20260623-101112-quick-room-baseline.json");
  assert.equal(path.basename(artifact.markdown_path), "20260623-101112-quick-room-baseline.md");
  assert.ok(fs.existsSync(artifact.json_path), "JSON benchmark artifact should exist.");
  assert.ok(fs.existsSync(artifact.markdown_path), "Markdown benchmark artifact should exist.");

  const json = JSON.parse(fs.readFileSync(artifact.json_path, "utf8"));
  const markdown = fs.readFileSync(artifact.markdown_path, "utf8");
  assert.equal(json.artifact_metadata.report_id, "20260623-101112-quick-room-baseline");
  assert.equal(json.quick_room_baseline.passed_contract_count, json.quick_room_baseline.item_count);
  assert.ok(markdown.includes("# Operon Floorplan Benchmark Report"));
  assert.ok(markdown.includes("Quick-Room Baseline Candidates"));
  assert.ok(markdown.includes("Candidate selected area must remain `0` until reviewed."));
  assert.equal(JSON.stringify(json.results).includes("storage_path"), false);
  assert.equal(JSON.stringify(json.quick_room_baseline.results).includes("storage_path"), false);
  assert.equal(JSON.stringify(json.results).includes("supplier_cost"), false);
  assert.equal(JSON.stringify(json.quick_room_baseline.results).includes("supplier_cost"), false);
})();

console.log("floorplanBenchmarkReportWriterContract.test.js passed");
