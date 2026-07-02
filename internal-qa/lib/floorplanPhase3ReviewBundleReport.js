"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Harness = require("./floorplanBenchmarkHarness");
const OperatorTime = require("./floorplanOperatorTimeEstimateReport");
const Phase3Status = require("./floorplanPhase3StatusReport");
const RealSampleGate = require("./floorplanRealSampleIntakeGateReport");
const ReportWriter = require("./floorplanBenchmarkReportWriter");
const ReviewerGate = require("./floorplanReviewerReadinessGateReport");
const SeedBox = require("../fixtures/floorplanSeedBoxCandidates");

function roundTo(value, places) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const factor = Math.pow(10, places || 2);
  return Math.round(number * factor) / factor;
}

function buildSummaryRows(status, reviewer, realSample, operatorTime) {
  return [
    {
      key: "reviewer_qa",
      status: status.ready_for_reviewer_qa ? "ready" : "blocked",
      evidence: reviewer.pass_count + " reviewer gates passing; " + reviewer.block_count + " gate(s) blocked."
    },
    {
      key: "candidate_review_value",
      status: operatorTime.safe_for_internal_planning ? "ready" : "blocked",
      evidence: operatorTime.total_estimated_minutes_saved + " estimated internal minutes saved across synthetic fixtures."
    },
    {
      key: "real_sample_intake",
      status: realSample.ready_for_real_sample_benchmark_batch ? "ready" : "blocked",
      evidence: realSample.coverage_gap_count + " coverage gap(s) remain in approved real reviewed samples."
    },
    {
      key: "customer_visible_detection",
      status: "blocked",
      evidence: "Customer-visible detection remains blocked until reviewer approval and separate production approval."
    }
  ];
}

function buildFloorplanPhase3ReviewBundleReport(items) {
  const source = Array.isArray(items) ? items : corpus;
  const status = Phase3Status.buildFloorplanPhase3StatusReport(source);
  const reviewer = ReviewerGate.buildFloorplanReviewerReadinessGateReport(source);
  const realSample = RealSampleGate.buildFloorplanRealSampleIntakeGateReport(source);
  const operatorTime = OperatorTime.buildFloorplanOperatorTimeEstimateReport(source);
  const seedBoxSummary = buildSeedBoxSummary(source);
  const rows = buildSummaryRows(status, reviewer, realSample, operatorTime);
  return {
    report_type: "floorplan_phase3_review_bundle_report",
    benchmark_version: "floorplan-phase-3-review-bundle-v1",
    local_only: true,
    customer_visible: false,
    fixture_count: source.length,
    candidate_section_count: status.total_candidate_count,
    ready_for_reviewer_qa: status.ready_for_reviewer_qa,
    ready_for_real_sample_benchmark_batch: status.ready_for_real_sample_benchmark_batch,
    ready_for_customer_visible_detection: false,
    estimated_minutes_saved: operatorTime.total_estimated_minutes_saved,
    seed_box_spike_summary: seedBoxSummary,
    next_safe_task: status.next_safe_task,
    local_gate_commands: status.local_gate_commands,
    summary_rows: rows
  };
}

function average(rows, field) {
  const values = rows.map(function (row) {
    return Number(row[field]);
  }).filter(Number.isFinite);
  if (!values.length) return null;
  return roundTo(values.reduce(function (sum, value) {
    return sum + value;
  }, 0) / values.length, 2);
}

function buildSeedBoxSummary(source) {
  const results = source.map(function (item) {
    return Harness.scoreCandidatePayload(item, SeedBox.seedBoxCandidatePayloadForItem(item), { areaWarningThresholdPercent: 80 });
  });
  const contractPassCount = results.filter(function (result) { return result.passed_contract; }).length;
  const selectedAreaSafeCount = results.filter(function (result) { return result.candidate_selected_area_m2 === 0; }).length;
  const averageMeasured = average(results, "measured_area_error_percent");
  return {
    method_key: "seed_box_spike",
    method_label: "Seed-box spike",
    item_count: results.length,
    contract_pass_count: contractPassCount,
    selected_area_safe_count: selectedAreaSafeCount,
    measured_warning_count: results.filter(function (result) { return result.measured_area_warning; }).length,
    average_measured_area_error_percent: averageMeasured,
    recommendation: averageMeasured !== null && averageMeasured <= 8
      ? "Keep investigating seed-box as a candidate helper."
      : "Keep seed-box as a contract test only; it is not accurate enough to guide reviewer defaults yet."
  };
}

