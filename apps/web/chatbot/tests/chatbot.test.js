const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const CHATBOT_DIR = path.resolve(__dirname, "..");
const CORE_FILES = [
  "chatbotPrompts.js",
  "chatbotPolicy.js",
  "chatbotKnowledgeIndex.js",
  "chatbotKnowledge.js",
  "chatbotScenarios.js",
  "chatbotSiteState.js",
  "chatbotStateMapper.js",
  "chatbotLogic.js"
];

function createDocumentStub(pathname) {
  const head = {
    children: [],
    appendChild(node) {
      this.children.push(node);
      if (typeof node.onload === "function") {
        node.onload();
      }
      return node;
    }
  };

  return {
    readyState: "complete",
    location: { pathname: pathname || "/index.html" },
    head,
    body: {
      appendChild(node) {
        return node;
      }
    },
    activeElement: null,
    createElement(tagName) {
      return {
        tagName: String(tagName).toUpperCase(),
        attributes: {},
        children: [],
        style: {},
        setAttribute(name, value) {
          this.attributes[name] = String(value);
        },
        getAttribute(name) {
          return this.attributes[name] || "";
        },
        hasAttribute(name) {
          return Object.prototype.hasOwnProperty.call(this.attributes, name);
        },
        addEventListener() {},
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        remove() {},
        querySelectorAll() {
          return [];
        },
        focus() {}
      };
    },
    getElementById() {
      return null;
    },
    querySelector() {
      return null;
    },
    addEventListener() {}
  };
}

function createSandbox(pathname) {
  const document = createDocumentStub(pathname);
  const sandbox = {
    console,
    setTimeout(callback) {
      callback();
    },
    clearTimeout() {},
    document,
    window: {
      document,
      location: { pathname: pathname || "/index.html" },
      setTimeout(callback) {
        callback();
      },
      clearTimeout() {}
    },
    localStorage: new Proxy({}, {
      get() {
        throw new Error("localStorage test read blocked.");
      },
      set() {
        throw new Error("localStorage must not be written by isolated chatbot tests.");
      }
    })
  };

  sandbox.window.localStorage = sandbox.localStorage;
  return vm.createContext(sandbox);
}

function runFile(context, fileName) {
  const source = fs.readFileSync(path.join(CHATBOT_DIR, fileName), "utf8");
  vm.runInContext(source, context, { filename: fileName });
}

function loadCore(pathname) {
  const context = createSandbox(pathname);
  CORE_FILES.forEach(function (fileName) {
    runFile(context, fileName);
  });
  return context;
}

function createLogic(context) {
  return context.window.OperonChatbotLogic.createChatbotLogic({
    onUpdate() {}
  });
}

function lastAssistantText(snapshot) {
  const assistantMessages = snapshot.transcript.filter(function (message) {
    return message.role === "assistant";
  });
  return assistantMessages[assistantMessages.length - 1].text;
}

function runPrompt(prompt) {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput(prompt);

  return logic.getSnapshot();
}

function assertResponseGuardrails(snapshot, label, options) {
  const settings = Object.assign({
    maxLength: 520
  }, options || {});
  const text = lastAssistantText(snapshot);

  assert(text.trim().length > 0, label + " empty response");
  assert(text.length <= settings.maxLength, label + " too long");
  assert.doesNotMatch(text, /\$\s*\d|per\s*m2|per\s*square|square metre rate|discount|formula|multiplier|margin/i, label);
  assert.doesNotMatch(text, /always cheaper|guaranteed cheapest|we will beat|limited time|book now or lose|act now/i, label);
  assert.doesNotMatch(text, /Key point:|Next step:|source of truth|integration is added|calculator stays in control/i, label);
  assert(snapshot.routeSuggestion && snapshot.routeSuggestion.href, label + " missing route");
}

function assertNoWriteOrIntegrationHooks(source, label) {
  assert.strictEqual(/localStorage\.(setItem|removeItem|clear)/.test(source), false, label + " localStorage write");
  assert.strictEqual(/quoteCalculator|calculateQuote|QUOTE_CALCULATOR/.test(source), false, label + " pricing call");
  assert.strictEqual(/setInputValue|querySelector\([^)]*quote|\.submit\(/.test(source), false, label + " form write");
  assert.strictEqual(/selectProduct|setSelectedProduct|clearSelectedProduct/.test(source), false, label + " product override");
}

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  }
}

test("price questions are blocked without producing totals", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("How much will 52m2 cost?");

  const text = lastAssistantText(logic.getSnapshot());
  assert.match(text, /cannot calculate|source of truth/i);
  assert.doesNotMatch(text, /\$\s*\d/);
});

