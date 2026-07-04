"use strict";

const Collection = require("./floorplanRealSampleCollectionPlan");

function buildFloorplanRealSampleWorksheet(items) {
  const collection = Collection.buildFloorplanRealSampleCollectionPlan(items);
  const worksheet_rows = collection.required_rows.map(function (row) {
    return {
      slot_key: row.key,
      slot_label: row.label,
      status: row.current_status,
      required: row.minimum_needed > 0,
      sample_goal: row.sample_goal,
      fixture_hint: row.fixture_hint,
      reviewer_evidence_needed: row.reviewer_evidence,
      fill_in_fields: {
        fixture_id: "",
        plan_quality: "",
        file_type: "",
        page_count: null,
        scale_basis: "",
        reviewed_total_area_m2: null,
        reviewed_section_count: null,
        reviewed_sections_redacted: [],
        reviewer_notes: "",
        redaction_checked_by: "",
        approval_checked_by: ""
      },
      preflight_checklist: [
        "Customer identifiers removed",
        "Original upload references removed",
        "Temporary access links removed",
        "Raw plan contents not included",
        "Raw quote contents not included",
        "Private commercial logic removed",
        "Reviewed geometry supplied",
        "Reviewed total area supplied",
        "Scale basis supplied"
      ]
    };
  });
  return {
    worksheet_type: "floorplan_real_sample_intake_worksheet",
    local_only: true,
    customer_visible: false,
    requested_slot_count: worksheet_rows.filter(function (row) { return row.required; }).length,
    worksheet_rows: worksheet_rows,
    validation_note: "This worksheet is not a benchmark fixture. Convert completed rows into the approved fixture template, then run the real-sample validator.",
    validator_command: "npm run benchmark:floorplan:validate-real-sample -- --fixture-file=<redacted-fixture-batch>"
  };
}

function renderFloorplanRealSampleWorksheetMarkdown(worksheet) {
  const lines = [];
  lines.push("# Floorplan Real Sample Intake Worksheet");
  lines.push("");
  lines.push("- Local only: yes");
  lines.push("- Customer visible: no");
  lines.push("- Requested sample slots: " + worksheet.requested_slot_count);
  lines.push("");
  lines.push("This worksheet is not a benchmark fixture. It is a safe checklist for preparing reviewed, redacted fixture data.");
  lines.push("");
  worksheet.worksheet_rows.forEach(function (row) {
    lines.push("## `" + row.slot_key + "` - " + row.slot_label);
    lines.push("");
    lines.push("- Required: " + (row.required ? "yes" : "no"));
    lines.push("- Goal: " + row.sample_goal);
    lines.push("- Fixture hint: " + row.fixture_hint);
    lines.push("- Reviewer evidence: " + row.reviewer_evidence_needed);
    lines.push("");
    lines.push("Fill in:");
    lines.push("");
    Object.keys(row.fill_in_fields).forEach(function (key) {
      lines.push("- `" + key + "`: ");
    });
    lines.push("");
    lines.push("Preflight:");
    lines.push("");
    row.preflight_checklist.forEach(function (item) {
      lines.push("- [ ] " + item);
    });
    lines.push("");
  });
  lines.push("## Validation");
  lines.push("");
  lines.push("```bash");
  lines.push(worksheet.validator_command);
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

module.exports = {
  buildFloorplanRealSampleWorksheet: buildFloorplanRealSampleWorksheet,
  renderFloorplanRealSampleWorksheetMarkdown: renderFloorplanRealSampleWorksheetMarkdown
};