function renderSummaryRows(rows) {
  return rows.map(function (row) {
    return "| `" + row.status + "` | `" + row.key + "` | " + row.evidence + " |";
  });
}

function renderFloorplanPhase3ReviewBundleMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Phase 3 Review Bundle");
  lines.push("");
  if (meta.report_id) lines.push("- Report id: `" + meta.report_id + "`");
  if (meta.created_at) lines.push("- Created at: `" + meta.created_at + "`");
  lines.push("- Benchmark version: `" + report.benchmark_version + "`");
  lines.push("- Local only: yes");
  lines.push("- Customer visible: no");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push("| Fixtures | " + report.fixture_count + " |");
  lines.push("| Candidate sections | " + report.candidate_section_count + " |");
  lines.push("| Estimated internal minutes saved | " + report.estimated_minutes_saved + " |");
  lines.push("| Reviewer QA ready | " + (report.ready_for_reviewer_qa ? "yes" : "no") + " |");
  lines.push("| Real sample batch ready | " + (report.ready_for_real_sample_benchmark_batch ? "yes" : "no") + " |");
  lines.push("| Customer-visible detection ready | no |");
  lines.push("");
  lines.push("## Readiness Rows");
  lines.push("");
  lines.push("| Status | Gate | Evidence |");
  lines.push("| --- | --- | --- |");
  lines.push.apply(lines, renderSummaryRows(report.summary_rows));
  lines.push("");
  lines.push("## Seed-Box Spike Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push("| Cases | " + report.seed_box_spike_summary.item_count + " |");
  lines.push("| Contract pass | " + report.seed_box_spike_summary.contract_pass_count + " |");
  lines.push("| Selected-area safe | " + report.seed_box_spike_summary.selected_area_safe_count + " |");
  lines.push("| Measured warnings | " + report.seed_box_spike_summary.measured_warning_count + " |");
  lines.push("| Avg measured error | " + report.seed_box_spike_summary.average_measured_area_error_percent + "% |");
  lines.push("");
  lines.push(report.seed_box_spike_summary.recommendation);
  lines.push("");
  lines.push("## Local Gate Commands");
  lines.push("");
  (report.local_gate_commands || []).forEach(function (command) {
    lines.push("- `" + command + "`");
  });
  lines.push("");
  lines.push("## Next Safe Task");
  lines.push("");
  lines.push(report.next_safe_task);
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This bundle is for internal floorplan reviewer planning only.");
  lines.push("- It does not approve automated measurements.");
  lines.push("- It does not approve customer-visible detection.");
  lines.push("- It does not read uploaded documents or expose geometry.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanPhase3ReviewBundleArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-phase3-review-bundle"),
    method: "phase3-review-bundle",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-phase3-review-bundle");
  }
  const timestamp = ReportWriter.makeTimestamp(settings.date);
  const reportId = timestamp + "-" + ReportWriter.safeSlug(settings.method);
  const metadata = {
    report_id: reportId,
    created_at: settings.date.toISOString(),
    method: ReportWriter.safeSlug(settings.method)
  };
  const fullReport = Object.assign({}, report, { artifact_metadata: metadata });
  fs.mkdirSync(settings.outputDir, { recursive: true });
  const jsonPath = path.join(settings.outputDir, reportId + ".json");
  const markdownPath = path.join(settings.outputDir, reportId + ".md");
  fs.writeFileSync(jsonPath, JSON.stringify(fullReport, null, 2) + "\n");
  fs.writeFileSync(markdownPath, renderFloorplanPhase3ReviewBundleMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildSeedBoxSummary: buildSeedBoxSummary,
  buildFloorplanPhase3ReviewBundleReport: buildFloorplanPhase3ReviewBundleReport,
  renderFloorplanPhase3ReviewBundleMarkdown: renderFloorplanPhase3ReviewBundleMarkdown,
  writeFloorplanPhase3ReviewBundleArtifacts: writeFloorplanPhase3ReviewBundleArtifacts
};
