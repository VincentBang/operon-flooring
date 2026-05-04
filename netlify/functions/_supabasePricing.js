"use strict";

// Server-side only pricing adapter.
// Current live frontend still uses local JS fallback modules. This helper reads the legacy
// pricing_* tables for private Netlify functions; the 20260502 Supabase migration also
// creates canonical product_ranges/products tables for the future admin data model.
// Keep SUPABASE_SERVICE_ROLE_KEY in Netlify environment variables only. Never expose it
// through HTML, public JavaScript, or browser-readable config.

function jsonResponse(statusCode, payload) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}

function parseNumber(value) {
  if (value === "" || value === null || typeof value === "undefined") {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parsePositiveNumber(value) {
  const parsed = parseNumber(value);
  return parsed > 0 ? parsed : 0;
}

function roundTo(value, places) {
  return Number(Number(value || 0).toFixed(places));
}

function roundToIncrement(value, increment) {
  if (!increment) {
    return value;
  }
  return Math.round(value / increment) * increment;
}

function formatArea(value) {
  return roundTo(value || 0, 1).toFixed(1) + " m²";
}

function normaliseList(value) {
  if (Array.isArray(value)) {
    return value.map(function (item) { return String(item || "").trim(); }).filter(Boolean);
  }
  if (!value) {
    return [];
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(function (item) { return String(item || "").trim(); }).filter(Boolean);
      }
    } catch (error) {
      return value.split("|").map(function (item) { return item.trim(); }).filter(Boolean);
    }
  }
  return [];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || "";
  return { url: url.replace(/\/$/, ""), serviceRoleKey: serviceRoleKey };
}

