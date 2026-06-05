const assert = require("assert");
const { PricingMigrationScenarios } = require("../../fixtures/pricingMigrationScenarios");

const requiredScenarioIds = [
  "house-hybrid-60-no-extras",
  "apartment-laminate-45-access-notes",
  "engineered-timber-80-stairs",
  "hybrid-carpet-removal-disposal",
  "floating-removal-disposal-not-sure",
  "glue-down-timber-removal",
  "tile-removal",
  "product-not-sure-area-known",
  "area-not-sure-review-required",
  "product-handoff",
  "floorplan-handoff",
  "quote-review-handoff"
];

const forbiddenTerms = [
  "pricePerM2",
  "installRate",
  "removalRate",
  "stairRate",
  "supplierCost",
  "supplierUrl",
  "margin",
  "markup",
  "accessFactor",
  "pricingRules",
  "internalRate"
];

function main() {
  assert.ok(Array.isArray(PricingMigrationScenarios), "Pricing migration scenarios should be an array.");
  assert.strictEqual(
    PricingMigrationScenarios.length,
    requiredScenarioIds.length,
    "Pricing migration fixture count should match the approved Stage 4 scenario list."
  );

  const ids = PricingMigrationScenarios.map(function (scenario) {
    return scenario.id;
  });
  requiredScenarioIds.forEach(function (id) {
    assert.ok(ids.includes(id), "Pricing migration scenarios missing `" + id + "`.");
  });
  assert.strictEqual(new Set(ids).size, ids.length, "Pricing migration scenario IDs must be unique.");

  const serialized = JSON.stringify(PricingMigrationScenarios);
  forbiddenTerms.forEach(function (term) {
    assert.strictEqual(
      serialized.includes(term),
      false,
      "Pricing migration fixtures must not include private pricing field `" + term + "`."
    );
  });

  PricingMigrationScenarios.forEach(function (scenario) {
    assert.ok(scenario.label, "Scenario `" + scenario.id + "` should have a label.");
    assert.ok(scenario.source, "Scenario `" + scenario.id + "` should have a source.");
    assert.ok(scenario.product, "Scenario `" + scenario.id + "` should include product state.");
    assert.ok(scenario.area, "Scenario `" + scenario.id + "` should include area state.");
    assert.ok(
      Array.isArray(scenario.expectedReviewFlags),
      "Scenario `" + scenario.id + "` should declare expected review flags."
    );
  });

  ["products", "floorplan", "quote_review"].forEach(function (source) {
    assert.ok(
      PricingMigrationScenarios.some(function (scenario) {
        return scenario.source === source && scenario.handoff;
      }),
      "Pricing migration scenarios should include handoff source `" + source + "`."
    );
  });

  console.log("pricingMigrationScenariosContract.test.js passed");
}

main();