test("cost questions produce quote explanation schema only", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("How much does hybrid flooring cost?");

  const snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.structuredOutput.intent, "quote_explanation");
  assert.strictEqual(snapshot.structuredOutput.next_step, "quote.html");
  assert.strictEqual(snapshot.structuredOutput.ready_for_quote, false);
  assert.doesNotMatch(lastAssistantText(snapshot), /\$\s*\d/);
});

test("competitor pricing prompts are blocked", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("Can you beat a competitor quote?");

  const text = lastAssistantText(logic.getSnapshot());
  assert.match(text, /cannot compare competitor pricing/i);
});

test("controlled knowledge index routes site content without prices", function () {
  [
    {
      prompt: "Tell me about Parramatta flooring",
      route: "parramatta-flooring.html",
      expected: /Parramatta/i
    },
    {
      prompt: "What should I know about floor preparation?",
      route: "quote-review.html",
      expected: /preparation|Uneven/i
    },
    {
      prompt: "Show me floor care maintenance advice",
      route: "floor-care-maintenance.html",
      expected: /care|maintenance/i
    },
    {
      prompt: "What page helps with hybrid flooring?",
      route: "hybrid-flooring-sydney.html",
      expected: /Hybrid flooring/i
    },
    {
      prompt: "Tell me about Swish Oak Natura Herringbone",
      route: "products.html",
      expected: /Herringbone|pattern/i
    },
    {
      prompt: "Do I need disposal with carpet removal?",
      route: "quote.html",
      expected: /disposal|take-away|remove/i
    }
  ].forEach(function (example) {
    const snapshot = runPrompt(example.prompt);
    const text = lastAssistantText(snapshot);

    assert.strictEqual(snapshot.routeSuggestion.href, example.route, example.prompt);
    assert.match(text, example.expected, example.prompt);
    assert.doesNotMatch(text, /\$\s*\d|per\s*m2|per\s*square|square metre rate|discount|formula|multiplier|margin/i, example.prompt);
  });
});

test("scenario QA matrix routes without pricing output", function () {
  [
    {
      prompt: "I want cheapest",
      intent: "product_guidance",
      route: "products.html",
      forbidden: /\$\s*\d|cheaper than|always cheaper/i
    },
    {
      prompt: "I have stairs",
      intent: "scope_validation",
      route: "quote-review.html",
      forbidden: /\$\s*\d/i
    },
    {
      prompt: "I don't know my area",
      intent: "missing_info_collection",
      route: "quote.html",
      forbidden: /\$\s*\d/i
    },
    {
      prompt: "Can you beat this quote?",
      intent: "unsupported",
      route: "quote-review.html",
      forbidden: /\$\s*\d|yes|we can beat/i
    }
  ].forEach(function (scenario) {
    const snapshot = runPrompt(scenario.prompt);

    assert.strictEqual(snapshot.structuredOutput.intent, scenario.intent, scenario.prompt);
    assert.strictEqual(snapshot.routeSuggestion.href, scenario.route, scenario.prompt);
    assert.doesNotMatch(lastAssistantText(snapshot), scenario.forbidden, scenario.prompt);
  });
});

test("knowledge coverage map covers the customer journey", function () {
  [
    {
      area: "product guidance",
      prompt: "Should I choose hybrid or laminate?",
      intent: "product_guidance",
      route: "products.html"
    },
    {
      area: "quote explanation",
      prompt: "How does the quote work?",
      intent: "quote_explanation",
      route: "quote.html"
    },
    {
      area: "missing area",
      prompt: "I don't know my area",
      intent: "missing_info_collection",
      route: "quote.html"
    },
    {
      area: "stairs access furniture",
      prompt: "I have stairs",
      intent: "scope_validation",
      route: "quote-review.html"
    },
    {
      area: "existing flooring removal",
      prompt: "Replacing carpet in bedrooms",
      scenario: "replacing_carpet",
      route: "quote.html"
    },
    {
      area: "hidden costs",
      prompt: "Are there hidden costs?",
      intent: "scope_validation",
      route: "quote.html"
    },
    {
      area: "final quote changes",
      prompt: "Can final quote change?",
      intent: "quote_explanation",
      route: "quote.html"
    },
    {
      area: "cheapest option",
      prompt: "I want cheapest",
      intent: "product_guidance",
      route: "products.html"
    },
    {
      area: "competitor quote",
      prompt: "Can you beat this quote?",
      intent: "unsupported",
      route: "quote-review.html"
    },
    {
      area: "trust professionalism",
      prompt: "Can I trust Operon?",
      intent: "route_next_step",
      route: "quote.html"
    },
    {
      area: "route suggestions",
      prompt: "I am ready",
      route: "quote.html"
    },
    {
      area: "json schema",
      prompt: "52",
      intent: "missing_info_collection",
      route: "quote.html",
      areaM2: 52
    }
  ].forEach(function (coverage) {
    const snapshot = runPrompt(coverage.prompt);
    const structured = snapshot.structuredOutput;
    const assistantText = lastAssistantText(snapshot);

    if (coverage.intent) {
      assert.strictEqual(structured.intent, coverage.intent, coverage.area);
    }
    if (coverage.scenario) {
      assert.strictEqual(structured.scenario_id, coverage.scenario, coverage.area);
    }
    if (typeof coverage.areaM2 === "number") {
      assert.strictEqual(structured.area_m2, coverage.areaM2, coverage.area);
    }
    assert.strictEqual(snapshot.routeSuggestion.href, coverage.route, coverage.area);
    assert.doesNotMatch(assistantText, /\$\s*\d|per\s*m2|per\s*square|discount/i, coverage.area);
  });
});

