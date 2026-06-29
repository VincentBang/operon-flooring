"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Hybrid = require("../fixtures/floorplanHybridSelectorCandidates");
const Harness = require("./floorplanBenchmarkHarness");
const ReportWriter = require("./floorplanBenchmarkReportWriter");

function roundTo(value, places) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const factor = Math.pow(10, places || 2);
  return Math.round(number * factor) / factor;
}

function methodLabel(methodKey) {
  const labels = {
    classical_contour_spike: "Classical contour spike",
    manual_seed_baseline: "Manual-seed baseline",
    quick_room_baseline: "Quick-room baseline"
  };
  return labels[methodKey] || methodKey;
}

function countBy(rows, field) {
  return rows.reduce(function (counts, row) {
    const key = String(row[field] || "unknown");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function average(values) {
  const numeric = values.filter(function (value) {
    return Number.isFinite(Number(value));
  }).map(Number);
  if (!numeric.length) return null;
  return roundTo(numeric.reduce(function (sum, value) {
    return sum + value;
  }, 0) / numeric.length, 2);
}

function makeDecisionRow(item) {
  const choice = Hybrid.chooseHybridMethodForItem(item);
  const payload = Hybrid.hybridSelectorCandidatePayloadForItem(item);
  const score = Harness.scoreCandidatePayload(item, payload);
  const candidateLabels = payload.candidates.map(function (candidate) {
    return String(candidate.label || candidate.candidate_id || "candidate").slice(0, 80);
  });
  return {
    fixture_id: item.id,
    fixture_title: item.title,
    plan_quality: item.plan_quality,
    expected_confidence: item.expected_confidence,
    expected_section_count: Number(item.expected_section_count) || 0,
    selected_method_key: choice.method_key,
    selected_method_label: methodLabel(choice.method_key),
    selection_reason: choice.reason,
    candidate_section_count: score.candidate_section_count,
    candidate_section_labels: candidateLabels,
    reviewed_area_m2: score.reviewed_area_m2,
    candidate_measured_area_m2: score.candidate_measured_area_m2,
    candidate_selected_area_m2: score.candidate_selected_area_m2,
    area_error_percent: score.area_error_percent,
    measured_area_error_percent: score.measured_area_error_percent,
    area_warning: score.area_warning,
    measured_area_warning: score.measured_area_warning,
    review_required: score.review_required,
    selected_area_safe: score.candidate_selected_area_m2 === 0,
    passed_contract: score.passed_contract,
    failures: score.failures
  };
}

function buildHybridSelectorDecisionReport(items) {
  const rows = (Array.isArray(items) ? items : corpus).map(makeDecisionRow);
  const passedContractCount = rows.filter(function (row) {
    return row.passed_contract;
  }).length;
  const selectedAreaSafeCount = rows.filter(function (row) {
    return row.selected_area_safe;
  }).length;
  const measuredWarningCount = rows.filter(function (row) {
    return row.measured_area_warning;
  }).length;

  return {
    report_type: "floorplan_hybrid_selector_decision_report",
    benchmark_version: "floorplan-phase-3-hybrid-selector-v1",
    local_only: true,
    customer_visible: false,
    item_count: rows.length,
    passed_contract_count: passedContractCount,
    selected_area_safe_count: selectedAreaSafeCount,
    measured_warning_count: measuredWarningCount,
    average_measured_area_error_percent: average(rows.map(function (row) {
      return row.measured_area_error_percent;
    })),
    method_counts: countBy(rows, "selected_method_key"),
    safe_to_continue_detection_spike: rows.length > 0
      && passedContractCount === rows.length
      && selectedAreaSafeCount === rows.length
      && measuredWarningCount === 0,
    decisions: rows
  };
}

function formatPercent(value) {
  return value === null || typeof value === "undefined" ? "n/a" : value + "%";
}

function renderMethodCounts(counts) {
  return Object.keys(counts).sort().map(function (methodKey) {
    return "| " + methodLabel(methodKey) + " | `" + methodKey + "` | " + counts[methodKey] + " |";
  });
}

function renderHybridSelectorDecisionMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Hybrid Selector Decision Report");
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
  lines.push("| Fixtures reviewed | " + report.item_count + " |");
  lines.push("| Contract pass count | " + report.passed_contract_count + " |");
  lines.push("| Selected area held at zero | " + report.selected_area_safe_count + " |");
  lines.push("| Measured warning count | " + report.measured_warning_count + " |");
  lines.push("| Average measured area error | " + formatPercent(report.average_measured_area_error_percent) + " |");
  lines.push("| Ready for next detection spike | " + (report.safe_to_continue_detection_spike ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Method Mix");
  lines.push("");
  lines.push("| Method | Key | Fixtures |");
  lines.push("| --- | --- | ---: |");
  lines.push.apply(lines, renderMethodCounts(report.method_counts));
  lines.push("");
  lines.push("## Fixture Decisions");
  lines.push("");
  lines.push("| Fixture | Selected method | Why selected | Candidate sections | Measured error | Review required | Safe selected area |");
  lines.push("| --- | --- | --- | ---: | ---: | --- | --- |");
  report.decisions.forEach(function (row) {
    lines.push("| `" + row.fixture_id + "`"
      + " | " + row.selected_method_label
      + " | " + row.selection_reason
      + " | " + row.candidate_section_count
      + " | " + formatPercent(row.measured_area_error_percent)
      + " | " + (row.review_required ? "yes" : "no")
      + " | " + (row.selected_area_safe ? "yes" : "no")
      + " |");
  });
  lines.push("");
  lines.push("## Section Labels");
  lines.push("");
  report.decisions.forEach(function (row) {
    lines.push("- `" + row.fixture_id + "`: " + row.candidate_section_labels.join(", "));
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This report is a local benchmark artifact for reviewer validation only.");
  lines.push("- Hybrid selector candidates stay review-only and are not shown to customers.");
  lines.push("- Selected quote area stays at `0` until an internal reviewer approves a measurement version.");
  lines.push("- The report intentionally avoids private commercial inputs, upload paths, file links, extracted text, and personal details.");
  lines.push("");
  return lines.join("\n");
}

function writeHybridSelectorDecisionArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-hybrid-selector-decisions"),
    method: "hybrid-selector-decisions",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-hybrid-selector-decisions");
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
  fs.writeFileSync(markdownPath, renderHybridSelectorDecisionMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildHybridSelectorDecisionReport: buildHybridSelectorDecisionReport,
  renderHybridSelectorDecisionMarkdown: renderHybridSelectorDecisionMarkdown,
  writeHybridSelectorDecisionArtifacts: writeHybridSelectorDecisionArtifacts,
  _test: {
    methodLabel: methodLabel
  }
};
