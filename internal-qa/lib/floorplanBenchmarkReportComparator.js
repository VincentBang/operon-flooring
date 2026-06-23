"use strict";

const fs = require("fs");

const SENSITIVE_TEXT_PATTERN = /\b(price|pricing|rate|rates|margin|markup|supplier|cost|secret|token|ocr|transcript|phone|email|address)\b|service[_ -]?role|storage[_ -]?(bucket|path)|file[_ -]?path|signed[_ -]?url|raw[_ -]?text/i;

function walkStrings(value, visitor) {
  if (Array.isArray(value)) {
    value.forEach(function (item) {
      walkStrings(item, visitor);
    });
    return;
  }
  if (value && typeof value === "object") {
    Object.keys(value).forEach(function (key) {
      visitor(key);
      walkStrings(value[key], visitor);
    });
    return;
  }
  if (typeof value === "string") {
    visitor(value);
  }
}

function assertNoSensitiveReportText(report, label) {
  const hits = [];
  walkStrings(report, function (value) {
    if (SENSITIVE_TEXT_PATTERN.test(value)) hits.push(value);
  });
  if (hits.length) {
    throw new Error((label || "Benchmark report") + " contains sensitive text: " + hits.slice(0, 3).join(", "));
  }
}

function roundTo(value, places) {
  const factor = Math.pow(10, places || 2);
  return Math.round((Number(value) || 0) * factor) / factor;
}

function readReport(filePath) {
  const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assertNoSensitiveReportText(report, filePath);
  return report;
}

function quickRoomResults(report) {
  return report && report.quick_room_baseline && Array.isArray(report.quick_room_baseline.results)
    ? report.quick_room_baseline.results
    : [];
}

function averageAreaError(results) {
  const valid = results.filter(function (result) {
    return Number.isFinite(Number(result.area_error_percent));
  });
  if (!valid.length) return null;
  return roundTo(valid.reduce(function (sum, result) {
    return sum + Number(result.area_error_percent);
  }, 0) / valid.length, 2);
}

function byId(results) {
  return results.reduce(function (map, result) {
    map[result.id] = result;
    return map;
  }, {});
}

function compareReports(baselineReport, candidateReport, options) {
  const settings = Object.assign({
    areaRegressionTolerancePercent: 2,
    blockOnContractRegression: true
  }, options || {});
  assertNoSensitiveReportText(baselineReport, "Baseline report");
  assertNoSensitiveReportText(candidateReport, "Candidate report");

  const baselineQuick = quickRoomResults(baselineReport);
  const candidateQuick = quickRoomResults(candidateReport);
  const baselineMap = byId(baselineQuick);
  const candidateMap = byId(candidateQuick);
  const sharedIds = Object.keys(baselineMap).filter(function (id) {
    return Boolean(candidateMap[id]);
  }).sort();
  const itemComparisons = sharedIds.map(function (id) {
    const baseline = baselineMap[id];
    const candidate = candidateMap[id];
    const baselineError = Number(baseline.area_error_percent);
    const candidateError = Number(candidate.area_error_percent);
    const delta = Number.isFinite(baselineError) && Number.isFinite(candidateError)
      ? roundTo(candidateError - baselineError, 2)
      : null;
    return {
      id: id,
      baseline_area_error_percent: Number.isFinite(baselineError) ? baselineError : null,
      candidate_area_error_percent: Number.isFinite(candidateError) ? candidateError : null,
      area_error_delta_percent: delta,
      baseline_passed_contract: Boolean(baseline.passed_contract),
      candidate_passed_contract: Boolean(candidate.passed_contract),
      regressed: Boolean(
        baseline.passed_contract && !candidate.passed_contract
        || delta !== null && delta > settings.areaRegressionTolerancePercent
      )
    };
  });
  const regressions = itemComparisons.filter(function (item) {
    return item.regressed;
  });
  const baselineContractPass = baselineQuick.filter(function (result) { return result.passed_contract; }).length;
  const candidateContractPass = candidateQuick.filter(function (result) { return result.passed_contract; }).length;
  const contractRegression = settings.blockOnContractRegression && candidateContractPass < baselineContractPass;

  return {
    baseline_report_id: baselineReport.artifact_metadata && baselineReport.artifact_metadata.report_id || "baseline",
    candidate_report_id: candidateReport.artifact_metadata && candidateReport.artifact_metadata.report_id || "candidate",
    benchmark_version: candidateReport.benchmark_version || baselineReport.benchmark_version || "unknown",
    baseline_failed_count: Number(baselineReport.failed_count || 0),
    candidate_failed_count: Number(candidateReport.failed_count || 0),
    failed_count_delta: Number(candidateReport.failed_count || 0) - Number(baselineReport.failed_count || 0),
    baseline_quick_room_contract_pass: baselineContractPass,
    candidate_quick_room_contract_pass: candidateContractPass,
    quick_room_contract_pass_delta: candidateContractPass - baselineContractPass,
    baseline_average_candidate_area_error_percent: averageAreaError(baselineQuick),
    candidate_average_candidate_area_error_percent: averageAreaError(candidateQuick),
    shared_candidate_count: sharedIds.length,
    regression_count: regressions.length,
    regressions: regressions,
    safe_to_continue_detection_spike: !contractRegression && regressions.length === 0 && Number(candidateReport.failed_count || 0) <= Number(baselineReport.failed_count || 0),
    item_comparisons: itemComparisons
  };
}

