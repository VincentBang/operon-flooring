const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const CHATBOT_DIR = path.resolve(__dirname, "..", "..", "..", "apps", "web", "chatbot");
const CHATBOT_PREVIEW_PATH = path.resolve(__dirname, "..", "..", "chatbot-preview", "preview.html");
const PRIVATE_CHATBOT_DOCS_DIR = path.resolve(CHATBOT_DIR, "../../../internal-docs/apps-web/chatbot");
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

function readChatbotDoc(fileName) {
  const publicPath = path.resolve(CHATBOT_DIR, fileName);
  const privatePath = path.resolve(PRIVATE_CHATBOT_DOCS_DIR, fileName);
  const filePath = fs.existsSync(publicPath) ? publicPath : privatePath;
  return fs.readFileSync(filePath, "utf8");
}

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
    _elements: {},
    _quoteSteps: [],
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
      return this._elements[arguments[0]] || null;
    },
    querySelector(selector) {
      if (selector === "[data-stairs-choice].active") {
        return this._activeStairsChoice || null;
      }
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-quote-step]") {
        return this._quoteSteps;
      }
      return [];
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

function lastAssistantActions(snapshot) {
  const assistantMessages = snapshot.transcript.filter(function (message) {
    return message.role === "assistant";
  });
  const last = assistantMessages[assistantMessages.length - 1] || {};
  return Array.isArray(last.actions) ? last.actions.map(function (action) { return action.label; }) : [];
}

function runPrompt(prompt) {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput(prompt);

  return logic.getSnapshot();
}

function setQuotePageFixture(context, activeStep, values) {
  const document = context.document;
  document._elements = {};
  document._quoteSteps = Array.from({ length: 7 }).map(function (_, index) {
    return {
      classList: {
        contains(name) {
          return name === "active" && index === activeStep;
        }
      },
      getAttribute(name) {
        return name === "data-quote-step" ? String(index) : "";
      }
    };
  });

  Object.keys(values || {}).forEach(function (id) {
    document._elements[id] = { value: values[id] };
  });
}

function setQuoteReviewFixture(context, values) {
  const document = context.document;
  document._elements = {};

  Object.keys(values || {}).forEach(function (id) {
    const value = values[id] || {};
    document._elements[id] = {
      value: value.value || "",
      innerText: value.text || "",
      textContent: value.text || "",
      hidden: Boolean(value.hidden),
      style: { display: value.display || "" },
      classList: {
        contains(name) {
          return Array.isArray(value.classes) && value.classes.indexOf(name) >= 0;
        }
      }
    };
  });
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
  assert.strictEqual(/sessionStorage\.(setItem|removeItem|clear)/.test(source), false, label + " sessionStorage write");
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
  assert.match(text, /cannot give exact pricing|cannot calculate/i);
  assert.doesNotMatch(text, /\$\s*\d/);
});

test("cost questions produce quote explanation schema only", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("How much does hybrid flooring cost?");

  const snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.structuredOutput.intent, "price_question");
  assert.strictEqual(snapshot.structuredOutput.next_step, "/quote.html");
  assert.strictEqual(snapshot.structuredOutput.ready_for_quote, false);
  assert.doesNotMatch(lastAssistantText(snapshot), /\$\s*\d/);
});

test("competitor pricing prompts are blocked", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("Can you beat a competitor quote?");

  const text = lastAssistantText(logic.getSnapshot());
  assert.match(text, /cannot tell whether a quote is expensive|scope is clear enough|PDF, image or screenshot/i);
  assert.doesNotMatch(text, /Operon will be cheaper|we will beat/i);
});

