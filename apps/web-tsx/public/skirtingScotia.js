(function () {
  // Source of truth for skirting / scotia / trim pricing.
  // Skirting and scotia use chargeable-area allowance for instant quote logic unless a later tool provides reliable perimeter data.
  const TRIM_OPTIONS = [
    { id: "skirting-supply-install", type: "skirting", formValue: "supply_install", material: "MDF skirting", pricingMethod: "allowance_per_m2", price: 12, active: true },
    { id: "skirting-remove-refit", type: "remove_existing", formValue: "remove_refit", material: "Existing skirting remove / refit", pricingMethod: "allowance_per_m2", price: 12, active: true },
    { id: "scotia-standard", type: "scotia", formValue: "yes", material: "Matching scotia", pricingMethod: "allowance_per_m2", price: 8, active: true }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getTrimData() {
    const source = window.OperonPricingSource ? window.OperonPricingSource.getTable("skirtingScotia") : null;
    return Array.isArray(source) && source.length ? source : TRIM_OPTIONS;
  }

  function listActive() {
    return getTrimData().filter(function (item) {
      return item.active !== false;
    }).map(clone);
  }

  function getTrimOption(type, formValue) {
    const item = getTrimData().find(function (entry) {
      return entry.type === type && entry.formValue === formValue && entry.active !== false;
    });
    return item ? clone(item) : null;
  }

  window.OperonSkirtingScotia = {
    list: listActive,
    getTrimOption: getTrimOption
  };
}());
