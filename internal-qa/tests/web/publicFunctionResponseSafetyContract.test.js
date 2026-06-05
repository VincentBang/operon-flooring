const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function readFunction(fileName) {
  return fs.readFileSync(path.join(repoRoot, "netlify", "functions", fileName), "utf8");
}

function getSuccessResponseBlock(source, marker) {
  const index = source.indexOf(marker);
  assert.ok(index >= 0, "Missing response marker: " + marker);
  return source.slice(index, source.indexOf("});", index) + 3);
}

function assertNotIncludesAny(text, terms, label) {
  terms.forEach(function (term) {
    assert.strictEqual(
      text.includes(term),
      false,
      label + " must not expose `" + term + "`."
    );
  });
}

function extractJsonResponseBlocks(source) {
  const blocks = [];
  let searchFrom = 0;
  const marker = "return jsonResponse(";
  while (source.indexOf(marker, searchFrom) >= 0) {
    const start = source.indexOf(marker, searchFrom);
    const end = source.indexOf("});", start);
    if (end < 0) break;
    blocks.push(source.slice(start, end + 3));
    searchFrom = end + 3;
  }
  return blocks;
}

function testJsonResponseBlocksDoNotExposeForbiddenTerms() {
  const functionFiles = [
    "upload-customer-file.js",
    "operator-chat-request.js",
    "save-quote-request.js",
    "save-quote-review.js",
    "quote-review-ocr.js",
    "send-quote-review-email.js"
  ];
  const forbiddenResponseTerms = [
    "storage_bucket",
    "file_path",
    "signed_url",
    "signedUrl",
    "publicUrl",
    "service_role",
    "SUPABASE_SERVICE_ROLE",
    "RESEND_API_KEY",
    "OPENAI_API_KEY",
    "emailTo:",
    "extractedText:",
    "rawOcrText",
    "rawQuoteText",
    "supplierCost",
    "grossMargin",
    "internalRate",
    "accessFactor",
    "pricingRules",
    "installRates",
    "removalRates",
    "stairRates",
    "locationZones"
  ];

  functionFiles.forEach(function (fileName) {
    const blocks = extractJsonResponseBlocks(readFunction(fileName));
    assert.ok(blocks.length > 0, fileName + " should have JSON response blocks.");
    blocks.forEach(function (block, index) {
      assertNotIncludesAny(block, forbiddenResponseTerms, fileName + " jsonResponse block " + index);
    });
  });
}

function testUploadResponseIsStoragePathSafe() {
  const source = readFunction("upload-customer-file.js");
  const block = getSuccessResponseBlock(source, "return jsonResponse(event, 200, {");
  const handlerStart = source.indexOf("exports.handler = async function");
  const handlerSource = source.slice(handlerStart);
  const failureBlock = source.slice(
    source.lastIndexOf("return jsonResponse(event, 500, {"),
    source.indexOf("});", source.lastIndexOf("return jsonResponse(event, 500, {")) + 3
  );

  ["ok", "status", "safe_filename", "file_type", "file_size_bytes", "metadata_saved", "uploaded_file_id"].forEach(function (term) {
    assert.ok(block.includes(term), "Upload response should include safe field `" + term + "`.");
  });

  assertNotIncludesAny(block, [
    "storage_bucket",
    "file_path",
    "storagePath",
    "signed_url",
    "signedUrl",
    "publicUrl"
  ], "Upload response");

  assert.strictEqual(
    handlerSource.includes("createSignedUrl("),
    false,
    "Upload handler must not create or return signed URLs by default."
  );

  assert.ok(
    failureBlock.includes("Security.safePublicError"),
    "Upload failure response should use Security.safePublicError."
  );
  assert.strictEqual(
    failureBlock.includes("error.message"),
    false,
    "Upload failure response must not return raw provider/internal error.message."
  );

  assert.ok(
    source.includes("Invalid JSON payload."),
    "Upload malformed JSON responses should be customer-safe 400 validation errors."
  );
}

function testOcrResponseDoesNotExposeRawText() {
  const source = readFunction("quote-review-ocr.js");
  const block = getSuccessResponseBlock(source, "return jsonResponse(event, 200, {\n      ok: true,\n      pipeline:");

  ["buildBrowserSafeOcrResult", "stripRawQuoteTextFields", "decisionReport"].forEach(function (term) {
    assert.ok(block.includes(term), "OCR response should use safe boundary helper `" + term + "`.");
  });

  assertNotIncludesAny(block, [
    "extractedText:",
    "rawOcrText",
    "rawQuoteText",
    "quoteText:",
    "ocrResult,"
  ], "OCR response");

  assert.ok(
    source.includes("Invalid JSON payload."),
    "OCR malformed JSON responses should be customer-safe 400 validation errors."
  );
}

