"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outRoot = path.join(repoRoot, "apps", "web-tsx", "out");

const knownPublicPricingFiles = new Set([
  "preference-floors-import.js",
  "pricingSource.js",
  "pricingSourceConfig.js",
  "products.js",
  "quoteRuntime.js",
  "skirtingScotia.js",
  "underlay.js"
]);

const knownGeneratedPricingSurfaces = new Set([
  "products.html",
  "products.txt"
]);

const privatePricingPatterns = [
  { label: "pricePerM2", pattern: /\bpricePerM2\b/ },
  { label: "price_per_m2", pattern: /\bprice_per_m2\b/ },
  { label: "installRate", pattern: /\binstallRate\b/ },
  { label: "install_rate", pattern: /\binstall_rate\b/ },
  { label: "ratePerM2", pattern: /\bratePerM2\b/ },
  { label: "rate_per_m2", pattern: /\brate_per_m2\b/ },
  { label: "disposalRatePerM2", pattern: /\bdisposalRatePerM2\b/ },
  { label: "disposal_rate_per_m2", pattern: /\bdisposal_rate_per_m2\b/ },
  { label: "access factor", pattern: /\baccess(?:Factor|_factor| multiplier|_multiplier)\b/i },
  { label: "gross margin", pattern: /\b(?:grossMargin|gross_margin)\b/i },
  { label: "markup", pattern: /\bmarkup\b/i },
  { label: "supplier cost", pattern: /\b(?:supplierCost|supplier_cost|wholesale|costPrice|cost_price)\b/i },
  { label: "supplierUrl", pattern: /\bsupplierUrl\b|\bsupplier_url\b/ },
  { label: "installRates", pattern: /\binstallRates\b|\binstall_rates\b/ },
  { label: "removalRates", pattern: /\bremovalRates\b|\bremoval_rates\b/ },
  { label: "stairRates", pattern: /\bstairRates\b|\bstair_rates\b/ },
  { label: "locationZones", pattern: /\blocationZones\b|\blocation_zones\b/ },
  { label: "pricingRules", pattern: /\bpricingRules\b|\bpricing_rules\b/ },
  { label: "minimum job fee", pattern: /\bminimumJobFee\b|\bminimum_job_fee\b/ },
  { label: "service role", pattern: /\bservice_role\b|\bSUPABASE_SERVICE_ROLE\b/i },
  { label: "OpenAI secret", pattern: /\bOPENAI_API_KEY\b|\bsk-[A-Za-z0-9_-]{12,}/ },
  { label: "Resend secret", pattern: /\bRESEND_API_KEY\b|\bre_[A-Za-z0-9_-]{12,}/ }
];

const calculateQuoteForbiddenResponseKeys = [
  "accessFactor",
  "costPrice",
  "grossMargin",
  "installRate",
  "labourRate",
  "locationSurchargePercent",
  "margin",
  "markup",
  "minimumChargeApplied",
  "minimumJobFee",
  "pricingRules",
  "removalRate",
  "supplier",
  "supplierCost",
  "supplierUrl",
  "unitRate"
];

const storageForbiddenTerms = [
  "accessFactor",
  "costPrice",
  "grossMargin",
  "installRate",
  "margin",
  "markup",
  "pricePerM2",
  "pricingRules",
  "rawOcrText",
  "rawQuoteText",
  "removalRate",
  "supplierCost",
  "supplierUrl"
];

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".txt",
  ".xml"
]);

function walk(directory, files) {
  if (!fs.existsSync(directory)) return files;
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      return;
    }
    files.push(fullPath);
  });
  return files;
}

function isTextFile(filePath) {
  return textExtensions.has(path.extname(filePath).toLowerCase());
}

function countMatches(content, pattern) {
  const flags = pattern.flags.indexOf("g") >= 0 ? pattern.flags : pattern.flags + "g";
  const matcher = new RegExp(pattern.source, flags);
  const matches = content.match(matcher);
  return matches ? matches.length : 0;
}

function getPublicRoute(filePath) {
  return path.relative(outRoot, filePath).replace(/\\/g, "/");
}

function scanBuiltOutput() {
  assert.ok(fs.existsSync(outRoot), "Build output missing. Run npm run build in apps/web-tsx first.");

  const findings = [];
  const inventory = [];

  walk(outRoot, []).filter(isTextFile).forEach(function (filePath) {
    const route = getPublicRoute(filePath);
    const basename = path.basename(route);
    const content = fs.readFileSync(filePath, "utf8");

    privatePricingPatterns.forEach(function (item) {
      const count = countMatches(content, item.pattern);
      if (!count) return;

      if (knownPublicPricingFiles.has(basename) || knownGeneratedPricingSurfaces.has(route)) {
        inventory.push({
          file: route,
          field: item.label,
          count: count
        });
        return;
      }

      findings.push(route + " contains private pricing marker: " + item.label);
    });
  });

  if (inventory.length) {
    const byFile = inventory.reduce(function (accumulator, item) {
      accumulator[item.file] = accumulator[item.file] || [];
      accumulator[item.file].push(item.field + "=" + item.count);
      return accumulator;
    }, {});
    console.log("Known public pricing-support inventory:");
    Object.keys(byFile).sort().forEach(function (file) {
      console.log("- " + file + ": " + byFile[file].join(", "));
    });
  }

  assert.deepStrictEqual(findings, [], "Unexpected private pricing exposure:\n" + findings.join("\n"));
}

