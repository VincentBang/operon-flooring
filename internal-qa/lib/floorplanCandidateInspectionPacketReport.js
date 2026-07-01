"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Hybrid = require("../fixtures/floorplanHybridSelectorCandidates");
const ReportWriter = require("./floorplanBenchmarkReportWriter");
const Taxonomy = require("./floorplanCandidateReviewTaxonomy");
const Draft = require("../../netlify/functions/shared/floorplanCandidateVersionDraft");

const SESSION_ID = "11111111-1111-4111-8111-111111111111";
const UPLOAD_ID = "22222222-2222-4222-8222-222222222222";

function requestFor(item) {
  return {
    measurement_session_id: SESSION_ID,
    uploaded_file_id: UPLOAD_ID,
    page_key: item.id + "-candidate",
    candidate_method: "hybrid_selector_spike",
    plan_quality: item.plan_quality,
    page_number: Number(item.page_number || 1),
    max_candidates: 40
  };
}

function contextFor(item) {
  return {
    page_width: item.reviewed.page_width,
    page_height: item.reviewed.page_height,
    pixels_per_metre: item.reviewed.pixels_per_metre,
    coordinate_space: item.reviewed.coordinate_space
  };
}

function byFixtureId(rows) {
  return rows.reduce(function (map, row) {
    map[row.fixture_id] = row;
    return map;
  }, {});
}

function buildInspectionRows(items) {
  const source = Array.isArray(items) ? items : corpus;
  const taxonomy = Taxonomy.buildCandidateReviewTaxonomyReport(source);
  const taxonomyRows = byFixtureId(taxonomy.fixture_review_rows);
  return source.map(function (item) {
    const candidatePayload = Hybrid.hybridSelectorCandidatePayloadForItem(item);
    const draft = Draft.buildCandidateVersionDraftPayload(requestFor(item), candidatePayload, contextFor(item));
    const taxonomyRow = taxonomyRows[item.id] || {};
    return {
      fixture_id: item.id,
      fixture_title: item.title,
      plan_quality: item.plan_quality,
      expected_confidence: item.expected_confidence,
      selected_method_key: candidatePayload.selected_method_key,
      selected_method_label: taxonomyRow.selected_method_label || candidatePayload.selected_method_key,
      candidate_count: draft.safe_summary.candidate_count,
      selected_area_m2: draft.safe_summary.selected_area_m2,
      measured_area_m2: draft.safe_summary.measured_area_m2,
      review_required: draft.safe_summary.review_required,
      taxonomy_key: taxonomyRow.taxonomy_key,
      taxonomy_label: taxonomyRow.taxonomy_label,
      next_action: taxonomyRow.next_action,
      geometry_redacted: true,
      save_performed: false
    };
  });
}

function countBy(rows, field) {
  return rows.reduce(function (counts, row) {
    const key = String(row[field] || "unknown");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function buildFloorplanCandidateInspectionPacketReport(items) {
  const rows = buildInspectionRows(items);
  return {
    report_type: "floorplan_candidate_inspection_packet",
    benchmark_version: "floorplan-phase-3-candidate-inspection-v1",
    local_only: true,
    customer_visible: false,
    fixture_count: rows.length,
    total_candidate_count: rows.reduce(function (sum, row) {
      return sum + row.candidate_count;
    }, 0),
    taxonomy_mix: countBy(rows, "taxonomy_key"),
    method_mix: countBy(rows, "selected_method_key"),
    ready_for_reviewer_packet: rows.length > 0
      && rows.every(function (row) {
        return row.review_required
          && row.selected_area_m2 === 0
          && row.geometry_redacted
          && row.save_performed === false;
      }),
    inspection_rows: rows
  };
}

function renderMix(counts) {
  return Object.keys(counts).sort().map(function (key) {
    return "| `" + key + "` | " + counts[key] + " |";
  });
}

function renderFloorplanCandidateInspectionPacketMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Candidate Inspection Packet");
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
  lines.push("| Ready for reviewer packet | " + (report.ready_for_reviewer_packet ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Method Mix");
  lines.push("");
  lines.push("| Method | Fixtures |");
  lines.push("| --- | ---: |");
  lines.push.apply(lines, renderMix(report.method_mix));
  lines.push("");
  lines.push("## Review Outcome Mix");
  lines.push("");
  lines.push("| Outcome | Fixtures |");
  lines.push("| --- | ---: |");
  lines.push.apply(lines, renderMix(report.taxonomy_mix));
  lines.push("");
  lines.push("## Fixture Packet");
  lines.push("");
  lines.push("| Fixture | Method | Candidates | Measured area | Outcome | Next action |");
  lines.push("| --- | --- | ---: | ---: | --- | --- |");
  report.inspection_rows.forEach(function (row) {
    lines.push("| `" + row.fixture_id + "`"
      + " | " + row.selected_method_label
      + " | " + row.candidate_count
      + " | " + row.measured_area_m2
      + " | `" + row.taxonomy_key + "`"
      + " | `" + row.next_action + "`"
      + " |");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- Geometry is redacted from this packet.");
  lines.push("- No save is performed by this report.");
  lines.push("- Selected quote area remains `0` until internal reviewer approval.");
  lines.push("- This packet is local QA only and does not enable customer-facing detection.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanCandidateInspectionPacketArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-candidate-inspection-packet"),
    method: "candidate-inspection-packet",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-candidate-inspection-packet");
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
  fs.writeFileSync(markdownPath, renderFloorplanCandidateInspectionPacketMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildFloorplanCandidateInspectionPacketReport: buildFloorplanCandidateInspectionPacketReport,
  renderFloorplanCandidateInspectionPacketMarkdown: renderFloorplanCandidateInspectionPacketMarkdown,
  writeFloorplanCandidateInspectionPacketArtifacts: writeFloorplanCandidateInspectionPacketArtifacts
};