function testSaveQuoteResponseIsCustomerSafe() {
  const source = readFunction("save-quote-request.js");
  const responseBlocks = [
    getSuccessResponseBlock(source, "return jsonResponse(event, 200, {\n        ok: true,\n        mode: mode,\n        quoteId: quoteId,"),
    getSuccessResponseBlock(source, "return jsonResponse(event, 200, {\n        ok: true,\n        mode: mode,\n        quoteId: quoteId,\n        quoteReference: quoteReference,\n        customerEmailSent:")
  ];

  responseBlocks.forEach(function (block, index) {
    ["ok", "mode", "quoteId", "quoteReference"].forEach(function (term) {
      assert.ok(block.includes(term), "Save quote response " + index + " should include safe field `" + term + "`.");
    });

    assertNotIncludesAny(block, [
      "pricingRules",
      "installRates",
      "removalRates",
      "stairRates",
      "locationZones",
      "supplierCost",
      "grossMargin",
      "internalRate",
      "accessFactor",
      "service_role",
      "file_path",
      "storage_bucket"
    ], "Save quote response " + index);
  });

  [
    "PUBLIC_CUSTOMER_EMAIL_ERROR",
    "PUBLIC_INTERNAL_EMAIL_ERROR",
    "result.customerEmailError = Security.safePublicError(PUBLIC_CUSTOMER_EMAIL_ERROR)",
    "result.internalNotificationError = Security.safePublicError(PUBLIC_INTERNAL_EMAIL_ERROR)"
  ].forEach(function (term) {
    assert.ok(source.includes(term), "Save quote should use safe email error response term `" + term + "`.");
  });

  [
    "result.customerEmailError = error && error.message",
    "result.internalNotificationError = error && error.message",
    "result.customerEmailError = error.message",
    "result.internalNotificationError = error.message"
  ].forEach(function (term) {
    assert.strictEqual(source.includes(term), false, "Save quote must not assign raw email error term `" + term + "`.");
  });
}

function testPublicFailureResponsesDoNotExposeRawErrors() {
  [
    {
      file: "upload-customer-file.js",
      fallback: "File upload failed. Please try again or contact Operon."
    },
    {
      file: "operator-chat-request.js",
      fallback: "Operator request failed. Please try again or contact Operon."
    },
    {
      file: "save-quote-request.js",
      fallback: "Quote save failed. Please try again or contact Operon."
    },
    {
      file: "quote-review-ocr.js",
      fallback: "Quote file handoff failed. Please try again or use the quick check."
    }
  ].forEach(function (target) {
    const source = readFunction(target.file);
    const lastFailureIndex = source.lastIndexOf("return jsonResponse(event, 500, {");
    assert.ok(lastFailureIndex >= 0, target.file + " should have a 500 failure response.");
    const failureBlock = source.slice(lastFailureIndex, source.indexOf("});", lastFailureIndex) + 3);

    assert.ok(
      failureBlock.includes("Security.safePublicError"),
      target.file + " public 500 response should use Security.safePublicError."
    );
    assert.ok(
      failureBlock.includes(target.fallback),
      target.file + " public 500 response should use approved fallback copy."
    );
    assert.strictEqual(
      failureBlock.includes("error.message"),
      false,
      target.file + " public 500 response must not return raw provider/internal error.message."
    );
  });
}

function testContactFailureResponseIsSafe() {
  const source = readFunction("contact-enquiry.js");
  const catchIndex = source.lastIndexOf("Contact enquiry failed");
  assert.ok(catchIndex >= 0, "Contact function should log failed contact sends server-side.");
  const failureBlock = source.slice(catchIndex, source.indexOf("};", catchIndex) + 2);

  assert.ok(
    failureBlock.includes("Contact enquiry could not be sent. Please email quotes@operonflooring.com.au."),
    "Contact failure response should use fixed customer-safe copy."
  );
  assert.strictEqual(
    failureBlock.includes("body: error"),
    false,
    "Contact failure response must not return raw error objects."
  );
  assert.strictEqual(
    failureBlock.includes("body: error && error.message"),
    false,
    "Contact failure response must not return raw error.message."
  );
}

function testCustomerFacingFunctionLogsAreBounded() {
  [
    "contact-enquiry.js",
    "operator-chat-request.js",
    "save-quote-request.js",
    "save-quote-review.js",
    "quote-review-ocr.js",
    "upload-customer-file.js",
    "send-quote-review-email.js"
  ].forEach(function (fileName) {
    const source = readFunction(fileName);
    assert.strictEqual(
      /console\.(error|warn)\([^;\n]*,\s*error\s*\)/.test(source),
      false,
      fileName + " must not log raw error objects."
    );
    assert.strictEqual(
      source.includes("error && error.message ? error.message : error"),
      false,
      fileName + " must not log unbounded raw error messages."
    );
    assert.strictEqual(
      source.includes("error && error.message ? error.message.slice"),
      false,
      fileName + " must not log raw error.message slices; use Security.safeLogReason."
    );
  });

  [
    "safeLogReason",
    "String(message || \"unknown\")",
    "[redacted-key]",
    "[redacted-email]",
    ".slice(0, limit)"
  ].forEach(function (term) {
    assert.ok(readFunction("_security.js").includes(term), "_security.js should expose scrubbed bounded log helper `" + term + "`.");
  });
}

function main() {
  testJsonResponseBlocksDoNotExposeForbiddenTerms();
  testUploadResponseIsStoragePathSafe();
  testOcrResponseDoesNotExposeRawText();
  testSaveQuoteResponseIsCustomerSafe();
  testPublicFailureResponsesDoNotExposeRawErrors();
  testContactFailureResponseIsSafe();
  testCustomerFacingFunctionLogsAreBounded();
  console.log("publicFunctionResponseSafetyContract.test.js passed");
}

main();