test("assistant responses follow response guardrails", function () {
  [
    { label: "cost", prompt: "How much will 52m2 cost?" },
    { label: "cheapest", prompt: "I want cheapest" },
    { label: "competitor", prompt: "Can you beat this quote?" },
    { label: "stairs", prompt: "I have stairs" },
    { label: "trust", prompt: "Can I trust Operon?" },
    { label: "product", prompt: "Should I choose hybrid or laminate?" },
    { label: "area", prompt: "I don't know my area" },
    { label: "final quote", prompt: "Can final quote change?" }
  ].forEach(function (guardrail) {
    assertResponseGuardrails(runPrompt(guardrail.prompt), guardrail.label);
  });
});

test("assistant responses use clean customer-facing format", function () {
  [
    "How much does hybrid flooring cost?",
    "I am stuck",
    "I need herringbone",
    "I don't know my area"
  ].forEach(function (prompt) {
    const text = lastAssistantText(runPrompt(prompt));
    assert.doesNotMatch(text, /Key point:|Next step:|Guidance only|source of truth|integration/i, prompt);
    assert(text.split("?").length <= 2, prompt + " asks more than one question");
    assert(text.length <= 520, prompt + " too long");
  });
});

test("assistant responses keep a professional advisor tone", function () {
  [
    "What next?",
    "How much will 52m2 cost?",
    "Can I trust Operon?",
    "I want cheapest"
  ].forEach(function (prompt) {
    const text = lastAssistantText(runPrompt(prompt));
    assert.doesNotMatch(text, /2 minutes|quickly|Let's|I can help you|source of truth|book now|limited time/i, prompt);
    assert(text.length <= 520, prompt + " too long");
  });
});

test("edge-case intent set routes messy customer prompts safely", function () {
  [
    {
      label: "tiles and stairs",
      prompt: "I have tiles and stairs",
      intent: "scope_validation",
      route: "quote-review.html",
      assertStructured: function (structured) {
        assert.strictEqual(structured.existing_floor, "tile");
        assert.strictEqual(structured.stairs, 1);
        assert(structured.missing_items_to_check.indexOf("tile removal") >= 0);
      }
    },
    {
      label: "apartment no lift",
      prompt: "I'm in an apartment with no lift",
      intent: "scope_validation",
      route: "quote-review.html",
      assertStructured: function (structured) {
        assert.strictEqual(structured.access, "apartment");
        assert.strictEqual(structured.property_type, "unit_apartment");
        assert.strictEqual(structured.has_lift, "no");
      }
    },
    {
      label: "own flooring",
      prompt: "I have my own flooring",
      scenario: "install_only",
      route: "quote.html",
      assertStructured: function (structured, snapshot) {
        assert.strictEqual(structured.quote_mode, "install_only");
        assert.strictEqual(snapshot.quoteFieldDraft.selectedProductCategory, "");
      }
    },
    {
      label: "uneven floor",
      prompt: "The floor is uneven",
      intent: "scope_validation",
      route: "quote-review.html",
      assertStructured: function (structured) {
        assert.strictEqual(structured.subfloor_condition, "minor_prep");
        assert.strictEqual(structured.floor_prep_type, "levelling");
      }
    },
    {
      label: "only floorplan",
      prompt: "I only have a floorplan",
      intent: "missing_info_collection",
      route: "quote.html",
      assertStructured: function (structured) {
        assert.strictEqual(structured.measurement_method, "floorplan_upload");
      }
    },
    {
      label: "herringbone",
      prompt: "I need herringbone",
      intent: "product_guidance",
      route: "products.html",
      assertStructured: function (structured) {
        assert.strictEqual(structured.category, "engineered");
        assert.strictEqual(structured.recommended_category, "engineered");
      }
    }
  ].forEach(function (edgeCase) {
    const snapshot = runPrompt(edgeCase.prompt);
    const structured = snapshot.structuredOutput;

    if (edgeCase.intent) {
      assert.strictEqual(structured.intent, edgeCase.intent, edgeCase.label);
    }
    if (edgeCase.scenario) {
      assert.strictEqual(structured.scenario_id, edgeCase.scenario, edgeCase.label);
    }
    assert.strictEqual(snapshot.routeSuggestion.href, edgeCase.route, edgeCase.label);
    assert.strictEqual(snapshot.handoffReadiness.safe_to_apply, false, edgeCase.label);
    assert.doesNotMatch(lastAssistantText(snapshot), /\$\s*\d|per\s*m2|always cheaper|we will beat/i, edgeCase.label);
    edgeCase.assertStructured(structured, snapshot);
  });
});

test("uncertain area routes to quote area flow without updating forms", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("I don't know area but I have a floor plan");

  const snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.structuredOutput.intent, "missing_info_collection");
  assert.strictEqual(snapshot.structuredOutput.measurement_method, "floorplan_upload");
  assert.strictEqual(snapshot.structuredOutput.next_step, "quote.html");
  assert.strictEqual(snapshot.routeSuggestion.href, "quote.html");
});

