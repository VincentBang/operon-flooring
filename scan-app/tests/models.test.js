import assert from "node:assert/strict";
import test from "node:test";
import {
  createRoom,
  createScanReport,
  exportScanReportJSON,
  mockQuoteSystemReadScanReport,
  SCAN_SCHEMA_VERSION
} from "../src/models.js";

test("creates portable scan report JSON", () => {
  const room = createRoom({
    name: "Bedroom",
    points: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 3 },
      { x: 0, y: 3 }
    ]
  });
  const report = createScanReport({
    id: "scan-test",
    createdAt: "2026-01-01T00:00:00.000Z",
    customerReference: "customer-1",
    rooms: [room]
  });

  assert.equal(report.schemaVersion, SCAN_SCHEMA_VERSION);
  assert.equal(report.totals.roomCount, 1);
  assert.equal(report.totals.validRoomCount, 1);
  assert.equal(report.totals.areaSquareMeters, 12);
  assert.equal(report.rooms[0].measurements.perimeterMeters, 14);
});

test("exports JSON that mock quote reader can consume", () => {
  const room = createRoom({
    name: "Living",
    points: [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 4 },
      { x: 0, y: 4 }
    ]
  });
  const json = exportScanReportJSON(createScanReport({ rooms: [room] }));
  const mockResult = mockQuoteSystemReadScanReport(json);

  assert.equal(mockResult.accepted, true);
  assert.equal(mockResult.roomCount, 1);
  assert.equal(mockResult.totalAreaSquareMeters, 20);
  assert.equal(mockResult.roomSummaries[0].name, "Living");
});

test("mock quote reader rejects unsupported schema", () => {
  assert.throws(
    () => mockQuoteSystemReadScanReport({ schemaVersion: "unknown", totals: {}, rooms: [] }),
    /Unsupported scan report schema/
  );
});
