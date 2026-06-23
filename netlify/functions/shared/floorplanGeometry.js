"use strict";

const crypto = require("crypto");

const SECTION_TYPES = new Set(["room", "wet_area", "outdoor", "void", "other"]);
const SELECTION_STATES = new Set(["include", "exclude", "not_sure"]);
const VERSION_SOURCES = new Set(["customer", "reviewer", "system"]);
const CONFIDENCE_LEVELS = new Set(["low", "medium", "high", "unknown"]);
const FORBIDDEN_KEY_PATTERN = /(price|pricing|rate|rates|margin|markup|supplier|cost|service[_-]?role|secret|token|storage[_-]?(bucket|path)|file[_-]?path|signed[_-]?url|ocr|transcript|raw[_-]?text)/i;

function isUuid(value) {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function generateUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return [4, 2, 2, 2, 6].map(function (count) {
    return crypto.randomBytes(count).toString("hex");
  }).join("-");
}

function toSafeText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength || 160);
}

function toNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function roundTo(value, places) {
  const factor = Math.pow(10, places || 2);
  return Math.round((Number(value) || 0) * factor) / factor;
}

function containsForbiddenShape(value) {
  if (Array.isArray(value)) {
    return value.some(containsForbiddenShape);
  }
  if (value && typeof value === "object") {
    return Object.keys(value).some(function (key) {
      return FORBIDDEN_KEY_PATTERN.test(key) || containsForbiddenShape(value[key]);
    });
  }
  return false;
}

function polygonArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - next.x * current.y;
  }
  return Math.abs(area) / 2;
}

function orientation(a, b, c) {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < 1e-10) return 0;
  return value > 0 ? 1 : 2;
}

function segmentsIntersect(a, b, c, d) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  return o1 !== o2 && o3 !== o4;
}

function hasSelfIntersection(points) {
  for (let first = 0; first < points.length; first += 1) {
    const firstNext = (first + 1) % points.length;
    for (let second = first + 1; second < points.length; second += 1) {
      const secondNext = (second + 1) % points.length;
      if (first === second || firstNext === second || secondNext === first) continue;
      if (segmentsIntersect(points[first], points[firstNext], points[second], points[secondNext])) {
        return true;
      }
    }
  }
  return false;
}

function normalizePoint(point, context) {
  const pageWidth = Math.max(1, toNumber(context.pageWidth, 1));
  const pageHeight = Math.max(1, toNumber(context.pageHeight, 1));
  const x = toNumber(point && point.x, NaN);
  const y = toNumber(point && point.y, NaN);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("Section contains invalid coordinates.");
  }
  const coordinateSpace = toSafeText(context.coordinateSpace, 80);
  if (coordinateSpace === "normalized_page" || (x >= 0 && x <= 1 && y >= 0 && y <= 1)) {
    return { x: roundTo(Math.min(Math.max(x, 0), 1), 6), y: roundTo(Math.min(Math.max(y, 0), 1), 6) };
  }
  return {
    x: roundTo(Math.min(Math.max(x / pageWidth, 0), 1), 6),
    y: roundTo(Math.min(Math.max(y / pageHeight, 0), 1), 6)
  };
}

function normalizeSection(section, index, context) {
  const rawPoints = section && (section.points || section.geometry_points || section.geometry && section.geometry.points);
  const sourcePoints = Array.isArray(rawPoints) ? rawPoints : [];
  if (sourcePoints.length < 3) {
    throw new Error("Each floorplan section needs at least three points.");
  }
  if (sourcePoints.length > 200) {
    throw new Error("Floorplan section has too many points.");
  }
  const coordinateSpace = toSafeText(section.coordinate_space || section.coordinateSpace || context.coordinateSpace, 80);
  const points = sourcePoints.map(function (point) {
    return normalizePoint(point, Object.assign({}, context, { coordinateSpace: coordinateSpace }));
  });
  const uniqueCount = new Set(points.map(function (point) {
    return point.x + ":" + point.y;
  })).size;
  if (uniqueCount < 3) {
    throw new Error("Floorplan section has too few unique points.");
  }
  if (hasSelfIntersection(points)) {
    throw new Error("Floorplan section outline intersects itself.");
  }
  const normalizedArea = polygonArea(points);
  if (!(normalizedArea > 0)) {
    throw new Error("Floorplan section area is not valid.");
  }
  const pageWidth = Math.max(1, toNumber(context.pageWidth, 1));
  const pageHeight = Math.max(1, toNumber(context.pageHeight, 1));
  const pixelsPerMetre = Math.max(0, toNumber(context.pixelsPerMetre, 0));
  const areaM2 = pixelsPerMetre > 0
    ? normalizedArea * pageWidth * pageHeight / (pixelsPerMetre * pixelsPerMetre)
    : Math.max(0, toNumber(section.client_area_m2 || section.area_m2 || section.areaM2, 0));
  const selectionState = SELECTION_STATES.has(section.selection_state) ? section.selection_state : section.includeInQuote === false ? "exclude" : "include";
  const sectionType = SECTION_TYPES.has(section.section_type) ? section.section_type : section.type === "wet" ? "wet_area" : section.type === "outdoor" ? "outdoor" : "room";
  const confidence = CONFIDENCE_LEVELS.has(String(section.confidence || "").toLowerCase()) ? String(section.confidence).toLowerCase() : "unknown";

  return {
    client_section_id: toSafeText(section.client_section_id || section.id || "section-" + (index + 1), 80),
    label: toSafeText(section.label || section.name || "Room " + (index + 1), 120),
    section_type: sectionType,
    selection_state: selectionState,
    confidence_level: confidence,
    geometry_json: {
      type: "Polygon",
      coordinate_space: "normalized_page",
      points: points
    },
    area_m2: roundTo(areaM2, 3),
    reviewer_notes: toSafeText(section.reviewer_notes || section.notes, 500) || null,
    metadata: {
      source: toSafeText(section.source, 80) || "floorplan",
      origin: toSafeText(section.origin, 80) || null
    }
  };
}

