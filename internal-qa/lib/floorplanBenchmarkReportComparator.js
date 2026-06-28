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

const METHOD_SECTIONS = [
  { key: "quick_room_baseline", label: "quick-room baseline" },
  { key: "manual_seed_baseline", label: "manual-seed baseline" },
  { key: "classical_contour_spike", label: "classical contour spike" },
  { key: "hybrid_selector_spike", label: "hybrid selector spike" }
];

function methodResults(report, method) {
  const section = report && report[method.key];
  return section && Array.isArray(section.results) ? section.results : [];
}

function scoreMethodResult(result) {
  const measured = Number(result && result.measured_area_error_percent);
  const selected = Number(result && result.area_error_percent);
  const error = Number.isFinite(measured) ? measured : selected;
  return {
    method: result && result.candidate_method || "unknown",
    measured_area_error_percent: Number.isFinite(measured) ? measured : null,
    selected_area_error_percent: Number.isFinite(selected) ? selected : null,
    passed_contract: Boolean(result && result.passed_contract),
    review_required: Boolean(result && result.review_required),
    selected_area_safe: Number(result && result.candidate_selected_area_m2) === 0,
    measured_area_warning: Boolean(result && result.measured_area_warning),
    area_warning: Boolean(result && result.area_warning),
    rank_error: Number.isFinite(error) ? error : 999999
  };
}

function compareMethodScores(first, second) {
  if (first.passed_contract !== second.passed_contract) return first.passed_contract ? -1 : 1;
  if (first.selected_area_safe !== second.selected_area_safe) return first.selected_area_safe ? -1 : 1;
  if (first.measured_area_warning !== second.measured_area_warning) return first.measured_area_warning ? 1 : -1;
  if (first.rank_error !== second.rank_error) return first.rank_error - second.rank_error;
  return first.method.localeCompare(second.method);
}

function rankMethodsInReport(report) {
  assertNoSensitiveReportText(report, "Method ranking report");
  const byMethod = METHOD_SECTIONS.map(function (method) {
    return {
      method: method,
      map: byId(methodResults(report, method))
    };
  }).filter(function (entry) {
    return Object.keys(entry.map).length > 0;
  });
  const fixtureIds = Array.from(new Set(byMethod.flatMap(function (entry) {
    return Object.keys(entry.map);
  }))).sort();
  const fixture_rankings = fixtureIds.map(function (id) {
    const candidates = byMethod.map(function (entry) {
      const raw = entry.map[id];
      if (!raw) return null;
      return Object.assign({
        fixture_id: id,
        method_key: entry.method.key,
        method_label: entry.method.label
      }, scoreMethodResult(raw));
    }).filter(Boolean).sort(compareMethodScores);
    return {
      fixture_id: id,
      best_method_key: candidates[0] && candidates[0].method_key || null,
      best_method_label: candidates[0] && candidates[0].method_label || null,
      warning_count: candidates.filter(function (candidate) {
        return candidate.measured_area_warning || candidate.area_warning;
      }).length,
      candidates: candidates
    };
  });
  const method_summary = METHOD_SECTIONS.map(function (method) {
    const results = methodResults(report, method);
    if (!results.length) return null;
    const scored = results.map(scoreMethodResult);
    const validMeasured = scored.filter(function (result) {
      return Number.isFinite(Number(result.measured_area_error_percent));
    });
    return {
      method_key: method.key,
      method_label: method.label,
      item_count: scored.length,
      contract_pass_count: scored.filter(function (result) { return result.passed_contract; }).length,
      measured_warning_count: scored.filter(function (result) { return result.measured_area_warning; }).length,
      selected_area_safe_count: scored.filter(function (result) { return result.selected_area_safe; }).length,
      average_measured_area_error_percent: validMeasured.length
        ? roundTo(validMeasured.reduce(function (sum, result) {
          return sum + Number(result.measured_area_error_percent);
        }, 0) / validMeasured.length, 2)
        : null,
      best_fixture_count: fixture_rankings.filter(function (ranking) {
        return ranking.best_method_key === method.key;
      }).length
    };
  }).filter(Boolean);
  return {
    benchmark_version: report.benchmark_version || "unknown",
    report_id: report.artifact_metadata && report.artifact_metadata.report_id || "unsaved-report",
    local_only: true,
    customer_visible: false,
    method_summary: method_summary,
    fixture_rankings: fixture_rankings,
    safe_to_continue_detection_spike: method_summary.every(function (method) {
      return method.contract_pass_count === method.item_count && method.selected_area_safe_count === method.item_count;
    })
  };
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

function formatPercent(value) {
  return value === null || typeof value === "undefined" ? "n/a" : value + "%";
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

function renderMethodRankingMarkdown(ranking) {
  const lines = [];
  lines.push("# Floorplan Candidate Method Ranking");
  lines.push("");
  lines.push("- Report: `" + ranking.report_id + "`");
  lines.push("- Local only: yes");
  lines.push("- Customer visible: no");
  lines.push("- Safe to continue detection spike: " + (ranking.safe_to_continue_detection_spike ? "yes" : "no"));
  lines.push("");
  lines.push("## Method Summary");
  lines.push("");
  lines.push("| Method | Cases | Contract pass | Selected-area safe | Measured warnings | Avg measured error | Best fixtures |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  ranking.method_summary.forEach(function (method) {
    lines.push("| " + method.method_label
      + " | " + method.item_count
      + " | " + method.contract_pass_count
      + " | " + method.selected_area_safe_count
      + " | " + method.measured_warning_count
      + " | " + formatPercent(method.average_measured_area_error_percent)
      + " | " + method.best_fixture_count
      + " |");
  });
  lines.push("");
  lines.push("## Fixture Winners");
  lines.push("");
  lines.push("| Fixture | Best method | Method order | Warning count |");
  lines.push("| --- | --- | --- | ---: |");
  ranking.fixture_rankings.forEach(function (fixture) {
    lines.push("| `" + fixture.fixture_id + "`"
      + " | " + (fixture.best_method_label || "n/a")
      + " | " + fixture.candidates.map(function (candidate) {
        const warning = candidate.measured_area_warning || candidate.area_warning ? " warning" : "";
        return candidate.method_label + " (" + formatPercent(candidate.measured_area_error_percent) + warning + ")";
      }).join(" -> ")
      + " | " + fixture.warning_count
      + " |");
  });
  lines.push("");
  lines.push("## Safety Notes");
  lines.push("");
  lines.push("- This ranking compares internal QA candidate methods only.");
  lines.push("- No ranked method is approved for customer-visible detection.");
  lines.push("- Candidate selected area must remain `0` until reviewed.");
  lines.push("");
  return lines.join("\n");
}

module.exports = {
  assertNoSensitiveReportText: assertNoSensitiveReportText,
  compareReports: compareReports,
  rankMethodsInReport: rankMethodsInReport,
  readReport: readReport,
  renderComparisonMarkdown: renderComparisonMarkdown,
  renderMethodRankingMarkdown: renderMethodRankingMarkdown,
  _test: {
    averageAreaError: averageAreaError
  }
};