test("controlled knowledge index routes site content without prices", function () {
  [
    {
      prompt: "Tell me about Parramatta flooring",
      route: "/flooring-parramatta.html",
      expected: /Parramatta/i
    },
    {
      prompt: "Tell me about Randwick flooring for an apartment",
      route: "/flooring-randwick.html",
      expected: /Randwick|apartments|units/i
    },
    {
      prompt: "What should I know about floor preparation?",
      route: "/quote-review.html",
      expected: /preparation|Uneven/i
    },
    {
      prompt: "Show me floor care maintenance advice",
      route: "/floor-care-maintenance.html",
      expected: /care|maintenance/i
    },
    {
      prompt: "What page helps with hybrid flooring?",
      route: "/hybrid-flooring-sydney.html",
      expected: /Hybrid flooring/i
    },
    {
      prompt: "Can I preview Lumiere Ultra HD hybrid?",
      route: "/hybrid-flooring-sydney.html",
      expected: /Lumiere Ultra HD|hybrid preview/i
    },
    {
      prompt: "Show me Villeroy Boch Heritage laminate",
      route: "/laminate-flooring-sydney.html",
      expected: /Villeroy|Heritage|laminate preview/i
    },
    {
      prompt: "Tell me about Cavallo Bianco Chevron",
      route: "/engineered-timber-flooring-sydney.html",
      expected: /Cavallo Bianco|Chevron|engineered/i
    },
    {
      prompt: "Tell me about Swish Oak Natura Herringbone",
      route: "/products.html",
      expected: /Herringbone|pattern/i
    },
    {
      prompt: "Do I need disposal with carpet removal?",
      route: "/quote.html",
      expected: /disposal|take-away|remove/i
    },
    {
      prompt: "Is acoustic underlay included?",
      route: "/quote-review.html",
      expected: /Underlay|acoustic|scope/i
    },
    {
      prompt: "Are trims and skirting included?",
      route: "/quote-review.html",
      expected: /Trims|scotia|skirting|Finishing/i
    },
    {
      prompt: "I selected not sure for door trimming and furniture, why are they not in review notes?",
      route: "/quote.html",
      expected: /Not sure|needs confirmation|door trimming|furniture/i
    },
    {
      prompt: "What warranty and exclusions should I check?",
      route: "/quote-review.html",
      expected: /Warranty|exclusions|variation/i
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
      route: "/products.html",
      forbidden: /\$\s*\d|cheaper than|always cheaper/i
    },
    {
      prompt: "I have stairs",
      intent: "scope_validation",
      route: "/quote-review.html",
      forbidden: /\$\s*\d/i
    },
    {
      prompt: "I don't know my area",
      intent: "missing_info_collection",
      route: "/quote.html",
      forbidden: /\$\s*\d/i
    },
    {
      prompt: "Can you beat this quote?",
      intent: "existing_quote_review",
      route: "/quote-review.html?from=chatbot&mode=upload",
      forbidden: /\$\s*\d|yes|we can beat/i
    }
  ].forEach(function (scenario) {
    const snapshot = runPrompt(scenario.prompt);

    assert.strictEqual(snapshot.structuredOutput.intent, scenario.intent, scenario.prompt);
    assert.strictEqual(snapshot.routeSuggestion.href, scenario.route, scenario.prompt);
    assert.doesNotMatch(lastAssistantText(snapshot), scenario.forbidden, scenario.prompt);
  });
});

test("quote-review and handoff policy scenarios stay inside approved boundaries", function () {
  [
    {
      prompt: "Is this quote expensive?",
      intent: "existing_quote_review",
      route: "/quote-review.html?from=chatbot&mode=upload",
      expected: /cannot tell whether a quote is expensive|scope is clear enough|PDF, image or screenshot/i,
      forbidden: /\$\s*\d|that quote is expensive|Operon will be cheaper|we will beat/i
    },
    {
      prompt: "I have Hybrid 7mm quote",
      intent: "existing_quote_review",
      route: "/quote-review.html?from=chatbot&mode=upload",
      expected: /PDF, image or screenshot|do not paste the quote text|strongest review/i,
      forbidden: /Likely product match|final price|\$\s*\d/i
    },
    {
      prompt: "My quote only says supply and install",
      intent: "existing_quote_review",
      route: "/quote-review.html?from=chatbot&mode=quick_check#quick-check",
      expected: /quick completeness check|Do not paste the quote text|product brand/i,
      forbidden: /Extracted from uploaded quote|Product match|Operon comparable estimate|\$\s*\d/i
    },
    {
      prompt: "I have a floor plan",
      intent: "floorplan_help",
      route: "/floorplan.html",
      expected: /floor plan measurement|already have a plan|measurement/i,
      forbidden: /\$\s*\d|calculate|final price/i
    },
    {
      prompt: "I want a human to call me",
      intent: "contact_human",
      route: "/contact.html?from=chatbot",
      expected: /automated|not a live operator|contact details/i,
      forbidden: /live operator is available|online now|quote submitted/i
    },
    {
      prompt: "Can you give final price?",
      intent: "price_question",
      route: "/quote.html",
      expected: /cannot give exact pricing|structured estimate/i,
      forbidden: /\$\s*\d|guaranteed quote|final fixed/i
    },
    {
      prompt: "What does this quote review mean?",
      intent: "quote_review_result_explanation",
      route: "/quote-review.html",
      expected: /quote readiness|Not ready to compare|Clear enough to compare/i,
      forbidden: /\$\s*\d|cheaper|bad quote|formula/i
    },
    {
      prompt: "It says product match 35%",
      intent: "quote_review_result_explanation",
      route: "/quote-review.html",
      expected: /not treated as a confirmed match|product match not confirmed/i,
      forbidden: /Likely product match|match 35%|\$\s*\d/i
    },
    {
      prompt: "I live in an apartment no lift",
      intent: "scope_validation",
      route: "/quote-review.html",
      expected: /Apartment with no lift|site review|strata/i,
      forbidden: /\$\s*\d|rate|cheaper/i
    }
  ].forEach(function (scenario) {
    const snapshot = runPrompt(scenario.prompt);
    const text = lastAssistantText(snapshot);

    assert.strictEqual(snapshot.structuredOutput.intent, scenario.intent, scenario.prompt);
    assert.strictEqual(snapshot.routeSuggestion.href, scenario.route, scenario.prompt);
    assert.match(text, scenario.expected, scenario.prompt);
    assert.doesNotMatch(text, scenario.forbidden, scenario.prompt);
    assert.strictEqual(snapshot.handoffReadiness.safe_to_apply, false, scenario.prompt);
  });
});

