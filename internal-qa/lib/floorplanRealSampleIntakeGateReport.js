"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const ReportWriter = require("./floorplanBenchmarkReportWriter");

const REQUIRED_REAL_SAMPLE_COVERAGE = [
  {
    key: "low_contrast_scan",
    label: "Low contrast scan",
    matches: function (item) { return item.plan_quality === "low_contrast_scan"; }
  },
  {
    key: "mixed_boundary",
    label: "Mixed or ambiguous boundary",
    matches: function (item) { return item.plan_quality === "mixed_boundary"; }
  },
  {
    key: "void_or_stairs",
    label: "Void or stair-adjacent plan",
    matches: function (item) {
      return (item.reviewed.sections || []).some(function (section) {
        return ["void", "stairs"].includes(String(section.section_type || "").toLowerCase());
      });
    }
  },
  {
    key: "multipage_pdf",
    label: "Multipage PDF page",
    matches: function (item) {
      return Number(item.page_count || 1) > 1 || item.file_type === "reviewed-pdf-page";
    }
  },
  {
    key: "irregular_geometry",
    label: "Irregular non-rectangular layout",
    matches: function (item) {
      return (item.reviewed.sections || []).some(function (section) {
        return Array.isArray(section.points) && section.points.length > 4;
      });
    }
  }
];

function isApprovedRealSample(item) {
  return item
    && item.fixture_origin === "approved_real_reviewed_sample"
    && item.usage_status === "approved_for_internal_benchmark"
    && item.privacy_status === "customer_identifiers_removed"
    && item.customer_identifiers_removed === true;
}

function realSampleRows(items) {
  return items.filter(function (item) {
    return item.fixture_origin === "approved_real_reviewed_sample";
  }).map(function (item) {
    const manifestPass = isApprovedRealSample(item);
    return {
      fixture_id: item.id,
      fixture_title: item.title,
      manifest_status: manifestPass ? "pass" : "block",
      plan_quality: item.plan_quality,
      file_type: item.file_type,
      expected_confidence: item.expected_confidence,
      reviewed_section_count: item.reviewed && Array.isArray(item.reviewed.sections) ? item.reviewed.sections.length : 0
    };
  });
}

function coverageRows(realSamples) {
  return REQUIRED_REAL_SAMPLE_COVERAGE.map(function (target) {
    const matches = realSamples.filter(target.matches);
    return {
      key: target.key,
      label: target.label,
      status: matches.length > 0 ? "covered" : "gap",
      fixture_ids: matches.map(function (item) { return item.id; })
    };
  });
}

function buildFloorplanRealSampleIntakeGateReport(items) {
  const source = Array.isArray(items) ? items : corpus;
  const approvedRealSamples = source.filter(isApprovedRealSample);
  const rows = realSampleRows(source);
  const coverage = coverageRows(approvedRealSamples);
  const gapRows = coverage.filter(function (row) { return row.status === "gap"; });
  const manifestBlocks = rows.filter(function (row) { return row.manifest_status === "block"; });
  return {
    report_type: "floorplan_real_sample_intake_gate",
    benchmark_version: "floorplan-phase-3-real-sample-intake-v1",
    local_only: true,
    customer_visible: false,
    real_sample_count: rows.length,
    approved_real_sample_count: approvedRealSamples.length,
    manifest_block_count: manifestBlocks.length,
    coverage_gap_count: gapRows.length,
    ready_to_add_real_samples_to_training: false,
    ready_for_real_sample_benchmark_batch: rows.length >= 5
      && manifestBlocks.length === 0
      && gapRows.length === 0,
    next_required_action: gapRows.length
      ? "Add approved real reviewed samples for the missing coverage categories before training or customer-visible detection."
      : "Run full benchmark QA before any real-sample detection work.",
    real_sample_rows: rows,
    required_coverage_rows: coverage
  };
}

function renderCoverageRows(rows) {
  return rows.map(function (row) {
    return "| `" + row.status + "` | `" + row.key + "` | " + row.label + " | "
      + (row.fixture_ids.length ? row.fixture_ids.map(function (id) { return "`" + id + "`"; }).join(", ") : "none")
      + " |";
  });
}

function renderFloorplanRealSampleIntakeGateMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Real Sample Intake Gate");
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
  lines.push("| Real samples declared | " + report.real_sample_count + " |");
  lines.push("| Approved real samples | " + report.approved_real_sample_count + " |");
  lines.push("| Manifest blocks | " + report.manifest_block_count + " |");
  lines.push("| Coverage gaps | " + report.coverage_gap_count + " |");
  lines.push("| Ready for real sample benchmark batch | " + (report.ready_for_real_sample_benchmark_batch ? "yes" : "no") + " |");
  lines.push("| Ready for real sample training | " + (report.ready_to_add_real_samples_to_training ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Required Coverage");
  lines.push("");
  lines.push("| Status | Key | Coverage target | Fixtures |");
  lines.push("| --- | --- | --- | --- |");
  lines.push.apply(lines, renderCoverageRows(report.required_coverage_rows));
  lines.push("");
  lines.push("## Next Required Action");
  lines.push("");
  lines.push(report.next_required_action);
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This report does not approve training, deployment, or customer-visible detection.");
  lines.push("- Real samples must pass the intake checklist before entering benchmark work.");
  lines.push("- Synthetic fixtures remain valid for local QA but do not close the real-sample gate.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanRealSampleIntakeGateArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-real-sample-intake-gate"),
    method: "real-sample-intake-gate",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-real-sample-intake-gate");
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
  fs.writeFileSync(markdownPath, renderFloorplanRealSampleIntakeGateMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  REQUIRED_REAL_SAMPLE_COVERAGE: REQUIRED_REAL_SAMPLE_COVERAGE,
  buildFloorplanRealSampleIntakeGateReport: buildFloorplanRealSampleIntakeGateReport,
  renderFloorplanRealSampleIntakeGateMarkdown: renderFloorplanRealSampleIntakeGateMarkdown,
  writeFloorplanRealSampleIntakeGateArtifacts: writeFloorplanRealSampleIntakeGateArtifacts
};
