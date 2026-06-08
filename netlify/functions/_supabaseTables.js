"use strict";

const LEGACY_TABLES = {
  pricingCategories: "pricing_categories",
  productRanges: "product_ranges",
  pricingInstallRates: "pricing_install_rates",
  pricingUnderlayOptions: "pricing_underlay_options",
  pricingTrimOptions: "pricing_trim_options",
  pricingRemovalRates: "pricing_removal_rates",
  pricingLocationZones: "pricing_location_zones",
  pricingRules: "pricing_rules",
  pricingStairRates: "pricing_stair_rates",
  quoteRequests: "quote_requests",
  quoteRooms: "quote_rooms",
  quoteItems: "quote_items",
  uploadedFiles: "uploaded_files",
  quoteReviews: "quote_reviews",
  quoteEvents: "quote_events",
  quoteFunnelSessions: "quote_funnel_sessions",
  followupTemplates: "followup_templates",
  followupMessages: "followup_messages",
  closeAutomationRuns: "close_automation_runs",
  quotePricingOutcomes: "quote_pricing_outcomes",
  pricingOptimizationBuckets: "pricing_optimization_buckets"
};

const V2_TABLES = Object.keys(LEGACY_TABLES).reduce(function (accumulator, key) {
  accumulator[key] = "operon_" + LEGACY_TABLES[key];
  return accumulator;
}, {});

function getSupabaseTables() {
  const mode = String(process.env.OPERON_SUPABASE_SCHEMA_MODE || "v2").trim().toLowerCase();
  return mode === "legacy" || mode === "old" ? LEGACY_TABLES : V2_TABLES;
}

module.exports = {
  LEGACY_TABLES: LEGACY_TABLES,
  V2_TABLES: V2_TABLES,
  getSupabaseTables: getSupabaseTables
};