test("knowledge coverage map covers the customer journey", function () {
  [
    {
      area: "product guidance",
      prompt: "Should I choose hybrid or laminate?",
      intent: "product_guidance",
      route: "/products.html"
    },
    {
      area: "quote explanation",
      prompt: "How does the quote work?",
      intent: "start_quote",
      route: "/quote.html"
    },
    {
      area: "missing area",
      prompt: "I don't know my area",
      intent: "missing_info_collection",
      route: "/quote.html"
    },
    {
      area: "stairs access furniture",
      prompt: "I have stairs",
      intent: "scope_validation",
      route: "/quote-review.html"
    },
    {
      area: "existing flooring removal",
      prompt: "Replacing carpet in bedrooms",
      scenario: "replacing_carpet",
      route: "/quote.html"
    },
    {
      area: "hidden costs",
      prompt: "Are there hidden costs?",
      intent: "scope_validation",
      route: "/quote.html"
    },
    {
      area: "final quote changes",
      prompt: "Can final quote change?",
      intent: "quote_explanation",
      route: "/quote.html"
    },
    {
      area: "cheapest option",
      prompt: "I want cheapest",
      intent: "product_guidance",
      route: "/products.html"
    },
    {
      area: "competitor quote",
      prompt: "Can you beat this quote?",
      intent: "existing_quote_review",
      route: "/quote-review.html?from=chatbot&mode=upload"
    },
    {
      area: "trust professionalism",
      prompt: "Can I trust Operon?",
      intent: "route_next_step",
      route: "/quote.html"
    },
    {
      area: "route suggestions",
      prompt: "I am ready",
      route: "/quote.html"
    },
    {
      area: "json schema",
      prompt: "52",
      intent: "missing_info_collection",
      route: "/quote.html",
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

test("guided quote prequalification collects safe handoff summary", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyAction("ready_for_quote");
  logic.applyTextInput("Auburn");
  logic.applyAction("prequal_property_house");
  logic.applyAction("prequal_flooring_hybrid");
  logic.applyTextInput("60 m2");
  logic.applyAction("prequal_no");
  logic.applyAction("prequal_yes");
  logic.applyAction("prequal_file_both");

  const snapshot = logic.getSnapshot();
  const summary = snapshot.prequalification.summary;

  assert.strictEqual(snapshot.stage, "prequal_complete");
  assert.strictEqual(summary.suburb, "Auburn");
  assert.strictEqual(summary.property_type, "house");
  assert.strictEqual(summary.product_category, "hybrid");
  assert.strictEqual(summary.area_status, "known");
  assert.strictEqual(summary.approx_area_m2, 60);
  assert.strictEqual(summary.stairs_status, "no");
  assert.strictEqual(summary.removal_status, "yes");
  assert.strictEqual(summary.existing_quote_status, "has_quote");
  assert.strictEqual(summary.floorplan_status, "has_floorplan");
  assert.strictEqual(summary.next_action, "go_to_quote");
  assert.strictEqual(summary.confidence, "high");
  assert.strictEqual(Array.isArray(summary.missing_info), true);
  assert.strictEqual(summary.missing_info.length, 0);
  assert.match(snapshot.routeSuggestion.href, /^\/quote\.html\?source=chatbot&category=hybrid#quoteForm$/);
  assert.strictEqual(summary.handoff_url, snapshot.routeSuggestion.href);
  assert.match(lastAssistantText(snapshot), /Great.+quote form.+Anything unsure/i);
  assert.doesNotMatch(JSON.stringify(summary), /\$\s*\d|rate|margin|supplier|phone|email|name/i);
});

test("chatbot lead qualification TypeScript contract is customer safe", function () {
  const contractPath = path.resolve(__dirname, "..", "..", "..", "apps", "web-tsx", "src", "lib", "chatbotLeadQualification.ts");
  const contract = fs.readFileSync(contractPath, "utf8");

  [
    "export type ChatbotLeadQualification",
    "source_page: string",
    "source_url: string",
    "intent: ChatbotLeadIntent",
    "product_category?: \"hybrid\" | \"laminate\" | \"engineered_timber\" | \"not_sure\"",
    "area_status: \"known\" | \"unknown\" | \"has_floorplan\" | \"not_sure\"",
    "approx_area_m2?: number",
    "floorplan_status: \"has_floorplan\" | \"no_floorplan\" | \"not_sure\"",
    "existing_quote_status: \"has_quote\" | \"no_quote\" | \"not_sure\"",
    "missing_info: string[]",
    "confidence: \"low\" | \"medium\" | \"high\""
  ].forEach(function (fragment) {
    assert(contract.indexOf(fragment) >= 0, fragment);
  });

  assert.doesNotMatch(contract, /price|rate|margin|supplier|ocr|transcript|phone|email|name/i);
});

test("guided quote prequalification accepts not sure and skip answers", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyAction("ready_for_quote");
  logic.applyAction("prequal_not_sure");
  logic.applyAction("prequal_not_sure");
  logic.applyAction("prequal_flooring_unsure");
  logic.applyAction("prequal_area_unknown");
  logic.applyAction("prequal_not_sure");
  logic.applyAction("prequal_skip");
  logic.applyAction("prequal_not_sure");

  const snapshot = logic.getSnapshot();
  const summary = snapshot.prequalification.summary;

  assert.strictEqual(snapshot.stage, "prequal_complete");
  assert.strictEqual(summary.suburb, "");
  assert.strictEqual(summary.property_type, "not_sure");
  assert.strictEqual(summary.product_category, "not_sure");
  assert.strictEqual(summary.area_status, "not_sure");
  assert.strictEqual(summary.stairs_status, "not_sure");
  assert.strictEqual(summary.removal_status, "not_sure");
  assert.strictEqual(summary.next_action, "go_to_quote");
  assert.strictEqual(summary.confidence, "low");
  assert(summary.missing_info.indexOf("product_category") >= 0);
  assert(summary.missing_info.indexOf("area") >= 0);
  assert.strictEqual(snapshot.routeSuggestion.href, "/quote.html?source=chatbot#quoteForm");
  assert.doesNotMatch(lastAssistantText(snapshot), /\$\s*\d|per\s*m2|formula|margin/i);
});

test("guided quote prequalification flags apartment stairs removal floorplan and quote paths", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyAction("ready_for_quote");
  logic.applyTextInput("Sydney");
  logic.applyAction("prequal_property_apartment");
  logic.applyAction("prequal_flooring_laminate");
  logic.applyAction("prequal_area_known");
  logic.applyAction("prequal_yes");
  logic.applyAction("prequal_yes");
  logic.applyAction("prequal_file_floorplan");

  const snapshot = logic.getSnapshot();
  const summary = snapshot.prequalification.summary;

  assert.strictEqual(summary.property_type, "apartment");
  assert.strictEqual(summary.product_category, "laminate");
  assert.strictEqual(summary.area_status, "known");
  assert.strictEqual(summary.stairs_status, "yes");
  assert.strictEqual(summary.removal_status, "yes");
  assert.strictEqual(summary.floorplan_status, "has_floorplan");
  assert.strictEqual(summary.existing_quote_status, "not_sure");
  assert.strictEqual(summary.confidence, "high");
  assert.strictEqual(snapshot.routeSuggestion.href, "/quote.html?source=chatbot&category=laminate#quoteForm");
  assert.doesNotMatch(snapshot.routeSuggestion.href, /propertyType|stairs|removal|floorplan|existingQuote|areaStatus|Sydney/i);
});

test("quote-review assistant routes PDF and screenshot users to upload review", function () {
  [
    { action: "quote_review_file_yes", label: "pdf" },
    { action: "quote_review_file_screenshot", label: "screenshot" }
  ].forEach(function (scenario) {
    const context = loadCore();
    const logic = createLogic(context);

    logic.begin();
    logic.applyAction("review_existing_quote");
    logic.applyAction(scenario.action);

    const snapshot = logic.getSnapshot();
    const text = lastAssistantText(snapshot);

    assert.strictEqual(snapshot.structuredOutput.intent, "existing_quote_review", scenario.label);
    assert.strictEqual(snapshot.routeSuggestion.href, "/quote-review.html?from=chatbot&mode=upload", scenario.label);
    assert.match(text, /Upload gives the strongest review|Review my quote/i, scenario.label);
    assert.doesNotMatch(text, /raw quote|extracted text|\$\s*\d|per\s*m2|internal rate/i, scenario.label);
  });
});

test("quote-review assistant runs safe no-file checklist", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyAction("review_existing_quote");
  logic.applyAction("quote_review_file_no");
  logic.applyAction("quote_review_check_yes");
  logic.applyAction("quote_review_check_no");
  logic.applyAction("quote_review_check_not_sure");
  logic.applyAction("quote_review_check_yes");
  logic.applyAction("quote_review_check_skip");
  logic.applyAction("quote_review_check_no");

  const snapshot = logic.getSnapshot();
  const summary = snapshot.quoteReviewGuide.summary;

  assert.strictEqual(snapshot.stage, "quote_review_quick_check_complete");
  assert.strictEqual(snapshot.structuredOutput.intent, "existing_quote_review");
  assert.strictEqual(snapshot.routeSuggestion.href, "/quote-review.html?from=chatbot&mode=quick_check#quick-check");
  assert(summary.missing_items.indexOf("area shown") >= 0);
  assert(summary.missing_items.indexOf("trims stairs listed") >= 0);
  assert.match(lastAssistantText(snapshot), /quick completeness check|Items to check|Review my quote/i);
  assert.doesNotMatch(JSON.stringify(snapshot.quoteReviewGuide), /raw quote|extracted text|\$\s*\d|phone|email|name/i);
});

test("quote-review assistant offers comparison quote without judging price", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("Is this quote expensive?");
  logic.applyAction("quote_review_file_no");
  logic.applyAction("quote_review_check_not_sure");
  logic.applyAction("quote_review_check_not_sure");
  logic.applyAction("quote_review_check_not_sure");
  logic.applyAction("quote_review_check_not_sure");
  logic.applyAction("quote_review_check_not_sure");
  logic.applyAction("quote_review_check_not_sure");

  let snapshot = logic.getSnapshot();
  assert(lastAssistantActions(snapshot).indexOf("Review my quote") >= 0);
  assert(lastAssistantActions(snapshot).indexOf("Start Operon comparison quote") >= 0);
  assert.doesNotMatch(lastAssistantText(snapshot), /expensive|cheaper|beat/i);

  logic.applyAction("ready_for_quote");
  snapshot = logic.getSnapshot();
  assert.strictEqual(snapshot.stage, "quote_prequalification");
  assert.match(lastAssistantText(snapshot), /What suburb is the job in/i);
});

