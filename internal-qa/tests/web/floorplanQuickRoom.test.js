"use strict";

const assert = require("assert");
const quickRoom = require("../../../apps/web/floorplanQuickRoom");

function makeMask(width, height) {
  return new Uint8Array(width * height);
}

function wall(mask, width, x, y) {
  mask[(y * width) + x] = 1;
}

function drawRect(mask, width, x1, y1, x2, y2) {
  for (let x = x1; x <= x2; x += 1) {
    wall(mask, width, x, y1);
    wall(mask, width, x, y2);
  }
  for (let y = y1; y <= y2; y += 1) {
    wall(mask, width, x1, y);
    wall(mask, width, x2, y);
  }
}

function drawVertical(mask, width, x, y1, y2, gapY) {
  for (let y = y1; y <= y2; y += 1) {
    if (y !== gapY) {
      wall(mask, width, x, y);
    }
  }
}

function detect(mask, width, height, point, options) {
  return quickRoom.detectRoomFromMask(mask, width, height, point, Object.assign({
    pixelsPerMetre: 10,
    closeRadius: 1
  }, options || {}));
}

function detectAll(mask, width, height, options) {
  return quickRoom.detectAllRoomCandidatesFromMask(mask, width, height, Object.assign({
    pixelsPerMetre: 10,
    closeRadius: 1,
    minAreaM2: 1,
    minRegionPixels: 20,
    maxCandidates: 20
  }, options || {}));
}

function assertWithinPercent(actual, expected, percent, label) {
  const tolerance = Math.abs(expected) * (percent / 100);
  assert(
    Math.abs(actual - expected) <= tolerance,
    label + " expected " + expected + " but received " + actual
  );
}

function metricPoint(xMetres, yMetres, pixelsPerMetre) {
  return {
    x: xMetres * pixelsPerMetre,
    y: yMetres * pixelsPerMetre
  };
}

function rotatePoints(points, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return points.map(function (point) {
    return {
      x: (point.x * cos) - (point.y * sin),
      y: (point.x * sin) + (point.y * cos)
    };
  });
}

{
  const width = 30;
  const height = 24;
  const mask = makeMask(width, height);
  drawRect(mask, width, 5, 4, 22, 18);
  const result = detect(mask, width, height, { x: 12, y: 10 });
  assert.strictEqual(result.confidence, "High");
  assert(result.areaM2 > 1, "closed rectangle should produce area");
  assert.deepStrictEqual(result.polygon.length, 4);
}

{
  const width = 42;
  const height = 24;
  const mask = makeMask(width, height);
  drawRect(mask, width, 3, 3, 38, 20);
  drawVertical(mask, width, 20, 3, 20);
  const left = detect(mask, width, height, { x: 10, y: 10 });
  const right = detect(mask, width, height, { x: 30, y: 10 });
  assert(left.region.bounds.maxX < 20, "left room should stop at dividing wall");
  assert(right.region.bounds.minX > 20, "right room should stop at dividing wall");
}

{
  const width = 42;
  const height = 24;
  const mask = makeMask(width, height);
  drawRect(mask, width, 3, 3, 38, 20);
  drawVertical(mask, width, 20, 3, 20, 11);
  const result = detect(mask, width, height, { x: 10, y: 10 }, { closeRadius: 1 });
  assert(result.region.bounds.maxX < 22, "small wall gap should close enough to avoid leaking into adjacent room");
}

{
  const width = 30;
  const height = 24;
  const mask = makeMask(width, height);
  drawRect(mask, width, 8, 5, 22, 18);
  for (let y = 10; y <= 14; y += 1) {
    mask[(y * width) + 8] = 0;
  }
  const result = detect(mask, width, height, { x: 2, y: 2 });
  assert.strictEqual(result.confidence, "Low");
  assert(result.confidenceReasons.join(" ").includes("edge"));
}

