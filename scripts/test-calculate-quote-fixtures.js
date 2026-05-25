"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

process.env.OPERON_SUPABASE_SCHEMA_MODE = "legacy";
process.env.SUPABASE_URL = "https://fixture.supabase.test";
process.env.SUPABASE_SERVICE_ROLE_KEY = "fixture-server-key";
process.env.OPERON_ALLOWED_ORIGINS = "http://localhost:8000";

const { handler, _test } = require("../netlify/functions/calculate-quote");

const WEB_DIR = path.resolve(__dirname, "..", "apps", "web");
const FRONTEND_PRICING_DIR = path.resolve(__dirname, "..", "internal-tools", "frontend-pricing");

const fixtureTables = {
  pricing_categories: [
    {
      id: "hybrid",
      label: "Hybrid Flooring",
      short_description: "Hybrid flooring",
      default_price_per_m2: 44,
      page_url: "hybrid-flooring-sydney.html",
      active: true
    },
    {
      id: "laminate",
      label: "Laminate Flooring",
      short_description: "Laminate flooring",
      default_price_per_m2: 38,
      page_url: "laminate-flooring-sydney.html",
      active: true
    },
    {
      id: "engineered",
      label: "Engineered Timber",
      short_description: "Engineered timber",
      default_price_per_m2: 92,
      page_url: "engineered-timber-flooring-sydney.html",
      active: true
    }
  ],
  pricing_products: [
    {
      id: "hybrid-fixture-oak",
      category_id: "hybrid",
      range_id: "hybrid-fixture-range",
      brand: "Fixture",
      range_name: "Fixture Hybrid Oak",
      colour: "Natural Oak",
      price_per_m2: 50,
      install_rate_override: null,
      active: true,
      sort_order: 1
    },
    {
      id: "laminate-fixture-oak",
      category_id: "laminate",
      range_id: "laminate-fixture-range",
      brand: "Fixture",
      range_name: "Fixture Laminate Oak",
      colour: "Warm Oak",
      price_per_m2: 40,
      install_rate_override: null,
      active: true,
      sort_order: 2
    }
  ],
  pricing_install_rates: [
    {
      id: "hybrid-supply-floating",
      category_id: "hybrid",
      install_type: "standard",
      install_method: "floating",
      job_type: "supply_install",
      rate_per_m2: 28,
      minimum_charge: 0,
      active: true
    },
    {
      id: "hybrid-install-floating",
      category_id: "hybrid",
      install_type: "standard",
      install_method: "floating",
      job_type: "install_only",
      rate_per_m2: 30,
      minimum_charge: 0,
      active: true
    },
    {
      id: "laminate-supply-floating",
      category_id: "laminate",
      install_type: "standard",
      install_method: "floating",
      job_type: "supply_install",
      rate_per_m2: 26,
      minimum_charge: 0,
      active: true
    }
  ],
  pricing_underlay_options: [
    {
      id: "standard-underlay",
      name: "Standard underlay",
      price_per_m2: 4,
      active: true
    }
  ],
  pricing_trim_options: [],
  pricing_removal_rates: [
    {
      id: "floating-removal",
      floor_type: "floating",
      aliases: ["laminate", "hybrid"],
      rate_per_m2: 8,
      disposal_rate_per_m2: 4,
      disposal_fee: 0,
      active: true
    }
  ],
  pricing_location_zones: [
    {
      id: "default-zone",
      zone_name: "Default Sydney Zone",
      suburbs: [],
      postcodes: [],
      travel_fee: 0,
      minimum_job_fee: 0,
      surcharge_percent: 0,
      fallback: true,
      active: true
    }
  ],
  pricing_rules: [
    { rule_key: "standardWastagePercent", value_type: "number", value_numeric: 10 },
    { rule_key: "herringboneWastagePercent", value_type: "number", value_numeric: 20 },
    { rule_key: "underlayAreaBasis", value_type: "text", value_text: "chargeable_area" },
    { rule_key: "moistureBarrierRatePerM2", value_type: "number", value_numeric: 5 },
    { rule_key: "furnitureRatePerRoom", value_type: "number", value_numeric: 50 },
    { rule_key: "doorTrimmingRate", value_type: "number", value_numeric: 40 },
    { rule_key: "smallJobThresholdM2", value_type: "number", value_numeric: 30 },
    { rule_key: "smallJobFactor", value_type: "number", value_numeric: 1.1 },
    { rule_key: "minimumJobFee", value_type: "number", value_numeric: 0 },
    { rule_key: "roundingIncrement", value_type: "number", value_numeric: 1 }
  ],
  pricing_stair_rates: []
};

