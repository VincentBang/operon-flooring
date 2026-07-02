#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const Gate = require("../lib/floorplanRealSampleIntakeGateReport");
const Geometry = require("../../netlify/functions/shared/floorplanGeometry");

const SENSITIVE_PATTERN = /\b(storage_bucket|storage_path|file_path|signed_url|supplier_cost|margin|internal_rate|service_role|raw_ocr|raw_text|phone|email|address)\b/i;

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

function loadFixture(filePath) {
  const absolute = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolute)) {
    throw new Error("Fixture file does not exist.");
  }
  if (absolute.endsWith(".json")) {
    return JSON.parse(fs.readFileSync(absolute, "utf8"));
  }
  if (absolute.endsWith(".js") || absolute.endsWith(".cjs")) {
    delete require.cache[absolute];
    return require(absolute);
  }
  throw new Error("Fixture file must be .json, .js or .cjs.");
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

function validateFixtureShape(item) {
  const errors = [];
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return ["Fixture must be an object."];
  }
  if (item.fixture_origin !== "approved_real_reviewed_sample") errors.push("fixture_origin must be approved_real_reviewed_sample.");
  if (item.usage_status !== "approved_for_internal_benchmark") errors.push("usage_status must be approved_for_internal_benchmark.");
  if (item.privacy_status !== "customer_identifiers_removed") errors.push("privacy_status must be customer_identifiers_removed.");
  if (item.customer_identifiers_removed !== true) errors.push("customer_identifiers_removed must be true.");
  if (!/^reviewed-sample-[a-z0-9-]+$/.test(String(item.id || ""))) errors.push("id must start with reviewed-sample- and use safe slug characters.");
  if (!item.reviewed || typeof item.reviewed !== "object") errors.push("reviewed measurement payload is required.");
  if (SENSITIVE_PATTERN.test(JSON.stringify(item))) errors.push("fixture contains a blocked sensitive field or label.");
  try {
    Geometry.validateMeasurementPayload(item.reviewed || {}, { forceReviewRequired: true });
  } catch (error) {
    errors.push(error && error.message ? error.message : "reviewed measurement payload is invalid.");
  }
  return errors;
}

function validateFixtures(items) {
  const fixtures = asArray(items);
  const fixtureRows = fixtures.map(function (item) {
    const errors = validateFixtureShape(item);
    return {
      fixture_id: item && item.id || "unknown",
      valid: errors.length === 0,
      errors: errors
    };
  });
  const gate = Gate.buildFloorplanRealSampleIntakeGateReport(fixtures);
  return {
    ok: fixtureRows.every(function (row) { return row.valid; }),
    fixture_count: fixtures.length,
    valid_count: fixtureRows.filter(function (row) { return row.valid; }).length,
    ready_for_real_sample_benchmark_batch: gate.ready_for_real_sample_benchmark_batch,
    coverage_gap_count: gate.coverage_gap_count,
    fixture_rows: fixtureRows,
    required_coverage_rows: gate.required_coverage_rows
  };
}

function main() {
  const fixtureFile = argValue("--fixture-file=", "");
  if (!fixtureFile) {
    console.error("Usage: node internal-qa/scripts/validateFloorplanRealSampleFixture.js --fixture-file=<path>");
    process.exit(1);
  }
  try {
    const report = validateFixtures(loadFixture(fixtureFile));
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(report.ok ? 0 : 1);
  } catch (error) {
    console.error(error && error.message ? error.message : String(error));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  loadFixture: loadFixture,
  validateFixtureShape: validateFixtureShape,
  validateFixtures: validateFixtures
};