function assertNoForbiddenKeys(value, pathParts, findings) {
  if (!value || typeof value !== "object") return;

  Object.keys(value).forEach(function (key) {
    const nextPath = pathParts.concat(key);
    if (calculateQuoteForbiddenResponseKeys.indexOf(key) >= 0) {
      findings.push(nextPath.join("."));
    }
    assertNoForbiddenKeys(value[key], nextPath, findings);
  });
}

function testCalculateQuoteContract() {
  childProcess.execFileSync(
    process.execPath,
    [path.join(repoRoot, "scripts", "test-calculate-quote-fixtures.js")],
    {
      cwd: repoRoot,
      stdio: "inherit"
    }
  );

  const fixtureScript = fs.readFileSync(
    path.join(repoRoot, "scripts", "test-calculate-quote-fixtures.js"),
    "utf8"
  );
  calculateQuoteForbiddenResponseKeys.forEach(function (key) {
    assert.ok(
      fixtureScript.indexOf("\"" + key + "\"") >= 0,
      "calculate-quote fixture should assert forbidden response key: " + key
    );
  });
}

function scanStorageSinks() {
  const files = [
    path.join(repoRoot, "apps", "web-tsx", "public", "quoteRuntime.js"),
    path.join(repoRoot, "apps", "web-tsx", "public", "floorplanRuntime.js"),
    path.join(repoRoot, "apps", "web-tsx", "public", "tracking.js"),
    path.join(repoRoot, "apps", "web-tsx", "src", "app", "quote-review", "page.tsx")
  ];
  const findings = [];

  files.forEach(function (filePath) {
    if (!fs.existsSync(filePath)) return;
    const relative = path.relative(repoRoot, filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf8");
    const storageCallPattern = /(?:localStorage|sessionStorage)\.setItem\s*\(([\s\S]{0,260})\)/g;
    let match;
    while ((match = storageCallPattern.exec(content))) {
      storageForbiddenTerms.forEach(function (term) {
        if (match[1].indexOf(term) >= 0) {
          findings.push(relative + " stores private pricing/OCR marker near: " + term);
        }
      });
    }
  });

  assert.deepStrictEqual(findings, [], "Forbidden browser storage sink found:\n" + findings.join("\n"));
}

function testUploadMetadataPrivacyContract() {
  const uploadFunctionPath = path.join(repoRoot, "netlify", "functions", "upload-customer-file.js");
  const quoteRuntimePath = path.join(repoRoot, "apps", "web-tsx", "public", "quoteRuntime.js");
  const uploadFunction = fs.readFileSync(uploadFunctionPath, "utf8");
  const quoteRuntime = fs.readFileSync(quoteRuntimePath, "utf8");
  const successResponseStart = uploadFunction.indexOf("return jsonResponse(event, 200, {");
  assert.ok(successResponseStart >= 0, "upload-customer-file success response should be explicit JSON.");
  const successResponse = uploadFunction.slice(successResponseStart, uploadFunction.indexOf("});", successResponseStart) + 3);

  [
    "storage_bucket",
    "file_path",
    "signed_url",
    "signedUrl",
    "storagePath"
  ].forEach(function (field) {
    assert.strictEqual(
      successResponse.indexOf(field),
      -1,
      "upload-customer-file response must not expose " + field
    );
  });

  [
    "payload.file_path",
    "payload.storage_bucket",
    "payload.signed_url",
    "storage_bucket:",
    "file_path:"
  ].forEach(function (field) {
    assert.strictEqual(
      quoteRuntime.indexOf(field),
      -1,
      "quoteRuntime upload metadata must not store " + field
    );
  });
}

function testPublicCatalogueInventory() {
  const publicProductsPath = path.join(outRoot, "products.js");
  assert.ok(fs.existsSync(publicProductsPath), "Public products.js missing from built output.");
  const content = fs.readFileSync(publicProductsPath, "utf8");

  const requiredPublicFields = [
    "category",
    "range",
    "colour",
    "brand"
  ];

  requiredPublicFields.forEach(function (field) {
    assert.ok(content.indexOf(field) >= 0, "Public catalogue should include display field: " + field);
  });

  console.log("Public catalogue inventory baseline: products.js is still legacy/mixed and contains pricing-support fields by design.");
}

function main() {
  scanBuiltOutput();
  testCalculateQuoteContract();
  scanStorageSinks();
  testUploadMetadataPrivacyContract();
  testPublicCatalogueInventory();
  console.log("pricing leak contract tests passed");
}

main();