function createJsonResponse(payload, ok) {
  return {
    ok: ok !== false,
    status: ok === false ? 500 : 200,
    async json() {
      return payload;
    },
    async text() {
      return JSON.stringify(payload);
    }
  };
}

function installFetchMock() {
  global.fetch = async function (url, options) {
    const parsed = new URL(String(url));
    const table = parsed.pathname.split("/").pop();
    if (table === "operon_check_rate_limit") {
      return createJsonResponse({
        allowed: true,
        remaining: 119,
        resetAt: Date.now() + 600000
      });
    }
    if (Object.prototype.hasOwnProperty.call(fixtureTables, table)) {
      return createJsonResponse(fixtureTables[table]);
    }
    return createJsonResponse({ error: "Unexpected fixture table: " + table }, false);
  };
}

function loadFrontendCalculatorFixture() {
  const products = fixtureTables.pricing_products.map(function (product) {
    return {
      id: product.id,
      category: product.category_id,
      rangeId: product.range_id || "",
      brand: product.brand,
      range: product.range_name,
      colour: product.colour,
      pricePerM2: Number(product.price_per_m2 || 0),
      installRate: product.install_rate_override === null ? null : Number(product.install_rate_override || 0),
      active: product.active !== false
    };
  });
  const categories = fixtureTables.pricing_categories.reduce(function (accumulator, category) {
    accumulator[category.id] = {
      id: category.id,
      label: category.label,
      pricePerM2: Number(category.default_price_per_m2 || 0)
    };
    return accumulator;
  }, {});

  const context = {
    console,
    window: {},
    OperonProducts: {
      getProductById: function (id) {
        return products.find(function (product) { return product.id === id; }) || null;
      },
      getCategoryMeta: function (category) {
        return categories[category] || categories.hybrid;
      },
      getEstimateProduct: function (category) {
        const meta = categories[category] || categories.hybrid;
        const categoryProducts = products.filter(function (product) {
          return product.category === meta.id && product.pricePerM2 > 0;
        }).sort(function (left, right) {
          return left.pricePerM2 - right.pricePerM2;
        });
        const baseline = categoryProducts[0] || null;
        return {
          id: meta.id + "-estimate",
          category: meta.id,
          brand: "Operon Estimate",
          range: meta.label,
          colour: "Standard estimate",
          pricePerM2: baseline ? baseline.pricePerM2 : meta.pricePerM2,
          installRate: null,
          isEstimate: true,
          pricingMode: baseline ? "category" : "fallback",
          baselineProductId: baseline ? baseline.id : "",
          baselineProductLabel: baseline ? this.getProductLabel(baseline) : ""
        };
      },
      getProductLabel: function (product) {
        if (!product) return "";
        if (product.isEstimate) return product.range + " Estimate";
        return [product.range, product.colour].filter(Boolean).join(" — ");
      }
    },
    OperonInstallRates: {
      normaliseInstallType: function (value) {
        return value === "herringbone" || value === "chevron" ? "herringbone" : "standard";
      },
      normaliseInstallMethod: function (category, installType, installMethod) {
        if (category !== "engineered") return "floating";
        if (installType === "herringbone" || installType === "chevron") return "direct_glue";
        return installMethod === "direct_glue" || installMethod === "glue_down" ? "direct_glue" : "floating";
      },
      getInstallRate: function (request) {
        const targetType = this.normaliseInstallType(request.installType);
        const targetMethod = this.normaliseInstallMethod(request.category, request.installType, request.installMethod);
        const row = fixtureTables.pricing_install_rates.find(function (rate) {
          const rateType = rate.install_type === "floating" || rate.install_type === "glue_down" || rate.install_type === "direct_glue"
            ? "standard"
            : rate.install_type;
          const rateMethod = rate.category_id !== "engineered"
            ? "floating"
            : (rate.install_method || rate.install_type || "floating");
          return rate.category_id === request.category
            && rateType === targetType
            && rate.job_type === request.jobType
            && rateMethod === targetMethod;
        });
        return row ? {
          id: row.id,
          category: row.category_id,
          installType: row.install_type,
          installMethod: row.install_method,
          jobType: row.job_type,
          ratePerM2: Number(row.rate_per_m2 || 0),
          minimumCharge: Number(row.minimum_charge || 0),
          active: row.active !== false
        } : null;
      }
    },
    OperonUnderlay: {
      getUnderlayById: function (id) {
        const row = fixtureTables.pricing_underlay_options.find(function (option) {
          return option.id === id;
        });
        return row ? {
          id: row.id,
          name: row.name,
          pricePerM2: Number(row.price_per_m2 || 0)
        } : null;
      }
    },
    OperonSkirtingScotia: {
      getTrimOption: function () {
        return null;
      }
    },
    OperonRemovalRates: {
      getRemovalRate: function (floorType) {
        const lookup = String(floorType || "").replace(/_/g, " ");
        const row = fixtureTables.pricing_removal_rates.find(function (rate) {
          return rate.floor_type === floorType || rate.floor_type === lookup || (rate.aliases || []).indexOf(floorType) >= 0;
        });
        return row ? {
          id: row.id,
          floorType: row.floor_type,
          ratePerM2: Number(row.rate_per_m2 || 0),
          disposalRatePerM2: Number(row.disposal_rate_per_m2 || 0),
          disposalFee: Number(row.disposal_fee || 0)
        } : null;
      }
    },
    OperonLocationZones: {
      matchZone: function () {
        const row = fixtureTables.pricing_location_zones[0];
        return {
          zoneName: row.zone_name,
          travelFee: Number(row.travel_fee || 0),
          minimumJobFee: Number(row.minimum_job_fee || 0),
          surchargePercent: Number(row.surcharge_percent || 0)
        };
      }
    },
    OperonPricingRules: {
      rules: {
        standardWastagePercent: 10,
        herringboneWastagePercent: 20,
        underlayAreaBasis: "chargeable_area",
        moistureBarrierRatePerM2: 5,
        furnitureRatePerRoom: 50,
        doorTrimmingRate: 40,
        smallJobThresholdM2: 30,
        smallJobFactor: 1.1,
        minimumJobFee: 0,
        roundingIncrement: 1,
        floorPrepRates: {}
      },
      getWastageMultiplier: function (pattern) {
        return pattern === "herringbone" || pattern === "chevron" ? 1.2 : 1.1;
      }
    },
    OperonStairRates: {
      getInstallationOnlyRangeId: function (category) {
        return "installation-only-" + category;
      },
      getRateSet: function () {
        return null;
      },
      getTierForWidth: function () {
        return { tier: "short", assumed: true };
      },
      getStairType: function (type) {
        return { label: type };
      },
      getPrice: function () {
        return 0;
      }
    }
  };
  context.window = context;
  vm.runInNewContext(
    fs.readFileSync(path.join(FRONTEND_PRICING_DIR, "quoteCalculator.js"), "utf8"),
    context,
    { filename: "quoteCalculator.js" }
  );
  return context.OperonQuoteCalculator;
}

