(function () {
  const UI = window.OperonChatbotUI;
  const LOGIC = window.OperonChatbotLogic;

  function createController(options) {
    const settings = Object.assign({
      pageKey: "default",
      title: "Operon Assistant",
      subtitle: "Product and quote guidance",
      welcomeText: "",
      initialRouteLabel: "Start quote",
      initialRouteHref: "/quote.html",
      enableIdleSuggestions: false,
      openOnInit: false
    }, options || {});

    if (!UI || !LOGIC) {
      throw new Error("Operon chatbot modules are not available.");
    }

    let ui = null;
    let logic = null;
    let snapshot = null;
    let triggerCleanup = null;
    let ephemeralSessionId = "";
    const OPERATOR_REQUEST_ENDPOINT = "/.netlify/functions/operator-chat-request";
    const CHATBOT_LEAD_EVENT_ENDPOINT = "/.netlify/functions/save-chatbot-lead-event";

    function getIntentForAction(actionId) {
      const map = {
        ready_for_quote: "start_quote",
        review_existing_quote: "existing_quote_review",
        quick_completeness_check: "existing_quote_review",
        start_product_guide: "product_help",
        browse_products: "product_help",
        route_floorplan: "floorplan_help",
        contact_operon: "contact_human",
        request_operator: "contact_human",
        what_affects_price: "price_question",
        collect_project_details: "stairs_removal_scope",
        quote_review_file_yes: "existing_quote_review",
        quote_review_file_screenshot: "existing_quote_review",
        quote_review_file_no: "existing_quote_review",
        quote_review_file_not_sure: "existing_quote_review",
        quote_review_check_yes: "existing_quote_review",
        quote_review_check_no: "existing_quote_review",
        quote_review_check_not_sure: "existing_quote_review",
        quote_review_check_skip: "existing_quote_review",
        quote_review_route_review: "existing_quote_review"
      };
      return map[actionId] || "";
    }

    function handleUpdate(nextSnapshot) {
      snapshot = nextSnapshot;
      if (ui) {
        ui.render(snapshot);
      }
    }

    function toText(value, maxLength) {
      return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength || 160);
    }

    function getChatbotSessionId() {
      if (/^chat_[a-z0-9_-]{12,80}$/i.test(ephemeralSessionId)) {
        return ephemeralSessionId;
      }

      const randomPart = window.crypto && typeof window.crypto.getRandomValues === "function"
        ? Array.from(window.crypto.getRandomValues(new Uint32Array(2))).map(function (value) {
          return value.toString(36);
        }).join("")
        : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

      ephemeralSessionId = "chat_" + Date.now().toString(36) + "_" + randomPart.slice(0, 24);
      return ephemeralSessionId;
    }

    function getDeviceType() {
      try {
        if (window.matchMedia && window.matchMedia("(max-width: 640px)").matches) return "mobile";
        if (window.matchMedia && window.matchMedia("(max-width: 1024px)").matches) return "tablet";
      } catch (error) {
        return "unknown";
      }
      return "desktop";
    }

    function getRoutePath(href) {
      try {
        const url = new URL(href || "", window.location.href);
        return url.pathname + url.search + url.hash;
      } catch (error) {
        return toText(href, 300);
      }
    }

    function getIntentForRoute(route) {
      try {
        const path = new URL(route && route.href || "", window.location.href).pathname;
        if (path === "/quote.html") return "start_quote";
        if (path === "/quote-review.html") return "existing_quote_review";
        if (path === "/products.html") return "product_help";
        if (path === "/floorplan.html") return "floorplan_help";
        if (path === "/contact.html") return "contact_human";
      } catch (error) {
        return "general_question";
      }
      return "general_question";
    }

    function uniqueList(values, maxItems) {
      const seen = {};
      return (Array.isArray(values) ? values : [])
        .map(function (value) {
          return toText(value, 120);
        })
        .filter(function (value) {
          if (!value || seen[value]) return false;
          seen[value] = true;
          return true;
        })
        .slice(0, maxItems || 12);
    }

    function getSafeChecklistMissingItems() {
      const guide = snapshot && snapshot.quoteReviewGuide ? snapshot.quoteReviewGuide : null;
      const answers = guide && guide.answers ? guide.answers : {};
      const labels = {
        product_shown: "product details unclear",
        area_shown: "area unclear",
        installation_included: "installation inclusion unclear",
        removal_disposal_included: "removal/disposal unclear",
        trims_stairs_listed: "trims/stairs unclear",
        exclusions_listed: "exclusions unclear"
      };
      return Object.keys(labels).filter(function (key) {
        return answers[key] === "no" || answers[key] === "not_sure" || answers[key] === "skipped";
      }).map(function (key) {
        return labels[key];
      });
    }

    function buildSafeHandoffPayload(route, options) {
      const structured = snapshot && snapshot.structuredOutput ? snapshot.structuredOutput : {};
      const prequal = options && options.summaryOverride ? options.summaryOverride : getSafePrequalificationSummary();
      const intent = toText(options && options.intent || (structured && structured.intent) || getIntentForRoute(route), 80);
      const missingInfo = uniqueList([]
        .concat(structured && structured.missing_items ? structured.missing_items : [])
        .concat(structured && structured.missing_items_to_check ? structured.missing_items_to_check : [])
        .concat(structured && structured.validation_flags ? structured.validation_flags : [])
        .concat(getSafeChecklistMissingItems()), 14);
      const productCategory = prequal && prequal.product_category
        ? prequal.product_category
        : toText(structured && (structured.category || structured.recommended_category), 80);
      const areaStatus = prequal && prequal.area_status
        ? prequal.area_status
        : (structured && Number.isFinite(Number(structured.area_m2)) ? "known" : "not_sure");

      return {
        event_type: toText(options && options.eventType || "chatbot_handoff", 120),
        chatbot_session_id: getChatbotSessionId(),
        intent: intent || getIntentForRoute(route),
        handoff_url: getRoutePath(route && route.href),
        page_key: settings.pageKey,
        source_page: window.location ? window.location.pathname : "",
        source_url: window.location ? window.location.href : "",
        device_type: getDeviceType(),
        timestamp: new Date().toISOString(),
        product_category: productCategory || "not_sure",
        suburb: prequal && prequal.suburb ? prequal.suburb : "",
        property_type: prequal && prequal.property_type ? prequal.property_type : "not_sure",
        area_status: areaStatus,
        approx_area_m2: prequal && typeof prequal.approx_area_m2 === "number" ? prequal.approx_area_m2 : null,
        stairs_status: prequal && prequal.stairs_status ? prequal.stairs_status : "not_sure",
        removal_status: prequal && prequal.removal_status ? prequal.removal_status : "not_sure",
        existing_quote_status: prequal && prequal.existing_quote_status ? prequal.existing_quote_status : "not_sure",
        floorplan_status: prequal && prequal.floorplan_status ? prequal.floorplan_status : "not_sure",
        urgency: prequal && prequal.urgency ? prequal.urgency : "not_sure",
        missing_info: prequal && Array.isArray(prequal.missing_info) ? prequal.missing_info : missingInfo,
        confidence: prequal && prequal.confidence ? prequal.confidence : "unknown",
        next_action: toText(options && options.nextAction || route && route.label || "Continue from chatbot", 140)
      };
    }

    function init() {
      if (ui || logic) {
        return api;
      }

      logic = LOGIC.createChatbotLogic({
        onUpdate: handleUpdate,
        pageKey: settings.pageKey,
        welcomeText: settings.welcomeText,
        initialRouteLabel: settings.initialRouteLabel,
        initialRouteHref: settings.initialRouteHref,
        enableIdleSuggestions: settings.enableIdleSuggestions
      });

      ui = UI.createChatbotUI({
        title: settings.title,
        subtitle: settings.subtitle,
        onAction: function (actionId) {
          if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
            window.OperonTracking.trackEvent("chatbot_interaction", {
              page_key: settings.pageKey,
              interaction_type: "action",
              action_id: actionId
            });
            const selectedIntent = getIntentForAction(actionId);
            if (selectedIntent) {
              window.OperonTracking.trackEvent("chatbot_intent_selected", {
                page_key: settings.pageKey,
                intent: selectedIntent
              });
            }
          }
          logic.applyAction(actionId);
        },
        onTextSubmit: function (value) {
          if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
            window.OperonTracking.trackEvent("chatbot_interaction", {
              page_key: settings.pageKey,
              interaction_type: "text",
              message_length: String(value || "").length
            });
          }
          logic.applyTextInput(value);
        },
        onOperatorSubmit: function (customer) {
          return submitOperatorRequest(customer);
        },
        onRouteClick: function (route) {
          if (!recordPrequalificationHandoff(route)) {
            recordChatbotHandoff(route, {
              eventType: "chatbot_handoff",
              intent: getIntentForRoute(route),
              nextAction: route && route.label || "Continue from chatbot"
            });
          }
        }
      });

      logic.begin();

      if (settings.openOnInit) {
        ui.open();
      }

      installTriggerEngine();

      return api;
    }

    function getOperatorTranscript() {
      const current = snapshot && Array.isArray(snapshot.transcript) ? snapshot.transcript : [];
      return current.slice(-12).map(function (message) {
        return {
          role: message.role === "user" ? "user" : "assistant",
          text: String(message.text || "").slice(0, 1200)
        };
      });
    }

    function getSafePrequalificationSummary() {
      const prequalification = snapshot && snapshot.prequalification ? snapshot.prequalification : null;
      const summary = prequalification && prequalification.summary ? prequalification.summary : null;
      if (!summary || snapshot.stage !== "prequal_complete") {
        return null;
      }
      return {
        source_page: String(summary.source_page || settings.pageKey || "").slice(0, 80),
        source_url: String(summary.source_url || (window.location ? window.location.href : "") || "").slice(0, 300),
        intent: "start_quote",
        suburb: String(summary.suburb || "").slice(0, 80),
        property_type: String(summary.property_type || "not_sure").slice(0, 80),
        product_category: String(summary.product_category || "not_sure").slice(0, 80),
        area_status: String(summary.area_status || "not_sure").slice(0, 80),
        approx_area_m2: typeof summary.approx_area_m2 === "number" ? summary.approx_area_m2 : undefined,
        stairs_status: String(summary.stairs_status || "not_sure").slice(0, 80),
        removal_status: String(summary.removal_status || "not_sure").slice(0, 80),
        existing_quote_status: String(summary.existing_quote_status || "not_sure").slice(0, 80),
        floorplan_status: String(summary.floorplan_status || "not_sure").slice(0, 80),
        urgency: String(summary.urgency || "not_sure").slice(0, 80),
        next_action: String(summary.next_action || "go_to_quote").slice(0, 80),
        handoff_url: String(summary.handoff_url || "").slice(0, 300),
        missing_info: Array.isArray(summary.missing_info) ? summary.missing_info.map(function (item) { return toText(item, 80); }).filter(Boolean).slice(0, 12) : [],
        confidence: String(summary.confidence || "low").slice(0, 20)
      };
    }

    function recordChatbotHandoff(route, options) {
      if (typeof window.fetch !== "function" || window.location.protocol === "file:") {
        return;
      }

      window.fetch(CHATBOT_LEAD_EVENT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        keepalive: true,
        body: JSON.stringify(buildSafeHandoffPayload(route, options || {}))
      }).catch(function () {
        // Non-blocking: the customer handoff must continue even if lead tracking is unavailable.
      });
    }

    function recordPrequalificationHandoff(route) {
      const summary = getSafePrequalificationSummary();
      if (!summary) {
        return false;
      }

      if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
        window.OperonTracking.trackEvent("chatbot_prequal_completed", {
          intent: summary.intent,
          product_category: summary.product_category,
          area_status: summary.area_status,
          stairs_status: summary.stairs_status,
          removal_status: summary.removal_status,
          existing_quote_status: summary.existing_quote_status,
          floorplan_status: summary.floorplan_status,
          next_action: summary.next_action,
          confidence: summary.confidence
        });
      }

      recordChatbotHandoff(route, {
        eventType: "chatbot_quote_prequalification_completed",
        intent: "start_quote",
        nextAction: "Customer sent to quote form",
        summaryOverride: summary
      });

      return true;
    }

    function submitOperatorRequest(customer) {
      if (typeof window.fetch !== "function" || window.location.protocol === "file:") {
        return Promise.reject(new Error("Operator request is unavailable in local preview mode."));
      }

      const payload = {
        customer: {
          name: customer.name || "",
          phone: customer.phone || "",
          email: customer.email || ""
        },
        message: customer.message || "Operator follow-up requested from chatbot.",
        pageKey: settings.pageKey,
        pageUrl: window.location.href,
        transcript: getOperatorTranscript(),
        structuredOutput: snapshot && snapshot.structuredOutput ? snapshot.structuredOutput : null,
        routeSuggestion: snapshot && snapshot.routeSuggestion ? snapshot.routeSuggestion : null
      };

      if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
        window.OperonTracking.trackEvent("chatbot_operator_request_attempt", {
          page_key: settings.pageKey,
          has_phone: !!payload.customer.phone,
          has_email: !!payload.customer.email
        });
      }

      const challengePromise = typeof window.operonGetTurnstileToken === "function"
        ? window.operonGetTurnstileToken("operator_request")
        : Promise.resolve("");

      return challengePromise.then(function (turnstileToken) {
        payload.turnstileToken = turnstileToken || "";
        return window.fetch(OPERATOR_REQUEST_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }).then(function (response) {
        return response.json().catch(function () {
          return null;
        }).then(function (result) {
          if (!response.ok || !result || !result.ok) {
            throw new Error(result && result.error ? result.error : "Could not send the operator request.");
          }

          if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
            window.OperonTracking.trackEvent("chatbot_operator_request_success", {
              page_key: settings.pageKey,
              customer_email_sent: !!result.customerEmailSent
            });
          }

          return result;
        });
      }).catch(function (error) {
        if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
          window.OperonTracking.trackEvent("chatbot_operator_request_failed", {
            page_key: settings.pageKey
          });
        }
        throw error;
      });
    }

    function runTrigger(triggerId) {
      if (logic && typeof logic.applyTrigger === "function") {
        logic.applyTrigger(triggerId);
        if (window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
          window.OperonTracking.trackEvent("chatbot_interaction", {
            page_key: settings.pageKey,
            interaction_type: "trigger",
            trigger_id: triggerId
          });
          if (triggerId === "review_quote_visible" || triggerId === "quote_idle") {
            window.OperonTracking.trackEvent("chatbot_hesitation_detected", {
              page_key: settings.pageKey,
              trigger_id: triggerId
            });
          }
        }
        if (triggerId === "post_submit_engagement" && window.OperonTracking && typeof window.OperonTracking.trackEvent === "function") {
          window.OperonTracking.trackEvent("chatbot_post_submit_engagement", {
            page_key: settings.pageKey
          });
        }
      }
    }

    function installTriggerEngine() {
      if (!settings.enableIdleSuggestions || triggerCleanup) {
        return;
      }

      const timers = [];
      const listeners = [];
      let scrollPending = false;

      function addTimer(callback, delay) {
        const timer = window.setTimeout(callback, delay);
        timers.push(timer);
      }

      function addListener(target, eventName, handler, options) {
        target.addEventListener(eventName, handler, options || false);
        listeners.push({ target: target, eventName: eventName, handler: handler, options: options || false });
      }

      function readSnapshot() {
        return logic && typeof logic.getSnapshot === "function" ? logic.getSnapshot() : null;
      }

      function handleScrollSignals() {
        if (scrollPending) {
          return;
        }

        scrollPending = true;
        window.setTimeout(function () {
          scrollPending = false;
          const current = readSnapshot();
          const siteState = current && current.siteState ? current.siteState : null;

          if (!siteState) {
            return;
          }

          if (settings.pageKey === "products" && siteState.scrollDepth >= 0.28) {
            runTrigger("product_scroll_depth");
          }

          if (settings.pageKey === "index" && siteState.reviewQuoteVisible) {
            runTrigger("review_quote_visible");
          }

          if (settings.pageKey === "quote" && siteState.isNearCompletion) {
            runTrigger("near_submit");
          }
        }, 140);
      }

      if (settings.pageKey === "index") {
        addTimer(function () {
          runTrigger("homepage_idle");
        }, 6500);
        addListener(window, "scroll", handleScrollSignals, { passive: true });
      } else if (settings.pageKey === "products") {
        addListener(window, "scroll", handleScrollSignals, { passive: true });
      } else if (settings.pageKey === "quote") {
        addTimer(function () {
          runTrigger("quote_idle");
        }, 7000);
        addListener(window, "scroll", handleScrollSignals, { passive: true });
        addListener(document, "change", handleScrollSignals, true);
        addListener(document, "click", handleScrollSignals, true);
      } else if (settings.pageKey === "quote-review") {
        addTimer(function () {
          runTrigger("review_page_idle");
        }, 7000);
      } else if (settings.pageKey === "thank-you") {
        addTimer(function () {
          runTrigger("post_submit_engagement");
        }, 1800);
      }

      triggerCleanup = function () {
        timers.forEach(function (timer) {
          window.clearTimeout(timer);
        });
        listeners.forEach(function (entry) {
          entry.target.removeEventListener(entry.eventName, entry.handler, entry.options);
        });
        triggerCleanup = null;
      };
    }

    function destroy() {
      if (ui) {
        ui.destroy();
        ui = null;
      }
      if (triggerCleanup) {
        triggerCleanup();
      }
      logic = null;
      snapshot = null;
    }

    const api = {
      init: init,
      destroy: destroy,
      open: function () {
        if (ui) {
          ui.open();
        }
      },
      close: function () {
        if (ui) {
          ui.close();
        }
      },
      getSnapshot: function () {
        return snapshot ? JSON.parse(JSON.stringify(snapshot)) : null;
      },
      getStructuredOutput: function () {
        return snapshot && snapshot.structuredOutput
          ? JSON.parse(JSON.stringify(snapshot.structuredOutput))
          : null;
      },
      getRouteSuggestion: function () {
        return snapshot && snapshot.routeSuggestion
          ? JSON.parse(JSON.stringify(snapshot.routeSuggestion))
          : null;
      },
      getQuoteFieldDraft: function () {
        return snapshot && snapshot.quoteFieldDraft
          ? JSON.parse(JSON.stringify(snapshot.quoteFieldDraft))
          : null;
      },
      getLocalStorageDraft: function () {
        return snapshot && snapshot.localStorageDraft
          ? JSON.parse(JSON.stringify(snapshot.localStorageDraft))
          : null;
      },
      getHandoffReadiness: function () {
        return snapshot && snapshot.handoffReadiness
          ? JSON.parse(JSON.stringify(snapshot.handoffReadiness))
          : null;
      }
    };

    return api;
  }

  function maybeAutoInit() {
    if (!document || !document.body) {
      return;
    }

    if (!window.OperonChatbotConfig || !window.OperonChatbotConfig.autoInit) {
      return;
    }

    window.OperonChatbot = createController(window.OperonChatbotConfig);
    window.OperonChatbot.init();
  }

  window.OperonChatbotModule = {
    createController: createController
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", maybeAutoInit, { once: true });
  } else {
    maybeAutoInit();
  }
}());
