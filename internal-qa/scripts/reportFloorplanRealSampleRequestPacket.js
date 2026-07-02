#!/usr/bin/env node
"use strict";

const RequestPacket = require("../lib/floorplanRealSampleRequestPacket");

const packet = RequestPacket.buildFloorplanRealSampleRequestPacket();

if (process.argv.includes("--json")) {
  process.stdout.write(JSON.stringify(packet, null, 2) + "\n");
} else {
  process.stdout.write(RequestPacket.renderFloorplanRealSampleRequestPacketMarkdown(packet));
}
