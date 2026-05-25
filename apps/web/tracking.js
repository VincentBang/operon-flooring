(function () {
  const TRACKING_KEY = "operon_tracking_v2";
  const SESSION_KEY = "operon_tracking_session_v1";
  const FUNNEL_KEY = "operon_funnel_session_v1";
  const ABANDON_KEY = "operon_quote_abandon_v1";
  const LAST_COMPLETED_STEP_KEY = "last_step_completed";
  const LAST_COMPLETED_STEP_NAME_KEY = "last_step_name";
  const RAPID_DUPLICATE_WINDOW_MS = 500;
  const recentEventSignatures = {};
  const GA_ALLOWED_PARAM_KEYS = [
    "page",
    "page_type",
    "page_slug",
    "step_index",
    "step_name",
    "product_category",
    "quote_mode",
    "area_method",
    "review_required",
    "confidence_level",
    "source",
    "measurement_mode",
    "has_floorplan",
    "has_stairs",
    "has_quote_review",
    "missing_scope_count",
    "file_uploaded",
    "cta_location",
    "cta_intent",
    "destination",
    "quote_source",
    "event_context",
    "quote_id",
    "estimated_value",
    "price_pending",
    "email_source",
    "has_customer_email",
    "customer_email_sent",
    "internal_notification_sent",
    "email_attempted"
  ];
  const CTA_EVENT_ALIASES = {
    click_hero_start_quote: "hero_start_quote_click",
    hero_instant_quote: "hero_start_quote_click",
    click_hero_quote_review: "hero_quote_review_click",
    hero_validate_quote: "hero_quote_review_click",
    click_start_quote_header: "header_start_quote_click",
    header_quote: "header_start_quote_click",
    click_quote_review_link: "quote_review_link_clicked",
    click_contact_email: "email_click"
  };
  const GA_EVENT_ALIASES = {
    quote_review_start: "quote_review_started",
    quote_review_mode_select: "quote_review_mode_selected",
    quote_review_complete: "quote_review_generated",
    quote_review_document_review_generate: "quote_review_generated",
    quote_review_to_quote: "quote_review_to_quote_clicked",
    quote_result_view: "quote_result_viewed",
    quote_email_send_attempt: "quote_email_copy_requested",
    quote_email_send_success: "quote_email_copy_sent",
    quote_email_send_failed: "quote_email_copy_failed",
    floorplan_upload_start: "floorplan_upload_started",
    floorplan_to_quote: "floorplan_area_sent_to_quote",
    product_selected: "quote_product_selected",
    product_select: "quote_product_selected"
  };

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function createUuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
      const random = Math.random() * 16 | 0;
      const value = char === "x" ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  function getDeviceType() {
    if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) {
      return "mobile";
    }
    if (window.matchMedia && window.matchMedia("(max-width: 1080px)").matches) {
      return "tablet";
    }
    return "desktop";
  }

  function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get("utm_source") || document.referrer || "direct";
  }

  function readTrackingState() {
    const parsed = safeParse(localStorage.getItem(TRACKING_KEY), null);
    const state = Object.assign({
      quoteStarts: 0,
      quoteSubmissions: 0,
      floorplanOpens: 0,
      floorplanAreaUses: 0,
      lastQuoteValue: 0,
      lastQuoteType: "",
      lastQuoteAt: "",
      averageQuoteValue: 0,
      stepViewedCounts: {},
      stepCompletedCounts: {},
      abandonmentByStep: {},
      events: []
    }, parsed || {});
    state.events = Array.isArray(state.events)
      ? state.events.slice(-100).map(function (event) {
        const safeEvent = Object.assign({}, event || {});
        safeEvent.metadata = sanitizeAnalyticsParams(safeEvent.metadata || {});
        safeEvent.quote_id = cleanAnalyticsValue(safeEvent.quote_id) || null;
        return safeEvent;
      })
      : [];
    return state;
  }

  function writeTrackingState(state) {
    localStorage.setItem(TRACKING_KEY, JSON.stringify(state));
  }

  function readFunnelState() {
    const parsed = safeParse(localStorage.getItem(FUNNEL_KEY), null);
    const state = Object.assign({
      session_id: "",
      landing_page: window.location.pathname,
      traffic_source: getTrafficSource(),
      device_type: getDeviceType(),
      started_quote: false,
      completed_quote: false,
      last_step_completed: 0,
      last_step_viewed: 0,
      current_step_name: "",
      quote_id: null,
      estimated_quote_value: 0,
      abandoned_at_step: 0
    }, parsed || {});
    delete state.raw_payload;
    return state;
  }

  function writeFunnelState(state) {
    localStorage.setItem(FUNNEL_KEY, JSON.stringify(state));
  }

  function clearPendingAbandonment() {
    localStorage.removeItem(ABANDON_KEY);
  }

  function flushPendingAbandonment() {
    const pending = safeParse(localStorage.getItem(ABANDON_KEY), null);
    if (!pending || pending.reported) {
      return;
    }

    const trackingState = readTrackingState();
    const stepKey = String(Number(pending.step) || 0);
    trackingState.abandonmentByStep[stepKey] = (trackingState.abandonmentByStep[stepKey] || 0) + 1;
    writeTrackingState(trackingState);

    trackEvent("quote_abandon", {
      step: Number(pending.step) || 0,
      step_name: pending.step_name || "",
      source: "resume_visit"
    });

    clearPendingAbandonment();
  }

  function appendEvent(state, event) {
    const currentEvents = Array.isArray(state.events) ? state.events : [];
    state.events = currentEvents.slice(-99).concat(event);
  }

  function shouldSkipRapidDuplicate(eventName, signature) {
    const key = eventName + "::" + signature;
    const now = Date.now();
    const lastSeenAt = recentEventSignatures[key] || 0;
    recentEventSignatures[key] = now;
    return lastSeenAt > 0 && (now - lastSeenAt) < RAPID_DUPLICATE_WINDOW_MS;
  }

  function cleanAnalyticsValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === "string") {
      return value.slice(0, 100);
    }
    return undefined;
  }

  function firstDefined() {
    for (let index = 0; index < arguments.length; index += 1) {
      if (typeof arguments[index] !== "undefined" && arguments[index] !== null && arguments[index] !== "") {
        return arguments[index];
      }
    }
    return undefined;
  }

  function sanitizeAnalyticsParams(params) {
    const source = params && typeof params === "object" ? params : {};
    const mapped = {
      page: firstDefined(source.page, window.location.pathname),
      page_type: firstDefined(source.page_type, source.pageType),
      page_slug: firstDefined(source.page_slug, source.pageSlug),
      step_index: firstDefined(source.step_index, source.step, source.stepNumber),
      step_name: firstDefined(source.step_name, source.stepName),
      product_category: firstDefined(source.product_category, source.category, source.productCategory, source.type),
      quote_mode: firstDefined(source.quote_mode, source.quoteMode, source.type),
      area_method: firstDefined(source.area_method, source.measurement_method, source.measurementMethod),
      review_required: firstDefined(source.review_required, source.reviewRequired),
      confidence_level: firstDefined(source.confidence_level, source.confidenceLevel, source.quote_confidence),
      source: firstDefined(source.source),
      measurement_mode: firstDefined(source.measurement_mode, source.measurementMethod, source.method),
      has_floorplan: firstDefined(source.has_floorplan, source.hasFloorplan),
      has_stairs: firstDefined(source.has_stairs, source.hasStairs),
      has_quote_review: firstDefined(source.has_quote_review, source.hasQuoteReview),
      missing_scope_count: firstDefined(source.missing_scope_count, source.missingScopeCount),
      file_uploaded: firstDefined(source.file_uploaded, source.has_uploaded_file, source.hasUploadedFile, source.has_file),
      cta_location: firstDefined(source.cta_location, source.ctaLocation),
      cta_intent: firstDefined(source.cta_intent, source.ctaIntent, source.intent),
      destination: firstDefined(source.destination),
      quote_source: firstDefined(source.quote_source, source.quoteSource),
      event_context: firstDefined(source.event_context, source.cta, source.label, source.action_id, source.interaction_type, source.review_mode),
      quote_id: firstDefined(source.quote_id, source.quoteId),
      estimated_value: firstDefined(source.estimated_value, source.estimatedTotal, source.estimated_total, source.total_estimate),
      price_pending: firstDefined(source.price_pending, source.pricePending),
      email_source: firstDefined(source.email_source, source.emailSource),
      has_customer_email: firstDefined(source.has_customer_email, source.hasCustomerEmail),
      customer_email_sent: firstDefined(source.customer_email_sent, source.customerEmailSent),
      internal_notification_sent: firstDefined(source.internal_notification_sent, source.internalNotificationSent),
      email_attempted: firstDefined(source.email_attempted, source.emailAttempted)
    };
    const safe = {};
    GA_ALLOWED_PARAM_KEYS.forEach(function (key) {
      const value = cleanAnalyticsValue(mapped[key]);
      if (typeof value !== "undefined") {
        safe[key] = value;
      }
    });
    return safe;
  }

  window.operonTrack = function (eventName, params) {
    if (!eventName) {
      return;
    }
    const safeParams = sanitizeAnalyticsParams(params || {});
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, safeParams);
      }
    } catch (error) {
      // GA4 is optional and should never block UX.
    }
  };

  function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = createUuid();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    const funnelState = readFunnelState();
    if (!funnelState.session_id) {
      funnelState.session_id = sessionId;
      funnelState.landing_page = window.location.pathname;
      funnelState.traffic_source = getTrafficSource();
      funnelState.device_type = getDeviceType();
      writeFunnelState(funnelState);
    }
    return sessionId;
  }

  function getSupabaseConfig() {
    const config = window.OPERON_SUPABASE_CONFIG;
    if (!config || !config.url || !config.anonKey || /YOUR_SUPABASE/i.test(config.url) || /YOUR_SUPABASE/i.test(config.anonKey)) {
      return null;
    }
    return config;
  }

  function getSupabaseTableName(tableName) {
    const config = getSupabaseConfig();
    const tables = config && config.tables || {};
    return tables[tableName] || tableName;
  }

  async function sendToSupabase(tableName, payload, options) {
    const config = getSupabaseConfig();
    if (!config) {
      return false;
    }

    const settings = Object.assign({ upsert: false, onConflict: "" }, options || {});
    const headers = {
      "Content-Type": "application/json",
      apikey: config.anonKey,
      Authorization: "Bearer " + config.anonKey,
      Prefer: settings.upsert ? "resolution=merge-duplicates" : "return=minimal"
    };

    const url = new URL(config.url.replace(/\/$/, "") + "/rest/v1/" + getSupabaseTableName(tableName));
    if (settings.upsert && settings.onConflict) {
      url.searchParams.set("on_conflict", settings.onConflict);
    }

    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  function updateFunnelState(patch) {
    const state = readFunnelState();
    Object.assign(state, patch || {});
    writeFunnelState(state);
    void sendToSupabase("quote_funnel_sessions", state, {
      upsert: true,
      onConflict: "session_id"
    });
    return state;
  }

  function trackEvent(eventName, metadata) {
    const sessionId = getOrCreateSessionId();
    const details = sanitizeAnalyticsParams(metadata || {});
    const normalisedStep = Number(details.step_index) || null;
    const normalisedStepName = details.step_name || null;
    const trackingState = readTrackingState();
    const event = {
      id: createUuid(),
      created_at: new Date().toISOString(),
      session_id: sessionId,
      quote_id: details.quoteId || details.quote_id || null,
      event_name: eventName,
      step_number: normalisedStep,
      step_name: normalisedStepName,
      page_url: window.location.pathname + window.location.hash,
      device_type: getDeviceType(),
      metadata: details
    };

    window.operonTrack(eventName, details);
    if (GA_EVENT_ALIASES[eventName]) {
      window.operonTrack(GA_EVENT_ALIASES[eventName], details);
    }
    if (eventName === "quote_review_upload_attempt") {
      window.operonTrack("quote_review_document_upload_started", details);
      if (details.has_file) {
        window.operonTrack("quote_review_document_uploaded", {
          source: "quote_review"
        });
      }
    }
    if (eventName === "quote_review_payload_saved") {
      window.operonTrack("quote_review_generated", details);
      if (details.review_mode === "quick") {
        window.operonTrack("quote_review_quick_check_started", details);
      }
    }

    appendEvent(trackingState, event);
    writeTrackingState(trackingState);
    void sendToSupabase("quote_events", event);
    if (eventName === "cta_click") {
      const aliasEvent = Object.assign({}, event, {
        id: createUuid(),
        event_name: "CTA_click"
      });
      appendEvent(trackingState, aliasEvent);
      writeTrackingState(trackingState);
      void sendToSupabase("quote_events", aliasEvent);
    }
    return { trackingState: trackingState, event: event };
  }

  function trackProductCatalogueView(payload) {
    const details = Object.assign({
      page: window.location.pathname.replace(/^\//, "") || "index.html",
      category: "all",
      visible_count: 0,
      selected_product: ""
    }, payload || {});
    const signature = [
      details.page,
      details.category,
      details.visible_count,
      details.selected_product
    ].join("|");
    if (shouldSkipRapidDuplicate("product_catalogue_view", signature)) {
      return null;
    }
    return trackEvent("product_catalogue_view", details);
  }

  function trackProductFilterChange(payload) {
    const details = Object.assign({
      category: "all",
      source_filter: "",
      brand: "all",
      colour: "all",
      thickness: "all",
      visible_count: 0
    }, payload || {});
    const signature = [
      details.category,
      details.source_filter,
      details.brand,
      details.colour,
      details.thickness,
      details.visible_count,
      details.value || ""
    ].join("|");
    if (shouldSkipRapidDuplicate("product_filter_change", signature)) {
      return null;
    }
    return trackEvent("product_filter_change", details);
  }

  function trackProductSelect(payload) {
    const details = Object.assign({
      category: "",
      brand: "",
      range: "",
      range_id: "",
      product_id: "",
      selection_mode: "",
      source: ""
    }, payload || {});
    const signature = [
      details.category,
      details.brand,
      details.range,
      details.range_id,
      details.product_id,
      details.selection_mode,
      details.source
    ].join("|");
    if (shouldSkipRapidDuplicate("product_select", signature)) {
      return null;
    }
    trackEvent("product_selected", details);
    return trackEvent("product_select", details);
  }

  function trackQuoteStart() {
    const funnel = readFunnelState();
    if (funnel.started_quote) {
      return funnel;
    }
    const trackingState = readTrackingState();
    trackingState.quoteStarts += 1;
    writeTrackingState(trackingState);
    clearPendingAbandonment();
    trackEvent("quote_start", {});
    trackEvent("quote_started", { source: "quote_flow" });
    return updateFunnelState({
      started_quote: true,
      landing_page: window.location.pathname,
      traffic_source: getTrafficSource(),
      device_type: getDeviceType()
    });
  }

  function trackQuoteStepViewed(stepNumber, stepName) {
    const trackingState = readTrackingState();
    const key = String(stepNumber);
    trackingState.stepViewedCounts[key] = (trackingState.stepViewedCounts[key] || 0) + 1;
    writeTrackingState(trackingState);
    trackEvent("quote_step_view", {
      step: stepNumber,
      step_name: stepName
    });
    trackEvent("quote_step_viewed", {
      step_index: stepNumber,
      step_name: stepName
    });
    trackEvent("step_view", {
      step: stepNumber,
      step_name: stepName
    });
    return updateFunnelState({
      started_quote: true,
      last_step_viewed: stepNumber,
      current_step_name: stepName,
      abandoned_at_step: stepNumber
    });
  }

  function trackQuoteStepCompleted(stepNumber, stepName) {
    const trackingState = readTrackingState();
    const key = String(stepNumber);
    trackingState.stepCompletedCounts[key] = (trackingState.stepCompletedCounts[key] || 0) + 1;
    localStorage.setItem(LAST_COMPLETED_STEP_KEY, key);
    localStorage.setItem(LAST_COMPLETED_STEP_NAME_KEY, stepName || "");
    writeTrackingState(trackingState);
    trackEvent("quote_step_complete", {
      step: stepNumber,
      step_name: stepName
    });
    trackEvent("quote_step_completed", {
      step_index: stepNumber,
      step_name: stepName
    });
    trackEvent("step_complete", {
      step: stepNumber,
      step_name: stepName
    });
    return updateFunnelState({
      started_quote: true,
      last_step_completed: stepNumber,
      current_step_name: stepName
    });
  }

  function trackQuoteStepError(stepNumber, stepName, message, source) {
    trackEvent("quote_step_missing_info_shown", {
      step_index: stepNumber,
      step_name: stepName,
      source: source || "validation"
    });
    return trackEvent("step_error", {
      step: stepNumber,
      step_name: stepName,
      message: message || "",
      source: source || ""
    });
  }

  function trackQuoteSubmitAttempt(quoteValue, quoteType, realArea) {
    const amount = Number(quoteValue) || 0;
    trackEvent("quote_submit", {
      estimated_value: amount,
      area: Number(realArea) || 0,
      type: quoteType || ""
    });
    trackEvent("quote_submitted", {
      quote_mode: quoteType || "",
      area_method: "quote_form"
    });
  }

  function trackQuoteSubmitSuccess(quoteId, quoteValue, quoteType, realArea) {
    const amount = Number(quoteValue) || 0;
    const trackingState = readTrackingState();
    const nextTotal = trackingState.quoteSubmissions + 1;
    trackingState.averageQuoteValue = nextTotal > 0
      ? (((trackingState.averageQuoteValue * trackingState.quoteSubmissions) + amount) / nextTotal)
      : 0;
    trackingState.quoteSubmissions = nextTotal;
    trackingState.lastQuoteValue = amount;
    trackingState.lastQuoteType = quoteType || "";
    trackingState.lastQuoteAt = new Date().toISOString();
    localStorage.setItem("operon_last_quote_value", String(amount));
    localStorage.setItem("operon_last_quote_type", quoteType || "");
    writeTrackingState(trackingState);
    clearPendingAbandonment();
    trackEvent("quote_submit_success", {
      quoteId: quoteId,
      estimated_value: amount,
      area: Number(realArea) || 0,
      type: quoteType || ""
    });
    trackEvent("quote_submitted", {
      quote_mode: quoteType || "",
      area_method: "quote_form"
    });
    return updateFunnelState({
      completed_quote: true,
      quote_id: quoteId || null,
      estimated_quote_value: amount,
      abandoned_at_step: 0
    });
  }

  function trackQuoteSubmitError(message, quoteType, realArea) {
    trackEvent("quote_submit_error", {
      message: message || "",
      area: Number(realArea) || 0,
      type: quoteType || ""
    });
  }

  function trackQuoteSubmit(quoteId, quoteValue, quoteType, realArea) {
    return trackQuoteSubmitSuccess(quoteId, quoteValue, quoteType, realArea);
  }

  function trackQuoteAbandon(stepNumber, stepName) {
    const funnel = readFunnelState();
    if (!funnel.started_quote || funnel.completed_quote) {
      return funnel;
    }
    const nextStep = stepNumber || funnel.last_step_viewed || Number(localStorage.getItem(LAST_COMPLETED_STEP_KEY) || 0);
    const nextStepName = stepName || funnel.current_step_name || localStorage.getItem(LAST_COMPLETED_STEP_NAME_KEY) || "";
    localStorage.setItem(ABANDON_KEY, JSON.stringify({
      step: nextStep,
      step_name: nextStepName,
      captured_at: new Date().toISOString(),
      reported: false
    }));
    return updateFunnelState({
      abandoned_at_step: nextStep
    });
  }

  function trackFloorplanOpened() {
    const trackingState = readTrackingState();
    trackingState.floorplanOpens += 1;
    writeTrackingState(trackingState);
    trackEvent("floorplan_opened", {});
    return trackingState;
  }

  function trackFloorplanUploaded(fileName) {
    trackEvent("floorplan_upload_start", {
      has_floorplan: true,
      file_uploaded: !!fileName
    });
    trackEvent("floorplan_uploaded", {
      file_name: fileName || ""
    });
    trackEvent("floorplan_file_uploaded", {
      has_floorplan: true
    });
  }

  function trackFloorplanScaleSet(distanceMeters) {
    trackEvent("floorplan_scale_set", {
      distance_m: Number(distanceMeters) || 0
    });
  }

  function trackFloorplanRoomAdded(area, roomType) {
    trackEvent("floorplan_room_added", {
      area: Number(area) || 0,
      room_type: roomType || "flooring"
    });
    trackEvent("floorplan_manual_room_saved", {
      measurement_mode: roomType || "manual_trace"
    });
  }

  function trackFloorplanAreaUsed(area) {
    const payload = {
      area: Number(area) || 0
    };
    if (shouldSkipRapidDuplicate("floorplan_usage", String(payload.area))) {
      return updateFunnelState({
        estimated_quote_value: readFunnelState().estimated_quote_value
      });
    }
    const trackingState = readTrackingState();
    trackingState.floorplanAreaUses += 1;
    writeTrackingState(trackingState);
    trackEvent("floorplan_area_used", payload);
    trackEvent("floorplan_to_quote", {
      has_floorplan: true,
      area: payload.area
    });
    trackEvent("floorplan_area_sent_to_quote", {
      has_floorplan: true
    });
    trackEvent("floorplan_usage", payload);
    return updateFunnelState({
      estimated_quote_value: readFunnelState().estimated_quote_value
    });
  }

  function getTrackingState() {
    return readTrackingState();
  }

  function getFunnelState() {
    return readFunnelState();
  }

  function initTrackedCtaClicks() {
    document.querySelectorAll("[data-track-cta]").forEach(function (element) {
      if (element.dataset.trackingBound === "true") {
        return;
      }
      element.dataset.trackingBound = "true";
      element.addEventListener("click", function () {
        const eventName = element.getAttribute("data-track-cta") || "cta_click";
        const path = window.location.pathname.replace(/^\/+/, "") || "index.html";
        const payload = {
          cta: eventName,
          page: path,
          page_slug: path.replace(/\.html$/, ""),
          page_type: element.getAttribute("data-page-type") || document.body.getAttribute("data-page-type") || "",
          cta_location: element.getAttribute("data-cta-location") || "",
          cta_intent: element.getAttribute("data-cta-intent") || element.getAttribute("data-funnel-intent") || "",
          destination: element.getAttribute("href") || "",
          label: (element.textContent || "").trim(),
          quote_source: element.getAttribute("data-quote-source") || ""
        };
        trackEvent("cta_click", payload);
        if (element.href && element.href.indexOf("tel:") === 0) {
          trackEvent("phone_click", { source: eventName });
        }
        if (element.href && element.href.indexOf("mailto:") === 0) {
          trackEvent("email_click", { source: eventName });
        }
        if (CTA_EVENT_ALIASES[eventName]) {
          trackEvent(CTA_EVENT_ALIASES[eventName], payload);
        }
        if (element.hasAttribute("data-funnel-intent")) {
          trackEvent("funnel_intent_select", {
            source: element.getAttribute("data-funnel-intent"),
            event_context: eventName
          });
        }
        if (/^click_|^guide_to_quote_clicked$|^guide_to_quote_click$|^floor_plan_tool_clicked$|^suburb_page_quote_click$|^product_continue_to_quote$/.test(eventName)) {
          trackEvent(eventName, payload);
        }
      });
    });
  }

  function initContactFormTracking() {
    document.querySelectorAll("form[name='contact-enquiry'], .contact-form").forEach(function (form) {
      if (form.dataset.contactTrackingBound === "true") {
        return;
      }
      form.dataset.contactTrackingBound = "true";
      const markStarted = function () {
        if (form.dataset.contactTrackingStarted === "true") {
          return;
        }
        form.dataset.contactTrackingStarted = "true";
        trackEvent("contact_form_started", {
          source: "contact_form"
        });
      };
      form.addEventListener("input", markStarted, { once: false });
      form.addEventListener("change", markStarted, { once: false });
      form.addEventListener("submit", function () {
        trackEvent("contact_form_submitted", {
          source: "contact_form"
        });
      });
    });
  }

  window.OperonTracking = {
    getOrCreateSessionId: getOrCreateSessionId,
    trackEvent: trackEvent,
    trackQuoteStart: trackQuoteStart,
    trackQuoteStepViewed: trackQuoteStepViewed,
    trackQuoteStepCompleted: trackQuoteStepCompleted,
    trackQuoteStepError: trackQuoteStepError,
    trackQuoteSubmitAttempt: trackQuoteSubmitAttempt,
    trackQuoteSubmitSuccess: trackQuoteSubmitSuccess,
    trackQuoteSubmitError: trackQuoteSubmitError,
    trackQuoteSubmit: trackQuoteSubmit,
    trackQuoteAbandon: trackQuoteAbandon,
    trackFloorplanOpened: trackFloorplanOpened,
    trackFloorplanUploaded: trackFloorplanUploaded,
    trackFloorplanScaleSet: trackFloorplanScaleSet,
    trackFloorplanRoomAdded: trackFloorplanRoomAdded,
    trackFloorplanAreaUsed: trackFloorplanAreaUsed,
    trackProductCatalogueView: trackProductCatalogueView,
    trackProductFilterChange: trackProductFilterChange,
    trackProductSelect: trackProductSelect,
    initTrackedCtaClicks: initTrackedCtaClicks,
    sanitizeAnalyticsParams: sanitizeAnalyticsParams,
    getState: getTrackingState,
    getFunnelState: getFunnelState
  };

  flushPendingAbandonment();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initTrackedCtaClicks();
      initContactFormTracking();
    });
  } else {
    initTrackedCtaClicks();
    initContactFormTracking();
  }
}());
