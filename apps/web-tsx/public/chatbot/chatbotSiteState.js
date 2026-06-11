(function () {
  const PRODUCT_STORAGE_KEYS = {
    productId: "operon_selected_product_id",
    category: "operon_selected_product_category",
    rangeId: "operon_selected_range_id",
    colour: "operon_selected_colour",
    selectionMode: "operon_selected_product_selection_mode"
  };

  const QUOTE_STEP_META = [
    { index: 0, title: "Property", flow: "property", focusId: "suburb" },
    { index: 1, title: "Flooring/product", flow: "flooring_product", focusId: "selectedProductCategory" },
    { index: 2, title: "Area", flow: "area", focusId: "measurementMethod" },
    { index: 3, title: "Stairs", flow: "stairs", focusId: "stairs" },
    { index: 4, title: "Extras", flow: "extras_scope", focusId: "floorPrepDecision" },
    { index: 5, title: "Summary/review", flow: "summary_review", focusId: "customerNotes" }
  ];

  function safeGetStorage(key) {
    try {
      return window.localStorage ? String(window.localStorage.getItem(key) || "") : "";
    } catch (error) {
      return "";
    }
  }

  function getValueById(id) {
    const element = document.getElementById(id);
    return element && "value" in element ? String(element.value || "") : "";
  }

  function getTextById(id) {
    const element = document.getElementById(id);
    if (!element) {
      return "";
    }

    return String(element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
  }

  function isElementVisibleById(id) {
    const element = document.getElementById(id);
    if (!element) {
      return false;
    }

    if (element.hidden) {
      return false;
    }

    if (element.style && element.style.display === "none") {
      return false;
    }

    if (element.classList && typeof element.classList.contains === "function" && element.classList.contains("hidden")) {
      return false;
    }

    return true;
  }

  function compactListText(text, limit) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .split(/(?=[A-Z][A-Za-z /-]{2,}(?: is| are|:)|\?)/)
      .map(function (item) {
        return item.replace(/\s+/g, " ").trim();
      })
      .filter(function (item) {
        return item && item.length > 8;
      })
      .slice(0, limit || 4);
  }

  function firstTextByIds(ids) {
    const values = Array.isArray(ids) ? ids : [];
    for (let index = 0; index < values.length; index += 1) {
      const text = getTextById(values[index]);
      if (text) {
        return text;
      }
    }
    return "";
  }

  function findReadinessLabel(text) {
    const value = String(text || "");
    const match = value.match(/Not ready to compare|Partly clear(?: -|\s\u2014)? confirm missing items|Clear enough to compare/i);
    return match ? match[0].replace(/\s\u2014\s/, " - ") : "";
  }

  function getActiveChoiceValue(selector, attributeName) {
    if (!document || typeof document.querySelector !== "function") {
      return "";
    }

    const active = document.querySelector(selector + ".active");
    return active && typeof active.getAttribute === "function" ? String(active.getAttribute(attributeName) || "") : "";
  }

  function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function getActiveQuoteStep() {
    if (!document || typeof document.querySelectorAll !== "function") {
      return null;
    }

    const steps = Array.from(document.querySelectorAll("[data-quote-step]"));
    if (!steps.length) {
      return null;
    }

    const activeIndex = steps.findIndex(function (step) {
      return step.classList.contains("active");
    });

    if (activeIndex < 0) {
      return 0;
    }

    const activeStepValue = steps[activeIndex] && typeof steps[activeIndex].getAttribute === "function"
      ? Number(steps[activeIndex].getAttribute("data-quote-step"))
      : activeIndex;

    return Number.isFinite(activeStepValue) ? activeStepValue : activeIndex;
  }

  function getSelectedCategory() {
    return getValueById("selectedProductCategory") || safeGetStorage(PRODUCT_STORAGE_KEYS.category);
  }

  function getSelectedRangeId() {
    return getValueById("selectedRangeId") || safeGetStorage(PRODUCT_STORAGE_KEYS.rangeId);
  }

  function getSelectedProductId() {
    return getValueById("selectedProduct") || safeGetStorage(PRODUCT_STORAGE_KEYS.productId);
  }

  function getScrollDepth() {
    if (!window || !document || !document.documentElement) {
      return 0;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const documentHeight = Math.max(
      document.documentElement.scrollHeight || 0,
      document.body ? document.body.scrollHeight || 0 : 0
    );
    const scrollable = Math.max(documentHeight - viewportHeight, 1);

    return Math.max(0, Math.min(1, scrollTop / scrollable));
  }

  function isElementInView(id) {
    const element = document.getElementById(id);
    if (!element || typeof element.getBoundingClientRect !== "function") {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

    return rect.top < viewportHeight * 0.78 && rect.bottom > viewportHeight * 0.18;
  }

  function getRealAreaDraft() {
    return toNumber(getValueById("confirmedFloorplanArea"))
      || toNumber(getValueById("totalAreaM2"))
      || null;
  }

  function getStairItemCount() {
    return [
      "stairStraightTreadCount",
      "stairWinderTreadCount",
      "stairLandingSmallCount",
      "stairLandingLargeCount",
      "stairOneSideOpenCount",
      "stairTwoSideOpenCount"
    ].reduce(function (total, id) {
      return total + (toNumber(getValueById(id)) || 0);
    }, 0);
  }

  function hasProjectLocation() {
    return !!(getValueById("siteAddress") || getValueById("suburb") || getValueById("postcode"));
  }

  function getMissingQuoteInputs(activeStep, data) {
    const missing = [];

    if (activeStep === 0) {
      if (!hasProjectLocation()) missing.push("location");
      if (!getValueById("propertyType")) missing.push("property type");
      if (!getValueById("quoteMode")) missing.push("quote mode");
    } else if (activeStep === 1) {
      const productChoiceMode = getValueById("productChoiceMode");
      if (!data.selectedCategory) missing.push("flooring category");
      if (data.selectedCategory && productChoiceMode === "choose_range" && !data.selectedRangeId && !data.selectedProductId) missing.push("product range");
    } else if (activeStep === 2) {
      const method = getValueById("measurementMethod");
      if (method === "unknown" && !getValueById("unknownMeasurementNextStep")) {
        missing.push("measurement next step");
      } else if (!data.realArea && method !== "unknown") {
        missing.push("area");
      }
    } else if (activeStep === 3) {
      const propertyType = getValueById("propertyType");
      const stairs = getValueById("stairs") || getActiveChoiceValue("[data-stairs-choice]", "data-stairs-choice");
      if (propertyType === "unit_apartment" && !getValueById("parkingAccess")) missing.push("access detail");
      if (!getValueById("removalDecision")) missing.push("removal");
      if (!stairs) {
        missing.push("stairs");
      } else if (stairs === "not_sure") {
        missing.push("stair detail");
      }
    } else if (activeStep === 4) {
      [
        ["underlayDecision", "underlay"],
        ["finishDecision", "finishing"],
        ["floorPrepDecision", "floor preparation"],
        ["moistureBarrier", "moisture protection"],
        ["doorDecision", "door trimming"],
        ["furnitureDecision", "furniture"]
      ].forEach(function (item) {
        if (getValueById(item[0]) === "not_sure") {
          missing.push(item[1]);
        }
      });

      if (getValueById("removalDecision") === "yes") {
        if (!getValueById("removalType")) missing.push("existing floor");
        if (!getValueById("removalDisposal")) missing.push("disposal");
      }

      if (getValueById("floorPrepDecision") === "yes" && !getValueById("subfloorCondition")) {
        missing.push("subfloor condition");
      }
    } else if (activeStep === 5) {
      missing.push("review and submit");
    }

    return missing;
  }

  function getQuoteFlowName(activeStep) {
    const meta = QUOTE_STEP_META.find(function (step) {
      return step.index === activeStep;
    });
    if (meta) return meta.flow;
    return "quote_start";
  }

  function getQuoteStepTitle(activeStep) {
    const meta = QUOTE_STEP_META.find(function (step) {
      return step.index === activeStep;
    });
    return meta ? meta.title : "Quote";
  }

  function getQuotePageState() {
    const activeStep = getActiveQuoteStep();
    const measurementMethod = getValueById("measurementMethod");
    const realArea = getRealAreaDraft();
    const category = getSelectedCategory();
    const selectedRangeId = getSelectedRangeId();
    const selectedProductId = getSelectedProductId();
    const data = {
      selectedCategory: category,
      selectedRangeId: selectedRangeId,
      selectedProductId: selectedProductId,
      realArea: realArea
    };
    const missingInputs = getMissingQuoteInputs(activeStep, data);
    const next = {
      label: "Continue quote",
      href: "/quote.html",
      focusId: ""
    };
    let nudge = "Keep going through the quote steps and review the details before submitting.";

    if (activeStep === 0) {
      nudge = hasProjectLocation()
        ? "Project location is started. Choose property type and quote mode, then continue."
        : "Start with suburb and postcode. Contact details come at the submit step.";
      next.focusId = "suburb";
    } else if (activeStep === 1) {
      nudge = category
        ? "Flooring direction is selected. Continue to area when the product path is clear enough."
        : "Choose laminate, hybrid, engineered timber, or Not sure, then continue.";
      next.focusId = "selectedProductCategory";
    } else if (activeStep === 2) {
      nudge = realArea
        ? "Area is started. Continue to stairs and removal."
        : "Add the clearest area you have, or choose a floor plan path.";
      next.focusId = realArea ? "removalDecision" : (measurementMethod === "floorplan_upload" ? "confirmedFloorplanArea" : "totalAreaM2");
    } else if (activeStep === 3) {
      nudge = "Answer removal, stairs and floor preparation. Use Not sure if the site needs review.";
      next.focusId = "stairs";
    } else if (activeStep === 4) {
      nudge = "Extras are optional where unclear. Use Not sure if the site needs review.";
      next.focusId = "floorPrepDecision";
    } else if (activeStep === 5) {
      nudge = "Add contact details so Operon can review the project and follow up.";
      next.focusId = "customerNotes";
    }

    return {
      activeStep: activeStep,
      activeStepNumber: activeStep === null ? null : activeStep + 1,
      totalSteps: QUOTE_STEP_META.length,
      stepTitle: getQuoteStepTitle(activeStep),
      flow: getQuoteFlowName(activeStep),
      userType: "quote_user",
      quoteMode: getValueById("quoteMode") || "supply_install",
      selectedCategory: category,
      selectedRangeId: selectedRangeId,
      selectedProductId: selectedProductId,
      measurementMethod: measurementMethod,
      realArea: realArea,
      missingInputs: missingInputs,
      isNearCompletion: activeStep === 5,
      nudge: nudge,
      next: next
    };
  }

  function getProductsPageState() {
    const category = getSelectedCategory();
    const rangeId = getSelectedRangeId();
    const productId = getSelectedProductId();
    return {
      selectedCategory: category,
      selectedRangeId: rangeId,
      selectedProductId: productId,
      userType: productId || rangeId || category ? "interested_user" : "new_user",
      nudge: rangeId || productId
        ? "A flooring selection is saved. Continue to the quote when you are ready."
        : "Choose a category and range first, then continue to the quote.",
      next: {
        label: rangeId || productId ? "Continue to quote" : "Browse products",
        href: rangeId || productId ? "/quote.html?from=chatbot" : "/products.html",
        focusId: rangeId || productId ? "" : "catalogueCategoryCards"
      }
    };
  }

  function getFloorplanPageState() {
    const selectedArea = toNumber(getTextById("selectedAreaTotal"));
    const confidenceText = getTextById("measurementConfidenceTag");
    return {
      flow: "floorplan_help",
      userType: selectedArea ? "measuring_user" : "area_uncertain_user",
      measuredArea: selectedArea,
      measurementConfidence: confidenceText,
      nudge: selectedArea
        ? "A measured area is started. Send it into the quote when the rooms and scale are reviewed."
        : "Use this page when you have a floor plan and need a safer area starting point before quoting.",
      next: {
        label: selectedArea ? "Continue quote with area" : "Measure floor plan",
        href: selectedArea ? "/quote.html?quoteStep=3&areaMethod=floorplan_review" : "/floorplan.html",
        focusId: selectedArea ? "" : "floorplanUpload"
      }
    };
  }

  function getContactPageState() {
    return {
      flow: "contact_human",
      userType: "contact_user",
      nudge: "Use contact for human follow-up. If you already know product and area, the quote form is usually the faster path.",
      next: {
        label: "Contact Operon",
        href: "/contact.html",
        focusId: "contactName"
      }
    };
  }

  function getBlogPageState() {
    return {
      flow: "guide_reader",
      userType: "research_user",
      nudge: "Guide readers usually need one of four next steps: start a quote, check an existing quote, browse products, or measure area from a plan.",
      next: {
        label: "Start quote",
        href: "/quote.html",
        focusId: ""
      }
    };
  }

  function getReviewPageState() {
    const quickReportVisible = isElementVisibleById("quickCompletenessReport");
    const documentReportVisible = isElementVisibleById("documentReviewReport");
    const documentReportText = documentReportVisible ? getTextById("documentReviewReport") : "";
    const quickStatus = quickReportVisible ? getTextById("quickResultStatus") : "";
    const clarityLevel = getTextById("clarityLevel") || quickStatus || findReadinessLabel(documentReportText);
    const clarityTag = getTextById("clarityTag") || getTextById("quickResultTag") || "Quote readiness";
    const decisionGuidance = getTextById("decisionGuidance") || firstTextByIds(["quickResultSummary"]) || "";
    const missingText = firstTextByIds(["quickTopItemsList", "quickMissingList", "mediumRiskList"]) || documentReportText;
    const questionsText = firstTextByIds(["quickQuestionsList", "questionsToAskList"]) || documentReportText;
    const resultVisible = Boolean(
      clarityLevel
      && !/add quote details|initial review|waiting|begin/i.test(clarityLevel)
      && !/unknown items will appear|observations will appear/i.test(missingText)
    );
    const missingScope = compactListText(missingText, 5);
    const questions = compactListText(questionsText, 4);

    return {
      flow: resultVisible ? "quote_review_result" : "quote_review_start",
      userType: "validation_user",
      reviewResultVisible: resultVisible,
      reviewStatus: clarityLevel,
      reviewConfidenceLabel: clarityTag,
      reviewMissingScope: missingScope,
      reviewQuestions: questions,
      reviewDecisionGuidance: decisionGuidance,
      nudge: resultVisible
        ? "The review result is ready. Use the missing or unclear scope items to decide what to confirm before comparing totals."
        : "Use the review page to check scope items like removal, prep, trims, and installation before starting a structured estimate.",
      next: {
        label: "Get structured estimate",
        href: "/quote.html?source=quote_review",
        focusId: ""
      }
    };
  }

  function getHomePageState() {
    const category = getSelectedCategory();
    const reviewVisible = isElementInView("reviewQuoteTitle");
    return {
      selectedCategory: category,
      selectedRangeId: getSelectedRangeId(),
      selectedProductId: getSelectedProductId(),
      userType: reviewVisible ? "hesitant_user" : category ? "interested_user" : "new_user",
      reviewQuoteVisible: reviewVisible,
      nudge: category
        ? "A flooring direction is already saved. You can continue into the quote with that context."
        : "Start with products if you want to browse, or go straight to the quote if you know the project basics.",
      next: {
        label: category ? "Continue quote" : "Start quote",
        href: "/quote.html?from=chatbot",
        focusId: ""
      }
    };
  }

  function getSnapshot(options) {
    const settings = options || {};
    const pageKey = settings.pageKey || "default";
    const base = {
      pageKey: pageKey,
      scrollDepth: getScrollDepth(),
      readOnly: true,
      canWriteFields: false,
      canSubmitForms: false,
      canCalculatePrice: false
    };
    let pageState = null;

    if (pageKey === "quote") {
      pageState = getQuotePageState();
    } else if (pageKey === "products") {
      pageState = getProductsPageState();
    } else if (pageKey === "quote-review") {
      pageState = getReviewPageState();
    } else if (pageKey === "floorplan") {
      pageState = getFloorplanPageState();
    } else if (pageKey === "contact") {
      pageState = getContactPageState();
    } else if (pageKey === "blog") {
      pageState = getBlogPageState();
    } else if (pageKey === "index") {
      pageState = getHomePageState();
    } else {
      pageState = {
        nudge: "I can guide you to products, the quote flow, or quote review.",
        next: { label: "Start quote", href: "/quote.html", focusId: "" }
      };
    }

    return Object.assign(base, pageState);
  }

  window.OperonChatbotSiteState = {
    getSnapshot: getSnapshot
  };
}());
