"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "../..");
const WEB_DIR = path.join(ROOT, "apps/web");
const OUT_FILE = path.join(ROOT, "supabase/seed_pricing.sql");

function loadBrowserModules() {
  const context = {
    console,
    window: {},
    document: {
      getElementById: function () { return null; },
      body: { classList: { add: function () {}, remove: function () {} } }
    },
    localStorage: {
      getItem: function () { return null; },
      setItem: function () {},
      removeItem: function () {}
    }
  };
  context.window = context;

  [
    "products.js",
    "installRates.js",
    "underlay.js",
    "skirtingScotia.js",
    "removalRates.js",
    "locationZones.js",
    "pricingRules.js"
  ].forEach(function (file) {
    vm.runInNewContext(
      fs.readFileSync(path.join(WEB_DIR, file), "utf8"),
      context,
      { filename: file }
    );
  });

  return context;
}

function q(value) {
  if (value === null || typeof value === "undefined") {
    return "null";
  }
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : "0";
}

function bool(value) {
  return value === false ? "false" : "true";
}

function json(value) {
  return q(JSON.stringify(value == null ? null : value)) + "::jsonb";
}

function textArray(value) {
  const list = Array.isArray(value) ? value : [];
  return "array[" + list.map(q).join(", ") + "]::text[]";
}

function slug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ruleRows(rules) {
  return Object.keys(rules).map(function (key) {
    const value = rules[key];
    let valueType = "text";
    let valueNumeric = "null";
    let valueBoolean = "null";
    let valueText = "null";

    if (typeof value === "number") {
      valueType = "number";
      valueNumeric = num(value);
    } else if (typeof value === "boolean") {
      valueType = "boolean";
      valueBoolean = bool(value);
    } else if (typeof value === "object") {
      valueType = "json";
      valueText = q(JSON.stringify(value));
    } else {
      valueText = q(value);
    }

    return {
      rule_key: key,
      rule_value: value,
      description: "Synced from apps/web/pricingRules.js",
      value_type: valueType,
      value_numeric: valueNumeric,
      value_boolean: valueBoolean,
      value_text: valueText
    };
  });
}

