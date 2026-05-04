import assert from "node:assert/strict";
import test from "node:test";
import {
  createPoint,
  isSimplePolygon,
  polygonArea,
  polygonPerimeter,
  validatePolygon
} from "../src/geometry.js";

test("calculates rectangle area and perimeter", () => {
  const points = [
    createPoint(0, 0),
    createPoint(4, 0),
    createPoint(4, 3),
    createPoint(0, 3)
  ];

  assert.equal(polygonArea(points), 12);
  assert.equal(polygonPerimeter(points), 14);
});

test("validates a simple polygon", () => {
  const result = validatePolygon([
    createPoint(0, 0),
    createPoint(5, 0),
    createPoint(5, 2),
    createPoint(2, 4),
    createPoint(0, 2)
  ]);

  assert.equal(result.isValid, true);
  assert.equal(result.issues.length, 0);
});

test("rejects self crossing polygon", () => {
  const points = [
    createPoint(0, 0),
    createPoint(3, 3),
    createPoint(0, 3),
    createPoint(3, 0)
  ];

  assert.equal(isSimplePolygon(points), false);
  assert.equal(validatePolygon(points).isValid, false);
});

test("rejects polygons with too few points", () => {
  const result = validatePolygon([
    createPoint(0, 0),
    createPoint(2, 0)
  ]);

  assert.equal(result.isValid, false);
  assert.match(result.issues.join(" "), /at least 3 points/);
});
