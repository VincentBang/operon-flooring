#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const corpus = require("../fixtures/floorplanBenchmarkCorpus");
const ManualSeed = require("../fixtures/floorplanManualSeedBaselineCandidates");
const Harness = require("../lib/floorplanBenchmarkHarness");
const Writer = require("../lib/floorplanBenchmarkReportWriter");

function argValues(prefix) {
  return process.argv.filter(function (arg) {
    return arg.indexOf(prefix) === 0;
  }).map(function (arg) {
    return arg.slice(prefix.length);
  });
}

function argValue(prefix, fallback) {
  const values = argValues(prefix);
  return values.length ? values[values.length - 1] : fallback;
}

function parseSeed(value) {
  const parts = String(value || "").split(",");
  if (parts.length !== 2) {
    throw new Error("Seed must be formatted as x,y using normalized 0-1 coordinates.");
  }
  const x = Number(parts[0]);
  const y = Number(parts[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 1 || y < 0 || y > 1) {
    throw new Error("Seed coordinates must be numbers between 0 and 1.");
  }
  return { x: x, y: y };
}

function formatPercent(value) {
  return value === null || typeof value === "undefined" ? "n/a" : value + "%";
}

function areaErrorBand(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "not_available";
  if (number <= 5) return "low_0_to_5_percent";
  if (number <= 10) return "medium_5_to_10_percent";
  return "high_over_10_percent";
}

function makeExperimentReport(item, seeds) {
  const baselinePayload = ManualSeed.manualSeedCandidatePayloadForItem(item);
  const experimentCandidate = ManualSeed.manualSeedCandidatePayloadForSeedsWithQuality(item, seeds);
  if (!experimentCandidate.payload.candidates.length) {
    const reasons = Object.keys(experimentCandidate.quality_summary.rejected_seed_reasons).map(function (reason) {
      return reason + "=" + experimentCandidate.quality_summary.rejected_seed_reasons[reason];
    }).join(", ");
    throw new Error("No accepted seed points. Rejected seed reasons: " + (reasons || "none"));
  }
  const experimentPayload = experimentCandidate.payload;
  const baseline = Harness.scoreCandidatePayload(item, baselinePayload);
  const experiment = Harness.scoreCandidatePayload(item, experimentPayload);
  const areaDelta = Number.isFinite(Number(baseline.area_error_percent)) && Number.isFinite(Number(experiment.area_error_percent))
    ? Math.round((Number(experiment.area_error_percent) - Number(baseline.area_error_percent)) * 100) / 100
    : null;
  const qualitySummary = Object.assign({}, experimentCandidate.quality_summary, {
    baseline_area_error_band: areaErrorBand(baseline.area_error_percent),
    experiment_area_error_band: areaErrorBand(experiment.area_error_percent),
    baseline_measured_area_error_band: areaErrorBand(baseline.measured_area_error_percent),
    experiment_measured_area_error_band: areaErrorBand(experiment.measured_area_error_percent),
    area_error_delta_band: areaErrorBand(areaDelta === null ? null : Math.abs(areaDelta))
  });

  return {
    benchmark_version: "floorplan-manual-seed-experiment-v1",
    local_only: true,
    fixture_id: item.id,
    fixture_title: item.title,
    seed_points: seeds,
    candidate_quality_summary: qualitySummary,
    baseline: baseline,
    experiment: experiment,
    comparison: {
      area_error_delta_percent: areaDelta,
      contract_regression: baseline.passed_contract && !experiment.passed_contract,
      selected_area_safe: experiment.candidate_selected_area_m2 === 0,
      review_required: experiment.review_required === true,
      final: false,
      customer_visible: false,
      safe_to_continue_local_experiment: Boolean(experiment.passed_contract && experiment.candidate_selected_area_m2 === 0 && experiment.review_required)
    }
  };
}

function renderMarkdown(report) {
  return [
    "# Floorplan Manual-Seed Experiment",
    "",
    "- Local only: yes",
    "- Fixture: `" + report.fixture_id + "`",
    "- Fixture title: " + report.fixture_title,
    "- Safe to continue local experiment: " + (report.comparison.safe_to_continue_local_experiment ? "yes" : "no"),
    "",
    "## Candidate Quality Summary",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    "| Seed points supplied | " + report.candidate_quality_summary.seed_count + " |",
    "| Accepted seeds | " + report.candidate_quality_summary.accepted_seed_count + " |",
    "| Rejected seeds | " + report.candidate_quality_summary.rejected_seed_count + " |",
    "| Experiment area error band | " + report.candidate_quality_summary.experiment_area_error_band + " |",
    "| Experiment measured area error band | " + report.candidate_quality_summary.experiment_measured_area_error_band + " |",
    "| Area delta band | " + report.candidate_quality_summary.area_error_delta_band + " |",
    "",
    "Rejected seed reasons: `" + JSON.stringify(report.candidate_quality_summary.rejected_seed_reasons) + "`",
    "",
    "Candidate section labels:",
    "",
    report.candidate_quality_summary.candidate_section_labels.map(function (label) {
      return "- " + label;
    }).join("\n") || "- none",
    "",
    "## Seeds",
    "",
    report.seed_points.map(function (seed) {
      return "- `" + seed.x + "," + seed.y + "`";
    }).join("\n"),
    "",
    "## Comparison",
    "",
    "| Metric | Baseline | Experiment |",
    "| --- | ---: | ---: |",
    "| Candidate sections | " + report.baseline.candidate_section_count + " | " + report.experiment.candidate_section_count + " |",
    "| Candidate measured m2 | " + report.baseline.candidate_measured_area_m2 + " | " + report.experiment.candidate_measured_area_m2 + " |",
    "| Reviewed m2 | " + report.baseline.reviewed_area_m2 + " | " + report.experiment.reviewed_area_m2 + " |",
    "| Area error | " + formatPercent(report.baseline.area_error_percent) + " | " + formatPercent(report.experiment.area_error_percent) + " |",
    "| Measured area error | " + formatPercent(report.baseline.measured_area_error_percent) + " | " + formatPercent(report.experiment.measured_area_error_percent) + " |",
    "| Selected quote area | " + report.baseline.candidate_selected_area_m2 + " | " + report.experiment.candidate_selected_area_m2 + " |",
    "| Review required | " + (report.baseline.review_required ? "yes" : "no") + " | " + (report.experiment.review_required ? "yes" : "no") + " |",
    "| Contract pass | " + (report.baseline.passed_contract ? "yes" : "no") + " | " + (report.experiment.passed_contract ? "yes" : "no") + " |",
    "",
    "## Safety Notes",
    "",
    "- The experiment reads synthetic benchmark fixtures only.",
    "- It does not read customer uploads or storage paths.",
    "- It does not write Supabase rows.",
    "- It does not create quote handoff payloads.",
    "- Candidate selected area must remain `0` until reviewed.",
    ""
  ].join("\n");
}

function writeExperimentArtifacts(report, options) {
  const settings = Object.assign({
    outputDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-manual-seed-experiments"),
    date: new Date()
  }, options || {});
  fs.mkdirSync(settings.outputDir, { recursive: true });
  const reportId = Writer.makeTimestamp(settings.date) + "-manual-seed-" + Writer.safeSlug(report.fixture_id);
  const jsonPath = path.join(settings.outputDir, reportId + ".json");
  const markdownPath = path.join(settings.outputDir, reportId + ".md");
  const artifactReport = Object.assign({}, report, {
    artifact_metadata: {
      report_id: reportId,
      created_at: settings.date.toISOString(),
      method: "manual-seed-experiment"
    }
  });
  fs.writeFileSync(jsonPath, JSON.stringify(artifactReport, null, 2) + "\n");
  fs.writeFileSync(markdownPath, renderMarkdown(artifactReport));
  return { report_id: reportId, json_path: jsonPath, markdown_path: markdownPath };
}

function usage() {
  return [
    "Usage:",
    "node internal-qa/scripts/runFloorplanManualSeedExperiment.js --fixture=<fixture-id> --seed=<x,y> [--seed=<x,y>] [--json] [--write-artifacts] [--output-dir=<dir>]",
    "",
    "Example:",
    "node internal-qa/scripts/runFloorplanManualSeedExperiment.js --fixture=synthetic-two-room-apartment --seed=0.2,0.2 --seed=0.6,0.2 --json"
  ].join("\n");
}

try {
  const fixtureId = argValue("--fixture=", "");
  const seedArgs = argValues("--seed=");
  const jsonMode = process.argv.includes("--json");
  const writeArtifacts = process.argv.includes("--write-artifacts");
  const outputDir = argValue("--output-dir=", null);
  if (!fixtureId || !seedArgs.length) {
    console.error(usage());
    process.exit(2);
  }
  const item = corpus.find(function (entry) {
    return entry.id === fixtureId;
  });
  if (!item) {
    throw new Error("Unknown benchmark fixture: " + fixtureId);
  }
  const seeds = seedArgs.map(parseSeed);
  const report = makeExperimentReport(item, seeds);
  if (writeArtifacts) {
    const artifactOptions = outputDir ? { outputDir: outputDir } : {};
    const artifact = writeExperimentArtifacts(report, artifactOptions);
    console.error("Wrote manual-seed experiment artifacts:");
    console.error("- JSON: " + artifact.json_path);
    console.error("- Markdown: " + artifact.markdown_path);
  }
  if (jsonMode) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    process.stdout.write(renderMarkdown(report));
  }
  process.exit(report.comparison.safe_to_continue_local_experiment ? 0 : 1);
} catch (error) {
  console.error(error && error.message || error);
  process.exit(1);
}
