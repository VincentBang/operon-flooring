import {
  polygonArea,
  polygonBounds,
  polygonCentroid,
  polygonPerimeter,
  roundNumber,
  sanitizePolygon,
  validatePolygon
} from "./geometry.js";

export const SCAN_SCHEMA_VERSION = "scan-report-v1";

export function createRoom({ id, name, points = [], notes = "" } = {}) {
  return {
    id: id ?? cryptoRandomId("room"),
    name: name?.trim() || "Room",
    notes,
    points: sanitizePolygon(points)
  };
}

export function measureRoom(room) {
  const validation = validatePolygon(room.points);
  const area = polygonArea(validation.points);
  const perimeter = polygonPerimeter(validation.points);
  const bounds = polygonBounds(validation.points);
  const centroid = polygonCentroid(validation.points);
  const confidence = scoreRoomConfidence(validation);

  return {
    id: room.id,
    name: room.name,
    notes: room.notes ?? "",
    points: validation.points.map((point) => ({
      x: roundNumber(point.x),
      y: roundNumber(point.y)
    })),
    measurements: {
      areaSquareMeters: roundNumber(area),
      perimeterMeters: roundNumber(perimeter),
      boundingLengthMeters: roundNumber(Math.max(bounds.width, bounds.height)),
      boundingWidthMeters: roundNumber(Math.min(bounds.width, bounds.height)),
      centroid: {
        x: roundNumber(centroid.x),
        y: roundNumber(centroid.y)
      }
    },
    confidence,
    validation: {
      isValid: validation.isValid,
      issues: validation.issues
    }
  };
}

export function createScanReport({ id, customerReference = "", rooms = [], createdAt = new Date() } = {}) {
  const measuredRooms = rooms.map(measureRoom);
  const totals = measuredRooms.reduce(
    (accumulator, room) => ({
      areaSquareMeters: accumulator.areaSquareMeters + room.measurements.areaSquareMeters,
      perimeterMeters: accumulator.perimeterMeters + room.measurements.perimeterMeters
    }),
    { areaSquareMeters: 0, perimeterMeters: 0 }
  );

  return {
    schemaVersion: SCAN_SCHEMA_VERSION,
    id: id ?? cryptoRandomId("scan"),
    createdAt: new Date(createdAt).toISOString(),
    customerReference,
    source: {
      app: "operon-floor-scan-app",
      mode: "manual-polygon",
      phase: "phase-1"
    },
    totals: {
      roomCount: measuredRooms.length,
      validRoomCount: measuredRooms.filter((room) => room.validation.isValid).length,
      areaSquareMeters: roundNumber(totals.areaSquareMeters),
      perimeterMeters: roundNumber(totals.perimeterMeters)
    },
    rooms: measuredRooms
  };
}

export function exportScanReportJSON(report) {
  return JSON.stringify(report, null, 2);
}

export function mockQuoteSystemReadScanReport(json) {
  const report = typeof json === "string" ? JSON.parse(json) : json;

  if (report.schemaVersion !== SCAN_SCHEMA_VERSION) {
    throw new Error("Unsupported scan report schema.");
  }

  return {
    accepted: true,
    schemaVersion: report.schemaVersion,
    roomCount: report.totals.roomCount,
    validRoomCount: report.totals.validRoomCount,
    totalAreaSquareMeters: report.totals.areaSquareMeters,
    roomSummaries: report.rooms.map((room) => ({
      id: room.id,
      name: room.name,
      areaSquareMeters: room.measurements.areaSquareMeters,
      confidenceLevel: room.confidence.level
    }))
  };
}

function scoreRoomConfidence(validation) {
  if (!validation.isValid) {
    return {
      score: 0,
      level: "low",
      reasons: validation.issues
    };
  }

  const pointScore = Math.min(validation.points.length / 4, 1);
  const areaScore = Math.min(validation.area / 8, 1);
  const shapeScore = validation.bounds.width > 0 && validation.bounds.height > 0 ? 1 : 0.4;
  const score = roundNumber((pointScore * 0.35) + (areaScore * 0.35) + (shapeScore * 0.3), 2);

  let level = "low";
  if (score >= 0.8) {
    level = "high";
  } else if (score >= 0.55) {
    level = "medium";
  }

  return {
    score,
    level,
    reasons: [`${validation.points.length} points`, `${roundNumber(validation.area, 2)} m2 area`]
  };
}

function cryptoRandomId(prefix) {
  const fallback = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const randomValue = globalThis.crypto?.randomUUID?.() ?? fallback;
  return `${prefix}-${randomValue}`;
}
