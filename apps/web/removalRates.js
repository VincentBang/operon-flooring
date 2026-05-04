(function () {
  // Source of truth for flooring removal pricing.
  // disposalFee is treated as a per-m² disposal rate in current quote logic.
  // Future Supabase migration should rename this to disposalRatePerM2 for clarity.
  // Future Google Sheets / Supabase integration can replace this file with fetched data.
  const REMOVAL_RATES = [
    { id: "remove-carpet", floorType: "carpet", aliases: ["carpet"], ratePerM2: 10, disposalFee: 0, active: true },
    { id: "remove-floating", floorType: "laminate", aliases: ["floating", "floating_floor", "laminate", "hybrid"], ratePerM2: 10, disposalFee: 0, active: true },
    { id: "remove-glue-down", floorType: "timber", aliases: ["glue_down", "glued_or_nailed_timber", "timber"], ratePerM2: 10, disposalFee: 0, active: true },
    { id: "remove-tile", floorType: "tile", aliases: ["tile", "tiles"], ratePerM2: 10, disposalFee: 0, active: true },
    { id: "remove-vinyl", floorType: "vinyl", aliases: ["vinyl"], ratePerM2: 10, disposalFee: 0, active: true },
    { id: "remove-unknown", floorType: "unknown", aliases: ["unknown", "other", "unsure", "not_sure"], ratePerM2: 0, disposalFee: 0, active: true }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getRemovalRatesData() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("removalRates") : null;
    return Array.isArray(source) && source.length ? source : REMOVAL_RATES;
  }

  function normaliseFloorType(floorType) {
    return String(floorType || "").trim().toLowerCase();
  }

  function listActive() {
    return getRemovalRatesData().filter(function (item) {
      return item.active !== false;
    }).map(clone);
  }

  function getRemovalRate(floorType) {
    const target = normaliseFloorType(floorType);
    const item = getRemovalRatesData().find(function (entry) {
      const aliases = [entry.floorType].concat(entry.aliases || []).map(normaliseFloorType);
      return entry.active !== false && aliases.indexOf(target) >= 0;
    });
    return item ? clone(item) : null;
  }

  window.OperonRemovalRates = {
    list: listActive,
    getRemovalRate: getRemovalRate
  };
}());