test("operator requests show human follow-up without pretending live chat", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("Can I chat with an online operator?");

  const snapshot = logic.getSnapshot();
  const text = lastAssistantText(snapshot);
  assert.strictEqual(snapshot.structuredOutput.intent, "operator_handoff");
  assert(snapshot.operatorHandoff, "operator handoff section missing");
  assert.strictEqual(snapshot.operatorHandoff.href, "quote.html?from=chatbot&support=operator");
  assert.strictEqual(snapshot.routeSuggestion.href, "quote.html?from=chatbot&support=operator");
  assert.match(text, /automated|human follow-up|contact details/i);
  assert.doesNotMatch(text, /online now|live operator is available|connected to an operator/i);
});

test("conversion routes stay inside approved guided funnel", function () {
  [
    "I want cheapest",
    "I have stairs",
    "I don't know my area",
    "I only have a floorplan",
    "Can you beat this quote?",
    "I am stuck"
  ].forEach(function (prompt) {
    const snapshot = runPrompt(prompt);
    assert(["quote.html", "products.html", "quote-review.html"].indexOf(snapshot.routeSuggestion.href) >= 0, prompt);
    assert.notStrictEqual(snapshot.routeSuggestion.href, "floorplan.html", prompt);
  });
});

test("controller exposes read-only structured outputs", function () {
  const context = loadCore();
  runFile(context, "chatbotUI.js");
  runFile(context, "chatbot.js");

  const controller = context.window.OperonChatbotModule.createController({
    openOnInit: false
  });

  controller.init();

  assert.strictEqual(controller.getStructuredOutput().intent, "route_next_step");
  assert.strictEqual(controller.getRouteSuggestion().href, "quote.html");
  assert.strictEqual(typeof controller.getLocalStorageDraft().operon_chatbot_draft, "string");

  controller.destroy();
});

test("apartment scenario progresses and maps access fields", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("I am renovating an apartment");
  logic.applyAction("scenario_apartment_lift_yes");
  logic.applyAction("scenario_apartment_level_2_plus");
  logic.applyAction("scenario_access_limited");

  const snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.stage, "scenario_complete");
  assert.strictEqual(snapshot.structuredOutput.scenario_id, "apartment_renovation");
  assert.strictEqual(snapshot.structuredOutput.scenario_step, 3);
  assert.deepStrictEqual(snapshot.quoteFieldDraft.propertyType, "unit_apartment");
  assert.deepStrictEqual(snapshot.quoteFieldDraft.level, "level_2_plus");
  assert.deepStrictEqual(snapshot.quoteFieldDraft.hasLift, "yes");
  assert(snapshot.structuredOutput.scenario_flags.indexOf("parking_access_review") >= 0);
});

test("carpet replacement scenario maps removal and furniture fields", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("Replacing carpet in bedrooms");
  logic.applyAction("scenario_disposal_yes");
  logic.applyAction("scenario_subfloor_unsure");
  logic.applyAction("scenario_furniture_some");

  const snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.stage, "scenario_complete");
  assert.strictEqual(snapshot.structuredOutput.scenario_id, "replacing_carpet");
  assert.strictEqual(snapshot.quoteFieldDraft.removalType, "carpet");
  assert.strictEqual(snapshot.quoteFieldDraft.removalDisposal, "yes");
  assert.strictEqual(snapshot.quoteFieldDraft.furnitureType, "yes");
  assert(snapshot.structuredOutput.validation_flags.indexOf("subfloor_review_recommended") >= 0);
});