async function fetchTable(tableName, query) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const url = new URL(config.url + "/rest/v1/" + tableName);
  if (query) {
    Object.keys(query).forEach(function (key) {
      url.searchParams.set(key, query[key]);
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: "Bearer " + config.serviceRoleKey,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Supabase read failed for " + tableName + ": " + text);
  }

  return response.json();
}

async function fetchOptionalTable(tableName, query) {
  try {
    return await fetchTable(tableName, query);
  } catch (error) {
    return [];
  }
}

async function loadPricingLibrary() {
  const [
    categories,
    products,
    installRates,
    underlayOptions,
    trimOptions,
    removalRates,
    locationZones,
    pricingRulesRows,
    stairRates
  ] = await Promise.all([
    fetchTable("pricing_categories", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_products", { select: "*", active: "eq.true", order: "sort_order.asc" }),
    fetchTable("pricing_install_rates", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_underlay_options", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_trim_options", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_removal_rates", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_location_zones", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_rules", { select: "*", order: "rule_key.asc" }),
    fetchOptionalTable("pricing_stair_rates", { select: "*", active: "eq.true", order: "range_id.asc,stair_type.asc" })
  ]);

  const categoryMap = categories.reduce(function (accumulator, category) {
    accumulator[category.id] = {
      id: category.id,
      label: category.label,
      shortDescription: category.short_description || "",
      pricePerM2: parseNumber(category.default_price_per_m2),
      pageUrl: category.page_url || ""
    };
    return accumulator;
  }, {});

  const productList = products.map(function (product) {
    return {
      id: product.id,
      category: product.category_id,
      rangeId: product.range_id || "",
      brand: product.brand,
      range: product.range_name,
      colour: product.colour,
      tone: product.tone || "",
      swatch: product.swatch || "",
      thickness: product.thickness || "",
      productType: product.product_type || "",
      pricePerM2: parseNumber(product.price_per_m2),
      installRate: product.install_rate_override === null ? null : parseNumber(product.install_rate_override),
      imageUrl: product.image_url || "",
      image: product.image_url || "",
      alt: product.alt_text || "",
      description: product.description || "",
      features: normaliseList(product.features),
      suitableFor: normaliseList(product.suitable_for),
      supplier: product.supplier || "",
      supplierUrl: product.supplier_url || "",
      active: product.active !== false
    };
  });

  const productsByCategory = productList.reduce(function (accumulator, product) {
    if (!accumulator[product.category]) {
      accumulator[product.category] = [];
    }
    accumulator[product.category].push(product);
    return accumulator;
  }, {});

  const rules = pricingRulesRows.reduce(function (accumulator, row) {
    if (row.value_type === "number") {
      accumulator[row.rule_key] = parseNumber(row.value_numeric);
    } else if (row.value_type === "boolean") {
      accumulator[row.rule_key] = !!row.value_boolean;
    } else {
      accumulator[row.rule_key] = row.value_text || "";
    }
    return accumulator;
  }, {});

  return {
    categoryMap: categoryMap,
    productList: productList,
    productsByCategory: productsByCategory,
    installRates: installRates,
    underlayOptions: underlayOptions,
    trimOptions: trimOptions,
    removalRates: removalRates,
    locationZones: locationZones,
    stairRates: stairRates,
    rules: rules
  };
}

function normaliseInstallType(installType) {
  const type = String(installType || "standard").trim();
  if (type === "herringbone" || type === "chevron") {
    return "herringbone";
  }
  return "standard";
}

function installTypeMatches(rate, targetType, targetMethod) {
  const rateType = String(rate.install_type || "standard").trim();
  if (normaliseInstallType(rateType) === targetType) {
    return true;
  }
  if (targetType === "standard" && (rateType === "floating" || rateType === "glue_down" || rateType === "direct_glue")) {
    const rateMethod = normaliseInstallMethod(rate.category_id, rateType, rate.install_method || rateType);
    return rateMethod === targetMethod;
  }
  return false;
}

function normaliseInstallMethod(category, installType, installMethod) {
  const targetType = normaliseInstallType(installType);
  if (category !== "engineered") {
    return "floating";
  }
  if (targetType === "herringbone") {
    return "direct_glue";
  }
  return installMethod === "direct_glue" || installMethod === "glue_down" ? "direct_glue" : "floating";
}

function getCategoryMeta(library, category) {
  return clone(library.categoryMap[category] || library.categoryMap.hybrid || {
    id: category || "hybrid",
    label: "Hybrid Flooring",
    shortDescription: "",
    pricePerM2: 0,
    pageUrl: "hybrid-flooring-sydney.html"
  });
}

function getProductById(library, productId) {
  return clone(library.productList.find(function (product) {
    return product.id === productId;
  }) || null);
}

function getEntryLevelProduct(library, category) {
  const products = (library.productsByCategory[category] || []).filter(function (product) {
    return parseNumber(product.pricePerM2) > 0;
  });

  products.sort(function (left, right) {
    const priceDifference = parseNumber(left.pricePerM2) - parseNumber(right.pricePerM2);
    if (priceDifference !== 0) {
      return priceDifference;
    }
    return getProductLabel(left).localeCompare(getProductLabel(right));
  });

  return products.length ? clone(products[0]) : null;
}

function getEstimateProduct(library, category) {
  const meta = getCategoryMeta(library, category);
  const entryLevelProduct = getEntryLevelProduct(library, meta.id);
  const pricePerM2 = entryLevelProduct && entryLevelProduct.pricePerM2 > 0
    ? entryLevelProduct.pricePerM2
    : meta.pricePerM2;
  const pricingMode = entryLevelProduct && entryLevelProduct.pricePerM2 > 0
    ? "category"
    : "fallback";

  return {
    id: meta.id + "-estimate",
    category: meta.id,
    brand: "Operon Estimate",
    range: meta.label,
    colour: "Standard estimate",
    pricePerM2: pricePerM2,
    installRate: null,
    isEstimate: true,
    pricingMode: pricingMode,
    baselineProductId: entryLevelProduct ? entryLevelProduct.id : "",
    baselineProductLabel: entryLevelProduct ? getProductLabel(entryLevelProduct) : ""
  };
}

function getProductLabel(product) {
  if (!product) {
    return "";
  }
  if (product.isEstimate) {
    return (product.range || product.category || "Flooring") + " Estimate";
  }
  if (product.customerLabel) {
    return product.customerLabel;
  }
  if (product.selectionMode === "range_then_colour" || product.category === "engineered") {
    return [product.rangeLabel || product.range || product.brand, product.colour].filter(Boolean).join(" — ");
  }
  return product.rangeLabel || product.range || product.brand || "Flooring product";
}

function getInstallRateConfig(library, input) {
  const category = input.category || "hybrid";
  const installType = normaliseInstallType(input.pattern || "standard");
  const installMethod = normaliseInstallMethod(category, installType, input.installMethod || "floating");
  const jobType = input.jobType || input.quoteMode || "supply_install";
  const exact = library.installRates.find(function (rate) {
    const rateMethod = normaliseInstallMethod(rate.category_id, rate.install_type, rate.install_method);
    return rate.category_id === category
      && installTypeMatches(rate, installType, installMethod)
      && rate.job_type === jobType
      && rateMethod === installMethod;
  });
  if (exact) {
    return exact;
  }
  const legacyMethodless = library.installRates.find(function (rate) {
    return rate.category_id === category
      && installTypeMatches(rate, installType, installMethod)
      && rate.job_type === jobType
      && !rate.install_method;
  });
  if (legacyMethodless) {
    return legacyMethodless;
  }
  return library.installRates.find(function (rate) {
    const rateMethod = normaliseInstallMethod(rate.category_id, rate.install_type, rate.install_method);
    return rate.category_id === category
      && rate.install_type === "standard"
      && rate.job_type === jobType
      && rateMethod === installMethod;
  }) || null;
}

function getAccessState(input) {
  const warnings = [];
  const propertyType = input.propertyType || "";
  const level = input.level || "";
  const hasLift = input.hasLift || "";

  if (propertyType === "house" || propertyType === "townhouse") {
    return { factor: 1.00, warnings: warnings };
  }
  if (hasLift === "yes") {
    return { factor: 1.00, warnings: warnings };
  }
  if (propertyType === "unit_apartment") {
    if (level === "ground") {
      return { factor: 1.00, warnings: warnings };
    }
    if (level === "level_1") {
      return { factor: 1.05, warnings: warnings };
    }
    if (level === "level_2_plus") {
      return { factor: 1.10, warnings: warnings };
    }
  }
  if (propertyType === "commercial_other" || level === "other_unsure") {
    warnings.push("Property access details require confirmation.");
  }
  return { factor: 1.00, warnings: warnings };
}

function matchLocationZone(library, suburb, postcode) {
  const suburbNormalised = String(suburb || "").trim().toLowerCase();
  const postcodeNormalised = String(postcode || "").replace(/\D/g, "");

  const suburbMatch = library.locationZones.find(function (zone) {
    return normaliseList(zone.suburbs).map(function (item) { return item.toLowerCase(); }).indexOf(suburbNormalised) >= 0;
  });
  if (suburbMatch) {
    return suburbMatch;
  }

  const postcodeMatch = library.locationZones.find(function (zone) {
    return normaliseList(zone.postcodes).indexOf(postcodeNormalised) >= 0;
  });
  if (postcodeMatch) {
    return postcodeMatch;
  }

  return library.locationZones.find(function (zone) {
    return zone.fallback;
  }) || null;
}

function getRemovalConfig(library, removalOption) {
  const option = String(removalOption || "").trim().toLowerCase();
  if (!option || option === "none" || option === "other" || option === "unsure") {
    return null;
  }

  return library.removalRates.find(function (row) {
    return [row.floor_type].concat(normaliseList(row.aliases)).map(function (item) {
      return String(item || "").trim().toLowerCase();
    }).indexOf(option) >= 0;
  }) || null;
}

function normaliseRemovalFloorType(value) {
  const floorType = String(value || "").trim().toLowerCase();
  const map = {
    "": "none",
    bare: "none",
    none: "none",
    carpet: "carpet",
    floating: "floating",
    floating_floor: "floating",
    laminate: "floating",
    hybrid: "floating",
    glue_down: "glue_down",
    glued_or_nailed_timber: "glue_down",
    timber: "glue_down",
    tile: "tile",
    tiles: "tile",
    vinyl: "vinyl",
    unsure: "unsure",
    not_sure: "unsure",
    unknown: "unsure",
    other: "other"
  };
  return map[floorType] || "other";
}

function getRemovalFloorLabel(value) {
  const labels = {
    carpet: "Carpet",
    floating: "Floating floor",
    laminate: "Floating floor",
    hybrid: "Floating floor",
    glue_down: "Glue-down timber",
    timber: "Glue-down timber",
    tile: "Tile",
    vinyl: "Vinyl",
    unsure: "Removal",
    other: "Removal"
  };
  return labels[value] || "Existing floor";
}

function getTrimOption(library, type, formValue) {
  return library.trimOptions.find(function (option) {
    return option.type === type && option.form_value === formValue;
  }) || null;
}

function getSelectedUnderlay(library, underlayId) {
  if (!underlayId) {
    return null;
  }
  return library.underlayOptions.find(function (option) {
    return option.id === underlayId;
  }) || null;
}

const STAIR_TYPE_LABELS = {
  straight_tread: "Straight stair treads",
  winder_tread: "Winder / triangular treads",
  landing_1m2: "Landings up to 1 m²",
  landing_2m2: "Landings up to 2 m²",
  one_side_open: "Stairs with one open side",
  two_side_open: "Stairs with two open sides"
};

function normaliseStairDetails(input) {
  const legacyMap = {
    stairStraightTreadCount: "straight_tread",
    stairWinderTreadCount: "winder_tread",
    stairLandingSmallCount: "landing_1m2",
    stairLandingLargeCount: "landing_2m2",
    stairOneSideOpenCount: "one_side_open",
    stairTwoSideOpenCount: "two_side_open"
  };
  const details = Array.isArray(input.stairDetails) ? input.stairDetails : [];
  const normalised = details.map(function (item) {
    const type = legacyMap[item.type] || item.type;
    return {
      type: type,
      label: item.label || STAIR_TYPE_LABELS[type] || type,
      quantity: Math.max(0, Math.round(parsePositiveNumber(item.quantity)))
    };
  }).filter(function (item) {
    return item.type && item.quantity > 0;
  });
  const fallbackCount = Math.max(0, Math.round(parsePositiveNumber(input.stairsCount)));
  if (!normalised.length && input.stairs === "yes" && fallbackCount > 0) {
    normalised.push({
      type: "straight_tread",
      label: STAIR_TYPE_LABELS.straight_tread,
      quantity: fallbackCount
    });
  }
  return normalised;
}

function getStairRateSet(library, rangeId) {
  const rows = Array.isArray(library.stairRates) ? library.stairRates : [];
  const rangeRows = rows.filter(function (row) {
    return row.range_id === rangeId;
  });
  if (!rangeRows.length) {
    return null;
  }
  const first = rangeRows[0];
  return {
    rangeId: rangeId,
    category: first.category || "",
    rangeLabel: first.range_label || "",
    guideWidthMm: parseNumber(first.guide_width_mm || 1200),
    plankLengthMm: parseNumber(first.plank_length_mm),
    priceTiers: rangeRows.reduce(function (accumulator, row) {
      accumulator[row.stair_type] = {
        short: parseNumber(row.price_short || row.price_leq_threshold),
        long: parseNumber(row.price_long || row.price_gt_threshold)
      };
      return accumulator;
    }, {})
  };
}

function getStairPricingState(input, product, library) {
  const details = normaliseStairDetails(input);
  const rangeId = input.selectedRangeId || product.rangeId || "";
  const state = {
    selected: input.stairs === "yes",
    total: 0,
    totalCount: details.reduce(function (total, item) { return total + item.quantity; }, 0),
    details: details,
    widthKnown: input.stairWidthKnown === "yes",
    widthMm: Math.max(0, Math.round(parsePositiveNumber(input.stairWidthMm))),
    widthTier: "short",
    widthAssumed: false,
    guideWidthMm: 1200,
    rangeId: rangeId,
    warnings: [],
    manualReviewRequired: false
  };

  if (input.stairs !== "yes") {
    return state;
  }
  if (!details.length) {
    state.warnings.push("Stairs selected but no stair quantities entered.");
    state.manualReviewRequired = true;
    return state;
  }

  const rateSet = getStairRateSet(library, rangeId);
  if (!rateSet) {
    state.warnings.push("Stair pricing for the selected flooring range requires setup.");
    state.manualReviewRequired = true;
    return state;
  }

  const guideWidthMm = rateSet.category === "engineered" && rateSet.plankLengthMm > 0
    ? Math.round(rateSet.plankLengthMm / 2)
    : parseNumber(rateSet.guideWidthMm || 1200);
  const widthAssumed = !state.widthKnown || !(state.widthMm > 0);
  const tier = widthAssumed || state.widthMm <= guideWidthMm ? "short" : "long";
  const pricedDetails = details.map(function (item) {
    const prices = rateSet.priceTiers[item.type] || {};
    const unitPrice = parseNumber(prices[tier]);
    return Object.assign({}, item, {
      label: STAIR_TYPE_LABELS[item.type] || item.label,
      widthTier: tier,
      unitPrice: unitPrice,
      amount: unitPrice * item.quantity,
      priceConfigured: unitPrice > 0
    });
  });
  const missingPrice = pricedDetails.some(function (item) {
    return item.quantity > 0 && !(item.unitPrice > 0);
  });

  state.details = pricedDetails;
  state.total = pricedDetails.reduce(function (sum, item) { return sum + item.amount; }, 0);
  state.widthTier = tier;
  state.widthAssumed = widthAssumed;
  state.guideWidthMm = guideWidthMm;
  if (widthAssumed) {
    state.warnings.push("Stair width not provided. Lower stair allowance used; final stair price changes if confirmed width is over " + guideWidthMm + " mm.");
    state.manualReviewRequired = true;
  }
  if (missingPrice) {
    state.warnings.push("Stair pricing for the selected flooring range requires setup.");
    state.manualReviewRequired = true;
  }
  return state;
}

function getWarnings(input, measurement, product, pricePending, accessState, installRateMissing, stairPricingState) {
  const warnings = [].concat(measurement.warnings || [], accessState.warnings || []);
  let manualReviewRequired = false;
  const furnitureRoomCount = Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount)));
  const isEngineered = product && product.category === "engineered";

  if (!measurement.realArea) {
    warnings.push("Real flooring area is missing.");
    manualReviewRequired = true;
  }
  if (!input.postcode && !input.suburb) {
    warnings.push("Suburb or postcode is missing. Default Sydney zone used.");
    manualReviewRequired = true;
  }
  if (input.parkingAccess === "limited") {
    warnings.push("Limited parking noted. Labour access adjustment is not separately configured yet.");
  }
  if (input.parkingAccess === "unsure") {
    warnings.push("Parking access is unclear.");
    manualReviewRequired = true;
  }
  if (input.stairs === "yes" && stairPricingState) {
    warnings.push.apply(warnings, stairPricingState.warnings || []);
    if (stairPricingState.manualReviewRequired) {
      manualReviewRequired = true;
    }
  } else if (input.stairs === "yes") {
    warnings.push("Stairs selected. Stair pricing requires review.");
    manualReviewRequired = true;
  }
  if (input.measurementMethod === "floorplan_upload" && input.floorplanFileName && !measurement.realArea) {
    warnings.push("Confirmed floor plan area is still missing.");
    manualReviewRequired = true;
  }
  if (input.removalOption === "other" || input.removalOption === "unsure") {
    warnings.push("Removal type needs manual confirmation.");
    manualReviewRequired = true;
  }
  if (input.removalOption && input.removalOption !== "none" && !input.removalDisposal) {
    warnings.push("Disposal preference is missing for removal.");
    manualReviewRequired = true;
  }
  if (input.floorPrepType === "heavy" || input.floorPrepType === "manual" || input.floorPrepType === "unsure") {
    warnings.push("Floor prep needs site confirmation.");
    manualReviewRequired = true;
  }
  if (input.furnitureType === "yes" && furnitureRoomCount <= 0) {
    warnings.push("Furniture room count is missing. Count each furnished space separately.");
    manualReviewRequired = true;
  }
  if (input.pattern === "herringbone" || input.pattern === "chevron") {
    warnings.push("Pattern wastage is applied at 20%. Confirm install premium if required.");
  }
  if (!isEngineered && (input.pattern === "herringbone" || input.pattern === "chevron")) {
    warnings.push("Herringbone and chevron are only available for engineered timber.");
    manualReviewRequired = true;
  }
  if ((input.pattern === "herringbone" || input.pattern === "chevron") && input.installMethod && input.installMethod !== "direct_glue") {
    warnings.push("Herringbone and chevron are quoted as direct glue installation.");
    manualReviewRequired = true;
  }
  if ((input.jobType || input.quoteMode) === "supply_install" && product && !product.isEstimate && pricePending) {
    warnings.push("Product selected. Product price needs review before final confirmation.");
    manualReviewRequired = true;
  }
  if (installRateMissing) {
    warnings.push("Installation rate requires review.");
    manualReviewRequired = true;
  }

  return {
    manualReviewRequired: manualReviewRequired,
    warnings: Array.from(new Set(warnings))
  };
}

