    const STORAGE_KEY = "operon-quote-v3";
    const FLOORPLAN_AREA_KEY = "operon-floorplan-area";
    const FLOORPLAN_CONFIRMED_AREA_KEY = "operon_confirmed_floorplan_area";
    const FLOORPLAN_ROOMS_KEY = "operon_floorplan_rooms";
    const FLOORPLAN_SOURCE_KEY = "operon_floorplan_source";
    const FLOORPLAN_QUOTE_HANDOFF_KEY = "operon_floorplan_quote_handoff_v1";
    const DEBUG_HOSTS = ["", "localhost", "127.0.0.1", "::1"];
    const currency = new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0
    });

    const OPERON_SUPABASE_PROJECT_REF = "pwohrvtwuctmxwwirrim";
    const OPERON_SUPABASE_CONFIG = {
      url: "https://" + OPERON_SUPABASE_PROJECT_REF + ".supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3b2hydnR3dWN0bXh3d2lycmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzI4MTYsImV4cCI6MjA5MDIwODgxNn0.TmR2wHo5vnf9fkyWtEYTU4txeanwlMlgesdC3CFU6Hc",
      quoteFilesBucket: "quote-files"
    };
    window.OPERON_SUPABASE_CONFIG = OPERON_SUPABASE_CONFIG;

    function isSupabasePlaceholder(value) {
      return !value || /YOUR_SUPABASE/i.test(String(value));
    }

    const operonSupabase = (function () {
      if (!window.supabase || typeof window.supabase.createClient !== "function") {
        console.warn("Optional upload runtime is unavailable.");
        return null;
      }

      if (isSupabasePlaceholder(OPERON_SUPABASE_CONFIG.url) || isSupabasePlaceholder(OPERON_SUPABASE_CONFIG.anonKey)) {
        console.warn("Optional upload runtime is unavailable.");
        return null;
      }

      return window.supabase.createClient(
        OPERON_SUPABASE_CONFIG.url,
        OPERON_SUPABASE_CONFIG.anonKey
      );
    }());

    const quoteForm = document.getElementById("quoteForm");
    const quoteLayout = document.getElementById("quoteLayout");
    const quoteSummaryCard = document.getElementById("quoteSummaryCard");
    const roomList = document.getElementById("roomList");
    const productGrid = document.getElementById("productGrid");
    const pageStatus = document.getElementById("pageStatus");
    const requestStatus = document.getElementById("requestStatus");
    const requestStatusBox = document.getElementById("requestStatusBox");
    const floorplanStatus = document.getElementById("floorplanStatus");
    const wizardValidationMessage = document.getElementById("wizardValidationMessage");
    const quoteStepCounter = document.getElementById("quoteStepCounter");
    const quoteStepTitle = document.getElementById("quoteStepTitle");
    const wizardBackButton = document.getElementById("wizardBackButton");
    const wizardNextButton = document.getElementById("wizardNextButton");
    const wizardSubmitButton = document.getElementById("wizardSubmitButton");
    const emailQuoteCopyControls = document.getElementById("emailQuoteCopyControls");
    const emailQuoteCopyCheckbox = document.getElementById("emailQuoteCopy");
    const headerQuoteButton = document.getElementById("headerQuoteButton");
    const heroQuoteButton = document.getElementById("heroQuoteButton");
    const stickyQuoteBar = document.getElementById("stickyQuoteBar");
    const stickyQuoteButton = document.getElementById("stickyQuoteButton");
    const stickyQuoteTitle = document.getElementById("stickyQuoteTitle");
    const stickyQuoteText = document.getElementById("stickyQuoteText");
    const leadRecoveryBanner = document.getElementById("leadRecoveryBanner");
    const leadRecoveryTitle = document.getElementById("leadRecoveryTitle");
    const leadRecoveryText = document.getElementById("leadRecoveryText");
    const leadRecoveryButton = document.getElementById("leadRecoveryButton");
    const floorplanHandoffCard = document.getElementById("floorplanHandoffCard");
    const floorplanHandoffTitle = document.getElementById("floorplanHandoffTitle");
    const floorplanHandoffText = document.getElementById("floorplanHandoffText");
    const confirmFloorplanHandoffButton = document.getElementById("confirmFloorplanHandoffButton");
    const dismissFloorplanHandoffButton = document.getElementById("dismissFloorplanHandoffButton");
    const productChoiceModeChoices = document.getElementById("productChoiceModeChoices");
    const productChoicePanel = document.querySelector(".product-choice-panel");
    const productRangeField = document.getElementById("productRangeField");
    const productRangeSelect = document.getElementById("productRangeSelect");
    const productRangeHelper = document.getElementById("productRangeHelper");
    const productColourField = document.getElementById("productColourField");
    const productColourSelect = document.getElementById("productColourSelect");
    const productColourHelper = document.getElementById("productColourHelper");
    const productOptionSelect = document.getElementById("productOptionSelect");
    const productOptionField = productOptionSelect ? productOptionSelect.closest(".field") : null;
    const productOptionHelper = document.getElementById("productOptionHelper");
    const patternTypeSelect = document.getElementById("patternType");
    const patternTypeLabel = document.getElementById("patternTypeLabel");
    const patternTypeLockedValue = document.getElementById("patternTypeLockedValue");
    const installMethodSelect = document.getElementById("installMethod");
    const installMethodLockedValue = document.getElementById("installMethodLockedValue");
    const underlaySelect = document.getElementById("underlaySelect");
    const underlayLockNote = document.getElementById("underlayLockNote");
    const selectedProductHeadline = document.getElementById("selectedProductHeadline");
    const selectedProductSummary = document.getElementById("selectedProductSummary");
    const selectedProductBanner = document.querySelector(".selected-product-banner.compact");
    const browseCategoryLink = document.getElementById("browseCategoryLink");
    const clearSelectedProductButton = document.getElementById("clearSelectedProductButton");
    const measurementHelperTitle = document.getElementById("measurementHelperTitle");
    const leadCreatedAtInput = document.getElementById("leadCreatedAt");
    const leadStatusInput = document.getElementById("leadStatus");
    const leadStageInput = document.getElementById("leadStage");
    const leadConsentSmsInput = document.getElementById("leadConsentSms");
    const leadConsentEmailInput = document.getElementById("leadConsentEmail");
    const leadNameInput = document.getElementById("leadName");
    const leadAddressInput = document.getElementById("leadAddress");
    const leadSelectedProductInput = document.getElementById("leadSelectedProduct");
    const leadCategoryInput = document.getElementById("leadCategory");
    const leadRealAreaInput = document.getElementById("leadRealArea");
    const leadChargeableAreaInput = document.getElementById("leadChargeableArea");
    const leadQuoteTotalInput = document.getElementById("leadQuoteTotal");
    const leadQuoteLinesInput = document.getElementById("leadQuoteLines");
    const leadNotesInput = document.getElementById("leadNotes");
    const leadMeasurementStatusInput = document.getElementById("leadMeasurementStatus");
    const leadEstimateReadyInput = document.getElementById("leadEstimateReady");
    const leadQuoteConfidenceInput = document.getElementById("leadQuoteConfidence");
    const leadNextStepRequiredInput = document.getElementById("leadNextStepRequired");
    const leadPriorityInput = document.getElementById("leadPriority");
    const leadQuoteReviewPayloadInput = document.getElementById("leadQuoteReviewPayload");
    const leadPayloadJsonInput = document.getElementById("leadPayloadJson");
    const quoteAdvisorHandoffCard = document.getElementById("quoteAdvisorHandoffCard");
    const quoteAdvisorHandoffText = document.getElementById("quoteAdvisorHandoffText");
    const quoteAdvisorHandoffMeta = document.getElementById("quoteAdvisorHandoffMeta");

    function showPageStatus(message) {
      if (!message) {
        pageStatus.textContent = "";
        pageStatus.hidden = true;
        return;
      }
      pageStatus.textContent = message;
      pageStatus.hidden = false;
    }

    function renderQuoteAdvisorHandoff() {
      if (!quoteAdvisorHandoffCard || !quoteAdvisorHandoffText || !quoteAdvisorHandoffMeta) {
        return;
      }

      const handoff = readQuoteReviewHandoff();
      if (!handoff) {
        quoteAdvisorHandoffCard.classList.remove("active");
        quoteAdvisorHandoffMeta.innerHTML = "";
        return;
      }

      const comparisonLevel = handoff.comparisonLevel || "";
      const mode = handoff.reviewMode || "review";
      const missingCount = Array.isArray(handoff.missingScopeItems) ? handoff.missingScopeItems.length : 0;
      const meta = [
        mode ? "Review: " + mode : "",
        handoff.extractedFlooringType ? "Flooring: " + handoff.extractedFlooringType : "",
        handoff.extractedAreaM2 ? "Area: " + formatArea(handoff.extractedAreaM2) : "",
        comparisonLevel ? "Comparison: " + comparisonLevel : "",
        missingCount ? "Missing items: " + missingCount : ""
      ].filter(Boolean);

      quoteAdvisorHandoffText.textContent = "We’ll use this during follow-up to check scope and missing details.";
      quoteAdvisorHandoffMeta.innerHTML = meta.map(function (item) {
        return "<span>" + escapeHtml(item) + "</span>";
      }).join("");
      quoteAdvisorHandoffCard.classList.add("active");
    }
    const measurementHelperText = document.getElementById("measurementHelperText");
    const measurementSnapshot = document.getElementById("measurementSnapshot");
    const unknownMeasurementChoices = document.getElementById("unknownMeasurementChoices");
    const unknownAddressField = document.getElementById("unknownAddressField");
    const siteAssessmentValueBlock = document.getElementById("siteAssessmentValueBlock");
    const installationPathHelper = document.getElementById("installationPathHelper");

    const state = {
      rooms: [],
      floorplanFileName: "",
      submitState: "idle",
      lastQuoteId: "",
      lastSavedDraftSignature: "",
      floorplanSource: "",
      floorplanRooms: [],
      pendingHandoffMessage: "",
      floorplanHandoffDismissed: false,
      productHandoffActive: false,
      lastQuoteCalculationSignature: "",
      lastTrackedZoneName: "",
      productSelectionLoadedFromCatalogue: false,
      currentQuoteResult: null,
      lastSummaryViewSignature: "",
      quoteRefreshToken: 0,
      pricingOptimizationCache: {},
      backendQuoteRuntimeAvailable: true,
      backendQuoteFallbackLogged: false,
      backendQuoteCacheSignature: "",
      backendQuoteCacheResult: null,
      backendQuoteInFlightSignature: "",
      backendQuoteInFlightPromise: null,
      lastShadowQuoteComparisonSignature: "",
      lastPropertyType: "",
      lastRemovalType: "",
      lastFloorPrepType: "",
      lastPatternType: "",
      lastEstimateStateSignature: "",
      quoteRuntimeHealth: {
        checked: false,
        quoteSaveReady: true,
        emailReady: true
      }
    };

    let currentQuoteStep = 0;

    const PRODUCT_LIBRARY = window.OperonProducts;
    const PRODUCT_SELECTION = window.OperonProductSelection;
    const PRODUCT_CATEGORIES = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryList() : [];
    const QUOTE_CALCULATOR = window.OperonQuoteCalculator;
    const LOCATION_ZONE_LIBRARY = window.OperonLocationZones;
    const PRICING_RULES = window.OperonPricingRules;
    const LEAD_FORM_NAME = "quote-request";
    const LAST_SUBMITTED_LEAD_KEY = "operon_last_submitted_lead_v1";
    const LAST_SUBMITTED_LEAD_RESULT_KEY = "operon_last_submitted_lead_result_v1";
    const QUOTE_REVIEW_HANDOFF_KEY = "operon_quote_review_handoff_v1";
    const CALCULATE_QUOTE_ENDPOINT = "/.netlify/functions/calculate-quote";
    const SAVE_QUOTE_REQUEST_ENDPOINT = "/.netlify/functions/save-quote-request";
    const SEND_QUOTE_EMAIL_ENDPOINT = "/.netlify/functions/send-quote-email";
    const UPLOAD_CUSTOMER_FILE_ENDPOINT = "/.netlify/functions/upload-customer-file";
    const QUOTE_RUNTIME_HEALTH_ENDPOINT = "/.netlify/functions/runtime-health";
    const PRICING_OPTIMIZATION_ENDPOINT = "/.netlify/functions/pricing-optimization-insight";
    const DEFAULT_UNDERLAY_ID = "standard-silver-underlay";
    const CUSTOMER_DRAFT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
    function createId() {
      return Math.random().toString(36).slice(2, 9);
    }

    function createQuoteUuid() {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }

      return "quote-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    }

    function withStorageExpiry(payload, ttlMs) {
      const now = Date.now();
      return {
        savedAt: new Date(now).toISOString(),
        expiresAt: new Date(now + ttlMs).toISOString(),
        payload: payload
      };
    }

    function unwrapStoredPayload(record, key) {
      if (!record || typeof record !== "object") {
        return null;
      }
      if (!record.payload) {
        return record;
      }
      const expiresAt = Date.parse(record.expiresAt || "");
      if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          // Ignore storage cleanup failures.
        }
        return null;
      }
      return record.payload;
    }

    function createSubmitStageError(stage, error) {
      const wrappedError = new Error((error && error.message) || "Quote submission failed.");
      wrappedError.stage = stage;
      wrappedError.cause = error || null;
      return wrappedError;
    }

    function createEmptyRoom(name) {
      return {
        id: createId(),
        name: name || "",
        length: "",
        width: ""
      };
    }

    function isSimpleLocalPreview() {
      const host = window.location.hostname;
      return host === "localhost" || host === "127.0.0.1" || host === "::1";
    }

    function shouldUseLocalReviewOnlyMode() {
      return window.location.protocol === "file:" || isSimpleLocalPreview();
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function parsePositiveNumber(value) {
      if (value === "" || value === null || typeof value === "undefined") {
        return 0;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }

    function roundTo(value, places) {
      return Number(value.toFixed(places));
    }

    function formatArea(value) {
      return roundTo(value || 0, 1).toFixed(1) + " m²";
    }

    function formatCurrency(value) {
      return currency.format(value || 0);
    }

    function getInputValue(id) {
      const element = document.getElementById(id);
      if (!element) {
        return "";
      }
      if (element.type === "checkbox") {
        return element.checked ? (element.value || "on") : "";
      }
      return element.value;
    }

    function setInputValue(id, value) {
      const element = document.getElementById(id);
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value === true || value === "true" || value === "yes" || value === "on" || value === element.value;
        } else {
          element.value = value;
        }
      }
    }

    function getSelectedProductCategory() {
      return getPreferredProductCategory();
    }

    function getCategoryPageUrl(category) {
      const meta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(category) : null;
      return meta && meta.pageUrl ? meta.pageUrl : "quote.html";
    }

    function isValidProductCategory(category) {
      return !!(PRODUCT_LIBRARY && PRODUCT_LIBRARY.getCategoryMeta(category));
    }

    function getPreferredProductCategory() {
      const selectedCategory = getInputValue("selectedProductCategory");
      if (isValidProductCategory(selectedCategory)) {
        return selectedCategory;
      }

      const storedCategory = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getStoredCategory() : "";
      if (isValidProductCategory(storedCategory)) {
        return storedCategory;
      }

      return "hybrid";
    }

    function getCategoryEstimateLabel(category) {
      const meta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(category) : null;
      return "standard " + (meta ? meta.label.toLowerCase() : "flooring") + " estimate";
    }

    function getProductChoiceMode() {
      const mode = getInputValue("productChoiceMode");
      return ["recommend", "choose_range"].indexOf(mode) >= 0 ? mode : "recommend";
    }

    function normaliseProductChoiceForProgress() {
      if (getProductChoiceMode() !== "choose_range") {
        return;
      }

      if (getInputValue("selectedRangeId")) {
        return;
      }

      setProductChoiceMode("recommend", { track: false });
    }

    function getRangeRecordById(category, rangeId) {
      if (!PRODUCT_SELECTION || !rangeId) {
        return null;
      }

      return PRODUCT_SELECTION.getRangesByCategory(category).find(function (range) {
        return range.rangeId === rangeId;
      }) || null;
    }

    function getSelectionStateInput() {
      return {
        category: getPreferredProductCategory(),
        choiceMode: getProductChoiceMode(),
        rangeId: getInputValue("selectedRangeId"),
        productId: getInputValue("selectedProduct"),
        selectedColour: getInputValue("selectedColour"),
        selectionMode: getInputValue("productSelectionMode")
      };
    }

    function getResolvedQuoteSelection() {
      if (!PRODUCT_LIBRARY || !PRODUCT_SELECTION) {
        return {
          category: getPreferredProductCategory(),
          product: null,
          productId: "",
          rangeId: "",
          selectedColour: "",
          choiceMode: "recommend",
          selectionMode: ""
        };
      }

      const resolved = PRODUCT_SELECTION.resolveSelectedProduct(getSelectionStateInput());
      const category = isValidProductCategory(resolved.category) ? resolved.category : getPreferredProductCategory();

      return {
        category: category,
        product: resolved.product || null,
        productId: resolved.productId || "",
        rangeId: resolved.rangeId || "",
        selectedColour: resolved.selectedColour || "",
        choiceMode: resolved.choiceMode || getProductChoiceMode(),
        selectionMode: resolved.selectionMode || ""
      };
    }

    function getProductHandoffMessage(product) {
      if (!product || !PRODUCT_LIBRARY) {
        return "";
      }

      const productLabel = PRODUCT_LIBRARY.getProductLabel(product);
      return "Selected product loaded for this quote: " + productLabel + ". Finish the quote details and we’ll use this range in Step 2.";
    }

    // Quote Wizard Navigation
    function getQuoteSteps() {
      return Array.from(document.querySelectorAll("[data-quote-step]"));
    }

    function getQuoteStepMeta() {
      return [
        { title: "Property details", shortLabel: "1 Property", trackingName: "property_details" },
        { title: "Job type & flooring", shortLabel: "2 Flooring", trackingName: "flooring_type" },
        { title: "Area measurement", shortLabel: "3 Area", trackingName: "area" },
        { title: "Stairs", shortLabel: "4 Stairs", trackingName: "stairs" },
        { title: "Extras", shortLabel: "5 Extras", trackingName: "extras" },
        { title: "Quote summary", shortLabel: "6 Summary", trackingName: "summary" }
      ];
    }

    function clearWizardValidationMessage() {
      wizardValidationMessage.textContent = "";
      wizardValidationMessage.classList.remove("active");
    }

    function showWizardValidationMessage(message) {
      wizardValidationMessage.textContent = message;
      wizardValidationMessage.classList.add("active");
    }

    function getHeaderOffset() {
      const header = document.querySelector(".site-header");
      return (header ? header.offsetHeight : 0) + 16;
    }

    function scrollQuoteFormToTop() {
      const top = window.scrollY + quoteForm.getBoundingClientRect().top - getHeaderOffset();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth"
      });
    }

    function scrollActiveQuoteStepIntoView(stepIndex) {
      const step = getQuoteSteps()[stepIndex];
      if (!step) {
        scrollQuoteFormToTop();
        return;
      }

      const top = window.scrollY + step.getBoundingClientRect().top - getHeaderOffset();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth"
      });
    }

    function buildFloorplanToolUrl() {
      return "floorplan.html?returnStep=2&returnTo=quote.html";
    }

    function hasQuoteProgress() {
      const input = getFormInput();
      return Boolean(
        currentQuoteStep > 0 ||
        input.fullName ||
        input.phone ||
        input.siteAddress ||
        input.suburb ||
        input.postcode ||
        Number(input.totalAreaM2 || 0) > 0 ||
        Number(input.confirmedFloorplanArea || 0) > 0 ||
        state.floorplanSource
      );
    }

    function getEstimateConfidence(measurement, result) {
      return getEstimateConfidenceState(measurement, result).label;
    }

    function getEstimateConfidenceState(measurement, result, input) {
      const sourceInput = Object.assign({}, input || getFormInput(), {
        measurementMethod: measurement && measurement.method || "",
        realArea: measurement && measurement.realArea || result && result.realArea || 0,
        quoteMode: result && result.quoteMode || input && input.quoteMode || getInputValue("quoteMode")
      });

      if (window.OperonQuoteConfidence && typeof window.OperonQuoteConfidence.calculateEstimateConfidence === "function") {
        return window.OperonQuoteConfidence.calculateEstimateConfidence(sourceInput, result || {});
      }

      const confirmationItems = getScopeConfirmationItems(getFormInput());
      const highRiskConfirmationItems = confirmationItems.filter(function (item) {
        return /stairs|removal|disposal|floor preparation|subfloor|underlay|building/i.test(item);
      });

      if (highRiskConfirmationItems.length || confirmationItems.length >= 3) {
        return { status: "low", score: 50, label: "Low", message: getEstimateConfidenceText("Low"), blockers: highRiskConfirmationItems, assumptions: confirmationItems };
      }
      if (measurement.measurementStatus === "unknown" || result.measurementStatus === "unknown") {
        return { status: "not_ready", score: 0, label: "Estimate pending", message: getEstimateConfidenceText("Estimate pending"), blockers: ["Add flooring area."], assumptions: [] };
      }
      if (measurement.method === "floorplan_upload" && result.realArea > 0) {
        return { status: "high", score: 90, label: "High", message: getEstimateConfidenceText("High"), blockers: [], assumptions: [] };
      }
      if (measurement.method === "room_by_room" && result.realArea > 0) {
        return { status: "medium", score: 75, label: "Medium", message: getEstimateConfidenceText("Medium"), blockers: [], assumptions: [] };
      }
      if (measurement.method === "manual_total" && result.realArea > 0) {
        return { status: "medium", score: 75, label: "Medium", message: getEstimateConfidenceText("Medium"), blockers: [], assumptions: [] };
      }
      return { status: "low", score: 50, label: "Low", message: getEstimateConfidenceText("Low"), blockers: [], assumptions: [] };
    }

    function getStairDetailCountFromInput(input) {
      const source = input || {};
      if (Array.isArray(source.stairDetails)) {
        return source.stairDetails.reduce(function (total, item) {
          return total + Math.max(0, Math.round(parsePositiveNumber(item.quantity)));
        }, 0);
      }
      if (typeof source.stairsCount !== "undefined") {
        return Math.max(0, Math.round(parsePositiveNumber(source.stairsCount)));
      }
      return getTotalStairDetailCount();
    }

    function isStairWidthProvided(input) {
      const source = input || {};
      const widthKnown = typeof source.stairWidthKnown !== "undefined"
        ? source.stairWidthKnown
        : getInputValue("stairWidthKnown");
      const widthMm = typeof source.stairWidthMm !== "undefined"
        ? source.stairWidthMm
        : getInputValue("stairWidthMm");
      return widthKnown === "yes" && parsePositiveNumber(widthMm) > 0;
    }

    function isStairScopeReviewRequired(input) {
      const source = input || getFormInput();
      if (!source.stairs) {
        return true;
      }
      if (source.stairs === "not_sure") {
        return true;
      }
      if (source.stairs !== "yes") {
        return false;
      }
      return getStairDetailCountFromInput(source) <= 0 || !isStairWidthProvided(source);
    }

    function getStairReviewNote(input) {
      const source = input || getFormInput();
      const countProvided = getStairDetailCountFromInput(source) > 0;
      const widthProvided = isStairWidthProvided(source);

      if (countProvided && widthProvided) {
        return "Stairs included based on provided width and item count; final site check still applies.";
      }
      if (countProvided) {
        return "Stair width needs final confirmation.";
      }
      if (widthProvided) {
        return "Stair item count needs final confirmation.";
      }
      return "Stair details need final confirmation, including width and item count.";
    }

    function getScopeConfirmationItems(input) {
      const source = input || getFormInput();
      const items = [];
      const add = function (label) {
        if (items.indexOf(label) < 0) {
          items.push(label);
        }
      };

      if (isStairScopeReviewRequired(source)) {
        add("stairs");
      }
      if (!source.removalDecision || source.removalDecision === "not_sure") {
        add("removal");
      }
      if (source.removalDecision === "yes" && (!source.removalDisposal || source.removalDisposal === "not_sure")) {
        add("disposal");
      }
      if (!source.floorPrepDecision || source.floorPrepDecision === "not_sure") {
        add("floor preparation");
      }
      if (source.floorPrepDecision === "yes" && (!source.floorPrepType || source.floorPrepType === "none")) {
        add("floor preparation details");
      }
      if (source.subfloorCondition === "not_sure" || source.floorPrepType === "unsure" || source.floorPrepType === "manual") {
        add("subfloor condition");
      }
      if (!source.underlayDecision || source.underlayDecision === "not_sure") {
        add("underlay");
      }
      if (!source.finishDecision || source.finishDecision === "not_sure") {
        add("skirting/scotia");
      }
      if (source.finishDecision === "yes" && (!source.skirtingType || source.skirtingType === "no") && source.scotiaType !== "yes") {
        add("skirting/scotia details");
      }
      if (!source.doorDecision || source.doorDecision === "not_sure") {
        add("door trimming");
      }
      if (!source.furnitureDecision || source.furnitureDecision === "not_sure") {
        add("furniture moving");
      }
      if (source.parkingAccess === "unsure" || source.parkingAccess === "difficult") {
        add("building details");
      }
      if (source.hasLift === "no") {
        add("building coordination details");
      }

      return items;
    }

    function getEstimateConfidenceText(confidence) {
      if (confidence === "High") {
        return "High estimate confidence. Product, area and main scope details are clear enough for a strong starting estimate. Final project details are still reviewed before booking.";
      }
      if (confidence === "Medium") {
        return "Medium estimate confidence. The estimate is useful for planning, with final scope reviewed before booking.";
      }
      if (confidence === "Estimate pending" || confidence === "Not ready") {
        return "Estimate pending. Add flooring type and area before we calculate a useful estimate.";
      }
      return "Low estimate confidence. Add the missing product, area or main scope details before comparing estimates.";
    }

    function getQuoteTypeLabel(quoteMode) {
      if (quoteMode === "install_only") {
        return "Installation only";
      }
      if (quoteMode === "supply_only") {
        return "Supply only";
      }
      if (quoteMode === "supply_install") {
        return "Supply and install";
      }
      return "Not selected yet";
    }

    function setTextIfPresent(id, text) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = text;
      }
    }

    function getQuoteBuildStatusNextStep(categoryReady, areaReady, scopeNeedsReview) {
      if (!categoryReady) {
        return "Choose flooring";
      }
      if (!areaReady) {
        return "Add area";
      }
      if (scopeNeedsReview) {
        return "Confirm scope";
      }
      return "Review estimate";
    }

    function renderQuoteBuildStatus(result) {
      const panel = document.getElementById("quoteBuildStatusPanel");
      if (!panel) {
        return;
      }

      const activeResult = result || getCurrentQuoteResult() || {};
      const input = getFormInput();
      const measurement = getMeasurementState();
      const selectedCategory = getSelectedProductCategory();
      const categoryMeta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(selectedCategory) : null;
      const productReady = !!selectedCategory;
      const areaReady = measurement.measurementStatus !== "unknown" && measurement.realArea > 0;
      const confidence = getEstimateConfidence(measurement, activeResult);
      const issues = getQuoteSummaryConsistencyIssues(input, activeResult);
      const confirmationItems = getScopeConfirmationItems(input);
      const scopeNeedsReview = confirmationItems.length > 0 || issues.length > 0 || (activeResult.warnings || []).length > 0 || (measurement.warnings || []).length > 0;
      const estimateReady = productReady && areaReady;

      setTextIfPresent("quoteBuildProduct", productReady && categoryMeta ? categoryMeta.label : "Pending");
      setTextIfPresent("quoteBuildArea", areaReady ? formatArea(measurement.realArea) : "Pending");
      setTextIfPresent("quoteBuildScope", scopeNeedsReview ? "Needs review" : "Clear");
      setTextIfPresent("quoteBuildEstimate", estimateReady
        ? (activeResult.totalIncGst ? formatCurrency(activeResult.totalIncGst) : "Ready")
        : "Pending");
      setTextIfPresent("quoteBuildConfidence", estimateReady ? confidence : "Not ready");
      setTextIfPresent("quoteBuildNextStep", getQuoteBuildStatusNextStep(productReady, areaReady, scopeNeedsReview));
    }

    function focusQuoteFlow() {
      if (window.OperonTracking) {
        window.OperonTracking.trackQuoteStart();
      }
      showQuoteStep(currentQuoteStep, { scrollMode: "top" });
    }

    function updateQuoteCtaSystem() {
      const started = hasQuoteProgress();
      const isComplete = state.submitState === "success" || state.submitState === "partial_success_file_failed";
      const inSummary = currentQuoteStep === getQuoteSteps().length - 1;
      const activeMeta = getQuoteStepMeta()[currentQuoteStep] || getQuoteStepMeta()[0];

      let buttonLabel = "Start quote";
      let stickyTitle = "Ready to start your quote?";
      let stickyText = "Takes 2–3 minutes and no exact measurement is needed.";

      if (started) {
        buttonLabel = inSummary ? "Review quote" : "Continue quote";
        stickyTitle = "Continue your quote";
        stickyText = "You are on Step " + (currentQuoteStep + 1) + " of " + getQuoteSteps().length + ": " + activeMeta.title + ".";
      }

      if (isComplete) {
        buttonLabel = "Quote sent";
        stickyTitle = "Quote request received";
        stickyText = "We have your details and will review the estimate.";
      }

      headerQuoteButton.textContent = buttonLabel;
      headerQuoteButton.classList.toggle("is-complete", isComplete);
      stickyQuoteButton.textContent = buttonLabel;
      stickyQuoteTitle.textContent = stickyTitle;
      stickyQuoteText.textContent = stickyText;
      const quoteRect = quoteForm.getBoundingClientRect();
      const quoteVisible = quoteRect.top < window.innerHeight * 0.7 && quoteRect.bottom > 120;
      const showSticky = window.innerWidth <= 820 && window.scrollY > 160 && !quoteVisible && !started && !isComplete;
      stickyQuoteBar.classList.toggle("visible", showSticky);
      stickyQuoteBar.setAttribute("aria-hidden", showSticky ? "false" : "true");
    }

    function setFloorplanLinks() {
      document.querySelectorAll("[data-floorplan-link]").forEach(function (link) {
        link.setAttribute("href", buildFloorplanToolUrl());
        link.addEventListener("click", function () {
          window.__operonSuppressAbandon = true;
        });
      });
    }

    function focusFirstInvalidField(stepIndex) {
      const step = getQuoteSteps()[stepIndex];
      if (!step) {
        return;
      }

      const focusTargets = {
        0: ["siteAddress", "suburb", "postcode", "propertyType", "level", "hasLift", "parkingAccess"],
        1: ["productRangeSelect", "productColourSelect", "installMethod", "patternType"],
        2: ["totalAreaM2", "confirmedFloorplanArea", "room-name-" + (state.rooms[0] && state.rooms[0].id ? state.rooms[0].id : "")],
        3: ["stairs"],
        4: ["removalType", "floorPrepType", "siteNotes"],
        5: ["fullName", "quoteDeliveryEmail", "phone", "emailQuoteCopy", "customerNotes"]
      };

      const targets = focusTargets[stepIndex] || [];
      for (let index = 0; index < targets.length; index += 1) {
        const element = document.getElementById(targets[index]);
        if (element && !element.disabled && element.offsetParent !== null) {
          element.focus();
          return;
        }
      }

      const firstField = step.querySelector("input, select, textarea, button");
      if (firstField) {
        firstField.focus();
      }
    }

    function updateStepProgress() {
      const meta = getQuoteStepMeta();
      const steps = getQuoteSteps();
      const activeMeta = meta[currentQuoteStep] || meta[0];
      quoteStepCounter.textContent = "Step " + (currentQuoteStep + 1) + " of " + steps.length + " · " + activeMeta.title;
      quoteStepTitle.textContent = activeMeta.title;
      const progress = quoteForm.querySelector(".wizard-progress");
      if (progress) {
        progress.style.setProperty("--quote-progress", (((currentQuoteStep + 1) / steps.length) * 100).toFixed(2) + "%");
      }

      Array.from(document.querySelectorAll("#quoteStepLabels .wizard-step-pill")).forEach(function (pill, index) {
        pill.classList.toggle("active", index === currentQuoteStep);
        pill.classList.toggle("complete", index < currentQuoteStep);
      });

      wizardBackButton.disabled = currentQuoteStep === 0;
      wizardNextButton.disabled = false;
      wizardSubmitButton.disabled = false;
      const isFinalStep = currentQuoteStep === steps.length - 1;
      wizardNextButton.hidden = isFinalStep;
      wizardSubmitButton.hidden = !isFinalStep;
      wizardSubmitButton.setAttribute("aria-hidden", isFinalStep ? "false" : "true");
      if (emailQuoteCopyControls) {
        emailQuoteCopyControls.hidden = !isFinalStep;
        emailQuoteCopyControls.setAttribute("aria-hidden", isFinalStep ? "false" : "true");
      }
      const quoteBuildStatusPanel = document.getElementById("quoteBuildStatusPanel");
      if (quoteBuildStatusPanel) {
        const showBuildStatus = currentQuoteStep === 4 || currentQuoteStep === steps.length - 1;
        quoteBuildStatusPanel.hidden = !showBuildStatus;
        quoteBuildStatusPanel.setAttribute("aria-hidden", showBuildStatus ? "false" : "true");
        if (showBuildStatus) {
          renderQuoteBuildStatus(state.currentQuoteResult || getCurrentQuoteResult());
        }
      }
      quoteSummaryCard.hidden = currentQuoteStep !== steps.length - 1;
      quoteLayout.classList.toggle("layout-single", currentQuoteStep !== steps.length - 1);
      quoteLayout.classList.toggle("summary-active", isFinalStep);
      quoteForm.classList.toggle("quote-final-step", isFinalStep);
      quoteForm.classList.add("quote-form-compact");
      const nextLabels = {
        0: "Continue to flooring",
        1: "Continue to area",
        2: "Continue to stairs",
        3: "Continue to extras",
        4: "Review estimate"
      };
      wizardNextButton.textContent = nextLabels[currentQuoteStep] || "Next";
      if (state.submitState === "idle") {
        clearQuoteSubmitMessage();
      }
      updateQuoteCtaSystem();
    }

    function showQuoteStep(index, options) {
      const settings = Object.assign({ scrollMode: "top" }, options || {});
      const steps = getQuoteSteps();
      currentQuoteStep = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach(function (step, stepIndex) {
        step.classList.toggle("active", stepIndex === currentQuoteStep);
      });
      clearWizardValidationMessage();
      updateStepProgress();
      saveDraft();
      if (window.OperonTracking) {
        const activeMeta = getQuoteStepMeta()[currentQuoteStep];
        window.OperonTracking.trackQuoteStepViewed(
          currentQuoteStep + 1,
          activeMeta ? activeMeta.trackingName : "step_" + (currentQuoteStep + 1)
        );
        if (currentQuoteStep === steps.length - 1) {
          const result = getCurrentQuoteResult();
          const measurement = getMeasurementState();
          const signature = [
            result && result.totalIncGst || 0,
            result && result.realArea || 0,
            measurement && measurement.measurementStatus || "",
            measurement && measurement.quoteConfidence || ""
          ].join("|");
          if (state.lastSummaryViewSignature !== signature) {
            state.lastSummaryViewSignature = signature;
            window.OperonTracking.trackEvent("summary_view", {
              estimated_value: result && result.totalIncGst || 0,
              area: result && result.realArea || 0,
              measurement_status: measurement && measurement.measurementStatus || "",
              quote_confidence: measurement && measurement.quoteConfidence || ""
            });
          }
        }
      }
      if (settings.scrollMode === "top") {
        scrollActiveQuoteStepIntoView(currentQuoteStep);
      }
    }

    async function goToNextQuoteStep() {
      if (currentQuoteStep === 1) {
        normaliseProductChoiceForProgress();
      }

      const validation = validateCurrentQuoteStep();
      if (!validation.valid) {
        showWizardValidationMessage(validation.message);
        focusFirstInvalidField(currentQuoteStep);
        if (window.OperonTracking) {
          const activeMeta = getQuoteStepMeta()[currentQuoteStep];
          window.OperonTracking.trackQuoteStepError(
            currentQuoteStep + 1,
            activeMeta ? activeMeta.trackingName : "step_" + (currentQuoteStep + 1),
            validation.message,
            "step_validation"
          );
        }
        return;
      }
      if (window.OperonTracking) {
        const activeMeta = getQuoteStepMeta()[currentQuoteStep];
        window.OperonTracking.trackQuoteStepCompleted(
          currentQuoteStep + 1,
          activeMeta ? activeMeta.trackingName : "step_" + (currentQuoteStep + 1)
        );
      }

      const isMovingToSummaryStep = currentQuoteStep === 4;

      if (isMovingToSummaryStep) {
        clearQuoteSubmitMessage();
        showQuoteStep(currentQuoteStep + 1, { scrollMode: "top" });
        const summaryPricingPromise = refreshQuoteEstimate({ render: true, track: true });
        if (!shouldUseLocalReviewOnlyMode()) {
          Promise.resolve(summaryPricingPromise).then(async function (pricing) {
            const payload = await buildQuotePayload({ pricing: pricing });
            if (state.quoteRuntimeHealth.checked && !state.quoteRuntimeHealth.quoteSaveReady) {
              if (currentQuoteStep === 5) {
                showQuoteSubmitMessage("review_ready", "Estimate ready to review.");
              }
            } else {
              await saveQuoteDraftToNetlify(payload);
              if (currentQuoteStep === 5) {
                showQuoteSubmitMessage("review_ready", "Estimate saved. Review it here, then send when you are ready.");
              }
            }
          }).catch(function () {
            console.error("Quote draft save check failed.");
            if (currentQuoteStep === 5) {
              showQuoteSubmitMessage("review_ready", "Estimate ready. You can still review and send the quote.");
            }
          });
        }
        return;
      }

      showQuoteStep(currentQuoteStep + 1, { scrollMode: "top" });
    }

    function goToPreviousQuoteStep() {
      showQuoteStep(currentQuoteStep - 1, { scrollMode: "top" });
    }

    function buildProducts() {
      const selectedCategory = getSelectedProductCategory();
      productGrid.innerHTML = PRODUCT_CATEGORIES.map(function (category) {
        const active = selectedCategory === category.id ? "active" : "";
        return `
          <button class="product-card ${active}" type="button" data-product-category="${category.id}">
            <strong>${category.label}</strong>
            <small>${category.shortDescription}</small>
          </button>
        `;
      }).join("");
    }

    function buildRooms() {
      roomList.innerHTML = state.rooms.map(function (room, index) {
        return `
          <div class="room-row" data-room-id="${room.id}">
            <div class="field" style="margin-bottom: 0;">
              <label for="room-name-${room.id}">Room name</label>
              <input id="room-name-${room.id}" type="text" data-room-field="name" value="${escapeHtml(room.name)}" placeholder="Room ${index + 1}">
            </div>
            <div class="field" style="margin-bottom: 0;">
              <label for="room-length-${room.id}">Length (m)</label>
              <input id="room-length-${room.id}" type="number" min="0" step="0.1" data-room-field="length" value="${escapeHtml(room.length)}" placeholder="">
            </div>
            <div class="field" style="margin-bottom: 0;">
              <label for="room-width-${room.id}">Width (m)</label>
              <input id="room-width-${room.id}" type="number" min="0" step="0.1" data-room-field="width" value="${escapeHtml(room.width)}" placeholder="">
            </div>
            <button class="remove-room" type="button" data-remove-room="${room.id}">Remove</button>
          </div>
        `;
      }).join("");
    }

    function setConditionalFieldVisibility(fieldId, visible) {
      const field = document.getElementById(fieldId);
      if (!field) {
        return;
      }
      field.hidden = !visible;
      field.setAttribute("aria-hidden", visible ? "false" : "true");
      field.querySelectorAll("input, select, textarea").forEach(function (element) {
        element.disabled = !visible;
      });
    }

    function shouldShowFurnitureRoomCount(value) {
      return value === "yes" || value === "some" || value === "full" || value === "light" || value === "heavy";
    }

    function normaliseRemovalFloorType(value) {
      const floorType = String(value || "").trim().toLowerCase();
      const map = {
        "": "none",
        bare: "none",
        none: "none",
        carpet: "carpet",
        floating: "floating",
        floating_floor: "floating",
        laminate: "floating",
        hybrid: "floating",
        glue_down: "glue_down",
        glued_or_nailed_timber: "glue_down",
        timber: "glue_down",
        tile: "tile",
        tiles: "tile",
        vinyl: "vinyl",
        unsure: "unsure",
        not_sure: "unsure",
        unknown: "unsure",
        other: "other"
      };
      return map[floorType] || "other";
    }

    function isRemovalSelected(value) {
      const floorType = normaliseRemovalFloorType(value);
      return !!floorType && floorType !== "none";
    }

    function isSpecificRemovalFloorType(value) {
      return ["carpet", "floating", "glue_down", "tile", "vinyl", "other"].indexOf(normaliseRemovalFloorType(value)) >= 0;
    }

    function getDefaultUnderlayIdForCategory(category) {
      if (!window.OperonUnderlay || typeof window.OperonUnderlay.list !== "function") {
        return "";
      }
      const targetCategory = category || getSelectedProductCategory();
      const options = window.OperonUnderlay.list();
      const standardSilver = options.find(function (option) {
        return option.id === DEFAULT_UNDERLAY_ID
          && Array.isArray(option.suitableCategories)
          && option.suitableCategories.indexOf(targetCategory) >= 0;
      });
      if (standardSilver) {
        return standardSilver.id;
      }
      const match = options.find(function (option) {
        return Array.isArray(option.suitableCategories) && option.suitableCategories.indexOf(targetCategory) >= 0;
      });
      return match ? match.id : "";
    }

    function listUnderlayOptionsForCurrentScope() {
      if (!window.OperonUnderlay || typeof window.OperonUnderlay.list !== "function") {
        return [];
      }

      const category = getSelectedProductCategory();
      const installMethod = getInputValue("installMethod") || "floating";
      return window.OperonUnderlay.list().filter(function (option) {
        const suitable = Array.isArray(option.suitableCategories) && option.suitableCategories.indexOf(category) >= 0;
        if (!suitable) {
          return false;
        }
        if (category === "engineered" && installMethod !== "direct_glue" && /glued.down/i.test(option.id + " " + option.name)) {
          return false;
        }
        return true;
      });
    }

    function getSelectedUnderlayLabel() {
      if (!window.OperonUnderlay || typeof window.OperonUnderlay.getUnderlayById !== "function") {
        return "";
      }
      const underlay = window.OperonUnderlay.getUnderlayById(getInputValue("underlayId"));
      return underlay ? underlay.name : "";
    }

    function isStraightPlankPatternType(patternType) {
      const value = String(patternType || "standard").trim().toLowerCase();
      return !value || value === "standard" || value === "straight" || value === "straight_plank";
    }

    function shouldRequireUnderlayForCurrentScope() {
      const category = getSelectedProductCategory();
      const quoteMode = getInputValue("quoteMode") || "supply_install";
      const installMethod = getInputValue("installMethod") || "floating";
      const patternType = getInputValue("patternType") || "standard";
      return quoteMode === "supply_install"
        && (
          category === "laminate"
          || (category === "engineered" && installMethod === "floating" && isStraightPlankPatternType(patternType))
        );
    }

    function syncUnderlaySelectOptions() {
      if (!underlaySelect) {
        return;
      }

      const options = listUnderlayOptionsForCurrentScope();
      const currentId = getInputValue("underlayId");
      const underlaySelected = getInputValue("underlayDecision") === "yes";
      underlaySelect.innerHTML = options.map(function (option) {
        return "<option value=\"" + escapeHtml(option.id) + "\">" + escapeHtml(option.name) + "</option>";
      }).join("");

      if (!underlaySelected) {
        underlaySelect.value = "";
        return;
      }

      if (options.some(function (option) { return option.id === currentId; })) {
        underlaySelect.value = currentId;
      } else if (options.length) {
        const defaultId = getDefaultUnderlayIdForCategory(getSelectedProductCategory()) || options[0].id;
        underlaySelect.value = defaultId;
        setInputValue("underlayId", defaultId);
      } else {
        underlaySelect.value = "";
        setInputValue("underlayId", "");
      }
    }

    function enforceUnderlayRequirement() {
      const underlayRequired = shouldRequireUnderlayForCurrentScope();
      const options = listUnderlayOptionsForCurrentScope();
      const currentUnderlay = options.find(function (option) {
        return option.id === getInputValue("underlayId");
      });

      if (!options.length) {
        if (getInputValue("underlayDecision") === "yes") {
          setInputValue("underlayDecision", "");
        }
        setInputValue("underlayId", "");
        syncUnderlaySelectOptions();
        document.querySelectorAll("[data-extra-field='underlayDecision']").forEach(function (button) {
          button.disabled = false;
          button.classList.remove("locked");
          button.setAttribute("aria-disabled", "false");
        });
        if (underlayLockNote) {
          underlayLockNote.hidden = true;
        }
        return;
      }

      if (underlayRequired) {
        setExtraDecision("underlayDecision", "yes");
      }

      if (getInputValue("underlayDecision") === "yes") {
        if (!currentUnderlay) {
          const defaultUnderlayId = getDefaultUnderlayIdForCategory(getSelectedProductCategory()) || (options[0] ? options[0].id : "");
          setInputValue("underlayId", defaultUnderlayId);
        }
      } else {
        setInputValue("underlayId", "");
      }

      syncUnderlaySelectOptions();

      document.querySelectorAll("[data-extra-field='underlayDecision']").forEach(function (button) {
        const isLockedOut = underlayRequired && button.getAttribute("data-extra-choice") !== "yes";
        button.disabled = isLockedOut;
        button.classList.toggle("locked", isLockedOut);
        button.setAttribute("aria-disabled", isLockedOut ? "true" : "false");
      });

      if (underlayLockNote) {
        underlayLockNote.hidden = !underlayRequired;
      }
    }

    const STAIR_DETAIL_FIELDS = [
      { id: "stairStraightTreadCount", type: "straight_tread", label: "Straight stair treads" },
      { id: "stairWinderTreadCount", type: "winder_tread", label: "Winder / triangular treads" },
      { id: "stairLandingSmallCount", type: "landing_1m2", label: "Landings up to 1 m²" },
      { id: "stairLandingLargeCount", type: "landing_2m2", label: "Landings up to 2 m²" },
      { id: "stairOneSideOpenCount", type: "one_side_open", label: "Stairs with one open side" },
      { id: "stairTwoSideOpenCount", type: "two_side_open", label: "Stairs with two open sides" }
    ];

    function getStairDetailCounts() {
      return STAIR_DETAIL_FIELDS.reduce(function (counts, field) {
        counts[field.id] = Math.max(0, Math.round(parsePositiveNumber(getInputValue(field.id))));
        return counts;
      }, {});
    }

    function getTotalStairDetailCount() {
      const counts = getStairDetailCounts();
      return Object.keys(counts).reduce(function (total, key) {
        return total + counts[key];
      }, 0);
    }

    function getStairDetailsPayload() {
      const counts = getStairDetailCounts();
      return STAIR_DETAIL_FIELDS.map(function (field) {
        return {
          type: field.type,
          label: field.label,
          quantity: counts[field.id] || 0
        };
      });
    }

    function clearStairDetails() {
      STAIR_DETAIL_FIELDS.forEach(function (field) {
        setInputValue(field.id, "0");
      });
      setInputValue("stairWidthKnown", "no");
      setInputValue("stairWidthMm", "");
      setInputValue("stairsCountRange", "");
      setInputValue("stairsCount", "0");
    }

    function setStairsChoice(choice) {
      const value = choice || "";
      setInputValue("stairs", value);
      if (value !== "yes") {
        clearStairDetails();
      } else {
        setInputValue("stairsCount", String(getTotalStairDetailCount()));
        setInputValue("stairsCountRange", "detailed");
      }
      setInputValue("stairsRequiresReview", isStairScopeReviewRequired({ stairs: value }) ? "yes" : "no");
      if (value === "not_sure" && window.OperonTracking) {
        window.OperonTracking.trackEvent("quote_stairs_not_sure", {
          step_name: "stairs",
          event_context: "quote_flow"
        });
      }
    }

    function setStairWidthKnown(choice) {
      const value = choice === "yes" ? "yes" : "no";
      setInputValue("stairWidthKnown", value);
      if (value !== "yes") {
        setInputValue("stairWidthMm", "");
      }
      setInputValue("stairsRequiresReview", isStairScopeReviewRequired(getFormInput()) ? "yes" : "no");
    }

    function syncStairDetailCounts() {
      const total = getTotalStairDetailCount();
      setInputValue("stairsCount", String(total));
      setInputValue("stairsCountRange", total > 0 ? "detailed" : "");
      if (getInputValue("stairs") !== "yes") {
        setInputValue("stairs", "yes");
      }
      setInputValue("stairsRequiresReview", isStairScopeReviewRequired(getFormInput()) ? "yes" : "no");
    }

    function setExtraDecision(fieldName, value) {
      if (fieldName === "underlayDecision" && shouldRequireUnderlayForCurrentScope()) {
        setInputValue(fieldName, "yes");
        const defaultUnderlayId = getDefaultUnderlayIdForCategory(getSelectedProductCategory());
        if (!getInputValue("underlayId") && defaultUnderlayId) {
          setInputValue("underlayId", defaultUnderlayId);
        }
        return;
      }
      setInputValue(fieldName, value);
      if (value === "not_sure" && window.OperonTracking) {
        window.OperonTracking.trackEvent("quote_scope_not_sure", {
          step_name: "extras",
          event_context: fieldName
        });
      }
    }

    function applyStandardExtrasSetup() {
      setExtraDecision("removalDecision", "no");
      setInputValue("removalType", "none");
      setInputValue("existingFloorType", "none");
      setInputValue("removalDisposal", "no");

      setExtraDecision("floorPrepDecision", "no");
      setInputValue("floorPrepType", "none");
      setInputValue("subfloorCondition", "flat_solid");
      setInputValue("moistureBarrier", "no");

      const defaultUnderlayId = getDefaultUnderlayIdForCategory(getSelectedProductCategory());
      const underlayRequired = shouldRequireUnderlayForCurrentScope();
      setExtraDecision("underlayDecision", underlayRequired ? "yes" : "no");
      setInputValue("underlayId", underlayRequired ? defaultUnderlayId : "");

      setExtraDecision("finishDecision", "no");
      setInputValue("skirtingType", "no");
      setInputValue("scotiaType", "no");

      setExtraDecision("doorDecision", "no");
      setInputValue("doorTrimming", "no");
      setInputValue("doorCount", "");

      setExtraDecision("furnitureDecision", "no");
      setInputValue("furnitureType", "no");
      setInputValue("furnitureRoomCount", "");
    }

    function getExtrasScopePreviewItems() {
      const quoteMode = getInputValue("quoteMode") || "supply_install";
      const items = quoteMode === "supply_install"
        ? ["Supply", "Installation"]
        : ["Installation"];
      const category = getSelectedProductCategory();
      const stairsChoice = getInputValue("stairs");
      if (stairsChoice === "yes" || stairsChoice === "not_sure" || getInputValue("stairsRequiresReview") === "yes") {
        items.push(stairsChoice === "not_sure" ? "Stairs to confirm" : "Stairs");
      }
      if (isRemovalSelected(getInputValue("removalType") || getInputValue("existingFloorType"))) {
        items.push("Removal");
      }
      if (getInputValue("removalDisposal") === "yes") {
        items.push("Disposal");
      }
      if (getInputValue("floorPrepType") && getInputValue("floorPrepType") !== "none") {
        items.push("Floor preparation");
      }
      if (getInputValue("underlayId")) {
        items.push("Underlay");
      } else if (category === "hybrid") {
        items.push("Hybrid acoustic layer handled in product setup");
      }
      if ((getInputValue("skirtingType") && getInputValue("skirtingType") !== "no") || getInputValue("scotiaType") === "yes") {
        items.push("Skirting or scotia");
      }
      if (getInputValue("doorTrimming") === "yes") {
        items.push("Door trimming");
      }
      if (shouldShowFurnitureRoomCount(getInputValue("furnitureType"))) {
        items.push("Furniture moving");
      }
      return items.slice(0, 7);
    }

    function renderStairsStep() {
      const stairsChoice = getInputValue("stairs");
      const stairWidthKnown = getInputValue("stairWidthKnown") || "no";
      const totalStairCount = getTotalStairDetailCount();
      setActiveCards("[data-stairs-choice]", stairsChoice, "data-stairs-choice");
      setActiveCards("[data-stair-width-known]", stairWidthKnown, "data-stair-width-known");

      const detailVisible = stairsChoice === "yes";
      setConditionalFieldVisibility("stairsCountDetail", detailVisible);
      setConditionalFieldVisibility("stairWidthField", detailVisible && stairWidthKnown === "yes");
      const stairsDetailAccordion = document.getElementById("stairsDetailAccordion");
      if (stairsDetailAccordion && detailVisible) {
        stairsDetailAccordion.open = true;
      }

      const status = document.getElementById("stairsStatusMessage");
      if (!status) {
        return;
      }
      if (stairsChoice === "yes") {
        const widthNote = stairWidthKnown === "yes" && parsePositiveNumber(getInputValue("stairWidthMm")) > 0
          ? " Stair width captured."
          : " Lower stair allowance used until width is confirmed.";
        status.textContent = totalStairCount > 0
          ? totalStairCount + " stair item" + (totalStairCount === 1 ? "" : "s") + " noted." + widthNote
          : "Stairs included. Add the stair quantities you know, or leave them as 0 for site confirmation.";
        return;
      }
      if (stairsChoice === "not_sure") {
        status.textContent = "Stairs flagged for review.";
        return;
      }
      if (stairsChoice === "no") {
        status.textContent = "No stairs selected.";
        return;
      }
      status.textContent = "";
    }

    function renderExtrasStep() {
      enforceUnderlayRequirement();
      setActiveCards("[data-extra-field='removalDecision']", getInputValue("removalDecision"), "data-extra-choice");
      setActiveCards("[data-extra-field='removalDisposal']", getInputValue("removalDisposal"), "data-extra-choice");
      setActiveCards("[data-extra-field='floorPrepDecision']", getInputValue("floorPrepDecision"), "data-extra-choice");
      setActiveCards("[data-extra-field='underlayDecision']", getInputValue("underlayDecision"), "data-extra-choice");
      setActiveCards("[data-extra-field='finishDecision']", getInputValue("finishDecision"), "data-extra-choice");
      setActiveCards("[data-extra-field='doorDecision']", getInputValue("doorDecision"), "data-extra-choice");
      setActiveCards("[data-extra-field='furnitureDecision']", getInputValue("furnitureDecision"), "data-extra-choice");

      setConditionalFieldVisibility("removalDetail", getInputValue("removalDecision") === "yes");
      setConditionalFieldVisibility("floorPrepDetail", getInputValue("floorPrepDecision") === "yes");
      setConditionalFieldVisibility("underlayDetail", getInputValue("underlayDecision") === "yes");
      setConditionalFieldVisibility("finishDetail", getInputValue("finishDecision") === "yes");
      setConditionalFieldVisibility("doorDetail", getInputValue("doorDecision") === "yes");
      setConditionalFieldVisibility("furnitureDetail", getInputValue("furnitureDecision") === "yes");

      const previewList = document.getElementById("extrasScopePreviewList");
      if (previewList) {
        previewList.innerHTML = getExtrasScopePreviewItems().map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        }).join("");
      }

      const removalStatus = document.getElementById("removalDecisionStatus");
      if (removalStatus) {
        removalStatus.textContent = getInputValue("removalDecision") === "yes"
          ? "Included in estimate."
          : (getInputValue("removalDecision") === "not_sure" ? "Needs confirmation." : (getInputValue("removalDecision") === "no" ? "Not included." : ""));
      }

      const disposalStatus = document.getElementById("removalDisposalStatus");
      if (disposalStatus) {
        disposalStatus.textContent = getInputValue("removalDisposal") === "yes"
          ? "Included if removal is included."
          : (getInputValue("removalDisposal") === "not_sure" ? "Needs confirmation if removal is included." : (getInputValue("removalDisposal") === "no" ? "Not included." : ""));
      }

      const floorPrepStatus = document.getElementById("floorPrepDecisionStatus");
      if (floorPrepStatus) {
        const floorPrepHasDetail = !!getInputValue("floorPrepType") && getInputValue("floorPrepType") !== "none";
        floorPrepStatus.textContent = getInputValue("floorPrepDecision") === "yes"
          ? (floorPrepHasDetail ? "Included in estimate." : "Needs preparation detail.")
          : (getInputValue("floorPrepDecision") === "not_sure" ? "Needs confirmation." : (getInputValue("floorPrepDecision") === "no" ? "Not included." : ""));
      }

      const underlayStatus = document.getElementById("underlayDecisionStatus");
      if (underlayStatus) {
        const underlayLabel = getSelectedUnderlayLabel();
        underlayStatus.textContent = getInputValue("underlayId")
          ? (underlayLabel ? underlayLabel + " included in estimate." : "Included in estimate.")
          : (getInputValue("underlayDecision") === "not_sure" ? "Needs confirmation." : (getInputValue("underlayDecision") === "no" ? "Not included." : ""));
      }

      const finishStatus = document.getElementById("finishDecisionStatus");
      if (finishStatus) {
        const finishHasDetail = (getInputValue("skirtingType") && getInputValue("skirtingType") !== "no") || getInputValue("scotiaType") === "yes";
        finishStatus.textContent = getInputValue("finishDecision") === "yes"
          ? (finishHasDetail ? "Included in estimate." : "Needs skirting or scotia detail.")
          : (getInputValue("finishDecision") === "not_sure" ? "Needs confirmation." : (getInputValue("finishDecision") === "no" ? "Not included." : ""));
      }

      const doorStatus = document.getElementById("doorDecisionStatus");
      if (doorStatus) {
        doorStatus.textContent = getInputValue("doorDecision") === "yes"
          ? "Included in estimate."
          : (getInputValue("doorDecision") === "not_sure" ? "Needs confirmation." : (getInputValue("doorDecision") === "no" ? "Not included." : ""));
      }

      const furnitureStatus = document.getElementById("furnitureDecisionStatus");
      if (furnitureStatus) {
        furnitureStatus.textContent = getInputValue("furnitureDecision") === "yes"
          ? "Included in estimate."
          : (getInputValue("furnitureDecision") === "not_sure" ? "Needs confirmation." : (getInputValue("furnitureDecision") === "no" ? "Not included." : ""));
      }
    }

    function getAutoPatternTypeForSelectedRange() {
      const category = getSelectedProductCategory();
      const rangeId = getInputValue("selectedRangeId");
      const rangeRecord = getRangeRecordById(category, rangeId);
      const rangeLabel = String(rangeRecord ? (rangeRecord.rangeLabel || rangeRecord.range || "") : "").toLowerCase();

      if (!rangeLabel) {
        return "";
      }
      if (rangeLabel.indexOf("herringbone") >= 0) {
        return "herringbone";
      }
      if (rangeLabel.indexOf("chevron") >= 0) {
        return "chevron";
      }
      return "standard";
    }

    function shouldShowProductChoicePanel() {
      return (getInputValue("quoteMode") || "supply_install") !== "install_only";
    }

    function shouldShowSelectedProductBanner() {
      return shouldShowProductChoicePanel() && getProductChoiceMode() === "recommend";
    }

    function shouldLockPatternTypeToSelectedRange() {
      return (getInputValue("quoteMode") || "supply_install") === "supply_install"
        && getSelectedProductCategory() === "engineered"
        && getProductChoiceMode() === "choose_range"
        && !!getInputValue("selectedRangeId");
    }

    function getPatternTypeLabelText(value) {
      if (value === "herringbone") {
        return "Herringbone";
      }
      if (value === "chevron") {
        return "Chevron";
      }
      return "Standard plank";
    }

    function getInstallMethodLabelText(value) {
      return value === "direct_glue" ? "Glued down" : "Floating floor";
    }

    function updateConditionalQuoteFields() {
      const propertyType = getInputValue("propertyType");
      const level = getInputValue("level");
      const legacyExistingFloorType = getInputValue("existingFloorType");
      let removalType = normaliseRemovalFloorType(getInputValue("removalType") || legacyExistingFloorType);
      const furnitureType = getInputValue("furnitureType");
      const doorTrimming = getInputValue("doorTrimming");
      const removalDecision = getInputValue("removalDecision");
      const floorPrepDecision = getInputValue("floorPrepDecision");
      const underlayDecision = getInputValue("underlayDecision");
      const finishDecision = getInputValue("finishDecision");
      const doorDecision = getInputValue("doorDecision");
      const furnitureDecision = getInputValue("furnitureDecision");
      const previousPropertyType = state.lastPropertyType;
      const previousShowLevelField = previousPropertyType === "unit_apartment" || previousPropertyType === "commercial_other";
      const propertyTypeChanged = previousPropertyType !== propertyType;

      if (!removalDecision && !getInputValue("removalType") && !legacyExistingFloorType) {
        removalType = "";
      }
      if (isSpecificRemovalFloorType(removalType)) {
        state.lastRemovalType = removalType;
      }
      if (["basic", "levelling", "heavy", "manual"].indexOf(getInputValue("floorPrepType")) >= 0) {
        state.lastFloorPrepType = getInputValue("floorPrepType");
      }
      if (getInputValue("removalType") !== removalType) {
        setInputValue("removalType", removalType);
      }
      setInputValue("existingFloorType", removalType);

      const showLevelField = propertyType === "unit_apartment" || propertyType === "commercial_other";
      if (!showLevelField) {
        setInputValue("level", "ground");
      } else if (propertyTypeChanged && !previousShowLevelField) {
        setInputValue("level", "");
      }
      setConditionalFieldVisibility("propertyLevelField", showLevelField);

      const activeLevel = getInputValue("level");
      const showLiftField = showLevelField && activeLevel === "level_2_plus";
      if (!showLiftField) {
        setInputValue("hasLift", "na");
      } else if (propertyTypeChanged || !getInputValue("hasLift") || getInputValue("hasLift") === "na") {
        setInputValue("hasLift", "");
      }
      setConditionalFieldVisibility("hasLiftField", showLiftField);
      state.lastPropertyType = propertyType;

      setInputValue("manualRoomCount", "");
      setInputValue("floorplanRoomCount", "");
      setConditionalFieldVisibility("manualRoomCountField", false);
      setConditionalFieldVisibility("floorplanRoomCountField", false);

      if (removalDecision === "no") {
        removalType = "none";
        setInputValue("removalType", "none");
        setInputValue("removalDisposal", "no");
      } else if (removalDecision === "not_sure") {
        removalType = "unsure";
        setInputValue("removalType", "unsure");
        setInputValue("removalDisposal", "not_sure");
      } else if (removalDecision === "yes") {
        if (!isSpecificRemovalFloorType(removalType)) {
          removalType = isSpecificRemovalFloorType(state.lastRemovalType) ? state.lastRemovalType : "carpet";
          setInputValue("removalType", removalType);
        }
        if (!getInputValue("removalDisposal")) {
          setInputValue("removalDisposal", "not_sure");
        }
      }
      setInputValue("existingFloorType", removalType);

      if (floorPrepDecision === "no") {
        setInputValue("floorPrepType", "none");
        setInputValue("subfloorCondition", "flat_solid");
        setInputValue("moistureBarrier", "no");
      } else if (floorPrepDecision === "not_sure") {
        setInputValue("floorPrepType", "unsure");
        setInputValue("subfloorCondition", "not_sure");
        setInputValue("moistureBarrier", "not_sure");
      } else if (floorPrepDecision === "yes" && ["basic", "levelling", "heavy", "manual"].indexOf(getInputValue("floorPrepType")) < 0) {
        setInputValue("floorPrepType", state.lastFloorPrepType || "basic");
      }

      if (underlayDecision === "yes") {
        const defaultUnderlayId = getDefaultUnderlayIdForCategory(getSelectedProductCategory());
        const activeUnderlay = window.OperonUnderlay && typeof window.OperonUnderlay.getUnderlayById === "function"
          ? window.OperonUnderlay.getUnderlayById(getInputValue("underlayId"))
          : null;
        const underlayStillMatches = !!(activeUnderlay
          && Array.isArray(activeUnderlay.suitableCategories)
          && activeUnderlay.suitableCategories.indexOf(getSelectedProductCategory()) >= 0);
        if (defaultUnderlayId && (!getInputValue("underlayId") || !underlayStillMatches)) {
          setInputValue("underlayId", defaultUnderlayId);
        }
      } else {
        setInputValue("underlayId", "");
      }

      if (finishDecision === "no") {
        setInputValue("skirtingType", "no");
        setInputValue("scotiaType", "no");
      } else if (finishDecision === "not_sure") {
        setInputValue("skirtingType", "manual");
        setInputValue("scotiaType", "no");
      }

      if (doorDecision === "yes") {
        setInputValue("doorTrimming", "yes");
      } else if (doorDecision === "not_sure") {
        setInputValue("doorTrimming", "no");
        setInputValue("doorCount", "");
      } else {
        setInputValue("doorTrimming", "no");
        setInputValue("doorCount", "");
      }

      if (furnitureDecision === "yes") {
        if (getInputValue("furnitureType") === "no" || !getInputValue("furnitureType")) {
          setInputValue("furnitureType", "some");
        }
      } else if (furnitureDecision === "not_sure") {
        setInputValue("furnitureType", "no");
        setInputValue("furnitureRoomCount", "");
      } else {
        setInputValue("furnitureType", "no");
        setInputValue("furnitureRoomCount", "");
      }

      const showFurnitureRoomCount = shouldShowFurnitureRoomCount(getInputValue("furnitureType"));
      if (!showFurnitureRoomCount) {
        setInputValue("furnitureRoomCount", "");
      }
      setConditionalFieldVisibility("furnitureRoomCountField", showFurnitureRoomCount);

      const showDoorCount = getInputValue("doorTrimming") === "yes";
      if (!showDoorCount) {
        setInputValue("doorCount", "");
      }
      setConditionalFieldVisibility("doorCountField", showDoorCount);

      const wantsEmailCopy = !!(emailQuoteCopyCheckbox && emailQuoteCopyCheckbox.checked);
      setConditionalFieldVisibility("emailCopyContactFields", wantsEmailCopy);
      const showQuoteDeliveryEmail = wantsEmailCopy && !getInputValue("email").trim();
      if (!showQuoteDeliveryEmail) {
        setInputValue("quoteDeliveryEmail", "");
      }
      setConditionalFieldVisibility("quoteDeliveryEmailField", showQuoteDeliveryEmail);

      if (getInputValue("stairs") === "yes") {
        setInputValue("stairsCount", String(getTotalStairDetailCount()));
        setInputValue("stairsCountRange", getTotalStairDetailCount() > 0 ? "detailed" : "");
        setInputValue("stairsRequiresReview", isStairScopeReviewRequired(getFormInput()) ? "yes" : "no");
      } else {
        setInputValue("stairsRequiresReview", getInputValue("stairs") === "not_sure" ? "yes" : "no");
        if (getInputValue("stairs") !== "not_sure") {
          clearStairDetails();
        }
      }

      const selectedCategory = getSelectedProductCategory();
      const quoteMode = getInputValue("quoteMode") || "supply_install";
      const isInstallOnly = quoteMode === "install_only";
      const lockPatternToRange = shouldLockPatternTypeToSelectedRange();
      const autoPatternType = lockPatternToRange
        ? getAutoPatternTypeForSelectedRange()
        : "";
      if (autoPatternType && getInputValue("patternType") !== autoPatternType) {
        setInputValue("patternType", autoPatternType);
      }
      const currentPatternType = getInputValue("patternType") || "standard";
      const previousPatternType = state.lastPatternType || currentPatternType;
      const patternChanged = previousPatternType !== currentPatternType;
      const isEngineered = selectedCategory === "engineered";
      const installMethodFieldVisible = isEngineered;
      const patternFieldVisible = isEngineered;
      const shouldLockInstallMethod = isEngineered && (currentPatternType === "herringbone" || currentPatternType === "chevron");

      if (patternTypeLabel) {
        patternTypeLabel.textContent = "Installation pattern";
      }
      if (patternTypeSelect) {
        const shouldDisablePatternType = !!(isEngineered && lockPatternToRange);
        patternTypeSelect.disabled = shouldDisablePatternType;
        patternTypeSelect.setAttribute("aria-disabled", shouldDisablePatternType ? "true" : "false");
        if (shouldDisablePatternType) {
          patternTypeSelect.setAttribute("disabled", "disabled");
        } else {
          patternTypeSelect.removeAttribute("disabled");
        }
        patternTypeSelect.hidden = shouldDisablePatternType;
      }
      if (patternTypeLockedValue) {
        const shouldShowLockedPatternValue = !!(isEngineered && lockPatternToRange);
        patternTypeLockedValue.hidden = !shouldShowLockedPatternValue;
        patternTypeLockedValue.setAttribute("aria-hidden", shouldShowLockedPatternValue ? "false" : "true");
        if (shouldShowLockedPatternValue) {
          patternTypeLockedValue.textContent = getPatternTypeLabelText(currentPatternType);
        } else {
          patternTypeLockedValue.textContent = "";
        }
      }
      if (installMethodSelect) {
        installMethodSelect.disabled = shouldLockInstallMethod;
        installMethodSelect.setAttribute("aria-disabled", shouldLockInstallMethod ? "true" : "false");
        if (shouldLockInstallMethod) {
          installMethodSelect.setAttribute("disabled", "disabled");
        } else {
          installMethodSelect.removeAttribute("disabled");
        }
        installMethodSelect.hidden = shouldLockInstallMethod;
      }
      if (installMethodLockedValue) {
        installMethodLockedValue.hidden = !shouldLockInstallMethod;
        installMethodLockedValue.setAttribute("aria-hidden", shouldLockInstallMethod ? "false" : "true");
        installMethodLockedValue.textContent = shouldLockInstallMethod
          ? getInstallMethodLabelText(getInputValue("installMethod") || "direct_glue")
          : "";
      }

      if (!isEngineered) {
        setInputValue("patternType", "standard");
        setInputValue("installMethod", "floating");
        if (isInstallOnly) {
          installationPathHelper.textContent = "Floating-floor installation selected.";
        } else {
          installationPathHelper.textContent = "Standard floating-floor installation selected.";
        }
      } else if (currentPatternType === "herringbone" || currentPatternType === "chevron") {
        setInputValue("installMethod", "direct_glue");
        installationPathHelper.textContent = "Feature pattern installation selected.";
      } else {
        if (!getInputValue("installMethod") || (patternChanged && isStraightPlankPatternType(currentPatternType) && !isStraightPlankPatternType(previousPatternType))) {
          setInputValue("installMethod", "floating");
        }
        installationPathHelper.textContent = "Choose floating or glued-down installation.";
      }
      state.lastPatternType = currentPatternType;

      setConditionalFieldVisibility("installMethodField", installMethodFieldVisible);
      setConditionalFieldVisibility("patternTypeField", patternFieldVisible);
      enforceUnderlayRequirement();
    }

    function setActiveCards(selector, value, attributeName) {
      document.querySelectorAll(selector).forEach(function (button) {
        button.classList.toggle("active", button.getAttribute(attributeName) === value);
      });
    }

    function setMeasurementMethod(method) {
      setInputValue("measurementMethod", method);
      setActiveCards("[data-measurement]", method, "data-measurement");
      document.querySelectorAll(".measure-panel").forEach(function (panel) {
        panel.classList.toggle("active", panel.id === method + "_panel");
      });
      if (method !== "unknown") {
        setInputValue("unknownMeasurementNextStep", "");
      }
      renderUnknownMeasurementFlow();
      renderAll();
    }

    function setUnknownMeasurementNextStep(step) {
      setInputValue("unknownMeasurementNextStep", step || "");
      if (step === "floorplan_lookup") {
        syncFloorplanLookupAddressFromSiteAddress();
      }
      renderUnknownMeasurementFlow();
      renderAll();
    }

    function syncFloorplanLookupAddressFromSiteAddress() {
      const explicitAddress = String(getInputValue("floorplanLookupAddress") || "").trim();
      const siteAddress = String(getInputValue("siteAddress") || "").trim();
      if (!explicitAddress && siteAddress) {
        setInputValue("floorplanLookupAddress", siteAddress);
      }
    }

    function getUnknownMeasurementSelection() {
      const explicitAddress = String(getInputValue("floorplanLookupAddress") || "").trim();
      const siteAddress = String(getInputValue("siteAddress") || "").trim();
      return {
        nextStepRequired: getInputValue("unknownMeasurementNextStep"),
        lookupAddress: explicitAddress || siteAddress
      };
    }

    function getUnknownMeasurementNextStepLabel(step) {
      if (step === "site_assessment") {
        return "Request site assessment";
      }
      if (step === "floorplan_lookup") {
        return "Check for existing floor plan";
      }
      if (step === "product_discovery") {
        return "Continue to product discovery";
      }
      return "Choose the next best path";
    }

    function renderUnknownMeasurementFlow() {
      const isUnknown = getInputValue("measurementMethod") === "unknown";
      if (isUnknown && getInputValue("unknownMeasurementNextStep") === "floorplan_lookup") {
        syncFloorplanLookupAddressFromSiteAddress();
      }
      const selection = getUnknownMeasurementSelection();

      if (unknownMeasurementChoices) {
        setActiveCards("[data-unknown-next-step]", selection.nextStepRequired, "data-unknown-next-step");
      }
      if (unknownAddressField) {
        unknownAddressField.hidden = !isUnknown || selection.nextStepRequired !== "floorplan_lookup";
      }
      if (siteAssessmentValueBlock) {
        siteAssessmentValueBlock.hidden = !isUnknown || selection.nextStepRequired !== "site_assessment";
      }
    }

    function setQuoteMode(mode) {
      setInputValue("quoteMode", mode);
      setActiveCards("[data-quote-mode]", mode, "data-quote-mode");
      renderAll();
    }

    function addRoom() {
      state.rooms.push(createEmptyRoom("Room " + (state.rooms.length + 1)));
      buildRooms();
      renderAll();
    }

    function removeRoom(roomId) {
      state.rooms = state.rooms.filter(function (room) {
        return room.id !== roomId;
      });
      if (!state.rooms.length) {
        state.rooms = [createEmptyRoom("Living room")];
      }
      buildRooms();
      renderAll();
    }

    function updateRoom(roomId, field, value) {
      state.rooms = state.rooms.map(function (room) {
        if (room.id !== roomId) {
          return room;
        }
        return Object.assign({}, room, {
          [field]: value
        });
      });
      renderAll();
    }

    function syncSelectionFieldsFromResolved(resolvedSelection) {
      const selection = resolvedSelection || getResolvedQuoteSelection();
      setInputValue("selectedProductCategory", selection.category || getPreferredProductCategory());
      setInputValue("selectedProduct", selection.productId || "");
      setInputValue("selectedRangeId", selection.rangeId || "");
      setInputValue("selectedColour", selection.selectedColour || "");
      setInputValue("productSelectionMode", selection.selectionMode || "");
      return selection;
    }

    function syncSelectedProductState() {
      if (!PRODUCT_LIBRARY) {
        return null;
      }

      const selection = syncSelectionFieldsFromResolved();
      PRODUCT_LIBRARY.saveSelectedCategory(selection.category);

      if (!PRODUCT_SELECTION) {
        return selection.product || null;
      }

      if (selection.product) {
        PRODUCT_SELECTION.saveSelection({
          category: selection.category,
          choiceMode: selection.choiceMode,
          rangeId: selection.rangeId,
          selectedColour: selection.selectedColour,
          productId: selection.productId,
          selectionMode: selection.selectionMode
        });
        return selection.product;
      }

      PRODUCT_LIBRARY.saveSelectionState({
        selectedProductId: "",
        selectedRangeId: selection.rangeId || "",
        selectedCategory: selection.category,
        selectedColour: "",
        productSelectionMode: selection.selectionMode || ""
      });
      return null;
    }

    function restoreStoredProductSelection(options) {
      if (!PRODUCT_LIBRARY || !PRODUCT_SELECTION) {
        return false;
      }

      const settings = Object.assign({ markHandoff: false }, options || {});
      const storedSelectionState = PRODUCT_LIBRARY.getStoredSelectionState();
      const storedCategory = PRODUCT_LIBRARY.getStoredCategory() || getSelectedProductCategory() || "hybrid";

      if (!storedSelectionState) {
        return false;
      }

      const hasStoredProduct = !!storedSelectionState.selectedProductId;
      const hasStoredRange = !!storedSelectionState.selectedRangeId;

      if (!hasStoredProduct && !hasStoredRange) {
        return false;
      }

      if (hasStoredProduct) {
        setSelectedProductById(storedSelectionState.selectedProductId, {
          persist: false,
          choiceMode: hasStoredRange ? "choose_range" : getProductChoiceMode()
        });
        if (settings.markHandoff) {
          state.productHandoffActive = true;
          state.productSelectionLoadedFromCatalogue = true;
        }
        return true;
      }

      setSelectedCategory(storedSelectionState.selectedCategory || storedCategory, { preserveProduct: false });
      setProductChoiceMode("choose_range", { track: false });
      setSelectedRange(storedSelectionState.selectedRangeId, { persist: false, track: false });
      if (storedSelectionState.selectedColour) {
        setSelectedColourValue(storedSelectionState.selectedColour, { persist: false, track: false });
      } else {
        syncSelectionFieldsFromResolved();
      }

      if (settings.markHandoff) {
        state.productHandoffActive = true;
        state.productSelectionLoadedFromCatalogue = true;
      }

      return true;
    }

    function trackProductSelectionMode(eventName, payload) {
      if (!window.OperonTracking) {
        return;
      }

      window.OperonTracking.trackEvent(eventName, Object.assign({
        category: getSelectedProductCategory(),
        mode: getProductChoiceMode()
      }, payload || {}));
      window.OperonTracking.trackEvent("product_selection_mode", Object.assign({
        category: getSelectedProductCategory(),
        mode: getProductChoiceMode()
      }, payload || {}));
    }

    function setSelectedCategory(category, options) {
      const settings = Object.assign({ preserveProduct: false, trackStartFromProduct: false }, options || {});
      const meta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(category) : null;
      const normalisedCategory = meta ? meta.id : "hybrid";
      const currentRange = getInputValue("selectedRangeId");
      const currentRangeRecord = getRangeRecordById(normalisedCategory, currentRange);

      setInputValue("selectedProductCategory", normalisedCategory);

      if (!settings.preserveProduct || !currentRangeRecord) {
        setInputValue("selectedProduct", "");
        setInputValue("selectedRangeId", "");
        setInputValue("selectedColour", "");
        setInputValue("productSelectionMode", "");
        state.productHandoffActive = false;
      }

      PRODUCT_LIBRARY.saveSelectedCategory(normalisedCategory);

      if (settings.trackStartFromProduct && window.OperonTracking) {
        window.OperonTracking.trackEvent("quote_start_from_product", {
          category: normalisedCategory
        });
      }
    }

    function setProductChoiceMode(mode, options) {
      const settings = Object.assign({ track: false }, options || {});
      const nextMode = ["recommend", "choose_range"].indexOf(mode) >= 0 ? mode : "recommend";
      setInputValue("productChoiceMode", nextMode);
      setActiveCards("[data-product-choice-mode]", nextMode, "data-product-choice-mode");

      if (nextMode === "recommend" && PRODUCT_SELECTION) {
        const recommendation = PRODUCT_SELECTION.getDefaultRecommendation(getSelectedProductCategory());
        if (recommendation && !recommendation.isEstimate) {
          setInputValue("selectedRangeId", recommendation.rangeId || "");
          setInputValue("selectedColour", recommendation.selectionMode === "range_then_colour" ? (recommendation.colour || "") : "");
          setInputValue("productSelectionMode", recommendation.selectionMode || "");
          setInputValue("selectedProduct", recommendation.id || "");
        } else {
          setInputValue("selectedRangeId", "");
          setInputValue("selectedColour", "");
          setInputValue("productSelectionMode", "");
          setInputValue("selectedProduct", "");
        }
      }

      if (settings.track) {
        const eventName = nextMode === "recommend"
          ? "product_choice_recommend"
          : "product_selection_mode";
        trackProductSelectionMode(eventName, {
          category: getSelectedProductCategory()
        });
      }
    }

    function setSelectedRange(rangeId, options) {
      const settings = Object.assign({ persist: false, track: false }, options || {});
      const category = getSelectedProductCategory();
      const rangeRecord = getRangeRecordById(category, rangeId);

      setInputValue("selectedRangeId", rangeId || "");

      if (!rangeRecord) {
        setInputValue("selectedProduct", "");
        setInputValue("selectedColour", "");
        setInputValue("productSelectionMode", "");
        return;
      }

      setInputValue("productSelectionMode", rangeRecord.selectionMode || "");

      if (rangeRecord.selectionMode === "range_only") {
        setInputValue("selectedColour", "");
        const representative = PRODUCT_LIBRARY.getRepresentativeProductByRangeId(rangeId);
        setInputValue("selectedProduct", representative ? representative.id : "");
      } else if (!getInputValue("selectedColour")) {
        setInputValue("selectedProduct", "");
      }

      if (settings.persist && PRODUCT_SELECTION) {
        PRODUCT_SELECTION.saveSelection(getSelectionStateInput());
      }

      if (settings.track) {
        trackProductSelectionMode("product_range_select", {
          category: category,
          range_id: rangeId,
          range_label: rangeRecord.rangeLabel
        });
      }
    }

    function setSelectedColourValue(colour, options) {
      const settings = Object.assign({ persist: false, track: false }, options || {});
      setInputValue("selectedColour", colour || "");
      const resolved = syncSelectionFieldsFromResolved();

      if (settings.persist && PRODUCT_SELECTION) {
        PRODUCT_SELECTION.saveSelection(getSelectionStateInput());
      }

      if (settings.track && resolved.product) {
        trackProductSelectionMode("product_colour_select", {
          category: resolved.category,
          range_id: resolved.rangeId,
          colour: resolved.selectedColour || ""
        });
      }
    }

    function setSelectedProductById(productId, options) {
      const settings = Object.assign({ persist: true, track: false, choiceMode: "choose_range" }, options || {});
      const product = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getProductById(productId) : null;
      if (!product) {
        return;
      }

      setInputValue("selectedProductCategory", product.category || getSelectedProductCategory());
      setInputValue("selectedRangeId", product.rangeId || "");
      setInputValue("selectedColour", product.selectionMode === "range_then_colour" ? (product.colour || "") : "");
      setInputValue("productSelectionMode", product.selectionMode || "");
      setInputValue("selectedProduct", product.selectionMode === "range_only"
        ? ((PRODUCT_LIBRARY.getRepresentativeProductByRangeId(product.rangeId) || product).id)
        : product.id);
      setProductChoiceMode(settings.choiceMode || "choose_range", { track: false });
      syncSelectionFieldsFromResolved();

      if (PRODUCT_LIBRARY) {
        PRODUCT_LIBRARY.saveSelectedCategory(product.category);
        if (settings.persist && PRODUCT_SELECTION) {
          PRODUCT_SELECTION.saveSelection(getSelectionStateInput());
        }
      }

      if (settings.track && window.OperonTracking) {
        const trackingPayload = {
          category: product.category,
          brand: product.brand,
          range: product.rangeLabel || product.range,
          colour: product.selectionMode === "range_then_colour" ? product.colour : "",
          pricePerM2: product.pricePerM2,
          source: "quote_wizard"
        };
        if (typeof window.OperonTracking.trackProductSelect === "function") {
          window.OperonTracking.trackProductSelect(trackingPayload);
        } else {
          window.OperonTracking.trackEvent("product_selected", trackingPayload);
          window.OperonTracking.trackEvent("product_select", trackingPayload);
        }
      }
    }

    function clearSpecificProductSelection() {
      setProductChoiceMode("recommend", { track: false });
      syncSelectionFieldsFromResolved();
      PRODUCT_LIBRARY.saveSelectedCategory(getSelectedProductCategory());
      state.productHandoffActive = false;
    }

    function buildProductChoiceCards() {
      const showProductChoicePanel = shouldShowProductChoicePanel();
      if (productChoicePanel) {
        productChoicePanel.hidden = !showProductChoicePanel;
      }
      if (!showProductChoicePanel) {
        if (productRangeField) {
          productRangeField.hidden = true;
          productRangeField.setAttribute("aria-hidden", "true");
        }
        if (productColourField) {
          productColourField.hidden = true;
          productColourField.setAttribute("aria-hidden", "true");
        }
        if (productOptionField) {
          productOptionField.hidden = true;
          productOptionField.setAttribute("aria-hidden", "true");
        }
        if (selectedProductBanner) {
          selectedProductBanner.hidden = true;
        }
        return;
      }

      setActiveCards("[data-product-choice-mode]", getProductChoiceMode(), "data-product-choice-mode");
    }

    function buildProductRangeSelect() {
      const category = getSelectedProductCategory();
      const ranges = PRODUCT_SELECTION ? PRODUCT_SELECTION.getRangesByCategory(category) : [];
      const selectedRangeId = getInputValue("selectedRangeId");
      const currentChoiceMode = getProductChoiceMode();
      const showRangeField = currentChoiceMode === "choose_range";
      productRangeField.hidden = !showRangeField;
      productRangeField.setAttribute("aria-hidden", showRangeField ? "false" : "true");

      if (!showRangeField) {
        return;
      }

      if (!ranges.length) {
        productRangeSelect.innerHTML = '<option value="">No live ranges available yet</option>';
        productRangeSelect.disabled = true;
        productRangeHelper.textContent = "Range can be confirmed later.";
        return;
      }

      productRangeSelect.disabled = false;
      productRangeSelect.innerHTML = ['<option value="">Select range</option>'].concat(ranges.map(function (range) {
        const label = range.rangeLabel + (range.selectionMode === "range_only" ? " · colour to confirm later" : "");
        return '<option value="' + escapeHtml(range.rangeId) + '"' + (selectedRangeId === range.rangeId ? " selected" : "") + '>' + escapeHtml(label) + "</option>";
      })).join("");

      productRangeHelper.textContent = category === "engineered"
        ? "Choose range, then colour."
        : "Choose range now. Colour can be confirmed later.";
    }

    function buildProductColourSelect() {
      const category = getSelectedProductCategory();
      const rangeId = getInputValue("selectedRangeId");
      const rangeRecord = getRangeRecordById(category, rangeId);
      const selectedColour = getInputValue("selectedColour");
      const showColourField = getProductChoiceMode() === "choose_range"
        && rangeRecord
        && rangeRecord.selectionMode === "range_then_colour";

      productColourField.hidden = !showColourField;
      productColourField.setAttribute("aria-hidden", showColourField ? "false" : "true");

      if (!showColourField) {
        return;
      }

      const colours = PRODUCT_SELECTION ? PRODUCT_SELECTION.getColoursByRange(rangeId) : [];
      productColourSelect.innerHTML = ['<option value="">Select colour</option>'].concat(colours.map(function (colourItem) {
        return '<option value="' + escapeHtml(colourItem.colour) + '"' + (selectedColour === colourItem.colour ? " selected" : "") + '>' + escapeHtml(colourItem.colour) + "</option>";
      })).join("");
      productColourSelect.disabled = !colours.length;
      productColourHelper.textContent = colours.length
        ? "Choose colour if known."
        : "Colour can be reviewed later.";
    }

    function buildProductOptionSelect() {
      if (!shouldShowProductChoicePanel()) {
        if (productOptionField) {
          productOptionField.hidden = true;
          productOptionField.setAttribute("aria-hidden", "true");
        }
        productOptionSelect.innerHTML = '<option value="">No specific product attached</option>';
        return;
      }

      const resolvedSelection = getResolvedQuoteSelection();
      const handoffProductId = state.productHandoffActive ? getInputValue("selectedProduct") : "";
      const handoffProduct = handoffProductId ? PRODUCT_LIBRARY.getProductById(handoffProductId) : null;
      const shouldShowSpecificField = !!(handoffProduct && handoffProduct.selectionMode === "range_then_colour");

      if (productOptionField) {
        productOptionField.hidden = !shouldShowSpecificField;
        productOptionField.setAttribute("aria-hidden", shouldShowSpecificField ? "false" : "true");
      }

      if (!shouldShowSpecificField) {
        productOptionSelect.innerHTML = '<option value="">No specific product attached</option>';
        productOptionHelper.textContent = "";
        return;
      }

      productOptionSelect.innerHTML = '<option value="' + escapeHtml(handoffProduct.id) + '">' + escapeHtml(PRODUCT_LIBRARY.getProductLabel(handoffProduct)) + "</option>";
      productOptionSelect.value = resolvedSelection.productId || handoffProduct.id;
      productOptionHelper.textContent = "";
    }

    function renderSelectedProductBanner() {
      if (!selectedProductBanner) {
        return;
      }

      if (!shouldShowSelectedProductBanner()) {
        selectedProductBanner.hidden = true;
        return;
      }

      selectedProductBanner.hidden = false;
      syncSelectedProductState();
      const selection = getResolvedQuoteSelection();
      const category = selection.category || getSelectedProductCategory();
      const categoryMeta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(category) : null;
      const rangeRecord = getRangeRecordById(category, selection.rangeId);
      const product = selection.product;
      const choiceMode = selection.choiceMode;

      browseCategoryLink.setAttribute("href", getCategoryPageUrl(category));
      browseCategoryLink.dataset.behavior = "";
      browseCategoryLink.textContent = "View " + ((categoryMeta ? categoryMeta.label : "products").toLowerCase());

      if (choiceMode === "recommend") {
        selectedProductHeadline.textContent = "Recommended starting option";
        selectedProductSummary.textContent = product
          ? "Using " + (product.rangeLabel || PRODUCT_LIBRARY.getProductLabel(product)) + " for this estimate. Colour and final product can be reviewed later."
          : "We’ll use the " + getCategoryEstimateLabel(category) + " until a practical range is chosen.";
        browseCategoryLink.textContent = "Change range";
        browseCategoryLink.dataset.behavior = "change-range";
        clearSelectedProductButton.textContent = "Use practical range estimate instead";
        clearSelectedProductButton.hidden = false;
        return;
      }

      if (!selection.rangeId) {
        selectedProductHeadline.textContent = "Practical range estimate";
        selectedProductSummary.textContent = "Using the " + getCategoryEstimateLabel(category) + ". Final product and colour can be reviewed later.";
        clearSelectedProductButton.textContent = "Using practical range estimate";
        clearSelectedProductButton.hidden = true;
        return;
      }

      if (selection.selectionMode === "range_then_colour" && product) {
        selectedProductHeadline.textContent = "Selected engineered timber";
        selectedProductSummary.textContent = "Using " + (product.rangeLabel || product.range || "") + " — " + (product.colour || "") + ".";
        browseCategoryLink.textContent = "Change range";
        browseCategoryLink.dataset.behavior = "change-range";
        clearSelectedProductButton.textContent = "Use practical range estimate instead";
        clearSelectedProductButton.hidden = false;
        return;
      }

      selectedProductHeadline.textContent = "Selected product range";
      selectedProductSummary.textContent = "Using " + (rangeRecord ? rangeRecord.rangeLabel : (product ? (product.rangeLabel || product.range) : "selected range")) + ". Colour can be confirmed later.";
      browseCategoryLink.textContent = "Change range";
      browseCategoryLink.dataset.behavior = "change-range";
      clearSelectedProductButton.textContent = "Use practical range estimate instead";
      clearSelectedProductButton.hidden = false;
    }

    function renderMeasurementHelper() {
      const measurement = getMeasurementState();
      const savedFloorplanArea = parsePositiveNumber(
        localStorage.getItem(FLOORPLAN_CONFIRMED_AREA_KEY) || localStorage.getItem(FLOORPLAN_AREA_KEY)
      );
      const pills = [];

      if (measurement.method === "manual_total") {
        if (measurement.realArea > 0) {
          measurementHelperTitle.textContent = "Current area is ready to use";
          measurementHelperText.textContent = "Continue with this area or switch method.";
          pills.push('<span class="pill good">' + formatArea(measurement.realArea) + " entered</span>");
        } else {
          measurementHelperTitle.textContent = "Fastest way to keep the quote moving";
          measurementHelperText.textContent = "Enter the approximate flooring area.";
          pills.push('<span class="pill">Quick estimate path</span>');
        }
      } else if (measurement.method === "room_by_room") {
        if (measurement.realArea > 0) {
          measurementHelperTitle.textContent = "Room-by-room total updates live";
          measurementHelperText.textContent = "Add each flooring room.";
          pills.push('<span class="pill good">' + measurement.validRoomCount + " valid rooms</span>");
          pills.push('<span class="pill good">' + formatArea(measurement.realArea) + " total</span>");
        } else {
          measurementHelperTitle.textContent = "Add one room to start the running total";
          measurementHelperText.textContent = "Use approximate room sizes.";
          pills.push('<span class="pill">Best for partial measurements</span>');
        }
      } else if (measurement.method === "unknown") {
        measurementHelperTitle.textContent = "Measurement can be confirmed in the next step";
        measurementHelperText.textContent = "Choose the next best area path.";
        pills.push('<span class="pill warn">Estimate pending measurement</span>');
        if (measurement.nextStepRequired) {
          pills.push('<span class="pill">' + escapeHtml(getUnknownMeasurementNextStepLabel(measurement.nextStepRequired)) + "</span>");
        }
      } else {
        if (measurement.realArea > 0) {
          measurementHelperTitle.textContent = "Floor plan area is ready to use";
          measurementHelperText.textContent = "Review the measured area and continue.";
          pills.push('<span class="pill good">' + formatArea(measurement.realArea) + " confirmed</span>");
        } else if (savedFloorplanArea > 0) {
          measurementHelperTitle.textContent = "Saved floor plan area found";
          measurementHelperText.textContent = "Use the saved area or re-open the tool.";
          pills.push('<span class="pill warn">' + formatArea(savedFloorplanArea) + " available</span>");
        } else {
          measurementHelperTitle.textContent = "Use the floor plan tool when exact area is harder";
          measurementHelperText.textContent = "Trace rooms and send the area back here.";
          pills.push('<span class="pill">Best for plans and complex layouts</span>');
        }
      }

      measurementSnapshot.innerHTML = pills.join("");
    }

    function getSelectedProduct() {
      const selection = getResolvedQuoteSelection();
      if (selection.product && PRODUCT_LIBRARY) {
        return Object.assign({ label: PRODUCT_LIBRARY.getProductLabel(selection.product) }, selection.product);
      }

      const estimate = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getEstimateProduct(selection.category) : null;
      return estimate || {
        id: "hybrid-estimate",
        category: selection.category || "hybrid",
        brand: "Operon Estimate",
        range: "Hybrid Flooring",
        colour: "Standard estimate",
        pricePerM2: 0,
        installRate: null,
        isEstimate: true,
        label: "Hybrid Flooring Estimate"
      };
    }

    // Measurement logic.
    function getMeasurementState() {
      const method = getInputValue("measurementMethod");
      const warnings = [];
      const unknownSelection = getUnknownMeasurementSelection();
      const roomAreas = state.rooms.map(function (room) {
        return {
          id: room.id,
          name: room.name || "Room",
          area: parsePositiveNumber(room.length) * parsePositiveNumber(room.width)
        };
      });
      const validRooms = roomAreas.filter(function (room) {
        return room.area > 0;
      });

      let realArea = 0;
      let roomCount = 0;
      let sourceLabel = "Manual total";
      let measurementStatus = "known";
      let estimateReady = true;
      let quoteConfidence = "medium";

      if (method === "manual_total") {
        realArea = parsePositiveNumber(getInputValue("totalAreaM2"));
        roomCount = 0;
        sourceLabel = "Manual total";
        if (!realArea) {
          warnings.push("Total area is missing.");
        }
      } else if (method === "room_by_room") {
        realArea = validRooms.reduce(function (sum, room) {
          return sum + room.area;
        }, 0);
        roomCount = validRooms.length;
        sourceLabel = "Room by room";
        if (!realArea) {
          warnings.push("Add at least one valid room measurement.");
        }
      } else if (method === "unknown") {
        realArea = 0;
        roomCount = 0;
        sourceLabel = "Measurement pending";
        measurementStatus = "unknown";
        estimateReady = false;
        quoteConfidence = "low";
        if (!unknownSelection.nextStepRequired) {
          warnings.push("Choose how you want to keep moving: site assessment, floor plan lookup, or product discovery.");
        }
      } else {
        realArea = parsePositiveNumber(getInputValue("confirmedFloorplanArea"));
        roomCount = 0;
        sourceLabel = "Floor plan tool";
        if (!realArea) {
          warnings.push("Measured floor plan area is still missing.");
        }
      }

      return {
        method: method,
        sourceLabel: sourceLabel,
        realArea: roundTo(realArea, 2),
        roomCount: roomCount,
        validRoomCount: validRooms.length,
        uploadedFileName: state.floorplanFileName,
        measurementStatus: measurementStatus,
        estimateReady: estimateReady,
        quoteConfidence: quoteConfidence,
        nextStepRequired: unknownSelection.nextStepRequired,
        lookupAddress: unknownSelection.lookupAddress,
        warnings: warnings
      };
    }

    function getWastageFactor() {
      return PRICING_RULES ? PRICING_RULES.getWastageMultiplier(getInputValue("patternType")) : 1.10;
    }

    function getDeliveryEmailAddress(input) {
      const source = input || getFormInput();
      return String(source.email || source.quoteDeliveryEmail || "").trim();
    }

    function validateQuoteInput(input, options) {
      const settings = Object.assign({ requireDeliveryEmail: false }, options || {});
      const errors = [];
      if (settings.requireDeliveryEmail && !getInputValue("fullName").trim()) errors.push("Name is required.");
      const emailValue = getDeliveryEmailAddress(input);
      if (emailValue && !/.+@.+\..+/.test(emailValue)) errors.push("Email format looks invalid.");
      if (settings.requireDeliveryEmail && !emailValue) errors.push("Please enter an email address to receive a copy of the estimate.");
      if (!getInputValue("siteAddress").trim() && !(getInputValue("suburb").trim() && getInputValue("postcode").trim())) {
        errors.push("Please enter suburb and postcode, or add the site address under Optional site details.");
      }
      if (!getInputValue("postcode").trim()) errors.push("Postcode is required.");

      const measurement = getMeasurementState();
      if (measurement.measurementStatus !== "unknown" && !measurement.realArea) {
        errors.push("Area is required before sending the quote request.");
      }
      if (measurement.measurementStatus === "unknown" && !measurement.nextStepRequired) {
        errors.push("Please choose the next step for measurement before sending the quote request.");
      }

      if (input.furnitureDecision === "yes" && shouldShowFurnitureRoomCount(input.furnitureType) && !Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount)))) {
        errors.push("Please enter how many furnished rooms need to be moved.");
      }

      if (input.doorDecision === "yes" && input.doorTrimming === "yes" && !Math.max(0, Math.round(parsePositiveNumber(input.doorCount)))) {
        errors.push("Door quantity is required when door trimming is selected.");
      }

      return errors;
    }

    function getQuoteSummaryConsistencyIssues(input, result) {
      const issues = [];
      const measurement = getMeasurementState();
      const selectedCategory = getSelectedProductCategory();
      const selectedProductId = getInputValue("selectedProduct");
      const selectedProduct = PRODUCT_LIBRARY && selectedProductId ? PRODUCT_LIBRARY.getProductById(selectedProductId) : null;

      if (!input.quoteMode) {
        issues.push("Choose whether this quote is supply and install or installation only.");
      }

      if (!isValidProductCategory(selectedCategory)) {
        issues.push("Choose the flooring category before continuing.");
      }

      if (selectedProductId && !selectedProduct) {
        issues.push("The saved flooring product is no longer available. Re-select the product or use the practical range estimate.");
      }

      if (selectedProduct && selectedProduct.category !== selectedCategory) {
        issues.push("The selected flooring product does not match the current category. Re-select the product or switch the category back.");
      }

      if (measurement.measurementStatus !== "unknown" && !(result && result.realArea > 0)) {
        issues.push("Add a valid flooring area before sending the quote request.");
      }

      return issues;
    }

    // Quote Step Validation
    function validateCurrentQuoteStep() {
      const measurement = getMeasurementState();
      const input = getFormInput();

      if (currentQuoteStep === 0) {
        const hasSiteAddress = !!getInputValue("siteAddress").trim();
        const hasSuburb = !!getInputValue("suburb").trim();
        const hasPostcode = !!getInputValue("postcode").trim();
        const hasSuburbPostcode = hasSuburb && hasPostcode;

        if (!hasSiteAddress && !hasSuburbPostcode) {
          if (hasSuburb && !hasPostcode) {
            return { valid: false, message: "Please enter the postcode for this suburb. The postcode field is editable." };
          }
          if (!hasSuburb && hasPostcode) {
            return { valid: false, message: "Please enter the suburb for this postcode." };
          }
          return { valid: false, message: "Please enter suburb and postcode, or add the site address under Optional site details." };
        }
        if (!getInputValue("propertyType")) {
          return { valid: false, message: "Please choose the property type." };
        }
        return { valid: true, message: "" };
      }

      if (currentQuoteStep === 1) {
        if (!getInputValue("quoteMode")) {
          return { valid: false, message: "Please choose a quote mode." };
        }
        if (!getInputValue("selectedProductCategory")) {
          return { valid: false, message: "Please choose a flooring category." };
        }
        if (getProductChoiceMode() === "choose_range") {
          if (productRangeSelect.disabled) {
            return { valid: false, message: "Live product ranges are not published for this category yet. Use the recommendation for now." };
          }
          if (!getInputValue("selectedRangeId")) {
            return { valid: false, message: "Please choose a product range." };
          }
          if (getInputValue("productSelectionMode") === "range_then_colour" && !getInputValue("selectedColour")) {
            return { valid: false, message: "Please choose the engineered timber colour." };
          }
        }
        if (getSelectedProductCategory() === "engineered" && !getInputValue("patternType")) {
          return { valid: false, message: "Please choose a flooring pattern." };
        }
        if (getSelectedProductCategory() === "engineered"
          && getInputValue("patternType") === "standard"
          && !getInputValue("installMethod")) {
          return { valid: false, message: "Please choose the engineered timber installation method." };
        }
        return { valid: true, message: "" };
      }

      if (currentQuoteStep === 2) {
        if (!getInputValue("measurementMethod")) {
          return { valid: false, message: "Please choose a measurement method." };
        }
        if (measurement.measurementStatus === "unknown") {
          if (!measurement.nextStepRequired) {
            return { valid: false, message: "Choose whether you want a site assessment, floor plan lookup, or product discovery next." };
          }
          return { valid: true, message: "" };
        }
        if (!(measurement.realArea > 0)) {
          if (input.measurementMethod === "floorplan_upload") {
            return { valid: false, message: "Please enter an area or use the floor plan tool first." };
          }
          return { valid: false, message: "Please enter a valid flooring area before continuing." };
        }
        return { valid: true, message: "" };
      }

      if (currentQuoteStep === 3) {
        if (!getInputValue("stairs")) {
          return { valid: false, message: "Please choose whether the project includes stairs." };
        }
        return { valid: true, message: "" };
      }

      if (currentQuoteStep === 4) {
        if (input.removalDecision === "yes" && isRemovalSelected(input.existingFloorToRemove) && !input.removalDisposal) {
          return { valid: false, message: "Please choose whether disposal of removed flooring is included." };
        }
        if (input.furnitureDecision === "yes" && shouldShowFurnitureRoomCount(input.furnitureType) && !Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount)))) {
          return { valid: false, message: "Please enter how many furnished rooms need to be moved." };
        }
        if (input.doorDecision === "yes" && input.doorTrimming === "yes" && !Math.max(0, Math.round(parsePositiveNumber(input.doorCount)))) {
          return { valid: false, message: "Please enter the door quantity." };
        }
        return { valid: true, message: "" };
      }

      if (currentQuoteStep === 5) {
        const errors = validateQuoteInput(input);
        const summaryIssues = getQuoteSummaryConsistencyIssues(input, getCurrentQuoteResult());
        return {
          valid: errors.length === 0 && summaryIssues.length === 0,
          message: errors[0] || summaryIssues[0] || ""
        };
      }

      return { valid: true, message: "" };
    }

    function buildQuoteCalculationInput(input) {
      const measurement = getMeasurementState();
      const selection = getResolvedQuoteSelection();
      return {
        quoteMode: input.quoteMode,
        jobType: input.quoteMode,
        realArea: measurement.realArea,
        roomCount: measurement.roomCount,
        productId: selection.productId,
        selectedRangeId: selection.rangeId,
        productSelectionMode: selection.selectionMode,
        selectedColour: selection.selectedColour,
        category: selection.category,
        pattern: input.patternType,
        installMethod: input.installMethod,
        underlayId: getInputValue("underlayId"),
        skirtingOption: input.skirtingType,
        scotiaOption: input.scotiaType,
        removal: input.removalDecision,
        removalOption: input.existingFloorToRemove,
        disposal: input.removalDisposal,
        removalDisposal: input.removalDisposal,
        floorPrep: input.floorPrepDecision,
        suburb: getInputValue("suburb").trim(),
        postcode: getInputValue("postcode").trim(),
        propertyType: input.propertyType,
        level: input.level,
        hasLift: input.hasLift,
        parkingAccess: input.parkingAccess,
        stairs: input.stairs,
        stairsCount: input.stairsCount,
        stairDetails: input.stairDetails,
        stairWidthKnown: input.stairWidthKnown,
        stairWidthMm: input.stairWidthMm,
        furnitureRoomCount: input.furnitureRoomCount,
        floorPrepType: input.floorPrepType,
        moistureBarrier: input.moistureBarrier,
        furnitureType: shouldShowFurnitureRoomCount(input.furnitureType) ? "yes" : "no",
        furnishingLevel: input.furnitureType,
        doorTrimming: input.doorTrimming,
        doorCount: input.doorCount,
        existingFloorToRemove: input.existingFloorToRemove,
        existingFloorType: input.existingFloorToRemove,
        subfloorCondition: input.subfloorCondition,
        underfloorHeating: input.underfloorHeating,
        measurementMethod: input.measurementMethod,
        floorplanFileName: input.floorplanFileName,
        measurementWarnings: measurement.warnings,
        measurementSource: measurement.sourceLabel
      };
    }

    // Pricing engine.
    function calculateQuote(input) {
      const measurement = getMeasurementState();
      if (!QUOTE_CALCULATOR) {
        return {
          quoteMode: input.quoteMode,
          realArea: roundTo(measurement.realArea, 2),
          chargeableArea: roundTo(measurement.realArea * getWastageFactor(), 2),
          materialTotal: 0,
          installationTotal: 0,
          installationAdjustedTotal: 0,
          removalTotal: 0,
          disposalTotal: 0,
          floorPrepTotal: 0,
          underlayTotal: 0,
          moistureBarrierTotal: 0,
          skirtingTotal: 0,
          scotiaTotal: 0,
          furnitureTotal: 0,
          doorTrimmingTotal: 0,
          travelFeeTotal: 0,
          locationTotal: 0,
          labourSubtotalBeforeMultipliers: 0,
          labourSubtotalAfterMultipliers: 0,
          subtotalExGst: 0,
          gst: 0,
          totalIncGst: 0,
          zoneName: "Default Sydney Zone",
          minimumChargeApplied: false,
          minimumJobFee: 0,
          roundingAdjustment: 0,
          accessFactor: 1,
          smallJobFactor: 1,
          zoneMultiplier: 1,
          locationSurchargePercent: 0,
          roomCount: measurement.roomCount,
          furnitureRoomCount: Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount))),
          doorCount: 0,
          quoteLines: [],
          manualReviewRequired: true,
          warnings: ["Quote calculator is not available."],
          productCategory: getSelectedProductCategory(),
          productLabel: "Practical range estimate",
          measurementSource: measurement.sourceLabel,
          pricePending: false,
          pricingMode: "fallback",
          disclaimer: "Estimate only — final quote confirmed after review and site check."
        };
      }

      const result = QUOTE_CALCULATOR.calculateQuote(buildQuoteCalculationInput(input));
      result.calculationSource = "local_quote_calculator";
      return result;
    }

    function buildPendingMeasurementQuote(input) {
      const measurement = getMeasurementState();
      const selection = getResolvedQuoteSelection();
      const categoryMeta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(selection.category) : null;
      const selectedProduct = getSelectedProduct();
      const nextStepLabel = getUnknownMeasurementNextStepLabel(measurement.nextStepRequired);

      return {
        quoteMode: input.quoteMode,
        realArea: 0,
        chargeableArea: 0,
        materialTotal: 0,
        installationTotal: 0,
        installationAdjustedTotal: 0,
        removalTotal: 0,
        disposalTotal: 0,
        floorPrepTotal: 0,
        underlayTotal: 0,
        moistureBarrierTotal: 0,
        skirtingTotal: 0,
        scotiaTotal: 0,
        furnitureTotal: 0,
        doorTrimmingTotal: 0,
        travelFeeTotal: 0,
        locationTotal: 0,
        labourSubtotalBeforeMultipliers: 0,
        labourSubtotalAfterMultipliers: 0,
        subtotalExGst: 0,
        gst: 0,
        totalIncGst: 0,
        zoneName: "Measurement pending",
        minimumChargeApplied: false,
        minimumJobFee: 0,
        roundingAdjustment: 0,
        accessFactor: 1,
        smallJobFactor: 1,
        zoneMultiplier: 1,
        locationSurchargePercent: 0,
        roomCount: 0,
        furnitureRoomCount: Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount))),
        doorCount: 0,
        quoteLines: [],
        manualReviewRequired: true,
        warnings: measurement.warnings || [],
        productCategory: selection.category || getSelectedProductCategory(),
        productLabel: PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getProductLabel(selectedProduct) : ((categoryMeta ? categoryMeta.label : "Flooring") + " estimate"),
        measurementSource: measurement.sourceLabel,
        pricePending: true,
        pricingMode: selectedProduct && selectedProduct.pricePerM2 > 0 ? "product" : "category",
        disclaimer: "Estimate pending measurement",
        calculationSource: "measurement_pending",
        measurementStatus: measurement.measurementStatus,
        estimateReady: measurement.estimateReady,
        quoteConfidence: measurement.quoteConfidence,
        nextStepRequired: measurement.nextStepRequired,
        nextStepLabel: nextStepLabel
      };
    }

    function canUseBackendQuoteRuntime() {
      return state.backendQuoteRuntimeAvailable
        && (typeof window.fetch === "function" || typeof window.XMLHttpRequest === "function")
        && window.location.protocol !== "file:";
    }

    function canUseLocalQuoteCalculatorFallback() {
      return !!QUOTE_CALCULATOR && (window.location.protocol === "file:" || isSimpleLocalPreview());
    }

    function normalizeBackendQuoteLine(line) {
      const source = line && typeof line === "object" ? line : {};
      const amount = Number(source.amount || source.total || 0);
      const quantity = source.quantity || source.qty || "";
      return {
        label: source.label || "Quote item",
        note: source.note || "",
        quantity: quantity,
        qty: quantity,
        amount: amount,
        total: amount
      };
    }

    function adaptBackendQuoteResult(payload, input) {
      const source = payload && typeof payload === "object" ? payload : {};
      const request = buildQuoteCalculationInput(input);
      const measurement = getMeasurementState();
      const selection = getResolvedQuoteSelection();
      const categoryMeta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(selection.category || source.productCategory || source.category) : null;
      const selectedProduct = getSelectedProduct();
      const quoteLines = Array.isArray(source.quoteLines) && source.quoteLines.length
        ? source.quoteLines.map(normalizeBackendQuoteLine)
        : (Array.isArray(source.lineItems) ? source.lineItems.map(normalizeBackendQuoteLine) : []);
      const totalIncGst = Number(source.totalIncGst || source.estimateTotal || 0);
      const subtotalExGst = Number(source.subtotalExGst || (totalIncGst > 0 ? totalIncGst / 1.1 : 0));
      const gst = Number(source.gst || (totalIncGst > 0 ? totalIncGst - subtotalExGst : 0));
      const warnings = Array.isArray(source.itemsToConfirm) && source.itemsToConfirm.length
        ? source.itemsToConfirm.slice()
        : (Array.isArray(source.warnings) ? source.warnings.slice() : []);
      const pricingMode = source.pricingMode || (selectedProduct && !selectedProduct.isEstimate ? "product" : "category");
      const realArea = Number(source.realArea || request.realArea || measurement.realArea || 0);
      const chargeableArea = Number(source.chargeableArea || (request.quoteMode === "install_only" ? realArea : realArea));

      return {
        quoteMode: source.quoteMode || request.quoteMode || input.quoteMode,
        productId: source.productId || request.productId || "",
        productLabel: source.productLabel || (PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getProductLabel(selectedProduct) : "Flooring estimate"),
        productCategory: source.productCategory || source.category || selection.category || getSelectedProductCategory(),
        category: source.category || source.productCategory || selection.category || getSelectedProductCategory(),
        categoryEstimateLabel: source.categoryEstimateLabel || (categoryMeta ? "standard " + categoryMeta.label.toLowerCase() + " estimate" : "category estimate"),
        zoneName: source.zoneName || "Sydney service area",
        pattern: source.pattern || request.pattern || "standard",
        installMethod: source.installMethod || request.installMethod || "floating",
        realArea: roundTo(realArea, 2),
        chargeableArea: roundTo(chargeableArea, 2),
        materialTotal: 0,
        installationTotal: 0,
        installationAdjustedTotal: 0,
        removalTotal: 0,
        disposalTotal: 0,
        floorPrepTotal: 0,
        underlayTotal: 0,
        moistureBarrierTotal: 0,
        skirtingTotal: 0,
        scotiaTotal: 0,
        furnitureTotal: 0,
        doorTrimmingTotal: 0,
        stairsTotal: 0,
        travelFeeTotal: 0,
        locationTotal: 0,
        subtotalExGst: roundTo(subtotalExGst, 2),
        gst: roundTo(gst, 2),
        totalIncGst: roundTo(totalIncGst, 2),
        roomCount: Number(source.roomCount || request.roomCount || measurement.roomCount || 0),
        furnitureRoomCount: Math.max(0, Math.round(parsePositiveNumber(input.furnitureRoomCount))),
        doorCount: Math.max(0, Math.round(parsePositiveNumber(input.doorCount))),
        quoteLines: quoteLines,
        manualReviewRequired: source.manualReviewRequired === true || source.estimateStatus === "review_needed" || warnings.length > 0,
        warnings: warnings,
        productCategoryLabel: categoryMeta ? categoryMeta.label : "",
        measurementSource: source.measurementSource || measurement.sourceLabel,
        pricePending: source.pricePending === true || source.estimateStatus === "pending",
        pricingMode: pricingMode,
        quoteConfidence: source.quoteConfidence || "",
        disclaimer: source.disclaimer || "Estimate only. Final scope is reviewed before a fixed installation price is confirmed.",
        calculationSource: source.source || "server_backend_pricing"
      };
    }

    function buildBackendUnavailableQuote(input) {
      const measurement = getMeasurementState();
      const selection = getResolvedQuoteSelection();
      const categoryMeta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(selection.category) : null;
      const selectedProduct = getSelectedProduct();
      return {
        quoteMode: input.quoteMode,
        realArea: roundTo(measurement.realArea, 2),
        chargeableArea: roundTo(measurement.realArea, 2),
        subtotalExGst: 0,
        gst: 0,
        totalIncGst: 0,
        roomCount: measurement.roomCount,
        quoteLines: [],
        manualReviewRequired: true,
        warnings: ["Quote calculation is temporarily unavailable."],
        productCategory: selection.category || getSelectedProductCategory(),
        category: selection.category || getSelectedProductCategory(),
        productLabel: PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getProductLabel(selectedProduct) : ((categoryMeta ? categoryMeta.label : "Flooring") + " estimate"),
        measurementSource: measurement.sourceLabel,
        pricePending: true,
        pricingMode: "category",
        calculationSource: "backend_unavailable",
        disclaimer: "Estimate unavailable. Submit your details and Operon can review the quote manually."
      };
    }

    function postJson(endpoint, body) {
      const serializedBody = JSON.stringify(body);
      if (typeof window.fetch === "function") {
        return window.fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: serializedBody
        }).then(function (response) {
          return response.json().catch(function () {
            return null;
          }).then(function (payload) {
            return {
              ok: response.ok,
              status: response.status,
              payload: payload
            };
          });
        });
      }

      return new Promise(function (resolve, reject) {
        if (typeof window.XMLHttpRequest !== "function") {
          reject(new Error("Quote calculation runtime unavailable."));
          return;
        }

        const request = new XMLHttpRequest();
        request.open("POST", endpoint, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function () {
          let payload = null;
          try {
            payload = JSON.parse(request.responseText || "null");
          } catch (error) {
            payload = null;
          }
          resolve({
            ok: request.status >= 200 && request.status < 300,
            status: request.status,
            payload: payload
          });
        };
        request.onerror = function () {
          reject(new Error("Quote calculation runtime unavailable."));
        };
        request.send(serializedBody);
      });
    }

    function getBackendQuoteRequestSignature(requestBody) {
      try {
        return JSON.stringify(requestBody || {});
      } catch (error) {
        return "";
      }
    }

    async function fetchBackendQuote(input) {
      const requestBody = buildQuoteCalculationInput(input);
      const signature = getBackendQuoteRequestSignature(requestBody);
      if (signature && signature === state.backendQuoteCacheSignature && state.backendQuoteCacheResult) {
        return state.backendQuoteCacheResult;
      }
      if (signature && signature === state.backendQuoteInFlightSignature && state.backendQuoteInFlightPromise) {
        return state.backendQuoteInFlightPromise;
      }

      const requestPromise = postJson(CALCULATE_QUOTE_ENDPOINT, requestBody).then(function (response) {
        const payload = response.payload;
        if (!response.ok || !payload || payload.ok !== true) {
          const error = new Error(payload && payload.error ? payload.error : "Quote calculation runtime unavailable.");
          error.status = response.status;
          throw error;
        }
        const adapted = adaptBackendQuoteResult(payload, input);
        state.backendQuoteCacheSignature = signature;
        state.backendQuoteCacheResult = adapted;
        return adapted;
      }).finally(function () {
        if (state.backendQuoteInFlightSignature === signature) {
          state.backendQuoteInFlightSignature = "";
          state.backendQuoteInFlightPromise = null;
        }
      });

      state.backendQuoteInFlightSignature = signature;
      state.backendQuoteInFlightPromise = requestPromise;
      return requestPromise;
    }

    function canRunShadowQuoteComparison() {
      return isSimpleLocalPreview()
        && window.location.protocol !== "file:"
        && typeof window.fetch === "function"
        && !!QUOTE_CALCULATOR;
    }

    function getQuoteLineCount(result) {
      if (Array.isArray(result && result.quoteLines)) {
        return result.quoteLines.filter(function (line) {
          return Number(line && (line.amount || line.total) || 0) > 0;
        }).length;
      }
      if (Array.isArray(result && result.lineItems)) {
        return result.lineItems.filter(function (line) {
          return Number(line && (line.total || line.amount) || 0) > 0;
        }).length;
      }
      return 0;
    }

    function normalizeShadowConfidence(value) {
      const text = String(value || "").trim().toLowerCase();
      if (text === "high" || text === "medium" || text === "low" || text === "not_ready") {
        return text;
      }
      if (text === "not ready" || text === "estimate pending") {
        return "not_ready";
      }
      return text || "unknown";
    }

    function getFrontendShadowConfidence(input, result) {
      const state = getEstimateConfidenceState(getMeasurementState(), result, input);
      return normalizeShadowConfidence(state && state.label);
    }

    function getShadowQuoteComparisonSignature(input, frontendResult) {
      const request = buildQuoteCalculationInput(input);
      return JSON.stringify({
        quoteMode: request.quoteMode || request.jobType || "",
        category: request.category || "",
        productId: request.productId || "",
        selectedRangeId: request.selectedRangeId || "",
        realArea: Number(request.realArea || 0),
        pattern: request.pattern || "",
        installMethod: request.installMethod || "",
        removalOption: request.removalOption || "",
        removalDisposal: request.removalDisposal || "",
        floorPrepType: request.floorPrepType || "",
        stairs: request.stairs || "",
        frontendTotal: Number(frontendResult && frontendResult.totalIncGst || 0),
        frontendLineCount: getQuoteLineCount(frontendResult)
      });
    }

    async function logShadowQuoteComparison(input) {
      if (!canRunShadowQuoteComparison()) {
        return;
      }

      const frontendResult = calculateQuote(input);
      const signature = getShadowQuoteComparisonSignature(input, frontendResult);
      if (signature === state.lastShadowQuoteComparisonSignature) {
        return;
      }
      state.lastShadowQuoteComparisonSignature = signature;

      try {
        const response = await window.fetch(CALCULATE_QUOTE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(buildQuoteCalculationInput(input))
        });
        const payload = await response.json().catch(function () {
          return null;
        });
        if (!response.ok || !payload || payload.ok !== true) {
          return;
        }

        const frontendTotal = Number(frontendResult.totalIncGst || 0);
        const backendTotal = Number(payload.estimateTotal || 0);
        const comparison = {
          frontendTotal: roundTo(frontendTotal, 2),
          backendTotal: roundTo(backendTotal, 2),
          delta: roundTo(backendTotal - frontendTotal, 2),
          frontendLineItemCount: getQuoteLineCount(frontendResult),
          backendLineItemCount: getQuoteLineCount(payload),
          frontendConfidence: getFrontendShadowConfidence(input, frontendResult),
          backendConfidence: normalizeShadowConfidence(payload.quoteConfidence),
          backendEstimateStatus: payload.estimateStatus || ""
        };

        if (window.console && typeof window.console.info === "function") {
          console.info("[Operon quote shadow compare]", comparison);
        }
      } catch (error) {
        // Shadow comparison is local/dev-only and must not affect quote behaviour.
      }
    }

    function getPricingOptimizationRequest(result, input) {
      return {
        suburb: getInputValue("suburb").trim(),
        postcode: getInputValue("postcode").trim(),
        flooring_type: result.productCategory || input.productCategory || getSelectedProductCategory(),
        product_category: result.productCategory || getSelectedProductCategory(),
        real_area: result.realArea || 0,
        area_band: window.OperonPricingAdjustment && typeof window.OperonPricingAdjustment.getAreaBand === "function"
          ? window.OperonPricingAdjustment.getAreaBand(result.realArea || 0)
          : "",
        stairs_flag: input.stairs === "yes" || Number(input.stairsCount || 0) > 0
      };
    }

    function getPricingOptimizationSignature(request) {
      return [
        request.suburb,
        request.postcode,
        request.flooring_type,
        request.area_band,
        request.stairs_flag ? "stairs" : "no_stairs"
      ].join("|").toLowerCase();
    }

    async function fetchPricingOptimizationBucket(result, input) {
      if (!canUseLeadCaptureRuntime()) {
        return null;
      }

      const request = getPricingOptimizationRequest(result, input);
      const signature = getPricingOptimizationSignature(request);
      if (Object.prototype.hasOwnProperty.call(state.pricingOptimizationCache, signature)) {
        return state.pricingOptimizationCache[signature];
      }

      try {
        const response = await window.fetch(PRICING_OPTIMIZATION_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });
        const payload = await response.json().catch(function () {
          return null;
        });
        const bucket = response.ok && payload && payload.ok ? payload.bucket || null : null;
        state.pricingOptimizationCache[signature] = bucket;
        return bucket;
      } catch (error) {
        state.pricingOptimizationCache[signature] = null;
        return null;
      }
    }

    async function applyPricingOptimizationLayer(result, input) {
      if (!window.OperonPricingAdjustment || typeof window.OperonPricingAdjustment.applyAdjustment !== "function") {
        return result;
      }

      const bucket = await fetchPricingOptimizationBucket(result, input);
      const confidence = getEstimateConfidence(getMeasurementState(), result);
      const pricingAdjustment = window.OperonPricingAdjustment.applyAdjustment(result, {
        input: input,
        bucket: bucket,
        confidence: confidence
      });

      return Object.assign({}, result, {
        pricingAdjustment: pricingAdjustment
      });
    }

    async function refreshQuoteEstimate(options) {
      const config = options || {};
      const input = config.input || getFormInput();
      const requestToken = ++state.quoteRefreshToken;
      const measurement = getMeasurementState();
      if (measurement.measurementStatus === "unknown") {
        const pendingResult = buildPendingMeasurementQuote(input);
        state.currentQuoteResult = pendingResult;
        if (config.render !== false) {
          renderQuoteSummary(pendingResult);
        }
        return pendingResult;
      }
      if (!measurement.realArea) {
        const pendingResult = buildPendingMeasurementQuote(input);
        state.currentQuoteResult = pendingResult;
        if (config.render !== false) {
          renderQuoteSummary(pendingResult);
        }
        return pendingResult;
      }
      if (canUseBackendQuoteRuntime()) {
        try {
          const backendResult = await applyPricingOptimizationLayer(await fetchBackendQuote(input), input);
          if (requestToken !== state.quoteRefreshToken) {
            return state.currentQuoteResult || backendResult;
          }
          state.currentQuoteResult = backendResult;
          if (config.render !== false) {
            renderQuoteSummary(backendResult);
          }
          if (config.track !== false) {
            trackCalculatedQuote(backendResult);
          }
          logShadowQuoteComparison(input);
          return backendResult;
        } catch (error) {
          if (requestToken !== state.quoteRefreshToken) {
            return state.currentQuoteResult || (canUseLocalQuoteCalculatorFallback() ? calculateQuote(input) : buildBackendUnavailableQuote(input));
          }
          const isTransientBackendError = error && (error.status === 429 || error.status >= 500);
          if (!isTransientBackendError) {
            state.backendQuoteRuntimeAvailable = false;
          }
          if (canUseLocalQuoteCalculatorFallback()) {
            if (!state.backendQuoteFallbackLogged && window.console && typeof window.console.warn === "function") {
              state.backendQuoteFallbackLogged = true;
              console.warn("Backend quote runtime unavailable in local preview. Using local calculator fallback.");
            }
          } else if (!state.backendQuoteFallbackLogged && window.console && typeof window.console.warn === "function") {
            state.backendQuoteFallbackLogged = true;
            console.warn("Backend quote runtime unavailable. Local pricing fallback is disabled.");
          }
        }
      }

      const fallbackResult = canUseLocalQuoteCalculatorFallback()
        ? await applyPricingOptimizationLayer(calculateQuote(input), input)
        : buildBackendUnavailableQuote(input);
      if (requestToken !== state.quoteRefreshToken) {
        return state.currentQuoteResult || fallbackResult;
      }
      state.currentQuoteResult = fallbackResult;
      if (config.render !== false) {
        renderQuoteSummary(fallbackResult);
      }
      if (config.track !== false) {
        trackCalculatedQuote(fallbackResult);
      }
      logShadowQuoteComparison(input);
      return fallbackResult;
    }

    function getCurrentQuoteResult() {
      const measurement = getMeasurementState();
      if (measurement.measurementStatus === "unknown") {
        return state.currentQuoteResult || buildPendingMeasurementQuote(getFormInput());
      }
      return state.currentQuoteResult || (canUseLocalQuoteCalculatorFallback() ? calculateQuote(getFormInput()) : buildBackendUnavailableQuote(getFormInput()));
    }

    function getFormInput() {
      const existingFloorToRemove = normaliseRemovalFloorType(getInputValue("removalType") || getInputValue("existingFloorType"));
      return {
        fullName: getInputValue("fullName"),
        phone: getInputValue("phone"),
        email: getInputValue("email"),
        emailQuoteCopy: !!(emailQuoteCopyCheckbox && emailQuoteCopyCheckbox.checked),
        quoteDeliveryEmail: getInputValue("quoteDeliveryEmail"),
        siteAddress: getInputValue("siteAddress"),
        suburb: getInputValue("suburb"),
        quoteMode: getInputValue("quoteMode"),
        selectedProductCategory: getSelectedProductCategory(),
        selectedProduct: getInputValue("selectedProduct"),
        selectedRangeId: getInputValue("selectedRangeId"),
        selectedColour: getInputValue("selectedColour"),
        productSelectionMode: getInputValue("productSelectionMode"),
        productChoiceMode: getProductChoiceMode(),
        patternType: getInputValue("patternType"),
        installMethod: getInputValue("installMethod"),
        measurementMethod: getInputValue("measurementMethod"),
        unknownMeasurementNextStep: getInputValue("unknownMeasurementNextStep"),
        floorplanLookupAddress: getInputValue("floorplanLookupAddress"),
        floorplanFileName: state.floorplanFileName,
        totalAreaM2: getInputValue("totalAreaM2"),
        confirmedFloorplanArea: getInputValue("confirmedFloorplanArea"),
        postcode: String(getInputValue("postcode") || "").trim(),
        propertyType: getInputValue("propertyType"),
        level: getInputValue("level"),
        hasLift: getInputValue("hasLift"),
        parkingAccess: getInputValue("parkingAccess"),
        stairsChoice: getInputValue("stairs"),
        stairsCountRange: getInputValue("stairsCountRange"),
        stairsRequiresReview: getInputValue("stairsRequiresReview"),
        stairWidthKnown: getInputValue("stairWidthKnown"),
        stairWidthMm: getInputValue("stairWidthMm"),
        removalDecision: getInputValue("removalDecision"),
        floorPrepDecision: getInputValue("floorPrepDecision"),
        underlayDecision: getInputValue("underlayDecision"),
        finishDecision: getInputValue("finishDecision"),
        doorDecision: getInputValue("doorDecision"),
        furnitureDecision: getInputValue("furnitureDecision"),
        existingFloorToRemove: existingFloorToRemove,
        existingFloorType: existingFloorToRemove,
        removalType: existingFloorToRemove,
        removalDisposal: getInputValue("removalDisposal"),
        subfloorCondition: getInputValue("subfloorCondition"),
        floorPrepType: getInputValue("floorPrepType"),
        moistureBarrier: getInputValue("moistureBarrier"),
        underfloorHeating: getInputValue("underfloorHeating"),
        underlayId: getInputValue("underlayId"),
        skirtingType: getInputValue("skirtingType"),
        scotiaType: getInputValue("scotiaType"),
        furnitureType: getInputValue("furnitureType"),
        furnitureRoomCount: getInputValue("furnitureRoomCount"),
        doorTrimming: getInputValue("doorTrimming"),
        doorCount: getInputValue("doorCount"),
        stairs: getInputValue("stairs"),
        stairsCount: getInputValue("stairsCount"),
        stairDetails: getStairDetailsPayload()
      };
    }

    function readQuoteReviewHandoff() {
      const params = new URLSearchParams(window.location.search);
      const fromQuoteAdvisor = params.get("source") === "quote_review";
      if (!fromQuoteAdvisor) {
        return null;
      }

      try {
        const saved = unwrapStoredPayload(JSON.parse(localStorage.getItem(QUOTE_REVIEW_HANDOFF_KEY) || "null"), QUOTE_REVIEW_HANDOFF_KEY);

        if (!saved || typeof saved !== "object" || saved.hasReviewContext !== true) {
          return null;
        }

        return saved;
      } catch (error) {
        return null;
      }
    }

    function renderWarnings(warnings) {
      const warningsCard = document.getElementById("warningsCard");
      const warningsList = document.getElementById("warningsList");
      const safeWarnings = Array.isArray(warnings) && warnings.length
        ? warnings
        : ["Estimate is ready for review. Final project details are still checked before booking."];
      warningsCard.hidden = false;
      warningsList.innerHTML = safeWarnings.map(function (warning) {
        return "<li>" + escapeHtml(warning) + "</li>";
      }).join("");
    }

    function getSummaryWarnings(warnings) {
      const summaryWarnings = [];
      let stairConfirmationAdded = false;
      let removalConfirmationAdded = false;

      (Array.isArray(warnings) ? warnings : []).forEach(function (warning) {
        const text = String(warning || "").trim();
        if (!text || /selected product price is not confirmed|standard .* estimate used|product selected\. product price needs review/i.test(text)) {
          return;
        }

        if (/stair/i.test(text)) {
          if (!stairConfirmationAdded) {
            summaryWarnings.push(getStairReviewNote(getFormInput()));
            stairConfirmationAdded = true;
          }
          return;
        }

        if (/removal|disposal/i.test(text)) {
          if (!removalConfirmationAdded) {
            summaryWarnings.push("Removal and disposal details need final confirmation.");
            removalConfirmationAdded = true;
          }
          return;
        }

        if (summaryWarnings.indexOf(text) < 0) {
          summaryWarnings.push(text);
        }
      });

      return summaryWarnings;
    }

    function buildEstimateNote(result, measurement) {
      const notes = [];
      const categoryMeta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta((result && (result.productCategory || result.category)) || getSelectedProductCategory()) : null;
      const categoryLabel = categoryMeta ? categoryMeta.label.toLowerCase() : "flooring";
      const pricingMode = (result && result.pricingMode) || (result && result.pricePending ? "fallback" : "category");

      if (pricingMode === "product") {
        notes.push("Based on selected product pricing. Final project details are confirmed before booking.");
      } else if (pricingMode === "fallback") {
        notes.push("Product selected. Product price needs review before final confirmation.");
      } else if (getResolvedQuoteSelection().rangeId) {
        notes.push("Based on the selected " + categoryLabel + " range. Final product and colour are reviewed before booking.");
      } else {
        notes.push("Starting " + categoryLabel + " estimate based on a practical product range.");
      }

      if (measurement.measurementStatus === "unknown" || measurement.method !== "floorplan_upload") {
        notes.push("Measured area may be reviewed before final quote.");
      }

      return notes.join(" ");
    }

    function getQuoteSummaryReviewNotes(input, result, confidenceState) {
      const measurement = getMeasurementState();
      const sourceInput = Object.assign({}, input || getFormInput(), {
        realArea: result && result.realArea || measurement.realArea,
        category: getSelectedProductCategory(),
        measurementMethod: measurement.method
      });

      if (window.OperonQuoteConfidence && typeof window.OperonQuoteConfidence.generateQuoteReviewNotes === "function") {
        return window.OperonQuoteConfidence.generateQuoteReviewNotes(sourceInput, result || {}, confidenceState || null);
      }

      const fallbackNotes = getSummaryWarnings((result && result.warnings) || []);
      return fallbackNotes.length ? fallbackNotes : ["Estimate is ready for review. Final project details are still checked before booking."];
    }

    function renderEstimateBreakdown(result) {
      const quoteLines = document.getElementById("quoteLines");
      const lines = Array.isArray(result.quoteLines)
        ? result.quoteLines.filter(function (line) { return Number(line && line.amount || 0) > 0; })
        : [];

      if (!lines.length) {
        quoteLines.innerHTML = "<div class=\"quote-line\"><div><strong>Estimate pending</strong><span class=\"quote-line-note\">Complete the required scope details to show item totals.</span></div><span class=\"quote-line-qty\">Pending</span><strong class=\"quote-line-total\">Pending</strong></div>";
        return;
      }

      quoteLines.innerHTML = lines.map(function (line) {
        const note = line.note
          ? "<span class=\"quote-line-note\">" + escapeHtml(line.note) + "</span>"
          : "";
        const quantity = line.quantity || line.qty || "Included";
        const lineAmount = formatCurrency(line.amount);
        return "<div class=\"quote-line\">"
          + "<div><strong>" + escapeHtml(line.label || "Quote item") + "</strong>" + note + "</div>"
          + "<span class=\"quote-line-qty\">" + escapeHtml(quantity) + "</span>"
          + "<strong class=\"quote-line-total\">" + escapeHtml(lineAmount) + "</strong>"
          + "</div>";
      }).join("");
    }

    function renderSummaryPricedList(result) {
      const list = document.getElementById("summaryIncludedScopeList");
      const lines = Array.isArray(result.quoteLines)
        ? result.quoteLines.filter(function (line) { return Number(line && line.amount || 0) > 0; })
        : [];

      if (!list) {
        return;
      }

      if (!lines.length) {
        list.innerHTML = "<li class=\"summary-priced-item\"><span>Estimate items</span><strong>Pending</strong></li>";
        return;
      }

      list.innerHTML = lines.map(function (line) {
        const quantity = line.quantity || line.qty || "";
        const note = quantity
          ? "<small class=\"summary-priced-note\">" + escapeHtml(quantity) + "</small>"
          : "";
        const lineAmount = formatCurrency(line.amount);
        return "<li class=\"summary-priced-item\">"
          + "<span>" + escapeHtml(line.label || "Quote item") + note + "</span>"
          + "<strong>" + escapeHtml(lineAmount) + "</strong>"
          + "</li>";
      }).join("");
    }

    function buildIncludedScopeItems(result, measurement, input, categoryMeta) {
      const items = [];
      const productLabel = categoryMeta ? categoryMeta.label : "Flooring";

      items.push(result.quoteMode === "supply_install"
        ? productLabel + " supply and installation"
        : "Flooring installation labour");
      items.push(measurement.measurementStatus === "unknown"
        ? "Measurement follow-up selected"
        : measurement.sourceLabel + " area");

      if (isRemovalSelected(input.existingFloorToRemove)) {
        items.push("Existing floor removal");
      }
      if (input.removalDisposal === "yes") {
        items.push("Disposal / take-away");
      }
      if (input.floorPrepType && input.floorPrepType !== "none") {
        items.push("Floor preparation noted");
      }
      if (input.skirtingType && input.skirtingType !== "no") {
        items.push("Skirting or scotia noted");
      }
      if (input.stairs === "yes") {
        const stairCount = Math.max(0, Math.round(parsePositiveNumber(input.stairsCount)));
        items.push(stairCount > 0
          ? stairCount + " stair item" + (stairCount === 1 ? "" : "s") + " noted — final scope to be confirmed"
          : "Stairs included — final scope to be confirmed");
      } else if (input.stairs === "not_sure") {
        items.push("Stairs to be confirmed later");
      }

      return items.slice(0, 5);
    }

    function buildFinalPriceFactors(result, measurement, input) {
      const factors = [];
      const confirmationItems = getScopeConfirmationItems(input);

      if (measurement.measurementStatus === "unknown") {
        factors.push("Final area confirmation");
      }
      if (confirmationItems.length) {
        factors.push("Scope confirmation: " + confirmationItems.slice(0, 3).join(", "));
      }
      if (result.pricePending) {
        factors.push("Final product and colour confirmation");
      }
      if (input.floorPrepType === "unsure" || input.floorPrepType === "manual" || input.subfloorCondition === "known_issues" || input.subfloorCondition === "not_sure") {
        factors.push("Subfloor condition or preparation");
      }
      if (input.parkingAccess === "difficult" || input.hasLift === "no" || input.stairs === "yes" || input.stairs === "not_sure" || input.stairsCount > 0) {
        factors.push("Stairs or building details");
      }
      if (input.existingFloorToRemove === "unsure" || (isRemovalSelected(input.existingFloorToRemove) && (!input.removalDisposal || input.removalDisposal === "not_sure"))) {
        factors.push("Removal and disposal details");
      }

      if (!factors.length) {
        factors.push("Final project confirmation");
        factors.push("Product availability and colour confirmation");
      }

      return factors.slice(0, 4);
    }

    function renderSummaryChecklist(id, items) {
      const list = document.getElementById(id);
      list.innerHTML = items.map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("");
    }

    function trackCalculatedQuote(result) {
      if (!window.OperonTracking || !(result && result.realArea > 0)) {
        return;
      }

      const suburb = getInputValue("suburb").trim();
      const postcode = getInputValue("postcode").trim();
      const signature = [
        result.quoteMode,
        result.productId || result.productLabel,
        result.realArea,
        result.chargeableArea,
        result.totalIncGst,
        result.zoneName,
        result.pricePending ? "pending" : "priced"
      ].join("|");

      if (state.lastQuoteCalculationSignature !== signature) {
        state.lastQuoteCalculationSignature = signature;
        window.OperonTracking.trackEvent("quote_calculate", {
          quote_mode: result.quoteMode,
          product_category: result.productCategory,
          product: result.productLabel,
          real_area: result.realArea,
          chargeable_area: result.chargeableArea,
          estimated_total: result.totalIncGst,
          price_pending: !!result.pricePending,
          zone: result.zoneName
        });
        window.OperonTracking.trackEvent("quote_result_view", {
          quote_mode: result.quoteMode,
          product_category: result.productCategory,
          product: result.productLabel,
          estimated_value: result.totalIncGst,
          real_area: result.realArea,
          chargeable_area: result.chargeableArea,
          price_pending: !!result.pricePending,
          review_required: !!result.manualReviewRequired,
          confidence_level: result.quoteConfidence || result.confidenceLevel || ""
        });
      }

      if ((suburb || postcode) && state.lastTrackedZoneName !== result.zoneName) {
        state.lastTrackedZoneName = result.zoneName;
        window.OperonTracking.trackEvent("location_zone_applied", {
          suburb: suburb,
          postcode: postcode,
          zone: result.zoneName,
          total_estimate: result.totalIncGst
        });
      }
    }

    function trackEstimateReadiness(result) {
      if (!window.OperonTracking || !result) {
        return;
      }
      const measurement = getMeasurementState();
      const estimateReady = measurement.measurementStatus !== "unknown" && result.measurementStatus !== "unknown" && result.realArea > 0;
      const eventName = estimateReady ? "quote_estimate_ready" : "quote_estimate_pending";
      const signature = eventName + "|" + measurement.method + "|" + getSelectedProductCategory() + "|" + (estimateReady ? "ready" : "pending");
      if (state.lastEstimateStateSignature === signature) {
        return;
      }
      state.lastEstimateStateSignature = signature;
      window.OperonTracking.trackEvent(eventName, {
        step_name: "summary",
        product_category: getSelectedProductCategory(),
        measurement_mode: measurement.method,
        confidence_level: getEstimateConfidence(measurement, result)
      });
    }

    // UI rendering.
    function renderQuoteSummary(result) {
      const measurement = getMeasurementState();
      const input = getFormInput();
      const selection = getResolvedQuoteSelection();
      const categoryMeta = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getCategoryMeta(selection.category || result.productCategory) : null;
      const rangeRecord = getRangeRecordById(selection.category, selection.rangeId);
      const isInstallOnly = result.quoteMode === "install_only";
      const summaryIssues = getQuoteSummaryConsistencyIssues(input, result);
      const confirmationItems = getScopeConfirmationItems(input);
      const confirmationWarnings = confirmationItems.map(function (item) {
        return "Needs confirmation: " + item + ".";
      });
      const summaryHeadline = document.getElementById("summaryHeadline");
      const estimateReady = measurement.measurementStatus !== "unknown"
        && result.measurementStatus !== "unknown"
        && result.realArea > 0
        && !!selection.category
        && Number(result.totalIncGst || 0) > 0;
      const pendingMeasurement = !estimateReady;
      const confidenceState = getEstimateConfidenceState(measurement, result, input);
      const confidence = confidenceState.label;
      const reviewNotes = getQuoteSummaryReviewNotes(input, result, confidenceState);
      const pendingEstimateCard = document.getElementById("summaryPendingEstimateCard");
      const estimateDetailsBox = document.getElementById("summaryEstimateDetailsBox");
      renderQuoteBuildStatus(result);
      trackEstimateReadiness(result);

      if (pendingMeasurement) {
        summaryHeadline.textContent = "Your flooring estimate";
        document.getElementById("summaryTotal").textContent = "Add flooring type and area to see your starting estimate.";
        document.getElementById("summaryPricingRangeNote").hidden = true;
        document.getElementById("summaryPricingRangeNote").textContent = "";
        document.getElementById("summaryTotalSecondary").textContent = "Pending";
        document.getElementById("summarySubtotal").textContent = "Pending";
        document.getElementById("summaryGst").textContent = "Pending";
        document.getElementById("summarySelectedProduct").textContent = !selection.rangeId
          ? ((categoryMeta ? categoryMeta.label : "Flooring") + " practical range estimate")
          : (selection.selectionMode === "range_then_colour" && selection.selectedColour
            ? ((rangeRecord ? rangeRecord.rangeLabel : result.productLabel) + " — " + selection.selectedColour)
            : ((rangeRecord ? rangeRecord.rangeLabel : result.productLabel) + (selection.selectionMode === "range_only" ? " · colour to confirm" : "")));
        document.getElementById("summaryRealArea").textContent = "Area pending";
        document.getElementById("summaryChargeableAreaLabel").textContent = "Next step status";
        document.getElementById("summaryChargeableArea").textContent = "Pending";
        document.getElementById("summaryChargeableAreaRow").hidden = false;
        document.getElementById("summaryCaption").textContent = "Estimate pending";
        document.getElementById("summaryScope").textContent = getQuoteTypeLabel(result.quoteMode);
        document.getElementById("summaryMeasurement").textContent = "Measurement pending";
        document.getElementById("summaryConfidence").textContent = confidence;
        document.getElementById("summaryConfidenceText").textContent = confidenceState.message || getEstimateConfidenceText(confidence);
        document.getElementById("summaryCoverage").textContent = measurement.nextStepRequired
          ? ("Next step selected · " + getUnknownMeasurementNextStepLabel(measurement.nextStepRequired))
          : "Choose a next step to keep the estimate moving";
        document.getElementById("summaryQuotePath").textContent = "Measurement follow-up required";
        document.getElementById("summaryProductPricing").textContent = "Pricing held until measurement is confirmed";
        document.getElementById("summaryNextStep").textContent = measurement.nextStepRequired
          ? getUnknownMeasurementNextStepLabel(measurement.nextStepRequired)
          : "Choose the next step";
        document.getElementById("measurementSourceLabel").textContent = measurement.sourceLabel;
        document.getElementById("realAreaMetric").textContent = "Pending";
        document.getElementById("chargeableAreaMetric").textContent = "Pending";
        document.getElementById("chargeableAreaMetricLabel").textContent = "Estimate status";
        document.getElementById("chargeableAreaMetricCard").hidden = false;

        document.getElementById("manualReviewNotice").textContent = confidenceState.message || buildEstimateNote(result, measurement);
        document.getElementById("quoteLines").innerHTML = "";
        document.getElementById("summaryIncludedScopeList").innerHTML = "";
        renderSummaryChecklist("summaryFinalPriceFactorsList", buildFinalPriceFactors(result, measurement, input));
        document.getElementById("summaryNextStepText").textContent = measurement.nextStepRequired
          ? "Submit the quote request and we will follow up on the selected measurement path before confirming pricing."
          : "Choose the next measurement step, then submit the quote request when it looks right.";
        if (pendingEstimateCard) {
          pendingEstimateCard.hidden = false;
          pendingEstimateCard.textContent = "Add flooring type and area to see your starting estimate.";
        }
        if (estimateDetailsBox) {
          estimateDetailsBox.hidden = true;
        }
        renderWarnings(reviewNotes);

        return;
      }

      summaryHeadline.textContent = "Your flooring estimate";
      if (pendingEstimateCard) {
        pendingEstimateCard.hidden = true;
      }
      if (estimateDetailsBox) {
        estimateDetailsBox.hidden = false;
      }

      const pricingAdjustment = result.pricingAdjustment || null;
      const rangeNote = document.getElementById("summaryPricingRangeNote");
      if (pricingAdjustment && pricingAdjustment.enabled) {
        const rangeText = formatCurrency(pricingAdjustment.range_low) + " - " + formatCurrency(pricingAdjustment.range_high);
        document.getElementById("summaryTotal").textContent = rangeText;
        document.getElementById("summaryTotalSecondary").textContent = rangeText;
        rangeNote.hidden = false;
        rangeNote.textContent = "Base estimate " + formatCurrency(pricingAdjustment.base_total) + " · " + pricingAdjustment.confidence_level + " confidence range";
      } else {
        document.getElementById("summaryTotal").textContent = formatCurrency(result.totalIncGst);
        document.getElementById("summaryTotalSecondary").textContent = formatCurrency(result.totalIncGst);
        rangeNote.hidden = true;
        rangeNote.textContent = "";
      }
      document.getElementById("summarySubtotal").textContent = formatCurrency(result.subtotalExGst);
      document.getElementById("summaryGst").textContent = formatCurrency(result.gst);
      document.getElementById("summarySelectedProduct").textContent = !selection.rangeId
        ? ((categoryMeta ? categoryMeta.label : "Flooring") + " practical range estimate")
        : (selection.selectionMode === "range_then_colour" && selection.selectedColour
          ? ((rangeRecord ? rangeRecord.rangeLabel : result.productLabel) + " — " + selection.selectedColour)
          : ((rangeRecord ? rangeRecord.rangeLabel : result.productLabel) + (selection.selectionMode === "range_only" ? " · colour to confirm" : "")));
      document.getElementById("summaryRealArea").textContent = formatArea(result.realArea);
      document.getElementById("summaryChargeableArea").textContent = result.quoteMode === "supply_install"
        ? formatArea(result.chargeableArea)
        : "Not used";
      document.getElementById("summaryChargeableAreaRow").hidden = isInstallOnly;
      document.getElementById("summaryCaption").textContent = "Starting estimate · Final confirmation required";
      document.getElementById("summaryScope").textContent = getQuoteTypeLabel(result.quoteMode);
      document.getElementById("summaryMeasurement").textContent = measurement.sourceLabel + " · " + formatArea(result.realArea);
      document.getElementById("summaryConfidence").textContent = confidence;
      document.getElementById("summaryConfidenceText").textContent = confidenceState.message || getEstimateConfidenceText(confidence);
      document.getElementById("summaryCoverage").textContent = result.quoteLines.length
        ? ((categoryMeta ? categoryMeta.label : "Flooring") + " · " + result.quoteLines.map(function (line) { return line.label; }).join(" · "))
        : "Estimate items update here";
      document.getElementById("summaryQuotePath").textContent = getQuoteTypeLabel(result.quoteMode);
      document.getElementById("summaryProductPricing").textContent = result.pricingMode === "product"
        ? "Based on selected product pricing"
        : (result.pricingMode === "fallback"
          ? "Product price needs review"
          : (selection.rangeId ? "Based on selected range" : "Category-level product estimate"));
      document.getElementById("summaryNextStep").textContent = summaryIssues.length
        ? "Check the quote details first"
        : (confirmationItems.length
          ? "Confirm missing scope details"
          : (result.pricingMode === "fallback"
            ? "Submit for product price review"
            : "Submit for final review and confirmation"));
      document.getElementById("measurementSourceLabel").textContent = measurement.sourceLabel;
      document.getElementById("realAreaMetric").textContent = formatArea(result.realArea);
      document.getElementById("chargeableAreaMetric").textContent = isInstallOnly
        ? formatArea(result.realArea)
        : formatArea(result.chargeableArea);
      document.getElementById("chargeableAreaMetricLabel").textContent = isInstallOnly
        ? "Installation area"
        : "Estimated area including off-cuts";
      document.getElementById("chargeableAreaMetricCard").hidden = isInstallOnly;

      document.getElementById("manualReviewNotice").textContent = summaryIssues.length
        ? summaryIssues[0]
        : (confirmationItems.length
          ? "Some scope items still need confirmation before final pricing."
          : buildEstimateNote(result, measurement));
      renderEstimateBreakdown(result);
      renderSummaryPricedList(result);
      renderSummaryChecklist("summaryFinalPriceFactorsList", buildFinalPriceFactors(result, measurement, input));
      document.getElementById("summaryNextStepText").textContent = "Submit the quote request and we will review the details before confirming the final quote.";
      renderWarnings(reviewNotes);

    }

    function getDraftState() {
      return {
        rooms: state.rooms,
        floorplanFileName: state.floorplanFileName,
        lastQuoteId: state.lastQuoteId,
        lastSavedDraftSignature: state.lastSavedDraftSignature,
        fields: Array.from(quoteForm.elements).reduce(function (accumulator, element) {
          if (!element.id || element.type === "file") {
            return accumulator;
          }
          accumulator[element.id] = element.type === "checkbox" ? element.checked : element.value;
          return accumulator;
        }, {})
      };
    }

    function saveDraft() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(withStorageExpiry(getDraftState(), CUSTOMER_DRAFT_TTL_MS)));
      } catch (error) {
        // Ignore local storage write failures.
      }
    }

    function loadDraft() {
      try {
        const draft = unwrapStoredPayload(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"), STORAGE_KEY);
        if (!draft) {
          return;
        }

        if (Array.isArray(draft.rooms) && draft.rooms.length) {
          state.rooms = draft.rooms;
        }

        if (draft.floorplanFileName) {
          state.floorplanFileName = draft.floorplanFileName;
        }

        if (draft.lastQuoteId) {
          state.lastQuoteId = draft.lastQuoteId;
        }

        if (draft.lastSavedDraftSignature) {
          state.lastSavedDraftSignature = draft.lastSavedDraftSignature;
        }

        if (draft.fields && typeof draft.fields === "object") {
          Object.keys(draft.fields).forEach(function (key) {
            setInputValue(key, draft.fields[key]);
          });
        }
      } catch (error) {
        // Ignore malformed draft state.
      }
    }

    function renderAll() {
      buildProducts();
      buildProductChoiceCards();
      buildProductRangeSelect();
      buildProductColourSelect();
      buildProductOptionSelect();
      renderSelectedProductBanner();
      buildRooms();
      updateConditionalQuoteFields();
      renderStairsStep();
      renderExtrasStep();
      renderUnknownMeasurementFlow();
      renderMeasurementHelper();
      refreshQuoteEstimate({ render: true, track: true });
      renderFloorplanHandoff();
      renderQuoteAdvisorHandoff();
      updateStepProgress();
      saveDraft();
      const activeProduct = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getProductById(getInputValue("selectedProduct")) : null;
      const productHandoffMessage = state.productHandoffActive && activeProduct
        ? getProductHandoffMessage(activeProduct)
        : "";
      if (state.pendingHandoffMessage) {
        showPageStatus(state.pendingHandoffMessage);
      } else if (productHandoffMessage) {
        showPageStatus(productHandoffMessage);
      } else {
        showPageStatus("");
      }

      if (getInputValue("confirmedFloorplanArea")) {
        floorplanStatus.textContent = "Measured floor plan area ready to review.";
      }
    }

    function resetQuote() {
      quoteForm.reset();
      state.rooms = [createEmptyRoom("Living room")];
      state.floorplanFileName = "";
      setInputValue("quoteMode", "supply_install");
      setInputValue("selectedProductCategory", "hybrid");
      setInputValue("selectedProduct", "");
      setInputValue("selectedRangeId", "");
      setInputValue("selectedColour", "");
      setInputValue("productSelectionMode", "");
      setInputValue("productChoiceMode", "recommend");
      setMeasurementMethod("manual_total");
      setQuoteMode("supply_install");
      setProductChoiceMode("recommend", { track: false });
      setInputValue("stairs", "");
      setInputValue("stairsRequiresReview", "yes");
      setInputValue("removalDecision", "");
      setInputValue("removalType", "");
      setInputValue("existingFloorType", "");
      setInputValue("removalDisposal", "");
      state.lastRemovalType = "";
      state.lastFloorPrepType = "";
      state.lastPatternType = "";
      state.backendQuoteCacheSignature = "";
      state.backendQuoteCacheResult = null;
      state.backendQuoteInFlightSignature = "";
      state.backendQuoteInFlightPromise = null;
      setInputValue("floorPrepDecision", "");
      setInputValue("underlayDecision", "");
      setInputValue("finishDecision", "");
      setInputValue("doorDecision", "");
      setInputValue("furnitureDecision", "");
      floorplanStatus.textContent = "Open the floor plan tool when you want help measuring the area.";
      currentQuoteStep = 0;
      state.pendingHandoffMessage = "";
      state.floorplanHandoffDismissed = false;
      state.currentQuoteResult = null;
      state.lastQuoteId = "";
      state.lastSavedDraftSignature = "";
      renderAll();
      showQuoteStep(0, { scrollMode: "top" });
    }

    function applyFloorplanHandoff() {
      try {
        const handoff = readFloorplanHandoffState();
        if (handoff.savedArea > 0) {
          setMeasurementMethod("floorplan_upload");
          setInputValue("confirmedFloorplanArea", String(handoff.savedArea));
          if (window.OperonTracking) {
            window.OperonTracking.trackFloorplanAreaUsed(handoff.savedArea);
          }
          floorplanStatus.textContent = "Measured floor plan area found: " + formatArea(handoff.savedArea) + ". Review before final quote.";
          state.pendingHandoffMessage = "Measured floor plan area applied. Review Step 3, then continue with the quote.";
          state.floorplanHandoffDismissed = false;
          showPageStatus(state.pendingHandoffMessage);
        }
      } catch (error) {
        floorplanStatus.textContent = "Saved floorplan area could not be loaded.";
      }
    }

    function renderFloorplanHandoff() {
      const loadFloorplanAreaButton = document.getElementById("loadFloorplanAreaButton");
      try {
        const savedArea = readFloorplanHandoffState().savedArea;
        if (savedArea > 0) {
          loadFloorplanAreaButton.textContent = "Use measured floor plan area: " + formatArea(savedArea);
          loadFloorplanAreaButton.disabled = false;
          floorplanHandoffTitle.textContent = "Measured floor plan area found: " + formatArea(savedArea);
          floorplanHandoffText.textContent = "Use the measured floor plan area now, or keep your current measurement and come back later.";
          floorplanHandoffCard.classList.toggle(
            "active",
            !state.floorplanHandoffDismissed && (!getInputValue("confirmedFloorplanArea") || window.location.search.indexOf("from=floorplan") >= 0)
          );
          if (!getInputValue("confirmedFloorplanArea")) {
            floorplanStatus.textContent = "Measured floor plan area found: " + formatArea(savedArea) + ". Use it when ready, or keep your current measurement.";
          }
          return;
        }
      } catch (error) {
        // Ignore storage read failures.
      }

      loadFloorplanAreaButton.textContent = "Use saved measured area";
      loadFloorplanAreaButton.disabled = false;
      floorplanHandoffCard.classList.remove("active");
      if (!getInputValue("confirmedFloorplanArea")) {
        floorplanStatus.textContent = "Open the floor plan tool when you want help measuring the area.";
      }
    }

    function readFloorplanHandoffState() {
      let savedArea = 0;
      let savedRooms = [];
      let savedSource = "";

      try {
        const structured = JSON.parse(localStorage.getItem(FLOORPLAN_QUOTE_HANDOFF_KEY) || "null");
        if (structured && typeof structured === "object") {
          savedArea = parsePositiveNumber(structured.realArea);
          savedRooms = Array.isArray(structured.rooms) ? structured.rooms : [];
          savedSource = structured.source || "";
        }

        if (!(savedArea > 0)) {
          savedArea = parsePositiveNumber(
            localStorage.getItem(FLOORPLAN_CONFIRMED_AREA_KEY) || localStorage.getItem(FLOORPLAN_AREA_KEY)
          );
          savedRooms = JSON.parse(localStorage.getItem(FLOORPLAN_ROOMS_KEY) || "[]");
          savedSource = localStorage.getItem(FLOORPLAN_SOURCE_KEY) || "";
        }

        if (savedArea > 0) {
          const payload = {
            realArea: savedArea,
            rooms: Array.isArray(savedRooms) ? savedRooms : [],
            source: savedSource || "",
            savedAt: new Date().toISOString()
          };
          localStorage.setItem(FLOORPLAN_QUOTE_HANDOFF_KEY, JSON.stringify(payload));
          localStorage.setItem(FLOORPLAN_CONFIRMED_AREA_KEY, String(savedArea));
          localStorage.setItem(FLOORPLAN_ROOMS_KEY, JSON.stringify(payload.rooms));
          localStorage.setItem(FLOORPLAN_SOURCE_KEY, payload.source);
          localStorage.removeItem(FLOORPLAN_AREA_KEY);
        }
      } catch (error) {
        savedRooms = [];
        savedSource = "";
      }

      state.floorplanRooms = Array.isArray(savedRooms) ? savedRooms : [];
      state.floorplanSource = savedSource;

      return {
        savedArea: savedArea,
        savedRooms: state.floorplanRooms,
        savedSource: state.floorplanSource
      };
    }

    function applyQuotePageHandoffState() {
      const params = new URLSearchParams(window.location.search);
      const requestedStep = Number(params.get("quoteStep"));
      const fromFloorplan = params.get("from") === "floorplan";
      const fromProduct = params.get("from") === "product";
      const fromQuoteAdvisor = params.get("source") === "quote_review";
      const requestedCategory = params.get("category");
      const floorplanState = readFloorplanHandoffState();
      const storedProduct = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getStoredProduct() : null;
      const storedSelectionState = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getStoredSelectionState() : null;

      if (fromFloorplan && floorplanState.savedArea > 0) {
        state.pendingHandoffMessage = "You’re back from the floor plan tool. Step 3 is ready with " + formatArea(floorplanState.savedArea) + ".";
        state.floorplanHandoffDismissed = false;
      }

      if (fromProduct && ((storedProduct && PRODUCT_LIBRARY.getProductById(storedProduct.id)) || (storedSelectionState && storedSelectionState.selectedRangeId))) {
        restoreStoredProductSelection({ markHandoff: true });
      } else if (fromProduct && isValidProductCategory(requestedCategory)) {
        setSelectedCategory(requestedCategory, { preserveProduct: false, trackStartFromProduct: true });
      }

      if (fromQuoteAdvisor && readQuoteReviewHandoff()) {
        state.pendingHandoffMessage = "Quote review attached. Continue the structured estimate when ready.";
        if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
          window.OperonTracking.trackEvent("quote_review_handoff_attached", {
            source: "quote_review"
          });
        }
      }

      if (fromFloorplan && floorplanState.savedArea > 0) {
        currentQuoteStep = 2;
      } else if (Number.isInteger(requestedStep) && requestedStep >= 0) {
        currentQuoteStep = Math.min(requestedStep, 5);
      } else {
        currentQuoteStep = 0;
      }
    }

    function refreshQuoteFromPricingSource() {
      if (!PRODUCT_LIBRARY) {
        return;
      }

      const storedCategory = PRODUCT_LIBRARY.getStoredCategory() || getSelectedProductCategory() || "hybrid";
      if (!restoreStoredProductSelection()) {
        setSelectedCategory(storedCategory, { preserveProduct: false });
      }

      renderAll();
      updateQuoteCtaSystem();
      if (state.pendingHandoffMessage) {
        showPageStatus(state.pendingHandoffMessage);
      } else {
        showPageStatus("");
      }
    }

    function getQuoteRoomsForPayload(measurement) {
      if (measurement.method === "room_by_room") {
        return state.rooms.map(function (room) {
          const length = parsePositiveNumber(room.length);
          const width = parsePositiveNumber(room.width);
          return {
            roomName: room.name || "Room",
            lengthM: length || null,
            widthM: width || null,
            areaM2: roundTo(length * width, 2),
            included: true,
            source: "index_room_by_room"
          };
        }).filter(function (room) {
          return room.areaM2 > 0;
        });
      }

      if (measurement.method === "floorplan_upload") {
        return state.floorplanRooms.map(function (room) {
          return {
            roomName: room.name || room.roomName || "Area",
            lengthM: room.lengthM || room.length || null,
            widthM: room.widthM || room.width || null,
            areaM2: room.areaM2 || room.area || null,
            included: room.includeInQuote !== false && room.included !== false,
            source: state.floorplanSource || "floorplan"
          };
        });
      }

      return [];
    }

    function getSelectedExtrasForPayload(result) {
      const existingFloorToRemove = normaliseRemovalFloorType(getInputValue("removalType") || getInputValue("existingFloorType"));
      return {
        removal: {
          type: existingFloorToRemove,
          floorType: existingFloorToRemove,
          amountExGst: result.removalTotal
        },
        disposal: {
          included: getInputValue("removalDisposal") === "yes",
          selection: getInputValue("removalDisposal"),
          amountExGst: result.disposalTotal
        },
        floorPrep: {
          type: getInputValue("floorPrepType"),
          amountExGst: result.floorPrepTotal
        },
        moistureBarrier: {
          selected: getInputValue("moistureBarrier"),
          amountExGst: result.moistureBarrierTotal
        },
        skirting: {
          type: getInputValue("skirtingType"),
          amountExGst: result.skirtingTotal
        },
        scotia: {
          type: getInputValue("scotiaType"),
          amountExGst: result.scotiaTotal
        },
        furniture: {
          type: getInputValue("furnitureType"),
          roomCount: result.furnitureRoomCount,
          amountExGst: result.furnitureTotal
        },
        doorTrimming: {
          selected: getInputValue("doorTrimming"),
          quantity: result.doorCount,
          amountExGst: result.doorTrimmingTotal
        },
        stairs: {
          selected: getInputValue("stairs"),
          count: Math.max(0, Math.round(parsePositiveNumber(getInputValue("stairsCount")))),
          countRange: getInputValue("stairsCountRange"),
          widthKnown: getInputValue("stairWidthKnown"),
          widthMm: Math.max(0, Math.round(parsePositiveNumber(getInputValue("stairWidthMm")))),
          details: getStairDetailsPayload(),
          amountExGst: result.stairsTotal,
          requiresReview: getInputValue("stairsRequiresReview") === "yes"
        },
        scopeChecks: {
          existingFloorToRemove: existingFloorToRemove,
          existingFloorType: existingFloorToRemove,
          subfloorCondition: getInputValue("subfloorCondition"),
          underfloorHeating: getInputValue("underfloorHeating")
        }
      };
    }

    function buildQuoteItemsFromPricing(pricing) {
      const items = [];

      if (Array.isArray(pricing.lineItems) && pricing.lineItems.length) {
        return pricing.lineItems
          .filter(function (line) { return Number(line && (line.amount || line.total) || 0) > 0; })
          .map(function (line) {
            return {
              type: "estimate_line",
              label: line.label || "Estimate item",
              quantity: line.quantity || line.qty || "",
              unit: "",
              unitBasis: "customer_safe_line_item",
              amountExGst: Number(line.amount || line.total || 0),
              rawPayload: {}
            };
          });
      }

      if (pricing.quoteMode === "supply_install") {
        if (pricing.materialTotal > 0) {
          items.push({
            type: "material",
            label: pricing.productLabel + " material allowance",
            quantity: pricing.chargeableArea,
            unit: "m2",
            unitBasis: "chargeable_area",
            amountExGst: pricing.materialTotal,
            rawPayload: {
              quoteMode: pricing.quoteMode
            }
          });
        }

        if (pricing.installationAdjustedTotal > 0) {
          items.push({
            type: "installation",
            label: "Installation labour",
            quantity: pricing.realArea,
            unit: "m2",
            unitBasis: "real_area",
            amountExGst: pricing.installationAdjustedTotal,
            rawPayload: {
              baseAmount: pricing.installationTotal
            }
          });
        }
      } else if (pricing.installationAdjustedTotal > 0) {
        items.push({
          type: "installation",
          label: "Installation only",
          quantity: pricing.realArea,
          unit: "m2",
          unitBasis: "real_area",
          amountExGst: pricing.installationAdjustedTotal,
          rawPayload: {
            quoteMode: pricing.quoteMode
          }
        });
      }

      if (pricing.removalTotal > 0) {
        items.push({ type: "removal", label: (pricing.removalLabel || "Existing floor") + " removal", quantity: pricing.realArea, unit: "m2", unitBasis: "real_area", amountExGst: pricing.removalTotal });
      }
      if (pricing.disposalSelected || pricing.disposalTotal > 0) {
        items.push({ type: "disposal", label: "Disposal / take-away", quantity: pricing.realArea, unit: "m2", unitBasis: "real_area", amountExGst: pricing.disposalTotal || 0 });
      }
      if (pricing.floorPrepTotal > 0) {
        items.push({ type: "floor_prep", label: "Floor preparation", quantity: pricing.realArea, unit: "m2", unitBasis: "real_area", amountExGst: pricing.floorPrepTotal });
      }
      if (pricing.underlayTotal > 0) {
        items.push({ type: "underlay", label: "Underlay", quantity: pricing.chargeableArea, unit: "m2", unitBasis: "chargeable_area", amountExGst: pricing.underlayTotal });
      }
      if (pricing.moistureBarrierTotal > 0) {
        items.push({ type: "moisture_barrier", label: "Moisture protection for concrete floors", quantity: pricing.chargeableArea, unit: "m2", unitBasis: "chargeable_area", amountExGst: pricing.moistureBarrierTotal });
      }
      if (pricing.skirtingTotal > 0) {
        items.push({ type: "skirting", label: "Skirting package", quantity: pricing.chargeableArea, unit: "m2", unitBasis: "chargeable_area", amountExGst: pricing.skirtingTotal });
      }
      if (pricing.scotiaTotal > 0) {
        items.push({ type: "scotia", label: "Scotia", quantity: pricing.chargeableArea, unit: "m2", unitBasis: "chargeable_area", amountExGst: pricing.scotiaTotal });
      }
      if (pricing.furnitureTotal > 0) {
        items.push({ type: "furniture", label: "Furniture moving support", quantity: pricing.furnitureRoomCount || 0, unit: "room", unitBasis: "room_count", amountExGst: pricing.furnitureTotal });
      }
      if (pricing.doorTrimmingTotal > 0) {
        items.push({ type: "door_trimming", label: "Door trimming", quantity: pricing.doorCount, unit: "each", unitBasis: "each", amountExGst: pricing.doorTrimmingTotal });
      }
      if (pricing.travelFeeTotal > 0) {
        items.push({ type: "travel", label: "Travel and site allowance", quantity: 1, unit: "job", unitBasis: "job", amountExGst: pricing.travelFeeTotal });
      }

      return items.map(function (item) {
        return Object.assign({ rawPayload: item.rawPayload || item }, item);
      });
    }

    async function buildQuotePayload(options) {
      const settings = options || {};
      const input = getFormInput();
      const measurement = getMeasurementState();
      const pricing = settings.pricing || await refreshQuoteEstimate({
        input: input,
        render: false,
        track: false
      });
      const product = getSelectedProduct();
      const floorplanState = readFloorplanHandoffState();
      const measurementMethod = input.measurementMethod === "floorplan_upload" && floorplanState.savedArea > 0
        ? "floorplan"
        : input.measurementMethod;
      const rooms = getQuoteRoomsForPayload(measurement);

      return {
        submittedAt: new Date().toISOString(),
        sourcePage: "quote.html",
        leadAutomation: {
          leadStage: "unknown",
          consentSms: false,
          consentEmail: true,
          followupStatus: "pending"
        },
        customer: {
          name: getInputValue("fullName").trim(),
          phone: getInputValue("phone").trim(),
          email: getDeliveryEmailAddress(input),
          siteAddress: getInputValue("siteAddress").trim(),
          suburb: getInputValue("suburb").trim(),
          postcode: getInputValue("postcode").trim()
        },
        property: {
          type: getInputValue("propertyType"),
          level: getInputValue("level"),
          hasLift: getInputValue("hasLift"),
          parking: getInputValue("parkingAccess")
        },
        job: {
          quoteMode: input.quoteMode,
          productCategory: product.category,
          productChoiceMode: input.productChoiceMode,
          selectedRangeId: input.selectedRangeId || null,
          selectedColour: input.selectedColour || null,
          productId: product.isEstimate ? null : product.id,
          productName: PRODUCT_LIBRARY.getProductLabel(product),
          productBrand: product.brand,
          productRange: product.rangeLabel || product.range,
          productColour: input.selectedColour || (product.selectionMode === "range_then_colour" ? product.colour : ""),
          flooringPattern: input.patternType,
          installationMethod: input.installMethod || (product.category === "engineered" ? "floating" : "floating"),
          existingFloorToRemove: input.existingFloorToRemove || "",
          existingFloorType: input.existingFloorToRemove || "",
          subfloorCondition: input.subfloorCondition || "",
          underfloorHeating: input.underfloorHeating || "",
          furnishingLevel: input.furnitureType || "no",
          stairCount: Math.max(0, Math.round(parsePositiveNumber(input.stairsCount))),
          stairCountRange: input.stairsCountRange || "",
          stairWidthKnown: input.stairWidthKnown || "no",
          stairWidthMm: Math.max(0, Math.round(parsePositiveNumber(input.stairWidthMm))),
          stairDetails: Array.isArray(input.stairDetails) ? input.stairDetails : [],
          stairsIncluded: input.stairs === "yes",
          stairsNeedsConfirmation: isStairScopeReviewRequired(input)
        },
        measurement: {
          method: measurementMethod,
          status: measurement.measurementStatus,
          estimateReady: measurement.estimateReady,
          quoteConfidence: measurement.quoteConfidence,
          nextStepRequired: measurement.nextStepRequired || null,
          lookupAddress: measurement.lookupAddress || "",
          realArea: measurement.measurementStatus === "unknown" ? null : pricing.realArea,
          chargeableArea: measurement.measurementStatus === "unknown" ? null : pricing.chargeableArea,
          roomCount: pricing.roomCount,
          sourceLabel: pricing.measurementSource,
          floorplanSource: floorplanState.savedSource || "",
          floorplanAreaFound: floorplanState.savedArea,
          rooms: rooms
        },
        extras: getSelectedExtrasForPayload(pricing),
        pricing: Object.assign({}, pricing, {
          lineItems: buildQuoteItemsFromPricing(pricing)
        }),
        quoteReviewHandoff: readQuoteReviewHandoff(),
        files: [],
        notes: {
          short: "",
          site: getInputValue("siteNotes").trim(),
          customer: getInputValue("customerNotes").trim()
        },
        manualReviewRequired: pricing.manualReviewRequired,
        warnings: pricing.warnings || []
      };
    }

    function canUseLeadCaptureRuntime() {
      return typeof window.fetch === "function" && window.location.protocol !== "file:";
    }

    async function getSecurityChallengeToken(action) {
      if (typeof window.operonGetTurnstileToken === "function") {
        return window.operonGetTurnstileToken(action);
      }
      return "";
    }

    async function loadQuoteRuntimeHealth() {
      try {
        const response = await window.fetch(QUOTE_RUNTIME_HEALTH_ENDPOINT, {
          headers: {
            "Cache-Control": "no-store"
          }
        });
        const result = await response.json().catch(function () {
          return null;
        });
        if (!response.ok || !result) {
          return;
        }

        const available = result.status === "available" || result.ok === true;
        state.quoteRuntimeHealth = {
          checked: true,
          quoteSaveReady: available,
          emailReady: available
        };
      } catch (error) {
        // Netlify branch previews or local static servers may not expose the runtime health endpoint yet.
      }
    }

    function buildLeadNotes(payload) {
      const parts = [];
      if (payload.measurement && payload.measurement.status === "unknown") {
        parts.push("Measurement pending: " + getUnknownMeasurementNextStepLabel(payload.measurement.nextStepRequired));
        if (payload.measurement.lookupAddress) {
          parts.push("Floor plan lookup address: " + payload.measurement.lookupAddress);
        }
      }
      if (payload.notes && payload.notes.site) {
        parts.push("Job notes: " + payload.notes.site);
      }
      if (payload.notes && payload.notes.customer) {
        parts.push("Customer notes: " + payload.notes.customer);
      }
      return parts.join(" | ");
    }

    function buildLeadQuoteLines(payload) {
      return (payload.pricing.lineItems || []).map(function (item) {
        return {
          label: item.label,
          quantity: item.quantity || 0,
          unit: item.unit || "",
          unitBasis: item.unitBasis || "",
          amountExGst: item.amountExGst || 0
        };
      });
    }

    function buildLeadPayloadFromQuotePayload(payload) {
      const createdAt = new Date().toISOString();
      const quoteLines = buildLeadQuoteLines(payload);
      const quoteReviewHandoff = readQuoteReviewHandoff();
      const leadPayload = {
        name: payload.customer.name,
        phone: payload.customer.phone,
        email: payload.customer.email,
        address: payload.customer.siteAddress,
        suburb: payload.customer.suburb,
        postcode: payload.customer.postcode,
        selectedProduct: payload.job.productName,
        category: payload.job.productCategory,
        realArea: payload.measurement.realArea,
        chargeableArea: payload.job.quoteMode === "install_only" ? null : payload.measurement.chargeableArea,
        quoteTotal: payload.measurement.status === "unknown" ? null : payload.pricing.totalIncGst,
        quoteRangeLow: payload.pricing.pricingAdjustment && payload.pricing.pricingAdjustment.enabled ? payload.pricing.pricingAdjustment.range_low : null,
        quoteRangeHigh: payload.pricing.pricingAdjustment && payload.pricing.pricingAdjustment.enabled ? payload.pricing.pricingAdjustment.range_high : null,
        quoteTargetPrice: payload.pricing.pricingAdjustment && payload.pricing.pricingAdjustment.enabled ? payload.pricing.pricingAdjustment.target_price : null,
        quoteLines: quoteLines,
        notes: buildLeadNotes(payload),
        createdAt: createdAt,
        leadStatus: "new",
        leadStage: "unknown",
        consentSms: false,
        consentEmail: true,
        leadPriority: payload.measurement.nextStepRequired === "site_assessment" ? "high" : "standard",
        quoteMode: payload.job.quoteMode,
        measurementMethod: payload.measurement.method,
        measurementStatus: payload.measurement.status,
        estimateReady: payload.measurement.estimateReady,
        quoteConfidence: payload.measurement.quoteConfidence,
        nextStepRequired: payload.measurement.nextStepRequired || "",
        floorplanLookupAddress: payload.measurement.lookupAddress || "",
        quoteReviewHandoff: quoteReviewHandoff,
        quoteReview: quoteReviewHandoff
      };

      return leadPayload;
    }

    function saveLastSubmittedLeadBackup(leadPayload, resultState) {
      const snapshot = {
        result: resultState || "pending",
        savedAt: new Date().toISOString(),
        lead: leadPayload
      };
      localStorage.setItem(LAST_SUBMITTED_LEAD_KEY, JSON.stringify(withStorageExpiry(leadPayload, CUSTOMER_DRAFT_TTL_MS)));
      localStorage.setItem(LAST_SUBMITTED_LEAD_RESULT_KEY, JSON.stringify(withStorageExpiry(snapshot, CUSTOMER_DRAFT_TTL_MS)));
    }

    function clearLastSubmittedLeadBackup() {
      localStorage.removeItem(LAST_SUBMITTED_LEAD_KEY);
      localStorage.removeItem(LAST_SUBMITTED_LEAD_RESULT_KEY);
    }

    function readLastSubmittedLeadBackup() {
      try {
        return unwrapStoredPayload(JSON.parse(localStorage.getItem(LAST_SUBMITTED_LEAD_RESULT_KEY) || "null"), LAST_SUBMITTED_LEAD_RESULT_KEY);
      } catch (error) {
        return null;
      }
    }

    function renderLeadRecoveryBanner() {
      const savedResult = readLastSubmittedLeadBackup();
      if (!savedResult || savedResult.result !== "error" || !savedResult.lead || currentQuoteStep !== 0) {
        leadRecoveryBanner.hidden = true;
        return;
      }

      leadRecoveryTitle.textContent = "Saved draft found";
      leadRecoveryText.textContent = "Your last quote was not submitted. This draft is still saved on this device.";
      leadRecoveryButton.textContent = "Review draft";
      leadRecoveryBanner.hidden = false;
    }

    function syncLeadFormFields(leadPayload) {
      leadCreatedAtInput.value = leadPayload.createdAt || "";
      leadStatusInput.value = leadPayload.leadStatus || "new";
      leadStageInput.value = leadPayload.leadStage || "unknown";
      leadConsentSmsInput.value = leadPayload.consentSms ? "true" : "false";
      leadConsentEmailInput.value = leadPayload.consentEmail === false ? "false" : "true";
      leadNameInput.value = leadPayload.name || "";
      leadAddressInput.value = leadPayload.address || "";
      leadSelectedProductInput.value = leadPayload.selectedProduct || "";
      leadCategoryInput.value = leadPayload.category || "";
      leadRealAreaInput.value = leadPayload.realArea != null ? String(leadPayload.realArea) : "";
      leadChargeableAreaInput.value = leadPayload.chargeableArea != null ? String(leadPayload.chargeableArea) : "";
      leadQuoteTotalInput.value = leadPayload.quoteTotal != null ? String(leadPayload.quoteTotal) : "";
      leadQuoteLinesInput.value = JSON.stringify(leadPayload.quoteLines || []);
      leadNotesInput.value = leadPayload.notes || "";
      leadMeasurementStatusInput.value = leadPayload.measurementStatus || "";
      leadEstimateReadyInput.value = leadPayload.estimateReady != null ? String(leadPayload.estimateReady) : "";
      leadQuoteConfidenceInput.value = leadPayload.quoteConfidence || "";
      leadNextStepRequiredInput.value = leadPayload.nextStepRequired || "";
      leadPriorityInput.value = leadPayload.leadPriority || "";
      leadQuoteReviewPayloadInput.value = leadPayload.quoteReview ? JSON.stringify(leadPayload.quoteReview) : "";
      leadPayloadJsonInput.value = JSON.stringify(leadPayload);
    }

    async function submitLeadToNetlifyForm(leadPayload, submitPayload) {
      if (!canUseLeadCaptureRuntime()) {
        throw new Error("Lead capture is unavailable in local file mode.");
      }

      syncLeadFormFields(leadPayload);

      const input = getFormInput();
      const deliveryEmail = getDeliveryEmailAddress(input);
      const sendCustomerCopy = !!(input.emailQuoteCopy && deliveryEmail);
      if (sendCustomerCopy && window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
        window.OperonTracking.trackEvent("quote_email_send_attempt", {
          quote_id: state.lastQuoteId || "",
          email_source: "submit_quote",
          has_customer_email: true
        });
      }
      const response = await window.fetch(SAVE_QUOTE_REQUEST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "submit_quote",
          quoteId: state.lastQuoteId || "",
          payload: submitPayload,
          emailTo: deliveryEmail,
          sendCustomerCopy: sendCustomerCopy,
          turnstileToken: await getSecurityChallengeToken("quote_submit")
        })
      });

      const result = await response.json().catch(function () {
        return null;
      });

      if (!response.ok) {
        throw createSubmitStageError("runtime_submit", new Error(result && result.error ? result.error : "Quote submission failed."));
      }

      if (!result || !result.ok || !result.quoteId) {
        throw createSubmitStageError("runtime_submit", new Error("Quote submission failed."));
      }

      state.lastQuoteId = result.quoteId;
      if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function" && result.emailAttempted) {
        const emailPayload = {
          quote_id: result.quoteId || state.lastQuoteId || "",
          email_source: "submit_quote",
          email_attempted: !!result.emailAttempted,
          customer_email_sent: !!result.customerEmailSent,
          internal_notification_sent: !!result.internalNotificationSent,
          has_customer_email: sendCustomerCopy
        };
        if (result.customerEmailSent || result.internalNotificationSent) {
          window.OperonTracking.trackEvent("quote_email_send_success", emailPayload);
        }
        if (result.customerEmailError || result.internalNotificationError || (sendCustomerCopy && !result.customerEmailSent)) {
          window.OperonTracking.trackEvent("quote_email_send_failed", emailPayload);
        }
      }
      return result;
    }

    async function sendQuoteEmailCopy(payload, emailTo) {
      if (!canUseLeadCaptureRuntime()) {
        throw new Error("Quote email is unavailable in local file mode.");
      }

      if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
        window.OperonTracking.trackEvent("quote_email_send_attempt", {
          has_customer_email: !!emailTo,
          quote_id: state.lastQuoteId || ""
        });
      }

      const response = await window.fetch(SEND_QUOTE_EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "email_quote",
          quoteId: state.lastQuoteId || "",
          payload: payload,
          emailTo: emailTo,
          turnstileToken: await getSecurityChallengeToken("quote_email")
        })
      });

      const result = await response.json().catch(function () {
        return null;
      });

      if (!response.ok || !result || !result.ok) {
        if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
          window.OperonTracking.trackEvent("quote_email_send_failed", {
            quote_id: state.lastQuoteId || "",
            has_customer_email: !!emailTo
          });
        }
        throw createSubmitStageError("quote_email", new Error(result && result.error ? result.error : "Quote email send failed."));
      }

      if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
        window.OperonTracking.trackEvent("quote_email_send_success", {
          quote_id: result.quoteId || state.lastQuoteId || "",
          customer_email_sent: !!result.customerEmailSent,
          internal_notification_sent: !!result.internalNotificationSent
        });
        if (result.internalNotificationSent) {
          window.OperonTracking.trackEvent("internal_quote_notification_sent", {
            quote_id: result.quoteId || state.lastQuoteId || ""
          });
        }
      }

      return result;
    }

    function getLeadCaptureErrorMessage(error) {
      const rawMessage = error && error.message ? String(error.message) : "";

      if (/Lead capture is unavailable/i.test(rawMessage)) {
        return "Quote submission is not available in this preview. Please use the live site or contact Operon.";
      }

      if (/Netlify form submission failed/i.test(rawMessage)) {
        return "We could not send the quote request right now. Your details are saved in this browser, so you can try again without losing the quote.";
      }

      return "We could not send the quote request right now. Your details are saved in this browser, so you can try again without losing the quote.";
    }

    function getIdleQuoteStatusMessage() {
      return "Review the estimate, then submit your quote request when you are ready.";
    }

    async function saveQuoteDraftToNetlify(payload) {
      const signature = JSON.stringify(payload);
      if (state.lastQuoteId && state.lastSavedDraftSignature === signature) {
        return {
          ok: true,
          quoteId: state.lastQuoteId,
          skipped: true
        };
      }

      const response = await window.fetch(SAVE_QUOTE_REQUEST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "draft",
          quoteId: state.lastQuoteId || "",
          payload: payload
        })
      });

      const result = await response.json().catch(function () {
        return null;
      });

      if (!response.ok || !result || !result.ok || !result.quoteId) {
        throw createSubmitStageError("netlify_quote_draft", new Error(result && result.error ? result.error : "Netlify quote draft save failed."));
      }

      state.lastQuoteId = result.quoteId;
      state.lastSavedDraftSignature = signature;
      saveDraft();
      return result;
    }

    async function saveQuoteRequest(payload) {
      if (!operonSupabase) {
        throw new Error("Supabase is not configured.");
      }

      const quoteId = createQuoteUuid();
      const row = {
        id: quoteId,
        customer_name: payload.customer.name,
        phone: payload.customer.phone,
        email: payload.customer.email,
        site_address: payload.customer.siteAddress,
        suburb: payload.customer.suburb,
        postcode: payload.customer.postcode,
        property_type: payload.property.type,
        property_level: payload.property.level,
        has_lift: payload.property.hasLift,
        parking_access: payload.property.parking,
        quote_mode: payload.job.quoteMode,
        product_category: payload.job.productCategory,
        product_name: payload.job.productName,
        flooring_pattern: payload.job.flooringPattern,
        measurement_method: payload.measurement.method,
        real_area: payload.measurement.realArea,
        chargeable_area: payload.measurement.chargeableArea,
        room_count: payload.measurement.roomCount || 0,
        subtotal_ex_gst: payload.pricing.subtotalExGst,
        gst: payload.pricing.gst,
        total_inc_gst: payload.pricing.totalIncGst,
        manual_review_required: payload.manualReviewRequired,
        status: "new",
        source_page: payload.sourcePage,
        raw_payload: payload
      };

      const result = await operonSupabase
        .from("quote_requests")
        .insert(row);

      if (result.error) {
        console.error("Failed to save quote request.");
        throw createSubmitStageError("quote_request", result.error);
      }

      return { id: quoteId };
    }

    async function saveQuoteRooms(quoteId, rooms) {
      if (!operonSupabase || !rooms || !rooms.length) {
        return [];
      }

      const rows = rooms.map(function (room) {
        return {
          quote_id: quoteId,
          room_name: room.roomName || room.name || "Room",
          length_m: room.lengthM || room.length || null,
          width_m: room.widthM || room.width || null,
          area_m2: room.areaM2 || room.area || null,
          included: room.included !== false,
          source: room.source || "index_room_by_room",
          raw_payload: room
        };
      });

      const result = await operonSupabase
        .from("quote_rooms")
        .insert(rows);

      if (result.error) {
        console.error("Failed to save quote rooms.");
        throw createSubmitStageError("quote_rooms", result.error);
      }

      return [];
    }

    async function saveQuoteItems(quoteId, items) {
      if (!operonSupabase || !items || !items.length) {
        return [];
      }

      const rows = items.map(function (item) {
        return {
          quote_id: quoteId,
          item_type: item.type || item.itemType || "item",
          label: item.label || item.name || "Quote item",
          quantity: item.quantity || null,
          unit: item.unit || null,
          unit_basis: item.unitBasis || null,
          amount_ex_gst: item.amountExGst || item.amount || null,
          raw_payload: item.rawPayload || item
        };
      });

      const result = await operonSupabase
        .from("quote_items")
        .insert(rows);

      if (result.error) {
        console.error("Failed to save quote items.");
        throw createSubmitStageError("quote_items", result.error);
      }

      return [];
    }

    async function uploadQuoteFile(quoteId, file, source) {
      if (!file || typeof window.fetch !== "function") {
        return null;
      }

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
      const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
      const fileName = String(file.name || "").trim();
      const lowerName = fileName.toLowerCase();
      const hasAllowedExtension = allowedExtensions.some(function (extension) {
        return lowerName.endsWith(extension);
      });

      if (!hasAllowedExtension || allowedTypes.indexOf(String(file.type || "").toLowerCase()) < 0) {
        throw new Error("Use a PDF, JPG, PNG or WEBP file.");
      }

      if (file.size > 6 * 1024 * 1024) {
        throw new Error("File is larger than the recommended 6MB limit.");
      }

      const extension = allowedExtensions.find(function (item) {
        return lowerName.endsWith(item);
      }) || "";
      const safeDisplayName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 140) || "uploaded-file";

      const dataBase64 = await new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function () {
          resolve(String(reader.result || ""));
        };
        reader.onerror = function () {
          reject(new Error("Could not read the selected file."));
        };
        reader.readAsDataURL(file);
      });

      const response = await window.fetch(UPLOAD_CUSTOMER_FILE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quoteId: quoteId,
          source: source || "quote",
          turnstileToken: await getSecurityChallengeToken("quote_file_upload"),
          file: {
            name: safeDisplayName || ("uploaded-file" + extension),
            type: file.type,
            size: file.size,
            dataBase64: dataBase64
          }
        })
      });
      const payload = await response.json().catch(function () {
        return null;
      });

      if (!response.ok || !payload || !payload.ok) {
        throw createSubmitStageError("file_upload", new Error(payload && payload.error ? payload.error : "File upload failed."));
      }

      return {
        id: payload.uploaded_file_id || null,
        quote_id: quoteId,
        file_name: payload.safe_filename || safeDisplayName,
        file_type: payload.file_type,
        file_size_bytes: payload.file_size_bytes,
        source: source || "quote.html",
        status: payload.status || "uploaded",
        metadata_saved: Boolean(payload.metadata_saved),
        raw_payload: {
          type: payload.file_type,
          size: payload.file_size_bytes,
          status: payload.status || "uploaded"
        }
      };
    }

    function setQuoteSubmitLoading(isLoading, actionLabel) {
      if (isLoading) {
        state.submitState = "saving";
      } else if (state.submitState === "saving") {
        state.submitState = "idle";
      }
      const isComplete = state.submitState === "success" || state.submitState === "partial_success_file_failed";
      const idleLabel = isComplete ? "Quote submitted" : "Submit quote request";
      const activeLabel = isLoading ? (actionLabel || "Working...") : idleLabel;

      wizardSubmitButton.disabled = isLoading || isComplete;
      wizardBackButton.disabled = isLoading || currentQuoteStep === 0;
      wizardNextButton.disabled = isLoading;
      wizardSubmitButton.textContent = activeLabel;
      updateQuoteCtaSystem();
    }

    function showQuoteSubmitMessage(type, message) {
      state.submitState = type;
      requestStatus.textContent = message;
      requestStatus.dataset.state = type;
      requestStatusBox.hidden = false;
      updateQuoteCtaSystem();
    }

    function clearQuoteSubmitMessage() {
      state.submitState = "idle";
      requestStatus.textContent = "";
      delete requestStatus.dataset.state;
      requestStatusBox.hidden = true;
      updateQuoteCtaSystem();
    }

    function showQuoteSubmitSuccess(message) {
      showQuoteSubmitMessage("success", message);
    }

    function showQuoteSubmitError(message) {
      showQuoteSubmitMessage("error", message);
    }

    async function submitQuoteRequest(event) {
      if (event) {
        event.preventDefault();
      }

      let leadPayload = null;
      let submitPayload = null;
      clearQuoteSubmitMessage();
      setQuoteSubmitLoading(true, "Submitting request...");

      try {
        const input = getFormInput();
        const errors = validateQuoteInput(input, { requireDeliveryEmail: !!input.emailQuoteCopy });
        const summaryIssues = getQuoteSummaryConsistencyIssues(input, getCurrentQuoteResult());
        if (errors.length || summaryIssues.length) {
          const submitValidationMessage = errors[0] || summaryIssues[0] || "Please review the quote details and try again.";
          showWizardValidationMessage(submitValidationMessage);
          focusFirstInvalidField(currentQuoteStep);
          if (window.OperonTracking) {
            window.OperonTracking.trackQuoteStepError(7, "summary", submitValidationMessage, "submit_validation");
          }
          showQuoteSubmitError(submitValidationMessage);
          return;
        }
        submitPayload = await buildQuotePayload();
        leadPayload = buildLeadPayloadFromQuotePayload(submitPayload);
        saveLastSubmittedLeadBackup(leadPayload, "pending");
        syncLeadFormFields(leadPayload);
        if (window.OperonTracking) {
          window.OperonTracking.trackQuoteSubmitAttempt(
            leadPayload.quoteTotal,
            submitPayload.job.quoteMode,
            leadPayload.realArea
          );
        }
        window.__operonSuppressAbandon = true;
        localStorage.setItem("operon_last_quote_value", String(submitPayload.pricing.totalIncGst || 0));
        localStorage.setItem("operon_last_quote_type", submitPayload.job.quoteMode || "");
        if (shouldUseLocalReviewOnlyMode()) {
          const localPreviewMessage = "Quote submission is not available in this preview. Your details are saved in this browser.";
          saveLastSubmittedLeadBackup(leadPayload, "error");
          renderLeadRecoveryBanner();
          if (window.OperonTracking) {
            window.OperonTracking.trackQuoteStepError(7, "summary", localPreviewMessage, "runtime_blocked");
            window.OperonTracking.trackQuoteSubmitError(
              localPreviewMessage,
              submitPayload.job.quoteMode,
              leadPayload.realArea
            );
          }
          showQuoteSubmitError(localPreviewMessage);
          return;
        }

        try {
          await saveQuoteDraftToNetlify(submitPayload);
        } catch (draftError) {
          console.error("Quote draft save failed before final submit.");
        }

        const submitResult = await submitLeadToNetlifyForm(leadPayload, submitPayload);

        const deliveryEmail = getDeliveryEmailAddress(input);
        let successMessage = "Quote submitted. We will review the details and contact you shortly.";
        if (deliveryEmail && input.emailQuoteCopy) {
          if (submitResult && submitResult.customerEmailSent) {
            successMessage = "Quote submitted. Your estimate has been emailed and our team will review the details shortly.";
          } else if (submitResult && submitResult.emailAttempted) {
            successMessage = "Your request was saved, but email copy could not be sent. We will follow up directly.";
          } else {
            successMessage = "Quote submitted. We received your request and will send the estimate during follow-up.";
          }
        }

        clearLastSubmittedLeadBackup();
        renderLeadRecoveryBanner();
        if (window.OperonTracking) {
          window.OperonTracking.trackQuoteStepCompleted(7, "summary");
          window.OperonTracking.trackQuoteSubmitSuccess(
            leadPayload.createdAt,
            leadPayload.quoteTotal,
            submitPayload.job.quoteMode,
            leadPayload.realArea
          );
        }
        showQuoteSubmitSuccess(successMessage + " Redirecting...");
        setQuoteSubmitLoading(false);
        window.setTimeout(function () {
          window.location.href = "thank-you.html";
        }, 1400);
        return;
      } catch (error) {
        console.error("Quote submit failed.");
        const message = getLeadCaptureErrorMessage(error);
        if (leadPayload) {
          saveLastSubmittedLeadBackup(leadPayload, "error");
          renderLeadRecoveryBanner();
        }
        if (window.OperonTracking) {
          window.OperonTracking.trackQuoteStepError(7, "summary", message, "submit_error");
          window.OperonTracking.trackQuoteSubmitError(
            message,
            getInputValue("quoteMode"),
            state.currentQuoteResult ? Number(state.currentQuoteResult.realArea || 0) : Number(getInputValue("totalAreaM2") || 0)
          );
        }
        showQuoteSubmitError(message);
      } finally {
        setQuoteSubmitLoading(false);
      }
    }

    function wireEvents() {
      productGrid.addEventListener("click", function (event) {
        const button = event.target.closest("[data-product-category]");
        if (!button) {
          return;
        }
        setSelectedCategory(button.getAttribute("data-product-category"));
        renderAll();
      });

      productChoiceModeChoices.addEventListener("click", function (event) {
        const button = event.target.closest("[data-product-choice-mode]");
        if (!button) {
          return;
        }

        setProductChoiceMode(button.getAttribute("data-product-choice-mode"), { track: true });
        renderAll();
      });

      productRangeSelect.addEventListener("change", function (event) {
        setSelectedRange(event.target.value, { persist: true, track: true });
        renderAll();
      });

      productColourSelect.addEventListener("change", function (event) {
        setSelectedColourValue(event.target.value, { persist: true, track: true });
        renderAll();
      });

      productOptionSelect.addEventListener("change", function (event) {
        if (!event.target.value) {
          clearSpecificProductSelection();
          renderAll();
          return;
        }
        setSelectedProductById(event.target.value, { persist: true, track: true });
        renderAll();
      });

      clearSelectedProductButton.addEventListener("click", function () {
        clearSpecificProductSelection();
        renderAll();
      });

      browseCategoryLink.addEventListener("click", function (event) {
        if (browseCategoryLink.dataset.behavior !== "change-range") {
          return;
        }

        event.preventDefault();
        setProductChoiceMode("choose_range", { track: true });
        renderAll();
        if (productRangeSelect && !productRangeField.hidden) {
          productRangeSelect.focus();
        }
      });

      document.getElementById("quoteModeChoices").addEventListener("click", function (event) {
        const button = event.target.closest("[data-quote-mode]");
        if (!button) {
          return;
        }
        setQuoteMode(button.getAttribute("data-quote-mode"));
      });

      document.getElementById("measurementChoices").addEventListener("click", function (event) {
        const button = event.target.closest("[data-measurement]");
        if (!button) {
          return;
        }
        setMeasurementMethod(button.getAttribute("data-measurement"));
      });

      if (unknownMeasurementChoices) {
        unknownMeasurementChoices.addEventListener("click", function (event) {
          const button = event.target.closest("[data-unknown-next-step]");
          if (!button) {
            return;
          }
          setUnknownMeasurementNextStep(button.getAttribute("data-unknown-next-step"));
        });
      }

      const stairsChoiceButtons = document.getElementById("stairsChoiceButtons");
      if (stairsChoiceButtons) {
        stairsChoiceButtons.addEventListener("click", function (event) {
          const button = event.target.closest("[data-stairs-choice]");
          if (!button) {
            return;
          }
          setStairsChoice(button.getAttribute("data-stairs-choice"));
          renderAll();
        });
      }

      const stairWidthKnownButtons = document.getElementById("stairWidthKnownButtons");
      if (stairWidthKnownButtons) {
        stairWidthKnownButtons.addEventListener("click", function (event) {
          const button = event.target.closest("[data-stair-width-known]");
          if (!button) {
            return;
          }
          setStairWidthKnown(button.getAttribute("data-stair-width-known"));
          renderAll();
        });
      }

      const stairQuantityFields = document.getElementById("stairQuantityFields");
      if (stairQuantityFields) {
        stairQuantityFields.addEventListener("input", function (event) {
          if (!event.target || !event.target.matches("input[type='number']")) {
            return;
          }
          syncStairDetailCounts();
          renderAll();
        });
      }

      quoteForm.addEventListener("click", function (event) {
        const button = event.target.closest("[data-extra-field][data-extra-choice]");
        if (!button) {
          return;
        }
        if (button.disabled) {
          return;
        }
        setExtraDecision(button.getAttribute("data-extra-field"), button.getAttribute("data-extra-choice"));
        renderAll();
      });

      if (underlaySelect) {
        underlaySelect.addEventListener("change", function () {
          setInputValue("underlayDecision", "yes");
          setInputValue("underlayId", underlaySelect.value);
          renderAll();
        });
      }

      const extrasStandardSetupButton = document.getElementById("extrasStandardSetupButton");
      if (extrasStandardSetupButton) {
        extrasStandardSetupButton.addEventListener("click", function () {
          applyStandardExtrasSetup();
          renderAll();
        });
      }

      document.getElementById("addRoomButton").addEventListener("click", addRoom);

      roomList.addEventListener("click", function (event) {
        const roomId = event.target.getAttribute("data-remove-room");
        if (roomId) {
          removeRoom(roomId);
        }
      });

      roomList.addEventListener("input", function (event) {
        const field = event.target.getAttribute("data-room-field");
        if (!field) {
          return;
        }
        const roomRow = event.target.closest(".room-row");
        if (!roomRow) {
          return;
        }
        updateRoom(roomRow.getAttribute("data-room-id"), field, event.target.value);
      });

      quoteForm.addEventListener("input", function (event) {
        if (event.target.type === "file") {
          return;
        }
        if (window.OperonTracking) {
          window.OperonTracking.trackQuoteStart();
        }
        clearWizardValidationMessage();
        updateConditionalQuoteFields();
        refreshQuoteEstimate({ render: true, track: true });
        saveDraft();
        updateQuoteCtaSystem();
      });

      quoteForm.addEventListener("change", function (event) {
        clearWizardValidationMessage();
        if (currentQuoteStep === 5 && event.target && event.target.matches("#fullName, #phone, #quoteDeliveryEmail, #emailQuoteCopy, #customerNotes")) {
          updateConditionalQuoteFields();
          refreshQuoteEstimate({ render: true, track: true });
          saveDraft();
          updateQuoteCtaSystem();
          return;
        }
        renderAll();
        updateQuoteCtaSystem();
      });

      leadRecoveryButton.addEventListener("click", function () {
        showQuoteStep(5, { scrollMode: "top" });
      });

      document.getElementById("loadFloorplanAreaButton").addEventListener("click", function () {
        applyFloorplanHandoff();
        renderAll();
        showQuoteStep(2, { scrollMode: "top" });
      });
      confirmFloorplanHandoffButton.addEventListener("click", function () {
        applyFloorplanHandoff();
        renderAll();
        showQuoteStep(2, { scrollMode: "top" });
      });
      dismissFloorplanHandoffButton.addEventListener("click", function () {
        state.floorplanHandoffDismissed = true;
        floorplanHandoffCard.classList.remove("active");
        floorplanStatus.textContent = "Keep your current measurement, or use the saved floor plan area when ready.";
      });

      document.getElementById("resetQuoteButton").addEventListener("click", resetQuote);
      const summaryEditButton = document.getElementById("summaryEditButton");
      if (summaryEditButton) {
        summaryEditButton.addEventListener("click", function () {
          showQuoteStep(4, { scrollMode: "top" });
        });
      }
      wizardBackButton.addEventListener("click", goToPreviousQuoteStep);
      wizardNextButton.addEventListener("click", goToNextQuoteStep);

      quoteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (currentQuoteStep !== getQuoteSteps().length - 1) {
          goToNextQuoteStep();
          return;
        }
        submitQuoteRequest(event);
      });

      headerQuoteButton.addEventListener("click", function (event) {
        event.preventDefault();
        focusQuoteFlow();
      });

      if (heroQuoteButton) {
        heroQuoteButton.addEventListener("click", function (event) {
          event.preventDefault();
          focusQuoteFlow();
        });
      }

      stickyQuoteButton.addEventListener("click", function () {
        focusQuoteFlow();
      });

      window.addEventListener("scroll", updateQuoteCtaSystem, { passive: true });
      window.addEventListener("resize", updateQuoteCtaSystem);
    }

    async function initialise() {
      setFloorplanLinks();
      if (window.OperonTracking && (false || window.location.search.indexOf("quoteStep=") >= 0)) {
        window.OperonTracking.trackQuoteStart();
      }

      await loadQuoteRuntimeHealth();

      state.rooms = [createEmptyRoom("Living room")];
      loadDraft();

      if (!state.rooms.length) {
        state.rooms = [createEmptyRoom("Living room")];
      }

      const storedCategory = PRODUCT_LIBRARY ? PRODUCT_LIBRARY.getStoredCategory() : "";
      if (!restoreStoredProductSelection() && storedCategory) {
        setSelectedCategory(storedCategory, { preserveProduct: false });
      }

      buildRooms();
      buildProducts();
      wireEvents();
      readFloorplanHandoffState();

      const measurementMethod = getInputValue("measurementMethod") || "manual_total";
      const quoteMode = getInputValue("quoteMode") || "supply_install";
      const selectedProductCategory = getPreferredProductCategory();
      const selectedProduct = (PRODUCT_LIBRARY && PRODUCT_LIBRARY.getProductById(getInputValue("selectedProduct")))
        ? getInputValue("selectedProduct")
        : "";
      const selectedRangeId = getInputValue("selectedRangeId");
      const productChoiceMode = getProductChoiceMode();

      setInputValue("measurementMethod", measurementMethod);
      setInputValue("quoteMode", quoteMode);
      setInputValue("selectedProductCategory", selectedProductCategory);
      setInputValue("selectedProduct", selectedProduct);
      setInputValue("selectedRangeId", selectedRangeId);
      setInputValue("productChoiceMode", productChoiceMode);

      applyQuotePageHandoffState();
      setMeasurementMethod(measurementMethod);
      setQuoteMode(quoteMode);
      setSelectedCategory(selectedProductCategory, { preserveProduct: true });
      setProductChoiceMode(productChoiceMode, { track: false });
      if (selectedProduct) {
        setSelectedProductById(selectedProduct, {
          persist: false,
          choiceMode: selectedRangeId ? "choose_range" : productChoiceMode
        });
      }
      renderAll();
      renderLeadRecoveryBanner();
      if (state.productSelectionLoadedFromCatalogue && window.OperonTracking) {
        window.OperonTracking.trackEvent("quote_start_from_product", {
          category: getSelectedProductCategory(),
          product: getInputValue("selectedProduct") || "estimate"
        });
      }
      window.addEventListener("operon-pricing-source-ready", refreshQuoteFromPricingSource);
      if (window.OperonPricingSource) {
        const pricingSourceStatus = window.OperonPricingSource.getStatus();
        if (pricingSourceStatus.ready) {
          refreshQuoteFromPricingSource();
        }
      }
      showQuoteStep(currentQuoteStep || 0, { scrollMode: false ? "top" : "none" });
      window.addEventListener("beforeunload", function () {
        if (window.__operonSuppressAbandon) {
          return;
        }
        if (window.OperonTracking) {
          const meta = getQuoteStepMeta()[currentQuoteStep];
          window.OperonTracking.trackQuoteAbandon(
            currentQuoteStep + 1,
            meta ? meta.trackingName : "step_" + (currentQuoteStep + 1)
          );
        }
      });
    }

    initialise();
