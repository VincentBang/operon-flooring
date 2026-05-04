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
      initialRouteHref: "quote.html",
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

    function handleUpdate(nextSnapshot) {
      snapshot = nextSnapshot;
      if (ui) {
        ui.render(snapshot);
      }
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
        }
      });

      logic.begin();

      if (settings.openOnInit) {
        ui.open();
      }

      installTriggerEngine();

      return api;
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
