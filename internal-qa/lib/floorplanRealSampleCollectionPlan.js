"use strict";

const IntakeGate = require("./floorplanRealSampleIntakeGateReport");

const COLLECTION_NOTES = {
  low_contrast_scan: {
    sample_goal: "One redacted reviewed image or PDF page where thin lines, scan quality or low contrast make automatic boundaries difficult.",
    fixture_hint: "Use plan_quality low_contrast_scan and expected_confidence low.",
    reviewer_evidence: "Reviewed included area, excluded areas, scale basis and reason the plan is low confidence."
  },
  mixed_boundary: {
    sample_goal: "One redacted reviewed plan with partly open or ambiguous room boundaries.",
    fixture_hint: "Use plan_quality mixed_boundary and at least two reviewed sections if available.",
    reviewer_evidence: "Reviewed room split, boundary assumptions and any manual correction notes."
  },
  void_or_stairs: {
    sample_goal: "One redacted reviewed plan where a void, stair area or stair-adjacent section must be excluded or separately reviewed.",
    fixture_hint: "Include a reviewed section_type of void or stairs with selection_state exclude when appropriate.",
    reviewer_evidence: "Why the area is excluded or separated, and how quote area should stay reviewer-approved."
  },
  multipage_pdf: {
    sample_goal: "One redacted reviewed multipage PDF example or representative reviewed page from a multipage PDF.",
    fixture_hint: "Set page_count above 1 or file_type reviewed-pdf-page.",
    reviewer_evidence: "Selected page, page role, reviewed area and any page-selection notes."
  },
  irregular_geometry: {
    sample_goal: "One redacted reviewed non-rectangular layout with more than four points in at least one reviewed section.",
    fixture_hint: "Use a reviewed section polygon with five or more points.",
    reviewer_evidence: "Reviewed polygon rationale and where rectangle approximations would be misleading."
  }
};

function buildFloorplanRealSampleCollectionPlan(items) {
  const gate = IntakeGate.buildFloorplanRealSampleIntakeGateReport(items);
  const required_rows = gate.required_coverage_rows.map(function (row) {
    const notes = COLLECTION_NOTES[row.key] || {};
    return {
      key: row.key,
      label: row.label,
      current_status: row.status,
      current_fixture_ids: row.fixture_ids,
      minimum_needed: row.status === "covered" ? 0 : 1,
      sample_goal: notes.sample_goal,
      fixture_hint: notes.fixture_hint,
      reviewer_evidence: notes.reviewer_evidence
    };
  });
  const missing = required_rows.filter(function (row) {
    return row.current_status !== "covered";
  });
  return {
    report_type: "floorplan_real_sample_collection_plan",
    benchmark_version: "floorplan-phase-3-real-sample-collection-v1",
    local_only: true,
    customer_visible: false,
    approved_real_sample_count: gate.approved_real_sample_count,
    missing_sample_slot_count: missing.length,
    ready_for_real_sample_benchmark_batch: gate.ready_for_real_sample_benchmark_batch,
    required_rows: required_rows,
    next_step: missing.length
      ? "Collect and validate the missing approved redacted reviewed sample slots before adding real samples to the benchmark corpus."
      : "Run the real-sample intake gate and full benchmark QA before any detection experiment uses real samples.",
    guardrails: [
      "Do not include customer identifiers.",
      "Do not include original upload references.",
      "Do not include raw plan or quote text.",
      "Do not include private commercial logic.",
      "Do not use real samples for model training or customer-visible detection without separate approval."
    ]
  };
}

function renderFloorplanRealSampleCollectionPlanMarkdown(report) {
  const lines = [];
  lines.push("# Floorplan Real Sample Collection Plan");
  lines.push("");
  lines.push("- Local only: yes");
  lines.push("- Customer visible: no");
  lines.push("- Approved real samples: " + report.approved_real_sample_count);
  lines.push("- Missing sample slots: " + report.missing_sample_slot_count);
  lines.push("- Ready for real sample benchmark batch: " + (report.ready_for_real_sample_benchmark_batch ? "yes" : "no"));
  lines.push("");
  lines.push("## Required Sample Slots");
  lines.push("");
  lines.push("| Status | Key | Target | Minimum needed | Fixture hint |");
  lines.push("| --- | --- | --- | ---: | --- |");
  report.required_rows.forEach(function (row) {
    lines.push("| `" + row.current_status + "` | `" + row.key + "` | " + row.sample_goal + " | " + row.minimum_needed + " | " + row.fixture_hint + " |");
  });
  lines.push("");
  lines.push("## Reviewer Evidence Needed");
  lines.push("");
  report.required_rows.forEach(function (row) {
    lines.push("- `" + row.key + "`: " + row.reviewer_evidence);
  });
  lines.push("");
  lines.push("## Guardrails");
  lines.push("");
  report.guardrails.forEach(function (item) {
    lines.push("- " + item);
  });
  lines.push("");
  lines.push("## Next Step");
  lines.push("");
  lines.push(report.next_step);
  lines.push("");
  return lines.join("\n");
}

module.exports = {
  buildFloorplanRealSampleCollectionPlan: buildFloorplanRealSampleCollectionPlan,
  renderFloorplanRealSampleCollectionPlanMarkdown: renderFloorplanRealSampleCollectionPlanMarkdown
};