test("quote-review assistant rejects raw pasted quote text", function () {
  const context = loadCore();
  const logic = createLogic(context);
  const rawQuote = [
    "Competitor quote",
    "Hybrid supply and install",
    "Area 62m2",
    "Total $4300 inc GST",
    "Removal extra"
  ].join("\\n") + " ".repeat(320);

  logic.begin();
  logic.applyTextInput(rawQuote);

  const snapshot = logic.getSnapshot();
  const transcriptText = snapshot.transcript.map(function (message) { return message.text; }).join("\\n");

  assert.strictEqual(snapshot.structuredOutput.intent, "existing_quote_review");
  assert.strictEqual(snapshot.routeSuggestion.href, "/quote-review.html?from=chatbot&mode=upload");
  assert.match(lastAssistantText(snapshot), /Please do not paste raw quote text|Review my quote/i);
  assert.strictEqual(transcriptText.indexOf("Total $4300"), -1);
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
      route: "/quote-review.html",
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
      route: "/quote-review.html",
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
      route: "/quote.html",
      assertStructured: function (structured, snapshot) {
        assert.strictEqual(structured.quote_mode, "install_only");
        assert.strictEqual(snapshot.quoteFieldDraft.selectedProductCategory, "");
      }
    },
    {
      label: "uneven floor",
      prompt: "The floor is uneven",
      intent: "scope_validation",
      route: "/quote-review.html",
      assertStructured: function (structured) {
        assert.strictEqual(structured.subfloor_condition, "minor_prep");
        assert.strictEqual(structured.floor_prep_type, "levelling");
      }
    },
    {
      label: "only floorplan",
      prompt: "I only have a floorplan",
      intent: "floorplan_help",
      route: "/floorplan.html",
      assertStructured: function (structured) {
        assert.strictEqual(structured.measurement_method, "floorplan_upload");
      }
    },
    {
      label: "herringbone",
      prompt: "I need herringbone",
      intent: "product_guidance",
      route: "/products.html",
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
  assert.strictEqual(snapshot.structuredOutput.intent, "floorplan_help");
  assert.strictEqual(snapshot.structuredOutput.measurement_method, "floorplan_upload");
  assert.strictEqual(snapshot.structuredOutput.next_step, "/floorplan.html");
  assert.strictEqual(snapshot.routeSuggestion.href, "/floorplan.html");
});

