"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Taxonomy = require("./floorplanCandidateReviewTaxonomy");
const ReportWriter = require("./floorplanBenchmarkReportWriter");

const OUTCOME_MINUTES = {
  accept_after_review: 1.5,
  adjust_boundary: 4,
  split_or_merge_sections: 5,
  exclude_section: 2.5,
  needs_manual_trace: 8,
  low_confidence_fallback: 8,
  wrong_room_boundary: 8,
  missing_room: 6,
  extra_false_positive: 3,
  scale_or_page_issue: 7
};

function roundTo(value, places) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const factor = Math.pow(10, places || 2);
  return Math.round(number * factor) / factor;
}

function reviewedSectionCount(item) {
  return item && item.reviewed && Array.isArray(item.reviewed.sections)
    ? item.reviewed.sections.length
    : 0;
}

function complexityMinutes(item) {
  const quality = String(item && item.plan_quality || "");
  let extra = 0;
  if (quality === "mixed_boundary") extra += 2;
  if (quality === "low_contrast_scan") extra += 3;
  if (Number(item && item.page_count || 1) > 1) extra += 1.5;
  if (reviewedSectionCount(item) >= 3) extra += 1;
  return extra;
}

function baselineManualMinutes(item) {
  const sectionCount = Math.max(1, reviewedSectionCount(item));
  return roundTo(3 + sectionCount * 3 + complexityMinutes(item), 1);
}

function candidateReviewMinutes(fixtureRow, item) {
  const outcome = String(fixtureRow.taxonomy_key || "");
  const base = OUTCOME_MINUTES[outcome] || 6;
  const sectionAdjustment = Math.max(0, reviewedSectionCount(item) - 1) * 0.8;
  return roundTo(base + sectionAdjustment, 1);
}

function buildEstimateRows(items) {
  const source = Array.isArray(items) ? items : corpus;
  const taxonomy = Taxonomy.buildCandidateReviewTaxonomyReport(source);
  const fixtureById = source.reduce(function (map, item) {
    map[item.id] = item;
    return map;
  }, {});
  return taxonomy.fixture_review_rows.map(function (fixtureRow) {
    const item = fixtureById[fixtureRow.fixture_id] || {};
    const manual = baselineManualMinutes(item);
    const candidate = candidateReviewMinutes(fixtureRow, item);
    const saved = roundTo(Math.max(0, manual - candidate), 1);
    return {
      fixture_id: fixtureRow.fixture_id,
      fixture_title: fixtureRow.fixture_title,
      plan_quality: fixtureRow.plan_quality,
      selected_method_key: fixtureRow.selected_method_key,
      selected_method_label: fixtureRow.selected_method_label,
      taxonomy_key: fixtureRow.taxonomy_key,
      reviewed_section_count: reviewedSectionCount(item),
      baseline_manual_minutes: manual,
      candidate_review_minutes: candidate,
      estimated_minutes_saved: saved,
      reviewer_time_action: fixtureRow.next_action
    };
  });
}

function sum(rows, field) {
  return roundTo(rows.reduce(function (total, row) {
    return total + Number(row[field] || 0);
  }, 0), 1);
}

function average(rows, field) {
  if (!rows.length) return null;
  return roundTo(sum(rows, field) / rows.length, 1);
}

function countBy(rows, field) {
  return rows.reduce(function (counts, row) {
    const key = String(row[field] || "unknown");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function buildFloorplanOperatorTimeEstimateReport(items) {
  const rows = buildEstimateRows(items);
  return {
    report_type: "floorplan_operator_time_estimate_report",
    benchmark_version: "floorplan-phase-3-operator-time-v1",
    local_only: true,
    customer_visible: false,
    fixture_count: rows.length,
    total_baseline_manual_minutes: sum(rows, "baseline_manual_minutes"),
    total_candidate_review_minutes: sum(rows, "candidate_review_minutes"),
    total_estimated_minutes_saved: sum(rows, "estimated_minutes_saved"),
    average_estimated_minutes_saved: average(rows, "estimated_minutes_saved"),
    taxonomy_mix: countBy(rows, "taxonomy_key"),
    safe_for_internal_planning: rows.length > 0
      && rows.every(function (row) {
        return row.candidate_review_minutes > 0
          && row.baseline_manual_minutes >= row.candidate_review_minutes
          && row.estimated_minutes_saved >= 0;
      }),
    estimate_rows: rows
  };
}

function renderMix(counts) {
  return Object.keys(counts).sort().map(function (key) {
    return "| `" + key + "` | " + counts[key] + " |";
  });
}

function renderFloorplanOperatorTimeEstimateMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Operator Time Estimate Report");
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
  lines.push("| Manual baseline minutes | " + report.total_baseline_manual_minutes + " |");
  lines.push("| Candidate review minutes | " + report.total_candidate_review_minutes + " |");
  lines.push("| Estimated minutes saved | " + report.total_estimated_minutes_saved + " |");
  lines.push("| Avg minutes saved per fixture | " + report.average_estimated_minutes_saved + " |");
  lines.push("| Safe for internal planning | " + (report.safe_for_internal_planning ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Review Outcome Mix");
  lines.push("");
  lines.push("| Outcome | Fixtures |");
  lines.push("| --- | ---: |");
  lines.push.apply(lines, renderMix(report.taxonomy_mix));
  lines.push("");
  lines.push("## Fixture Estimates");
  lines.push("");
  lines.push("| Fixture | Outcome | Manual baseline | Candidate review | Saved |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  report.estimate_rows.forEach(function (row) {
    lines.push("| `" + row.fixture_id + "`"
      + " | `" + row.taxonomy_key + "`"
      + " | " + row.baseline_manual_minutes
      + " | " + row.candidate_review_minutes
      + " | " + row.estimated_minutes_saved
      + " |");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This report estimates internal reviewer effort only.");
  lines.push("- It does not approve measurements or publish detection.");
  lines.push("- It does not change public floorplan behaviour.");
  lines.push("- Use real reviewed examples only after privacy-safe intake approval.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanOperatorTimeEstimateArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-operator-time-estimates"),
    method: "operator-time-estimates",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-operator-time-estimates");
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
  fs.writeFileSync(markdownPath, renderFloorplanOperatorTimeEstimateMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  OUTCOME_MINUTES: OUTCOME_MINUTES,
  buildFloorplanOperatorTimeEstimateReport: buildFloorplanOperatorTimeEstimateReport,
  renderFloorplanOperatorTimeEstimateMarkdown: renderFloorplanOperatorTimeEstimateMarkdown,
  writeFloorplanOperatorTimeEstimateArtifacts: writeFloorplanOperatorTimeEstimateArtifacts
};