{
  const width = 30;
  const height = 24;
  const mask = makeMask(width, height);
  drawRect(mask, width, 10, 10, 12, 12);
  const result = detect(mask, width, height, { x: 11, y: 11 });
  assert.strictEqual(result.confidence, "Low");
  assert(/small|wall|noise/i.test(result.confidenceReasons.join(" ")));
}

{
  const width = 80;
  const height = 70;
  const mask = makeMask(width, height);
  drawRect(mask, width, 2, 2, 77, 67);
  const result = detect(mask, width, height, { x: 40, y: 35 });
  assert.strictEqual(result.confidence, "Low");
  assert(result.confidenceReasons.join(" ").includes("150") || result.confidenceReasons.join(" ").includes("large"));
}

assert.strictEqual(quickRoom.distanceBetweenPoints({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
assert.strictEqual(quickRoom.convertPixelAreaToSquareMeters(400, 10), 4);
assertWithinPercent(quickRoom.calculatePixelsPerMetre(440, 4.4), 100, 0.01, "scale factor calculation");
assert.strictEqual(quickRoom.polygonArea([
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 8 },
  { x: 0, y: 8 }
]), 80);
assert.strictEqual(quickRoom.getCustomerConfidenceLabel("High"), "Looks clean");
assert.strictEqual(quickRoom.getCustomerConfidenceLabel("Medium"), "Review suggested boundary");
assert.strictEqual(quickRoom.getCustomerConfidenceLabel("Low"), "Manual trace recommended");
assert.strictEqual(quickRoom.aggregateIncludedArea([
  { areaM2: 10, included: true },
  { areaM2: 4.25, includeInQuote: true },
  { areaM2: 3, included: false },
  { areaM2: 5, includeInQuote: false }
]), 14.25);

{
  const quality = quickRoom.assessScaleQuality(120, 1.5);
  assert.strictEqual(quality.status, "verification_recommended");
  assert(quality.warnings.some((warning) => warning.includes("Short calibration distances can reduce accuracy")));
}

{
  const pixelsPerMetre = 10;
  const areaPx = quickRoom.polygonArea([
    metricPoint(0, 0, pixelsPerMetre),
    metricPoint(5, 0, pixelsPerMetre),
    metricPoint(5, 4, pixelsPerMetre),
    metricPoint(0, 4, pixelsPerMetre)
  ]);
  assertWithinPercent(quickRoom.convertPixelAreaToSquareMeters(areaPx, pixelsPerMetre), 20, 1, "5 m x 4 m rectangle");
}

{
  const pixelsPerMetre = 10;
  const areaPx = quickRoom.polygonArea([
    metricPoint(0, 0, pixelsPerMetre),
    metricPoint(8, 0, pixelsPerMetre),
    metricPoint(8, 3, pixelsPerMetre),
    metricPoint(0, 3, pixelsPerMetre)
  ]);
  assertWithinPercent(quickRoom.convertPixelAreaToSquareMeters(areaPx, pixelsPerMetre), 24, 1, "8 m x 3 m rectangle");
}

{
  const pixelsPerMetre = 10;
  const areaPx = quickRoom.polygonArea([
    metricPoint(0, 0, pixelsPerMetre),
    metricPoint(5, 0, pixelsPerMetre),
    metricPoint(5, 3, pixelsPerMetre),
    metricPoint(3, 3, pixelsPerMetre),
    metricPoint(3, 4, pixelsPerMetre),
    metricPoint(0, 4, pixelsPerMetre)
  ]);
  assertWithinPercent(quickRoom.convertPixelAreaToSquareMeters(areaPx, pixelsPerMetre), 18, 2, "L-shape area");
}

{
  assertWithinPercent(quickRoom.aggregateIncludedArea([
    { areaM2: 12, included: true },
    { areaM2: 9, included: true },
    { areaM2: 6, includeInQuote: false }
  ]), 21, 2, "two-room aggregation");
}

{
  const pixelsPerMetre = 10;
  const base = [
    metricPoint(0, 0, pixelsPerMetre),
    metricPoint(6, 0, pixelsPerMetre),
    metricPoint(6, 2, pixelsPerMetre),
    metricPoint(0, 2, pixelsPerMetre)
  ];
  const areaPx = quickRoom.polygonArea(rotatePoints(base, Math.PI / 7));
  assertWithinPercent(quickRoom.convertPixelAreaToSquareMeters(areaPx, pixelsPerMetre), 12, 2, "rotated rectangle");
}

{
  const confidence = quickRoom.classifyRegionConfidence({
    rejected: false,
    pixelCount: 1200,
    bounds: { minX: 0, minY: 0, maxX: 100, maxY: 12 },
    touchesEdge: false
  }, {
    width: 140,
    height: 40,
    areaM2: 12,
    scaleSet: true
  });
  assert.strictEqual(confidence.level, "Medium", "long hallway should be reviewable, not automatic final area");
}

{
  const width = 80;
  const height = 50;
  const mask = makeMask(width, height);
  drawRect(mask, width, 5, 5, 25, 25);
  drawRect(mask, width, 30, 5, 55, 25);
  drawRect(mask, width, 5, 30, 55, 44);
  const candidates = detectAll(mask, width, height);
  assert(candidates.length >= 3, "multiple rectangular rooms should generate candidate zones");
  assert(candidates.every((candidate) => candidate.label === "Unknown"));
  assert(candidates.every((candidate) => candidate.editable === true));
  assert(candidates.every((candidate) => candidate.source === "suggest_all"));
}

{
  const width = 90;
  const height = 50;
  const mask = makeMask(width, height);
  drawRect(mask, width, 4, 5, 82, 42);
  drawVertical(mask, width, 45, 5, 42);
  const candidates = detectAll(mask, width, height);
  assert.strictEqual(candidates.length, 2, "open-plan side split by a clear wall should produce two areas");
}

{
  const width = 80;
  const height = 55;
  const mask = makeMask(width, height);
  drawRect(mask, width, 8, 8, 65, 46);
  drawRect(mask, width, 10, 20, 63, 30);
  const candidates = detectAll(mask, width, height);
  assert(candidates.some((candidate) => candidate.confidence === "Medium" || candidate.confidence === "High"), "hallway-like regions should remain reviewable candidates");
}

{
  const width = 80;
  const height = 50;
  const mask = makeMask(width, height);
  drawRect(mask, width, 5, 5, 35, 30);
  drawRect(mask, width, 40, 5, 72, 30);
  drawVertical(mask, width, 38, 5, 30, 16);
  const candidates = detectAll(mask, width, height, { closeRadius: 1 });
  assert(candidates.length >= 2, "small door gaps should not merge all rooms");
}

{
  const width = 80;
  const height = 50;
  const mask = makeMask(width, height);
  drawRect(mask, width, 6, 6, 45, 35);
  drawRect(mask, width, 50, 8, 54, 12);
  drawRect(mask, width, 58, 8, 61, 11);
  const candidates = detectAll(mask, width, height);
  assert.strictEqual(candidates.length, 1, "tiny text or furniture-like regions should be filtered");
}

{
  const width = 80;
  const height = 50;
  const mask = makeMask(width, height);
  drawRect(mask, width, 8, 8, 30, 30);
  for (let x = 8; x <= 30; x += 1) {
    mask[(8 * width) + x] = 0;
  }
  const result = detect(mask, width, height, { x: 18, y: 18 });
  assert.strictEqual(result.confidence, "Low", "open-plan leak to page edge should be low confidence");
  assert(result.confidenceReasons.join(" ").includes("edge"));
}

{
  const width = 120;
  const height = 90;
  const mask = makeMask(width, height);
  drawRect(mask, width, 8, 8, 58, 58);
  drawRect(mask, width, 66, 10, 112, 72);
  const candidates = detectAll(mask, width, height, { pixelsPerMetre: 20 });
  assert(candidates.length >= 2, "scaled plans should still generate candidates");
  assert(candidates.every((candidate) => candidate.areaM2 > 1), "scaled candidates should use the provided pixel scale");
}

console.log("floorplanQuickRoom.test.js passed");
