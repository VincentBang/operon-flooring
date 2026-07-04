#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const RequestPacket = require("../lib/floorplanRealSampleRequestPacket");

function argValue(prefix, fallback) {
  const match = process.argv.find(function (arg) {
    return arg.indexOf(prefix) === 0;
  });
  return match ? match.slice(prefix.length) : fallback;
}

function writeArtifacts(packet, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, "floorplan-real-sample-request-packet.json");
  const markdownPath = path.join(outputDir, "floorplan-real-sample-request-packet.md");
  fs.writeFileSync(jsonPath, JSON.stringify(packet, null, 2) + "\n");
  fs.writeFileSync(markdownPath, RequestPacket.renderFloorplanRealSampleRequestPacketMarkdown(packet));
  return {
    json_path: jsonPath,
    markdown_path: markdownPath
  };
}

const packet = RequestPacket.buildFloorplanRealSampleRequestPacket();
const outputDir = path.resolve(process.cwd(), argValue("--output-dir=", path.join("internal-qa", "reports", "floorplan-real-sample-request")));

if (process.argv.includes("--write-artifacts")) {
  packet.artifacts = writeArtifacts(packet, outputDir);
}

if (process.argv.includes("--json")) {
  process.stdout.write(JSON.stringify(packet, null, 2) + "\n");
} else {
  process.stdout.write(RequestPacket.renderFloorplanRealSampleRequestPacketMarkdown(packet));
}
