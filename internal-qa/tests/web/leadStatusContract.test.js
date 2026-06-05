const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

const allowedStatuses = [
  "New",
  "Needs review",
  "Waiting customer",
  "Quote sent",
  "Site measure booked",
  "Won",
  "Lost",
  "Archived"
];

const allowedPriorities = [
  "low",
  "normal",
  "high",
  "urgent"
];

function assertDocContainsValues(relativePath, values) {
  const content = fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  values.forEach(function (value) {
    assert.ok(content.includes(value), relativePath + " missing value: " + value);
  });
}

function main() {
  assertDocContainsValues("internal-docs/apps-web/STAGE3_ADMIN_WRITE_FUNCTION_CONTRACT.md", allowedStatuses);
  assertDocContainsValues("internal-docs/apps-web/STAGE3_ADMIN_WRITE_FUNCTION_CONTRACT.md", allowedPriorities);
  assertDocContainsValues("internal-docs/apps-web/STAGE3_ADMIN_DASHBOARD_MVP_PLAN.md", allowedStatuses);
  assert.equal(new Set(allowedStatuses).size, allowedStatuses.length, "Lead statuses must be unique.");
  assert.equal(new Set(allowedPriorities).size, allowedPriorities.length, "Lead priorities must be unique.");
  console.log("leadStatusContract.test.js passed");
}

main();
