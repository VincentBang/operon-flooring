"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WEB_DIR = path.resolve(__dirname, "..", "..", "..", "apps", "web");
const FRONTEND_PRICING_DIR = path.resolve(__dirname, "..", "..", "..", "internal-tools", "frontend-pricing");

function loadCalculator() {
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
    path.join(WEB_DIR, "pricingSource.js"),
    path.join(WEB_DIR, "products.js"),
    path.join(FRONTEND_PRICING_DIR, "installRates.js"),
    path.join(WEB_DIR, "underlay.js"),
    path.join(WEB_DIR, "skirtingScotia.js"),
    path.join(FRONTEND_PRICING_DIR, "removalRates.js"),
    path.join(FRONTEND_PRICING_DIR, "locationZones.js"),
    path.join(FRONTEND_PRICING_DIR, "pricingRules.js"),
    path.join(FRONTEND_PRICING_DIR, "stairRates.js"),
    path.join(FRONTEND_PRICING_DIR, "quoteCalculator.js")
  ].forEach(function (file) {
    vm.runInNewContext(
      fs.readFileSync(file, "utf8"),
      context,
      { filename: path.basename(file) }
    );
  });

  return context;
}

function baseInput(overrides) {
  return Object.assign({
    quoteMode: "supply_install",
    jobType: "supply_install",
    realArea: 50,
    category: "hybrid",
    pattern: "standard",
    installMethod: "floating",
    postcode: "2144",
    propertyType: "house",
    removalOption: "none",
    removalDisposal: "",
    floorPrepType: "none",
    skirtingOption: "no",
    scotiaOption: "no",
    moistureBarrier: "no",
    furnitureType: "no",
    doorTrimming: "no"
  }, overrides || {});
}

function assertMoney(actual, expected, message) {
  assert.strictEqual(Number(actual.toFixed(2)), Number(expected.toFixed(2)), message);
}

const context = loadCalculator();
const calculator = context.OperonQuoteCalculator;

const herringboneStairRateSet = context.OperonStairRates.getRateSet("engineered-swish-oak-natura-herringbone");
assert.strictEqual(
  context.OperonStairRates.getGuideWidthMm(herringboneStairRateSet),
  950,
  "Engineered herringbone stair guide should use matching straight plank length / 2"
);

let result = calculator.calculateQuote(baseInput());
assertMoney(result.materialTotal, 2860, "Supply & Install should include material on chargeable area");
assertMoney(result.installationTotal, 1550, "Supply & Install should include installation on real area");

result = calculator.calculateQuote(baseInput({
  quoteMode: "install_only",
  jobType: "install_only"
}));
assertMoney(result.materialTotal, 0, "Installation Only should exclude material");
assertMoney(result.installationTotal, 2250, "Installation Only should include install-only labour");

context.OperonRemovalRates.getRemovalRate = function () {
  return {
    id: "remove-carpet",
    floorType: "carpet",
    ratePerM2: 4,
    disposalFee: 4,
    active: true
  };
};

result = calculator.calculateQuote(baseInput({
  removalOption: "carpet",
  removalDisposal: "no"
}));
assertMoney(result.removalTotal, 200, "Removal should use real area");
assertMoney(result.disposalTotal, 0, "Disposal should be zero when not selected");

result = calculator.calculateQuote(baseInput({
  removalOption: "carpet",
  removalDisposal: "yes"
}));
assertMoney(result.removalTotal, 200, "Removal should stay separate from disposal");
assertMoney(result.disposalTotal, 200, "Disposal should use disposal_fee as per-m2 rate");

result = calculator.calculateQuote(baseInput({
  category: "engineered",
  pattern: "herringbone",
  installMethod: "direct_glue"
}));
assertMoney(result.chargeableArea, 60, "Herringbone should apply 20% wastage to material area");
assertMoney(result.installationTotal, 2600, "Herringbone labour should use real area with herringbone rate");

context.OperonInstallRates.getInstallRate = function () {
  return null;
};
result = calculator.calculateQuote(baseInput());
assert(result.warnings.includes("Installation rate requires review."), "Missing install rate should warn");
assertMoney(result.installationTotal, 0, "Missing install rate should not invent labour");

context.OperonInstallRates.getInstallRate = function () {
  return {
    id: "install-hybrid-standard-install-only",
    category: "hybrid",
    installType: "standard",
    installMethod: "floating",
    jobType: "supply_install",
    ratePerM2: 25,
    minimumCharge: 0,
    active: true
  };
};
context.OperonStairRates.getRateSet = function () {
  return {
    rangeId: "hybrid-etf-7mm",
    category: "hybrid",
    guideWidthMm: 1200,
    priceTiers: {
      straight_tread: { short: 100, long: 140 },
      winder_tread: { short: 120, long: 160 },
      landing_1m2: { short: 180, long: 240 },
      landing_2m2: { short: 300, long: 380 },
      one_side_open: { short: 150, long: 190 },
      two_side_open: { short: 200, long: 260 }
    },
    active: true
  };
};
result = calculator.calculateQuote(baseInput({
  selectedRangeId: "hybrid-etf-7mm",
  stairs: "yes",
  stairWidthKnown: "yes",
  stairWidthMm: 1000,
  stairDetails: [
    { type: "straight_tread", quantity: 2 },
    { type: "winder_tread", quantity: 1 }
  ]
}));
assertMoney(result.stairsTotal, 320, "Stairs should use short tier when width is within guide");

result = calculator.calculateQuote(baseInput({
  selectedRangeId: "hybrid-etf-7mm",
  stairs: "yes",
  stairWidthKnown: "yes",
  stairWidthMm: 1300,
  stairDetails: [
    { type: "straight_tread", quantity: 2 }
  ]
}));
assertMoney(result.stairsTotal, 280, "Stairs should use long tier when width is over guide");

console.log("quoteCalculator validation passed");
