#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const path = require("path");

const PacketWriter = require("./writeFloorplanPhase3ReviewPacket");
const PacketValidator = require("./validateFloorplanPhase3ReviewPacket");
const RealSampleRequest = require("../lib/floorplanRealSampleRequestPacket");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

function runNodeScript(args) {
  const result = childProcess.spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

function prepareHandoff(options) {
  const settings = Object.assign({
    packetDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-phase3-review-packet"),
    requestDir: path.resolve(process.cwd(), "internal-qa", "reports", "floorplan-real-sample-request")
  }, options || {});

  const packet = PacketWriter.writePacket(settings.packetDir);
  const validation = PacketValidator.validatePacket(settings.packetDir);
  const requestRun = runNodeScript([
    path.join(process.cwd(), "internal-qa", "scripts", "reportFloorplanRealSampleRequestPacket.js"),
    "--json",
    "--write-artifacts",
    "--output-dir=" + settings.requestDir
  ]);
  const request = requestRun.ok ? JSON.parse(requestRun.stdout) : RealSampleRequest.buildFloorplanRealSampleRequestPacket();

  return {
    handoff_type: "floorplan_phase3_reviewer_handoff",
    local_only: true,
    customer_visible: false,
    packet_dir: settings.packetDir,
    request_dir: settings.requestDir,
    packet_valid: validation.ok,
    packet_report_count: packet.report_count,
    requested_sample_slots: request.requested_slot_count,
    request_artifacts: request.artifacts || null,
    errors: validation.errors.concat(requestRun.ok ? [] : [requestRun.stderr || requestRun.stdout || "Failed to write request artifacts."]),
    next_step: "Share the generated request Markdown with the internal reviewer, then validate any returned redacted fixture batch before adding samples to the active benchmark corpus."
  };
}

if (require.main === module) {
  const handoff = prepareHandoff({
    packetDir: path.resolve(process.cwd(), argValue("--packet-dir=", path.join("internal-qa", "reports", "floorplan-phase3-review-packet"))),
    requestDir: path.resolve(process.cwd(), argValue("--request-dir=", path.join("internal-qa", "reports", "floorplan-real-sample-request")))
  });
  if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify(handoff, null, 2) + "\n");
  } else {
    console.log("Prepared floorplan Phase 3 reviewer handoff:");
    console.log("- Packet dir: " + handoff.packet_dir);
    console.log("- Request dir: " + handoff.request_dir);
    console.log("- Packet valid: " + (handoff.packet_valid ? "yes" : "no"));
    console.log("- Requested sample slots: " + handoff.requested_sample_slots);
  }
  if (!handoff.packet_valid || handoff.errors.length) process.exit(1);
}

module.exports = {
  prepareHandoff: prepareHandoff
};
