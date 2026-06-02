"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __operonFloorplanRuntimeLoaded?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
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

export function FloorplanRuntime() {
  useEffect(() => {
    if (window.__operonFloorplanRuntimeLoaded) {
      return;
    }
    window.__operonFloorplanRuntimeLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-T2LEXZJM3Q");

    loadScript("https://www.googletagmanager.com/gtag/js?id=G-T2LEXZJM3Q", true)
      .then(() => loadScript("/floorplanQuickRoom.js"))
      .then(() => loadScript("/siteConfig.js"))
      .then(() => loadScript("/tracking.js"))
      .then(() => loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.min.js", true))
      .then(() => loadScript("/floorplanRuntime.js"))
      .then(() => loadScript("/mobile-nav.js"))
      .catch((error) => {
        console.error("Floorplan runtime failed to load.", error);
      });
  }, []);

  return null;
}