test("install-only scenario keeps quote mode and avoids product override", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("I already have flooring for install only");
  logic.applyAction("scenario_category_unsure");
  logic.applyAction("scenario_existing_none");
  logic.applyAction("scenario_install_access_easy");

  const snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.structuredOutput.scenario_id, "install_only");
  assert.strictEqual(snapshot.quoteFieldDraft.quoteMode, "install_only");
  assert.strictEqual(snapshot.quoteFieldDraft.selectedProductCategory, "");
  assert.strictEqual(snapshot.quoteFieldDraft.productChoiceMode, "decide_later");
});

test("structured output includes scenario metadata and localStorage draft strings only", function () {
  const context = loadCore();
  const mapper = context.window.OperonChatbotStateMapper;
  const output = mapper.toStructuredOutput({
    scenario_id: "unknown_area",
    scenario_step: 1,
    scenario_flags: ["area_capture_needed"],
    measurement_method: "floorplan_upload"
  });
  const storageDraft = mapper.toLocalStorageDraft(output);

  assert.strictEqual(output.scenario_id, "unknown_area");
  assert.strictEqual(output.scenario_step, 1);
  assert(output.scenario_flags.indexOf("area_capture_needed") >= 0);
  assert.strictEqual(typeof storageDraft.operon_chatbot_draft, "string");
  assert.strictEqual(typeof storageDraft.operon_chatbot_quote_field_draft, "string");
});

test("handoff readiness contract blocks advisory and incomplete drafts", function () {
  const context = loadCore();
  const mapper = context.window.OperonChatbotStateMapper;
  const productGuidance = mapper.toHandoffReadiness({
    intent: "product_guidance",
    category: "hybrid",
    next_step: "products.html"
  });
  const incompleteQuote = mapper.toHandoffReadiness({
    intent: "route_next_step",
    category: "hybrid",
    next_step: "quote.html"
  });

  assert.strictEqual(productGuidance.status, "blocked");
  assert.strictEqual(productGuidance.safe_to_apply, false);
  assert(productGuidance.reason.indexOf("advisory") >= 0);
  assert.strictEqual(incompleteQuote.status, "blocked");
  assert(incompleteQuote.required_missing.indexOf("area") >= 0);
  assert(incompleteQuote.required_missing.indexOf("existing_floor") >= 0);
});

test("handoff readiness contract requires review for risk flags", function () {
  const context = loadCore();
  const mapper = context.window.OperonChatbotStateMapper;
  const review = mapper.toHandoffReadiness({
    intent: "scope_validation",
    category: "hybrid",
    area: 52,
    measurement_method: "manual_total",
    existing_floor: "carpet",
    removal_disposal: "yes",
    subfloor_condition: "good",
    stairs: 1,
    access: "easy",
    furniture: "none",
    quote_mode: "supply_install",
    next_step: "quote-review.html",
    readiness: "review"
  });

  assert.strictEqual(review.status, "needs_review");
  assert.strictEqual(review.safe_to_apply, false);
  assert(review.review_flags.indexOf("stairs_require_manual_review") >= 0);
  assert.strictEqual(review.next_step, "quote-review.html");
});

test("handoff readiness contract can be ready but still read-only", function () {
  const context = loadCore();
  const mapper = context.window.OperonChatbotStateMapper;
  const ready = mapper.toHandoffReadiness({
    intent: "route_next_step",
    category: "hybrid",
    area: 52,
    measurement_method: "manual_total",
    existing_floor: "none",
    subfloor_condition: "good",
    stairs: 0,
    access: "easy",
    furniture: "none",
    quote_mode: "supply_install",
    next_step: "quote.html",
    readiness: "ready"
  });

  assert.strictEqual(ready.status, "ready");
  assert.strictEqual(ready.safe_to_apply, false);
  assert.strictEqual(ready.required_missing.length, 0);
  assert(ready.allowed_quote_fields.indexOf("totalAreaM2") >= 0);
  assert(ready.allowed_quote_fields.indexOf("selectedProduct") === -1);
  assert(ready.blocked_fields.indexOf("prices") >= 0);
  assert(ready.blocked_fields.indexOf("selected product IDs") >= 0);
});

