"use strict";

const fs = require("fs");
const path = require("path");

function pad(value) {
  return String(value).padStart(2, "0");
}

function makeTimestamp(date) {
  const current = date || new Date();
  return [
    current.getFullYear(),
    pad(current.getMonth() + 1),
    pad(current.getDate())
  ].join("")
    + "-"
    + [
      pad(current.getHours()),
      pad(current.getMinutes()),
      pad(current.getSeconds())
    ].join("");
}

function safeSlug(value) {
  return String(value || "floorplan-benchmark")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "floorplan-benchmark";
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function formatPercent(value) {
  return value === null || typeof value === "undefined" ? "n/a" : value + "%";
}

function renderMarkdown(report, metadata) {
  const quickRoom = report.quick_room_baseline || { item_count: 0, passed_contract_count: 0, results: [] };
  const manualSeed = report.manual_seed_baseline || { item_count: 0, passed_contract_count: 0, results: [] };
  const classicalContour = report.classical_contour_spike || { item_count: 0, passed_contract_count: 0, measured_warning_count: 0, results: [] };
  const lines = [];
  lines.push("# Operon Floorplan Benchmark Report");
  lines.push("");
  lines.push("- Report id: `" + metadata.report_id + "`");
  lines.push("- Created at: `" + metadata.created_at + "`");
  lines.push("- Benchmark version: `" + report.benchmark_version + "`");
  lines.push("- Method: `" + metadata.method + "`");
  lines.push("- Local only: yes");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push("| Corpus items | " + report.item_count + " |");
  lines.push("| Corpus passed | " + report.passed_count + " |");
  lines.push("| Corpus failed | " + report.failed_count + " |");
  lines.push("| Corpus warnings | " + report.warning_count + " |");
  lines.push("| Average customer trace error | " + formatPercent(report.average_customer_area_error_percent) + " |");
  lines.push("| Ready for Phase 3 detection spike | " + (report.ready_for_phase3_detection_spike ? "yes" : "no") + " |");
  lines.push("| Quick-room baseline cases | " + quickRoom.item_count + " |");
  lines.push("| Quick-room contract pass | " + quickRoom.passed_contract_count + " |");
  lines.push("| Manual-seed baseline cases | " + manualSeed.item_count + " |");
  lines.push("| Manual-seed contract pass | " + manualSeed.passed_contract_count + " |");
  lines.push("| Classical contour spike cases | " + classicalContour.item_count + " |");
  lines.push("| Classical contour contract pass | " + classicalContour.passed_contract_count + " |");
  lines.push("| Classical contour measured warnings | " + classicalContour.measured_warning_count + " |");
  lines.push("");
  lines.push("## Reviewed Fixture Results");
  lines.push("");
  lines.push("| Status | Fixture | Reviewed m2 | Expected m2 | Sections | Confidence |");
  lines.push("| --- | --- | ---: | ---: | ---: | --- |");
  report.results.forEach(function (result) {
    lines.push("| " + (result.passed ? "PASS" : "FAIL")
      + " | `" + result.id + "`"
      + " | " + result.reviewed_area_m2
      + " | " + result.expected_reviewed_area_m2
      + " | " + result.reviewed_section_count
      + " | " + result.expected_confidence
      + " |");
  });
  lines.push("");
  lines.push("## Quick-Room Baseline Candidates");
  lines.push("");
  lines.push("| Status | Fixture | Candidate measured m2 | Reviewed m2 | Area error | Measured error | Selected m2 | Review required |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |");
  quickRoom.results.forEach(function (result) {
    lines.push("| " + (result.passed_contract ? "PASS" : "FAIL")
      + " | `" + result.id + "`"
      + " | " + result.candidate_measured_area_m2
      + " | " + result.reviewed_area_m2
      + " | " + formatPercent(result.area_error_percent)
      + " | " + formatPercent(result.measured_area_error_percent)
      + " | " + result.candidate_selected_area_m2
      + " | " + (result.review_required ? "yes" : "no")
      + " |");
  });
  lines.push("");
  lines.push("## Manual-Seed Baseline Candidates");
  lines.push("");
  lines.push("| Status | Fixture | Candidate measured m2 | Reviewed m2 | Area error | Measured error | Selected m2 | Review required |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |");
  manualSeed.results.forEach(function (result) {
    lines.push("| " + (result.passed_contract ? "PASS" : "FAIL")
      + " | `" + result.id + "`"
      + " | " + result.candidate_measured_area_m2
      + " | " + result.reviewed_area_m2
      + " | " + formatPercent(result.area_error_percent)
      + " | " + formatPercent(result.measured_area_error_percent)
      + " | " + result.candidate_selected_area_m2
      + " | " + (result.review_required ? "yes" : "no")
      + " |");
  });
  lines.push("");
  lines.push("## Classical Contour Spike Candidates");
  lines.push("");
  lines.push("| Status | Fixture | Candidate measured m2 | Reviewed m2 | Area error | Measured error | Selected m2 | Review required | Warning |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |");
  classicalContour.results.forEach(function (result) {
    lines.push("| " + (result.passed_contract ? "PASS" : "FAIL")
      + " | `" + result.id + "`"
      + " | " + result.candidate_measured_area_m2
      + " | " + result.reviewed_area_m2
      + " | " + formatPercent(result.area_error_percent)
      + " | " + formatPercent(result.measured_area_error_percent)
      + " | " + result.candidate_selected_area_m2
      + " | " + (result.review_required ? "yes" : "no")
      + " | " + (result.measured_area_warning ? "measured-area-drift" : "")
      + " |");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This report is generated from synthetic or explicitly approved benchmark fixtures only.");
  lines.push("- Candidate measurements are not final and are not customer-visible.");
  lines.push("- Candidate selected area must remain `0` until reviewed.");
  lines.push("- No pricing, supplier costs, margins, rates, storage paths, OCR text or PII should appear in this artifact.");
  lines.push("");
  return lines.join("\n");
}

function writeBenchmarkArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-benchmarks"),
    method: "quick-room-baseline",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-benchmarks");
  }
  const timestamp = makeTimestamp(settings.date);
  const reportId = timestamp + "-" + safeSlug(settings.method);
  const metadata = {
    report_id: reportId,
    created_at: settings.date.toISOString(),
    method: safeSlug(settings.method)
  };
  const fullReport = Object.assign({}, report, { artifact_metadata: metadata });
  ensureDir(settings.outputDir);

  const jsonPath = path.join(settings.outputDir, reportId + ".json");
  const markdownPath = path.join(settings.outputDir, reportId + ".md");
  fs.writeFileSync(jsonPath, JSON.stringify(fullReport, null, 2) + "\n");
  fs.writeFileSync(markdownPath, renderMarkdown(fullReport, metadata));

  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  makeTimestamp: makeTimestamp,
  renderMarkdown: renderMarkdown,
  safeSlug: safeSlug,
  writeBenchmarkArtifacts: writeBenchmarkArtifacts
};