function validateMeasurementPayload(body, options) {
  const payload = body || {};
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid floorplan measurement payload.");
  }
  if (containsForbiddenShape(payload)) {
    throw new Error("Floorplan measurement payload includes unsupported sensitive fields.");
  }

  const scale = payload.scale || {};
  const context = {
    pageWidth: toNumber(payload.page_width || payload.pageWidth || scale.page_width || scale.pageWidth, 0),
    pageHeight: toNumber(payload.page_height || payload.pageHeight || scale.page_height || scale.pageHeight, 0),
    pixelsPerMetre: toNumber(payload.pixels_per_metre || payload.pixelsPerMetre || scale.pixels_per_metre || scale.pixelsPerMetre, 0),
    coordinateSpace: toSafeText(payload.coordinate_space || payload.coordinateSpace || "normalized_page", 80)
  };
  if (!(context.pageWidth > 0) || !(context.pageHeight > 0)) {
    throw new Error("Floorplan page dimensions are required.");
  }
  const sections = Array.isArray(payload.sections) ? payload.sections : [];
  if (!sections.length) {
    throw new Error("At least one floorplan section is required.");
  }
  if (sections.length > 80) {
    throw new Error("Too many floorplan sections.");
  }
  const normalizedSections = sections.map(function (section, index) {
    return normalizeSection(section, index, context);
  });
  const selectedAreaM2 = roundTo(normalizedSections.reduce(function (sum, section) {
    return section.selection_state === "include" ? sum + section.area_m2 : sum;
  }, 0), 2);
  const measuredAreaM2 = roundTo(normalizedSections.reduce(function (sum, section) {
    return section.selection_state !== "exclude" ? sum + section.area_m2 : sum;
  }, 0), 2);
  const reviewRequired = normalizedSections.some(function (section) {
    return section.selection_state === "not_sure" || section.confidence_level === "low" || section.confidence_level === "unknown";
  });

  return {
    measurement_session_id: isUuid(payload.measurement_session_id) ? payload.measurement_session_id : null,
    idempotency_key_hash: payload.idempotency_key
      ? crypto.createHash("sha256").update(String(payload.idempotency_key).slice(0, 200)).digest("hex")
      : null,
    source: toSafeText(payload.source, 80) || "floorplan_tool",
    measurement_mode: toSafeText(payload.measurement_mode || payload.measurementMode, 80) || "manual_trace",
    version_source: VERSION_SOURCES.has(payload.version_source) ? payload.version_source : "customer",
    uploaded_file_id: isUuid(payload.uploaded_file_id) ? payload.uploaded_file_id : null,
    quote_request_id: isUuid(payload.quote_request_id) ? payload.quote_request_id : null,
    lead_id: isUuid(payload.lead_id) ? payload.lead_id : null,
    page_width: roundTo(context.pageWidth, 2),
    page_height: roundTo(context.pageHeight, 2),
    pixels_per_metre: roundTo(context.pixelsPerMetre, 6),
    selected_area_m2: selectedAreaM2,
    measured_area_m2: measuredAreaM2,
    adjusted_area_m2: selectedAreaM2,
    confidence_level: CONFIDENCE_LEVELS.has(String(payload.confidence_level || payload.confidenceLevel || "").toLowerCase())
      ? String(payload.confidence_level || payload.confidenceLevel).toLowerCase()
      : reviewRequired ? "medium" : "high",
    review_required: reviewRequired || Boolean(options && options.forceReviewRequired),
    sections: normalizedSections,
    metadata: {
      client_selected_area_m2: roundTo(toNumber(payload.client_selected_area_m2 || payload.clientSelectedAreaM2, 0), 2),
      page_key: toSafeText(payload.page_key, 80) || "floorplan",
      user_agent_family: toSafeText(payload.user_agent_family, 80) || null
    }
  };
}

module.exports = {
  CONFIDENCE_LEVELS: CONFIDENCE_LEVELS,
  SECTION_TYPES: SECTION_TYPES,
  SELECTION_STATES: SELECTION_STATES,
  generateUuid: generateUuid,
  isUuid: isUuid,
  roundTo: roundTo,
  toSafeText: toSafeText,
  validateMeasurementPayload: validateMeasurementPayload,
  _test: {
    containsForbiddenShape: containsForbiddenShape,
    hasSelfIntersection: hasSelfIntersection,
    normalizeSection: normalizeSection,
    polygonArea: polygonArea
  }
};
