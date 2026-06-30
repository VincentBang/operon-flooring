"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const ReportWriter = require("./floorplanBenchmarkReportWriter");

const TARGET_COVERAGE = [
  {
    key: "clean_vector",
    label: "Clean vector-style plans",
    matches: function (item) { return item.plan_quality === "clean_vector"; },
    minimum: 4
  },
  {
    key: "low_contrast_scan",
    label: "Low contrast scans",
    matches: function (item) { return item.plan_quality === "low_contrast_scan"; },
    minimum: 2
  },
  {
    key: "mixed_boundary",
    label: "Ambiguous or mixed boundaries",
    matches: function (item) { return item.plan_quality === "mixed_boundary"; },
    minimum: 2
  },
  {
    key: "multi_section",
    label: "Multiple included sections",
    matches: function (item) { return Number(item.expected_section_count) >= 2; },
    minimum: 4
  },
  {
    key: "excluded_sections",
    label: "Excluded sections",
    matches: function (item) {
      return item.reviewed.sections.some(function (section) {
        return section.selection_state === "exclude";
      });
    },
    minimum: 2
  },
  {
    key: "not_sure_sections",
    label: "Not-sure sections",
    matches: function (item) {
      return item.reviewed.sections.some(function (section) {
        return section.selection_state === "not_sure";
      });
    },
    minimum: 2
  },
  {
    key: "void_or_stairs",
    label: "Void or stair-adjacent plans",
    matches: function (item) {
      return item.reviewed.sections.some(function (section) {
        return ["void", "stairs"].includes(String(section.section_type || "").toLowerCase());
      });
    },
    minimum: 2
  },
  {
    key: "multipage_pdf",
    label: "Multipage PDF pages",
    matches: function (item) { return Number(item.page_count || 1) > 1 || item.file_type === "synthetic-pdf-page"; },
    minimum: 2
  },
  {
    key: "irregular_geometry",
    label: "Irregular non-rectangular geometry",
    matches: function (item) {
      return item.reviewed.sections.some(function (section) {
        return Array.isArray(section.points) && section.points.length > 4;
      });
    },
    minimum: 3
  },
  {
    key: "real_reviewed_samples",
    label: "Approved real reviewed samples",
    matches: function (item) {
      return String(item.file_type || "").indexOf("synthetic") !== 0;
    },
    minimum: 5
  }
];

function countSections(items) {
  return items.reduce(function (count, item) {
    return count + (item.reviewed && Array.isArray(item.reviewed.sections) ? item.reviewed.sections.length : 0);
  }, 0);
}

function buildCoverageRows(items) {
  return TARGET_COVERAGE.map(function (target) {
    const matched = items.filter(target.matches);
    return {
      key: target.key,
      label: target.label,
      minimum: target.minimum,
      count: matched.length,
      status: matched.length >= target.minimum ? "covered" : "gap",
      missing_count: Math.max(0, target.minimum - matched.length),
      fixture_ids: matched.map(function (item) { return item.id; })
    };
  });
}

function recommendedNextFixtures(rows) {
  return rows.filter(function (row) {
    return row.status === "gap";
  }).map(function (row) {
    return {
      coverage_key: row.key,
      label: row.label,
      needed_count: row.missing_count,
      recommendation: "Add approved, privacy-safe reviewer fixtures for " + row.label.toLowerCase() + "."
    };
  });
}

function buildFloorplanBenchmarkCoverageReport(items) {
  const source = Array.isArray(items) ? items : corpus;
  const rows = buildCoverageRows(source);
  const gapCount = rows.filter(function (row) { return row.status === "gap"; }).length;
  const coveredKeys = new Set(rows.filter(function (row) {
    return row.status === "covered";
  }).map(function (row) {
    return row.key;
  }));
  const coreSyntheticCoverageReady = source.length >= 10
    && coveredKeys.has("clean_vector")
    && coveredKeys.has("multi_section")
    && coveredKeys.has("excluded_sections");
  return {
    report_type: "floorplan_benchmark_coverage_report",
    benchmark_version: "floorplan-phase-3-coverage-v1",
    local_only: true,
    customer_visible: false,
    fixture_count: source.length,
    reviewed_section_count: countSections(source),
    covered_target_count: rows.length - gapCount,
    gap_target_count: gapCount,
    ready_for_real_detection_training: false,
    ready_for_local_detection_spike: coreSyntheticCoverageReady,
    coverage_rows: rows,
    recommended_next_fixtures: recommendedNextFixtures(rows)
  };
}

function renderFloorplanBenchmarkCoverageMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Benchmark Coverage Report");
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
  lines.push("| Reviewed sections | " + report.reviewed_section_count + " |");
  lines.push("| Covered targets | " + report.covered_target_count + " |");
  lines.push("| Gap targets | " + report.gap_target_count + " |");
  lines.push("| Ready for local detection spike | " + (report.ready_for_local_detection_spike ? "yes" : "no") + " |");
  lines.push("| Ready for real detection training | " + (report.ready_for_real_detection_training ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Coverage Targets");
  lines.push("");
  lines.push("| Status | Coverage target | Count | Minimum | Missing | Fixtures |");
  lines.push("| --- | --- | ---: | ---: | ---: | --- |");
  report.coverage_rows.forEach(function (row) {
    lines.push("| " + row.status
      + " | " + row.label
      + " | " + row.count
      + " | " + row.minimum
      + " | " + row.missing_count
      + " | " + (row.fixture_ids.length ? row.fixture_ids.map(function (id) { return "`" + id + "`"; }).join(", ") : "none")
      + " |");
  });
  lines.push("");
  lines.push("## Recommended Next Fixtures");
  lines.push("");
  if (!report.recommended_next_fixtures.length) {
    lines.push("- No fixture gaps found for the current target list.");
  } else {
    report.recommended_next_fixtures.forEach(function (item) {
      lines.push("- " + item.label + ": add " + item.needed_count + " fixture(s). " + item.recommendation);
    });
  }
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- Use only synthetic fixtures or real plans with explicit internal approval.");
  lines.push("- Do not include personal details, upload paths, extracted text, or private commercial inputs in fixture labels.");
  lines.push("- Coverage readiness does not approve customer-facing detection.");
  lines.push("");
  return lines.join("\n");
}

function writeFloorplanBenchmarkCoverageArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-benchmark-coverage"),
    method: "floorplan-benchmark-coverage",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-benchmark-coverage");
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
  fs.writeFileSync(markdownPath, renderFloorplanBenchmarkCoverageMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildFloorplanBenchmarkCoverageReport: buildFloorplanBenchmarkCoverageReport,
  renderFloorplanBenchmarkCoverageMarkdown: renderFloorplanBenchmarkCoverageMarkdown,
  writeFloorplanBenchmarkCoverageArtifacts: writeFloorplanBenchmarkCoverageArtifacts
};
