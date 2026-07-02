"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Inspection = require("./floorplanCandidateInspectionPacketReport");
const Readiness = require("./floorplanReviewerReadinessGateReport");
const RealSample = require("./floorplanRealSampleIntakeGateReport");
const ReportWriter = require("./floorplanBenchmarkReportWriter");
const Tuning = require("./floorplanHybridSelectorTuningReport");

function buildStatusRows(reviewerGate, realSampleGate, tuning, inspection) {
  return [
    {
      area: "reviewer_qa",
      status: reviewerGate.ready_for_reviewer_qa ? "ready" : "blocked",
      detail: "Synthetic reviewer QA gate: " + (reviewerGate.ready_for_reviewer_qa ? "ready" : "blocked") + "."
    },
    {
      area: "real_sample_fixture_validation",
      status: "ready",
      detail: "Local validator is available for redacted approved sample fixtures before corpus inclusion."
    },
    {
      area: "real_sample_intake",
      status: realSampleGate.ready_for_real_sample_benchmark_batch ? "ready" : "blocked",
      detail: realSampleGate.coverage_gap_count + " real-sample coverage gaps remain."
    },
    {
      area: "hybrid_selector",
      status: tuning.ready_for_next_detection_spike ? "ready" : "blocked",
      detail: tuning.item_count + " fixtures checked against selector tuning rules."
    },
    {
      area: "inspection_packet",
      status: inspection.ready_for_reviewer_packet ? "ready" : "blocked",
      detail: inspection.total_candidate_count + " candidate sections are available in geometry-redacted packet form."
    },
    {
      area: "customer_visible_detection",
      status: "blocked",
      detail: "Customer-visible detection remains blocked by design."
    }
  ];
}

function buildFloorplanPhase3StatusReport(items) {
  const source = Array.isArray(items) ? items : corpus;
  const reviewerGate = Readiness.buildFloorplanReviewerReadinessGateReport(source);
  const realSampleGate = RealSample.buildFloorplanRealSampleIntakeGateReport(source);
  const tuning = Tuning.buildHybridSelectorTuningReport(source);
  const inspection = Inspection.buildFloorplanCandidateInspectionPacketReport(source);
  const statusRows = buildStatusRows(reviewerGate, realSampleGate, tuning, inspection);
  return {
    report_type: "floorplan_phase3_status_report",
    benchmark_version: "floorplan-phase-3-status-v1",
    local_only: true,
    customer_visible: false,
    fixture_count: source.length,
    ready_for_reviewer_qa: reviewerGate.ready_for_reviewer_qa,
    ready_for_real_sample_benchmark_batch: realSampleGate.ready_for_real_sample_benchmark_batch,
    ready_for_customer_visible_detection: false,
    total_candidate_count: inspection.total_candidate_count,
    hybrid_selector_ready: tuning.ready_for_next_detection_spike,
    local_gate_commands: [
      "npm run benchmark:floorplan:validate-real-sample -- --fixture-file=<redacted-fixture>",
      "npm run benchmark:floorplan:real-sample-intake -- --fixture-file=<redacted-fixture> --json",
      "npm run test:floorplan-full",
      "npm run check:public-leaks"
    ],
    next_safe_task: realSampleGate.ready_for_real_sample_benchmark_batch
      ? "Run reviewer QA against approved real reviewed samples."
      : "Collect and redact the first approved real reviewed sample batch before real detection work.",
    status_rows: statusRows
  };
}

function renderStatusRows(rows) {
  return rows.map(function (row) {
    return "| `" + row.status + "` | `" + row.area + "` | " + row.detail + " |";
  });
}

function renderFloorplanPhase3StatusMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Phase 3 Status Report");
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
  lines.push("| Candidate sections | " + report.total_candidate_count + " |");
  lines.push("| Reviewer QA ready | " + (report.ready_for_reviewer_qa ? "yes" : "no") + " |");
  lines.push("| Real sample batch ready | " + (report.ready_for_real_sample_benchmark_batch ? "yes" : "no") + " |");
  lines.push("| Hybrid selector ready | " + (report.hybrid_selector_ready ? "yes" : "no") + " |");
  lines.push("| Customer-visible detection ready | " + (report.ready_for_customer_visible_detection ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Status Rows");
  lines.push("");
  lines.push("| Status | Area | Detail |");
  lines.push("| --- | --- | --- |");
  lines.push.apply(lines, renderStatusRows(report.status_rows));
  lines.push("");
  lines.push("## Next Safe Task");
  lines.push("");
  lines.push(report.next_safe_task);
  lines.push("");
  lines.push("## Local Gate Commands");
  lines.push("");
  (report.local_gate_commands || []).forEach(function (command) {
    lines.push("- `" + command + "`");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This report is a local status artifact only.");
  lines.push("- It does not approve deployment or customer-visible detection.");
  lines.push("- It does not contain real customer documents or geometry details.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanPhase3StatusArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-phase3-status"),
    method: "phase3-status",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-phase3-status");
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
  fs.writeFileSync(markdownPath, renderFloorplanPhase3StatusMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildFloorplanPhase3StatusReport: buildFloorplanPhase3StatusReport,
  renderFloorplanPhase3StatusMarkdown: renderFloorplanPhase3StatusMarkdown,
  writeFloorplanPhase3StatusArtifacts: writeFloorplanPhase3StatusArtifacts
};
