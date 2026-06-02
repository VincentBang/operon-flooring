(function () {
  const SCRIPT_ID = "operon-turnstile-script";
  const CONTAINER_ID = "operon-turnstile-container";
  let scriptPromise = null;
  let widgetId = null;

  function getSiteKey() {
    const config = window.OPERON_SECURITY_CONFIG || {};
    return String(config.turnstileSiteKey || "").trim();
  }

  function loadTurnstileScript() {
    if (window.turnstile && typeof window.turnstile.render === "function") {
      return Promise.resolve();
    }
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise(function (resolve, reject) {
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) {
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", function () { reject(new Error("Bot check could not load.")); }, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", function () { resolve(); }, { once: true });
      script.addEventListener("error", function () { reject(new Error("Bot check could not load.")); }, { once: true });
      document.head.appendChild(script);
    });
    return scriptPromise;
  }

  function getContainer() {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
      container = document.createElement("div");
      container.id = CONTAINER_ID;
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.setAttribute("aria-hidden", "true");
      document.body.appendChild(container);
    }
    return container;
  }

  function getTurnstileToken(action) {
    const siteKey = getSiteKey();
    if (!siteKey) return Promise.resolve("");

    return loadTurnstileScript().then(function () {
      return new Promise(function (resolve, reject) {
        const timeout = window.setTimeout(function () {
          reject(new Error("Bot check timed out."));
        }, 12000);

        function finish(token) {
          window.clearTimeout(timeout);
          resolve(String(token || ""));
        }

        function fail() {
          window.clearTimeout(timeout);
          reject(new Error("Bot check failed."));
        }

        const options = {
          sitekey: siteKey,
          size: "invisible",
          action: String(action || "submit").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32),
          callback: finish,
          "error-callback": fail,
          "timeout-callback": fail
        };

        if (widgetId === null) {
          widgetId = window.turnstile.render(getContainer(), options);
        } else {
          window.turnstile.reset(widgetId);
        }
        window.turnstile.execute(widgetId);
      });
    });
  }

  window.operonGetTurnstileToken = getTurnstileToken;
}());
