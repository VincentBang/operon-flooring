"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const Validator = require("../../scripts/validateFloorplanPhase3ReviewPacket");

const repoRoot = path.resolve(__dirname, "../../..");
const writerScript = path.join(repoRoot, "internal-qa", "scripts", "writeFloorplanPhase3ReviewPacket.js");
const validatorScript = path.join(repoRoot, "internal-qa", "scripts", "validateFloorplanPhase3ReviewPacket.js");

(function testValidatorAcceptsGeneratedPacket() {
  const packetDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-validate-"));
  const writeRun = childProcess.spawnSync(process.execPath, [
    writerScript,
    "--json",
    "--output-dir=" + packetDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(writeRun.status, 0, writeRun.stderr || writeRun.stdout);

  const result = Validator.validatePacket(packetDir);
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.equal(result.expected_report_count, 9);
  assert.ok(result.report_keys.includes("real-sample-request"));

  const cliRun = childProcess.spawnSync(process.execPath, [
    validatorScript,
    "--json",
    "--packet-dir=" + packetDir
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(cliRun.status, 0, cliRun.stderr || cliRun.stdout);
  const parsed = JSON.parse(cliRun.stdout);
  assert.equal(parsed.ok, true);
})();

(function testValidatorRejectsMissingPacket() {
  const packetDir = fs.mkdtempSync(path.join(os.tmpdir(), "operon-floorplan-phase3-missing-"));
  const result = Validator.validatePacket(packetDir);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(function (error) {
    return error.includes("Missing packet-manifest");
  }));
})();

console.log("floorplanPhase3ReviewPacketValidatorContract.test.js passed");
