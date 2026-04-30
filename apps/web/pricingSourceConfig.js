(function () {
  // Source of truth for pricing data source configuration.
  // Default mode now uses the Netlify public catalogue function so customer-facing
  // product prices can come from Supabase without exposing private rate tables.
  window.OPERON_PRICING_SOURCE_CONFIG = window.OPERON_PRICING_SOURCE_CONFIG || {
    mode: "netlify_catalogue",
    netlifyCatalogue: {
      endpoint: "/.netlify/functions/public-catalogue-pricing",
      sourceLabel: "Supabase Catalogue"
    },
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
