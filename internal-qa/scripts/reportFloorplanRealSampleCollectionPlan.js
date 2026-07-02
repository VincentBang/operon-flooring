#!/usr/bin/env node
"use strict";

const Plan = require("../lib/floorplanRealSampleCollectionPlan");

const report = Plan.buildFloorplanRealSampleCollectionPlan();

if (process.argv.includes("--json")) {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
} else {
  process.stdout.write(Plan.renderFloorplanRealSampleCollectionPlanMarkdown(report));
}
