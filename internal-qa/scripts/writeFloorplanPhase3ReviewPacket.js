#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const Bundle = require("../lib/floorplanPhase3ReviewBundleReport");
const Inspection = require("../lib/floorplanCandidateInspectionPacketReport");
const NextActions = require("../lib/floorplanPhase3NextActionsReport");
const RealSample = require("../lib/floorplanRealSampleIntakeGateReport");
const Readiness = require("../lib/floorplanReviewerReadinessGateReport");
const Status = require("../lib/floorplanPhase3StatusReport");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

function writeReport(key, outputDir, build, write) {
  const report = build();
  const artifact = write(report, {
    outputDir: path.join(outputDir, key)
  });
  return {
    key: key,
    report_type: report.report_type,
    json_path: artifact.json_path,
    markdown_path: artifact.markdown_path,
    local_only: report.local_only === true,
    customer_visible: report.customer_visible === true
  };
}

function writePacket(outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const reports = [
    writeReport("phase3-status", outputDir, Status.buildFloorplanPhase3StatusReport, Status.writeFloorplanPhase3StatusArtifacts),
    writeReport("phase3-review-bundle", outputDir, Bundle.buildFloorplanPhase3ReviewBundleReport, Bundle.writeFloorplanPhase3ReviewBundleArtifacts),
    writeReport("phase3-next-actions", outputDir, NextActions.buildFloorplanPhase3NextActionsReport, NextActions.writeFloorplanPhase3NextActionsArtifacts),
    writeReport("reviewer-readiness", outputDir, Readiness.buildFloorplanReviewerReadinessGateReport, Readiness.writeFloorplanReviewerReadinessGateArtifacts),
    writeReport("real-sample-intake", outputDir, RealSample.buildFloorplanRealSampleIntakeGateReport, RealSample.writeFloorplanRealSampleIntakeGateArtifacts),
    writeReport("inspection-packet", outputDir, Inspection.buildFloorplanCandidateInspectionPacketReport, Inspection.writeFloorplanCandidateInspectionPacketArtifacts)
  ];
  const manifest = {
    packet_type: "floorplan_phase3_review_packet",
    local_only: true,
    customer_visible: false,
    report_count: reports.length,
    reports: reports,
    next_step: "Review phase3-next-actions before adding real reviewed samples or requesting reviewer QA."
  };
  const manifestPath = path.join(outputDir, "packet-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  return Object.assign({ manifest_path: manifestPath }, manifest);
}

const jsonMode = process.argv.includes("--json");
const outputDir = path.resolve(process.cwd(), argValue("--output-dir=", path.join("internal-qa", "reports", "floorplan-phase3-review-packet")));
const packet = writePacket(outputDir);

if (jsonMode) {
  process.stdout.write(JSON.stringify(packet, null, 2) + "\n");
} else {
  console.log("Wrote floorplan Phase 3 review packet:");
  console.log("- Manifest: " + packet.manifest_path);
  packet.reports.forEach(function (report) {
    console.log("- " + report.key + ": " + report.json_path);
  });
}
