"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const Classical = require("../fixtures/floorplanClassicalContourCandidates");
const Hybrid = require("../fixtures/floorplanHybridSelectorCandidates");
const ManualSeed = require("../fixtures/floorplanManualSeedBaselineCandidates");
const QuickRoom = require("../fixtures/floorplanQuickRoomBaselineCandidates");
const Comparator = require("./floorplanBenchmarkReportComparator");
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
    hybrid_selector_spike: "Hybrid selector spike",
    manual_seed_baseline: "Manual-seed baseline",
    quick_room_baseline: "Quick-room baseline"
  };
  return labels[methodKey] || methodKey;
}

function buildCandidateBenchmarkReport(items) {
  const source = Array.isArray(items) ? items : corpus;
  const report = Harness.runBenchmark(source);
  const quickRoomItems = source.filter(function (item) {
    return item.plan_quality === "clean_vector" && Number(item.expected_section_count) <= 2;
  });
  const quickRoomResults = quickRoomItems.map(function (item) {
    return Harness.scoreCandidatePayload(item, QuickRoom.quickRoomCandidatePayloadForItem(item));
  });
  const manualSeedResults = source.map(function (item) {
    return Harness.scoreCandidatePayload(item, ManualSeed.manualSeedCandidatePayloadForItem(item));
  });
  const classicalContourResults = source.map(function (item) {
    return Harness.scoreCandidatePayload(item, Classical.classicalContourCandidatePayloadForItem(item));
  });
  const hybridSelectorResults = source.map(function (item) {
    return Harness.scoreCandidatePayload(item, Hybrid.hybridSelectorCandidatePayloadForItem(item));
  });
  return Object.assign({}, report, {
    quick_room_baseline: {
      item_count: quickRoomResults.length,
      passed_contract_count: quickRoomResults.filter(function (result) { return result.passed_contract; }).length,
      results: quickRoomResults
    },
    manual_seed_baseline: {
      item_count: manualSeedResults.length,
      passed_contract_count: manualSeedResults.filter(function (result) { return result.passed_contract; }).length,
      results: manualSeedResults
    },
    classical_contour_spike: {
      item_count: classicalContourResults.length,
      passed_contract_count: classicalContourResults.filter(function (result) { return result.passed_contract; }).length,
      measured_warning_count: classicalContourResults.filter(function (result) { return result.measured_area_warning; }).length,
      results: classicalContourResults
    },
    hybrid_selector_spike: {
      item_count: hybridSelectorResults.length,
      passed_contract_count: hybridSelectorResults.filter(function (result) { return result.passed_contract; }).length,
      measured_warning_count: hybridSelectorResults.filter(function (result) { return result.measured_area_warning; }).length,
      results: hybridSelectorResults
    }
  });
}

function findCandidate(fixtureRanking, methodKey) {
  return fixtureRanking.candidates.find(function (candidate) {
    return candidate.method_key === methodKey;
  }) || null;
}

function buildCalibrationRow(item, fixtureRanking, tolerancePercent) {
  const choice = Hybrid.chooseHybridMethodForItem(item);
  const selectedCandidate = findCandidate(fixtureRanking, "hybrid_selector_spike");
  const chosenUnderlyingCandidate = findCandidate(fixtureRanking, choice.method_key);
  const bestCandidate = fixtureRanking.candidates[0] || null;
  const selectedIndex = fixtureRanking.candidates.findIndex(function (candidate) {
    return candidate.method_key === "hybrid_selector_spike";
  });
  const chosenMeasured = selectedCandidate ? Number(selectedCandidate.measured_area_error_percent) : null;
  const bestMeasured = bestCandidate ? Number(bestCandidate.measured_area_error_percent) : null;
  const errorDelta = Number.isFinite(chosenMeasured) && Number.isFinite(bestMeasured)
    ? roundTo(chosenMeasured - bestMeasured, 2)
    : null;
  const exactMatch = bestCandidate && bestCandidate.method_key === "hybrid_selector_spike";
  const bestUnderlyingMatch = bestCandidate && bestCandidate.method_key === choice.method_key;
  return {
    fixture_id: item.id,
    fixture_title: item.title,
    plan_quality: item.plan_quality,
    expected_confidence: item.expected_confidence,
    selected_method_key: choice.method_key,
    selected_method_label: methodLabel(choice.method_key),
    selection_reason: choice.reason,
    ranking_position: selectedIndex >= 0 ? selectedIndex + 1 : null,
    best_method_key: bestCandidate && bestCandidate.method_key || null,
    best_method_label: bestCandidate && methodLabel(bestCandidate.method_key) || null,
    best_underlying_method_match: Boolean(bestUnderlyingMatch),
    exact_selector_match: Boolean(exactMatch),
    selected_measured_error_percent: Number.isFinite(chosenMeasured) ? chosenMeasured : null,
    selected_underlying_measured_error_percent: chosenUnderlyingCandidate ? chosenUnderlyingCandidate.measured_area_error_percent : null,
    best_measured_error_percent: Number.isFinite(bestMeasured) ? bestMeasured : null,
    error_delta_from_best_percent: errorDelta,
    within_tolerance: errorDelta !== null && errorDelta <= tolerancePercent,
    selected_area_safe: selectedCandidate ? selectedCandidate.selected_area_safe : false,
    review_required: selectedCandidate ? selectedCandidate.review_required : false,
    measured_area_warning: selectedCandidate ? selectedCandidate.measured_area_warning : true,
    ranked_method_order: fixtureRanking.candidates.map(function (candidate) {
      return {
        method_key: candidate.method_key,
        method_label: methodLabel(candidate.method_key),
        measured_area_error_percent: candidate.measured_area_error_percent,
        measured_area_warning: candidate.measured_area_warning,
        area_warning: candidate.area_warning
      };
    })
  };
}

