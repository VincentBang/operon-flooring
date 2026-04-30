"use strict";

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

async function loadPricingLibrary() {
  const [
    categories,
    products,
    installRates,
    underlayOptions,
    trimOptions,
    removalRates,
    locationZones,
    pricingRulesRows
  ] = await Promise.all([
    fetchTable("pricing_categories", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_products", { select: "*", active: "eq.true", order: "sort_order.asc" }),
    fetchTable("pricing_install_rates", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_underlay_options", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_trim_options", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_removal_rates", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_location_zones", { select: "*", active: "eq.true", order: "id.asc" }),
    fetchTable("pricing_rules", { select: "*", order: "rule_key.asc" })
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
    rules: rules
  };
}

function normaliseInstallType(installType) {
  return installType === "herringbone" || installType === "chevron" ? "herringbone" : "standard";
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

function getEstimateProduct(library, category) {
  const meta = getCategoryMeta(library, category);

  return {
    id: meta.id + "-estimate",
    category: meta.id,
    brand: "Operon Estimate",
    range: meta.label,
    colour: "Standard estimate",
    pricePerM2: meta.pricePerM2,
    installRate: null,
    isEstimate: true
  };
}

function getProductLabel(product) {
  if (!product) {
    return "";
  }
  if (product.isEstimate) {
    return (product.range || product.category || "Flooring") + " Estimate";
  }
  return [product.brand, product.range, product.colour].filter(Boolean).join(" / ");
}

function getInstallRateConfig(library, input) {
  const category = input.category || "hybrid";
  const installType = normaliseInstallType(input.pattern || "standard");
  const jobType = input.jobType || input.quoteMode || "supply_install";
  const exact = library.installRates.find(function (rate) {
    return rate.category_id === category && rate.install_type === installType && rate.job_type === jobType;
  });
  if (exact) {
    return exact;
  }
  return library.installRates.find(function (rate) {
    return rate.category_id === category && rate.install_type === "standard" && rate.job_type === jobType;
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

function getWarnings(input, measurement, product, pricePending, accessState) {
  const warnings = [].concat(measurement.warnings || [], accessState.warnings || []);
  let manualReviewRequired = false;

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
  if (input.stairs === "yes") {
    warnings.push("Stairs selected. Manual review required.");
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
  if (input.floorPrepType === "heavy" || input.floorPrepType === "manual" || input.floorPrepType === "unsure") {
    warnings.push("Floor prep needs site confirmation.");
    manualReviewRequired = true;
  }
  if (input.furnitureType === "heavy") {
    warnings.push("Heavy furniture handling needs manual review.");
    manualReviewRequired = true;
  }
  if ((input.furnitureType === "light" || input.furnitureType === "heavy") && measurement.roomCount <= 0) {
    warnings.push("Room count is missing for furniture handling.");
    manualReviewRequired = true;
  }
  if (input.pattern === "herringbone" || input.pattern === "chevron") {
    warnings.push("Pattern wastage is applied at 20%. Confirm install premium if required.");
  }
  if ((input.jobType || input.quoteMode) === "supply_install" && product && !product.isEstimate && pricePending) {
    warnings.push("Selected product price is not confirmed. Standard " + product.category + " estimate used until review.");
    manualReviewRequired = true;
  }

  return {
    manualReviewRequired: manualReviewRequired,
    warnings: Array.from(new Set(warnings))
  };
}

function buildCustomerLineItems(result) {
  const lines = [];
  if (result.quoteMode === "supply_install") {
    lines.push({
      label: "Flooring package",
      note: result.pricePending
        ? result.productLabel + " · " + result.categoryEstimateLabel + " used until the exact product price is confirmed"
        : result.productLabel + " · " + formatArea(result.chargeableArea) + " material allowance",
      amount: result.materialTotal + result.installationAdjustedTotal
    });
  } else if (result.installationAdjustedTotal > 0) {
    lines.push({
      label: "Installation labour",
      note: formatArea(result.realArea) + " real install area",
      amount: result.installationAdjustedTotal
    });
  }
  if (result.removalTotal > 0) {
    lines.push({ label: "Removal", note: result.removalLabel, amount: result.removalTotal });
  }
  if (result.floorPrepTotal > 0) {
    lines.push({ label: "Floor preparation", note: result.floorPrepLabel, amount: result.floorPrepTotal });
  }
  if (result.underlayTotal > 0) {
    lines.push({ label: "Underlay", note: result.underlayLabel, amount: result.underlayTotal });
  }
  if (result.moistureBarrierTotal > 0) {
    lines.push({ label: "Moisture barrier", note: formatArea(result.chargeableArea) + " coverage allowance", amount: result.moistureBarrierTotal });
  }
  if (result.skirtingTotal > 0) {
    lines.push({ label: "Skirting package", note: result.skirtingLabel, amount: result.skirtingTotal });
  }
  if (result.scotiaTotal > 0) {
    lines.push({ label: "Scotia package", note: formatArea(result.chargeableArea) + " commercial allowance", amount: result.scotiaTotal });
  }
  if (result.furnitureTotal > 0) {
    lines.push({ label: "Furniture handling", note: result.furnitureLabel, amount: result.furnitureTotal });
  }
  if (result.doorTrimmingTotal > 0) {
    lines.push({ label: "Door trimming", note: result.doorCount + " doors", amount: result.doorTrimmingTotal });
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
  const wastagePercent = (input.pattern === "herringbone" || input.pattern === "chevron")
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
  const materialRate = parseNumber(product.pricePerM2) > 0 ? parseNumber(product.pricePerM2) : parseNumber(categoryEstimate.pricePerM2);
  const installRateConfig = getInstallRateConfig(library, {
    category: product.category,
    pattern: input.pattern,
    jobType: quoteMode
  }) || {};
  const installRate = parseNumber(product.installRate) > 0 ? parseNumber(product.installRate) : parseNumber(installRateConfig.rate_per_m2);
  const underlay = getSelectedUnderlay(library, input.underlayId);
  const underlayArea = rules.underlayAreaBasis === "real_area" ? measurement.realArea : chargeableArea;
  const underlayTotal = underlay ? underlayArea * parseNumber(underlay.price_per_m2) : 0;
  const removalConfig = getRemovalConfig(library, input.removalOption);
  const removalBaseTotal = removalConfig
    ? (measurement.realArea * parseNumber(removalConfig.rate_per_m2)) + parseNumber(removalConfig.disposal_fee)
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
  const furnitureBaseTotal = (input.furnitureType === "light" || input.furnitureType === "heavy")
    ? measurement.roomCount * parseNumber(rules.furnitureRatePerRoom)
    : 0;
  const doorCount = input.doorTrimming === "yes" ? Math.max(0, Math.round(parsePositiveNumber(input.doorCount))) : 0;
  const doorTrimmingBaseTotal = doorCount * parseNumber(rules.doorTrimmingRate);
  const moistureBarrierTotal = input.moistureBarrier === "yes"
    ? chargeableArea * parseNumber(rules.moistureBarrierRatePerM2)
    : 0;
  const materialTotal = quoteMode === "supply_install" ? chargeableArea * materialRate : 0;
  const installationBaseTotal = measurement.realArea * installRate;

  const labourBaseBeforeZone = installationBaseTotal + removalBaseTotal + floorPrepBaseTotal + skirtingBaseTotal + scotiaBaseTotal + furnitureBaseTotal;
  const accessAdjustedLabour = labourBaseBeforeZone * accessState.factor * smallJobFactor;
  const zoneSurchargeTotal = accessAdjustedLabour * (parseNumber(locationState.surchargePercent) / 100);
  const labourSubtotalAfterAdjustments = accessAdjustedLabour + zoneSurchargeTotal;
  const labourAdjustmentRatio = labourBaseBeforeZone > 0 ? labourSubtotalAfterAdjustments / labourBaseBeforeZone : 1;

  const installationAdjustedTotal = installationBaseTotal * labourAdjustmentRatio;
  const removalTotal = removalBaseTotal * labourAdjustmentRatio;
  const floorPrepTotal = floorPrepBaseTotal * labourAdjustmentRatio;
  const skirtingTotal = skirtingBaseTotal * labourAdjustmentRatio;
  const scotiaTotal = scotiaBaseTotal * labourAdjustmentRatio;
  const furnitureTotal = furnitureBaseTotal * labourAdjustmentRatio;
  const travelFeeTotal = parseNumber(locationState.travelFee);
  const locationTotal = roundTo(zoneSurchargeTotal + travelFeeTotal, 2);
  const subtotalBeforeMinimum = materialTotal + labourSubtotalAfterAdjustments + underlayTotal + moistureBarrierTotal + doorTrimmingBaseTotal + travelFeeTotal;
  const minimumJobFee = Math.max(parseNumber(locationState.minimumJobFee), parseNumber(installRateConfig.minimum_charge), parseNumber(rules.minimumJobFee));
  const minimumChargeApplied = subtotalBeforeMinimum > 0 && subtotalBeforeMinimum < minimumJobFee;
  const subtotalWithMinimum = subtotalBeforeMinimum > 0 ? Math.max(subtotalBeforeMinimum, minimumJobFee) : 0;
  const subtotalExGst = subtotalWithMinimum > 0 ? roundToIncrement(subtotalWithMinimum, parseNumber(rules.roundingIncrement) || 50) : 0;
  const roundingAdjustment = subtotalWithMinimum > 0 ? subtotalExGst - subtotalWithMinimum : 0;
  const gst = subtotalExGst * 0.10;
  const totalIncGst = subtotalExGst + gst;
  const reviewState = getWarnings(input, measurement, product, productPricePending, accessState);

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
    categoryEstimateLabel: "standard " + categoryMeta.label.toLowerCase() + " estimate",
    zoneName: locationState.zoneName,
    realArea: roundTo(measurement.realArea, 2),
    chargeableArea: roundTo(chargeableArea, 2),
    materialTotal: roundTo(materialTotal, 2),
    installationTotal: roundTo(installationBaseTotal, 2),
    installationAdjustedTotal: roundTo(installationAdjustedTotal, 2),
    removalTotal: roundTo(removalTotal, 2),
    floorPrepTotal: roundTo(floorPrepTotal, 2),
    underlayTotal: roundTo(underlayTotal, 2),
    moistureBarrierTotal: roundTo(moistureBarrierTotal, 2),
    skirtingTotal: roundTo(skirtingTotal, 2),
    scotiaTotal: roundTo(scotiaTotal, 2),
    furnitureTotal: roundTo(furnitureTotal, 2),
    doorTrimmingTotal: roundTo(doorTrimmingBaseTotal, 2),
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
    doorCount: doorCount,
    removalLabel: input.removalOption ? String(input.removalOption).replace(/_/g, " ") : "none",
    floorPrepLabel: input.floorPrepType ? String(input.floorPrepType).replace(/_/g, " ") : "none",
    skirtingLabel: input.skirtingOption ? String(input.skirtingOption).replace(/_/g, " ") : "none",
    scotiaLabel: input.scotiaOption ? String(input.scotiaOption).replace(/_/g, " ") : "none",
    furnitureLabel: input.furnitureType ? String(input.furnitureType).replace(/_/g, " ") : "none",
    underlayLabel: underlay ? underlay.name : "",
    warnings: Array.from(new Set(reviewState.warnings)),
    manualReviewRequired: reviewState.manualReviewRequired,
    pricePending: productPricePending,
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