function createEvent(payload) {
  return {
    httpMethod: "POST",
    headers: {
      origin: "http://localhost:8000",
      "x-nf-client-connection-ip": "127.0.0.1"
    },
    body: JSON.stringify(payload)
  };
}

async function callCalculateQuote(payload) {
  const response = await handler(createEvent(payload));
  assert.strictEqual(response.statusCode, 200, response.body);
  return JSON.parse(response.body);
}

function assertCustomerSafeResponse(payload) {
  const forbidden = [
    "labourSubtotalBeforeMultipliers",
    "labourSubtotalAfterMultipliers",
    "accessFactor",
    "smallJobFactor",
    "zoneMultiplier",
    "locationSurchargePercent",
    "minimumJobFee",
    "roundingAdjustment",
    "minimumChargeApplied",
    "travelFeeTotal",
    "locationTotal",
    "installationAdjustedTotal",
    "pricingSourceProductId",
    "pricingSourceProductLabel",
    "installRate",
    "supplierUrl",
    "supplier",
    "margin"
  ];
  const text = JSON.stringify(payload);
  forbidden.forEach(function (key) {
    assert.strictEqual(text.indexOf(key), -1, "Response leaked internal key: " + key);
  });
  assert.strictEqual(payload.ok, true);
  assert.strictEqual(payload.source, "server_backend_pricing");
  assert.ok(Array.isArray(payload.lineItems), "lineItems should be an array");
  payload.lineItems.forEach(function (line) {
    assert.deepStrictEqual(Object.keys(line).sort(), ["label", "qty", "total"]);
  });
}

