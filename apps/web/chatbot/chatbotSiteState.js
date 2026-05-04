(function () {
  const PRODUCT_STORAGE_KEYS = {
    productId: "operon_selected_product_id",
    category: "operon_selected_product_category",
    rangeId: "operon_selected_range_id",
    colour: "operon_selected_colour",
    selectionMode: "operon_selected_product_selection_mode"
  };

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

    return activeIndex >= 0 ? activeIndex : 0;
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

  function getMissingQuoteInputs(activeStep, data) {
    const missing = [];

    if (activeStep === 0) {
      if (!getValueById("fullName")) missing.push("name");
      if (!getValueById("phone")) missing.push("phone");
      if (!getValueById("siteAddress")) missing.push("address");
    } else if (activeStep === 2) {
      if (!data.selectedCategory) missing.push("flooring category");
      if (data.selectedCategory && !data.selectedRangeId && !data.selectedProductId) missing.push("product range");
    } else if (activeStep === 3) {
      if (!data.realArea) missing.push("area");
    } else if (activeStep === 4) {
      if (!getValueById("existingFloorType")) missing.push("existing floor");
      if (!getValueById("subfloorCondition")) missing.push("subfloor condition");
    } else if (activeStep === 5) {
      missing.push("review and submit");
    }

    return missing;
  }

  function getQuoteFlowName(activeStep) {
    if (activeStep === 0) return "missing_info_collection";
    if (activeStep === 1) return "access_check";
    if (activeStep === 2) return "product_selection";
    if (activeStep === 3) return "area_capture";
    if (activeStep === 4) return "scope_check";
    if (activeStep === 5) return "near_completion";
    return "quote_start";
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
      href: "quote.html",
      focusId: ""
    };
    let nudge = "Keep going through the quote steps and review the details before submitting.";

    if (activeStep === 0) {
      nudge = getValueById("fullName") && getValueById("phone")
        ? "Customer details look started. Property access is next."
        : "Start with name, phone, and the job location.";
      next.focusId = "fullName";
    } else if (activeStep === 1) {
      nudge = "Check property type, access, parking, and lift details where relevant.";
      next.focusId = "propertyType";
    } else if (activeStep === 2) {
      nudge = category
        ? "Flooring category is selected. Next, choose a practical recommendation or product range."
        : "Choose laminate, hybrid, or engineered timber before moving on.";
      next.focusId = "selectedProductCategory";
    } else if (activeStep === 3) {
      nudge = realArea
        ? "Area is entered. Continue to extras and site conditions."
        : "Do you have a floor plan, or would you prefer a site assessment?";
      next.focusId = measurementMethod === "floorplan_upload"
        ? "confirmedFloorplanArea"
        : (measurementMethod === "unknown" ? "floorplanLookupAddress" : "totalAreaM2");
    } else if (activeStep === 4) {
      nudge = "Only select extras that apply. Removal, access, stairs, and floor condition are the main scope checks.";
      next.focusId = "existingFloorType";
    } else if (activeStep === 5) {
      nudge = "Review the estimate and scope, then submit when the details look right.";
      next.focusId = "customerNotes";
    }

    return {
      activeStep: activeStep,
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
        href: rangeId || productId ? "quote.html?from=chatbot" : "products.html",
        focusId: rangeId || productId ? "" : "catalogueCategoryCards"
      }
    };
  }

  function getReviewPageState() {
    return {
      userType: "validation_user",
      nudge: "Use the review page to check scope items like removal, prep, access, trims, and installation before starting a structured estimate.",
      next: {
        label: "Get structured estimate",
        href: "quote.html?from=quote-review",
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
        href: "quote.html?from=chatbot",
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
    } else if (pageKey === "index") {
      pageState = getHomePageState();
    } else {
      pageState = {
        nudge: "I can guide you to products, the quote flow, or quote review.",
        next: { label: "Start quote", href: "quote.html", focusId: "" }
      };
    }

    return Object.assign(base, pageState);
  }

  window.OperonChatbotSiteState = {
    getSnapshot: getSnapshot
  };
}());
