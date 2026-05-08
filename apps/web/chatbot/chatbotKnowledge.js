(function () {
  const KNOWLEDGE_INDEX = window.OperonChatbotKnowledgeIndex || null;

  const CATEGORY_GUIDANCE = {
    hybrid: {
      label: "Hybrid",
      summary: "Hybrid is the practical default when water resistance, easy maintenance, and busy-home durability matter.",
      bestFor: ["apartments", "family homes", "pets", "kitchens", "general renovations"],
      cautions: ["still needs subfloor and site details checked", "final colour and site scope are confirmed through the quote path"],
      rangeNotes: ["ETF hybrid is organised by 7.0mm, 8.0mm, and 9.0mm ranges.", "Colour previews are for browsing; the quote can start from the selected range."]
    },
    laminate: {
      label: "Laminate",
      summary: "Laminate is a straightforward starting point for dry areas and simpler floating-floor projects.",
      bestFor: ["budget-conscious projects", "bedrooms", "dry living spaces", "quick decisions"],
      cautions: ["not the first choice where water exposure is a priority", "subfloor and removal still matter"],
      rangeNotes: ["12mm water-resistant AC4 laminate can be previewed by colour before starting the quote.", "Use laminate when the project is dry-area and straightforward."]
    },
    engineered: {
      label: "Engineered Timber",
      summary: "Engineered timber suits a more finish-led project where the timber look and specification matter more.",
      bestFor: ["premium renovations", "feature living areas", "design-led homes", "direct glue review", "herringbone feature areas"],
      cautions: ["installation method and pattern need clearer review", "herringbone and chevron usually need more confirmation", "engineered colour should be confirmed in the quote flow"],
      rangeNotes: ["Swish Oak Natura and Swish Oak Natura Herringbone are current engineered range examples.", "Select the range first, then confirm colour and pattern details through the quote."]
    }
  };

  const QUOTE_EXPLANATION = "The online result is a guided starting estimate, not the final confirmed quote. The quote gathers contact details, property details, product direction, measured area, stairs, removal, disposal, preparation, trims, furniture, and notes so Operon can review the real scope before confirmation.";
  const FACTORS = [
    "measured area",
    "flooring category and product path",
    "existing floor to remove",
    "take-away disposal",
    "subfloor preparation",
    "apartment parking and lift details",
    "stairs or manual review items",
    "skirting, scotia, furniture, and door trimming"
  ];

  const RISK_COPY = {
    area_missing_for_ready_state: "area is still missing",
    removal_disposal_not_confirmed: "removed-floor disposal is not confirmed",
    apartment_lift_not_confirmed: "apartment lift details are not confirmed",
    stairs_require_manual_review: "stairs require manual review",
    subfloor_review_recommended: "subfloor condition should be reviewed",
    access_review_recommended: "parking or site details should be reviewed"
  };

  const PLAYBOOKS = {
    apartment: {
      label: "Apartment project",
      summary: "For apartments, building details should be captured before submit."
    },
    installOnly: {
      label: "Installation only",
      summary: "For installation-only jobs, the assistant should collect scope details but leave material selection and pricing to the quote review."
    },
    replacingCarpet: {
      label: "Replacing carpet",
      summary: "Carpet replacement usually needs removal and disposal clarity, plus a quick subfloor check once the carpet is lifted."
    },
    unknownArea: {
      label: "Unknown area",
      summary: "If the area is unknown, guide the user to enter a rough manual total or use the floor plan path in the quote."
    },
    engineeredColour: {
      label: "Engineered colour choice",
      summary: "Engineered timber can be browsed by range first. The quote flow should confirm the final colour before submission."
    },
    quoteReview: {
      label: "Quote review",
      summary: "Quick review is a scope check from structured details. Detailed review needs the uploaded quote document before a full report is shown."
    }
  };

  function getCategoryGuidance(category) {
    return CATEGORY_GUIDANCE[category] || null;
  }

  function getRecommendationSummary(category, context) {
    const guidance = getCategoryGuidance(category);
    if (!guidance) {
      return "A practical category can be recommended once product priorities are clearer.";
    }

    let summary = guidance.label + " looks like the strongest starting category here. " + guidance.summary;

    if (context === "context_apartment") {
      summary += " " + PLAYBOOKS.apartment.summary;
    } else if (context === "context_design_led") {
      summary += " It gives the final review more room to confirm finish, method, and pattern.";
    } else if (context === "context_quick_turnaround") {
      summary += " Keep the quote path simple while the remaining site details are gathered.";
    }

    return summary;
  }

  function getQuoteExplanation() {
    return QUOTE_EXPLANATION;
  }

  function getPriceFactorsCopy() {
    return "The main estimate factors are " + FACTORS.join(", ") + ".";
  }

  function getRangeGuidance(category) {
    const guidance = getCategoryGuidance(category);
    if (!guidance || !Array.isArray(guidance.rangeNotes)) {
      return "";
    }
    return guidance.rangeNotes.join(" ");
  }

  function getRiskCopy(flags) {
    const values = Array.isArray(flags) ? flags : [];
    const readable = values.map(function (flag) {
      return RISK_COPY[flag] || flag.replace(/_/g, " ");
    });

    return readable;
  }

  function getPlaybook(key) {
    return PLAYBOOKS[key] || null;
  }

  function findApprovedAnswer(text) {
    if (!KNOWLEDGE_INDEX || typeof KNOWLEDGE_INDEX.findApprovedAnswer !== "function") {
      return null;
    }

    return KNOWLEDGE_INDEX.findApprovedAnswer(text);
  }

  function getControlledIndex() {
    return KNOWLEDGE_INDEX || null;
  }

  window.OperonChatbotKnowledge = {
    categoryGuidance: CATEGORY_GUIDANCE,
    factors: FACTORS.slice(),
    playbooks: PLAYBOOKS,
    getCategoryGuidance: getCategoryGuidance,
    getRecommendationSummary: getRecommendationSummary,
    getQuoteExplanation: getQuoteExplanation,
    getPriceFactorsCopy: getPriceFactorsCopy,
    getRangeGuidance: getRangeGuidance,
    getRiskCopy: getRiskCopy,
    getPlaybook: getPlaybook,
    findApprovedAnswer: findApprovedAnswer,
    getControlledIndex: getControlledIndex
  };
}());
