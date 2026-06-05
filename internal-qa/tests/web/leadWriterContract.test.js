const assert = require("assert");
const fs = require("fs");
const path = require("path");

const LeadWriter = require("../../../netlify/functions/shared/leadWriter.js");

async function testLeadWriterUsesSafeServerContract() {
  const requests = [];
  const originalFetch = global.fetch;
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

  global.fetch = async function (url, options) {
    requests.push({
      url: String(url),
      method: options && options.method || "GET",
      body: options && options.body ? JSON.parse(options.body) : null
    });

    if (String(url).includes("/operon_quote_requests")) {
      return {
        ok: true,
        text: async () => requests[requests.length - 1].method === "PATCH" ? "" : "[]"
      };
    }
    if (String(url).includes("/operon_leads")) {
      return {
        ok: true,
        text: async () => JSON.stringify([{ id: "11111111-1111-4111-8111-111111111111" }])
      };
    }
    if (String(url).includes("/operon_lead_events")) {
      return {
        ok: true,
        text: async () => ""
      };
    }
    throw new Error("Unexpected fetch URL: " + url);
  };

  try {
    const lead = await LeadWriter.createOrUpdateLead({
      primarySource: "quote",
      sourceDetail: "product_handoff",
      sourceTable: "operon_quote_requests",
      sourceId: "22222222-2222-4222-8222-222222222222",
      customer: {
        name: "Test Lead",
        email: "TEST@EXAMPLE.COM",
        phone: "0400000000"
      },
      project: {
        suburb: "Auburn",
        postcode: "2144",
        productCategory: "hybrid",
        areaM2: 60
      },
      quote: {
        totalIncGst: 3850,
        confidenceScore: 72,
        confidenceLevel: "medium",
        missingInfoFlags: ["stairs"],
        riskFlags: ["floor prep"]
      },
      statuses: {
        status: "Quote sent",
        priority: "high",
        contactStatus: "customer_email_sent"
      },
      metadata: {
        quote_reference: "379",
        supplier_cost: 123,
        supplierCost: 456,
        margin: "private",
        grossMargin: "private",
        storageBucket: "quote-files",
        filePath: "quote/unassigned/private.pdf",
        signedUrl: "https://example.invalid/private",
        rawOcrText: "do not store",
        rawQuoteText: "do not store",
        accessFactor: 1.2,
        installRates: { hybrid: 25 },
        nested: {
          service_role_token: "never expose"
        }
      }
    });

    assert.equal(lead.ok, true);
    assert.equal(lead.leadId, "11111111-1111-4111-8111-111111111111");

    const leadPost = requests.find((request) => request.method === "POST" && request.url.includes("/operon_leads"));
    assert(leadPost, "expected operon_leads insert");
    assert.equal(leadPost.body.primary_source, "quote");
    assert.equal(leadPost.body.source_detail, "product_handoff");
    assert.equal(leadPost.body.status, "Quote sent");
    assert.equal(leadPost.body.priority, "high");
    assert.equal(leadPost.body.email, "test@example.com");
    assert.equal(leadPost.body.metadata.quote_reference, "379");
    assert.equal(leadPost.body.metadata.supplier_cost, undefined);
    assert.equal(leadPost.body.metadata.supplierCost, undefined);
    assert.equal(leadPost.body.metadata.margin, undefined);
    assert.equal(leadPost.body.metadata.grossMargin, undefined);
    assert.equal(leadPost.body.metadata.storageBucket, undefined);
    assert.equal(leadPost.body.metadata.filePath, undefined);
    assert.equal(leadPost.body.metadata.signedUrl, undefined);
    assert.equal(leadPost.body.metadata.rawOcrText, undefined);
    assert.equal(leadPost.body.metadata.rawQuoteText, undefined);
    assert.equal(leadPost.body.metadata.accessFactor, undefined);
    assert.equal(leadPost.body.metadata.installRates, undefined);
    assert.deepEqual(leadPost.body.metadata.nested, {});

    const linkPatch = requests.find((request) => request.method === "PATCH" && request.url.includes("/operon_quote_requests"));
    assert(linkPatch, "expected source table lead_id link");
    assert.equal(linkPatch.body.lead_id, "11111111-1111-4111-8111-111111111111");

    await LeadWriter.recordLeadEvent({
      leadId: lead.leadId,
      eventType: "quote_submitted",
      source: "save-quote-request",
      sourceTable: "operon_quote_requests",
      sourceId: "22222222-2222-4222-8222-222222222222",
      metadata: {
        internal_rate: 45,
        customer_email_sent: true
      }
    });

    const eventPost = requests.find((request) => request.method === "POST" && request.url.includes("/operon_lead_events"));
    assert(eventPost, "expected operon_lead_events insert");
    assert.equal(eventPost.body.metadata.internal_rate, undefined);
    assert.equal(eventPost.body.metadata.customer_email_sent, true);
  } finally {
    global.fetch = originalFetch;
    if (typeof originalUrl === "undefined") delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = originalUrl;
    if (typeof originalKey === "undefined") delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  }
}

function testLeadWriterIsNotPublicFunctionEndpoint() {
  const functionsRoot = path.resolve(__dirname, "../../../netlify/functions");
  assert.equal(fs.existsSync(path.join(functionsRoot, "_leadWriter.js")), false);
  assert.equal(fs.existsSync(path.join(functionsRoot, "shared/leadWriter.js")), true);
}

function testNoNewStage3HelpersAtFunctionRoot() {
  const functionsRoot = path.resolve(__dirname, "../../../netlify/functions");
  const allowedLegacyRootHelpers = new Set([
    "_security.js",
    "_supabasePricing.js",
    "_supabaseTables.js"
  ]);
  const rootHelpers = fs.readdirSync(functionsRoot)
    .filter(function (fileName) {
      return fileName.startsWith("_") && fileName.endsWith(".js");
    })
    .sort();
  const unexpectedHelpers = rootHelpers.filter(function (fileName) {
    return !allowedLegacyRootHelpers.has(fileName);
  });

  assert.deepStrictEqual(
    unexpectedHelpers,
    [],
    "New helper-only files should live under netlify/functions/shared so Netlify does not package them as public endpoints."
  );
}

(async function run() {
  await testLeadWriterUsesSafeServerContract();
  testLeadWriterIsNotPublicFunctionEndpoint();
  testNoNewStage3HelpersAtFunctionRoot();
  console.log("leadWriterContract.test.js passed");
})().catch(function (error) {
  console.error(error);
  process.exit(1);
});
