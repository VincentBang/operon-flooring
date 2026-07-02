"use strict";

const fs = require("fs");
const path = require("path");

const Bundle = require("./floorplanPhase3ReviewBundleReport");
const ReportWriter = require("./floorplanBenchmarkReportWriter");

function buildNextActionRows(bundle) {
  const rows = [];
  if (!bundle.ready_for_real_sample_benchmark_batch) {
    rows.push({
      priority: "P0",
      action: "collect_redacted_real_sample_batch",
      status: "blocked_on_human_samples",
      detail: "Collect five approved reviewed samples covering low contrast, mixed boundary, void/stair-adjacent, multipage PDF and irregular geometry."
    });
    rows.push({
      priority: "P0",
      action: "validate_real_sample_batch",
      status: "ready_when_samples_exist",
      detail: "Run the fixture validator and dry-run intake gate before committing any real reviewed sample fixture."
    });
  }
  rows.push({
    priority: "P1",
    action: "run_reviewer_qa_with_review_bundle",
    status: bundle.ready_for_reviewer_qa ? "ready" : "blocked",
    detail: "Use the Phase 3 review bundle and geometry-redacted inspection packet for internal reviewer validation."
  });
  rows.push({
    priority: "P1",
    action: "keep_seed_box_as_contract_test_only",
    status: "ready",
    detail: bundle.seed_box_spike_summary.recommendation
  });
  rows.push({
    priority: "P2",
    action: "design_next_candidate_experiment",
    status: "ready_after_real_samples",
    detail: "Only tune candidate generation after the approved real-sample batch exists and passes the local intake gate."
  });
  rows.push({
    priority: "P3",
    action: "customer_visible_detection",
    status: "blocked",
    detail: "Customer-visible detection remains blocked until reviewer approval, real-sample QA and separate production approval."
  });
  return rows;
}

function buildFloorplanPhase3NextActionsReport(items) {
  const bundle = Bundle.buildFloorplanPhase3ReviewBundleReport(items);
  const rows = buildNextActionRows(bundle);
  return {
    report_type: "floorplan_phase3_next_actions_report",
    benchmark_version: "floorplan-phase-3-next-actions-v1",
    local_only: true,
    customer_visible: false,
    ready_for_reviewer_qa: bundle.ready_for_reviewer_qa,
    ready_for_real_sample_benchmark_batch: bundle.ready_for_real_sample_benchmark_batch,
    ready_for_customer_visible_detection: false,
    next_action_count: rows.length,
    next_action_rows: rows,
    gate_commands: bundle.local_gate_commands
  };
}

function renderRows(rows) {
  return rows.map(function (row) {
    return "| `" + row.priority + "` | `" + row.status + "` | `" + row.action + "` | " + row.detail + " |";
  });
}

function renderFloorplanPhase3NextActionsMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Phase 3 Next Actions");
  lines.push("");
  if (meta.report_id) lines.push("- Report id: `" + meta.report_id + "`");
  if (meta.created_at) lines.push("- Created at: `" + meta.created_at + "`");
  lines.push("- Benchmark version: `" + report.benchmark_version + "`");
  lines.push("- Local only: yes");
  lines.push("- Customer visible: no");
  lines.push("");
  lines.push("## Action Queue");
  lines.push("");
  lines.push("| Priority | Status | Action | Detail |");
  lines.push("| --- | --- | --- | --- |");
  lines.push.apply(lines, renderRows(report.next_action_rows));
  lines.push("");
  lines.push("## Gate Commands");
  lines.push("");
  (report.gate_commands || []).forEach(function (command) {
    lines.push("- `" + command + "`");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This queue is local planning only.");
  lines.push("- It does not approve deployment or customer-visible detection.");
  lines.push("- It does not read customer uploads.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanPhase3NextActionsArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-phase3-next-actions"),
    method: "phase3-next-actions",
    date: new Date()
  }, options || {});
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
  fs.writeFileSync(markdownPath, renderFloorplanPhase3NextActionsMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildFloorplanPhase3NextActionsReport: buildFloorplanPhase3NextActionsReport,
  renderFloorplanPhase3NextActionsMarkdown: renderFloorplanPhase3NextActionsMarkdown,
  writeFloorplanPhase3NextActionsArtifacts: writeFloorplanPhase3NextActionsArtifacts
};
