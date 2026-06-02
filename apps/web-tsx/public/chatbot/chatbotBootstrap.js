(function () {
  const FALLBACK_SCRIPT_PATH = "chatbot/";
  const DEFAULT_SCRIPT_PATH = getCurrentScriptPath();
  const MODULE_FILES = [
    "../security-config.js",
    "../security.js",
    "chatbotPrompts.js",
    "chatbotPolicy.js",
    "chatbotKnowledgeIndex.js",
    "chatbotKnowledge.js",
    "chatbotScenarios.js",
    "chatbotSiteState.js",
    "chatbotStateMapper.js",
    "chatbotLogic.js",
    "chatbotUI.js",
    "chatbot.js"
  ];
  const PAGE_PRESETS = {
    index: {
      pageKey: "index",
      title: "Operon Assistant",
      subtitle: "Flooring and quote help",
      welcomeText: "Get clear guidance on flooring type, quote scope, and the details worth preparing before review.",
      initialRouteLabel: "Start quote",
      initialRouteHref: "quote.html"
    },
    products: {
      pageKey: "products",
      title: "Product Guide",
      subtitle: "Choose with confidence",
      welcomeText: "Compare laminate, hybrid, and engineered timber with clear guidance on the next suitable step.",
      initialRouteLabel: "Browse products",
      initialRouteHref: "products.html"
    },
    quote: {
      pageKey: "quote",
      title: "Quote Helper",
      subtitle: "Check details",
      welcomeText: "Review the estimate scope, identify missing details, and keep uncertain items clear before submission.",
      initialRouteLabel: "Continue quote",
      initialRouteHref: "quote.html"
    },
    "quote-review": {
      pageKey: "quote-review",
      title: "Quote Review Helper",
      subtitle: "Check inclusions",
      welcomeText: "Check product, area, inclusions, missing scope items, and the questions worth clarifying.",
      initialRouteLabel: "Get structured estimate",
      initialRouteHref: "quote.html?source=quote_review"
    },
    "thank-you": {
      pageKey: "thank-you",
      title: "Next Step Helper",
      subtitle: "After-submit support",
      welcomeText: "Thanks - we've received your estimate. If you want, we can confirm a few details now.",
      initialRouteLabel: "Confirm details",
      initialRouteHref: "thank-you.html#leadStageSection"
    },
    default: {
      pageKey: "default",
      title: "Operon Assistant",
      subtitle: "Product and quote guidance",
      welcomeText: "Get clear guidance on flooring type, quote scope, and the details worth preparing before review.",
      initialRouteLabel: "Start quote",
      initialRouteHref: "quote.html"
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getPathname(locationLike) {
    const source = locationLike || window.location || {};
    return String(source.pathname || "").toLowerCase();
  }

  function getPageKey(locationLike) {
    const pathname = getPathname(locationLike);
    const fileName = pathname.split("/").filter(Boolean).pop() || "index.html";

    if ((fileName === "index.html" || fileName === "") && pathname.indexOf("/blog/") === -1) {
      return "index";
    }
    if (fileName === "products.html") {
      return "products";
    }
    if (fileName === "quote.html") {
      return "quote";
    }
    if (fileName === "quote-review.html") {
      return "quote-review";
    }
    if (fileName === "thank-you.html") {
      return "thank-you";
    }

    return "default";
  }

  function getPagePreset(pageKey) {
    return PAGE_PRESETS[pageKey] || PAGE_PRESETS.default;
  }

  function getCurrentScriptPath() {
    const script = document.currentScript;
    const source = script && script.getAttribute ? script.getAttribute("src") : "";
    if (!source) {
      return FALLBACK_SCRIPT_PATH;
    }

    return source.replace(/[^/]*$/, "");
  }

  function getConfig(overrides) {
    const globalConfig = window.OperonChatbotBootstrapConfig || {};
    const requestedPageKey = (overrides && overrides.pageKey) || globalConfig.pageKey || getPageKey();
    const preset = getPagePreset(requestedPageKey);

    return Object.assign({
      basePath: DEFAULT_SCRIPT_PATH,
      title: "Operon Assistant",
      subtitle: "Product and quote guidance",
      welcomeText: PAGE_PRESETS.default.welcomeText,
      initialRouteLabel: PAGE_PRESETS.default.initialRouteLabel,
      initialRouteHref: PAGE_PRESETS.default.initialRouteHref,
      openOnInit: false,
      enableIdleSuggestions: true,
      pageKey: requestedPageKey
    }, preset, globalConfig, overrides || {});
  }

  function ensureTrailingSlash(value) {
    if (!value) {
      return FALLBACK_SCRIPT_PATH;
    }

    return /\/$/.test(value) ? value : value + "/";
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector('script[data-operon-chatbot-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute("data-operon-chatbot-loaded") === "true") {
          resolve();
          return;
        }

        existing.addEventListener("load", function handleLoad() {
          resolve();
        }, { once: true });
        existing.addEventListener("error", function handleError() {
          reject(new Error("Failed to load " + src));
        }, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.defer = true;
      script.setAttribute("data-operon-chatbot-src", src);
      script.addEventListener("load", function () {
        script.setAttribute("data-operon-chatbot-loaded", "true");
        resolve();
      }, { once: true });
      script.addEventListener("error", function () {
        reject(new Error("Failed to load " + src));
      }, { once: true });
      document.head.appendChild(script);
    });
  }

  function loadModuleFiles(config) {
    const basePath = ensureTrailingSlash(config.basePath);

    return MODULE_FILES.reduce(function (promise, fileName) {
      return promise.then(function () {
        return loadScript(basePath + fileName);
      });
    }, Promise.resolve());
  }

  function mount(overrides) {
    const config = getConfig(overrides);

    return loadModuleFiles(config).then(function () {
      if (!window.OperonChatbotModule || typeof window.OperonChatbotModule.createController !== "function") {
        throw new Error("Operon chatbot module is unavailable after bootstrap load.");
      }

      const safeConfig = {
        pageKey: config.pageKey,
        title: config.title,
        subtitle: config.subtitle,
        welcomeText: config.welcomeText,
        initialRouteLabel: config.initialRouteLabel,
        initialRouteHref: config.initialRouteHref,
        enableIdleSuggestions: !!config.enableIdleSuggestions,
        openOnInit: !!config.openOnInit
      };

      if (window.OperonChatbot && typeof window.OperonChatbot.destroy === "function") {
        window.OperonChatbot.destroy();
      }

      window.OperonChatbot = window.OperonChatbotModule.createController(safeConfig);
      window.OperonChatbot.init();

      return {
        mounted: true,
        config: clone(safeConfig)
      };
    });
  }

  window.OperonChatbotBootstrap = {
    mount: mount,
    getConfig: getConfig,
    getPageKey: getPageKey,
    getPagePreset: getPagePreset
  };
}());
