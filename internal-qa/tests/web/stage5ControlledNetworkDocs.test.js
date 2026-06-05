const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const docsRoot = path.join(repoRoot, "internal-docs", "apps-web");

const docs = [
  "STAGE5_PARTNER_NETWORK_CRITERIA.md",
  "STAGE5_LEAD_ALLOCATION_RULES_PLAN.md",
  "STAGE5_CONTRACTOR_SCORECARD_PLAN.md",
  "STAGE5_SHADOW_DISPATCH_PLAN.md",
  "STAGE5_CUSTOMER_PROTECTION_PROCESS.md",
  "STAGE5_MONETISATION_TEST_PLAN.md",
  "STAGE5_GO_NO_GO_REPORT_TEMPLATE.md"
];

function main() {
  docs.forEach(function (fileName) {
    assert.ok(fs.existsSync(path.join(docsRoot, fileName)), "Stage 5 doc missing: " + fileName);
  });

  const combined = docs.map(function (fileName) {
    return fs.readFileSync(path.join(docsRoot, fileName), "utf8");
  }).join("\n");

  [
    "No open marketplace",
    "No automatic dispatch",
    "Operator approval required",
    "No customer-visible contractor selection",
    "Customer protection",
    "contractor scorecard",
    "Do not choose a monetisation model",
    "Pricing/privacy leak risk"
  ].forEach(function (term) {
    assert.ok(combined.includes(term), "Stage 5 docs missing guardrail: " + term);
  });

  console.log("stage5ControlledNetworkDocs.test.js passed");
}

main();
