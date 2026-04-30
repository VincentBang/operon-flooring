(function () {
  // Source of truth for pricing data source configuration.
  // Default mode is local files. Switch to google_sheets after publishing the sheet tabs.
  window.OPERON_PRICING_SOURCE_CONFIG = window.OPERON_PRICING_SOURCE_CONFIG || {
    mode: "local",
    googleSheets: {
      spreadsheetId: "",
      sourceLabel: "Google Sheets",
      sheets: {
        categoryMeta: "category_meta",
        products: "products",
        installRates: "install_rates",
        underlay: "underlay",
        skirtingScotia: "skirting_scotia",
        removalRates: "removal_rates",
        locationZones: "location_zones",
        pricingRules: "pricing_rules"
      }
    }
  };
}());
