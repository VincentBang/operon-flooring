"use strict";

const assert = require("assert");
const floorplan = require("../../../apps/web/floorplanQuickRoom.js");

function approx(actual, expected, tolerancePercent, message) {
  const tolerance = Math.abs(expected) * (tolerancePercent / 100);
  assert(
    Math.abs(actual - expected) <= tolerance,
    message + " expected " + expected + ", got " + actual
  );
}

function areaFor(points, pixelsPerMetre) {
  return floorplan.convertPixelAreaToSquareMeters(
    floorplan.polygonArea(points),
    pixelsPerMetre
  );
}

function scalePoints(points, factor) {
  return points.map(function (point) {
    return { x: point.x * factor, y: point.y * factor };
  });
}

function rotatePoints(points, angleRadians) {
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);
  return points.map(function (point) {
    return {
      x: (point.x * cos) - (point.y * sin),
      y: (point.x * sin) + (point.y * cos)
    };
  });
}

const pxPerMetre = floorplan.calculatePixelsPerMetre(100, 1);

approx(
  areaFor([
    { x: 0, y: 0 },
    { x: 500, y: 0 },
    { x: 500, y: 400 },
    { x: 0, y: 400 }
  ], pxPerMetre),
  20,
  1,
  "5m x 4m rectangle should calculate at 20m2"
);

approx(
  areaFor([
    { x: 0, y: 0 },
    { x: 800, y: 0 },
    { x: 800, y: 300 },
    { x: 0, y: 300 }
  ], pxPerMetre),
  24,
  1,
  "8m x 3m rectangle should calculate at 24m2"
);

approx(
  areaFor([
    { x: 0, y: 0 },
    { x: 500, y: 0 },
    { x: 500, y: 300 },
    { x: 300, y: 300 },
    { x: 300, y: 400 },
    { x: 0, y: 400 }
  ], pxPerMetre),
  18,
  2,
  "L-shape should calculate at 18m2"
);

const twoRooms = [
  { areaM2: areaFor([{ x: 0, y: 0 }, { x: 400, y: 0 }, { x: 400, y: 300 }, { x: 0, y: 300 }], pxPerMetre), includeInQuote: true },
  { areaM2: areaFor([{ x: 0, y: 0 }, { x: 300, y: 0 }, { x: 300, y: 300 }, { x: 0, y: 300 }], pxPerMetre), includeInQuote: true }
];

approx(floorplan.aggregateIncludedArea(twoRooms), 21, 2, "Two included rooms should total 21m2");
assert.strictEqual(
  floorplan.aggregateIncludedArea(twoRooms.map(function (room, index) {
    return Object.assign({}, room, { includeInQuote: index === 0 });
  })),
  12,
  "Excluded rooms should not count toward handoff area"
);

const rotatedRectangle = rotatePoints([
  { x: 0, y: 0 },
  { x: 500, y: 0 },
  { x: 500, y: 400 },
  { x: 0, y: 400 }
], Math.PI / 7);
approx(areaFor(rotatedRectangle, pxPerMetre), 20, 2, "Rotated rectangle should keep the same area");

const doubledViewportRectangle = scalePoints([
  { x: 0, y: 0 },
  { x: 500, y: 0 },
  { x: 500, y: 400 },
  { x: 0, y: 400 }
], 2);
approx(areaFor(doubledViewportRectangle, pxPerMetre * 2), 20, 2, "Viewport scaling should not change measured area after calibration");

const closedByStartShape = [
  { x: 0, y: 0 },
  { x: 500, y: 0 },
  { x: 500, y: 400 },
  { x: 0, y: 400 },
  { x: 0, y: 0 }
];
approx(areaFor(closedByStartShape, pxPerMetre), 20, 1, "Duplicate closing point should not change polygon area");

const shortScale = floorplan.assessScaleQuality(120, 1.5);
assert(shortScale.warnings.includes("Use a longer known wall where possible. Short calibration distances can reduce accuracy."));

const closePixels = floorplan.assessScaleQuality(40, 4);
assert(closePixels.warnings.includes("Calibration points are too close. Choose a longer wall or larger dimension."));

console.log("floorplan measurement tests passed");
