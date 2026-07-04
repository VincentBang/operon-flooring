#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const REQUIRED_KEYS = [
  "phase3-status",
  "phase3-review-bundle",
  "phase3-next-actions",
  "phase3-local-gates",
  "reviewer-readiness",
  "real-sample-intake",
  "real-sample-collection",
  "real-sample-request",
  "inspection-packet"
];

const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validatePacket(packetDir) {
  const manifestPath = path.join(packetDir, "packet-manifest.json");
  const errors = [];
  if (!fs.existsSync(manifestPath)) {
    errors.push("Missing packet-manifest.json");
    return { ok: false, packet_dir: packetDir, errors: errors };
  }

  const manifest = readJson(manifestPath);
  if (manifest.packet_type !== "floorplan_phase3_review_packet") errors.push("Unexpected packet_type.");
  if (manifest.local_only !== true) errors.push("Packet must be local_only.");
  if (manifest.customer_visible !== false) errors.push("Packet must not be customer_visible.");
  if (!Array.isArray(manifest.reports)) errors.push("Packet reports must be an array.");

  const reports = Array.isArray(manifest.reports) ? manifest.reports : [];
  const keys = reports.map(function (report) { return report.key; });
  REQUIRED_KEYS.forEach(function (key) {
    if (!keys.includes(key)) errors.push("Missing report key: " + key);
  });
  if (manifest.report_count !== REQUIRED_KEYS.length) {
    errors.push("Expected report_count " + REQUIRED_KEYS.length + " but saw " + manifest.report_count);
  }

  reports.forEach(function (report) {
    if (report.local_only !== true) errors.push(report.key + " must be local_only.");
    if (report.customer_visible !== false) errors.push(report.key + " must not be customer_visible.");
    ["json_path", "markdown_path"].forEach(function (field) {
      const value = report[field];
      if (!value || !fs.existsSync(value)) {
        errors.push(report.key + " missing " + field + ".");
        return;
      }
      const contents = fs.readFileSync(value, "utf8");
      if (SENSITIVE_PATTERN.test(contents)) {
        errors.push(report.key + " " + field + " contains sensitive field markers.");
      }
    });
  });

  return {
    ok: errors.length === 0,
    packet_dir: packetDir,
    manifest_path: manifestPath,
    expected_report_count: REQUIRED_KEYS.length,
    actual_report_count: manifest.report_count,
    report_keys: keys,
    errors: errors
  };
}

if (require.main === module) {
  const packetDir = path.resolve(process.cwd(), argValue("--packet-dir=", path.join("internal-qa", "reports", "floorplan-phase3-review-packet")));
  const result = validatePacket(packetDir);

  if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else if (result.ok) {
    console.log("Floorplan Phase 3 review packet is valid.");
    console.log("- Packet dir: " + result.packet_dir);
    console.log("- Reports: " + result.actual_report_count);
  } else {
    console.error("Floorplan Phase 3 review packet is invalid.");
    result.errors.forEach(function (error) {
      console.error("- " + error);
    });
  }

  if (!result.ok) process.exit(1);
}

module.exports = {
  REQUIRED_KEYS: REQUIRED_KEYS,
  validatePacket: validatePacket
};