function buildSql() {
  const context = loadBrowserModules();
  const productsApi = context.OperonProducts;
  const categories = productsApi.getCategoryList();
  const products = productsApi.getAllProducts();
  const ranges = categories.flatMap(function (category) {
    return productsApi.getRangesByCategory(category.id);
  });
  const installRates = context.OperonInstallRates.list();
  const underlay = context.OperonUnderlay.list();
  const trims = context.OperonSkirtingScotia.list();
  const removals = context.OperonRemovalRates.list();
  const zones = context.OperonLocationZones.list();
  const rules = context.OperonPricingRules.rules;
  const ruleData = ruleRows(rules);

  const lines = [];
  lines.push("-- Operon Flooring protective seed/upsert script.");
  lines.push("-- Generated from apps/web/*.js local fallback modules.");
  lines.push("-- Safe strategy: insert missing rows, update metadata, preserve existing Supabase numeric prices/rates on conflict.");
  lines.push("-- Run after supabase/migrations/20260502_operon_pricing_lead_schema.sql.");
  lines.push("-- Hybrid currently has confirmed product rows in JS; laminate and engineered remain category estimates until real ranges are added.");
  lines.push("");
  lines.push("begin;");
  lines.push("");

  lines.push("insert into public.product_ranges (range_id, category, brand, range_label, selection_mode, default_product_id, is_default_recommendation, customer_description, features, image_url, active, display_order)");
  lines.push("values");
  lines.push(ranges.map(function (range, index) {
    const representative = productsApi.getRepresentativeProductByRangeId(range.rangeId) || {};
    return "  (" + [
      q(range.rangeId),
      q(range.category),
      q(representative.brand || range.brand || range.rangeLabel),
      q(range.rangeLabel),
      q(range.selectionMode || "range_only"),
      q((range.representativeProductId || representative.id || "")),
      bool(!!range.isDefaultRecommendation),
      q(range.customerLabel || range.rangeLabel),
      json(representative.features || []),
      q(representative.imageUrl || representative.image || ""),
      "true",
      String((index + 1) * 10)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (range_id) do update set");
  lines.push("  category = excluded.category,");
  lines.push("  brand = excluded.brand,");
  lines.push("  range_label = excluded.range_label,");
  lines.push("  selection_mode = excluded.selection_mode,");
  lines.push("  default_product_id = excluded.default_product_id,");
  lines.push("  is_default_recommendation = excluded.is_default_recommendation,");
  lines.push("  customer_description = excluded.customer_description,");
  lines.push("  features = excluded.features,");
  lines.push("  image_url = excluded.image_url,");
  lines.push("  active = excluded.active,");
  lines.push("  display_order = excluded.display_order;");
  lines.push("");

  lines.push("insert into public.products (product_id, range_id, category, brand, range_label, colour, thickness, price_per_m2, image_url, alt_text, features, selection_mode, is_default_recommendation, active, display_order)");
  lines.push("values");
  lines.push(products.map(function (product, index) {
    return "  (" + [
      q(product.id),
      q(product.rangeId || ""),
      q(product.category),
      q(product.brand || ""),
      q(product.rangeLabel || product.range || ""),
      q(product.colour || ""),
      q(product.thickness || ""),
      num(product.pricePerM2),
      q(product.imageUrl || product.image || ""),
      q(product.imageAlt || product.alt || ""),
      json(product.features || []),
      q(product.selectionMode || "range_only"),
      bool(!!product.isDefaultRecommendation),
      bool(product.active !== false),
      String((index + 1) * 10)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (product_id) do update set");
  lines.push("  range_id = excluded.range_id,");
  lines.push("  category = excluded.category,");
  lines.push("  brand = excluded.brand,");
  lines.push("  range_label = excluded.range_label,");
  lines.push("  colour = excluded.colour,");
  lines.push("  thickness = excluded.thickness,");
  lines.push("  price_per_m2 = coalesce(public.products.price_per_m2, excluded.price_per_m2),");
  lines.push("  image_url = excluded.image_url,");
  lines.push("  alt_text = excluded.alt_text,");
  lines.push("  features = excluded.features,");
  lines.push("  selection_mode = excluded.selection_mode,");
  lines.push("  is_default_recommendation = excluded.is_default_recommendation,");
  lines.push("  active = excluded.active,");
  lines.push("  display_order = excluded.display_order;");
  lines.push("");

  lines.push("insert into public.install_rates (category, install_type, install_method, job_type, rate_per_m2, minimum_charge, active)");
  lines.push("values");
  lines.push(installRates.map(function (rate) {
    return "  (" + [
      q(rate.category),
      q(rate.installType || "standard"),
      q(rate.installMethod || "floating"),
      q(rate.jobType || "supply_install"),
      num(rate.ratePerM2),
      num(rate.minimumCharge),
      bool(rate.active !== false)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (category, install_type, install_method, job_type) do update set");
  lines.push("  minimum_charge = coalesce(public.install_rates.minimum_charge, excluded.minimum_charge),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.underlay_options (underlay_id, name, suitable_categories, price_per_m2, active)");
  lines.push("values");
  lines.push(underlay.map(function (item) {
    return "  (" + [q(item.id), q(item.name), textArray(item.suitableCategories), num(item.pricePerM2), bool(item.active !== false)].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (underlay_id) do update set");
  lines.push("  name = excluded.name,");
  lines.push("  suitable_categories = excluded.suitable_categories,");
  lines.push("  price_per_m2 = coalesce(public.underlay_options.price_per_m2, excluded.price_per_m2),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.skirting_scotia_options (option_id, type, form_value, material, pricing_method, price, active)");
  lines.push("values");
  lines.push(trims.map(function (item) {
    return "  (" + [q(item.id), q(item.type), q(item.formValue || ""), q(item.material || ""), q(item.pricingMethod), num(item.price), bool(item.active !== false)].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (option_id) do update set");
  lines.push("  type = excluded.type,");
  lines.push("  form_value = excluded.form_value,");
  lines.push("  material = excluded.material,");
  lines.push("  pricing_method = excluded.pricing_method,");
  lines.push("  price = coalesce(public.skirting_scotia_options.price, excluded.price),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.removal_rates (removal_id, floor_type, aliases, rate_per_m2, disposal_fee, active)");
  lines.push("values");
  lines.push(removals.map(function (item) {
    return "  (" + [q(item.id), q(item.floorType), textArray(item.aliases || []), num(item.ratePerM2), num(item.disposalFee), bool(item.active !== false)].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (removal_id) do update set");
  lines.push("  floor_type = excluded.floor_type,");
  lines.push("  aliases = excluded.aliases,");
  lines.push("  rate_per_m2 = coalesce(public.removal_rates.rate_per_m2, excluded.rate_per_m2),");
  lines.push("  disposal_fee = coalesce(public.removal_rates.disposal_fee, excluded.disposal_fee),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.location_zones (zone_id, zone_name, suburbs, postcodes, distance_from_base_km, travel_fee, minimum_job_fee, surcharge_percent, fallback, active)");
  lines.push("values");
  lines.push(zones.map(function (zone) {
    const zoneId = slug(zone.zoneName);
    return "  (" + [
      q(zoneId),
      q(zone.zoneName),
      textArray(zone.suburbs || []),
      textArray(zone.postcodes || []),
      num(zone.distanceFromBaseKm),
      num(zone.travelFee),
      num(zone.minimumJobFee),
      num(zone.surchargePercent),
      bool(!!zone.fallback),
      bool(zone.active !== false)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (zone_id) do update set");
  lines.push("  zone_name = excluded.zone_name,");
  lines.push("  suburbs = excluded.suburbs,");
  lines.push("  postcodes = excluded.postcodes,");
  lines.push("  distance_from_base_km = coalesce(public.location_zones.distance_from_base_km, excluded.distance_from_base_km),");
  lines.push("  travel_fee = coalesce(public.location_zones.travel_fee, excluded.travel_fee),");
  lines.push("  minimum_job_fee = coalesce(public.location_zones.minimum_job_fee, excluded.minimum_job_fee),");
  lines.push("  surcharge_percent = coalesce(public.location_zones.surcharge_percent, excluded.surcharge_percent),");
  lines.push("  fallback = excluded.fallback,");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.pricing_rules (rule_key, rule_value, description, active, value_type, value_numeric, value_boolean, value_text, notes)");
  lines.push("values");
  lines.push(ruleData.map(function (rule) {
    return "  (" + [
      q(rule.rule_key),
      json(rule.rule_value),
      q(rule.description),
      "true",
      q(rule.value_type),
      rule.value_numeric,
      rule.value_boolean,
      rule.value_text,
      q(rule.description)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (rule_key) do update set");
  lines.push("  rule_value = excluded.rule_value,");
  lines.push("  description = excluded.description,");
  lines.push("  active = excluded.active,");
  lines.push("  value_type = excluded.value_type,");
  lines.push("  value_numeric = excluded.value_numeric,");
  lines.push("  value_boolean = excluded.value_boolean,");
  lines.push("  value_text = excluded.value_text,");
  lines.push("  notes = excluded.notes;");
  lines.push("");

  lines.push("-- Compatibility seed for existing pricing_* tables used by current Netlify helper functions.");
  lines.push("insert into public.pricing_categories (id, label, short_description, default_price_per_m2, page_url, active)");
  lines.push("values");
  lines.push(categories.map(function (category) {
    return "  (" + [q(category.id), q(category.label), q(category.shortDescription || ""), num(category.pricePerM2), q(category.pageUrl || ""), "true"].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (id) do update set");
  lines.push("  label = excluded.label,");
  lines.push("  short_description = excluded.short_description,");
  lines.push("  default_price_per_m2 = coalesce(public.pricing_categories.default_price_per_m2, excluded.default_price_per_m2),");
  lines.push("  page_url = excluded.page_url,");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.pricing_products (id, category_id, brand, range_name, colour, tone, swatch, thickness, product_type, price_per_m2, install_rate_override, image_url, alt_text, description, features, suitable_for, supplier, supplier_url, active, sort_order)");
  lines.push("values");
  lines.push(products.map(function (product, index) {
    return "  (" + [
      q(product.id),
      q(product.category),
      q(product.brand || ""),
      q(product.range || product.rangeLabel || ""),
      q(product.colour || ""),
      q(product.tone || ""),
      q(product.swatch || ""),
      q(product.thickness || ""),
      q(product.productType || ""),
      num(product.pricePerM2),
      product.installRate == null ? "null" : num(product.installRate),
      q(product.imageUrl || product.image || ""),
      q(product.imageAlt || product.alt || ""),
      q(product.description || ""),
      json(product.features || []),
      json(product.suitableFor || []),
      q(product.supplier || ""),
      q(product.supplierUrl || ""),
      bool(product.active !== false),
      String((index + 1) * 10)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (id) do update set");
  lines.push("  category_id = excluded.category_id,");
  lines.push("  brand = excluded.brand,");
  lines.push("  range_name = excluded.range_name,");
  lines.push("  colour = excluded.colour,");
  lines.push("  tone = excluded.tone,");
  lines.push("  swatch = excluded.swatch,");
  lines.push("  thickness = excluded.thickness,");
  lines.push("  product_type = excluded.product_type,");
  lines.push("  price_per_m2 = coalesce(public.pricing_products.price_per_m2, excluded.price_per_m2),");
  lines.push("  install_rate_override = coalesce(public.pricing_products.install_rate_override, excluded.install_rate_override),");
  lines.push("  image_url = excluded.image_url,");
  lines.push("  alt_text = excluded.alt_text,");
  lines.push("  description = excluded.description,");
  lines.push("  features = excluded.features,");
  lines.push("  suitable_for = excluded.suitable_for,");
  lines.push("  supplier = excluded.supplier,");
  lines.push("  supplier_url = excluded.supplier_url,");
  lines.push("  active = excluded.active,");
  lines.push("  sort_order = excluded.sort_order;");
  lines.push("");

  lines.push("insert into public.pricing_install_rates (id, category_id, install_type, install_method, job_type, rate_per_m2, minimum_charge, active)");
  lines.push("values");
  lines.push(installRates.map(function (rate) {
    const method = rate.installMethod || "floating";
    const idParts = [rate.category, rate.installType || "standard"];
    if (method !== "floating") {
      idParts.push(method);
    }
    idParts.push(rate.jobType || "supply_install");
    return "  (" + [
      q(slug(idParts.join("-"))),
      q(rate.category),
      q(rate.installType || "standard"),
      q(method),
      q(rate.jobType || "supply_install"),
      num(rate.ratePerM2),
      num(rate.minimumCharge),
      bool(rate.active !== false)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (id) do update set");
  lines.push("  category_id = excluded.category_id,");
  lines.push("  install_type = excluded.install_type,");
  lines.push("  install_method = excluded.install_method,");
  lines.push("  job_type = excluded.job_type,");
  lines.push("  rate_per_m2 = coalesce(public.pricing_install_rates.rate_per_m2, excluded.rate_per_m2),");
  lines.push("  minimum_charge = coalesce(public.pricing_install_rates.minimum_charge, excluded.minimum_charge),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.pricing_underlay_options (id, name, suitable_categories, price_per_m2, active)");
  lines.push("values");
  lines.push(underlay.map(function (item) {
    return "  (" + [
      q(item.id),
      q(item.name),
      json(item.suitableCategories || []),
      num(item.pricePerM2),
      bool(item.active !== false)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (id) do update set");
  lines.push("  name = excluded.name,");
  lines.push("  suitable_categories = excluded.suitable_categories,");
  lines.push("  price_per_m2 = coalesce(public.pricing_underlay_options.price_per_m2, excluded.price_per_m2),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.pricing_trim_options (id, type, form_value, material, pricing_method, price, active)");
  lines.push("values");
  lines.push(trims.map(function (item) {
    return "  (" + [
      q(item.id),
      q(item.type),
      q(item.formValue || ""),
      q(item.material || ""),
      q(item.pricingMethod || "allowance_per_m2"),
      num(item.price),
      bool(item.active !== false)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (id) do update set");
  lines.push("  type = excluded.type,");
  lines.push("  form_value = excluded.form_value,");
  lines.push("  material = excluded.material,");
  lines.push("  pricing_method = excluded.pricing_method,");
  lines.push("  price = coalesce(public.pricing_trim_options.price, excluded.price),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.pricing_removal_rates (id, floor_type, aliases, rate_per_m2, disposal_fee, active)");
  lines.push("values");
  lines.push(removals.map(function (item) {
    return "  (" + [
      q(item.id),
      q(item.floorType),
      json(item.aliases || []),
      num(item.ratePerM2),
      num(item.disposalFee),
      bool(item.active !== false)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (id) do update set");
  lines.push("  floor_type = excluded.floor_type,");
  lines.push("  aliases = excluded.aliases,");
  lines.push("  rate_per_m2 = coalesce(public.pricing_removal_rates.rate_per_m2, excluded.rate_per_m2),");
  lines.push("  disposal_fee = coalesce(public.pricing_removal_rates.disposal_fee, excluded.disposal_fee),");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("insert into public.pricing_location_zones (id, zone_name, suburbs, postcodes, distance_from_base_km, travel_fee, minimum_job_fee, surcharge_percent, fallback, active)");
  lines.push("values");
  lines.push(zones.map(function (zone) {
    return "  (" + [
      q(slug(zone.zoneName)),
      q(zone.zoneName),
      json(zone.suburbs || []),
      json(zone.postcodes || []),
      num(zone.distanceFromBaseKm),
      num(zone.travelFee),
      num(zone.minimumJobFee),
      num(zone.surchargePercent),
      bool(!!zone.fallback),
      bool(zone.active !== false)
    ].join(", ") + ")";
  }).join(",\n"));
  lines.push("on conflict (id) do update set");
  lines.push("  zone_name = excluded.zone_name,");
  lines.push("  suburbs = excluded.suburbs,");
  lines.push("  postcodes = excluded.postcodes,");
  lines.push("  distance_from_base_km = coalesce(public.pricing_location_zones.distance_from_base_km, excluded.distance_from_base_km),");
  lines.push("  travel_fee = coalesce(public.pricing_location_zones.travel_fee, excluded.travel_fee),");
  lines.push("  minimum_job_fee = coalesce(public.pricing_location_zones.minimum_job_fee, excluded.minimum_job_fee),");
  lines.push("  surcharge_percent = coalesce(public.pricing_location_zones.surcharge_percent, excluded.surcharge_percent),");
  lines.push("  fallback = excluded.fallback,");
  lines.push("  active = excluded.active;");
  lines.push("");

  lines.push("commit;");
  lines.push("");
  return lines.join("\n");
}

fs.writeFileSync(OUT_FILE, buildSql());
console.log("Wrote " + path.relative(ROOT, OUT_FILE));
