"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __operonQuoteRuntimeLoaded?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    OperonChatbotBootstrap?: {
      mount?: (options: { pageKey: string; openOnInit: boolean }) => void;
    };
  }
}

function loadScript(src: string, optional = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-operon-runtime-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.operonRuntimeSrc = src;
    script.onload = () => resolve();
    script.onerror = () => {
      if (optional) {
        resolve();
        return;
      }
      reject(new Error(`Unable to load ${src}`));
    };
    document.body.appendChild(script);
  });
}

export function QuoteRuntime() {
  useEffect(() => {
    if (window.__operonQuoteRuntimeLoaded) {
      return;
    }
    window.__operonQuoteRuntimeLoaded = true;

    document.body.id = "top";
    document.body.classList.add("has-mobile-sticky-cta");

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-T2LEXZJM3Q");

    loadScript("https://www.googletagmanager.com/gtag/js?id=G-T2LEXZJM3Q", true)
      .then(() => loadScript("/siteConfig.js"))
      .then(() => loadScript("/tracking.js"))
      .then(() => loadScript("/security-config.js"))
      .then(() => loadScript("/security.js"))
      .then(() => loadScript("/pricingSourceConfig.js"))
      .then(() => loadScript("/pricingSource.js"))
      .then(() => loadScript("/preference-floors-import.js"))
      .then(() => loadScript("/products.js"))
      .then(() => loadScript("/productSelection.js"))
      .then(() => loadScript("/underlay.js"))
      .then(() => loadScript("/skirtingScotia.js"))
      .then(() => loadScript("/quoteConfidence.js"))
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", true))
      .then(() => loadScript("/quoteRuntime.js"))
      .then(() => loadScript("/mobile-nav.js"))
      .then(() => loadScript("/chatbot/chatbotBootstrap.js"))
      .then(() => {
        window.OperonChatbotBootstrap?.mount?.({
          pageKey: "quote",
          openOnInit: false
        });
      })
      .catch((error) => {
        console.error("Quote runtime failed to load.", error);
      });
  }, []);

  return null;
}
