(function () {
  const PROMPTS = window.OperonChatbotPrompts;
  const POLICY = window.OperonChatbotPolicy;
  const KNOWLEDGE = window.OperonChatbotKnowledge;
  const SCENARIOS = window.OperonChatbotScenarios;
  const MAPPER = window.OperonChatbotStateMapper;
  const SITE_STATE = window.OperonChatbotSiteState;

  function createMessage(role, text, actions) {
    return {
      id: "msg_" + Math.random().toString(36).slice(2, 10),
      role: role,
      text: text,
      actions: Array.isArray(actions) ? actions.slice() : []
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function includesAny(value, words) {
    return words.some(function (word) {
      return value.indexOf(word) >= 0;
    });
  }

  function inferIntent(text) {
    if (POLICY && typeof POLICY.classifyIntent === "function") {
      return POLICY.classifyIntent(text);
    }

    const value = String(text || "").toLowerCase();

    if (!value) {
      return "";
    }
    if (value.indexOf("quote") >= 0 || value.indexOf("estimate") >= 0) {
      return "quote";
    }
    if (value.indexOf("product") >= 0 || value.indexOf("hybrid") >= 0 || value.indexOf("laminate") >= 0 || value.indexOf("engineered") >= 0) {
      return "product";
    }
    if (value.indexOf("review") >= 0 || value.indexOf("scope") >= 0 || value.indexOf("missing") >= 0) {
      return "review";
    }
    return "details";
  }

  function createChatbotLogic(options) {
    const settings = Object.assign({
      onUpdate: function () {},
      pageKey: "default",
      welcomeText: "",
      initialRouteLabel: "Start quote",
      initialRouteHref: "/quote.html",
      enableIdleSuggestions: false
    }, options || {});

    const prompts = PROMPTS || {};
    const mapper = MAPPER;
    const policy = POLICY || null;
    const knowledge = KNOWLEDGE || null;
    const scenarios = SCENARIOS || null;

    if (!prompts.copy || !prompts.actions || !prompts.categoryGuidance || !mapper) {
      throw new Error("Operon chatbot dependencies are missing.");
    }

    const state = {
      stage: "welcome",
      transcript: [],
      draft: mapper.createDraft(),
      routeSuggestion: {
        label: settings.initialRouteLabel,
        href: normaliseRouteHref(settings.initialRouteHref)
      },
      prequalification: {
        active: false,
        stepIndex: 0,
        answers: {}
      },
      quoteReviewGuide: {
        active: false,
        stepIndex: 0,
        answers: {}
      },
      triggerNudge: null,
      recommendationSignal: "",
      operatorHandoff: null
    };

    let idleTimer = null;
    let idleSuggestionShown = false;
    const triggersShown = {};

    function readSiteState() {
      if (!SITE_STATE || typeof SITE_STATE.getSnapshot !== "function") {
        return null;
      }

      try {
        return SITE_STATE.getSnapshot({ pageKey: settings.pageKey });
      } catch (error) {
        return null;
      }
    }

    function sync() {
      const structured = mapper.toStructuredOutput(state.draft);
      const siteState = readSiteState();
      settings.onUpdate({
        stage: state.stage,
        transcript: clone(state.transcript),
        draft: clone(state.draft),
        siteState: siteState ? clone(siteState) : null,
        structuredOutput: structured,
        quoteFieldDraft: mapper.toQuoteFieldDraft(structured),
        localStorageDraft: mapper.toLocalStorageDraft(structured),
        handoffReadiness: mapper.toHandoffReadiness(structured),
        routeSuggestion: clone(state.routeSuggestion),
        prequalification: clone(state.prequalification),
        quoteReviewGuide: clone(state.quoteReviewGuide),
        operatorHandoff: state.operatorHandoff ? clone(state.operatorHandoff) : null,
        triggerNudge: state.triggerNudge ? clone(state.triggerNudge) : null
      });
    }

    function pushAssistant(text, actions) {
      state.transcript.push(createMessage("assistant", text, actions));
      sync();
    }

    function compact(value, fallback) {
      return String(value || fallback || "").replace(/\s+/g, " ").trim();
    }

    function oneQuestion(value) {
      const text = compact(value);
      if (!text) {
        return "";
      }

      const firstQuestionIndex = text.indexOf("?");
      if (firstQuestionIndex < 0) {
        return text;
      }

      return text.slice(0, firstQuestionIndex + 1);
    }

    function normaliseRouteHref(href) {
      const value = compact(href, "/quote.html");
      if (/^(https?:|mailto:|tel:|#)/i.test(value)) {
        return value;
      }
      if (value.charAt(0) === "/") {
        return value;
      }
      return "/" + value;
    }

    const PREQUAL_STEPS = [
      {
        key: "suburb",
        question: "What suburb is the job in?",
        actions: "prequalSuburb",
        text: true
      },
      {
        key: "property_type",
        question: "Is it a house, townhouse, apartment/unit, or commercial space?",
        actions: "prequalProperty"
      },
      {
        key: "product_category",
        question: "What flooring type are you considering?",
        actions: "prequalFlooring",
        text: true
      },
      {
        key: "area_status",
        question: "Do you know the approximate area?",
        actions: "prequalArea",
        text: true
      },
      {
        key: "stairs_status",
        question: "Are there stairs?",
        actions: "prequalYesNo"
      },
      {
        key: "removal_status",
        question: "Is there old flooring to remove?",
        actions: "prequalYesNo"
      },
      {
        key: "documents_status",
        question: "Do you have a floor plan or written quote?",
        actions: "prequalFiles"
      }
    ];

    const QUOTE_REVIEW_CHECKLIST_STEPS = [
      { key: "product_shown", question: "Does the quote show the product brand, range or colour?" },
      { key: "area_shown", question: "Does it show the flooring area or measured square metres?" },
      { key: "installation_included", question: "Does it clearly say installation is included?" },
      { key: "removal_disposal_included", question: "Does it mention old flooring removal or disposal?" },
      { key: "trims_stairs_listed", question: "Are trims, skirting, scotia or stairs listed if relevant?" },
      { key: "exclusions_listed", question: "Are exclusions or variation conditions listed?" }
    ];

    function getPrequalActions(step) {
      if (!step || !prompts.actions) {
        return [];
      }
      return prompts.actions[step.actions] || prompts.actions.nextSteps || [];
    }

    function getCurrentPrequalStep() {
      return PREQUAL_STEPS[state.prequalification.stepIndex] || null;
    }

    function startPrequalification() {
      state.stage = "quote_prequalification";
      state.prequalification = {
        active: true,
        stepIndex: 0,
        answers: {}
      };
      setIntent("start_quote", {
        readiness: "unsure",
        reason: "chatbot quote prequalification"
      });
      setRoute("Start quote", "/quote.html?source=chatbot#quoteForm");
      const firstStep = getCurrentPrequalStep();
      pushGuided(
        "I can collect a few basics before the quote form.",
        "You can answer, say Not sure, or skip any question.",
        firstStep ? firstStep.question : "Start the quote.",
        getPrequalActions(firstStep)
      );
    }

    function normalisePrequalValue(stepKey, rawValue) {
      const value = compact(rawValue).toLowerCase();
      if (!value || value === "skip" || value === "prequal_skip") {
        return "skipped";
      }
      if (includesAny(value, ["not sure", "unsure", "unknown", "prequal_not_sure"])) {
        return "not_sure";
      }
      if (stepKey === "property_type") {
        if (includesAny(value, ["house", "family_home", "prequal_property_house"])) return "house";
        if (includesAny(value, ["townhouse", "town house", "prequal_property_townhouse"])) return "townhouse";
        if (includesAny(value, ["apartment", "unit", "strata", "prequal_property_apartment"])) return "apartment";
        if (includesAny(value, ["commercial", "shop", "office", "prequal_property_commercial"])) return "commercial";
        return "not_sure";
      }
      if (stepKey === "product_category") {
        if (includesAny(value, ["hybrid", "prequal_flooring_hybrid"])) return "hybrid";
        if (includesAny(value, ["laminate", "prequal_flooring_laminate"])) return "laminate";
        if (includesAny(value, ["engineered", "timber", "prequal_flooring_engineered"])) return "engineered_timber";
        return "not_sure";
      }
      if (stepKey === "area_status") {
        const numberMatch = value.match(/\d+(\.\d+)?/);
        if (numberMatch) {
          return "known:" + numberMatch[0];
        }
        if (value === "yes" || value === "prequal_area_known" || includesAny(value, ["rough", "approx", "known"])) {
          return "known";
        }
        return "not_sure";
      }
      if (stepKey === "stairs_status" || stepKey === "removal_status") {
        if (value === "yes" || value === "prequal_yes" || includesAny(value, ["there are", "some", "stairs", "remove", "carpet", "tile", "old floor"])) return "yes";
        if (value === "no" || value === "prequal_no" || includesAny(value, ["none", "no stairs", "no removal", "nothing"])) return "no";
        return "not_sure";
      }
      if (stepKey === "documents_status") {
        const hasFloorplan = includesAny(value, ["floor plan", "floorplan", "plan", "prequal_file_floorplan", "prequal_file_both"]);
        const hasQuote = includesAny(value, ["written quote", "existing quote", "quote", "prequal_file_quote", "prequal_file_both"]);
        if (hasFloorplan && hasQuote) return "both";
        if (hasFloorplan) return "floorplan";
        if (hasQuote) return "quote";
        if (value === "no" || value === "prequal_file_neither" || includesAny(value, ["neither", "none"])) return "none";
        return "not_sure";
      }
      return compact(rawValue).slice(0, 80) || "skipped";
    }

    function getDisplayPrequalValue(stepKey, value) {
      if (!value || value === "skipped") return "Skipped";
      if (value === "not_sure") return "Not sure";
      if (value.indexOf("known:") === 0) return value.replace("known:", "") + " m2";
      const labels = {
        house: "House",
        townhouse: "Townhouse",
        unit_apartment: "Apartment/unit",
        commercial_other: "Commercial space",
        hybrid: "Hybrid",
        laminate: "Laminate",
        engineered: "Engineered timber",
        known: "Area known",
        yes: "Yes",
        no: "No",
        both: "Floor plan and written quote",
        floorplan: "Floor plan",
        quote: "Written quote",
        none: "No",
        apartment: "Apartment/unit",
        commercial: "Commercial space",
        engineered_timber: "Engineered timber",
        unknown: "Unknown",
        has_floorplan: "Has floor plan",
        no_floorplan: "No floor plan",
        has_quote: "Has written quote",
        no_quote: "No written quote",
        go_to_quote: "Go to quote",
        go_to_products: "Go to products",
        go_to_quote_review: "Go to quote review",
        go_to_floorplan: "Go to floor plan",
        request_contact: "Request contact",
        continue_chat: "Continue chat"
      };
      return labels[value] || value;
    }

    function toQuoteCategory(value) {
      if (value === "engineered_timber") return "engineered";
      return ["hybrid", "laminate", "engineered"].indexOf(value) >= 0 ? value : "";
    }

    function toContractPropertyType(value) {
      if (value === "unit_apartment") return "apartment";
      if (value === "commercial_other") return "commercial";
      if (["house", "townhouse", "apartment", "commercial", "not_sure"].indexOf(value) >= 0) return value;
      return "not_sure";
    }

    function toContractProductCategory(value) {
      if (value === "engineered") return "engineered_timber";
      if (["hybrid", "laminate", "engineered_timber", "not_sure"].indexOf(value) >= 0) return value;
      return "not_sure";
    }

    function toYesNoNotSure(value) {
      return value === "yes" || value === "no" ? value : "not_sure";
    }

    function getAreaStatus(value, documentsStatus) {
      if (value === "known" || (value && value.indexOf("known:") === 0)) {
        return "known";
      }
      if (documentsStatus === "floorplan" || documentsStatus === "both") {
        return "has_floorplan";
      }
      if (value === "unknown") {
        return "unknown";
      }
      return "not_sure";
    }

    function getApproxArea(value) {
      if (!value || value.indexOf("known:") !== 0) {
        return undefined;
      }
      const area = Number(value.replace("known:", ""));
      return Number.isFinite(area) && area > 0 ? area : undefined;
    }

    function getFloorplanStatus(documentsStatus) {
      if (documentsStatus === "floorplan" || documentsStatus === "both") return "has_floorplan";
      if (documentsStatus === "none") return "no_floorplan";
      return "not_sure";
    }

    function getExistingQuoteStatus(documentsStatus) {
      if (documentsStatus === "quote" || documentsStatus === "both") return "has_quote";
      if (documentsStatus === "none") return "no_quote";
      return "not_sure";
    }

    function buildQualificationMissingInfo(summary) {
      const missing = [];
      if (!summary.suburb) missing.push("suburb");
      if (!summary.property_type || summary.property_type === "not_sure") missing.push("property_type");
      if (!summary.product_category || summary.product_category === "not_sure") missing.push("product_category");
      if (summary.area_status !== "known" && summary.area_status !== "has_floorplan") missing.push("area");
      if (summary.stairs_status === "not_sure") missing.push("stairs");
      if (summary.removal_status === "not_sure") missing.push("removal");
      if (summary.floorplan_status === "not_sure") missing.push("floorplan_status");
      if (summary.existing_quote_status === "not_sure") missing.push("existing_quote_status");
      return missing;
    }

    function getQualificationConfidence(summary) {
      const hasSuburb = !!summary.suburb;
      const hasProduct = summary.product_category && summary.product_category !== "not_sure";
      const hasArea = summary.area_status === "known" || summary.area_status === "has_floorplan";
      if (hasSuburb && hasProduct && hasArea) return "high";
      if (hasProduct || hasArea || hasSuburb) return "medium";
      return "low";
    }

    function getSourcePage() {
      if (settings.pageKey && settings.pageKey !== "default") {
        return settings.pageKey;
      }
      try {
        return window.location ? window.location.pathname : "";
      } catch (error) {
        return "";
      }
    }

    function getSourceUrl() {
      try {
        return window.location ? String(window.location.href || "") : "";
      } catch (error) {
        return "";
      }
    }

    function applyPrequalToDraft(answers) {
      const next = {
        intent: "start_quote",
        readiness: "review",
        reason: "chatbot quote prequalification"
      };
      const quoteCategory = toQuoteCategory(answers.product_category);
      if (quoteCategory) {
        next.category = quoteCategory;
        next.recommended_category = quoteCategory;
        next.selection_mode = "recommend";
      }
      const propertyMap = {
        house: "house",
        townhouse: "townhouse",
        apartment: "unit_apartment",
        commercial: "commercial_other"
      };
      if (answers.property_type && propertyMap[answers.property_type]) {
        next.property_type = propertyMap[answers.property_type];
        if (answers.property_type === "apartment") {
          next.access = "apartment";
        }
      }
      if (answers.area_status && answers.area_status.indexOf("known:") === 0) {
        const area = Number(answers.area_status.replace("known:", ""));
        if (Number.isFinite(area) && area > 0) {
          next.area = area;
          next.area_m2 = area;
          next.measurement_method = "manual_total";
        }
      } else if (answers.area_status === "known") {
        next.measurement_method = "manual_total";
      }
      if (answers.stairs_status === "yes") next.stairs = 1;
      if (answers.stairs_status === "no") next.stairs = 0;
      if (answers.removal_status === "yes") {
        next.existing_floor = "other";
        next.removal_disposal = "unsure";
      }
      if (answers.removal_status === "no") {
        next.existing_floor = "none";
        next.removal_disposal = "no";
      }
      const flags = [];
      if (answers.area_status === "not_sure" || answers.area_status === "skipped") flags.push("area_to_confirm");
      if (answers.stairs_status === "yes" || answers.stairs_status === "not_sure") flags.push("stairs_to_review");
      if (answers.removal_status === "yes" || answers.removal_status === "not_sure") flags.push("removal_to_review");
      if (answers.documents_status === "floorplan" || answers.documents_status === "both") flags.push("floorplan_available");
      if (answers.documents_status === "quote" || answers.documents_status === "both") flags.push("written_quote_available");
      if (flags.length) next.validation_flags = flags;
      setDraft(next);
    }

    function getPrequalSummary(answers) {
      const documentsStatus = answers.documents_status || "not_sure";
      const areaStatus = getAreaStatus(answers.area_status || "not_sure", documentsStatus);
      const approxArea = getApproxArea(answers.area_status || "");
      const summary = {
        source_page: getSourcePage(),
        source_url: getSourceUrl(),
        intent: "start_quote",
        suburb: answers.suburb && answers.suburb !== "not_sure" && answers.suburb !== "skipped" ? answers.suburb : "",
        property_type: toContractPropertyType(answers.property_type || "not_sure"),
        product_category: toContractProductCategory(answers.product_category || "not_sure"),
        area_status: areaStatus,
        stairs_status: toYesNoNotSure(answers.stairs_status),
        removal_status: toYesNoNotSure(answers.removal_status),
        floorplan_status: getFloorplanStatus(documentsStatus),
        existing_quote_status: getExistingQuoteStatus(documentsStatus),
        next_action: "go_to_quote",
        handoff_url: "",
        missing_info: [],
        confidence: "low"
      };
      if (typeof approxArea === "number") {
        summary.approx_area_m2 = approxArea;
      }
      summary.missing_info = buildQualificationMissingInfo(summary);
      summary.confidence = getQualificationConfidence(summary);
      summary.handoff_url = buildPrequalQuoteUrl(summary);
      return summary;
    }

    function buildPrequalQuoteUrl(summary) {
      const pairs = [
        ["source", "chatbot"]
      ];
      const quoteCategory = toQuoteCategory(summary.product_category);
      if (quoteCategory) pairs.push(["category", quoteCategory]);
      return "/quote.html?" + pairs.map(function (pair) {
        return encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
      }).join("&") + "#quoteForm";
    }

    function finishPrequalification() {
      const answers = state.prequalification.answers || {};
      const summary = getPrequalSummary(answers);
      applyPrequalToDraft(answers);
      state.prequalification = {
        active: false,
        stepIndex: PREQUAL_STEPS.length,
        answers: answers,
        summary: summary
      };
      state.stage = "prequal_complete";
      setRoute("Start quote", buildPrequalQuoteUrl(summary));
      pushGuided(
        "Great - I'll send you to the quote form with the details you know. Anything unsure can be reviewed later.",
        "Saved details: "
          + "suburb " + (summary.suburb || "not sure")
          + ", product " + getDisplayPrequalValue("product_category", summary.product_category)
          + ", area " + getDisplayPrequalValue("area_status", summary.area_status)
          + ".",
        "Open the quote form.",
        prompts.actions.nextSteps
      );
    }

    function answerPrequalification(rawValue) {
      const step = getCurrentPrequalStep();
      if (!step) {
        finishPrequalification();
        return;
      }
      const value = normalisePrequalValue(step.key, rawValue);
      state.prequalification.answers[step.key] = value;
      state.prequalification.stepIndex += 1;
      pushUser(getDisplayPrequalValue(step.key, value));
      const nextStep = getCurrentPrequalStep();
      if (!nextStep) {
        finishPrequalification();
        return;
      }
      pushGuided(
        "Got it.",
        "Not sure is okay.",
        nextStep.question,
        getPrequalActions(nextStep)
      );
    }

    function handlePrequalAction(actionId) {
      if (!state.prequalification.active) {
        return false;
      }
      const map = {
        prequal_skip: "skip",
        prequal_not_sure: "not sure",
        prequal_property_house: "house",
        prequal_property_townhouse: "townhouse",
        prequal_property_apartment: "apartment",
        prequal_property_commercial: "commercial",
        prequal_flooring_hybrid: "hybrid",
        prequal_flooring_laminate: "laminate",
        prequal_flooring_engineered: "engineered timber",
        prequal_flooring_unsure: "not sure",
        prequal_area_known: "yes",
        prequal_area_unknown: "not sure",
        prequal_yes: "yes",
        prequal_no: "no",
        prequal_file_floorplan: "floor plan",
        prequal_file_quote: "written quote",
        prequal_file_both: "floor plan and written quote",
        prequal_file_neither: "no"
      };
      if (!Object.prototype.hasOwnProperty.call(map, actionId)) {
        return false;
      }
      answerPrequalification(map[actionId]);
      return true;
    }

    function isPrequalTextExpected() {
      const step = getCurrentPrequalStep();
      return Boolean(state.prequalification.active && step && step.text);
    }

    function getCurrentQuoteReviewChecklistStep() {
      return QUOTE_REVIEW_CHECKLIST_STEPS[state.quoteReviewGuide.stepIndex] || null;
    }

    function startQuoteReviewGuide() {
      state.stage = "quote_review_file_check";
      state.quoteReviewGuide = {
        active: true,
        stepIndex: 0,
        answers: {}
      };
      setIntent("existing_quote_review", {
        readiness: "review",
        reason: "quote review guided file check"
      });
      setRoute("Review my quote", "/quote-review.html?from=chatbot&mode=upload");
      pushGuided(
        "Do you already have a written quote PDF, image or screenshot?",
        "Please do not paste the quote text here. Uploading it on the review page is safer and gives the strongest review.",
        "Choose the closest option.",
        prompts.actions.quoteReviewFileCheck
      );
    }

    function startQuoteReviewChecklist() {
      state.stage = "quote_review_quick_check";
      state.quoteReviewGuide.active = true;
      state.quoteReviewGuide.stepIndex = 0;
      state.quoteReviewGuide.answers = {};
      setIntent("existing_quote_review", {
        readiness: "review",
        reason: "quote review quick completeness checklist",
        missing_items_to_check: ["product shown", "area shown", "installation included", "removal and disposal", "trims or stairs", "exclusions"]
      });
      setRoute("Review my quote", "/quote-review.html?from=chatbot&mode=quick_check#quick-check");
      const firstStep = getCurrentQuoteReviewChecklistStep();
      pushGuided(
        "No problem. We can do a quick completeness check without the file.",
        "Only answer yes, no, not sure, or skip. Do not paste the quote text here.",
        firstStep ? firstStep.question : "Open quick check.",
        prompts.actions.quoteReviewChecklist
      );
    }

    function finishQuoteReviewChecklist() {
      const answers = state.quoteReviewGuide.answers || {};
      const missing = Object.keys(answers).filter(function (key) {
        return answers[key] !== "yes";
      }).map(function (key) {
        return key.replace(/_/g, " ");
      });
      state.quoteReviewGuide = {
        active: false,
        stepIndex: QUOTE_REVIEW_CHECKLIST_STEPS.length,
        answers: answers,
        summary: {
          intent: "existing_quote_review",
          missing_items: missing.slice(0, 8),
          next_action: "review_my_quote"
        }
      };
      state.stage = "quote_review_quick_check_complete";
      setIntent("existing_quote_review", {
        readiness: missing.length ? "review" : "ready",
        reason: "quote review quick checklist completed",
        missing_items_to_check: missing
      });
      setRoute("Review my quote", "/quote-review.html?from=chatbot&mode=quick_check#quick-check");
      pushGuided(
        "That is enough for a quick completeness check.",
        missing.length
          ? "Items to check: " + missing.slice(0, 4).join(", ") + "."
          : "The main quote sections appear to be covered, but upload still gives a stronger review.",
        "Open quote review to continue.",
        prompts.actions.quoteReviewNext
      );
    }

    function handleQuoteReviewGuideAction(actionId) {
      if (actionId === "quote_review_file_yes" || actionId === "quote_review_file_screenshot") {
        const fileType = actionId === "quote_review_file_screenshot" ? "screenshot/image" : "PDF or image";
        state.quoteReviewGuide = {
          active: false,
          stepIndex: 0,
          answers: { has_file: "yes", file_type: fileType }
        };
        pushUser(actionLabel(actionId));
        setIntent("existing_quote_review", {
          readiness: "review",
          reason: "customer has written quote file"
        });
        setRoute("Review my quote", "/quote-review.html?from=chatbot&mode=upload");
        pushGuided(
          "Upload gives the strongest review because the tool can check visible quote details.",
          "The chatbot will not read or store the quote file. Upload it on the quote-review page.",
          "Review my quote.",
          prompts.actions.quoteReviewNext
        );
        state.stage = "quote_review_upload_route";
        return true;
      }
      if (actionId === "quote_review_file_no" || actionId === "quote_review_file_not_sure") {
        pushUser(actionLabel(actionId));
        startQuoteReviewChecklist();
        return true;
      }
      if (actionId === "quote_review_route_review") {
        pushUser(actionLabel(actionId));
        setRoute("Review my quote", state.routeSuggestion.href || "/quote-review.html?from=chatbot");
        pushGuided(
          "Open quote review when you are ready.",
          "Upload is best if you have a file. Quick check is useful when you do not.",
          "Review my quote.",
          prompts.actions.quoteReviewNext
        );
        return true;
      }
      if (!state.quoteReviewGuide.active) {
        return false;
      }
      const currentStep = getCurrentQuoteReviewChecklistStep();
      if (!currentStep) {
        finishQuoteReviewChecklist();
        return true;
      }
      const valueMap = {
        quote_review_check_yes: "yes",
        quote_review_check_no: "no",
        quote_review_check_not_sure: "not_sure",
        quote_review_check_skip: "skipped"
      };
      if (!Object.prototype.hasOwnProperty.call(valueMap, actionId)) {
        return false;
      }
      state.quoteReviewGuide.answers[currentStep.key] = valueMap[actionId];
      state.quoteReviewGuide.stepIndex += 1;
      pushUser(actionLabel(actionId));
      const nextStep = getCurrentQuoteReviewChecklistStep();
      if (!nextStep) {
        finishQuoteReviewChecklist();
        return true;
      }
      pushGuided(
        "Got it.",
        "Keep it high level. No quote text needed here.",
        nextStep.question,
        prompts.actions.quoteReviewChecklist
      );
      return true;
    }

    function guidedText(answer, insight, nextStep) {
      const lines = [
        compact(answer),
        compact(insight, ""),
        oneQuestion(nextStep || "Continue with the next step.")
      ].filter(function (line) {
        return !!line;
      });

      return lines.join("\n\n");
    }

    function pushGuided(answer, insight, nextStep, actions) {
      pushAssistant(guidedText(answer, insight, nextStep), actions);
    }

    function pushTrigger(triggerId, answer, insight, nextStep, actions) {
      if (triggersShown[triggerId]) {
        return false;
      }

      triggersShown[triggerId] = true;
      state.triggerNudge = {
        id: triggerId,
        text: compact(answer)
      };
      pushGuided(answer, insight, nextStep, actions || prompts.actions.nextSteps);
      return true;
    }

    function pushKnowledgeAnswer(match) {
      if (!match || !match.route || !match.route.href) {
        return false;
      }

      setIntent(match.intent || "route_next_step", {
        reason: "controlled knowledge index",
        knowledge_key: match.key || ""
      });
      setRoute(match.route.label || "Continue", match.route.href);
      pushGuided(
        match.answer,
        match.insight,
        match.nextStep,
        match.intent === "product_guidance" ? prompts.actions.productGuide : prompts.actions.nextSteps
      );
      return true;
    }

    function getCategoryFromText(value) {
      if (includesAny(value, ["engineered", "timber", "herringbone", "heringbone", "swish oak", "natura"])) {
        return "engineered";
      }
      if (includesAny(value, ["laminate", "ac4", "12mm"])) {
        return "laminate";
      }
      if (includesAny(value, ["hybrid", "waterproof", "water resistant", "etf", "7mm", "8mm", "9mm"])) {
        return "hybrid";
      }
      return "";
    }

    function getRangeGuidanceForText(value) {
      if (!knowledge || typeof knowledge.getRangeGuidance !== "function") {
        return "";
      }
      const category = getCategoryFromText(value);
      return category ? knowledge.getRangeGuidance(category) : "";
    }

    function pushUser(text) {
      state.transcript.push(createMessage("user", text, []));
      sync();
    }

    function setRoute(label, href, focusId) {
      const safeHref = normaliseRouteHref(href);
      state.routeSuggestion = { label: label, href: safeHref, focusId: focusId || "" };
      state.draft = mapper.sanitiseDraft(Object.assign({}, state.draft, {
        next_step: safeHref
      }));
    }

    function setOperatorHandoff() {
      const href = "/contact.html?from=chatbot";
      setIntent("contact_human", {
        readiness: "review",
        reason: "customer requested human support",
        missing_items_to_check: ["contact details", "project note"]
      });
      setRoute("Contact Operon", href, "contactName");
      state.operatorHandoff = {
        title: "Need a person?",
        copy: prompts.copy.operatorHandoff || "Send your contact details and project note so Operon can follow up. This is not a live chat.",
        privacyCopy: "Your message and recent chat context may be sent to support this follow-up request.",
        primaryLabel: "Request operator follow-up",
        href: href
      };
    }

    function applySiteRouteSuggestion() {
      const siteState = readSiteState();
      if (siteState && siteState.next && siteState.next.href) {
        setRoute(siteState.next.label || settings.initialRouteLabel, siteState.next.href, siteState.next.focusId || "");
      }
      return siteState;
    }

    function getStateAwareNextStep(siteState) {
      if (!siteState) {
        return "Start with products, quote, or quote review.";
      }

      if (siteState.flow === "quote_review_result") {
        return "Confirm the unclear scope items, or build a structured Operon estimate.";
      }

      if (siteState.isNearCompletion) {
        return "Review the scope, then submit the quote request.";
      }

      if (siteState.missingInputs && siteState.missingInputs.length) {
        if (siteState.missingInputs[0] === "review and submit") {
          return "Review the estimate, then submit the quote request.";
        }
        return "Complete " + siteState.missingInputs[0] + " first.";
      }

      if (siteState.stepTitle && siteState.activeStepNumber) {
        return "Continue Step " + siteState.activeStepNumber + ": " + siteState.stepTitle + ".";
      }

      return siteState.nudge || "Continue to the next step.";
    }

    function getFirstUsefulReviewItem(items, fallback) {
      if (Array.isArray(items)) {
        const item = items.find(function (value) {
          return value && !/will appear|no extracted|questions will appear/i.test(value);
        });
        if (item) {
          return compact(item).slice(0, 130);
        }
      }
      return fallback;
    }

    function pushQuoteReviewResultGuide(siteState, focus) {
      const status = siteState && siteState.reviewStatus ? compact(siteState.reviewStatus) : "Review result is ready";
      const missing = getFirstUsefulReviewItem(
        siteState && siteState.reviewMissingScope,
        "The useful check is whether removal, prep, underlay, trims, stairs and site details are clearly written."
      );
      const question = getFirstUsefulReviewItem(
        siteState && siteState.reviewQuestions,
        "Ask the contractor to confirm missing inclusions in writing before comparing totals."
      );
      const answer = focus === "question"
        ? "Ask one direct scope question first."
        : status + ".";
      const insight = "Main scope point: " + missing;
      const nextStep = focus === "question" ? question : "Confirm that item, or build a structured Operon estimate.";

      setIntent("quote_review_result_explanation", {
        readiness: "review",
        reason: "quote review result guidance",
        missing_items_to_check: siteState && siteState.reviewMissingScope ? siteState.reviewMissingScope.slice(0, 5) : []
      });
      setRoute("Get structured estimate", siteState && siteState.next ? siteState.next.href : "/quote.html?source=quote_review");
      pushGuided(answer, insight, nextStep, prompts.actions.nextSteps);
      state.stage = "quote_review_result";
    }

    function pushStateAwareGuide(prefix, actions) {
      const siteState = applySiteRouteSuggestion();
      if (siteState && siteState.flow === "quote_review_result") {
        pushQuoteReviewResultGuide(siteState, "result");
        return;
      }
      pushGuided(
        prefix || "Use the next suitable step.",
        siteState && siteState.stepTitle
          ? "You are on " + siteState.stepTitle + ". Keep the quote moving one decision at a time."
          : "Keep the decision focused on product choice, quote scope, and missing details.",
        getStateAwareNextStep(siteState),
        actions || prompts.actions.nextSteps
      );
    }

    function scheduleIdleSuggestion() {
      if (!settings.enableIdleSuggestions || typeof window.setTimeout !== "function") {
        return;
      }

      if (idleTimer && typeof window.clearTimeout === "function") {
        window.clearTimeout(idleTimer);
      }

      idleTimer = window.setTimeout(function () {
        if (idleSuggestionShown || state.triggerNudge || state.transcript.length > 1) {
          return;
        }

        const siteState = applySiteRouteSuggestion();
        if (!siteState || !siteState.nudge) {
          return;
        }

        idleSuggestionShown = true;
        pushGuided(
          siteState.isNearCompletion ? "The quote is nearly ready for review." : "A clear next step is available.",
          "Keep the decision focused on flooring choice, area, and main project details.",
          getStateAwareNextStep(siteState),
          prompts.actions.nextSteps
        );
      }, 30000);
    }

    function applyTrigger(triggerId) {
      const siteState = applySiteRouteSuggestion();
      const pageKey = settings.pageKey;

      if (triggerId === "homepage_idle" && pageKey === "index") {
        setIntent("product_guidance", { readiness: "browsing", reason: "homepage idle guidance" });
        setRoute("Start quote", "/quote.html?from=chatbot");
        pushTrigger(
          triggerId,
          "Need help choosing where to start?",
          "One clear category is enough to begin the quote path.",
          "Start with a guided recommendation.",
          prompts.actions.productGuide
        );
        return;
      }

      if (triggerId === "product_scroll_depth" && pageKey === "products") {
        setIntent("product_guidance", {
          readiness: "browsing",
          reason: "product scroll depth",
          category: siteState && siteState.selectedCategory ? siteState.selectedCategory : state.draft.category
        });
        setRoute("Start quote", "/quote.html?from=products");
        pushTrigger(
          triggerId,
          "Narrow the product choice with a few practical checks.",
          "Apartment, water resistance, and finish level usually decide the category.",
          "Answer one question to set a starting direction.",
          prompts.actions.productGuide
        );
        return;
      }

      if (triggerId === "review_quote_visible" && pageKey === "index") {
        setIntent("quote_review", {
          readiness: "review",
          reason: "homepage review section visible",
          missing_items_to_check: ["removal", "floor preparation", "site details", "finishing"]
        });
        setRoute("Review your quote", "/quote-review.html");
        pushTrigger(
          triggerId,
          "Already have a quote? Review the scope before comparing it.",
          "Most quotes differ in removal, floor prep, and finishing.",
          "Review your quote.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (triggerId === "quote_idle" && pageKey === "quote") {
        return;
      }

      if (triggerId === "near_submit" && pageKey === "quote") {
        setIntent("route_next_step", { readiness: "ready", reason: "near quote submit" });
        setRoute("Continue quote", "/quote.html", siteState && siteState.next ? siteState.next.focusId : "");
        pushTrigger(
          triggerId,
          "The quote is almost ready for review.",
          "Submitting sends the details for review and next steps.",
          "Review the details before submitting.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (triggerId === "review_page_idle" && pageKey === "quote-review") {
        if (siteState && siteState.flow === "quote_review_result") {
          pushQuoteReviewResultGuide(siteState, "result");
          return;
        }

        setIntent("quote_review", {
          readiness: "review",
          reason: "quote review page guidance",
          missing_items_to_check: ["installation method", "disposal", "floor preparation", "skirting", "site details"]
        });
        setRoute("Get structured estimate", "/quote.html?source=quote_review");
        pushTrigger(
          triggerId,
          "Review what is included before moving forward.",
          "The useful check is scope clarity, not whether another quote is cheaper.",
          "Start the review checklist.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (triggerId === "post_submit_engagement" && pageKey === "thank-you") {
        setIntent("route_next_step", {
          readiness: "ready",
          reason: "post submit engagement"
        });
        setRoute("Confirm details", "/thank-you.html#leadStageSection");
        pushTrigger(
          triggerId,
          "Thanks - we've received your estimate.",
          "Confirming timing now helps us follow up at the right pace.",
          "Are you ready soon, comparing, or planning?",
          prompts.actions.postSubmit
        );
      }
    }

    function setDraft(next) {
      state.draft = mapper.sanitiseDraft(Object.assign({}, state.draft, next || {}));
    }

    function setIntent(intent, extras) {
      setDraft(Object.assign({ intent: intent }, extras || {}));
    }

    function addNote(text) {
      const notes = Array.isArray(state.draft.notes) ? state.draft.notes.slice() : [];
      if (notes.indexOf(text) === -1) {
        notes.push(text);
      }
      setDraft({ notes: notes });
    }

    function setRecommendationSignal(value) {
      state.recommendationSignal = value || "";
    }

    function appendScenarioFlags(existingFlags, newFlags) {
      const merged = Array.isArray(existingFlags) ? existingFlags.slice() : [];
      (Array.isArray(newFlags) ? newFlags : []).forEach(function (flag) {
        if (merged.indexOf(flag) === -1) {
          merged.push(flag);
        }
      });
      return merged;
    }

    function actionLabel(actionId) {
      const groups = prompts.actions;
      const keys = Object.keys(groups);
      let groupIndex = 0;

      for (; groupIndex < keys.length; groupIndex += 1) {
        const group = groups[keys[groupIndex]];
        const match = group.find(function (item) {
          return item.id === actionId;
        });
        if (match) {
          return match.label;
        }
      }

      return actionId;
    }

    function recommendCategory(signal, context) {
      if (signal === "need_waterproof") {
        return "hybrid";
      }
      if (context === "context_design_led") {
        return "engineered";
      }
      if (context === "context_apartment" && signal !== "want_premium") {
        return "hybrid";
      }
      if (context === "context_quick_turnaround" && signal !== "want_premium") {
        return "laminate";
      }
      if (signal === "want_premium") {
        return "engineered";
      }
      if (signal === "want_budget") {
        return "laminate";
      }
      return "hybrid";
    }

    function summariseRecommendation(category, context) {
      if (knowledge && typeof knowledge.getRecommendationSummary === "function") {
        return knowledge.getRecommendationSummary(category, context);
      }

      const meta = prompts.categoryGuidance[category];
      if (!meta) {
        return prompts.copy.routeUnsure;
      }

      let summary = meta.label + " looks like the strongest starting category here. " + meta.reasons[0];

      if (context === "context_apartment") {
        summary += " Apartment details and durability often matter early, so keeping the quote path practical helps.";
      } else if (context === "context_design_led") {
        summary += " That gives more room for a finish-led review before the final quote is confirmed.";
      } else if (context === "context_quick_turnaround") {
        summary += " That usually keeps the decision path simpler while you gather the remaining site details.";
      }

      return summary;
    }

    function getValidationSummary(structured) {
      const flags = structured.validation_flags || [];
      if (!flags.length) {
        return "";
      }

      const readable = knowledge && typeof knowledge.getRiskCopy === "function"
        ? knowledge.getRiskCopy(flags)
        : flags.map(function (flag) {
          return flag.replace(/_/g, " ");
        });

      return prompts.copy.validationPrefix + " " + readable.join(", ") + ".";
    }

    function getRouteForScenario(scenarioId) {
      if (!scenarios || !policy || typeof scenarios.getRouteKey !== "function" || typeof policy.normaliseRoute !== "function") {
        return { label: "Start quote", href: "/quote.html" };
      }

      return policy.normaliseRoute(scenarios.getRouteKey(scenarioId));
    }

    function applyScenarioPatch(scenarioId, patch, flags, nextStep) {
      const route = getRouteForScenario(scenarioId);
      setDraft(Object.assign({}, patch || {}, {
        scenario_id: scenarioId,
        intent: "missing_info_collection",
        scenario_step: nextStep,
        scenario_flags: appendScenarioFlags(state.draft.scenario_flags, flags)
      }));
      setRoute(route.label, route.href);
    }

    function pushScenarioStep(scenario, stepIndex) {
      if (!scenarios || !scenario) {
        return false;
      }

      const step = scenarios.getStep(scenario.id, stepIndex);
      if (!step) {
        return false;
      }

      state.stage = "scenario_" + scenario.id;
      pushAssistant(scenarios.buildStepMessage(scenario, step), step.actions || []);
      return true;
    }

    function startScenario(scenario) {
      if (!scenarios || !scenario) {
        return false;
      }

      const intro = scenarios.buildIntroMessage(scenario);
      applyScenarioPatch(scenario.id, scenario.initialPatch || {}, scenario.flags || [], 0);
      pushAssistant(intro, []);

      if (!pushScenarioStep(scenario, 0)) {
        pushAssistant(prompts.copy.routeQuote, prompts.actions.nextSteps);
      }

      return true;
    }

    function completeScenario(scenario) {
      const structured = mapper.toStructuredOutput(state.draft);
      const validationSummary = getValidationSummary(structured);
      const message = [
        scenario.label + " playbook captured.",
        scenario.summary,
        validationSummary || prompts.copy.reviewReady,
        prompts.copy.routeQuote
      ].filter(Boolean).join(" ");

      state.stage = "scenario_complete";
      setDraft({
        readiness: structured.validation_flags.length ? "review" : "ready"
      });
      pushAssistant(message, prompts.actions.nextSteps);
    }

    function handleScenarioAction(actionId) {
      if (!scenarios || typeof scenarios.getScenarioAction !== "function") {
        return false;
      }

      const match = scenarios.getScenarioAction(actionId);
      if (!match) {
        return false;
      }

      const scenario = match.scenario;
      const nextStep = match.stepIndex + 1;

      pushUser(match.action.label);
      applyScenarioPatch(scenario.id, match.action.patch || {}, match.action.flags || [], nextStep);

      if (!pushScenarioStep(scenario, nextStep)) {
        completeScenario(scenario);
      }

      return true;
    }

    function begin() {
      state.transcript = [];
      state.stage = "welcome";
      state.recommendationSignal = "";
      state.operatorHandoff = null;
      const siteState = applySiteRouteSuggestion();
      if (!siteState || !(siteState.next && siteState.next.href)) {
        setRoute(settings.initialRouteLabel, settings.initialRouteHref);
      }
      setIntent("general_question");
      pushAssistant(
        settings.welcomeText || prompts.copy.welcomeText || "Are you trying to start a quote, choose a flooring product, check an existing quote, or measure from a floor plan?",
        prompts.actions.welcome
      );
      scheduleIdleSuggestion();
    }

    function explainQuote() {
      state.stage = "quote_help";
      setIntent("start_quote", { readiness: "unsure", reason: "estimate versus final quote" });
      setRoute("Start quote", "/quote.html");
      pushGuided(
        "The quote is a structured estimate before final confirmation.",
        "The estimate depends on product, area, stairs, removal, trims and final site details.",
        "Start the quote or check missing details.",
        prompts.actions.quoteHelp
      );
    }

    function startProductGuide() {
      state.stage = "product_guide";
      setIntent("product_help", { readiness: "browsing" });
      setRoute("Choose product", "/products.html");
      pushGuided(
        "Choose the flooring path from the project conditions.",
        "Property type and water resistance usually narrow the category first.",
        "Which best matches the space?",
        prompts.actions.productGuide
      );
    }

    function startProductContext() {
      state.stage = "product_context";
      pushGuided(
        "Clear direction.",
        "The project type helps narrow the recommendation.",
        "Which project type fits best?",
        prompts.actions.projectContext
      );
    }

    function startDetailCollection() {
      state.stage = "collect_existing_floor";
      setIntent("missing_info_collection");
      setRoute("Start quote", "/quote.html");
      pushGuided(
        "Capture only the key scope details.",
        "Existing floor affects removal, disposal, and prep review.",
        prompts.copy.detailExistingFloor,
        prompts.actions.detailCollection
      );
    }

    function continueDetailCollection() {
      if (state.stage === "collect_existing_floor") {
        state.stage = "collect_subfloor";
        pushGuided("Next scope check.", "Subfloor condition can affect preparation.", prompts.copy.detailSubfloor, prompts.actions.subfloorCollection);
        return;
      }

      if (state.stage === "collect_subfloor") {
        state.stage = "collect_access";
        pushGuided("Next scope check.", "Site details are reviewed before final confirmation.", prompts.copy.detailAccess, prompts.actions.accessCollection);
        return;
      }

      if (state.stage === "collect_access") {
        state.stage = "collect_stairs";
        pushGuided("Next scope check.", "Stairs should be reviewed before final confirmation.", prompts.copy.detailStairs, prompts.actions.stairsCollection);
        return;
      }

      if (state.stage === "collect_stairs") {
        state.stage = "collect_furniture";
        pushGuided("Final scope check.", "Furniture handling can change site preparation.", prompts.copy.detailFurniture, prompts.actions.furnitureCollection);
        return;
      }

      finishDetailCollection();
    }

    function finishDetailCollection() {
      const structured = mapper.toStructuredOutput(state.draft);
      const missingSummary = structured.missing_items.length
        ? prompts.copy.reviewMissingPrefix + " " + structured.missing_items.join(", ").replace(/_/g, " ") + "."
        : prompts.copy.reviewReady;
      const validationSummary = getValidationSummary(structured);

      state.stage = "review";
      setIntent("quote_review", { readiness: structured.missing_items.length ? "review" : "ready" });
      setRoute(structured.missing_items.length ? "Review quote scope" : "Start quote", structured.missing_items.length ? "/quote-review.html" : "/quote.html");
      pushGuided(
        "Scope check complete.",
        validationSummary || missingSummary,
        structured.missing_items.length ? "Review the unclear scope items." : "Start the quote.",
        prompts.actions.nextSteps
      );
    }

    function handleRecommendationContext(actionId) {
      const category = recommendCategory(state.recommendationSignal, actionId);
      const draftPatch = {
        intent: "product_guidance",
        category: category,
        recommended_category: category,
        selection_mode: "recommend",
        reason: summariseRecommendation(category, actionId),
        readiness: "unsure"
      };

      if (actionId === "context_apartment") {
        draftPatch.access = "apartment";
        draftPatch.property_type = "unit_apartment";
        draftPatch.parking_access = "limited";
      } else if (actionId === "context_family_home") {
        draftPatch.property_type = "house";
        draftPatch.access = state.recommendationSignal === "want_budget" ? "easy" : state.draft.access;
      } else if (actionId === "context_quick_turnaround") {
        draftPatch.measurement_method = "manual_total";
      }

      setDraft(draftPatch);
      setRoute("Start quote", "/quote.html");
      pushUser(actionLabel(actionId));
      pushGuided(
        prompts.categoryGuidance[category].label + " is the strongest starting category.",
        summariseRecommendation(category, actionId),
        "Use this direction in the quote.",
        prompts.actions.nextSteps
      );
      state.stage = "product_result";
    }

    function applyAction(actionId) {
      if (handleQuoteReviewGuideAction(actionId)) {
        return;
      }
      if (handlePrequalAction(actionId)) {
        return;
      }
      if (handleScenarioAction(actionId)) {
        return;
      }

      switch (actionId) {
        case "start_product_guide":
          pushUser("Choose product");
          setIntent("product_help", { readiness: "browsing" });
          startProductGuide();
          return;
        case "explain_quote":
          pushUser("How does the quote work?");
          explainQuote();
          return;
        case "collect_project_details":
          pushUser("Help me prepare the project details");
          startDetailCollection();
          return;
        case "set_install_only":
          pushUser(actionLabel(actionId));
          setIntent("install_only", { quote_mode: "install_only", readiness: "unsure", reason: "customer already has flooring materials" });
          addNote("Customer already has flooring materials.");
          setRoute("Start quote", "/quote.html");
          pushGuided(
            "Installation-only path selected.",
            "The quote should still check prep, removal, trims, and stairs.",
            "Start the quote and select Installation Only.",
            prompts.actions.nextSteps
          );
          state.stage = "quote_mode";
          return;
        case "set_supply_install":
          pushUser(actionLabel(actionId));
          setIntent("quote_explanation", { quote_mode: "supply_install", readiness: "unsure", included_items: ["supply", "installation"] });
          setRoute("Start quote", "/quote.html");
          pushGuided(
            "Supply and install path selected.",
            "Product selection and measured area drive the next decisions.",
            "Start the quote.",
            prompts.actions.nextSteps
          );
          state.stage = "quote_mode";
          return;
        case "need_durable":
        case "need_waterproof":
        case "want_budget":
        case "want_premium":
          setRecommendationSignal(actionId);
          pushUser(actionLabel(actionId));
          if (actionId === "need_waterproof") {
            setDraft({
              intent: "product_guidance",
              category: "hybrid",
              recommended_category: "hybrid",
              selection_mode: "recommend",
              reason: "water resistance requested",
              readiness: "unsure"
            });
            setRoute("Start quote", "/quote.html");
            pushGuided(
              "Hybrid flooring is usually the safest choice when water resistance matters.",
              "It keeps the starting path practical for apartments, kitchens, and busy homes.",
              "Use hybrid as the working category in the quote.",
              prompts.actions.nextSteps
            );
            state.stage = "product_result";
            return;
          }
          startProductContext();
          return;
        case "context_family_home":
        case "context_apartment":
        case "context_design_led":
        case "context_quick_turnaround":
          handleRecommendationContext(actionId);
          return;
        case "browse_products":
          setIntent("product_help", { readiness: "browsing" });
          setRoute("Choose product", "/products.html");
          pushUser(actionLabel(actionId));
          pushGuided(
            "Review products before quoting.",
            "Choosing a range first keeps the quote path clearer.",
            "Open the product catalogue.",
            prompts.actions.nextSteps
          );
          state.stage = "browse";
          return;
        case "what_affects_price":
          pushUser("What affects price?");
          setIntent("price_question", { reason: "safe price factor explanation without pricing calculation" });
          pushGuided(
            "The estimate depends on product, area, stairs, removal, trims and final site details.",
            "I cannot give exact pricing or rates here.",
            "Start the quote or check missing details.",
            prompts.actions.quoteHelp
          );
          return;
        case "route_floorplan":
          pushUser(actionLabel(actionId));
          setIntent("floorplan_help", { measurement_method: "floorplan_upload", reason: "customer has a floor plan" });
          setRoute("Measure floor plan", "/floorplan.html");
          pushGuided(
            "Use the floor plan tool when you already have a plan.",
            "For general area uncertainty, the quote can still start with a rough total or room-by-room entry.",
            "Open floor plan measurement.",
            prompts.actions.nextSteps
          );
          state.stage = "area_help";
          return;
        case "quick_completeness_check":
          pushUser(actionLabel(actionId));
          startQuoteReviewChecklist();
          return;
        case "review_existing_quote":
          pushUser(actionLabel(actionId));
          startQuoteReviewGuide();
          return;
        case "contact_operon":
          pushUser(actionLabel(actionId));
          setIntent("contact_human", { readiness: "review", reason: "customer wants Operon contact" });
          setRoute("Contact Operon", "/contact.html");
          pushGuided(
            "Use the contact page for a direct enquiry.",
            "You can also start a quote if you already know product and area.",
            "Open the contact page.",
            prompts.actions.nextSteps
          );
          state.stage = "contact";
          return;
        case "request_operator":
          pushUser(actionLabel(actionId));
          setOperatorHandoff();
          pushGuided(
            "I can route this to a real person.",
            "This chatbot is not a live operator, so the cleanest path is to send contact details and a short project note.",
            "Request operator follow-up.",
            prompts.actions.nextSteps
          );
          state.stage = "operator_handoff";
          return;
        case "post_submit_ready_soon":
        case "post_submit_comparing":
        case "post_submit_planning":
          pushUser(actionLabel(actionId));
          setIntent("route_next_step", {
            readiness: "ready",
            reason: "post submit timing selected",
            included_items: [actionLabel(actionId)]
          });
          setRoute("Confirm timing", "/thank-you.html#leadStageSection");
          pushGuided(
            "Good. Add that timing to the request.",
            "It keeps follow-up useful without adding pressure.",
            "Select the same timing option on this page.",
            prompts.actions.nextSteps
          );
          state.stage = "post_submit_followup";
          return;
        case "ready_for_quote":
          pushUser(actionLabel(actionId));
          startPrequalification();
          return;
        case "review_scope":
          setIntent("document_quote_review", { readiness: "review" });
          setRoute("Upload written quote", "/quote-review.html");
          pushUser(actionLabel(actionId));
          pushGuided(
            prompts.copy.documentReview,
            getValidationSummary(mapper.toStructuredOutput(state.draft)) || "Check product, area, removal, prep, and trims.",
            "Upload written quote.",
            prompts.actions.nextSteps
          );
          state.stage = "review";
          return;
        case "existing_floor_carpet":
          pushUser(actionLabel(actionId));
          setDraft({ existing_floor: "carpet", removal_disposal: "unsure" });
          continueDetailCollection();
          return;
        case "existing_floor_floating":
          pushUser(actionLabel(actionId));
          setDraft({ existing_floor: "floating", removal_disposal: "unsure" });
          continueDetailCollection();
          return;
        case "existing_floor_tile":
          pushUser(actionLabel(actionId));
          setDraft({ existing_floor: "tile", removal_disposal: "unsure" });
          continueDetailCollection();
          return;
        case "existing_floor_vinyl":
          pushUser(actionLabel(actionId));
          setDraft({ existing_floor: "vinyl", removal_disposal: "unsure" });
          continueDetailCollection();
          return;
        case "existing_floor_unsure":
          pushUser(actionLabel(actionId));
          setDraft({ existing_floor: "unsure", removal_disposal: "unsure" });
          continueDetailCollection();
          return;
        case "subfloor_good":
          pushUser(actionLabel(actionId));
          setDraft({ subfloor_condition: "good", floor_prep_type: "none" });
          continueDetailCollection();
          return;
        case "subfloor_minor":
          pushUser(actionLabel(actionId));
          setDraft({ subfloor_condition: "minor_prep", floor_prep_type: "levelling" });
          continueDetailCollection();
          return;
        case "subfloor_poor":
          pushUser(actionLabel(actionId));
          setDraft({ subfloor_condition: "heavy_prep", floor_prep_type: "manual" });
          continueDetailCollection();
          return;
        case "subfloor_unsure":
          pushUser(actionLabel(actionId));
          setDraft({ subfloor_condition: "unsure", floor_prep_type: "unsure" });
          continueDetailCollection();
          return;
        case "access_easy":
          pushUser(actionLabel(actionId));
          setDraft({ access: "easy", parking_access: "easy", has_lift: "na" });
          continueDetailCollection();
          return;
        case "access_limited":
          pushUser(actionLabel(actionId));
          setDraft({ access: "limited", parking_access: "limited" });
          continueDetailCollection();
          return;
        case "access_apartment":
          pushUser(actionLabel(actionId));
          setDraft({
            access: "apartment",
            property_type: "unit_apartment",
            parking_access: "limited"
          });
          continueDetailCollection();
          return;
        case "access_unsure":
          pushUser(actionLabel(actionId));
          setDraft({ access: "unsure", parking_access: "unsure" });
          continueDetailCollection();
          return;
        case "stairs_none":
          pushUser(actionLabel(actionId));
          setDraft({ stairs: 0 });
          continueDetailCollection();
          return;
        case "stairs_some":
          pushUser(actionLabel(actionId));
          setDraft({ stairs: 1 });
          continueDetailCollection();
          return;
        case "stairs_unsure":
          pushUser(actionLabel(actionId));
          setDraft({ stairs: null });
          continueDetailCollection();
          return;
        case "furniture_none":
          pushUser(actionLabel(actionId));
          setDraft({ furniture: "none" });
          finishDetailCollection();
          return;
        case "furniture_some":
          pushUser(actionLabel(actionId));
          setDraft({ furniture: "some" });
          finishDetailCollection();
          return;
        case "furniture_unsure":
          pushUser(actionLabel(actionId));
          setDraft({ furniture: "unsure" });
          finishDetailCollection();
          return;
        case "restart_chatbot":
          pushUser("Start over");
          begin();
          return;
        default:
          return;
      }
    }

    function applyTextInput(text) {
      const value = String(text || "").trim();
      const policyDecision = policy && typeof policy.evaluateUserText === "function"
        ? policy.evaluateUserText(value)
        : { intent: inferIntent(value), notice: "" };

      if (!value) {
        return;
      }

      if (isPrequalTextExpected()) {
        answerPrequalification(value);
        return;
      }

      const rawQuoteLikeText = value.toLowerCase();
      const looksLikeQuotePaste = includesAny(rawQuoteLikeText, ["total $", "inc gst", "quote total", "removal extra", "area "])
        && includesAny(rawQuoteLikeText, ["quote", "$", "gst", "m2", "m²"]);
      if (((value.length > 300 || (value.match(/\n/g) || []).length >= 3) && includesAny(rawQuoteLikeText, ["quote", "$", "supply", "install", "total", "gst", "m2"])) || looksLikeQuotePaste) {
        setIntent("existing_quote_review", {
          readiness: "review",
          reason: "raw quote text rejected in chatbot"
        });
        setRoute("Review my quote", "/quote-review.html?from=chatbot&mode=upload");
        pushGuided(
          "Please do not paste raw quote text into the chatbot.",
          "Upload the PDF, image or screenshot on the quote-review page for the safest review.",
          "Review my quote.",
          prompts.actions.quoteReviewNext
        );
        state.stage = "quote_review_privacy_guard";
        return;
      }

      pushUser(value);

      const lowerValue = value.toLowerCase();

      if (settings.pageKey === "quote-review" && includesAny(lowerValue, [
        "what does this mean",
        "explain",
        "result",
        "review result",
        "missing",
        "unclear",
        "scope gap",
        "question to ask",
        "what should i ask",
        "what should i do",
        "what next"
      ])) {
        const siteState = applySiteRouteSuggestion();
        if (siteState && siteState.flow === "quote_review_result") {
          const focus = includesAny(lowerValue, ["ask", "question"]) ? "question" : "result";
          pushQuoteReviewResultGuide(siteState, focus);
          return;
        }
      }

      if (includesAny(lowerValue, ["operator", "human", "person", "live chat", "online chat", "sales", "consultant", "speak to someone", "talk to someone", "call me", "can someone call"])) {
        setOperatorHandoff();
        pushGuided(
          "I can help you request human follow-up.",
          "This chatbot is automated, not a live operator. Send the quote request with your contact details and note what you need help with.",
          "Request operator follow-up.",
          prompts.actions.nextSteps
        );
        state.stage = "operator_handoff";
        return;
      }

      if (includesAny(lowerValue, ["stuck", "confused", "what next", "next step", "help me", "not sure what to do"])) {
        setIntent("route_next_step", {
          reason: "stuck user recovery"
        });
        pushStateAwareGuide("Focus on the next practical step.", prompts.actions.nextSteps);
        return;
      }

      if (includesAny(lowerValue, ["beat price", "price match", "competitor pricing", "competitor quote", "beat a competitor", "beat this quote", "beat my quote", "cheaper than", "quote expensive", "is this quote expensive"])) {
        setIntent("existing_quote_review", {
          readiness: "review",
          reason: "price comparison needs scope review",
          missing_items_to_check: ["product shown", "area shown", "installation included", "removal and disposal", "exclusions"]
        });
        setRoute("Review my quote", "/quote-review.html?from=chatbot&mode=upload");
        pushGuided(
          "I cannot tell whether a quote is expensive just from the total.",
          "Quote review checks whether the scope is clear enough to compare: product, area, installation, removal, trims, stairs and exclusions.",
          "Do you already have a written quote PDF, image or screenshot?",
          prompts.actions.quoteReviewFileCheck
        );
        state.stage = "quote_review_file_check";
        return;
      }

      if (includesAny(lowerValue, ["do not have the file", "don't have the file", "no file", "quick check", "quick completeness", "only know total", "only says supply and install", "quote only says", "my quote only says"])) {
        startQuoteReviewChecklist();
        return;
      }

      if (includesAny(lowerValue, ["pdf quote", "quote pdf", "quote screenshot", "screenshot quote", "image of quote", "photo of quote", "have a pdf", "have screenshot"])) {
        setIntent("existing_quote_review", {
          readiness: "review",
          reason: "customer has written quote file"
        });
        setRoute("Review my quote", "/quote-review.html?from=chatbot&mode=upload");
        pushGuided(
          "Upload gives the strongest review because the tool can check visible quote details.",
          "Please upload the PDF, image or screenshot on the quote-review page. Do not paste the quote text here.",
          "Review my quote.",
          prompts.actions.quoteReviewNext
        );
        state.stage = "quote_review_upload_route";
        return;
      }

      if (includesAny(lowerValue, ["product match 35", "match 35", "35% match", "35 percent match"])) {
        setIntent("quote_review_result_explanation", {
          readiness: "review",
          reason: "quote review result explanation",
          missing_items_to_check: ["product brand", "range", "colour", "full specification"]
        });
        setRoute("Upload written quote", "/quote-review.html");
        pushGuided(
          "A low product signal should not be treated as a confirmed match.",
          "If the uploaded quote only says something broad like Hybrid 7mm, the safe result is product match not confirmed.",
          "Confirm the product brand, range, colour and specification.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["what does this quote review mean", "what does this report mean", "what does this review mean"])) {
        setIntent("quote_review_result_explanation", {
          readiness: "review",
          reason: "quote review result explanation"
        });
        setRoute("Upload written quote", "/quote-review.html");
        pushGuided(
          "A quote review result starts with quote readiness.",
          "Use Not ready to compare, Partly clear, or Clear enough to compare as the main signal, then check the top 3 items and questions before accepting.",
          "Open the review and check the questions section.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["existing quote", "another quote", "compare quote", "quote review", "review my quote", "check my quote", "uploaded quote", "written quote", "hybrid 7mm quote", "is this quote fair"])) {
        startQuoteReviewGuide();
        return;
      }

      if (includesAny(lowerValue, ["view colour", "view color", "colour preview", "color preview", "choose colour", "choose color", "swatch", "range colour", "range color"])) {
        const category = getCategoryFromText(lowerValue) || "engineered";
        setIntent("product_guidance", {
          category: category,
          recommended_category: category,
          selection_mode: "recommend",
          readiness: "browsing",
          reason: "colour preview guidance"
        });
        setRoute("Browse products", "/products.html");
        pushGuided(
          "Use the product page to preview colours by range.",
          getRangeGuidanceForText(lowerValue) || "Colour previews help browsing. The quote confirms the final product details where needed.",
          category === "engineered" ? "Browse the range, then confirm the colour in the quote." : "Browse the range, then continue to the quote.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["hidden cost", "hidden costs", "surprise cost", "extra cost", "extras"])) {
        setIntent("scope_validation", {
          readiness: "review",
          reason: "scope clarity and avoiding surprises",
          missing_items_to_check: ["removal", "floor preparation", "disposal", "site details", "trims", "furniture"]
        });
        setRoute("Start quote", "/quote.html");
        pushGuided(
          "Hidden costs usually come from unclear scope.",
          "Removal, disposal, floor preparation, trims, furniture, and stairs are the main checks.",
          "Which item are you least sure about?",
          prompts.actions.quoteHelp
        );
        return;
      }

      if (includesAny(lowerValue, ["disposal", "dispose", "take away", "take-away", "rubbish", "remove old floor"])) {
        setIntent("scope_validation", {
          readiness: "review",
          reason: "removal and disposal clarity",
          missing_items_to_check: ["existing floor to remove", "disposal", "site details"]
        });
        setRoute("Start quote", "/quote.html");
        pushGuided(
          "Removal and disposal should be clear before submit.",
          "Choose the existing floor to remove, then confirm whether take-away disposal is included.",
          "Start the quote and check the extras step.",
          prompts.actions.quoteHelp
        );
        return;
      }

      if ((includesAny(lowerValue, ["tile", "tiles"]) && includesAny(lowerValue, ["stairs", "staircase", "steps"]))) {
        setIntent("scope_validation", {
          existing_floor: "tile",
          removal_disposal: "unsure",
          stairs: 1,
          readiness: "review",
          reason: "tile removal and stairs require quote scope review",
          missing_items_to_check: ["tile removal", "disposal", "stairs", "site details", "trims", "floor preparation"]
        });
        setRoute("Review quote scope", "/quote-review.html");
        pushGuided(
          "Tiles plus stairs need scope review.",
          "Removal, disposal, stairs, and trims should be checked before submission.",
          "Open quote review.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["apartment", "unit", "strata"]) && includesAny(lowerValue, ["no lift", "without lift", "no elevator", "without elevator"])) {
        setIntent("scope_validation", {
          access: "apartment",
          property_type: "unit_apartment",
          has_lift: "no",
          parking_access: "limited",
          readiness: "review",
          reason: "apartment without lift requires quote review",
          missing_items_to_check: ["level", "parking", "loading details", "strata rules", "stairs"]
        });
        setRoute("Review quote scope", "/quote-review.html");
        pushGuided(
          "Apartment with no lift needs site review.",
          "Level, loading, parking, and strata rules are reviewed before final confirmation.",
          "Open quote review.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["uneven", "not level", "not flat", "floor dips", "floor is dipping", "levelling", "leveling"])) {
        setIntent("scope_validation", {
          subfloor_condition: "minor_prep",
          floor_prep_type: "levelling",
          readiness: "review",
          reason: "uneven floor may need preparation",
          missing_items_to_check: ["floor preparation", "levelling", "subfloor condition"]
        });
        setRoute("Review quote scope", "/quote-review.html");
        pushGuided(
          "Uneven floor should be reviewed.",
          "Prep or levelling may be needed before final quote confirmation.",
          "Open quote review.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["stairs", "staircase", "steps"])) {
        setIntent("scope_validation", {
          stairs: 1,
          readiness: "review",
          reason: "stairs require quote scope review",
          missing_items_to_check: ["stairs", "site details", "trims"]
        });
        setRoute("Review quote scope", "/quote-review.html");
        pushGuided(
          "Stairs should be flagged early.",
          "They should be clear before the final scope is confirmed.",
          "Open quote review.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["final quote change", "can final quote change", "will final quote change", "subject to change", "price change"])) {
        setIntent("quote_explanation", {
          readiness: "unsure",
          reason: "final quote confirmation"
        });
        setRoute("Start quote", "/quote.html");
        pushGuided(
          "Yes, final confirmation can adjust the estimate.",
          "That keeps the quote aligned with the actual product, area, and site conditions.",
          "Start the quote when the basic details are ready.",
          prompts.actions.quoteHelp
        );
        return;
      }

      if (includesAny(lowerValue, ["cheapest", "lowest price", "cheap option", "budget option"])) {
        setIntent("product_guidance", {
          category: "laminate",
          recommended_category: "laminate",
          reason: "practical starting category for dry straightforward areas",
          readiness: "browsing"
        });
        setRoute("Browse products", "/products.html");
        pushGuided(
          "Lowest price alone is not a reliable category choice.",
          "Laminate suits simple dry areas; hybrid suits busier or water-risk areas.",
          "What matters most for this project?",
          prompts.actions.productGuide
        );
        return;
      }

      if (includesAny(lowerValue, ["professional", "trust", "trustworthy", "quality", "experienced", "reliable"])) {
        setIntent("route_next_step", {
          reason: "customer confidence and trust"
        });
        setRoute("Start quote", "/quote.html");
        pushGuided(
          "Operon focuses on clear scope and professional installation.",
          "The aim is a clear estimate, suitable flooring choice, and final confirmation before work starts.",
          "Start with products or quote scope.",
          prompts.actions.welcome
        );
        return;
      }

      if (includesAny(lowerValue, ["hybrid vs laminate", "laminate vs hybrid", "hybrid or laminate"])) {
        setIntent("product_guidance", {
          reason: "hybrid versus laminate suitability",
          readiness: "browsing"
        });
        setRoute("Browse products", "/products.html");
        pushGuided(
          "Hybrid is usually the stronger practical category.",
          "Laminate is better for simpler dry rooms; hybrid suits water resistance and durability.",
          "What matters most for this project?",
          prompts.actions.productGuide
        );
        return;
      }

      if (knowledge && typeof knowledge.findApprovedAnswer === "function") {
        const specificMatch = knowledge.findApprovedAnswer(value);
        if (specificMatch && /^range_/.test(specificMatch.key || "")) {
          if (pushKnowledgeAnswer(specificMatch)) {
            return;
          }
        }
      }

      if (includesAny(lowerValue, ["engineered timber", "engineered floor", "herringbone", "chevron"])) {
        setIntent("product_guidance", {
          category: "engineered",
          recommended_category: "engineered",
          reason: "premium finish and timber look",
          readiness: "browsing"
        });
        setRoute("Browse products", "/products.html");
        pushGuided(
          "Engineered timber is the premium finish path.",
          "Range, colour, and install method should be reviewed clearly.",
          "Browse engineered products.",
          prompts.actions.productGuide
        );
        return;
      }

      if (includesAny(lowerValue, ["do not know area", "do not know my area", "don't know area", "don't know my area", "not sure area", "not sure my area", "unsure about area", "floor plan", "floorplan", "measure area"])) {
        const hasFloorPlanContext = includesAny(lowerValue, ["floor plan", "floorplan"]);
        setIntent(hasFloorPlanContext ? "floorplan_help" : "missing_info_collection", {
          measurement_method: hasFloorPlanContext ? "floorplan_upload" : "",
          reason: "area unclear"
        });
        setRoute(hasFloorPlanContext ? "Measure from floor plan" : "Continue quote", hasFloorPlanContext ? "/floorplan.html" : "/quote.html");
        pushGuided(
          "No problem. You can still move forward without the area right now.",
          hasFloorPlanContext
            ? "Use floor plan measurement when you already have a plan."
            : "If you're unsure about size, a rough total, room entry, or floor plan can keep the quote moving.",
          hasFloorPlanContext
            ? "Open floor plan measurement."
            : "Continue to the area step.",
          prompts.actions.quoteHelp
        );
        return;
      }

      if (policyDecision.notice) {
        if (policyDecision.notice.indexOf("cannot calculate") >= 0) {
          setIntent("price_question", {
            reason: "cost question without pricing calculation"
          });
          setRoute("Start quote", "/quote.html");
          pushGuided(
            "The estimate depends on product, area, stairs, removal, trims and final site details.",
            "I cannot give exact pricing or rates here.",
            "Start the quote for a structured estimate.",
            prompts.actions.quoteHelp
          );
          return;
        }
        pushGuided(
          policyDecision.notice,
          "Use this assistant for flooring choice, quote scope, and the next useful step.",
          "Start the quote or review scope.",
          prompts.actions.quoteHelp
        );
        return;
      }

      if (knowledge && typeof knowledge.findApprovedAnswer === "function") {
        if (pushKnowledgeAnswer(knowledge.findApprovedAnswer(value))) {
          return;
        }
      }

      if (/^\d+(\.\d+)?$/.test(value)) {
        setIntent("missing_info_collection", {
          area: Number(value),
          area_m2: Number(value),
          measurement_method: state.draft.measurement_method || "manual_total",
          reason: "draft area captured"
        });
        pushGuided(
          value + " m2 noted as draft context only.",
          "Keep it as a note here and enter it in the quote when ready.",
          "Open the quote and enter the area.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["i am ready", "i'm ready", "ready for quote", "ready to quote", "start quote", "start the quote"])) {
        setIntent("start_quote", {
          readiness: "ready",
          reason: "customer ready to continue to quote"
        });
        setRoute("Start quote", "/quote.html");
        pushGuided(
          "The project is ready to continue.",
          "The quote page will collect the required details safely.",
          "Start the quote.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (scenarios && typeof scenarios.detectScenario === "function") {
        const detectedScenario = scenarios.detectScenario(value);
        if (detectedScenario && startScenario(detectedScenario)) {
          return;
        }
      }

      if (policyDecision.intent === "install_only" || value.toLowerCase().indexOf("install only") >= 0) {
        setIntent("install_only", { quote_mode: "install_only", reason: "customer already has flooring materials" });
        setRoute("Start quote", "/quote.html");
        pushGuided(
          "Installation-only path selected.",
          "The quote still needs area, prep, and extras checked.",
          "Start the quote and select Installation Only.",
          prompts.actions.nextSteps
        );
        return;
      }

      const intent = policyDecision.intent || inferIntent(value);

      if (intent === "product_help" || intent === "product_guidance" || intent === "product") {
        startProductGuide();
        return;
      }
      if (intent === "start_quote" || intent === "quote_explanation" || intent === "quote") {
        explainQuote();
        return;
      }
      if (intent === "existing_quote_review" || intent === "quick_quote_completeness") {
        startQuoteReviewGuide();
        return;
      }
      if (intent === "document_quote_review") {
        startQuoteReviewGuide();
        return;
      }
      if (intent === "quote_review_result_explanation") {
        setIntent("quote_review_result_explanation", {
          readiness: "review",
          reason: "quote review result explanation"
        });
        setRoute("Upload written quote", "/quote-review.html");
        pushGuided(
          "A review result starts with quote readiness.",
          "It should show Not ready to compare, Partly clear, or Clear enough to compare, then list what to confirm before accepting.",
          "Open the review and check the questions section.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "floorplan_help") {
        setIntent("floorplan_help", {
          measurement_method: "floorplan_upload",
          reason: "floor plan measurement support"
        });
        setRoute("Measure floor plan", "/floorplan.html");
        pushGuided(
          "Use floor plan measurement when you already have a plan.",
          "If you are only unsure about area, the quote can still start with rough details.",
          "Open floor plan measurement.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "suburb_service") {
        setIntent("suburb_service", { reason: "service area question" });
        setRoute("Start quote", "/quote.html");
        pushGuided(
          "Operon supports Sydney flooring quote enquiries.",
          "Add the suburb in the quote so the project can be reviewed properly.",
          "Start the quote and enter the suburb.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "stairs_removal_scope" || intent === "scope_validation" || intent === "review") {
        setIntent("stairs_removal_scope", {
          readiness: "review",
          reason: "scope details need review"
        });
        setRoute("Check existing quote", "/quote-review.html");
        pushGuided(
          "Scope review is the right next step.",
          getValidationSummary(mapper.toStructuredOutput(state.draft)) || "Check the common missing items before submitting.",
          "Open quote review.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "contact_human" || intent === "operator_handoff") {
        setOperatorHandoff();
        pushGuided(
          "I can route you to human follow-up.",
          "Submit your contact details and project note so a person can review it.",
          "Request operator follow-up.",
          prompts.actions.nextSteps
        );
        state.stage = "operator_handoff";
        return;
      }
      if (intent === "unsupported" && policy && typeof policy.getUnsupportedResponse === "function") {
        pushGuided(
          policy.getUnsupportedResponse(),
          "This assistant stays focused on products, quote scope, and guided next steps.",
          "Choose a guided path.",
          prompts.actions.welcome
        );
        return;
      }

      setIntent("general_question", { reason: "general flooring question" });
      startDetailCollection();
    }

    return {
      begin: begin,
      applyAction: applyAction,
      applyTextInput: applyTextInput,
      getSnapshot: function () {
        const structured = mapper.toStructuredOutput(state.draft);
        return {
          stage: state.stage,
          transcript: clone(state.transcript),
          draft: clone(state.draft),
          siteState: readSiteState(),
          structuredOutput: structured,
          quoteFieldDraft: mapper.toQuoteFieldDraft(structured),
          localStorageDraft: mapper.toLocalStorageDraft(structured),
          handoffReadiness: mapper.toHandoffReadiness(structured),
          routeSuggestion: clone(state.routeSuggestion),
          prequalification: clone(state.prequalification),
          quoteReviewGuide: clone(state.quoteReviewGuide),
          operatorHandoff: state.operatorHandoff ? clone(state.operatorHandoff) : null,
          triggerNudge: state.triggerNudge ? clone(state.triggerNudge) : null
        };
      },
      applyTrigger: applyTrigger
    };
  }

  window.OperonChatbotLogic = {
    createChatbotLogic: createChatbotLogic
  };
}());