test("operator requests show human follow-up without pretending live chat", function () {
  const context = loadCore();
  const logic = createLogic(context);

  logic.begin();
  logic.applyTextInput("Can I chat with an online operator?");

  const snapshot = logic.getSnapshot();
  const text = lastAssistantText(snapshot);
  assert.strictEqual(snapshot.structuredOutput.intent, "contact_human");
  assert(snapshot.operatorHandoff, "operator handoff section missing");
  assert.strictEqual(snapshot.operatorHandoff.href, "/contact.html?from=chatbot");
  assert.strictEqual(snapshot.routeSuggestion.href, "/contact.html?from=chatbot");
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
    assert(/^\/(quote|products|quote-review|floorplan)\.html(?:[?#].*)?$/.test(snapshot.routeSuggestion.href), prompt);
    if (prompt.indexOf("floorplan") < 0) {
      assert.notStrictEqual(snapshot.routeSuggestion.href, "/floorplan.html", prompt);
    }
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

  assert.strictEqual(controller.getStructuredOutput().intent, "general_question");
  assert.strictEqual(controller.getRouteSuggestion().href, "/quote.html");
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
    next_step: "/products.html"
  });
  const incompleteQuote = mapper.toHandoffReadiness({
    intent: "route_next_step",
    category: "hybrid",
    next_step: "/quote.html"
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
    next_step: "/quote-review.html",
    readiness: "review"
  });

  assert.strictEqual(review.status, "needs_review");
  assert.strictEqual(review.safe_to_apply, false);
  assert(review.review_flags.indexOf("stairs_require_manual_review") >= 0);
  assert.strictEqual(review.next_step, "/quote-review.html");
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
    next_step: "/quote.html",
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
  assert.strictEqual(getConfig("/floorplan.html").pageKey, "floorplan");
  assert.strictEqual(getConfig("/contact.html").pageKey, "contact");
  assert.strictEqual(getConfig("/thank-you.html").pageKey, "thank-you");
  assert.strictEqual(getConfig("/blog/").pageKey, "blog");
  assert.strictEqual(getConfig("/blog/how-to-compare-flooring-quotes.html").pageKey, "blog");
});

test("chatbot route suggestions are root-relative and cannot nest under blog paths", function () {
  const routePattern = /(?:href|initialRouteHref|next_step):\s*"([^"]+)"|setRoute\([^,\n]+,\s*"([^"]+)"/g;
  const allowedPrefixes = [
    "/quote.html",
    "/products.html",
    "/quote-review.html",
    "/floorplan.html",
    "/contact.html",
    "/blog/",
    "/thank-you.html",
    "/hybrid-flooring-sydney.html",
    "/laminate-flooring-sydney.html",
    "/engineered-timber-flooring-sydney.html",
    "/flooring-",
    "/floor-care-maintenance.html"
  ];
  const combinedSource = CORE_FILES.map(function (fileName) {
    return fs.readFileSync(path.resolve(CHATBOT_DIR, fileName), "utf8");
  }).join("\n");
  const routeValues = [];
  let match = null;

  while ((match = routePattern.exec(combinedSource))) {
    const route = match[1] || match[2] || "";
    if (route && route.indexOf(".html") >= 0 || route === "/blog/") {
      routeValues.push(route);
    }
  }

  assert(routeValues.length > 20, "expected chatbot routes to be inspected");
  routeValues.forEach(function (route) {
    assert(route.charAt(0) === "/", "route is not root-relative: " + route);
    assert(allowedPrefixes.some(function (prefix) { return route.indexOf(prefix) === 0; }), "route is outside approved funnel: " + route);
    assert.strictEqual(new URL(route, "https://operonflooring.com.au/blog/example.html").pathname.indexOf("/blog/quote.html"), -1, route);
    assert.strictEqual(new URL(route, "https://operonflooring.com.au/blog/example.html").pathname.indexOf("/blog/products.html"), -1, route);
    assert.strictEqual(new URL(route, "https://operonflooring.com.au/blog/example.html").pathname.indexOf("/blog/floorplan.html"), -1, route);
    assert.strictEqual(new URL(route, "https://operonflooring.com.au/blog/example.html").pathname.indexOf("/blog/quote-review.html"), -1, route);
  });
});

test("new chatbot page states cover products floorplan contact and blog", function () {
  [
    {
      pageKey: "products",
      flow: undefined,
      href: "/products.html",
      expected: /Choose a category|flooring selection/i
    },
    {
      pageKey: "floorplan",
      flow: "floorplan_help",
      href: "/floorplan.html",
      expected: /floor plan|area/i
    },
    {
      pageKey: "contact",
      flow: "contact_human",
      href: "/contact.html",
      expected: /contact|human/i
    },
    {
      pageKey: "blog",
      flow: "guide_reader",
      href: "/quote.html",
      expected: /Guide readers|quote/i
    }
  ].forEach(function (scenario) {
    const context = loadCore("/" + (scenario.pageKey === "blog" ? "blog/how-to-compare-flooring-quotes.html" : scenario.pageKey + ".html"));
    const siteState = context.window.OperonChatbotSiteState.getSnapshot({ pageKey: scenario.pageKey });

    assert.strictEqual(siteState.readOnly, true, scenario.pageKey);
    assert.strictEqual(siteState.canWriteFields, false, scenario.pageKey);
    assert.strictEqual(siteState.canCalculatePrice, false, scenario.pageKey);
    if (scenario.flow) {
      assert.strictEqual(siteState.flow, scenario.flow, scenario.pageKey);
    }
    assert.strictEqual(siteState.next.href, scenario.href, scenario.pageKey);
    assert.match(siteState.nudge, scenario.expected, scenario.pageKey);
  });
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

test("tsx pages mount chatbot on required route coverage pages", function () {
  const appDir = path.resolve(__dirname, "..", "..", "..", "apps", "web-tsx", "src");
  [
    { file: "app/page.tsx", signal: "<HomeChatbot" },
    { file: "app/products/page.tsx", signal: '<HomeChatbot pageKey="products"' },
    { file: "app/floorplan/page.tsx", signal: '<HomeChatbot pageKey="floorplan"' },
    { file: "app/contact/page.tsx", signal: '<HomeChatbot pageKey="contact"' },
    { file: "app/blog/index/page.tsx", signal: '<HomeChatbot pageKey="blog"' },
    { file: "lib/quoteReviewGuides.tsx", signal: '<HomeChatbot pageKey="blog"' }
  ].forEach(function (page) {
    const source = fs.readFileSync(path.resolve(appDir, page.file), "utf8");
    assert(source.indexOf(page.signal) >= 0, page.file);
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
    "min-height: 44px",
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

test("quote page site state detects current wizard step and missing fields", function () {
  const context = loadCore("/quote.html");

  setQuotePageFixture(context, 1, {
    measurementMethod: "manual_total",
    selectedProductCategory: ""
  });

  const productState = context.window.OperonChatbotSiteState.getSnapshot({ pageKey: "quote" });
  assert.strictEqual(productState.activeStep, 1);
  assert.strictEqual(productState.activeStepNumber, 2);
  assert.strictEqual(productState.stepTitle, "Flooring/product");
  assert.strictEqual(productState.flow, "flooring_product");
  assert(productState.missingInputs.indexOf("flooring category") >= 0);
  assert.strictEqual(productState.next.focusId, "selectedProductCategory");

  setQuotePageFixture(context, 2, {
    measurementMethod: "manual_total",
    totalAreaM2: ""
  });

  const areaState = context.window.OperonChatbotSiteState.getSnapshot({ pageKey: "quote" });
  assert.strictEqual(areaState.stepTitle, "Area");
  assert.strictEqual(areaState.flow, "area");
  assert(areaState.missingInputs.indexOf("area") >= 0);
  assert.strictEqual(areaState.next.focusId, "totalAreaM2");

  setQuotePageFixture(context, 3, {
    stairs: "yes",
    stairWidthKnown: "yes",
    stairWidthMm: "",
    stairStraightTreadCount: "0",
    stairWinderTreadCount: "0",
    stairLandingSmallCount: "0",
    stairLandingLargeCount: "0",
    stairOneSideOpenCount: "0",
    stairTwoSideOpenCount: "0"
  });

  const stairState = context.window.OperonChatbotSiteState.getSnapshot({ pageKey: "quote" });
  assert.strictEqual(stairState.stepTitle, "Stairs");
  assert.strictEqual(stairState.flow, "stairs");

  setQuotePageFixture(context, 5, {
    customerNotes: ""
  });

  const summaryState = context.window.OperonChatbotSiteState.getSnapshot({ pageKey: "quote" });
  assert.strictEqual(summaryState.stepTitle, "Summary/review");
  assert.strictEqual(summaryState.flow, "summary_review");
  assert.strictEqual(summaryState.isNearCompletion, true);
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
  assert.strictEqual(snapshot.routeSuggestion.href, "/quote.html");
  assert.strictEqual(snapshot.siteState.readOnly, true);
  assert.doesNotMatch(lastAssistantText(snapshot), /Key point:|Next step:|source of truth|calculator stays/i);
});

test("quote page stuck recovery gives step-specific guidance", function () {
  const context = loadCore("/quote.html");
  setQuotePageFixture(context, 1, {
    measurementMethod: "manual_total",
    totalAreaM2: ""
  });
  const logic = context.window.OperonChatbotLogic.createChatbotLogic({
    onUpdate() {},
    pageKey: "quote"
  });

  logic.begin();
  logic.applyTextInput("I am stuck");

  const snapshot = logic.getSnapshot();
  const text = lastAssistantText(snapshot);
  assert.strictEqual(snapshot.siteState.stepTitle, "Flooring/product");
  assert.strictEqual(snapshot.siteState.next.focusId, "selectedProductCategory");
  assert.match(text, /Flooring\/product|product|flooring/i);
  assert.doesNotMatch(text, /\$\s*\d|per\s*m2|formula|calculator/i);
});

test("quote review site state detects visible result without pricing control", function () {
  const context = loadCore("/quote-review.html");
  setQuoteReviewFixture(context, {
    clarityLevel: { text: "Comparable with caution" },
    clarityTag: { text: "Scope clarity" },
    extractedQuoteFieldsBox: { text: "", hidden: false },
    extractedQuoteFieldsList: { text: "Hybrid 7mm supply and install. 73 m2. Total inc GST visible." },
    mediumRiskList: { text: "Underlay or acoustic layer is unknown. Floor preparation is unknown. Trims and skirting are unknown." },
    questionsToAskList: { text: "Is acoustic underlay included? Is floor preparation or levelling included?" },
    decisionGuidance: { text: "Confirm inclusions before comparing totals." }
  });

  const siteState = context.window.OperonChatbotSiteState.getSnapshot({ pageKey: "quote-review" });
  assert.strictEqual(siteState.readOnly, true);
  assert.strictEqual(siteState.canCalculatePrice, false);
  assert.strictEqual(siteState.flow, "quote_review_result");
  assert.strictEqual(siteState.reviewResultVisible, true);
  assert.strictEqual(siteState.reviewStatus, "Comparable with caution");
  assert.strictEqual(Object.prototype.hasOwnProperty.call(siteState, "reviewExtractedDetails"), false);
  assert(siteState.reviewMissingScope.join(" ").indexOf("Underlay") >= 0);
  assert(siteState.reviewQuestions.join(" ").indexOf("acoustic underlay") >= 0);
});

test("quote review result guidance stays scope-first and routes to estimate", function () {
  const context = loadCore("/quote-review.html");
  setQuoteReviewFixture(context, {
    clarityLevel: { text: "Comparable with caution" },
    clarityTag: { text: "Scope clarity" },
    extractedQuoteFieldsBox: { text: "", hidden: false },
    extractedQuoteFieldsList: { text: "Hybrid 7mm supply and install. 73 m2. Total inc GST visible." },
    mediumRiskList: { text: "Underlay or acoustic layer is unknown. Floor preparation is unknown." },
    questionsToAskList: { text: "Is acoustic underlay included? Is floor preparation or levelling included?" },
    decisionGuidance: { text: "Confirm inclusions before comparing totals." }
  });
  const logic = context.window.OperonChatbotLogic.createChatbotLogic({
    onUpdate() {},
    pageKey: "quote-review"
  });

  logic.begin();
  logic.applyTextInput("what does this result mean?");

  const snapshot = logic.getSnapshot();
  const text = lastAssistantText(snapshot);
  assert.strictEqual(snapshot.siteState.flow, "quote_review_result");
  assert.strictEqual(snapshot.structuredOutput.intent, "quote_review_result_explanation");
  assert.strictEqual(snapshot.routeSuggestion.href, "/quote.html?source=quote_review");
  assert.match(text, /scope|Underlay|Confirm/i);
  assert.doesNotMatch(text, /\$\s*\d|cheaper|bad quote|calculator|formula/i);
});

test("quote review result guidance gives one contractor question", function () {
  const context = loadCore("/quote-review.html");
  setQuoteReviewFixture(context, {
    clarityLevel: { text: "Comparable with caution" },
    clarityTag: { text: "Scope clarity" },
    mediumRiskList: { text: "Floor preparation is unknown. Trims and skirting are unknown." },
    questionsToAskList: { text: "Is floor preparation or levelling included? Are trims, scotia, transition trims or skirting included?" },
    decisionGuidance: { text: "Confirm inclusions before comparing totals." }
  });
  const logic = context.window.OperonChatbotLogic.createChatbotLogic({
    onUpdate() {},
    pageKey: "quote-review"
  });

  logic.begin();
  logic.applyTextInput("what should I ask?");

  const snapshot = logic.getSnapshot();
  const text = lastAssistantText(snapshot);
  assert.match(text, /Ask one direct scope question/i);
  assert.match(text, /floor preparation|levelling/i);
  assert.doesNotMatch(text, /cheaper|expensive|bad quote|\$\s*\d/i);
});


test("preview includes diagnostics panel and scenario matrix", function () {
  const html = fs.readFileSync(CHATBOT_PREVIEW_PATH, "utf8");

  assert(html.indexOf("Diagnostics") >= 0);
  assert(html.indexOf("Scenario QA Matrix") >= 0);
  assert(html.indexOf("diagIntent") >= 0);
  assert(html.indexOf("diagRoute") >= 0);
  assert(html.indexOf("runMatrixButton") >= 0);
  assert(html.indexOf("I want cheapest") >= 0);
  assert(html.indexOf("Can you beat this quote?") >= 0);
});

test("preview includes knowledge coverage report", function () {
  const html = fs.readFileSync(CHATBOT_PREVIEW_PATH, "utf8");

  assert(html.indexOf("Coverage Report") >= 0);
  assert(html.indexOf("runCoverageButton") >= 0);
  assert(html.indexOf("coverageCases") >= 0);
  assert(html.indexOf("Product guidance") >= 0);
  assert(html.indexOf("JSON schema") >= 0);
});

test("preview includes handoff readiness diagnostics", function () {
  const html = fs.readFileSync(CHATBOT_PREVIEW_PATH, "utf8");

  assert(html.indexOf("diagHandoff") >= 0);
  assert(html.indexOf("diagApply") >= 0);
  assert(html.indexOf("safe_to_apply") >= 0);
});

test("preview includes release readiness panel", function () {
  const html = fs.readFileSync(CHATBOT_PREVIEW_PATH, "utf8");

  assert(html.indexOf("Release Readiness") >= 0);
  assert(html.indexOf("runReleaseButton") >= 0);
  assert(html.indexOf("releaseGates") >= 0);
  assert(html.indexOf("Passive mount") >= 0);
  assert(html.indexOf("safe_to_apply remains false") >= 0);
});

test("preview includes mobile audit panel", function () {
  const html = fs.readFileSync(CHATBOT_PREVIEW_PATH, "utf8");

  assert(html.indexOf("Mobile Audit") >= 0);
  assert(html.indexOf("runMobileAuditButton") >= 0);
  assert(html.indexOf("mobileAuditChecks") >= 0);
  assert(html.indexOf("Pointer safety") >= 0);
  assert(html.indexOf("Safe area") >= 0);
});

test("coverage report document lists required journey areas", function () {
  const report = readChatbotDoc("CHATBOT_COVERAGE.md");
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
  const report = readChatbotDoc("CHATBOT_KNOWLEDGE_INDEX.md");
  [
    "approved site knowledge",
    "product category summaries",
    "suburb page summaries",
    "blog guide summaries",
    "underlay/acoustic layer",
    "Scope-First Knowledge Pattern",
    "must not",
    "display prices",
    "does not crawl the site"
  ].forEach(function (rule) {
    assert(report.indexOf(rule) >= 0, rule);
  });
});

test("response guardrail document lists controlled answer rules", function () {
  const report = readChatbotDoc("CHATBOT_RESPONSE_GUARDRAILS.md");
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
  const contract = readChatbotDoc("CHATBOT_HANDOFF_CONTRACT.md");
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
  const report = readChatbotDoc("CHATBOT_RELEASE_READINESS.md");
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
  const report = readChatbotDoc("CHATBOT_MOBILE_AUDIT.md");
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
  const report = readChatbotDoc("CHATBOT_EDGE_CASES.md");
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
