"use strict";

const Validator = require("../scripts/validateFloorplanRealSampleFixture");

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function sectionFromWorksheet(section, fallbackIndex) {
  const id = normalizeSlug(section.client_section_id || section.id || ("section-" + fallbackIndex));
  return {
    client_section_id: id,
    label: section.label || ("Section " + fallbackIndex),
    section_type: section.section_type || "room",
    selection_state: section.selection_state || "include",
    confidence: section.confidence || "medium",
    points: asArray(section.points),
    coordinate_space: "normalized_page"
  };
}

function fixtureFromWorksheetRow(row) {
  const fields = row.fill_in_fields || {};
  const fixtureId = normalizeSlug(fields.fixture_id || ("reviewed-sample-" + row.slot_key));
  const reviewedSections = asArray(fields.reviewed_sections_redacted).map(sectionFromWorksheet);
  return {
    id: fixtureId.indexOf("reviewed-sample-") === 0 ? fixtureId : "reviewed-sample-" + fixtureId,
    title: row.slot_label || row.slot_key,
    file_type: fields.file_type || "reviewed-json",
    fixture_origin: "approved_real_reviewed_sample",
    usage_status: "approved_for_internal_benchmark",
    privacy_status: "customer_identifiers_removed",
    customer_identifiers_removed: true,
    plan_quality: fields.plan_quality || row.slot_key,
    scale_availability: fields.scale_basis || "reviewed_scale",
    expected_confidence: fields.expected_confidence || "medium",
    reviewer_notes: fields.reviewer_notes || "Approved redacted reviewed sample.",
    page_count: fields.page_count || 1,
    expected_reviewed_area_m2: fields.reviewed_total_area_m2,
    expected_section_count: fields.reviewed_section_count || reviewedSections.length,
    redaction_checked_by: fields.redaction_checked_by || undefined,
    approval_checked_by: fields.approval_checked_by || undefined,
    reviewed: {
      source: "floorplan_real_sample_worksheet",
      measurement_mode: "reviewed_trace",
      confidence_level: fields.expected_confidence || "medium",
      page_key: fixtureId,
      page_width: fields.page_width || 1000,
      page_height: fields.page_height || 1000,
      pixels_per_metre: fields.pixels_per_metre || 100,
      coordinate_space: "normalized_page",
      sections: reviewedSections
    }
  };
}

function convertWorksheetToFixtures(worksheet) {
  const rows = asArray(worksheet && worksheet.worksheet_rows).filter(function (row) {
    return row && row.required !== false;
  });
  return rows.map(fixtureFromWorksheetRow);
}

function convertAndValidateWorksheet(worksheet) {
  const fixtures = convertWorksheetToFixtures(worksheet);
  const validation = Validator.validateFixtures(fixtures);
  return {
    ok: validation.ok && validation.ready_for_real_sample_benchmark_batch === true,
    fixture_count: fixtures.length,
    fixtures: fixtures,
    validation: validation,
    ready_for_real_sample_benchmark_batch: validation.ready_for_real_sample_benchmark_batch === true
  };
}

module.exports = {
  convertWorksheetToFixtures: convertWorksheetToFixtures,
  convertAndValidateWorksheet: convertAndValidateWorksheet
};
