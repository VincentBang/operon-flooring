const assert = require("assert");
const AdminLeadFixtures = require("../../fixtures/adminLeadFixtures");

const requiredListFields = [
  "id",
  "created_at",
  "last_activity_at",
  "primary_source",
  "source_detail",
  "status",
  "priority",
  "customer_name",
  "suburb",
  "postcode",
  "product_category",
  "area_m2",
  "estimate_total_inc_gst",
  "confidence_level",
  "missing_info_count",
  "risk_flag_count",
  "next_action"
];

const forbiddenSerializedTerms = [
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
  "accessFactor",
  "quote-files/"
];

function assertNoForbiddenTerms(payload, label) {
  const serialized = JSON.stringify(payload);
  forbiddenSerializedTerms.forEach(function (term) {
    assert.strictEqual(
      serialized.includes(term),
      false,
      label + " should not include forbidden term `" + term + "`."
    );
  });
}

function testListFixtureShape() {
  const response = AdminLeadFixtures.listResponse;
  assert.strictEqual(response.ok, true, "List response should be ok.");
  assert.ok(Array.isArray(response.leads), "List response should include leads array.");
  assert.ok(response.leads.length >= 5, "List fixture should include at least five source rows.");
  assert.strictEqual(typeof response.next_cursor, "string", "List fixture should include pagination cursor.");

  response.leads.forEach(function (lead) {
    requiredListFields.forEach(function (field) {
      assert.ok(Object.prototype.hasOwnProperty.call(lead, field), "Lead list row missing field `" + field + "`.");
    });
  });

  [
    "quote",
    "quote_review",
    "contact",
    "floorplan",
    "chatbot"
  ].forEach(function (source) {
    assert.ok(
      response.leads.some(function (lead) { return lead.primary_source === source; }),
      "List fixture missing source `" + source + "`."
    );
  });

  [
    "direct_quote_submit",
    "product_handoff",
    "quick_check",
    "contact_form",
    "floorplan_handoff",
    "operator_request"
  ].forEach(function (detail) {
    assert.ok(
      response.leads.some(function (lead) { return lead.source_detail === detail; }),
      "List fixture missing source detail `" + detail + "`."
    );
  });
}

function testDetailFixtureShape() {
  const details = AdminLeadFixtures.detailResponses;
  ["quote", "quoteReview", "upload", "floorplan"].forEach(function (key) {
    assert.ok(details[key], "Missing detail fixture `" + key + "`.");
    assert.strictEqual(details[key].ok, true, "Detail fixture should be ok: " + key);
    assert.ok(details[key].lead, "Detail fixture missing lead: " + key);
    assert.ok(Array.isArray(details[key].events), "Detail fixture missing events array: " + key);
  });
  assert.ok(details.quote.events.some(function (event) { return event.event_type === "quote_submitted"; }), "Quote detail should include quote_submitted event.");
  assert.ok(details.quoteReview.events.some(function (event) { return event.event_type === "quote_review_saved"; }), "Quote-review detail should include quote_review_saved event.");
  assert.ok(details.upload.events.some(function (event) { return event.event_type === "file_uploaded"; }), "Upload detail should include file_uploaded event.");
  assert.ok(details.floorplan.events.some(function (event) { return event.event_type === "floorplan_handoff_saved"; }), "Floorplan detail should include floorplan_handoff_saved event.");
  assert.ok(details.upload.files.length > 0, "Upload detail should include file metadata.");
  assert.ok(details.floorplan.files.length > 0, "Floorplan detail should include safe file metadata.");
  assert.ok(details.upload.notes.length > 0, "Upload detail should include note fixture.");
  assert.ok(details.upload.status_history.length > 0, "Upload detail should include status history fixture.");
}

function testFilterFixtures() {
  const filters = AdminLeadFixtures.filterFixtures;
  [
    "status",
    "source",
    "priority",
    "productCategory",
    "suburb",
    "dateRange",
    "pagination",
    "empty"
  ].forEach(function (key) {
    assert.ok(filters[key], "Missing filter fixture `" + key + "`.");
    assert.ok(filters[key].query, "Filter fixture missing query: " + key);
  });
  assert.deepStrictEqual(filters.empty.expectedLeadIds, [], "Empty state fixture should expect no leads.");
  assert.strictEqual(filters.pagination.expectedLimitCap, 100, "Pagination fixture should document server-side limit cap.");
}

function testErrorFixtures() {
  const errors = AdminLeadFixtures.errorResponses;
  [
    "unauthenticated",
    "forbidden",
    "missingLead",
    "invalidFilter",
    "unavailable"
  ].forEach(function (key) {
    assert.ok(errors[key], "Missing error fixture `" + key + "`.");
    assert.strictEqual(errors[key].ok, false, "Error fixture should have ok=false: " + key);
    assert.strictEqual(typeof errors[key].error, "string", "Error fixture should include safe string error: " + key);
  });
}

function main() {
  testListFixtureShape();
  testDetailFixtureShape();
  testFilterFixtures();
  testErrorFixtures();
  assertNoForbiddenTerms(AdminLeadFixtures, "Admin lead fixtures");
  console.log("adminLeadFixturesContract.test.js passed");
}

main();
