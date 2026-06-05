const assert = require("assert");
const AdminLeadFixtures = require("../../fixtures/adminLeadFixtures");

const forbiddenKeys = [
  "service_role",
  "SUPABASE_SERVICE_ROLE",
  "RESEND_API_KEY",
  "OPENAI_API_KEY",
  "storage_bucket",
  "file_path",
  "signed_url",
  "raw_ocr",
  "extracted_text",
  "supplier_cost",
  "gross_margin",
  "internal_rate",
  "pricingRules",
  "installRates",
  "removalRates",
  "stairRates",
  "locationZones",
  "accessFactor"
];

function findForbidden(value, pathParts, findings) {
  if (!value || typeof value !== "object") return;
  Object.keys(value).forEach(function (key) {
    const nextPath = pathParts.concat(key);
    if (forbiddenKeys.indexOf(key) >= 0) {
      findings.push(nextPath.join("."));
    }
    findForbidden(value[key], nextPath, findings);
  });
}

function assertAdminResponseSafe(payload) {
  const findings = [];
  findForbidden(payload, [], findings);
  assert.deepStrictEqual(findings, [], "Admin response contains forbidden fields:\n" + findings.join("\n"));
  const serialized = JSON.stringify(payload);
  [
    "service_role",
    "SUPABASE_SERVICE_ROLE",
    "RESEND_API_KEY",
    "OPENAI_API_KEY",
    "quote-files/",
    "raw OCR text",
    "supplier cost",
    "gross margin"
  ].forEach(function (term) {
    assert.equal(
      serialized.toLowerCase().includes(term.toLowerCase()),
      false,
      "Admin response contains forbidden term: " + term
    );
  });
}

function testAllowedListShape() {
  assertAdminResponseSafe(AdminLeadFixtures.listResponse);
  assert.strictEqual(AdminLeadFixtures.listResponse.leads.length >= 5, true, "Admin list fixtures should cover at least five source rows.");
  [
    "quote",
    "quote_review",
    "contact",
    "floorplan",
    "chatbot"
  ].forEach(function (source) {
    assert.ok(
      AdminLeadFixtures.listResponse.leads.some(function (lead) {
        return lead.primary_source === source;
      }),
      "Admin list fixtures missing source: " + source
    );
  });
  assert.ok(
    AdminLeadFixtures.listResponse.leads.some(function (lead) {
      return lead.source_detail === "product_handoff";
    }),
    "Admin list fixtures missing product handoff row."
  );
}

function testAllowedDetailShape() {
  Object.keys(AdminLeadFixtures.detailResponses).forEach(function (key) {
    assertAdminResponseSafe(AdminLeadFixtures.detailResponses[key]);
  });
  assert.ok(AdminLeadFixtures.detailResponses.quote.events.length > 0, "Quote detail fixture should include events.");
  assert.ok(AdminLeadFixtures.detailResponses.quoteReview.lead.quote.missing_info_flags.length > 0, "Quote-review detail fixture should include missing info flags.");
  assert.ok(AdminLeadFixtures.detailResponses.upload.files.length > 0, "Upload detail fixture should include safe file metadata.");
  assert.ok(AdminLeadFixtures.detailResponses.floorplan.files.length > 0, "Floorplan detail fixture should include safe file metadata.");
}

function testErrorShapes() {
  Object.keys(AdminLeadFixtures.errorResponses).forEach(function (key) {
    const response = AdminLeadFixtures.errorResponses[key];
    assertAdminResponseSafe(response);
    assert.strictEqual(response.ok, false, "Admin error fixture should have ok=false: " + key);
    assert.strictEqual(typeof response.error, "string", "Admin error fixture should include safe error string: " + key);
  });
}

function testForbiddenFieldsAreCaught() {
  assert.throws(function () {
    assertAdminResponseSafe({
      ok: true,
      lead: {
        storage_bucket: "quote-files",
        file_path: "quote/unassigned/test.pdf"
      }
    });
  }, /forbidden fields/i);
}

function main() {
  testAllowedListShape();
  testAllowedDetailShape();
  testErrorShapes();
  testForbiddenFieldsAreCaught();
  console.log("adminResponseSafetyContract.test.js passed");
}

main();
