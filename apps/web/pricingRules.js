(function () {
  // Source of truth for high-level quote rules and generic rate settings.
  // Future Google Sheets / Supabase integration can replace this file with fetched data.
  const PRICING_RULES = {
    standardWastagePercent: 10,
    herringboneWastagePercent: 20,
    materialAreaBasis: "chargeable_area",
    labourAreaBasis: "real_area",
    underlayAreaBasis: "chargeable_area",
    moistureBarrierAreaBasis: "chargeable_area",
    skirtingAreaBasis: "chargeable_area_allowance",
    exposeInternalRates: false,
    floorPrepRates: {
      basic: 8,
      levelling: 8
    },
    moistureBarrierRatePerM2: 5,
    furnitureRatePerRoom: 50,
    doorTrimmingRate: 40,
    smallJobThresholdM2: 30,
    smallJobFactor: 1.10,
    minimumJobFee: 1500,
    roundingIncrement: 50
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getRules() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("pricingRules") : null;
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return clone(PRICING_RULES);
    }

    return Object.assign(clone(PRICING_RULES), clone(source));
  }

  function getWastagePercent(pattern) {
    const rules = getRules();
    return pattern === "herringbone" || pattern === "chevron"
      ? rules.herringboneWastagePercent
      : rules.standardWastagePercent;
  }

  function getWastageMultiplier(pattern) {
    return 1 + (getWastagePercent(pattern) / 100);
  }

  window.OperonPricingRules = {
    get rules() {
      return getRules();
    },
    getWastagePercent: getWastagePercent,
    getWastageMultiplier: getWastageMultiplier
  };
}());
