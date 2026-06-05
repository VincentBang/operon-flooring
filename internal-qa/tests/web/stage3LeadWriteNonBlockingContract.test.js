const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

const contracts = [
  {
    file: "netlify/functions/save-quote-request.js",
    helper: "async function safelyRecordQuoteLead",
    call: "await safelyRecordQuoteLead",
    warning: "Non-blocking lead write failed for quote request",
    publicSuccessFields: ["customerEmailSent", "internalNotificationSent", "quoteReference"]
  },
  {
    file: "netlify/functions/contact-enquiry.js",
    helper: "async function safelyRecordContactLead",
    call: "await safelyRecordContactLead",
    warning: "Non-blocking lead write failed for contact enquiry",
    publicSuccessFields: ["Location", "/contact-thank-you.html"]
  },
  {
    file: "netlify/functions/save-quote-review.js",
    helper: "async function safelyRecordQuoteReviewLead",
    call: "await safelyRecordQuoteReviewLead",
    warning: "Non-blocking lead write failed for quote review",
    publicSuccessFields: ["review_id"]
  },
  {
    file: "netlify/functions/operator-chat-request.js",
    helper: "async function safelyRecordOperatorLead",
    call: "await safelyRecordOperatorLead",
    warning: "Non-blocking lead write failed for operator request",
    publicSuccessFields: ["customerEmailSent", "request_id"]
  },
  {
    file: "netlify/functions/upload-customer-file.js",
    helper: "async function safelyLinkUploadToLead",
    call: "await safelyLinkUploadToLead",
    warning: "Non-blocking lead file link failed",
    publicSuccessFields: ["uploaded_file_id", "metadata_saved"]
  }
];

function getFunctionBlock(source, helperSignature) {
  const start = source.indexOf(helperSignature);
  assert.ok(start >= 0, "Missing helper: " + helperSignature);
  const nextFunction = source.indexOf("\nasync function ", start + helperSignature.length);
  const nextExport = source.indexOf("\nexports.handler", start + helperSignature.length);
  const endCandidates = [nextFunction, nextExport].filter(function (index) {
    return index > start;
  });
  const end = endCandidates.length ? Math.min.apply(Math, endCandidates) : source.length;
  return source.slice(start, end);
}

function main() {
  contracts.forEach(function (contract) {
    const absolutePath = path.join(repoRoot, contract.file);
    const source = fs.readFileSync(absolutePath, "utf8");
    const helperBlock = getFunctionBlock(source, contract.helper);

    assert.ok(source.includes('require("./shared/leadWriter")'), contract.file + " should use shared lead writer.");
    assert.ok(source.includes(contract.call), contract.file + " should call " + contract.call + ".");
    assert.ok(helperBlock.includes("try {"), contract.file + " helper should guard lead write with try/catch.");
    assert.ok(helperBlock.includes("catch (error)"), contract.file + " helper should catch lead write failure.");
    assert.ok(helperBlock.includes(contract.warning), contract.file + " helper should log non-blocking warning.");
    assert.strictEqual(helperBlock.includes("throw error"), false, contract.file + " helper must not rethrow lead write failure.");
    assert.strictEqual(helperBlock.includes("throw new Error"), false, contract.file + " helper must not throw from the non-blocking lead helper.");

    contract.publicSuccessFields.forEach(function (field) {
      assert.ok(source.includes(field), contract.file + " should preserve public success field `" + field + "`.");
    });
  });

  console.log("stage3LeadWriteNonBlockingContract.test.js passed");
}

main();
