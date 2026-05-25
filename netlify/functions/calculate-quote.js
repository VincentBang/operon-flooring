"use strict";

const { calculatePrivateQuote } = require("./_supabasePricing");
const Security = require("./_security");

const RESPONSE_OPTIONS = {
  methods: "POST, OPTIONS",
  allowHeaders: "content-type"
};

function parseNumber(value) {
  if (value === "" || value === null || typeof value === "undefined") {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeChoice(value) {
  return String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function normalizeQuoteMode(value) {
  const mode = normalizeChoice(value);
  if (mode === "installation_only" || mode === "install_only") {
    return "install_only";
  }
  return "supply_install";
}

function normalizeCategory(value) {
  const category = normalizeChoice(value);
  if (category === "laminate" || category === "engineered" || category === "hybrid") {
    return category;
  }
  if (category === "engineered_timber") {
    return "engineered";
  }
  return "hybrid";
}

function normalizePropertyType(value) {
  const propertyType = normalizeChoice(value);
  if (propertyType === "apartment" || propertyType === "unit" || propertyType === "unit_apartment") {
    return "unit_apartment";
  }
  if (propertyType === "townhouse" || propertyType === "commercial_other") {
    return propertyType;
  }
  return propertyType || "house";
}

function normalizeArea(payload) {
  const source = payload || {};
  const measurement = source.measurement && typeof source.measurement === "object" ? source.measurement : {};
  const area = parseNumber(source.area || source.realArea || source.totalArea || measurement.area || measurement.realArea);
  return area > 0 ? area : 0;
}

function normalizeScopeChoice(value, fallback) {
  const choice = normalizeChoice(value);
  if (choice === "yes" || choice === "no" || choice === "not_sure" || choice === "unsure") {
    return choice === "unsure" ? "not_sure" : choice;
  }
  return fallback || "not_sure";
}

function normalizeRemovalOption(scope, payload) {
  const removalChoice = normalizeScopeChoice(scope.removal || payload.removal, "no");
  if (removalChoice === "no") return "none";
  if (removalChoice === "not_sure") return "unsure";
  return normalizeChoice(scope.existingFloorType || payload.existingFloorToRemove || payload.existingFloorType || "unsure");
}

function normalizeDisposal(scope, payload) {
  const disposalChoice = normalizeScopeChoice(scope.disposal || payload.disposal, "");
  if (disposalChoice === "yes") return "yes";
  if (disposalChoice === "no") return "no";
  return payload.removalDisposal || "";
}

function normalizeFloorPrep(scope, payload) {
  const floorPrepChoice = normalizeScopeChoice(scope.floorPrep || scope.floorPreparation || payload.floorPrep, "no");
  if (floorPrepChoice === "no") return "none";
  if (floorPrepChoice === "not_sure") return "unsure";
  return normalizeChoice(scope.floorPrepType || payload.floorPrepType || "basic");
}

function normalizePattern(payload) {
  const value = normalizeChoice(payload.pattern || payload.installPattern);
  if (value === "herringbone" || value === "chevron") {
    return value;
  }
  return "standard";
}

function normalizeInstallMethod(payload, category, pattern) {
  const value = normalizeChoice(payload.installMethod || payload.installationMethod);
  if (category !== "engineered") {
    return "floating";
  }
  if (pattern === "herringbone" || pattern === "chevron") {
    return "direct_glue";
  }
  if (value === "direct_glue" || value === "glue_down" || value === "glued_down") {
    return "direct_glue";
  }
  return "floating";
}

function normalizeCalculateQuoteInput(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const scope = source.scope && typeof source.scope === "object" ? source.scope : {};
  const stairs = source.stairs && typeof source.stairs === "object" ? source.stairs : {};
  const extras = source.extras && typeof source.extras === "object" ? source.extras : {};
  const category = normalizeCategory(source.category || source.flooringCategory);
  const pattern = normalizePattern(source);

  return {
    category: category,
    productId: source.selectedProductId || source.productId || "",
    selectedRangeId: source.selectedRangeId || source.rangeId || "",
    quoteMode: normalizeQuoteMode(source.quoteType || source.quoteMode || source.jobType),
    jobType: normalizeQuoteMode(source.quoteType || source.quoteMode || source.jobType),
    realArea: normalizeArea(source),
    roomCount: parseNumber(source.roomCount),
    measurementSource: source.measurementSource || source.areaMethod || "Manual total",
    measurementWarnings: Array.isArray(source.measurementWarnings) ? source.measurementWarnings.slice() : [],
    pattern: pattern,
    installMethod: normalizeInstallMethod(source, category, pattern),
    suburb: source.suburb || "",
    postcode: source.postcode || "",
    propertyType: normalizePropertyType(source.propertyType),
    level: source.level || source.apartmentLevel || "",
    hasLift: source.hasLift || source.lift || "",
    parkingAccess: source.parkingAccess || scope.parkingAccess || "",
    removalOption: normalizeRemovalOption(scope, source),
    removalDisposal: normalizeDisposal(scope, source),
    floorPrepType: normalizeFloorPrep(scope, source),
    underlayId: source.underlayId || extras.underlayId || "",
    skirtingOption: source.skirtingOption || extras.skirtingOption || "",
    scotiaOption: source.scotiaOption || extras.scotiaOption || "",
    moistureBarrier: source.moistureBarrier || extras.moistureBarrier || "",
    furnitureType: source.furnitureType || extras.furniture || "",
    furnitureRoomCount: parseNumber(source.furnitureRoomCount || extras.furnitureRoomCount),
    doorTrimming: source.doorTrimming || extras.doorTrimming || "",
    doorCount: parseNumber(source.doorCount || extras.doorCount),
    stairs: normalizeScopeChoice(stairs.included || scope.stairs || source.stairs, "no"),
    stairsCount: parseNumber(stairs.count || source.stairsCount),
    stairDetails: Array.isArray(stairs.details) ? stairs.details : (Array.isArray(source.stairDetails) ? source.stairDetails : []),
    stairWidthKnown: stairs.widthKnown || source.stairWidthKnown || "",
    stairWidthMm: parseNumber(stairs.widthMm || source.stairWidthMm)
  };
}

function sanitizeLineItem(line) {
  const source = line && typeof line === "object" ? line : {};
  return {
    label: String(source.label || ""),
    qty: String(source.quantity || source.qty || ""),
    total: Number(source.amount || source.total || 0)
  };
}

function buildCustomerNotes(result) {
  const notes = [
    "Estimate only. Final scope is reviewed before a fixed installation price is confirmed."
  ];
  if (result && result.pricingMode === "category") {
    notes.push("Product range or colour can be confirmed before installation.");
  }
  return notes;
}

function buildItemsToConfirm(result, input) {
  const items = new Set(Array.isArray(result && result.warnings) ? result.warnings : []);
  if (!input.realArea) {
    items.add("Flooring area");
  }
  if (input.removalOption === "unsure") {
    items.add("Existing floor removal");
  }
  if (input.floorPrepType === "unsure") {
    items.add("Floor preparation");
  }
  if (input.stairs === "not_sure") {
    items.add("Stairs or step areas");
  }
  if (input.parkingAccess === "unsure") {
    items.add("Parking or access");
  }
  return Array.from(items).filter(Boolean);
}

function deriveEstimateStatus(result, input, itemsToConfirm) {
  const hasEstimate = parseNumber(result && result.totalIncGst) > 0;
  if (!input.realArea || !hasEstimate) {
    return "pending";
  }
  if ((result && (result.manualReviewRequired || result.pricePending)) || itemsToConfirm.length) {
    return "review_needed";
  }
  return "ready";
}

function deriveQuoteConfidence(result, input, itemsToConfirm) {
  if (!input.realArea || !(parseNumber(result && result.totalIncGst) > 0)) {
    return "not_ready";
  }
  if (result && result.pricePending) {
    return "low";
  }
  if (result && result.manualReviewRequired) {
    return "medium";
  }
  if (itemsToConfirm.length) {
    return "medium";
  }
  return "high";
}

function buildSafeResponse(result, input) {
  const lineItems = Array.isArray(result && result.quoteLines)
    ? result.quoteLines.map(sanitizeLineItem)
    : [];
  const quoteLines = lineItems.map(function (line) {
    return {
      label: line.label,
      qty: line.qty,
      quantity: line.qty,
      amount: line.total,
      total: line.total
    };
  });
  const itemsToConfirm = buildItemsToConfirm(result, input);
  const estimateStatus = deriveEstimateStatus(result, input, itemsToConfirm);
  const quoteConfidence = deriveQuoteConfidence(result, input, itemsToConfirm);
  const totalIncGst = Number(result && result.totalIncGst || 0);
  const subtotalExGst = Number(result && result.subtotalExGst || (totalIncGst > 0 ? totalIncGst / 1.1 : 0));
  const gst = Number(result && result.gst || (totalIncGst > 0 ? totalIncGst - subtotalExGst : 0));

  return {
    ok: true,
    source: "server_backend_pricing",
    quoteMode: result && result.quoteMode || input.quoteMode || input.jobType || "supply_install",
    productId: result && result.productId || "",
    productLabel: result && result.productLabel || "Flooring estimate",
    productCategory: result && result.productCategory || input.category || "hybrid",
    category: result && result.category || input.category || "hybrid",
    categoryEstimateLabel: result && result.categoryEstimateLabel || "category estimate",
    zoneName: "Sydney service area",
    pattern: result && result.pattern || input.pattern || "standard",
    installMethod: result && result.installMethod || input.installMethod || "floating",
    realArea: Number(result && result.realArea || input.realArea || 0),
    chargeableArea: Number(result && result.chargeableArea || input.realArea || 0),
    subtotalExGst: subtotalExGst,
    gst: gst,
    totalIncGst: totalIncGst,
    estimateTotal: totalIncGst,
    lineItems: lineItems,
    quoteLines: quoteLines,
    estimateStatus: estimateStatus,
    quoteConfidence: quoteConfidence,
    includedScope: lineItems.map(function (line) { return line.label; }).filter(Boolean),
    customerNotes: buildCustomerNotes(result),
    itemsToConfirm: itemsToConfirm,
    warnings: itemsToConfirm,
    manualReviewRequired: estimateStatus !== "ready",
    pricePending: estimateStatus === "pending",
    pricingMode: result && result.pricingMode || "category",
    measurementSource: result && result.measurementSource || input.measurementSource || "Manual total",
    disclaimer: "Estimate only. Final scope is reviewed before a fixed installation price is confirmed."
  };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, RESPONSE_OPTIONS);
  }

  if (event.httpMethod !== "POST") {
    return Security.jsonResponse(event, 405, { ok: false, error: "Method not allowed." }, RESPONSE_OPTIONS);
  }

  const largeBodyResponse = Security.rejectLargeBody(event, 250 * 1024, RESPONSE_OPTIONS);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "calculate-quote",
    limit: 120,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit, RESPONSE_OPTIONS);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return Security.jsonResponse(event, 400, { ok: false, error: "Invalid JSON payload." }, RESPONSE_OPTIONS);
  }

  try {
    const normalizedInput = normalizeCalculateQuoteInput(payload);
    const result = await calculatePrivateQuote(normalizedInput);
    return Security.jsonResponse(event, 200, buildSafeResponse(result, normalizedInput), RESPONSE_OPTIONS);
  } catch (error) {
    return Security.jsonResponse(event, 500, {
      ok: false,
      status: "unavailable",
      error: "Quote calculation is unavailable."
    }, RESPONSE_OPTIONS);
  }
};

exports._test = {
  buildSafeResponse: buildSafeResponse,
  normalizeCalculateQuoteInput: normalizeCalculateQuoteInput
};
