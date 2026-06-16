const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function main() {
  const doc = read("internal-docs/apps-web/STAGE3_ADMIN_FUNCTION_GAP_REGISTER.md");
  [
    "`lead-dashboard.js` is the current protected read API for the Stage 3 dashboard MVP",
    "`lead-status-admin.js` is the current protected status-write API",
    "`lead-followup-admin.js` is the current protected manual follow-up queue API",
    "lead-admin.js` exists as a legacy/local proof endpoint",
    "followup-admin.js` exists as a legacy/local proof endpoint",
    "The TSX `/admin.html` shell now renders protected dashboard modules after token verification",
    "New dashboard read APIs should use operon_leads as the parent record",
    "Do not wire the /admin shell to lead-admin.js",
    "Keep `lead-admin.js` and `followup-admin.js` as legacy/proof endpoints only.",
    "miss contact, quote-review, floorplan, upload, product handoff, and chatbot/operator leads",
    "no storage bucket/path, raw OCR text, internal rates, supplier costs, margins, or service credentials"
  ].forEach(function (snippet) {
    assert.ok(doc.includes(snippet), "Admin Function gap register missing snippet: " + snippet);
  });

  const adminShell = read("apps/web-tsx/src/app/admin/page.tsx");
  [
    "lead-admin",
    "followup-admin",
    "fetch(",
    "createClient"
  ].forEach(function (forbidden) {
    assert.strictEqual(
      adminShell.includes(forbidden),
      false,
      "Static admin shell must not wire to legacy/admin data source yet: " + forbidden
    );
  });

  console.log("adminFunctionGapRegisterContract.test.js passed");
}

main();
