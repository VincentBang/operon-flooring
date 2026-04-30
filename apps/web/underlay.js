(function () {
  // Source of truth for optional underlay products.
  // Future Google Sheets / Supabase integration can replace this file with fetched data.
  const UNDERLAY_PRODUCTS = [
    { id: "acoustic-underlay-standard", name: "Standard Acoustic Underlay", suitableCategories: ["laminate", "engineered"], pricePerM2: 4, active: true },
    { id: "acoustic-underlay-premium", name: "Premium Acoustic Underlay", suitableCategories: ["laminate", "engineered"], pricePerM2: 6, active: true },
    { id: "hybrid-additional-acoustic-layer", name: "Additional Acoustic Layer", suitableCategories: ["hybrid"], pricePerM2: 5, active: false }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getUnderlayData() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("underlay") : null;
    return Array.isArray(source) && source.length ? source : UNDERLAY_PRODUCTS;
  }

  function listActive() {
    return getUnderlayData().filter(function (item) {
      return item.active !== false;
    }).map(clone);
  }

  function getUnderlayById(id) {
    const item = getUnderlayData().find(function (entry) {
      return entry.id === id && entry.active !== false;
    });
    return item ? clone(item) : null;
  }

  window.OperonUnderlay = {
    list: listActive,
    getUnderlayById: getUnderlayById
  };
}());