test("controller exposes handoff readiness as read-only data", function () {
  const context = loadCore();
  runFile(context, "chatbotUI.js");
  runFile(context, "chatbot.js");

  const controller = context.window.OperonChatbotModule.createController({
    openOnInit: false
  });

  controller.init();

  const handoff = controller.getHandoffReadiness();
  assert(handoff);
  assert.strictEqual(handoff.safe_to_apply, false);
  assert.strictEqual(typeof handoff.status, "string");

  controller.destroy();
});

test("bootstrap page presets resolve without mounting live pages", function () {
  function getConfig(pathname) {
    const context = createSandbox(pathname);
    runFile(context, "chatbotBootstrap.js");
    return context.window.OperonChatbotBootstrap.getConfig();
  }

  assert.strictEqual(getConfig("/index.html").pageKey, "index");
  assert.strictEqual(getConfig("/products.html").pageKey, "products");
  assert.strictEqual(getConfig("/quote.html").pageKey, "quote");
  assert.strictEqual(getConfig("/thank-you.html").pageKey, "thank-you");
  assert.strictEqual(getConfig("/blog/index.html").pageKey, "default");
});

test("selected live pages use passive chatbot bootstrap only", function () {
  [
    { file: "index.html", pageKey: "index" },
    { file: "products.html", pageKey: "products" },
    { file: "quote.html", pageKey: "quote" },
    { file: "quote-review.html", pageKey: "quote-review" },
    { file: "thank-you.html", pageKey: "thank-you" }
  ].forEach(function (page) {
    const html = fs.readFileSync(path.resolve(CHATBOT_DIR, "..", page.file), "utf8");

    assert(html.indexOf('<script src="chatbot/chatbotBootstrap.js"></script>') >= 0);
    assert(html.indexOf('window.OperonChatbotBootstrap.mount({') >= 0);
    assert(html.indexOf('pageKey: "' + page.pageKey + '"') >= 0);
    assert(html.indexOf("openOnInit: false") >= 0);
    assert.strictEqual(html.indexOf("OperonChatbotConfig"), -1);
  });
});

test("release readiness gates pass for passive isolated mount", function () {
  const chatbotFiles = [
    "chatbot.js",
    "chatbotBootstrap.js",
    "chatbotKnowledgeIndex.js",
    "chatbotKnowledge.js",
    "chatbotLogic.js",
    "chatbotPolicy.js",
    "chatbotPrompts.js",
    "chatbotScenarios.js",
    "chatbotSiteState.js",
    "chatbotStateMapper.js",
    "chatbotUI.js"
  ];
  const combinedSource = chatbotFiles.map(function (fileName) {
    return fs.readFileSync(path.resolve(CHATBOT_DIR, fileName), "utf8");
  }).join("\n");

  assertNoWriteOrIntegrationHooks(combinedSource, "chatbot source");

  [
    { file: "index.html", pageKey: "index" },
    { file: "products.html", pageKey: "products" },
    { file: "quote.html", pageKey: "quote" },
    { file: "quote-review.html", pageKey: "quote-review" },
    { file: "thank-you.html", pageKey: "thank-you" }
  ].forEach(function (page) {
    const html = fs.readFileSync(path.resolve(CHATBOT_DIR, "..", page.file), "utf8");
    assert(html.indexOf('pageKey: "' + page.pageKey + '"') >= 0, page.file);
    assert(html.indexOf("openOnInit: false") >= 0, page.file);
  });

  [
    "I want cheapest",
    "I have stairs",
    "I don't know my area",
    "Can you beat this quote?",
    "I have tiles and stairs",
    "I'm in an apartment with no lift",
    "The floor is uneven",
    "Should I choose hybrid or laminate?",
    "How does the quote work?",
    "Can I trust Operon?"
  ].forEach(function (prompt) {
    const snapshot = runPrompt(prompt);
    assert(snapshot.routeSuggestion.href, prompt);
    assert.strictEqual(snapshot.handoffReadiness.safe_to_apply, false, prompt);
    assert.doesNotMatch(lastAssistantText(snapshot), /\$\s*\d|per\s*m2|always cheaper|we will beat/i, prompt);
  });
});

test("chatbot UI includes mobile overlap safeguards", function () {
  const source = fs.readFileSync(path.resolve(CHATBOT_DIR, "chatbotUI.js"), "utf8");
  [
    "position: fixed",
    "z-index: 30",
    "pointer-events: none",
    ".operon-chatbot-panel, .operon-chatbot-toggle { pointer-events: auto; }",
    "env(safe-area-inset-bottom, 0px)",
    "width: min(420px, calc(100vw - 24px))",
    "@media (max-width: 640px)",
    "max-height: min(62vh, 520px)",
    "flex-direction: column",
    ".operon-chatbot-route-link { width: 100%; }",
    "@media (prefers-reduced-motion: reduce)",
    "transition: none",
    "display: none",
    ".operon-chatbot-panel[data-open='true'] { display: grid; }"
  ].forEach(function (signal) {
    assert(source.indexOf(signal) >= 0, signal);
  });
});

