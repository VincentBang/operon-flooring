(function () {
  function roundTo(value, places) {
    return Number(Number(value || 0).toFixed(places));
  }

  function roundToIncrement(value, increment) {
    if (!increment) {
      return value;
    }
    return Math.round(value / increment) * increment;
  }

  function parsePositiveNumber(value) {
    if (value === "" || value === null || typeof value === "undefined") {
      return 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function formatArea(value) {
    return roundTo(value || 0, 1).toFixed(1) + " m²";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getLibraries() {
    return {
      products: window.OperonProducts,
      installRates: window.OperonInstallRates,
      underlay: window.OperonUnderlay,
      skirtingScotia: window.OperonSkirtingScotia,
      removalRates: window.OperonRemovalRates,
      locationZones: window.OperonLocationZones,
      pricingRules: window.OperonPricingRules
    };
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

  function getSmallJobFactor(realArea, rules) {
    return realArea > 0 && realArea < rules.smallJobThresholdM2
      ? rules.smallJobFactor
      : 1;
  }

  function getActiveProduct(input, libraries) {
    const products = libraries.products;
    const product = products && input.productId ? products.getProductById(input.productId) : null;
    if (product) {
      return Object.assign({ label: products.getProductLabel(product) }, product);
    }

    const estimate = products ? products.getEstimateProduct(input.category || "hybrid") : null;
    return estimate || {
      id: "hybrid-estimate",
      category: input.category || "hybrid",
      brand: "Operon Estimate",
      range: "Hybrid Flooring",
      colour: "Standard estimate",
      pricePerM2: 0,
      installRate: null,
      isEstimate: true,
      label: "Hybrid Flooring Estimate"
    };
  }

  function getSelectedUnderlay(input, libraries) {
    if (!input.underlayId || !libraries.underlay) {
      return null;
    }
    return libraries.underlay.getUnderlayById(input.underlayId);
  }

  function getLocationState(input, libraries, rules) {
    const zone = libraries.locationZones
      ? libraries.locationZones.matchZone({ suburb: input.suburb, postcode: input.postcode })
      : null;

    return {
      zoneName: zone ? zone.zoneName : "Default Sydney Zone",
      travelFee: zone ? Number(zone.travelFee || 0) : 0,
      minimumJobFee: zone ? Number(zone.minimumJobFee || rules.minimumJobFee || 0) : (rules.minimumJobFee || 0),
      surchargePercent: zone ? Number(zone.surchargePercent || 0) : 0,
      distanceFromBaseKm: zone ? Number(zone.distanceFromBaseKm || 0) : 0
    };
  }

  function getInstallRateConfig(input, product, libraries) {
    if (!libraries.installRates) {
      return null;
    }

    const quoteMode = input.jobType || input.quoteMode || "supply_install";
    const installType = libraries.installRates.normaliseInstallType(input.pattern || "standard");
    const installMethod = libraries.installRates.normaliseInstallMethod(
      product.category,
      installType,
      input.installMethod || "floating"
    );
    return libraries.installRates.getInstallRate({
      category: product.category,
      installType: installType,
      installMethod: installMethod,
      jobType: quoteMode
    });
  }

  function getRemovalConfig(input, libraries) {
    if (!libraries.removalRates || !input.removalOption || input.removalOption === "none" || input.removalOption === "other" || input.removalOption === "unsure") {
      return null;
    }
    return libraries.removalRates.getRemovalRate(input.removalOption);
  }

  function getTrimTotals(input, chargeableArea, libraries) {
    const trims = {
      skirtingTotal: 0,
      scotiaTotal: 0
    };

    if (libraries.skirtingScotia) {
      const skirting = libraries.skirtingScotia.getTrimOption("skirting", input.skirtingOption);
      const removeRefit = libraries.skirtingScotia.getTrimOption("remove_existing", input.skirtingOption);
      const scotia = libraries.skirtingScotia.getTrimOption("scotia", input.scotiaOption);

      if (skirting && skirting.pricingMethod === "allowance_per_m2") {
        trims.skirtingTotal = chargeableArea * Number(skirting.price || 0);
      } else if (removeRefit && removeRefit.pricingMethod === "allowance_per_m2") {
        trims.skirtingTotal = chargeableArea * Number(removeRefit.price || 0);
      }

      if (scotia && scotia.pricingMethod === "allowance_per_m2") {
        trims.scotiaTotal = chargeableArea * Number(scotia.price || 0);
      }
    }

    return trims;
  }

  function getWarnings(input, measurement, product, pricePending, accessState) {
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

    if (input.removalOption && input.removalOption !== "none" && input.removalOption !== "other" && input.removalOption !== "unsure" && !input.removalDisposal) {
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

  function calculateQuote(input) {
    const libraries = getLibraries();
    const rules = clone((libraries.pricingRules && libraries.pricingRules.rules) || {});
    const measurement = {
      realArea: parsePositiveNumber(input.realArea),
      roomCount: Math.max(0, Math.round(parsePositiveNumber(input.roomCount))),
      warnings: Array.isArray(input.measurementWarnings) ? input.measurementWarnings.slice() : [],
      sourceLabel: input.measurementSource || "Manual total"
    };

    const product = getActiveProduct(input, libraries);
    const categoryEstimate = libraries.products ? libraries.products.getEstimateProduct(product.category) : null;
    const quoteMode = input.jobType || input.quoteMode || "supply_install";
    const furnitureRoomCount = Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount)));
    const isEngineered = product.category === "engineered";
    const requestedPattern = input.pattern || "standard";
    const resolvedPattern = isEngineered ? requestedPattern : "standard";
    const requestedInstallMethod = input.installMethod || "floating";
    const resolvedInstallMethod = !isEngineered
      ? "floating"
      : ((resolvedPattern === "herringbone" || resolvedPattern === "chevron") ? "direct_glue" : requestedInstallMethod);
    const normalizedInput = Object.assign({}, input, {
      pattern: resolvedPattern,
      installMethod: resolvedInstallMethod
    });
    const chargeableArea = measurement.realArea * (libraries.pricingRules ? libraries.pricingRules.getWastageMultiplier(resolvedPattern) : 1.10);
    const accessState = getAccessState(input);
    const locationState = getLocationState(input, libraries, rules);
    const smallJobFactor = getSmallJobFactor(measurement.realArea, rules);
    const productPricePending = quoteMode === "supply_install" && !product.isEstimate && !(product.pricePerM2 > 0);
    const materialRate = product.pricePerM2 > 0
      ? product.pricePerM2
      : ((categoryEstimate && categoryEstimate.pricePerM2 > 0) ? categoryEstimate.pricePerM2 : 0);
    const installRateConfig = getInstallRateConfig(normalizedInput, product, libraries) || {};
    const installRate = product.installRate || Number(installRateConfig.ratePerM2 || 0);
    const underlay = getSelectedUnderlay(input, libraries);
    const underlayArea = rules.underlayAreaBasis === "real_area" ? measurement.realArea : chargeableArea;
    const underlayTotal = underlay ? underlayArea * Number(underlay.pricePerM2 || 0) : 0;
    const removalConfig = getRemovalConfig(input, libraries);
    const removalBaseTotal = removalConfig
      ? (measurement.realArea * Number(removalConfig.ratePerM2 || 0))
        + (input.removalDisposal === "yes" ? Number(removalConfig.disposalFee || 0) : 0)
      : 0;
    const floorPrepBaseTotal = (input.floorPrepType === "basic" || input.floorPrepType === "levelling")
      ? measurement.realArea * Number((rules.floorPrepRates || {})[input.floorPrepType] || 0)
      : 0;
    const trimTotals = getTrimTotals(input, chargeableArea, libraries);
    const furnitureBaseTotal = input.furnitureType === "yes"
      ? furnitureRoomCount * Number(rules.furnitureRatePerRoom || 0)
      : 0;
    const doorCount = input.doorTrimming === "yes" ? Math.max(0, Math.round(parsePositiveNumber(input.doorCount))) : 0;
    const doorTrimmingBaseTotal = doorCount * Number(rules.doorTrimmingRate || 0);
    const moistureBarrierTotal = input.moistureBarrier === "yes"
      ? chargeableArea * Number(rules.moistureBarrierRatePerM2 || 0)
      : 0;

    const materialTotal = quoteMode === "supply_install"
      ? chargeableArea * materialRate
      : 0;
    const installationBaseTotal = measurement.realArea * installRate;

    const labourBaseBeforeZone = installationBaseTotal
      + removalBaseTotal
      + floorPrepBaseTotal
      + trimTotals.skirtingTotal
      + trimTotals.scotiaTotal
      + furnitureBaseTotal;

    const accessAdjustedLabour = labourBaseBeforeZone * accessState.factor * smallJobFactor;
    const zoneSurchargeTotal = accessAdjustedLabour * (Number(locationState.surchargePercent || 0) / 100);
    const labourSubtotalAfterAdjustments = accessAdjustedLabour + zoneSurchargeTotal;
    const labourAdjustmentRatio = labourBaseBeforeZone > 0
      ? labourSubtotalAfterAdjustments / labourBaseBeforeZone
      : 1;

    const installationAdjustedTotal = installationBaseTotal * labourAdjustmentRatio;
    const removalTotal = removalBaseTotal * labourAdjustmentRatio;
    const floorPrepTotal = floorPrepBaseTotal * labourAdjustmentRatio;
    const skirtingTotal = trimTotals.skirtingTotal * labourAdjustmentRatio;
    const scotiaTotal = trimTotals.scotiaTotal * labourAdjustmentRatio;
    const furnitureTotal = furnitureBaseTotal * labourAdjustmentRatio;
    const travelFeeTotal = Number(locationState.travelFee || 0);
    const locationTotal = roundTo(zoneSurchargeTotal + travelFeeTotal, 2);

    const subtotalBeforeMinimum = materialTotal
      + labourSubtotalAfterAdjustments
      + underlayTotal
      + moistureBarrierTotal
      + doorTrimmingBaseTotal
      + travelFeeTotal;

    const minimumJobFee = Math.max(
      Number(locationState.minimumJobFee || 0),
      Number(installRateConfig.minimumCharge || 0),
      Number(rules.minimumJobFee || 0)
    );
    const minimumChargeApplied = subtotalBeforeMinimum > 0 && subtotalBeforeMinimum < minimumJobFee;
    const subtotalWithMinimum = subtotalBeforeMinimum > 0
      ? Math.max(subtotalBeforeMinimum, minimumJobFee)
      : 0;
    const subtotalExGst = subtotalWithMinimum > 0
      ? roundToIncrement(subtotalWithMinimum, rules.roundingIncrement || 50)
      : 0;
    const roundingAdjustment = subtotalWithMinimum > 0 ? subtotalExGst - subtotalWithMinimum : 0;
    const gst = subtotalExGst * 0.10;
    const totalIncGst = subtotalExGst + gst;

    const reviewState = getWarnings(normalizedInput, measurement, product, productPricePending, accessState);
    if (doorCount === 0 && input.doorTrimming === "yes") {
      reviewState.warnings.push("Door trimming selected without quantity.");
      reviewState.manualReviewRequired = true;
    }
    if (minimumChargeApplied) {
      reviewState.warnings.push("Minimum project charge applied.");
    }

    const result = {
      quoteMode: quoteMode,
      productId: product.isEstimate ? null : product.id,
      productLabel: libraries.products ? libraries.products.getProductLabel(product) : product.label,
      productCategory: product.category,
      category: product.category,
      categoryEstimateLabel: libraries.products ? ("standard " + (libraries.products.getCategoryMeta(product.category || input.category || "hybrid").label.toLowerCase()) + " estimate") : "standard flooring estimate",
      zoneName: locationState.zoneName,
      pattern: resolvedPattern,
      installMethod: resolvedInstallMethod,
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
      zoneMultiplier: roundTo(1 + (Number(locationState.surchargePercent || 0) / 100), 4),
      locationSurchargePercent: roundTo(locationState.surchargePercent, 2),
      roomCount: measurement.roomCount,
      furnitureRoomCount: furnitureRoomCount,
      doorCount: doorCount,
      removalLabel: input.removalOption
        ? input.removalOption.replace(/_/g, " ") + (input.removalDisposal === "yes" ? " + disposal" : " only")
        : "none",
      floorPrepLabel: input.floorPrepType ? input.floorPrepType.replace(/_/g, " ") : "none",
      skirtingLabel: input.skirtingOption ? input.skirtingOption.replace(/_/g, " ") : "none",
      scotiaLabel: input.scotiaOption ? input.scotiaOption.replace(/_/g, " ") : "none",
      furnitureLabel: input.furnitureType
        ? "furnished room move" + (furnitureRoomCount > 0 ? " · " + furnitureRoomCount + " rooms" : "")
        : "none",
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

  window.OperonQuoteCalculator = {
    calculateQuote: calculateQuote,
    getAccessState: getAccessState,
    formatArea: formatArea
  };
}());
