(function () {
  const INTENTS = {
    startQuote: "start_quote",
    existingQuoteReview: "existing_quote_review",
    productHelp: "product_help",
    priceQuestion: "price_question",
    stairsRemovalScope: "stairs_removal_scope",
    suburbService: "suburb_service",
    contactHuman: "contact_human",
    generalQuestion: "general_question",
    productGuidance: "product_guidance",
    quoteExplanation: "quote_explanation",
    quickQuoteCompleteness: "quick_quote_completeness",
    documentQuoteReview: "document_quote_review",
    quoteReviewResultExplanation: "quote_review_result_explanation",
    floorplanHelp: "floorplan_help",
    scopeValidation: "scope_validation",
    detailCollection: "detail_collection",
    installOnly: "install_only",
    operatorHandoff: "operator_handoff",
    routeNextStep: "route_next_step",
    unsupported: "unsupported"
  };

  const HARD_RULES = [
    "Do not calculate prices, totals, discounts, or square metre rates.",
    "Do not claim Operon is cheaper than a competitor.",
    "Do not describe the online estimate as a final quote.",
    "Do not update quote fields, product selection, localStorage, or forms.",
    "Do not override the product catalogue, quote flow, or quote calculator.",
    "Do not treat the quick quote completeness check as a full document review.",
    "Do not show product matching or comparable estimates in quick-check wording.",
    "Do not provide open-ended AI advice outside flooring product and quote guidance."
  ];

  const ROUTES = {
    products: { label: "Choose product", href: "/products.html" },
    quote: { label: "Start quote", href: "/quote.html" },
    quoteReview: { label: "Check existing quote", href: "/quote-review.html" },
    quickCheck: { label: "Check existing quote", href: "/quote-review.html" },
    floorplan: { label: "Measure floor plan", href: "/floorplan.html" },
    contact: { label: "Contact Operon", href: "/contact.html" }
  };

  const UNSUPPORTED_RESPONSE = "This assistant is limited to product guidance, quote explanation, and scope details. Pricing, totals, competitor comparisons, and final quote decisions stay with the quote process and Operon review.";
  const PRICE_RESPONSE = "I cannot calculate or estimate pricing here. The quote process builds the estimate, and final pricing is confirmed after review.";
  const COMPETITOR_RESPONSE = "I cannot compare pricing or claim cheaper pricing. The useful next step is to check whether both quotes describe the same scope.";
  const QUOTE_REVIEW_MODES = {
    quick: {
      name: "Quick quote completeness check",
      purpose: "No-file check based only on customer-entered or ticked information.",
      forbidden: [
        "claim it reviewed the actual quote document",
        "claim price fairness",
        "compare total price",
        "generate an Operon price",
        "show document extraction labels",
        "show product match",
        "show Operon comparable estimate"
      ]
    },
    document: {
      name: "Document-based quote review",
      purpose: "Review the uploaded or written quote to extract visible price basis, product line, area, GST, total, and missing scope.",
      forbidden: [
        "call it final price advice",
        "claim another installer is wrong",
        "say Operon is cheaper",
        "show product match as likely below the policy threshold",
        "show contradictory confidence states"
      ]
    }
  };
  const PRODUCT_MATCH_POLICY = [
    { maxExclusive: 50, label: "Product match not confirmed" },
    { min: 50, maxExclusive: 70, label: "Possible category match only" },
    { min: 70, maxExclusive: 85, label: "Possible product match" },
    { min: 85, label: "Likely product match" }
  ];
  const CONFIDENCE_POLICY = {
    extractionConfidence: "Confidence that visible document fields were read correctly.",
    comparisonLevel: "not comparable / category-level only / product-level / scope-level",
    decisionConfidence: "How safe it is for a customer to compare the quote.",
    rules: [
      "Do not show comparison confidence high when comparison level is category-level only.",
      "Do not show comparable ready if an Operon estimate is not available or major scope is incomplete.",
      "Do not say one item is missing when multiple material scope items are unclear.",
      "Do not show confidence badges without explanation."
    ]
  };
  const FORBIDDEN_PUBLIC_COPY = [
    "that quote is expensive",
    "Operon will be cheaper",
    "we will beat this quote",
    "competitor quote is wrong",
    "final price",
    "guaranteed quote",
    "advisor view",
    "debug",
    "payload",
    "localStorage",
    "source of truth",
    "match 35%",
    "Operon comparable ready"
  ];
  const APPROVED_PUBLIC_COPY = [
    "business shown on document",
    "uploaded quote",
    "existing quote",
    "scope completeness",
    "comparison readiness",
    "price is easier to compare once both quotes describe the same job",
    "do not compare on total price only until scope is confirmed",
    "final site details are confirmed before installation"
  ];

  function includesAny(value, words) {
    return words.some(function (word) {
      return value.indexOf(word) >= 0;
    });
  }

  function classifyIntent(text) {
    const value = String(text || "").toLowerCase();

    if (!value) {
      return INTENTS.unsupported;
    }
    if (includesAny(value, ["operator", "human", "person", "live chat", "online chat", "sales", "consultant", "speak to someone", "talk to someone", "call me"])) {
      return INTENTS.contactHuman;
    }
    if (includesAny(value, ["beat price", "beat this quote", "beat my quote", "price match", "cheaper than", "expensive"])) {
      return INTENTS.unsupported;
    }
    if (includesAny(value, ["what does this report mean", "what does this review mean", "product match", "match 35", "comparison level", "missing items", "what should i ask", "why caution"])) {
      return INTENTS.existingQuoteReview;
    }
    if (includesAny(value, ["i do not have the file", "don't have the file", "no file", "quick check", "quick completeness", "only know total", "only says supply and install", "quote only says"])) {
      return INTENTS.existingQuoteReview;
    }
    if (includesAny(value, ["review my quote", "check my quote", "existing quote", "uploaded quote", "written quote", "is this quote fair", "hybrid 7mm quote", "quote review"])) {
      return INTENTS.existingQuoteReview;
    }
    if (includesAny(value, ["floor plan", "floorplan", "measure from plan", "measure with plan"])) {
      return INTENTS.floorplanHelp;
    }
    if (includesAny(value, ["suburb", "service area", "do you service", "near me", "sydney", "parramatta", "bankstown", "liverpool", "auburn", "miranda"])) {
      return INTENTS.suburbService;
    }
    if (includesAny(value, ["install only", "already bought", "already have flooring", "my own flooring"])) {
      return INTENTS.installOnly;
    }
    if (includesAny(value, ["how much", "total", "price", "cost", "$", "rate", "final price", "guaranteed quote"])) {
      return INTENTS.priceQuestion;
    }
    if (includesAny(value, ["quote", "estimate", "final", "submit", "review"])) {
      return INTENTS.startQuote;
    }
    if (includesAny(value, ["missing", "scope", "prep", "access", "stairs", "furniture", "removal", "subfloor"])) {
      return INTENTS.stairsRemovalScope;
    }
    if (includesAny(value, ["product", "hybrid", "laminate", "engineered", "timber", "flooring type", "waterproof"])) {
      return INTENTS.productHelp;
    }
    if (includesAny(value, ["start", "continue", "browse", "next"])) {
      return INTENTS.generalQuestion;
    }

    return INTENTS.generalQuestion;
  }

  function getPolicyNotice(text) {
    const value = String(text || "").toLowerCase();

    if (includesAny(value, ["beat price", "beat this quote", "beat my quote", "price match", "cheaper than", "expensive"])) {
      return COMPETITOR_RESPONSE;
    }
    if (includesAny(value, ["how much", "total", "price", "cost", "$", "rate", "final price", "guaranteed quote"])) {
      return PRICE_RESPONSE;
    }

    return "";
  }

  function evaluateUserText(text) {
    return {
      intent: classifyIntent(text),
      notice: getPolicyNotice(text)
    };
  }

  function normaliseRoute(routeKey) {
    return ROUTES[routeKey] || ROUTES.quote;
  }

  function getUnsupportedResponse() {
    return UNSUPPORTED_RESPONSE;
  }

  window.OperonChatbotPolicy = {
    intents: INTENTS,
    hardRules: HARD_RULES.slice(),
    routes: ROUTES,
    quoteReviewModes: QUOTE_REVIEW_MODES,
    productMatchPolicy: PRODUCT_MATCH_POLICY.slice(),
    confidencePolicy: CONFIDENCE_POLICY,
    forbiddenPublicCopy: FORBIDDEN_PUBLIC_COPY.slice(),
    approvedPublicCopy: APPROVED_PUBLIC_COPY.slice(),
    classifyIntent: classifyIntent,
    evaluateUserText: evaluateUserText,
    normaliseRoute: normaliseRoute,
    getUnsupportedResponse: getUnsupportedResponse
  };
}());