test("chatbot UI uses premium compact visual styling", function () {
  const source = fs.readFileSync(path.resolve(CHATBOT_DIR, "chatbotUI.js"), "utf8");
  [
    "--operon-chatbot-surface",
    "min-height: 48px",
    "max-height: min(76vh, 680px)",
    "border-radius: 16px",
    "font-size: 0.86rem",
    "min-height: 32px",
    "font-weight: 650",
    "border-radius: 10px",
    "max-height: min(60vh, 500px)"
  ].forEach(function (signal) {
    assert(source.indexOf(signal) >= 0, signal);
  });
});

test("chatbot UI hides internal state from customer panel", function () {
  const source = fs.readFileSync(path.resolve(CHATBOT_DIR, "chatbotUI.js"), "utf8");

  [
    "Details so far",
    "Ask about flooring or quote scope",
    "summary.hidden"
  ].forEach(function (signal) {
    assert(source.indexOf(signal) >= 0, signal);
  });

  [
    ".operon-chatbot-route[hidden] { display: none; }",
    "route.hidden = !!operatorHandoff"
  ].forEach(function (signal) {
    assert(source.indexOf(signal) >= 0, signal);
  });

  [
    "Guided path",
    "Suggested next step",
    "Nothing collected yet.",
    "Page: ",
    "Intent: ",
    "Next: ",
    "No obvious scope warnings yet."
  ].forEach(function (internalCopy) {
    assert.strictEqual(source.indexOf(internalCopy), -1, internalCopy);
  });
});

test("site state reads page context without exposing pricing control", function () {
  const context = loadCore("/quote.html");
  const siteState = context.window.OperonChatbotSiteState.getSnapshot({ pageKey: "quote" });

  assert.strictEqual(siteState.readOnly, true);
  assert.strictEqual(siteState.canWriteFields, false);
  assert.strictEqual(siteState.canSubmitForms, false);
  assert.strictEqual(siteState.canCalculatePrice, false);
  assert(siteState.next && siteState.next.href);
});

test("quote page stuck recovery uses read-only site state", function () {
  const context = loadCore("/quote.html");
  const logic = context.window.OperonChatbotLogic.createChatbotLogic({
    onUpdate() {},
    pageKey: "quote"
  });

  logic.begin();
  logic.applyTextInput("I am stuck");

  const snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.structuredOutput.intent, "route_next_step");
  assert.strictEqual(snapshot.routeSuggestion.href, "quote.html");
  assert.strictEqual(snapshot.siteState.readOnly, true);
  assert.doesNotMatch(lastAssistantText(snapshot), /Key point:|Next step:|source of truth|calculator stays/i);
});

test("preview includes diagnostics panel and scenario matrix", function () {
  const html = fs.readFileSync(path.resolve(CHATBOT_DIR, "preview.html"), "utf8");

  assert(html.indexOf("Diagnostics") >= 0);
  assert(html.indexOf("Scenario QA Matrix") >= 0);
  assert(html.indexOf("diagIntent") >= 0);
  assert(html.indexOf("diagRoute") >= 0);
  assert(html.indexOf("runMatrixButton") >= 0);
  assert(html.indexOf("I want cheapest") >= 0);
  assert(html.indexOf("Can you beat this quote?") >= 0);
});

test("preview includes knowledge coverage report", function () {
  const html = fs.readFileSync(path.resolve(CHATBOT_DIR, "preview.html"), "utf8");

  assert(html.indexOf("Coverage Report") >= 0);
  assert(html.indexOf("runCoverageButton") >= 0);
  assert(html.indexOf("coverageCases") >= 0);
  assert(html.indexOf("Product guidance") >= 0);
  assert(html.indexOf("JSON schema") >= 0);
});

test("preview includes handoff readiness diagnostics", function () {
  const html = fs.readFileSync(path.resolve(CHATBOT_DIR, "preview.html"), "utf8");

  assert(html.indexOf("diagHandoff") >= 0);
  assert(html.indexOf("diagApply") >= 0);
  assert(html.indexOf("safe_to_apply") >= 0);
});

test("preview includes release readiness panel", function () {
  const html = fs.readFileSync(path.resolve(CHATBOT_DIR, "preview.html"), "utf8");

  assert(html.indexOf("Release Readiness") >= 0);
  assert(html.indexOf("runReleaseButton") >= 0);
  assert(html.indexOf("releaseGates") >= 0);
  assert(html.indexOf("Passive mount") >= 0);
  assert(html.indexOf("safe_to_apply remains false") >= 0);
});

