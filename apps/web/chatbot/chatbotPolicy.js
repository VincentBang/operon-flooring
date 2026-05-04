(function () {
  const INTENTS = {
    productGuidance: "product_guidance",
    quoteExplanation: "quote_explanation",
    scopeValidation: "scope_validation",
    detailCollection: "detail_collection",
    installOnly: "install_only",
    routeNextStep: "route_next_step",
    unsupported: "unsupported"
  };

  const HARD_RULES = [
    "Do not calculate prices, totals, discounts, or square metre rates.",
    "Do not claim Operon is cheaper than a competitor.",
    "Do not describe the online estimate as a final quote.",
    "Do not update quote fields, product selection, localStorage, or forms.",
    "Do not override the product catalogue, quote wizard, or quote calculator.",
    "Do not provide open-ended AI advice outside flooring product and quote guidance."
  ];

  const ROUTES = {
    products: { label: "Browse products", href: "products.html" },
    quote: { label: "Start quote", href: "quote.html" },
    quoteReview: { label: "Review quote scope", href: "quote-review.html" }
  };

  const UNSUPPORTED_RESPONSE = "This assistant is limited to product guidance, quote explanation, and scope details. Pricing, totals, competitor comparisons, and final quote decisions stay with the quote process and Operon review.";
  const PRICE_RESPONSE = "I cannot calculate or estimate pricing here. The quote process builds the estimate, and final pricing is confirmed after review.";
  const COMPETITOR_RESPONSE = "I cannot compare competitor pricing or claim cheaper pricing. The useful next step is to clarify product direction and quote scope.";

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
    if (includesAny(value, ["cheaper", "competitor", "beat price", "price match", "bunnings", "quote against"])) {
      return INTENTS.unsupported;
    }
    if (includesAny(value, ["how much", "total", "price", "cost", "$", "rate"])) {
      return INTENTS.quoteExplanation;
    }
    if (includesAny(value, ["install only", "already bought", "already have flooring", "my own flooring"])) {
      return INTENTS.installOnly;
    }
    if (includesAny(value, ["quote", "estimate", "final", "submit", "review"])) {
      return INTENTS.quoteExplanation;
    }
    if (includesAny(value, ["missing", "scope", "prep", "access", "stairs", "furniture", "removal", "subfloor"])) {
      return INTENTS.scopeValidation;
    }
    if (includesAny(value, ["product", "hybrid", "laminate", "engineered", "timber", "flooring type", "waterproof"])) {
      return INTENTS.productGuidance;
    }
    if (includesAny(value, ["start", "continue", "browse", "next"])) {
      return INTENTS.routeNextStep;
    }

    return INTENTS.detailCollection;
  }

  function getPolicyNotice(text) {
    const value = String(text || "").toLowerCase();

    if (includesAny(value, ["cheaper", "competitor", "beat price", "price match"])) {
      return COMPETITOR_RESPONSE;
    }
    if (includesAny(value, ["how much", "total", "price", "cost", "$", "rate"])) {
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
    classifyIntent: classifyIntent,
    evaluateUserText: evaluateUserText,
    normaliseRoute: normaliseRoute,
    getUnsupportedResponse: getUnsupportedResponse
  };
}());