function getPositiveFrontendLineCount(result) {
  return Array.isArray(result && result.quoteLines)
    ? result.quoteLines.filter(function (line) {
      return Number(line && line.amount || 0) > 0;
    }).length
    : 0;
}

async function assertShadowComparisonFixture(name, calculator, payload, expected) {
  const frontendInput = _test.normalizeCalculateQuoteInput(payload);
  const frontendResult = calculator.calculateQuote(frontendInput);
  const backendResult = await callCalculateQuote(payload);

  assertCustomerSafeResponse(backendResult);
  assert.strictEqual(
    Number(frontendResult.totalIncGst.toFixed(2)),
    Number(backendResult.estimateTotal.toFixed(2)),
    name + " frontend/backend totals should match"
  );
  assert.strictEqual(
    getPositiveFrontendLineCount(frontendResult),
    backendResult.lineItems.length,
    name + " frontend/backend positive line item count should match"
  );
  if (expected && expected.backendConfidence) {
    assert.strictEqual(backendResult.quoteConfidence, expected.backendConfidence, name + " backend confidence should match");
  }
  if (expected && expected.estimateStatus) {
    assert.strictEqual(backendResult.estimateStatus, expected.estimateStatus, name + " estimate status should match");
  }
}

async function testSupplyInstallFixture() {
  const result = await callCalculateQuote({
    quoteType: "supply_install",
    category: "hybrid",
    selectedProductId: "hybrid-fixture-oak",
    area: 50,
    suburb: "Parramatta",
    postcode: "2150",
    propertyType: "house",
    scope: {
      removal: "no",
      floorPrep: "no",
      stairs: "no"
    },
    underlayId: "standard-underlay"
  });

  assertCustomerSafeResponse(result);
  assert.strictEqual(result.estimateStatus, "ready");
  assert.strictEqual(result.quoteConfidence, "high");
  assert.strictEqual(result.estimateTotal, 4807);
  assert.deepStrictEqual(result.itemsToConfirm, []);
  assert.ok(result.includedScope.indexOf("Fixture Hybrid Oak supply") >= 0);
}