function getSupplyLineContent(result) {
  const categoryLabel = String(result.categoryLabel || "Flooring").toLowerCase();

  if (result.pricingMode === "product") {
    return {
      label: result.productLabel + " supply",
      note: "Based on selected product pricing."
    };
  }

  if (result.pricingMode === "category") {
    return {
      label: "Standard " + categoryLabel + " supply",
      note: "Based on entry-level " + categoryLabel + " product pricing."
    };
  }

  return {
    label: categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1) + " supply",
    note: "Pricing requires review before final confirmation."
  };
}

function buildCustomerLineItems(result) {
  const lines = [];
  if (result.quoteMode === "supply_install") {
    const supplyLine = getSupplyLineContent(result);
    lines.push({
      label: supplyLine.label,
      note: supplyLine.note,
      quantity: formatArea(result.chargeableArea),
      amount: result.materialTotal
    });
  }
  if (result.installationAdjustedTotal > 0) {
    lines.push({
      label: "Installation",
      note: formatArea(result.realArea) + " real install area",
      quantity: formatArea(result.realArea),
      amount: result.installationAdjustedTotal
    });
  }
  if (result.removalTotal > 0) {
    lines.push({ label: result.removalLabel + " removal", note: "Removal only", quantity: formatArea(result.realArea), amount: result.removalTotal });
  }
  if (result.disposalSelected || result.disposalTotal > 0) {
    lines.push({ label: "Disposal / take-away", note: "Selected", quantity: formatArea(result.realArea), amount: result.disposalTotal });
  }
  if (result.floorPrepTotal > 0) {
    lines.push({ label: "Floor preparation", note: result.floorPrepLabel, quantity: formatArea(result.realArea), amount: result.floorPrepTotal });
  }
  if (result.underlayTotal > 0) {
    lines.push({ label: "Underlay", note: result.underlayLabel, quantity: formatArea(result.chargeableArea), amount: result.underlayTotal });
  }
  if (result.moistureBarrierTotal > 0) {
    lines.push({ label: "Moisture protection for concrete floors", note: "Coverage allowance", quantity: formatArea(result.chargeableArea), amount: result.moistureBarrierTotal });
  }
  if (result.skirtingTotal > 0) {
    lines.push({ label: "Skirting package", note: result.skirtingLabel, quantity: formatArea(result.chargeableArea), amount: result.skirtingTotal });
  }
  if (result.scotiaTotal > 0) {
    lines.push({ label: "Edge trim", note: "Allowance", quantity: formatArea(result.chargeableArea), amount: result.scotiaTotal });
  }
  if (result.furnitureTotal > 0) {
    lines.push({ label: "Furniture moving support", note: result.furnitureLabel, quantity: result.furnitureRoomCount + " rooms", amount: result.furnitureTotal });
  }
  if (result.doorTrimmingTotal > 0) {
    lines.push({ label: "Door trimming", note: "Door trimming", quantity: result.doorCount + " doors", amount: result.doorTrimmingTotal });
  }
  if (result.stairsSelected && result.stairsTotal > 0) {
    lines.push({
      label: "Stairs",
      note: result.stairWidthAssumed
        ? "Lower width allowance used until stair width is confirmed"
        : "Stair width tier: " + result.stairWidthTierLabel,
      quantity: result.stairCount + " stair item" + (result.stairCount === 1 ? "" : "s"),
      amount: result.stairsTotal
    });
  }
  return lines;
}

