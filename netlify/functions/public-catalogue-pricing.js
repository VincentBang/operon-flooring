"use strict";

const { jsonResponse, loadPricingLibrary } = require("./_supabasePricing");

function sanitiseCategoryMap(categoryMap) {
  return Object.keys(categoryMap || {}).reduce(function (accumulator, key) {
    const category = categoryMap[key];
    accumulator[key] = {
      id: category.id,
      label: category.label,
      shortDescription: category.shortDescription || "",
      pricePerM2: Number(category.pricePerM2 || 0),
      pageUrl: category.pageUrl || ""
    };
    return accumulator;
  }, {});
}

function sanitiseProducts(productsByCategory) {
  return Object.keys(productsByCategory || {}).reduce(function (accumulator, category) {
    accumulator[category] = (productsByCategory[category] || []).map(function (product) {
      return {
        id: product.id,
        category: product.category,
        brand: product.brand,
        range: product.range,
        colour: product.colour,
        tone: product.tone || "",
        swatch: product.swatch || "",
        thickness: product.thickness || "",
        productType: product.productType || "",
        pricePerM2: Number(product.pricePerM2 || 0),
        imageUrl: product.imageUrl || product.image || "",
        image: product.image || product.imageUrl || "",
        alt: product.alt || "",
        description: product.description || "",
        features: Array.isArray(product.features) ? product.features : [],
        suitableFor: Array.isArray(product.suitableFor) ? product.suitableFor : [],
        active: product.active !== false
      };
    });
    return accumulator;
  }, {});
}

exports.handler = async function () {
  try {
    const library = await loadPricingLibrary();
    return jsonResponse(200, {
      ok: true,
      source: "supabase_public_catalogue",
      categoryMeta: sanitiseCategoryMap(library.categoryMap),
      products: sanitiseProducts(library.productsByCategory)
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Public catalogue pricing load failed."
    });
  }
};