test("preview includes mobile audit panel", function () {
  const html = fs.readFileSync(path.resolve(CHATBOT_DIR, "preview.html"), "utf8");

  assert(html.indexOf("Mobile Audit") >= 0);
  assert(html.indexOf("runMobileAuditButton") >= 0);
  assert(html.indexOf("mobileAuditChecks") >= 0);
  assert(html.indexOf("Pointer safety") >= 0);
  assert(html.indexOf("Safe area") >= 0);
});

test("coverage report document lists required journey areas", function () {
  const report = fs.readFileSync(path.resolve(CHATBOT_DIR, "CHATBOT_COVERAGE.md"), "utf8");
  [
    "Product guidance",
    "Quote explanation",
    "Missing area",
    "Stairs/access/furniture",
    "Existing flooring/removal",
    "Hidden costs",
    "Final quote changes",
    "Cheapest/competitor",
    "Trust/professionalism",
    "Route suggestions",
    "JSON schema"
  ].forEach(function (area) {
    assert(report.indexOf(area) >= 0, area);
  });
});

test("knowledge index document defines controlled static knowledge boundary", function () {
  const report = fs.readFileSync(path.resolve(CHATBOT_DIR, "CHATBOT_KNOWLEDGE_INDEX.md"), "utf8");
  [
    "approved site knowledge",
    "product category summaries",
    "suburb page summaries",
    "blog guide summaries",
    "must not",
    "display prices",
    "does not crawl the site"
  ].forEach(function (rule) {
    assert(report.indexOf(rule) >= 0, rule);
  });
});

test("response guardrail document lists controlled answer rules", function () {
  const report = fs.readFileSync(path.resolve(CHATBOT_DIR, "CHATBOT_RESPONSE_GUARDRAILS.md"), "utf8");
  [
    "avoid dollar totals",
    "avoid claiming Operon is always cheaper",
    "avoid pressuring the user",
    "suggest a route",
    "use clean customer-facing paragraphs",
    "avoid internal labels like `Key point:` and `Next step:`",
    "Forbidden Copy Patterns"
  ].forEach(function (rule) {
    assert(report.indexOf(rule) >= 0, rule);
  });
});

test("handoff contract document defines read-only readiness rules", function () {
  const contract = fs.readFileSync(path.resolve(CHATBOT_DIR, "CHATBOT_HANDOFF_CONTRACT.md"), "utf8");
  [
    "Do not write to quote fields",
    "Do not write to product selection",
    "Do not write to live `localStorage`",
    "Do not call `quoteCalculator.js`",
    "safe_to_apply",
    "Fields That Must Never Auto-Map",
    "selected product IDs"
  ].forEach(function (rule) {
    assert(contract.indexOf(rule) >= 0, rule);
  });
});

test("release readiness document lists all release gates and risks", function () {
  const report = fs.readFileSync(path.resolve(CHATBOT_DIR, "CHATBOT_RELEASE_READINESS.md"), "utf8");
  [
    "ready for passive isolated mount",
    "Approved Pages",
    "openOnInit: false",
    "Pricing calls",
    "Form writes",
    "localStorage writes",
    "Scenario matrix",
    "Coverage map",
    "Response guardrails",
    "Handoff contract",
    "Mobile overlap",
    "Remaining Risks Before Deeper Integration"
  ].forEach(function (item) {
    assert(report.indexOf(item) >= 0, item);
  });
});

test("mobile audit document lists overlap safeguards", function () {
  const report = fs.readFileSync(path.resolve(CHATBOT_DIR, "CHATBOT_MOBILE_AUDIT.md"), "utf8");
  [
    "Closed by default",
    "Pointer safety",
    "Safe area",
    "Mobile width",
    "Panel height",
    "Route CTA stacking",
    "Reduced motion",
    "No full-screen takeover",
    "env(safe-area-inset-bottom",
    "openOnInit: false"
  ].forEach(function (item) {
    assert(report.indexOf(item) >= 0, item);
  });
});

test("edge-case document lists required messy prompts", function () {
  const report = fs.readFileSync(path.resolve(CHATBOT_DIR, "CHATBOT_EDGE_CASES.md"), "utf8");
  [
    "I have tiles and stairs",
    "I'm in an apartment with no lift",
    "I have my own flooring",
    "The floor is uneven",
    "I only have a floorplan",
    "I need herringbone"
  ].forEach(function (prompt) {
    assert(report.indexOf(prompt) >= 0, prompt);
  });
});

if (process.exitCode) {
  process.exit(process.exitCode);
}
