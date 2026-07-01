"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Coverage = require("./floorplanBenchmarkCoverageReport");
const InspectionPacket = require("./floorplanCandidateInspectionPacketReport");
const ReportWriter = require("./floorplanBenchmarkReportWriter");
const Taxonomy = require("./floorplanCandidateReviewTaxonomy");
const TimeEstimates = require("./floorplanOperatorTimeEstimateReport");

function buildGateRows(coverage, taxonomy, inspection, timeEstimates) {
  return [
    {
      key: "synthetic_coverage",
      label: "Synthetic benchmark coverage",
      status: coverage.ready_for_local_detection_spike ? "pass" : "block",
      evidence: coverage.covered_target_count + " of " + coverage.coverage_rows.length + " coverage targets covered."
    },
    {
      key: "real_reviewed_samples",
      label: "Approved real reviewed samples",
      status: coverage.ready_for_real_detection_training ? "pass" : "block",
      evidence: "Real reviewed samples remain intentionally blocked until privacy-safe intake is approved."
    },
    {
      key: "review_taxonomy",
      label: "Reviewer outcome taxonomy",
      status: taxonomy.safe_for_reviewer_qa ? "pass" : "block",
      evidence: taxonomy.taxonomy_count + " review outcomes defined; every outcome blocks automated approval."
    },
    {
      key: "inspection_packet",
      label: "Geometry-redacted inspection packet",
      status: inspection.ready_for_reviewer_packet ? "pass" : "block",
      evidence: inspection.fixture_count + " fixtures and " + inspection.total_candidate_count + " candidate sections summarized with geometry redacted."
    },
    {
      key: "operator_time",
      label: "Operator time planning estimate",
      status: timeEstimates.safe_for_internal_planning ? "pass" : "block",
      evidence: timeEstimates.total_estimated_minutes_saved + " estimated internal minutes saved across current fixtures."
    },
    {
      key: "customer_visibility",
      label: "Customer visibility",
      status: coverage.customer_visible || taxonomy.customer_visible || inspection.customer_visible || timeEstimates.customer_visible ? "block" : "pass",
      evidence: "Reports are marked local-only and customer-invisible."
    }
  ];
}

function buildFloorplanReviewerReadinessGateReport(items) {
  const source = Array.isArray(items) ? items : corpus;
  const coverage = Coverage.buildFloorplanBenchmarkCoverageReport(source);
  const taxonomy = Taxonomy.buildCandidateReviewTaxonomyReport(source);
  const inspection = InspectionPacket.buildFloorplanCandidateInspectionPacketReport(source);
  const timeEstimates = TimeEstimates.buildFloorplanOperatorTimeEstimateReport(source);
  const gateRows = buildGateRows(coverage, taxonomy, inspection, timeEstimates);
  const blockingRows = gateRows.filter(function (row) { return row.status === "block"; });
  const reviewerQaBlocks = blockingRows.filter(function (row) {
    return row.key !== "real_reviewed_samples";
  });
  return {
    report_type: "floorplan_reviewer_readiness_gate",
    benchmark_version: "floorplan-phase-3-reviewer-readiness-v1",
    local_only: true,
    customer_visible: false,
    fixture_count: source.length,
    pass_count: gateRows.length - blockingRows.length,
    block_count: blockingRows.length,
    ready_for_reviewer_qa: reviewerQaBlocks.length === 0,
    ready_for_real_detection_training: false,
    ready_for_customer_visible_detection: false,
    next_required_action: blockingRows.some(function (row) { return row.key === "real_reviewed_samples"; })
      ? "Add approved real reviewed samples through the privacy-safe intake checklist before any real detection training."
      : "Run reviewer QA on the geometry-redacted inspection packet.",
    gate_rows: gateRows
  };
}

function renderGateRows(rows) {
  return rows.map(function (row) {
    return "| `" + row.status + "` | `" + row.key + "` | " + row.label + " | " + row.evidence + " |";
  });
}

function renderFloorplanReviewerReadinessGateMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Reviewer Readiness Gate");
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
  lines.push("| Pass gates | " + report.pass_count + " |");
  lines.push("| Blocked gates | " + report.block_count + " |");
  lines.push("| Ready for reviewer QA | " + (report.ready_for_reviewer_qa ? "yes" : "no") + " |");
  lines.push("| Ready for real detection training | " + (report.ready_for_real_detection_training ? "yes" : "no") + " |");
  lines.push("| Ready for customer-visible detection | " + (report.ready_for_customer_visible_detection ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Gate Rows");
  lines.push("");
  lines.push("| Status | Key | Gate | Evidence |");
  lines.push("| --- | --- | --- | --- |");
  lines.push.apply(lines, renderGateRows(report.gate_rows));
  lines.push("");
  lines.push("## Next Required Action");
  lines.push("");
  lines.push(report.next_required_action);
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- Reviewer QA readiness does not approve production deployment.");
  lines.push("- Real detection training remains blocked until real reviewed samples are approved and redacted.");
  lines.push("- Customer-visible detection remains blocked.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanReviewerReadinessGateArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-reviewer-readiness-gate"),
    method: "reviewer-readiness-gate",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-reviewer-readiness-gate");
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
  fs.writeFileSync(markdownPath, renderFloorplanReviewerReadinessGateMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildFloorplanReviewerReadinessGateReport: buildFloorplanReviewerReadinessGateReport,
  renderFloorplanReviewerReadinessGateMarkdown: renderFloorplanReviewerReadinessGateMarkdown,
  writeFloorplanReviewerReadinessGateArtifacts: writeFloorplanReviewerReadinessGateArtifacts
};
