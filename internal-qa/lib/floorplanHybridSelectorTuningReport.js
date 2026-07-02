"use strict";

const fs = require("fs");
const path = require("path");

const Calibration = require("./floorplanHybridSelectorCalibrationReport");
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
    hybrid_selector_spike: "Hybrid selector spike",
    manual_seed_baseline: "Manual-seed baseline",
    quick_room_baseline: "Quick-room baseline",
    seed_box_spike: "Seed-box spike"
  };
  return labels[methodKey] || methodKey;
}

function improvementPriority(row) {
  if (!row.within_tolerance) return "review_selector_rule";
  if (row.best_underlying_method_match || row.exact_selector_match) return "keep_rule";
  if (row.error_delta_from_best_percent === 0) return "tie_break_only";
  if (row.error_delta_from_best_percent <= 1) return "minor_tuning";
  return "watch_near_best_tradeoff";
}

function suggestedAction(row) {
  if (!row.within_tolerance) {
    return "Review this fixture before using the selector in later detection experiments.";
  }
  if (row.best_underlying_method_match || row.exact_selector_match) {
    return "Keep the current selector rule for this fixture type.";
  }
  if (row.error_delta_from_best_percent === 0) {
    return "No geometry change needed; only tie ordering differs.";
  }
  if (row.selected_method_key === "manual_seed_baseline") {
    return "Keep manual seed as the safer operator path, then test whether classical contours can assist without replacing review.";
  }
  if (row.selected_method_key === "quick_room_baseline") {
    return "Keep quick-room for void or excluded-section handling while checking section labels in review.";
  }
  return "Keep selector output review-only and compare against more real fixtures before tuning.";
}

function buildTuningRows(calibrationRows) {
  return calibrationRows.map(function (row) {
    return {
      fixture_id: row.fixture_id,
      fixture_title: row.fixture_title,
      plan_quality: row.plan_quality,
      expected_confidence: row.expected_confidence,
      selector_choice_key: row.selected_method_key,
      selector_choice_label: row.selected_method_label,
      best_method_key: row.best_method_key,
      best_method_label: row.best_method_label,
      selected_measured_error_percent: row.selected_measured_error_percent,
      best_measured_error_percent: row.best_measured_error_percent,
      error_delta_from_best_percent: row.error_delta_from_best_percent,
      within_tolerance: row.within_tolerance,
      priority: improvementPriority(row),
      suggested_action: suggestedAction(row),
      selector_reason: row.selection_reason
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

function average(rows, field) {
  const values = rows.map(function (row) {
    return Number(row[field]);
  }).filter(Number.isFinite);
  if (!values.length) return null;
  return roundTo(values.reduce(function (sum, value) {
    return sum + value;
  }, 0) / values.length, 2);
}

function buildMethodTuningSummary(rows) {
  const methodKeys = Array.from(new Set(rows.map(function (row) {
    return row.selector_choice_key;
  }))).sort();
  return methodKeys.map(function (methodKey) {
    const methodRows = rows.filter(function (row) {
      return row.selector_choice_key === methodKey;
    });
    return {
      method_key: methodKey,
      method_label: methodLabel(methodKey),
      fixture_count: methodRows.length,
      within_tolerance_count: methodRows.filter(function (row) { return row.within_tolerance; }).length,
      average_delta_from_best_percent: average(methodRows, "error_delta_from_best_percent"),
      priority_counts: countBy(methodRows, "priority")
    };
  });
}

function buildHybridSelectorTuningReport(items, options) {
  const settings = Object.assign({ tolerancePercent: 2 }, options || {});
  const calibration = Calibration.buildHybridSelectorCalibrationReport(items, {
    tolerancePercent: settings.tolerancePercent
  });
  const rows = buildTuningRows(calibration.calibration_rows);
  const priorityCounts = countBy(rows, "priority");
  return {
    report_type: "floorplan_hybrid_selector_tuning_report",
    benchmark_version: "floorplan-phase-3-hybrid-selector-tuning-v1",
    local_only: true,
    customer_visible: false,
    item_count: rows.length,
    tolerance_percent: calibration.tolerance_percent,
    priority_counts: priorityCounts,
    method_tuning_summary: buildMethodTuningSummary(rows),
    ready_for_next_detection_spike: calibration.safe_to_continue_detection_spike
      && rows.every(function (row) { return row.within_tolerance; }),
    tuning_rows: rows
  };
}

function formatPercent(value) {
  return value === null || typeof value === "undefined" ? "n/a" : value + "%";
}

function renderPriorityCounts(counts) {
  return Object.keys(counts).sort().map(function (priority) {
    return "| `" + priority + "` | " + counts[priority] + " |";
  });
}

function renderHybridSelectorTuningMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Hybrid Selector Tuning Report");
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
  lines.push("| Tolerance | " + report.tolerance_percent + "% |");
  lines.push("| Ready for next detection spike | " + (report.ready_for_next_detection_spike ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Priority Counts");
  lines.push("");
  lines.push("| Priority | Fixtures |");
  lines.push("| --- | ---: |");
  lines.push.apply(lines, renderPriorityCounts(report.priority_counts));
  lines.push("");
  lines.push("## Method Tuning Summary");
  lines.push("");
  lines.push("| Selector method | Fixtures | Within tolerance | Avg delta from best | Priority mix |");
  lines.push("| --- | ---: | ---: | ---: | --- |");
  report.method_tuning_summary.forEach(function (method) {
    lines.push("| " + method.method_label
      + " | " + method.fixture_count
      + " | " + method.within_tolerance_count
      + " | " + formatPercent(method.average_delta_from_best_percent)
      + " | " + Object.keys(method.priority_counts).sort().map(function (priority) {
        return priority + ": " + method.priority_counts[priority];
      }).join(", ")
      + " |");
  });
  lines.push("");
  lines.push("## Fixture Actions");
  lines.push("");
  lines.push("| Fixture | Priority | Selector choice | Best method | Delta | Suggested action |");
  lines.push("| --- | --- | --- | --- | ---: | --- |");
  report.tuning_rows.forEach(function (row) {
    lines.push("| `" + row.fixture_id + "`"
      + " | `" + row.priority + "`"
      + " | " + row.selector_choice_label
      + " | " + row.best_method_label
      + " | " + formatPercent(row.error_delta_from_best_percent)
      + " | " + row.suggested_action
      + " |");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This report is a local benchmark planning artifact only.");
  lines.push("- It does not enable customer-facing detection.");
  lines.push("- It does not approve automated measurement output.");
  lines.push("- Internal reviewer approval remains required before any measurement version can be linked to a quote.");
  lines.push("");
  return lines.join("\n");
}

function writeHybridSelectorTuningArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-hybrid-selector-tuning"),
    method: "hybrid-selector-tuning",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-hybrid-selector-tuning");
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
  fs.writeFileSync(markdownPath, renderHybridSelectorTuningMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildHybridSelectorTuningReport: buildHybridSelectorTuningReport,
  renderHybridSelectorTuningMarkdown: renderHybridSelectorTuningMarkdown,
  writeHybridSelectorTuningArtifacts: writeHybridSelectorTuningArtifacts
};
