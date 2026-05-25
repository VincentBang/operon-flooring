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
      initialRouteHref: "quote.html",
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
        href: settings.initialRouteHref
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
      state.routeSuggestion = { label: label, href: href, focusId: focusId || "" };
      state.draft = mapper.sanitiseDraft(Object.assign({}, state.draft, {
        next_step: href
      }));
    }

    function setOperatorHandoff() {
      const href = "quote.html?from=chatbot&support=operator";
      setIntent("operator_handoff", {
        readiness: "review",
        reason: "customer requested human support",
        missing_items_to_check: ["contact details", "project note"]
      });
      setRoute("Request operator follow-up", href, "fullName");
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
      const insight = focus === "extracted" && siteState && siteState.reviewExtractedDetails && siteState.reviewExtractedDetails.length
        ? "Extracted detail: " + getFirstUsefulReviewItem(siteState.reviewExtractedDetails, missing)
        : "Main scope point: " + missing;
      const nextStep = focus === "question" ? question : "Confirm that item, or build a structured Operon estimate.";

      setIntent("quote_review_result_explanation", {
        readiness: "review",
        reason: "quote review result guidance",
        missing_items_to_check: siteState && siteState.reviewMissingScope ? siteState.reviewMissingScope.slice(0, 5) : []
      });
      setRoute("Get structured estimate", siteState && siteState.next ? siteState.next.href : "quote.html?source=quote_review");
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
        setRoute("Start quote", "quote.html?from=chatbot");
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
        setRoute("Start quote", "quote.html?from=products");
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
        setRoute("Review your quote", "quote-review.html");
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
        setRoute("Continue quote", "quote.html", siteState && siteState.next ? siteState.next.focusId : "");
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
        setRoute("Get structured estimate", "quote.html?source=quote_review");
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
        setRoute("Confirm details", "thank-you.html#leadStageSection");
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
        return { label: "Start quote", href: "quote.html" };
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
      setIntent("route_next_step");
      pushGuided(
        settings.welcomeText || "Get clear guidance on flooring type, quote scope, and the details worth preparing before review.",
        "",
        "Choose a topic below or type one project detail.",
        prompts.actions.welcome
      );
      scheduleIdleSuggestion();
    }

    function explainQuote() {
      state.stage = "quote_help";
      setIntent("quote_explanation", { readiness: "unsure", reason: "estimate versus final quote" });
      setRoute("Start quote", "quote.html");
      pushGuided(
        "The quote is a structured estimate before final confirmation.",
        "Product direction, measured area, removal, and floor preparation shape the scope.",
        "Start the quote or check missing details.",
        prompts.actions.quoteHelp
      );
    }

    function startProductGuide() {
      state.stage = "product_guide";
      setIntent("product_guidance", { readiness: "browsing" });
      setRoute("Browse products", "products.html");
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
      setRoute("Start quote", "quote.html");
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
      setRoute(structured.missing_items.length ? "Review quote scope" : "Start quote", structured.missing_items.length ? "quote-review.html" : "quote.html");
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
      setRoute("Start quote", "quote.html");
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
      if (handleScenarioAction(actionId)) {
        return;
      }

      switch (actionId) {
        case "start_product_guide":
          pushUser("Help me choose a flooring type");
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
          setRoute("Start quote", "quote.html");
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
          setRoute("Start quote", "quote.html");
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
            setRoute("Start quote", "quote.html");
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
          setIntent("product_guidance", { readiness: "browsing" });
          setRoute("Browse products", "products.html");
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
          setIntent("quote_explanation", { reason: "cost factors without pricing calculation" });
          pushGuided(
            "Pricing depends on scope, not one simple number.",
            "Area, product range, removal, prep, trims, and stairs are the main checks.",
            "Start the quote or check missing details.",
            prompts.actions.quoteHelp
          );
          return;
        case "route_floorplan":
          pushUser(actionLabel(actionId));
          setIntent("floorplan_help", { measurement_method: "floorplan_upload", reason: "customer has a floor plan" });
          setRoute("Measure from floor plan", "floorplan.html");
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
          setIntent("quick_quote_completeness", {
            readiness: "review",
            reason: "no-file quote completeness check",
            missing_items_to_check: ["product clarity", "area", "inclusions", "exclusions", "site assumptions"]
          });
          setRoute("Run quick check", "quote-review.html");
          pushGuided(
            prompts.copy.quickCompleteness,
            "It checks whether the quote is complete enough to compare, based only on what you enter.",
            "Run the quick check.",
            prompts.actions.nextSteps
          );
          state.stage = "quick_quote_completeness";
          return;
        case "review_existing_quote":
          pushUser(actionLabel(actionId));
          setIntent("document_quote_review", {
            readiness: "review",
            reason: "document-based quote review",
            missing_items_to_check: ["product clarity", "installation method", "floor preparation", "disposal", "site details", "trims"]
          });
          setRoute("Upload written quote", "quote-review.html");
          pushGuided(
            prompts.copy.documentReview,
            "It can check visible inclusions and create questions to confirm before accepting.",
            "Upload written quote.",
            prompts.actions.nextSteps
          );
          state.stage = "quote_review";
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
          setRoute("Confirm timing", "thank-you.html#leadStageSection");
          pushGuided(
            "Good. Add that timing to the request.",
            "It keeps follow-up useful without adding pressure.",
            "Select the same timing option on this page.",
            prompts.actions.nextSteps
          );
          state.stage = "post_submit_followup";
          return;
        case "ready_for_quote":
          setIntent("route_next_step", { readiness: "ready" });
          setRoute("Start quote", "quote.html");
          pushUser(actionLabel(actionId));
          pushGuided(
            "The project is ready to continue.",
            getValidationSummary(mapper.toStructuredOutput(state.draft)) || "The quote will collect the required fields.",
            "Start the quote.",
            prompts.actions.nextSteps
          );
          state.stage = "ready";
          return;
        case "review_scope":
          setIntent("document_quote_review", { readiness: "review" });
          setRoute("Upload written quote", "quote-review.html");
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
        setIntent("unsupported", {
          reason: "competitor pricing comparison requested"
        });
        setRoute("Upload written quote", "quote-review.html");
        pushGuided(
          "I cannot judge another quote by price or claim a cheaper outcome.",
          "Price is easier to compare once both quotes describe the same job.",
          "Upload the written quote or run the quick completeness check.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["do not have the file", "don't have the file", "no file", "quick check", "quick completeness", "only know total", "only says supply and install", "quote only says", "my quote only says"])) {
        setIntent("quick_quote_completeness", {
          readiness: "review",
          reason: "no-file quote completeness check",
          missing_items_to_check: ["product clarity", "area", "inclusions", "exclusions", "site assumptions"]
        });
        setRoute("Run quick check", "quote-review.html");
        pushGuided(
          prompts.copy.quickCompleteness,
          "It is not a full quote review and does not judge price fairness.",
          "Run the quick check.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["product match 35", "match 35", "35% match", "35 percent match"])) {
        setIntent("quote_review_result_explanation", {
          readiness: "review",
          reason: "quote review result explanation",
          missing_items_to_check: ["product brand", "range", "colour", "full specification"]
        });
        setRoute("Upload written quote", "quote-review.html");
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
        setRoute("Upload written quote", "quote-review.html");
        pushGuided(
          "A quote review result is about scope completeness and comparison readiness.",
          "It should explain what is clear, what is missing, and what to ask before accepting.",
          "Open the review and check the questions section.",
          prompts.actions.nextSteps
        );
        return;
      }

      if (includesAny(lowerValue, ["existing quote", "another quote", "compare quote", "quote review", "review my quote", "check my quote", "uploaded quote", "written quote", "hybrid 7mm quote", "is this quote fair"])) {
        setIntent("document_quote_review", {
          readiness: "review",
          reason: "document-based quote review",
          missing_items_to_check: ["product clarity", "installation method", "floor preparation", "disposal", "site details", "trims"]
        });
        setRoute("Upload written quote", "quote-review.html");
        pushGuided(
          prompts.copy.documentReview,
          "It checks visible details, scope clarity, and comparison readiness without judging cheapest price.",
          "Upload written quote.",
          prompts.actions.nextSteps
        );
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
        setRoute("Browse products", "products.html");
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
        setRoute("Start quote", "quote.html");
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
        setRoute("Start quote", "quote.html");
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
        setRoute("Review quote scope", "quote-review.html");
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
        setRoute("Review quote scope", "quote-review.html");
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
        setRoute("Review quote scope", "quote-review.html");
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
        setRoute("Review quote scope", "quote-review.html");
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
        setRoute("Start quote", "quote.html");
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
        setRoute("Browse products", "products.html");
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
        setRoute("Start quote", "quote.html");
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
        setRoute("Browse products", "products.html");
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
        setRoute("Browse products", "products.html");
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
        setRoute(hasFloorPlanContext ? "Measure from floor plan" : "Continue quote", hasFloorPlanContext ? "floorplan.html" : "quote.html");
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
          setIntent("quote_explanation", {
            reason: "cost question without pricing calculation"
          });
          setRoute("Start quote", "quote.html");
          pushGuided(
            "It depends on area, product and site conditions.",
            "I cannot calculate pricing here.",
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
        setIntent("route_next_step", {
          readiness: "ready",
          reason: "customer ready to continue to quote"
        });
        setRoute("Start quote", "quote.html");
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
        setRoute("Start quote", "quote.html");
        pushGuided(
          "Installation-only path selected.",
          "The quote still needs area, prep, and extras checked.",
          "Start the quote and select Installation Only.",
          prompts.actions.nextSteps
        );
        return;
      }

      const intent = policyDecision.intent || inferIntent(value);

      if (intent === "product_guidance" || intent === "product") {
        startProductGuide();
        return;
      }
      if (intent === "quote_explanation" || intent === "quote") {
        explainQuote();
        return;
      }
      if (intent === "quick_quote_completeness") {
        setIntent("quick_quote_completeness", {
          readiness: "review",
          reason: "no-file quote completeness check"
        });
        setRoute("Run quick check", "quote-review.html");
        pushGuided(
          prompts.copy.quickCompleteness,
          "It checks scope completeness only, based on what you enter.",
          "Run the quick check.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "document_quote_review") {
        setIntent("document_quote_review", {
          readiness: "review",
          reason: "document-based quote review"
        });
        setRoute("Upload written quote", "quote-review.html");
        pushGuided(
          prompts.copy.documentReview,
          "This is stronger than a no-file check because it can use visible document details.",
          "Upload written quote.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "quote_review_result_explanation") {
        setIntent("quote_review_result_explanation", {
          readiness: "review",
          reason: "quote review result explanation"
        });
        setRoute("Upload written quote", "quote-review.html");
        pushGuided(
          "A review result is about scope completeness and comparison readiness.",
          "It should explain what is clear, what is missing, and what to ask before accepting.",
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
        setRoute("Measure from floor plan", "floorplan.html");
        pushGuided(
          "Use floor plan measurement when you already have a plan.",
          "If you are only unsure about area, the quote can still start with rough details.",
          "Open floor plan measurement.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "scope_validation" || intent === "review") {
        setIntent("scope_validation", {
          readiness: "review",
          reason: "scope details need review"
        });
        setRoute("Review quote scope", "quote-review.html");
        pushGuided(
          "Scope review is the right next step.",
          getValidationSummary(mapper.toStructuredOutput(state.draft)) || "Check the common missing items before submitting.",
          "Open quote review.",
          prompts.actions.nextSteps
        );
        return;
      }
      if (intent === "operator_handoff") {
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
