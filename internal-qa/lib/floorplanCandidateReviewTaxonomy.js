"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Calibration = require("./floorplanHybridSelectorCalibrationReport");
const ReportWriter = require("./floorplanBenchmarkReportWriter");

const TAXONOMY_ROWS = [
  {
    key: "accept_after_review",
    label: "Accept after review",
    reviewer_prompt: "Candidate shape matches the reviewed room closely enough for an internal reviewer to accept it.",
    allowed_next_actions: ["approve_reviewed_version", "add_reviewer_note"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "adjust_boundary",
    label: "Adjust boundary",
    reviewer_prompt: "Candidate is useful, but one or more edges should be corrected before approval.",
    allowed_next_actions: ["edit_polygon", "add_reviewer_note", "rerun_candidate_method"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "split_or_merge_sections",
    label: "Split or merge sections",
    reviewer_prompt: "Candidate joins separate rooms or splits one room in a way that needs reviewer correction.",
    allowed_next_actions: ["split_section", "merge_sections", "edit_polygon", "add_reviewer_note"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "exclude_section",
    label: "Exclude section",
    reviewer_prompt: "Candidate includes a section that should not be counted until a reviewer confirms the scope.",
    allowed_next_actions: ["mark_excluded", "mark_not_sure", "add_reviewer_note"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "needs_manual_trace",
    label: "Needs manual trace",
    reviewer_prompt: "Candidate is not reliable enough; reviewer should trace the room manually.",
    allowed_next_actions: ["start_manual_trace", "add_reviewer_note"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "low_confidence_fallback",
    label: "Low-confidence fallback",
    reviewer_prompt: "Plan quality or candidate confidence is too low; use the safest manual review path.",
    allowed_next_actions: ["start_manual_trace", "request_clearer_plan", "add_reviewer_note"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "wrong_room_boundary",
    label: "Wrong room boundary",
    reviewer_prompt: "Candidate follows the wrong enclosed area or crosses a boundary that should be preserved.",
    allowed_next_actions: ["reject_candidate", "rerun_candidate_method", "start_manual_trace"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "missing_room",
    label: "Missing room",
    reviewer_prompt: "Candidate result misses an included room or zone that should be added before approval.",
    allowed_next_actions: ["add_section", "rerun_candidate_method", "add_reviewer_note"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "extra_false_positive",
    label: "Extra false positive",
    reviewer_prompt: "Candidate result includes a furniture, text, void, outdoor, or wet-area shape as if it were flooring scope.",
    allowed_next_actions: ["delete_section", "mark_excluded", "rerun_candidate_method"],
    blocks_auto_approval: true,
    customer_visible: false
  },
  {
    key: "scale_or_page_issue",
    label: "Scale or page issue",
    reviewer_prompt: "Candidate cannot be assessed until page selection or scale information is checked.",
    allowed_next_actions: ["check_scale", "choose_page", "start_manual_trace", "add_reviewer_note"],
    blocks_auto_approval: true,
    customer_visible: false
  }
];

function taxonomyKeys() {
  return TAXONOMY_ROWS.map(function (row) {
    return row.key;
  });
}

function hasFailure(row, token) {
  const failures = Array.isArray(row.failures) ? row.failures : [];
  return failures.some(function (failure) {
    return String(failure).indexOf(token) >= 0;
  });
}

function classifyCandidateReviewOutcome(row) {
  const candidate = row || {};
  if (hasFailure(candidate, "scale") || hasFailure(candidate, "page")) {
    return "scale_or_page_issue";
  }
  if (candidate.selected_area_safe === false || candidate.passed_contract === false) {
    return "needs_manual_trace";
  }
  if (candidate.section_count_delta && candidate.section_count_delta > 0) {
    return "extra_false_positive";
  }
  if (candidate.section_count_delta && candidate.section_count_delta < 0) {
    return "missing_room";
  }
  if (candidate.plan_quality === "low_contrast_scan" || candidate.expected_confidence === "low") {
    return "low_confidence_fallback";
  }
  if (candidate.plan_quality === "mixed_boundary") {
    return "split_or_merge_sections";
  }
  if (candidate.area_warning) {
    return "exclude_section";
  }
  if (candidate.measured_area_warning || candidate.error_delta_from_best_percent > 1.5) {
    return "adjust_boundary";
  }
  if (candidate.review_required === false) {
    return "needs_manual_trace";
  }
  return "accept_after_review";
}

function countBy(rows, field) {
  return rows.reduce(function (counts, row) {
    const key = String(row[field] || "unknown");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function buildFixtureRows(items) {
  const calibration = Calibration.buildHybridSelectorCalibrationReport(items);
  return calibration.calibration_rows.map(function (row) {
    const selectedMethodEntry = row.ranked_method_order.find(function (entry) {
      return entry.method_key === "hybrid_selector_spike";
    }) || null;
    const areaWarning = Boolean(selectedMethodEntry && selectedMethodEntry.area_warning);
    const taxonomyKey = classifyCandidateReviewOutcome(Object.assign({}, row, {
      area_warning: areaWarning
    }));
    return {
      fixture_id: row.fixture_id,
      fixture_title: row.fixture_title,
      plan_quality: row.plan_quality,
      expected_confidence: row.expected_confidence,
      selected_method_key: row.selected_method_key,
      selected_method_label: row.selected_method_label,
      measured_area_warning: row.measured_area_warning,
      area_warning: areaWarning,
      selected_area_safe: row.selected_area_safe,
      review_required: row.review_required,
      taxonomy_key: taxonomyKey,
      taxonomy_label: TAXONOMY_ROWS.find(function (entry) { return entry.key === taxonomyKey; }).label,
      next_action: TAXONOMY_ROWS.find(function (entry) { return entry.key === taxonomyKey; }).allowed_next_actions[0]
    };
  });
}

function buildCandidateReviewTaxonomyReport(items) {
  const source = Array.isArray(items) ? items : corpus;
  const fixtureRows = buildFixtureRows(source);
  return {
    report_type: "floorplan_candidate_review_taxonomy",
    benchmark_version: "floorplan-phase-3-candidate-review-taxonomy-v1",
    local_only: true,
    customer_visible: false,
    taxonomy_count: TAXONOMY_ROWS.length,
    fixture_count: fixtureRows.length,
    outcome_counts: countBy(fixtureRows, "taxonomy_key"),
    safe_for_reviewer_qa: TAXONOMY_ROWS.length >= 8
      && fixtureRows.length > 0
      && TAXONOMY_ROWS.every(function (row) {
        return row.blocks_auto_approval
          && row.customer_visible === false
          && row.allowed_next_actions.length > 0;
      }),
    taxonomy_rows: TAXONOMY_ROWS.slice(),
    fixture_review_rows: fixtureRows
  };
}

function renderOutcomeCounts(counts) {
  return Object.keys(counts).sort().map(function (key) {
    return "| `" + key + "` | " + counts[key] + " |";
  });
}

function renderCandidateReviewTaxonomyMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Candidate Review Taxonomy");
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
  lines.push("| Taxonomy outcomes | " + report.taxonomy_count + " |");
  lines.push("| Fixtures classified | " + report.fixture_count + " |");
  lines.push("| Safe for reviewer QA | " + (report.safe_for_reviewer_qa ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Outcome Counts");
  lines.push("");
  lines.push("| Outcome | Fixtures |");
  lines.push("| --- | ---: |");
  lines.push.apply(lines, renderOutcomeCounts(report.outcome_counts));
  lines.push("");
  lines.push("## Taxonomy");
  lines.push("");
  lines.push("| Outcome | Reviewer prompt | First action | Auto approval blocked |");
  lines.push("| --- | --- | --- | --- |");
  report.taxonomy_rows.forEach(function (row) {
    lines.push("| `" + row.key + "`"
      + " | " + row.reviewer_prompt
      + " | `" + row.allowed_next_actions[0] + "`"
      + " | " + (row.blocks_auto_approval ? "yes" : "no")
      + " |");
  });
  lines.push("");
  lines.push("## Fixture Classifications");
  lines.push("");
  lines.push("| Fixture | Plan quality | Method | Outcome | Next action |");
  lines.push("| --- | --- | --- | --- | --- |");
  report.fixture_review_rows.forEach(function (row) {
    lines.push("| `" + row.fixture_id + "`"
      + " | `" + row.plan_quality + "`"
      + " | " + row.selected_method_label
      + " | `" + row.taxonomy_key + "`"
      + " | `" + row.next_action + "`"
      + " |");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This taxonomy is for local reviewer QA and benchmark analysis only.");
  lines.push("- Every outcome blocks automated approval.");
  lines.push("- Candidate output remains unapproved until an internal reviewer creates a reviewed measurement version.");
  lines.push("- This report does not enable customer-facing detection.");
  lines.push("");
  return lines.join("\n");
}

function writeCandidateReviewTaxonomyArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-candidate-review-taxonomy"),
    method: "candidate-review-taxonomy",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-candidate-review-taxonomy");
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
  fs.writeFileSync(markdownPath, renderCandidateReviewTaxonomyMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  TAXONOMY_ROWS: TAXONOMY_ROWS,
  taxonomyKeys: taxonomyKeys,
  classifyCandidateReviewOutcome: classifyCandidateReviewOutcome,
  buildCandidateReviewTaxonomyReport: buildCandidateReviewTaxonomyReport,
  renderCandidateReviewTaxonomyMarkdown: renderCandidateReviewTaxonomyMarkdown,
  writeCandidateReviewTaxonomyArtifacts: writeCandidateReviewTaxonomyArtifacts
};