async function calculatePrivateQuote(input) {
  const library = await loadPricingLibrary();
  const rules = Object.assign({
    standardWastagePercent: 10,
    herringboneWastagePercent: 20,
    underlayAreaBasis: "chargeable_area",
    moistureBarrierRatePerM2: 5,
    furnitureRatePerRoom: 50,
    doorTrimmingRate: 40,
    smallJobThresholdM2: 30,
    smallJobFactor: 1.10,
    minimumJobFee: 1500,
    roundingIncrement: 50
  }, library.rules || {});

  const measurement = {
    realArea: parsePositiveNumber(input.realArea),
    roomCount: Math.max(0, Math.round(parsePositiveNumber(input.roomCount))),
    warnings: Array.isArray(input.measurementWarnings) ? input.measurementWarnings.slice() : [],
    sourceLabel: input.measurementSource || "Manual total"
  };

  const quoteMode = input.jobType || input.quoteMode || "supply_install";
  const requestedProduct = input.productId ? getProductById(library, input.productId) : null;
  const product = requestedProduct || getEstimateProduct(library, input.category || "hybrid");
  const categoryEstimate = getEstimateProduct(library, product.category);
  const isEngineered = product.category === "engineered";
  const requestedPattern = input.pattern || "standard";
  const resolvedPattern = isEngineered ? requestedPattern : "standard";
  const requestedInstallMethod = input.installMethod || "floating";
  const resolvedInstallMethod = !isEngineered
    ? "floating"
    : ((resolvedPattern === "herringbone" || resolvedPattern === "chevron") ? "direct_glue" : requestedInstallMethod);
  const normalizedInput = Object.assign({}, input, {
    pattern: resolvedPattern,
    installMethod: resolvedInstallMethod,
    removalOption: normaliseRemovalFloorType(input.removalOption || input.existingFloorToRemove || input.existingFloorType)
  });
  const wastagePercent = (resolvedPattern === "herringbone" || resolvedPattern === "chevron")
    ? parseNumber(rules.herringboneWastagePercent)
    : parseNumber(rules.standardWastagePercent);
  const chargeableArea = measurement.realArea * (1 + (wastagePercent / 100));
  const accessState = getAccessState(input);
  const zone = matchLocationZone(library, input.suburb, input.postcode);
  const locationState = {
    zoneName: zone ? zone.zone_name : "Default Sydney Zone",
    travelFee: zone ? parseNumber(zone.travel_fee) : 0,
    minimumJobFee: zone ? parseNumber(zone.minimum_job_fee) : parseNumber(rules.minimumJobFee),
    surchargePercent: zone ? parseNumber(zone.surcharge_percent) : 0
  };
  const smallJobFactor = measurement.realArea > 0 && measurement.realArea < parseNumber(rules.smallJobThresholdM2)
    ? parseNumber(rules.smallJobFactor)
    : 1;
  const productPricePending = quoteMode === "supply_install" && !product.isEstimate && !(parseNumber(product.pricePerM2) > 0);
  const categoryEstimateMode = categoryEstimate && categoryEstimate.pricingMode === "category" ? "category" : "fallback";
  const pricingMode = quoteMode !== "supply_install"
    ? "category"
    : (productPricePending
      ? "fallback"
      : (!product.isEstimate && parseNumber(product.pricePerM2) > 0
        ? "product"
        : categoryEstimateMode));
  const materialRate = parseNumber(product.pricePerM2) > 0 ? parseNumber(product.pricePerM2) : parseNumber(categoryEstimate.pricePerM2);
  const installRateConfig = getInstallRateConfig(library, {
    category: product.category,
    pattern: resolvedPattern,
    installMethod: resolvedInstallMethod,
    jobType: quoteMode
  });
  const installRateMissing = !installRateConfig && !(parseNumber(product.installRate) > 0);
  const installRate = parseNumber(product.installRate) > 0 ? parseNumber(product.installRate) : parseNumber(installRateConfig && installRateConfig.rate_per_m2);
  const underlay = getSelectedUnderlay(library, input.underlayId);
  const underlayArea = rules.underlayAreaBasis === "real_area" ? measurement.realArea : chargeableArea;
  const underlayTotal = underlay ? underlayArea * parseNumber(underlay.price_per_m2) : 0;
  const removalConfig = getRemovalConfig(library, normalizedInput.removalOption);
  const disposalSelected = !!(removalConfig && input.removalDisposal === "yes");
  const removalBaseTotal = removalConfig
    ? measurement.realArea * parseNumber(removalConfig.rate_per_m2)
    : 0;
  const disposalBaseTotal = disposalSelected
    ? measurement.realArea * parseNumber(removalConfig.disposal_rate_per_m2 || removalConfig.disposal_fee)
    : 0;
  const floorPrepBaseTotal = (input.floorPrepType === "basic" || input.floorPrepType === "levelling")
    ? measurement.realArea * parseNumber((rules.floorPrepRates || {})[input.floorPrepType] || 0)
    : 0;
  const skirting = getTrimOption(library, "skirting", input.skirtingOption);
  const removeRefit = getTrimOption(library, "remove_existing", input.skirtingOption);
  const scotia = getTrimOption(library, "scotia", input.scotiaOption);
  const skirtingBaseTotal = skirting && skirting.pricing_method === "allowance_per_m2"
    ? chargeableArea * parseNumber(skirting.price)
    : (removeRefit && removeRefit.pricing_method === "allowance_per_m2" ? chargeableArea * parseNumber(removeRefit.price) : 0);
  const scotiaBaseTotal = scotia && scotia.pricing_method === "allowance_per_m2"
    ? chargeableArea * parseNumber(scotia.price)
    : 0;
  const furnitureRoomCount = Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount)));
  const furnitureBaseTotal = input.furnitureType === "yes"
    ? furnitureRoomCount * parseNumber(rules.furnitureRatePerRoom)
    : 0;
  const doorCount = input.doorTrimming === "yes" ? Math.max(0, Math.round(parsePositiveNumber(input.doorCount))) : 0;
  const doorTrimmingBaseTotal = doorCount * parseNumber(rules.doorTrimmingRate);
  const stairPricingState = getStairPricingState(normalizedInput, product, library);
  const stairBaseTotal = stairPricingState.total;
  const moistureBarrierTotal = input.moistureBarrier === "yes"
    ? chargeableArea * parseNumber(rules.moistureBarrierRatePerM2)
    : 0;
  const materialTotal = quoteMode === "supply_install" ? chargeableArea * materialRate : 0;
  const installationBaseTotal = measurement.realArea * installRate;

  const labourBaseBeforeZone = installationBaseTotal + removalBaseTotal + disposalBaseTotal + floorPrepBaseTotal + skirtingBaseTotal + scotiaBaseTotal + furnitureBaseTotal + stairBaseTotal;
  const accessAdjustedLabour = labourBaseBeforeZone * accessState.factor * smallJobFactor;
  const zoneSurchargeTotal = accessAdjustedLabour * (parseNumber(locationState.surchargePercent) / 100);
  const labourSubtotalAfterAdjustments = accessAdjustedLabour + zoneSurchargeTotal;
  const labourAdjustmentRatio = labourBaseBeforeZone > 0 ? labourSubtotalAfterAdjustments / labourBaseBeforeZone : 1;

  const installationAdjustedTotal = installationBaseTotal * labourAdjustmentRatio;
  const removalTotal = removalBaseTotal * labourAdjustmentRatio;
  const disposalTotal = disposalBaseTotal * labourAdjustmentRatio;
  const floorPrepTotal = floorPrepBaseTotal * labourAdjustmentRatio;
  const skirtingTotal = skirtingBaseTotal * labourAdjustmentRatio;
  const scotiaTotal = scotiaBaseTotal * labourAdjustmentRatio;
  const furnitureTotal = furnitureBaseTotal * labourAdjustmentRatio;
  const stairsTotal = stairBaseTotal * labourAdjustmentRatio;
  const travelFeeTotal = parseNumber(locationState.travelFee);
  const locationTotal = roundTo(zoneSurchargeTotal + travelFeeTotal, 2);
  const subtotalBeforeMinimum = materialTotal + labourSubtotalAfterAdjustments + underlayTotal + moistureBarrierTotal + doorTrimmingBaseTotal + travelFeeTotal;
  const minimumJobFee = Math.max(parseNumber(locationState.minimumJobFee), parseNumber(installRateConfig && installRateConfig.minimum_charge), parseNumber(rules.minimumJobFee));
  const minimumChargeApplied = subtotalBeforeMinimum > 0 && subtotalBeforeMinimum < minimumJobFee;
  const subtotalWithMinimum = subtotalBeforeMinimum > 0 ? Math.max(subtotalBeforeMinimum, minimumJobFee) : 0;
  const subtotalExGst = subtotalWithMinimum > 0 ? roundToIncrement(subtotalWithMinimum, parseNumber(rules.roundingIncrement) || 50) : 0;
  const roundingAdjustment = subtotalWithMinimum > 0 ? subtotalExGst - subtotalWithMinimum : 0;
  const gst = subtotalExGst * 0.10;
  const totalIncGst = subtotalExGst + gst;
  const reviewState = getWarnings(normalizedInput, measurement, product, productPricePending, accessState, installRateMissing, stairPricingState);

  if (doorCount === 0 && input.doorTrimming === "yes") {
    reviewState.warnings.push("Door trimming selected without quantity.");
    reviewState.manualReviewRequired = true;
  }
  if (minimumChargeApplied) {
    reviewState.warnings.push("Minimum project charge applied.");
  }

  const categoryMeta = getCategoryMeta(library, product.category || input.category || "hybrid");
  const result = {
    quoteMode: quoteMode,
    productId: product.isEstimate ? null : product.id,
    productLabel: getProductLabel(product),
    productCategory: product.category,
    category: product.category,
    categoryLabel: categoryMeta.label,
    categoryEstimateLabel: "standard " + categoryMeta.label.toLowerCase() + " estimate",
    zoneName: locationState.zoneName,
    pattern: resolvedPattern,
    installMethod: resolvedInstallMethod,
    realArea: roundTo(measurement.realArea, 2),
    chargeableArea: roundTo(chargeableArea, 2),
    materialTotal: roundTo(materialTotal, 2),
    installationTotal: roundTo(installationBaseTotal, 2),
    installationAdjustedTotal: roundTo(installationAdjustedTotal, 2),
    removalTotal: roundTo(removalTotal, 2),
    disposalTotal: roundTo(disposalTotal, 2),
    floorPrepTotal: roundTo(floorPrepTotal, 2),
    underlayTotal: roundTo(underlayTotal, 2),
    moistureBarrierTotal: roundTo(moistureBarrierTotal, 2),
    skirtingTotal: roundTo(skirtingTotal, 2),
    scotiaTotal: roundTo(scotiaTotal, 2),
    furnitureTotal: roundTo(furnitureTotal, 2),
    doorTrimmingTotal: roundTo(doorTrimmingBaseTotal, 2),
    stairsTotal: roundTo(stairsTotal, 2),
    travelFeeTotal: roundTo(travelFeeTotal, 2),
    locationTotal: roundTo(locationTotal, 2),
    labourSubtotalBeforeMultipliers: roundTo(labourBaseBeforeZone, 2),
    labourSubtotalAfterMultipliers: roundTo(labourSubtotalAfterAdjustments, 2),
    subtotalExGst: roundTo(subtotalExGst, 2),
    gst: roundTo(gst, 2),
    totalIncGst: roundTo(totalIncGst, 2),
    minimumChargeApplied: minimumChargeApplied,
    minimumJobFee: roundTo(minimumJobFee, 2),
    roundingAdjustment: roundTo(roundingAdjustment, 2),
    accessFactor: roundTo(accessState.factor, 4),
    smallJobFactor: roundTo(smallJobFactor, 4),
    zoneMultiplier: roundTo(1 + (parseNumber(locationState.surchargePercent) / 100), 4),
    locationSurchargePercent: roundTo(locationState.surchargePercent, 2),
    roomCount: measurement.roomCount,
    furnitureRoomCount: furnitureRoomCount,
    doorCount: doorCount,
    stairsSelected: stairPricingState.selected,
    stairCount: stairPricingState.totalCount,
    stairDetails: stairPricingState.details,
    stairWidthKnown: stairPricingState.widthKnown,
    stairWidthMm: stairPricingState.widthMm,
    stairWidthTier: stairPricingState.widthTier,
    stairWidthTierLabel: stairPricingState.widthTier === "long" ? "over " + stairPricingState.guideWidthMm + " mm" : stairPricingState.guideWidthMm + " mm or less",
    stairWidthAssumed: stairPricingState.widthAssumed,
    stairGuideWidthMm: stairPricingState.guideWidthMm,
    stairRangeId: stairPricingState.rangeId,
    removalFloorType: normalizedInput.removalOption || "none",
    removalLabel: getRemovalFloorLabel(normalizedInput.removalOption),
    disposalSelected: disposalSelected,
    disposalLabel: input.removalDisposal === "yes" ? "take away / disposal selected" : "none",
    floorPrepLabel: input.floorPrepType ? String(input.floorPrepType).replace(/_/g, " ") : "none",
    skirtingLabel: input.skirtingOption ? String(input.skirtingOption).replace(/_/g, " ") : "none",
    scotiaLabel: input.scotiaOption ? String(input.scotiaOption).replace(/_/g, " ") : "none",
    furnitureLabel: input.furnitureType === "yes"
      ? "furnished room move" + (furnitureRoomCount > 0 ? " · " + furnitureRoomCount + " rooms" : "")
      : "none",
    underlayLabel: underlay ? underlay.name : "",
    warnings: Array.from(new Set(reviewState.warnings)),
    manualReviewRequired: reviewState.manualReviewRequired,
    pricePending: productPricePending,
    pricingMode: pricingMode,
    pricingSourceProductId: pricingMode === "product"
      ? product.id
      : ((categoryEstimate && categoryEstimate.baselineProductId) || ""),
    pricingSourceProductLabel: pricingMode === "product"
      ? getProductLabel(product)
      : ((categoryEstimate && categoryEstimate.baselineProductLabel) || ""),
    measurementSource: measurement.sourceLabel,
    disclaimer: "Estimate only — final quote confirmed after review and site check."
  };

  result.quoteLines = buildCustomerLineItems(result);
  return result;
}

module.exports = {
  jsonResponse: jsonResponse,
  calculatePrivateQuote: calculatePrivateQuote,
  loadPricingLibrary: loadPricingLibrary
};