function average(rows, field) {
  const values = rows.map(function (row) { return Number(row[field]); }).filter(Number.isFinite);
  if (!values.length) return null;
  return roundTo(values.reduce(function (sum, value) {
    return sum + value;
  }, 0) / values.length, 2);
}

function buildHybridSelectorCalibrationReport(items, options) {
  const settings = Object.assign({ tolerancePercent: 2 }, options || {});
  const source = Array.isArray(items) ? items : corpus;
  const benchmark = buildCandidateBenchmarkReport(source);
  const ranking = Comparator.rankMethodsInReport(benchmark);
  const byId = ranking.fixture_rankings.reduce(function (map, fixture) {
    map[fixture.fixture_id] = fixture;
    return map;
  }, {});
  const rows = source.map(function (item) {
    return buildCalibrationRow(item, byId[item.id], settings.tolerancePercent);
  });
  const exactMatchCount = rows.filter(function (row) { return row.exact_selector_match; }).length;
  const bestUnderlyingMatchCount = rows.filter(function (row) { return row.best_underlying_method_match; }).length;
  const withinToleranceCount = rows.filter(function (row) { return row.within_tolerance; }).length;
  const warningCount = rows.filter(function (row) { return row.measured_area_warning; }).length;
  return {
    report_type: "floorplan_hybrid_selector_calibration_report",
    benchmark_version: "floorplan-phase-3-hybrid-selector-calibration-v1",
    local_only: true,
    customer_visible: false,
    item_count: rows.length,
    tolerance_percent: settings.tolerancePercent,
    exact_match_count: exactMatchCount,
    best_underlying_match_count: bestUnderlyingMatchCount,
    within_tolerance_count: withinToleranceCount,
    measured_warning_count: warningCount,
    average_error_delta_from_best_percent: average(rows, "error_delta_from_best_percent"),
    average_selected_measured_error_percent: average(rows, "selected_measured_error_percent"),
    safe_to_continue_detection_spike: rows.length > 0
      && ranking.safe_to_continue_detection_spike
      && withinToleranceCount === rows.length
      && warningCount === 0
      && rows.every(function (row) { return row.selected_area_safe && row.review_required; }),
    calibration_rows: rows
  };
}

function formatPercent(value) {
  return value === null || typeof value === "undefined" ? "n/a" : value + "%";
}

function renderHybridSelectorCalibrationMarkdown(report, metadata) {
  const lines = [];
  const meta = metadata || {};
  lines.push("# Floorplan Hybrid Selector Calibration Report");
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
  lines.push("| Fixtures calibrated | " + report.item_count + " |");
  lines.push("| Exact selector wins | " + report.exact_match_count + " |");
  lines.push("| Underlying method wins | " + report.best_underlying_match_count + " |");
  lines.push("| Within tolerance | " + report.within_tolerance_count + " |");
  lines.push("| Measured warnings | " + report.measured_warning_count + " |");
  lines.push("| Average delta from best | " + formatPercent(report.average_error_delta_from_best_percent) + " |");
  lines.push("| Average selected measured error | " + formatPercent(report.average_selected_measured_error_percent) + " |");
  lines.push("| Ready for next detection spike | " + (report.safe_to_continue_detection_spike ? "yes" : "no") + " |");
  lines.push("");
  lines.push("## Calibration Rows");
  lines.push("");
  lines.push("| Fixture | Selector choice | Best method | Rank | Delta from best | Within tolerance | Why selected |");
  lines.push("| --- | --- | --- | ---: | ---: | --- | --- |");
  report.calibration_rows.forEach(function (row) {
    lines.push("| `" + row.fixture_id + "`"
      + " | " + row.selected_method_label
      + " | " + (row.best_method_label || "n/a")
      + " | " + (row.ranking_position || "n/a")
      + " | " + formatPercent(row.error_delta_from_best_percent)
      + " | " + (row.within_tolerance ? "yes" : "no")
      + " | " + row.selection_reason
      + " |");
  });
  lines.push("");
  lines.push("## Method Order");
  lines.push("");
  report.calibration_rows.forEach(function (row) {
    lines.push("- `" + row.fixture_id + "`: " + row.ranked_method_order.map(function (entry) {
      const warning = entry.measured_area_warning || entry.area_warning ? " warning" : "";
      return entry.method_label + " (" + formatPercent(entry.measured_area_error_percent) + warning + ")";
    }).join(" -> "));
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This calibration report is local QA only.");
  lines.push("- The selector can recommend candidate methods, but reviewed approval remains mandatory.");
  lines.push("- Candidate selected area remains `0` until an internal reviewer approves a measurement version.");
  lines.push("- No customer-facing detection is enabled by this report.");
  lines.push("");
  return lines.join("\n");
}

function writeHybridSelectorCalibrationArtifacts(report, options) {
  const settings = Object.assign({}, {
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-hybrid-selector-calibration"),
    method: "hybrid-selector-calibration",
    date: new Date()
  }, options || {});
  if (!settings.outputDir) {
    settings.outputDir = path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-hybrid-selector-calibration");
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
  fs.writeFileSync(markdownPath, renderHybridSelectorCalibrationMarkdown(fullReport, metadata));
  return {
    report_id: reportId,
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

module.exports = {
  buildCandidateBenchmarkReport: buildCandidateBenchmarkReport,
  buildHybridSelectorCalibrationReport: buildHybridSelectorCalibrationReport,
  renderHybridSelectorCalibrationMarkdown: renderHybridSelectorCalibrationMarkdown,
  writeHybridSelectorCalibrationArtifacts: writeHybridSelectorCalibrationArtifacts
};
