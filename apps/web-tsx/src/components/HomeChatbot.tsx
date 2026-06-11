"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    OperonChatbotBootstrap?: {
      mount?: (options: { pageKey: string; openOnInit: boolean }) => void;
    };
  }
}

type HomeChatbotProps = {
  pageKey?: string;
};

function loadChatbotBootstrap() {
  return new Promise<void>((resolve, reject) => {
    if (window.OperonChatbotBootstrap) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-operon-chatbot-bootstrap="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load chatbot bootstrap.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "/chatbot/chatbotBootstrap.js";
    script.defer = true;
    script.dataset.operonChatbotBootstrap = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load chatbot bootstrap.")), { once: true });
    document.head.appendChild(script);
  });
}

export function HomeChatbot({ pageKey = "index" }: HomeChatbotProps) {
  useEffect(() => {
    let cancelled = false;
    let addedStickyOffsetClass = false;

    if (document.querySelector(".mobile-sticky-cta") && !document.body.classList.contains("has-mobile-sticky-cta")) {
      document.body.classList.add("has-mobile-sticky-cta");
      addedStickyOffsetClass = true;
    }

    loadChatbotBootstrap()
      .then(() => {
        if (cancelled || !window.OperonChatbotBootstrap?.mount) {
          return;
        }
        window.OperonChatbotBootstrap.mount({ pageKey, openOnInit: false });
      })
      .catch(() => {
        // Chatbot parity should never block the core quote path.
      });

    return () => {
      cancelled = true;
      if (addedStickyOffsetClass) {
        document.body.classList.remove("has-mobile-sticky-cta");
      }
    };
  }, [pageKey]);

  return null;
}
