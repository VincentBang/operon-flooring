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
      pricingRules: window.OperonPricingRules,
      stairRates: window.OperonStairRates
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
    const exactOrFallback = libraries.installRates.getInstallRate({
      category: product.category,
      installType: installType,
      installMethod: installMethod,
      jobType: quoteMode
    });
    return exactOrFallback;
  }

  function getRemovalConfig(input, libraries) {
    if (!libraries.removalRates || !input.removalOption || input.removalOption === "none" || input.removalOption === "other" || input.removalOption === "unsure") {
      return null;
    }
    return libraries.removalRates.getRemovalRate(input.removalOption);
  }

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
        label: item.label || type,
        quantity: Math.max(0, Math.round(parsePositiveNumber(item.quantity)))
      };
    }).filter(function (item) {
      return item.type && item.quantity > 0;
    });

    if (!normalised.length && input.stairs === "yes") {
      const fallbackCount = Math.max(0, Math.round(parsePositiveNumber(input.stairsCount)));
      if (fallbackCount > 0) {
        normalised.push({
          type: "straight_tread",
          label: "Straight stair treads",
          quantity: fallbackCount
        });
      }
    }

    return normalised;
  }

  function getStairPricingState(input, product, libraries) {
    const quoteMode = input.jobType || input.quoteMode || "supply_install";
    const productCategory = product.category || input.category || "";
    const emptyState = {
      selected: input.stairs === "yes",
      total: 0,
      totalCount: 0,
      details: [],
      widthKnown: input.stairWidthKnown === "yes",
      widthMm: Math.max(0, Math.round(parsePositiveNumber(input.stairWidthMm))),
      widthTier: "short",
      widthAssumed: false,
      guideWidthMm: 1200,
      rangeId: quoteMode === "install_only" && libraries.stairRates && typeof libraries.stairRates.getInstallationOnlyRangeId === "function"
        ? libraries.stairRates.getInstallationOnlyRangeId(productCategory)
        : (input.selectedRangeId || product.rangeId || ""),
      warnings: [],
      manualReviewRequired: false
    };

    if (input.stairs !== "yes") {
      return emptyState;
    }

    const stairDetails = normaliseStairDetails(input);
    const rangeId = input.selectedRangeId || product.rangeId || "";
    const rateSet = libraries.stairRates && typeof libraries.stairRates.getRateSet === "function"
      ? libraries.stairRates.getRateSet(rangeId, {
        quoteMode: quoteMode,
        category: productCategory
      })
      : null;

    if (!stairDetails.length) {
      emptyState.warnings.push("Stairs selected but no stair quantities entered.");
      emptyState.manualReviewRequired = true;
      return emptyState;
    }

    if (!rateSet) {
      emptyState.details = stairDetails;
      emptyState.totalCount = stairDetails.reduce(function (total, item) { return total + item.quantity; }, 0);
      emptyState.warnings.push("Stair item totals need final confirmation.");
      emptyState.manualReviewRequired = true;
      return emptyState;
    }

    const tierState = libraries.stairRates.getTierForWidth(rateSet, emptyState.widthMm, emptyState.widthKnown);
    const pricedDetails = stairDetails.map(function (item) {
      const stairType = libraries.stairRates.getStairType(item.type);
      const label = stairType ? stairType.label : item.label;
      const unitPrice = libraries.stairRates.getPrice(rateSet, item.type, tierState.tier);
      return {
        type: item.type,
        label: label,
        quantity: item.quantity,
        widthTier: tierState.tier,
        unitPrice: unitPrice,
        amount: unitPrice * item.quantity,
        priceConfigured: unitPrice > 0
      };
    });

    const missingPrice = pricedDetails.some(function (item) {
      return item.quantity > 0 && !(item.unitPrice > 0);
    });
    const total = pricedDetails.reduce(function (sum, item) {
      return sum + item.amount;
    }, 0);

    const warnings = [];
    let manualReviewRequired = false;
    if (tierState.assumed) {
      warnings.push("Stair width still needs confirmation. Final stair allowance will be checked before confirmation.");
      manualReviewRequired = true;
    }
    if (missingPrice) {
      warnings.push("Stair item totals need final confirmation.");
      manualReviewRequired = true;
    }

    return {
      selected: true,
      total: total,
      totalCount: pricedDetails.reduce(function (sum, item) { return sum + item.quantity; }, 0),
      details: pricedDetails,
      widthKnown: emptyState.widthKnown,
      widthMm: emptyState.widthMm,
      widthTier: tierState.tier,
      widthAssumed: tierState.assumed,
      guideWidthMm: tierState.guideWidthMm,
      rangeId: rateSet.rangeId || emptyState.rangeId || rangeId,
      warnings: warnings,
      manualReviewRequired: manualReviewRequired
    };
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

    if (input.parkingAccess === "difficult") {
      warnings.push("Access looks more difficult than a standard house install. Review may be needed.");
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

  function getCategoryLabel(category) {
    const libraries = getLibraries();
    const meta = libraries.products && libraries.products.getCategoryMeta(category || "hybrid");
    return meta ? meta.label : "Flooring";
  }

  function getSupplyLineContent(result) {
    const categoryLabel = getCategoryLabel(result.productCategory || result.category).toLowerCase();

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
      lines.push({ label: "Scotia", note: "Allowance", quantity: formatArea(result.chargeableArea), amount: result.scotiaTotal });
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
          ? "Stair allowance included; final width checked before confirmation"
          : "Stair allowance based on the width provided",
        quantity: result.stairCount + " stair item" + (result.stairCount === 1 ? "" : "s"),
        amount: result.stairsTotal
      });
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
      sourceLabel: input.measurementSource || "Enter total area"
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
      installMethod: resolvedInstallMethod,
      removalOption: normaliseRemovalFloorType(input.removalOption || input.existingFloorToRemove || input.existingFloorType)
    });
    const chargeableArea = measurement.realArea * (libraries.pricingRules ? libraries.pricingRules.getWastageMultiplier(resolvedPattern) : 1.10);
    const accessState = getAccessState(input);
    const locationState = getLocationState(input, libraries, rules);
    const smallJobFactor = getSmallJobFactor(measurement.realArea, rules);
    const productPricePending = quoteMode === "supply_install" && !product.isEstimate && !(product.pricePerM2 > 0);
    const categoryEstimateMode = categoryEstimate && categoryEstimate.pricingMode === "category" ? "category" : "fallback";
    const pricingMode = quoteMode !== "supply_install"
      ? "category"
      : (productPricePending
        ? "fallback"
        : (!product.isEstimate && product.pricePerM2 > 0
          ? "product"
          : categoryEstimateMode));
    const materialRate = product.pricePerM2 > 0
      ? product.pricePerM2
      : ((categoryEstimate && categoryEstimate.pricePerM2 > 0) ? categoryEstimate.pricePerM2 : 0);
    const installRateConfig = getInstallRateConfig(normalizedInput, product, libraries);
    const installRateMissing = !installRateConfig && !(product.installRate > 0);
    const installRate = product.installRate || Number((installRateConfig && installRateConfig.ratePerM2) || 0);
    const underlay = getSelectedUnderlay(input, libraries);
    const underlayArea = rules.underlayAreaBasis === "real_area" ? measurement.realArea : chargeableArea;
    const underlayTotal = underlay ? underlayArea * Number(underlay.pricePerM2 || 0) : 0;
    const removalConfig = getRemovalConfig(normalizedInput, libraries);
    const disposalSelected = !!(removalConfig && input.removalDisposal === "yes");
    const removalBaseTotal = removalConfig
      ? measurement.realArea * Number(removalConfig.ratePerM2 || 0)
      : 0;
    const disposalRatePerM2 = removalConfig
      ? Number(removalConfig.disposalRatePerM2 || removalConfig.disposalFee || 0)
      : 0;
    const disposalBaseTotal = disposalSelected
      ? measurement.realArea * disposalRatePerM2
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
    const stairPricingState = getStairPricingState(normalizedInput, product, libraries);
    const stairBaseTotal = stairPricingState.total;
    const moistureBarrierTotal = input.moistureBarrier === "yes"
      ? chargeableArea * Number(rules.moistureBarrierRatePerM2 || 0)
      : 0;

    const materialTotal = quoteMode === "supply_install"
      ? chargeableArea * materialRate
      : 0;
    const installationBaseTotal = measurement.realArea * installRate;

    const labourBaseBeforeZone = installationBaseTotal
      + removalBaseTotal
      + disposalBaseTotal
      + floorPrepBaseTotal
      + trimTotals.skirtingTotal
      + trimTotals.scotiaTotal
      + furnitureBaseTotal
      + stairBaseTotal;

    const accessAdjustedLabour = labourBaseBeforeZone * accessState.factor * smallJobFactor;
    const zoneSurchargeTotal = accessAdjustedLabour * (Number(locationState.surchargePercent || 0) / 100);
    const labourSubtotalAfterAdjustments = accessAdjustedLabour + zoneSurchargeTotal;
    const labourAdjustmentRatio = labourBaseBeforeZone > 0
      ? labourSubtotalAfterAdjustments / labourBaseBeforeZone
      : 1;

    const installationAdjustedTotal = installationBaseTotal * labourAdjustmentRatio;
    const removalTotal = removalBaseTotal * labourAdjustmentRatio;
    const disposalTotal = disposalBaseTotal * labourAdjustmentRatio;
    const floorPrepTotal = floorPrepBaseTotal * labourAdjustmentRatio;
    const skirtingTotal = trimTotals.skirtingTotal * labourAdjustmentRatio;
    const scotiaTotal = trimTotals.scotiaTotal * labourAdjustmentRatio;
    const furnitureTotal = furnitureBaseTotal * labourAdjustmentRatio;
    const stairsTotal = stairBaseTotal * labourAdjustmentRatio;
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
      Number((installRateConfig && installRateConfig.minimumCharge) || 0),
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

    const reviewState = getWarnings(normalizedInput, measurement, product, productPricePending, accessState, installRateMissing, stairPricingState);
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
      zoneMultiplier: roundTo(1 + (Number(locationState.surchargePercent || 0) / 100), 4),
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
      pricingMode: pricingMode,
      pricingSourceProductId: pricingMode === "product"
        ? product.id
        : ((categoryEstimate && categoryEstimate.baselineProductId) || ""),
      pricingSourceProductLabel: pricingMode === "product"
        ? (libraries.products ? libraries.products.getProductLabel(product) : product.label)
        : ((categoryEstimate && categoryEstimate.baselineProductLabel) || ""),
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
