"use strict";

const PricingMigrationScenarios = Object.freeze([
  {
    id: "house-hybrid-60-no-extras",
    label: "House, hybrid, 60m2, no stairs, no removal",
    source: "quote",
    customer: { propertyType: "house", suburb: "Auburn", postcode: "2144" },
    product: { category: "hybrid", selectionState: "known" },
    area: { method: "known_total", areaM2: 60 },
    stairs: { answer: "no" },
    extras: { removal: "no", disposal: "no" },
    expectedReviewFlags: []
  },
  {
    id: "apartment-laminate-45-access-notes",
    label: "Apartment, laminate, 45m2, access notes, lift uncertain",
    source: "quote",
    customer: { propertyType: "apartment", suburb: "Sydney", postcode: "2000" },
    product: { category: "laminate", selectionState: "known" },
    area: { method: "known_total", areaM2: 45 },
    access: { lift: "not_sure", notes: "Synthetic access note for fixture only" },
    stairs: { answer: "no" },
    extras: { removal: "no", disposal: "no" },
    expectedReviewFlags: ["access_review"]
  },
  {
    id: "engineered-timber-80-stairs",
    label: "Engineered timber, 80m2, stairs yes",
    source: "quote",
    customer: { propertyType: "house", suburb: "Parramatta", postcode: "2150" },
    product: { category: "engineered", selectionState: "known" },
    area: { method: "known_total", areaM2: 80 },
    stairs: { answer: "yes", straightSteps: 12 },
    extras: { removal: "no", disposal: "no" },
    expectedReviewFlags: ["stairs_review"]
  },
  {
    id: "hybrid-carpet-removal-disposal",
    label: "Hybrid, carpet removal yes, disposal yes",
    source: "quote",
    customer: { propertyType: "house", suburb: "Bankstown", postcode: "2200" },
    product: { category: "hybrid", selectionState: "known" },
    area: { method: "known_total", areaM2: 60 },
    stairs: { answer: "no" },
    extras: { removal: "yes", existingFloorType: "carpet", disposal: "yes" },
    expectedReviewFlags: []
  },
  {
    id: "floating-removal-disposal-not-sure",
    label: "Floating floor removal yes, disposal not sure",
    source: "quote",
    customer: { propertyType: "house", suburb: "Liverpool", postcode: "2170" },
    product: { category: "hybrid", selectionState: "known" },
    area: { method: "known_total", areaM2: 55 },
    stairs: { answer: "no" },
    extras: { removal: "yes", existingFloorType: "floating_floor", disposal: "not_sure" },
    expectedReviewFlags: ["disposal_review"]
  },
  {
    id: "glue-down-timber-removal",
    label: "Glue-down timber removal yes",
    source: "quote",
    customer: { propertyType: "house", suburb: "Camden", postcode: "2570" },
    product: { category: "engineered", selectionState: "known" },
    area: { method: "known_total", areaM2: 50 },
    stairs: { answer: "no" },
    extras: { removal: "yes", existingFloorType: "glue_down_timber", disposal: "not_sure" },
    expectedReviewFlags: ["removal_review", "disposal_review"]
  },
  {
    id: "tile-removal",
    label: "Tile removal yes",
    source: "quote",
    customer: { propertyType: "house", suburb: "Campbelltown", postcode: "2560" },
    product: { category: "hybrid", selectionState: "known" },
    area: { method: "known_total", areaM2: 40 },
    stairs: { answer: "no" },
    extras: { removal: "yes", existingFloorType: "tile", disposal: "not_sure" },
    expectedReviewFlags: ["removal_review", "disposal_review"]
  },
  {
    id: "product-not-sure-area-known",
    label: "Product not sure, area known",
    source: "quote",
    customer: { propertyType: "house", suburb: "Auburn", postcode: "2144" },
    product: { category: "not_sure", selectionState: "unknown" },
    area: { method: "known_total", areaM2: 60 },
    stairs: { answer: "no" },
    extras: { removal: "not_sure", disposal: "not_sure" },
    expectedReviewFlags: ["product_review", "removal_review", "disposal_review"]
  },
  {
    id: "area-not-sure-review-required",
    label: "Area not sure, review-required estimate",
    source: "quote",
    customer: { propertyType: "house", suburb: "Auburn", postcode: "2144" },
    product: { category: "hybrid", selectionState: "known" },
    area: { method: "not_sure" },
    stairs: { answer: "not_sure" },
    extras: { removal: "no", disposal: "no" },
    expectedReviewFlags: ["area_review", "stairs_review"]
  },
  {
    id: "product-handoff",
    label: "Product handoff from /products.html",
    source: "products",
    handoff: { from: "product", category: "hybrid", hash: "quoteForm" },
    product: { category: "hybrid", selectionState: "selected_from_products" },
    area: { method: "known_total", areaM2: 60 },
    expectedReviewFlags: []
  },
  {
    id: "floorplan-handoff",
    label: "Floorplan handoff into /quote.html",
    source: "floorplan",
    handoff: { quoteStep: 3, areaMethod: "floorplan_review" },
    product: { category: "hybrid", selectionState: "known" },
    area: { method: "floorplan_review", areaM2: 62 },
    expectedReviewFlags: ["floorplan_review"]
  },
  {
    id: "quote-review-handoff",
    label: "Quote-review handoff into /quote.html",
    source: "quote_review",
    handoff: { source: "quote_review" },
    product: { category: "hybrid", selectionState: "review_context" },
    area: { method: "known_total", areaM2: 60 },
    expectedReviewFlags: ["quote_review_context"]
  }
]);

module.exports = {
  PricingMigrationScenarios
};