async function testInstallOnlyReviewFixture() {
  const result = await callCalculateQuote({
    quoteType: "installation_only",
    category: "hybrid",
    area: 24,
    postcode: "2000",
    propertyType: "apartment",
    level: "level_2_plus",
    hasLift: "no",
    scope: {
      removal: "not_sure",
      floorPrep: "not_sure",
      stairs: "not_sure",
      parkingAccess: "unsure"
    }
  });

  assertCustomerSafeResponse(result);
  assert.strictEqual(result.estimateStatus, "review_needed");
  assert.strictEqual(result.quoteConfidence, "medium");
  assert.ok(result.estimateTotal > 0);
  assert.ok(result.itemsToConfirm.indexOf("Existing floor removal") >= 0);
  assert.ok(result.itemsToConfirm.indexOf("Floor preparation") >= 0);
  assert.ok(result.itemsToConfirm.indexOf("Stairs or step areas") >= 0);
}

async function testUnknownAreaFixture() {
  const result = await callCalculateQuote({
    quoteType: "supply_install",
    category: "laminate",
    selectedProductId: "laminate-fixture-oak",
    postcode: "2150",
    propertyType: "house"
  });

  assertCustomerSafeResponse(result);
  assert.strictEqual(result.estimateStatus, "pending");
  assert.strictEqual(result.quoteConfidence, "not_ready");
  assert.strictEqual(result.estimateTotal, 0);
  assert.ok(result.itemsToConfirm.indexOf("Flooring area") >= 0);
}

async function testShadowComparisonFixtures() {
  const calculator = loadFrontendCalculatorFixture();

  await assertShadowComparisonFixture("hybrid supply install with underlay", calculator, {
    quoteType: "supply_install",
    category: "hybrid",
    selectedProductId: "hybrid-fixture-oak",
    area: 50,
    suburb: "Parramatta",
    postcode: "2150",
    propertyType: "house",
    scope: {
      removal: "no",
      floorPrep: "no",
      stairs: "no"
    },
    underlayId: "standard-underlay"
  }, {
    backendConfidence: "high",
    estimateStatus: "ready"
  });

  await assertShadowComparisonFixture("laminate supply install with removal", calculator, {
    quoteType: "supply_install",
    category: "laminate",
    selectedProductId: "laminate-fixture-oak",
    area: 35,
    postcode: "2150",
    propertyType: "house",
    scope: {
      removal: "yes",
      existingFloorType: "floating",
      disposal: "yes",
      floorPrep: "no",
      stairs: "no"
    }
  }, {
    backendConfidence: "high",
    estimateStatus: "ready"
  });

  await assertShadowComparisonFixture("hybrid install only with review items", calculator, {
    quoteType: "installation_only",
    category: "hybrid",
    area: 24,
    postcode: "2000",
    propertyType: "apartment",
    level: "level_2_plus",
    hasLift: "no",
    scope: {
      removal: "not_sure",
      floorPrep: "not_sure",
      stairs: "not_sure",
      parkingAccess: "unsure"
    }
  }, {
    backendConfidence: "medium",
    estimateStatus: "review_needed"
  });
}

function testRequestNormalization() {
  const normalized = _test.normalizeCalculateQuoteInput({
    quoteType: "installation only",
    flooringCategory: "engineered timber",
    area: "42",
    pattern: "herringbone",
    installMethod: "floating",
    propertyType: "apartment",
    scope: {
      removal: "yes",
      existingFloorType: "floating floor",
      floorPreparation: "not sure"
    }
  });

  assert.strictEqual(normalized.quoteMode, "install_only");
  assert.strictEqual(normalized.category, "engineered");
  assert.strictEqual(normalized.realArea, 42);
  assert.strictEqual(normalized.pattern, "herringbone");
  assert.strictEqual(normalized.installMethod, "direct_glue");
  assert.strictEqual(normalized.propertyType, "unit_apartment");
  assert.strictEqual(normalized.removalOption, "floating_floor");
  assert.strictEqual(normalized.floorPrepType, "unsure");
}

async function main() {
  installFetchMock();
  testRequestNormalization();
  await testSupplyInstallFixture();
  await testInstallOnlyReviewFixture();
  await testUnknownAreaFixture();
  await testShadowComparisonFixtures();
  console.log("calculate-quote fixture tests passed");
}

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});
