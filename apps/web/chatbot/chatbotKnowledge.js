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
      summary: "Engineered timber suits a more finish-led project where timber look, colour, installation method, and specification matter more.",
      bestFor: ["premium renovations", "feature living areas", "design-led homes", "direct glue review", "herringbone feature areas"],
      cautions: ["installation method and pattern need clearer review", "herringbone and chevron usually need more confirmation", "engineered colour can affect pricing when colours vary within the same range"],
      rangeNotes: ["Swish Oak Natura and Swish Oak Natura Herringbone are current engineered range examples.", "Select the range first, then confirm colour and pattern details through the quote because engineered colours may carry different product pricing."]
    }
  };

  const QUOTE_FLOW_STEPS = [
    {
      key: "property",
      label: "Property",
      customerCopy: "Start with suburb, postcode, property type, and quote mode. Site address can stay optional until review."
    },
    {
      key: "flooring",
      label: "Flooring",
      customerCopy: "Choose supply and install or installation only, then pick the flooring category and product range where relevant."
    },
    {
      key: "area",
      label: "Area",
      customerCopy: "Add one total area, room-by-room measurements, use the floor plan tool, or choose a follow-up path if area is not known."
    },
    {
      key: "stairs",
      label: "Stairs",
      customerCopy: "Flag stairs and add stair counts where known. Unclear stair details can stay marked for review."
    },
    {
      key: "extras",
      label: "Extras",
      customerCopy: "Confirm removal, disposal, floor preparation, underlay, skirting, scotia, door trimming, furniture, and other scope notes where known."
    },
    {
      key: "summary",
      label: "Summary",
      customerCopy: "Review the estimate and missing scope notes, then submit for Operon confirmation."
    }
  ];

  const QUOTE_EXPLANATION = "The online quote is a guided starting estimate, not the final confirmed quote. It follows six customer-facing steps: Property, Flooring, Area, Stairs, Extras, then Summary. Customers can start with the details they know, use Not sure for uncertain scope, and submit for Operon confirmation.";
  const FACTORS = [
    "flooring category, range, colour, and pattern where relevant",
    "measurement method and area",
    "stairs",
    "existing floor to remove",
    "take-away disposal",
    "subfloor preparation",
    "underlay option such as Standard silver underlay, Premium acoustic underlay, Acoustic Rubber Underlay 5mm, or Acoustic Rubber Underlay 5mm glued down where relevant",
    "skirting, scotia, transition trims, moisture protection, door trimming, furniture, and notes",
    "final site scope confirmation before booking"
  ];

  const SCOPE_CHECKS = [
    {
      key: "product",
      label: "Product definition",
      customerCopy: "Product type, range, thickness, colour direction, and warranty should be clear enough to compare."
    },
    {
      key: "area",
      label: "Area and measurement",
      customerCopy: "Measured area, allowance, room count, and stairs should be clear before total price is compared."
    },
    {
      key: "installation",
      label: "Installation scope",
      customerCopy: "Supply/install path, installation method, underlay, moisture protection, and furniture handling should be stated where relevant."
    },
    {
      key: "site",
      label: "Site details",
      customerCopy: "Apartment level, lift, parking, loading, occupied rooms, and strata constraints should be captured as site details, not guessed from the headline price."
    },
    {
      key: "prep",
      label: "Preparation risk",
      customerCopy: "Subfloor condition, levelling, old adhesive, tile removal, moisture, and unknown site risks are common variation points."
    },
    {
      key: "finishing",
      label: "Finishing detail",
      customerCopy: "Trims, scotia, skirting, stair nosing, transitions, and door trimming should not be assumed."
    },
    {
      key: "commercial",
      label: "Commercial clarity",
      customerCopy: "GST status, subtotal, total, payment terms, quote validity, exclusions, and variation conditions should be easy to read."
    }
  ];

  const RISK_COPY = {
    area_missing_for_ready_state: "area is still missing",
    removal_disposal_not_confirmed: "removed-floor disposal is not confirmed",
    apartment_lift_not_confirmed: "apartment lift details are not confirmed",
    stairs_require_manual_review: "stairs require manual review",
    subfloor_review_recommended: "subfloor condition should be reviewed",
    access_review_recommended: "site details should be reviewed",
    area_capture_needed: "area still needs a rough total, room entry, or floor plan",
    parking_access_review: "site details should be noted",
    acoustic_review_recommended: "underlay or acoustic requirements should be checked",
    trims_review_recommended: "trims, scotia, skirting, or transitions should be confirmed",
    moisture_review_recommended: "moisture or concrete-floor conditions should be checked"
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

  function getQuoteFlowSteps() {
    return QUOTE_FLOW_STEPS.map(function (item) {
      return Object.assign({}, item);
    });
  }

  function getScopeChecks() {
    return SCOPE_CHECKS.map(function (item) {
      return Object.assign({}, item);
    });
  }

  function getScopeCheckCopy() {
    return SCOPE_CHECKS.map(function (item) {
      return item.label + ": " + item.customerCopy;
    }).join(" ");
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
    quoteFlowSteps: getQuoteFlowSteps(),
    scopeChecks: getScopeChecks(),
    playbooks: PLAYBOOKS,
    getCategoryGuidance: getCategoryGuidance,
    getRecommendationSummary: getRecommendationSummary,
    getQuoteExplanation: getQuoteExplanation,
    getPriceFactorsCopy: getPriceFactorsCopy,
    getQuoteFlowSteps: getQuoteFlowSteps,
    getScopeChecks: getScopeChecks,
    getScopeCheckCopy: getScopeCheckCopy,
    getRangeGuidance: getRangeGuidance,
    getRiskCopy: getRiskCopy,
    getPlaybook: getPlaybook,
    findApprovedAnswer: findApprovedAnswer,
    getControlledIndex: getControlledIndex
  };
}());
