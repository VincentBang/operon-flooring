(function () {
  const TRACKING_KEY = "operon_tracking_v2";
  const SESSION_KEY = "operon_tracking_session_v1";
  const FUNNEL_KEY = "operon_funnel_session_v1";
  const ABANDON_KEY = "operon_quote_abandon_v1";
  const LAST_COMPLETED_STEP_KEY = "last_step_completed";
  const LAST_COMPLETED_STEP_NAME_KEY = "last_step_name";

  // Optimisation signals:
  // Step 1 drop-off -> form too long
  // Step 2 drop-off -> confusing property inputs
  // Step 3 drop-off -> product unclear
  // Step 4 drop-off -> measurement confusing
  // Step 5 drop-off -> too many extras
  // Step 6 drop-off -> price shock

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
    return Object.assign({
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
  }

  function writeTrackingState(state) {
    localStorage.setItem(TRACKING_KEY, JSON.stringify(state));
  }

  function readFunnelState() {
    const parsed = safeParse(localStorage.getItem(FUNNEL_KEY), null);
    return Object.assign({
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
      abandoned_at_step: 0,
      raw_payload: {}
    }, parsed || {});
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

    const url = new URL(config.url.replace(/\/$/, "") + "/rest/v1/" + tableName);
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
    const details = metadata || {};
    const normalisedStep = Number(details.step) || Number(details.stepNumber) || null;
    const normalisedStepName = details.step_name || details.stepName || null;
    const trackingState = readTrackingState();
    const event = {
      id: createUuid(),
      created_at: new Date().toISOString(),
      session_id: sessionId,
      quote_id: details.quoteId || null,
      event_name: eventName,
      step_number: normalisedStep,
      step_name: normalisedStepName,
      page_url: window.location.pathname + window.location.hash,
      device_type: getDeviceType(),
      metadata: details
    };

    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, details);
      }
    } catch (error) {
      // GA4 is optional and should never block UX.
    }

    appendEvent(trackingState, event);
    writeTrackingState(trackingState);
    void sendToSupabase("quote_events", event);
    console.log("TRACK:", eventName, details);
    return { trackingState: trackingState, event: event };
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
    return updateFunnelState({
      started_quote: true,
      last_step_completed: stepNumber,
      current_step_name: stepName
    });
  }

  function trackQuoteSubmit(quoteId, quoteValue, quoteType, realArea) {
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
    trackEvent("quote_submit", {
      quoteId: quoteId,
      estimated_value: amount,
      area: Number(realArea) || 0,
      type: quoteType || ""
    });
    return updateFunnelState({
      completed_quote: true,
      quote_id: quoteId || null,
      estimated_quote_value: amount,
      abandoned_at_step: 0
    });
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
    trackEvent("floorplan_uploaded", {
      file_name: fileName || ""
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
  }

  function trackFloorplanAreaUsed(area) {
    const trackingState = readTrackingState();
    trackingState.floorplanAreaUses += 1;
    writeTrackingState(trackingState);
    const payload = {
      area: Number(area) || 0
    };
    trackEvent("floorplan_area_used", payload);
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

  window.OperonTracking = {
    getOrCreateSessionId: getOrCreateSessionId,
    trackEvent: trackEvent,
    trackQuoteStart: trackQuoteStart,
    trackQuoteStepViewed: trackQuoteStepViewed,
    trackQuoteStepCompleted: trackQuoteStepCompleted,
    trackQuoteSubmit: trackQuoteSubmit,
    trackQuoteAbandon: trackQuoteAbandon,
    trackFloorplanOpened: trackFloorplanOpened,
    trackFloorplanUploaded: trackFloorplanUploaded,
    trackFloorplanScaleSet: trackFloorplanScaleSet,
    trackFloorplanRoomAdded: trackFloorplanRoomAdded,
    trackFloorplanAreaUsed: trackFloorplanAreaUsed,
    getState: getTrackingState,
    getFunnelState: getFunnelState
  };

  flushPendingAbandonment();
}());
