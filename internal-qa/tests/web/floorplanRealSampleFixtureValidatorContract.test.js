"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const template = require("../../templates/floorplanApprovedRealSampleFixtureTemplate");
const Validator = require("../../scripts/validateFloorplanRealSampleFixture");

const repoRoot = path.resolve(__dirname, "../../..");
const validatorScript = path.join(repoRoot, "internal-qa", "scripts", "validateFloorplanRealSampleFixture.js");

(function testValidatorAcceptsTemplateShapeButKeepsBatchGateBlocked() {
  const report = Validator.validateFixtures(template);
  assert.equal(report.ok, true);
  assert.equal(report.fixture_count, 1);
  assert.equal(report.valid_count, 1);
  assert.equal(report.ready_for_real_sample_benchmark_batch, false);
  assert.ok(report.coverage_gap_count >= 1);
  assert.equal(report.fixture_rows[0].fixture_id, template.id);
})();

(function testValidatorRejectsUnsafeFixtureShape() {
  const unsafe = Object.assign({}, template, {
    id: "unsafe",
    file_path: "private/value"
  });
  const errors = Validator.validateFixtureShape(unsafe);
  assert.ok(errors.some(function (error) {
    return error.includes("reviewed-sample");
  }));
  assert.ok(errors.some(function (error) {
    return error.includes("blocked sensitive");
  }));
})();

(function testValidatorCliAcceptsJsAndJson() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-real-sample-validator-"));
  const jsPath = path.join(tempDir, "fixture.js");
  const jsonPath = path.join(tempDir, "fixture.json");
  fs.writeFileSync(jsPath, "module.exports = " + JSON.stringify(template, null, 2) + ";\n");
  fs.writeFileSync(jsonPath, JSON.stringify([template], null, 2) + "\n");

  const jsRun = childProcess.spawnSync(process.execPath, [
    validatorScript,
    "--fixture-file=" + jsPath
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(jsRun.status, 0, jsRun.stderr || jsRun.stdout);
  assert.ok(jsRun.stdout.includes("\"ok\": true"));

  const jsonRun = childProcess.spawnSync(process.execPath, [
    validatorScript,
    "--fixture-file=" + jsonPath
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(jsonRun.status, 0, jsonRun.stderr || jsonRun.stdout);
  assert.ok(jsonRun.stdout.includes("\"fixture_count\": 1"));
})();

(function testValidatorCliRejectsBadPath() {
  const run = childProcess.spawnSync(process.execPath, [
    validatorScript,
    "--fixture-file=/tmp/does-not-exist-operon-floorplan.json"
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.notEqual(run.status, 0);
  assert.ok(run.stderr.includes("does not exist"));
})();

console.log("floorplanRealSampleFixtureValidatorContract.test.js passed");