function renderComparisonMarkdown(comparison) {
  const lines = [];
  lines.push("# Floorplan Benchmark Comparison");
  lines.push("");
  lines.push("- Baseline: `" + comparison.baseline_report_id + "`");
  lines.push("- Candidate: `" + comparison.candidate_report_id + "`");
  lines.push("- Safe to continue detection spike: " + (comparison.safe_to_continue_detection_spike ? "yes" : "no"));
  lines.push("");
  lines.push("| Metric | Baseline | Candidate | Delta |");
  lines.push("| --- | ---: | ---: | ---: |");
  lines.push("| Corpus failed | " + comparison.baseline_failed_count + " | " + comparison.candidate_failed_count + " | " + comparison.failed_count_delta + " |");
  lines.push("| Quick-room contract pass | " + comparison.baseline_quick_room_contract_pass + " | " + comparison.candidate_quick_room_contract_pass + " | " + comparison.quick_room_contract_pass_delta + " |");
  lines.push("| Average candidate area error | " + (comparison.baseline_average_candidate_area_error_percent === null ? "n/a" : comparison.baseline_average_candidate_area_error_percent + "%") + " | " + (comparison.candidate_average_candidate_area_error_percent === null ? "n/a" : comparison.candidate_average_candidate_area_error_percent + "%") + " |  |");
  lines.push("");
  lines.push("## Item Comparisons");
  lines.push("");
  lines.push("| Status | Fixture | Baseline error | Candidate error | Delta |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  comparison.item_comparisons.forEach(function (item) {
    lines.push("| " + (item.regressed ? "REGRESSED" : "OK")
      + " | `" + item.id + "`"
      + " | " + (item.baseline_area_error_percent === null ? "n/a" : item.baseline_area_error_percent + "%")
      + " | " + (item.candidate_area_error_percent === null ? "n/a" : item.candidate_area_error_percent + "%")
      + " | " + (item.area_error_delta_percent === null ? "n/a" : item.area_error_delta_percent + "%")
      + " |");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- Comparison reports are local QA artifacts only.");
  lines.push("- A passing comparison does not approve customer-visible detection.");
  lines.push("- Candidate output remains reviewer-only until separately approved.");
  lines.push("");
  return lines.join("\n");
}

module.exports = {
  assertNoSensitiveReportText: assertNoSensitiveReportText,
  compareReports: compareReports,
  readReport: readReport,
  renderComparisonMarkdown: renderComparisonMarkdown,
  _test: {
    averageAreaError: averageAreaError
  }
};
