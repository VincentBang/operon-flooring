"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function main() {
  const decision = read("internal-docs/apps-web/STAGE3_CHATBOT_LEAD_ENDPOINT_DECISION.md");
  const tsxChatbot = read("apps/web-tsx/public/chatbot/chatbot.js");
  const legacyChatbot = read("apps/web/chatbot/chatbot.js");
  const strictFunction = read("netlify/functions/save-chatbot-lead-event.js");

  [
    "`/.netlify/functions/save-chatbot-lead-event`",
    "`/.netlify/functions/chatbot-lead-event`",
    "Do not add new browser calls to `chatbot-lead-event`",
    "accepts only structured safe qualification fields",
    "rejects raw transcript, raw quote text, OCR text, upload content, storage paths, pricing/rate/margin fields",
    "writes `operon_chatbot_qualifications` when the additive table exists",
    "qualification-table write as non-blocking",
    "Only remove or redirect `chatbot-lead-event` after:"
  ].forEach(function (snippet) {
    assert.ok(decision.includes(snippet), "Chatbot endpoint decision missing `" + snippet + "`.");
  });

  [
    tsxChatbot,
    legacyChatbot
  ].forEach(function (source, index) {
    assert.ok(
      source.includes('const CHATBOT_LEAD_EVENT_ENDPOINT = "/.netlify/functions/save-chatbot-lead-event";'),
      "Chatbot source " + index + " should use save-chatbot-lead-event."
    );
    assert.strictEqual(
      source.includes('/.netlify/functions/chatbot-lead-event'),
      false,
      "Chatbot source " + index + " must not call legacy chatbot-lead-event."
    );
  });

  [
    "FORBIDDEN_KEY_PATTERN",
    "FORBIDDEN_TEXT_PATTERN",
    "insertQualification",
    "Non-blocking chatbot qualification write failed",
    "Chatbot lead event could not be saved."
  ].forEach(function (snippet) {
    assert.ok(strictFunction.includes(snippet), "Strict chatbot lead function missing `" + snippet + "`.");
  });

  console.log("stage3ChatbotEndpointDecisionContract.test.js passed");
}

main();
