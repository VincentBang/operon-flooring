const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const docsRoot = path.join(repoRoot, "internal-docs", "apps-web");

const pricingBoundaryDocs = [
  "STAGE4_SHARED_TYPES_PACKAGE_PLAN.md",
  "STAGE4_SHARED_QUOTE_ENGINE_INTERFACE.md",
  "STAGE4_SERVER_SIDE_PRICING_MIGRATION_PLAN.md"
];

const docs = [
  ...pricingBoundaryDocs,
  "STAGE4_PRICING_MIGRATION_TEST_PLAN.md",
  "STAGE4_SHARED_UPLOAD_REVIEW_FRAMEWORK_PLAN.md",
  "STAGE4_OPERON_KITCHENS_INTEGRATION_PLAN.md",
  "STAGE4_INTERNAL_SAAS_ALPHA_PLAN.md"
];

const forbiddenBoundaryTerms = [
  "Internal rates",
  "Supplier costs",
  "Margins",
  "Access multipliers",
  "Private pricing rules"
];

function main() {
  docs.forEach(function (fileName) {
    assert.ok(fs.existsSync(path.join(docsRoot, fileName)), "Stage 4 doc missing: " + fileName);
  });

  pricingBoundaryDocs.forEach(function (fileName) {
    const content = fs.readFileSync(path.join(docsRoot, fileName), "utf8");
    const normalizedContent = content.toLowerCase();
    forbiddenBoundaryTerms.forEach(function (term) {
      assert.ok(
        normalizedContent.includes(term.toLowerCase()),
        fileName + " should explicitly forbid or contain boundary term: " + term
      );
    });
  });

  const sharedTypes = fs.readFileSync(path.join(docsRoot, "STAGE4_SHARED_TYPES_PACKAGE_PLAN.md"), "utf8");
  [
    "Lead",
    "Customer",
    "Project",
    "Quote",
    "QuoteReview",
    "Upload",
    "FollowUp",
    "SourceEvent",
    "Public browser types",
    "Admin-only types",
    "Server-only types"
  ].forEach(function (term) {
    assert.ok(sharedTypes.includes(term), "Shared type plan missing `" + term + "`.");
  });

  const quoteInterface = fs.readFileSync(path.join(docsRoot, "STAGE4_SHARED_QUOTE_ENGINE_INTERFACE.md"), "utf8");
  [
    "customerSafeQuoteResult",
    "calculateOperonQuote",
    "Never return to public browser",
    "The current customer-facing output must remain equivalent"
  ].forEach(function (term) {
    assert.ok(quoteInterface.includes(term), "Shared quote interface missing `" + term + "`.");
  });

  const uploadFramework = fs.readFileSync(path.join(docsRoot, "STAGE4_SHARED_UPLOAD_REVIEW_FRAMEWORK_PLAN.md"), "utf8");
  [
    "uploaded_file_id",
    "Storage bucket",
    "Raw OCR text",
    "Storage anon list/read probes fail"
  ].forEach(function (term) {
    assert.ok(uploadFramework.includes(term), "Upload/review framework missing `" + term + "`.");
  });

  const kitchensPlan = fs.readFileSync(path.join(docsRoot, "STAGE4_OPERON_KITCHENS_INTEGRATION_PLAN.md"), "utf8");
  [
    "vertical = flooring",
    "vertical = kitchens",
    "Do not mix",
    "Kitchen pricing support stays server-side"
  ].forEach(function (term) {
    assert.ok(kitchensPlan.includes(term), "Kitchens integration plan missing `" + term + "`.");
  });

  const alphaPlan = fs.readFileSync(path.join(docsRoot, "STAGE4_INTERNAL_SAAS_ALPHA_PLAN.md"), "utf8");
  [
    "Internal SaaS alpha",
    "No contractor accounts",
    "No customer portal",
    "Security audit passes"
  ].forEach(function (term) {
    assert.ok(alphaPlan.includes(term), "Internal SaaS alpha plan missing `" + term + "`.");
  });

  const pricingTestPlan = fs.readFileSync(path.join(docsRoot, "STAGE4_PRICING_MIGRATION_TEST_PLAN.md"), "utf8");
  [
    "Do not change pricing formulas during this migration.",
    "internal-qa/fixtures/pricingMigrationScenarios.js",
    "internal-qa/tests/web/pricingMigrationScenariosContract.test.js",
    "House, hybrid, 60m2, no stairs, no removal.",
    "Product handoff from `/products.html`.",
    "Floorplan handoff into `/quote.html`.",
    "Quote-review handoff into `/quote.html`.",
    "`pricePerM2`",
    "`installRate`",
    "`supplierUrl`",
    "Function Response Leak Tests",
    "Static Output Leak Tests",
    "Browser storage leak tests pass"
  ].forEach(function (term) {
    assert.ok(pricingTestPlan.includes(term), "Pricing migration test plan missing `" + term + "`.");
  });

  console.log("stage4PricingBoundaryDocs.test.js passed");
}

main();
