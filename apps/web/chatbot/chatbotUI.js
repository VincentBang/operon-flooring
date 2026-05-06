(function () {
  const ROOT_ID = "operon-chatbot-root";
  const STYLE_ID = "operon-chatbot-style";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ":root {",
      "  --operon-chatbot-bg: #ffffff;",
      "  --operon-chatbot-text: #111820;",
      "  --operon-chatbot-muted: #6b7280;",
      "  --operon-chatbot-line: rgba(17, 24, 32, 0.1);",
      "  --operon-chatbot-accent: #111820;",
      "  --operon-chatbot-accent-soft: #f4efe7;",
      "  --operon-chatbot-surface: #fbfaf8;",
      "  --operon-chatbot-shadow: 0 18px 46px rgba(17, 24, 32, 0.16);",
      "  --operon-chatbot-focus: #a67c52;",
      "  --operon-chatbot-success: #456b5c;",
      "  --operon-chatbot-danger: #b33a2f;",
      "}",
      "#" + ROOT_ID + " {",
      "  position: fixed;",
      "  right: 16px;",
      "  bottom: calc(16px + env(safe-area-inset-bottom, 0px));",
      "  z-index: 30;",
      "  width: min(420px, calc(100vw - 24px));",
      "  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "  color: var(--operon-chatbot-text);",
      "  pointer-events: none;",
      "}",
      "#" + ROOT_ID + " *,",
      "#" + ROOT_ID + " *::before,",
      "#" + ROOT_ID + " *::after { box-sizing: border-box; }",
      ".operon-chatbot-shell { display: grid; justify-items: end; gap: 12px; }",
      ".operon-chatbot-panel, .operon-chatbot-toggle { pointer-events: auto; }",
      ".operon-chatbot-nudge {",
      "  display: none;",
      "  max-width: min(360px, calc(100vw - 32px));",
      "  padding: 10px 12px;",
      "  border: 1px solid var(--operon-chatbot-line);",
      "  border-radius: 12px;",
      "  background: rgba(255, 255, 255, 0.96);",
      "  color: var(--operon-chatbot-text);",
      "  box-shadow: 0 12px 26px rgba(17, 24, 32, 0.11);",
      "  font-size: 0.84rem;",
      "  line-height: 1.4;",
      "  text-align: left;",
      "  pointer-events: auto;",
      "}",
      ".operon-chatbot-nudge[data-visible='true'] { display: block; }",
      ".operon-chatbot-toggle {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  gap: 8px;",
      "  min-height: 48px;",
      "  border: 0;",
      "  padding: 0 16px;",
      "  border-radius: 999px;",
      "  background: var(--operon-chatbot-accent);",
      "  color: #ffffff;",
      "  font-weight: 700;",
      "  font-size: 0.92rem;",
      "  box-shadow: var(--operon-chatbot-shadow);",
      "}",
      ".operon-chatbot-toggle:focus-visible,",
      ".operon-chatbot-close:focus-visible,",
      ".operon-chatbot-chip:focus-visible,",
      ".operon-chatbot-input:focus-visible,",
      ".operon-chatbot-send:focus-visible,",
      ".operon-chatbot-route-link:focus-visible {",
      "  outline: 2px solid var(--operon-chatbot-focus);",
      "  outline-offset: 2px;",
      "}",
      ".operon-chatbot-operator-link:focus-visible {",
      "  outline: 2px solid var(--operon-chatbot-focus);",
      "  outline-offset: 2px;",
      "}",
      ".operon-chatbot-toggle-badge {",
      "  width: 22px;",
      "  height: 22px;",
      "  border-radius: 999px;",
      "  background: rgba(255, 255, 255, 0.14);",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  font-size: 13px;",
      "}",
      ".operon-chatbot-panel {",
      "  width: 100%;",
      "  max-height: min(76vh, 680px);",
      "  display: none;",
      "  grid-template-rows: auto minmax(0, 1fr) auto auto auto;",
      "  background: var(--operon-chatbot-bg);",
      "  border: 1px solid var(--operon-chatbot-line);",
      "  border-radius: 16px;",
      "  box-shadow: var(--operon-chatbot-shadow);",
      "  overflow: hidden;",
      "}",
      ".operon-chatbot-panel[data-open='true'] { display: grid; }",
      ".operon-chatbot-head {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "  gap: 12px;",
      "  padding: 14px 14px 11px;",
      "  border-bottom: 1px solid var(--operon-chatbot-line);",
      "}",
      ".operon-chatbot-title strong { display: block; font-size: 0.94rem; line-height: 1.2; }",
      ".operon-chatbot-title span { display: block; margin-top: 3px; color: var(--operon-chatbot-muted); font-size: 0.78rem; line-height: 1.3; }",
      ".operon-chatbot-disclaimer { margin-top: 6px; color: var(--operon-chatbot-muted); font-size: 0.76rem; }",
      ".operon-chatbot-disclaimer:empty { display: none; }",
      ".operon-chatbot-close {",
      "  border: 0;",
      "  background: transparent;",
      "  color: var(--operon-chatbot-muted);",
      "  width: 30px;",
      "  height: 30px;",
      "  border-radius: 8px;",
      "  font-size: 0.9rem;",
      "}",
      ".operon-chatbot-messages {",
      "  padding: 12px;",
      "  overflow: auto;",
      "  display: grid;",
      "  gap: 8px;",
      "  background: var(--operon-chatbot-surface);",
      "  scrollbar-width: thin;",
      "}",
      ".operon-chatbot-message {",
      "  max-width: 90%;",
      "  padding: 10px 11px;",
      "  border-radius: 12px;",
      "  font-size: 0.86rem;",
      "  line-height: 1.44;",
      "  white-space: pre-wrap;",
      "}",
      ".operon-chatbot-message[data-role='assistant'] {",
      "  background: #ffffff;",
      "  border: 1px solid rgba(17, 24, 32, 0.08);",
      "  justify-self: start;",
      "}",
      ".operon-chatbot-message[data-role='user'] {",
      "  background: var(--operon-chatbot-accent-soft);",
      "  justify-self: end;",
      "}",
      ".operon-chatbot-actions {",
      "  display: flex;",
      "  flex-wrap: wrap;",
      "  gap: 6px;",
      "  margin-top: 9px;",
      "}",
      ".operon-chatbot-chip {",
      "  border: 1px solid rgba(17, 24, 32, 0.08);",
      "  background: #ffffff;",
      "  color: var(--operon-chatbot-text);",
      "  min-height: 32px;",
      "  border-radius: 8px;",
      "  padding: 7px 10px;",
      "  font-size: 0.78rem;",
      "  font-weight: 650;",
      "  text-align: left;",
      "}",
      ".operon-chatbot-summary {",
      "  padding: 10px 12px;",
      "  border-top: 1px solid var(--operon-chatbot-line);",
      "  background: #ffffff;",
      "}",
      ".operon-chatbot-summary[hidden] { display: none; }",
      ".operon-chatbot-summary strong { display: block; font-size: 0.82rem; }",
      ".operon-chatbot-summary span { display: block; margin-top: 4px; color: var(--operon-chatbot-muted); font-size: 0.8rem; }",
      ".operon-chatbot-validation { margin-top: 8px; color: var(--operon-chatbot-text); font-size: 0.78rem; }",
      ".operon-chatbot-validation[hidden], .operon-chatbot-summary span[hidden] { display: none; }",
      ".operon-chatbot-operator {",
      "  display: grid;",
      "  gap: 8px;",
      "  padding: 10px 12px;",
      "  border-top: 1px solid var(--operon-chatbot-line);",
      "  background: #ffffff;",
      "}",
      ".operon-chatbot-operator[hidden] { display: none; }",
      ".operon-chatbot-operator strong { font-size: 0.84rem; }",
      ".operon-chatbot-operator p { margin: 0; color: var(--operon-chatbot-muted); font-size: 0.8rem; line-height: 1.42; }",
      ".operon-chatbot-operator-form { display: grid; gap: 7px; }",
      ".operon-chatbot-operator-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }",
      ".operon-chatbot-operator-field { display: grid; gap: 4px; }",
      ".operon-chatbot-operator-field[data-wide='true'] { grid-column: 1 / -1; }",
      ".operon-chatbot-operator-field label { color: var(--operon-chatbot-text); font-size: 0.72rem; font-weight: 750; }",
      ".operon-chatbot-operator-field input,",
      ".operon-chatbot-operator-field textarea {",
      "  width: 100%;",
      "  min-height: 36px;",
      "  border: 1px solid rgba(17, 24, 32, 0.12);",
      "  border-radius: 9px;",
      "  padding: 8px 9px;",
      "  color: var(--operon-chatbot-text);",
      "  background: #ffffff;",
      "  font: inherit;",
      "  font-size: 0.82rem;",
      "}",
      ".operon-chatbot-operator-field textarea { min-height: 58px; resize: vertical; }",
      ".operon-chatbot-operator-status { margin: 0; color: var(--operon-chatbot-muted); font-size: 0.78rem; line-height: 1.35; }",
      ".operon-chatbot-operator-status[data-state='success'] { color: var(--operon-chatbot-success); font-weight: 750; }",
      ".operon-chatbot-operator-status[data-state='error'] { color: var(--operon-chatbot-danger); font-weight: 750; }",
      ".operon-chatbot-operator-button {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  width: 100%;",
      "  min-height: 38px;",
      "  padding: 0 12px;",
      "  border-radius: 10px;",
      "  background: var(--operon-chatbot-accent);",
      "  color: #ffffff;",
      "  text-decoration: none;",
      "  font-size: 0.82rem;",
      "  font-weight: 750;",
      "}",
      ".operon-chatbot-operator-button:disabled { opacity: 0.62; cursor: not-allowed; }",
      ".operon-chatbot-input-wrap {",
      "  display: grid;",
      "  grid-template-columns: minmax(0, 1fr) auto;",
      "  gap: 8px;",
      "  padding: 10px 12px;",
      "  border-top: 1px solid var(--operon-chatbot-line);",
      "  background: #ffffff;",
      "}",
      ".operon-chatbot-input {",
      "  width: 100%;",
      "  min-height: 40px;",
      "  border-radius: 10px;",
      "  border: 1px solid rgba(17, 24, 32, 0.12);",
      "  padding: 0 12px;",
      "  color: var(--operon-chatbot-text);",
      "  background: #ffffff;",
      "}",
      ".operon-chatbot-send {",
      "  min-height: 40px;",
      "  border: 0;",
      "  border-radius: 10px;",
      "  padding: 0 13px;",
      "  background: var(--operon-chatbot-accent);",
      "  color: #ffffff;",
      "  font-weight: 700;",
      "}",
      ".operon-chatbot-route {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "  gap: 10px;",
      "  padding: 10px 12px 12px;",
      "  border-top: 1px solid var(--operon-chatbot-line);",
      "  background: #ffffff;",
      "}",
      ".operon-chatbot-route[hidden] { display: none; }",
      ".operon-chatbot-route-copy { font-size: 0.82rem; color: var(--operon-chatbot-muted); }",
      ".operon-chatbot-route-link {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  min-height: 40px;",
      "  padding: 0 13px;",
      "  border-radius: 10px;",
      "  background: var(--operon-chatbot-accent);",
      "  color: #ffffff;",
      "  text-decoration: none;",
      "  font-weight: 700;",
      "  white-space: nowrap;",
      "}",
      "@media (max-width: 640px) {",
      "  #" + ROOT_ID + " {",
      "    right: 12px;",
      "    left: 12px;",
      "    bottom: calc(12px + env(safe-area-inset-bottom, 0px));",
      "    width: auto;",
      "  }",
      "  .operon-chatbot-panel {",
      "    max-height: min(62vh, 520px);",
      "  }",
      "  .operon-chatbot-route {",
      "    align-items: stretch;",
      "    flex-direction: column;",
      "  }",
      "  .operon-chatbot-route-link { width: 100%; }",
      "  .operon-chatbot-operator-grid { grid-template-columns: 1fr; }",
      "  .operon-chatbot-nudge { max-width: 100%; }",
      "}",
      "@media (prefers-reduced-motion: reduce) {",
      "  .operon-chatbot-panel, .operon-chatbot-toggle { transition: none; }",
      "}",
      "@media (max-width: 420px) {",
      "  .operon-chatbot-toggle { width: 100%; justify-content: center; }",
      "  .operon-chatbot-message { max-width: 100%; }",
      "  .operon-chatbot-panel { max-height: min(60vh, 500px); }",
      "  .operon-chatbot-head { padding: 13px 12px 10px; }",
      "  .operon-chatbot-messages { padding: 10px; }",
      "}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (typeof text === "string") {
      node.textContent = text;
    }
    return node;
  }

  function createChatbotUI(options) {
    const settings = Object.assign({
      title: "Operon Assistant",
      subtitle: "Product and quote help",
      onToggle: function () {},
      onAction: function () {},
      onTextSubmit: function () {},
      onOperatorSubmit: function () {
        return Promise.reject(new Error("Operator request is unavailable."));
      }
    }, options || {});

    ensureStyles();

    const existing = document.getElementById(ROOT_ID);
    if (existing) {
      existing.remove();
    }

    const root = createElement("div");
    root.id = ROOT_ID;

    const shell = createElement("div", "operon-chatbot-shell");
    const panel = createElement("section", "operon-chatbot-panel");
    panel.id = "operon-chatbot-panel";
    panel.setAttribute("data-open", "false");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", settings.title);

    const toggle = createElement("button", "operon-chatbot-toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "operon-chatbot-panel");
    const badge = createElement("span", "operon-chatbot-toggle-badge", "?");
    const toggleText = createElement("span", "", "Ask Operon");
    toggle.appendChild(badge);
    toggle.appendChild(toggleText);

    const nudge = createElement("button", "operon-chatbot-nudge");
    nudge.type = "button";
    nudge.setAttribute("data-visible", "false");
    nudge.setAttribute("aria-label", "Open assistant suggestion");

    const head = createElement("div", "operon-chatbot-head");
    const title = createElement("div", "operon-chatbot-title");
    const titleStrong = createElement("strong", "", settings.title);
    const titleSub = createElement("span", "", settings.subtitle);
    const titleDisclaimer = createElement("div", "operon-chatbot-disclaimer", "");
    title.appendChild(titleStrong);
    title.appendChild(titleSub);
    title.appendChild(titleDisclaimer);
    const close = createElement("button", "operon-chatbot-close", "x");
    close.type = "button";
    close.setAttribute("aria-label", "Close assistant");
    head.appendChild(title);
    head.appendChild(close);

    const messages = createElement("div", "operon-chatbot-messages");
    messages.setAttribute("aria-live", "polite");
    messages.setAttribute("aria-atomic", "false");

    const summary = createElement("div", "operon-chatbot-summary");
    const summaryTitle = createElement("strong", "", "Details so far");
    const summaryText = createElement("span", "", "");
    const summaryValidation = createElement("div", "operon-chatbot-validation", "");
    summary.appendChild(summaryTitle);
    summary.appendChild(summaryText);
    summary.appendChild(summaryValidation);

    const operatorSection = createElement("div", "operon-chatbot-operator");
    operatorSection.hidden = true;
    const operatorTitle = createElement("strong", "", "Need a person?");
    const operatorCopy = createElement("p", "", "");
    const operatorForm = createElement("form", "operon-chatbot-operator-form");
    const operatorGrid = createElement("div", "operon-chatbot-operator-grid");
    const operatorNameField = createElement("div", "operon-chatbot-operator-field");
    const operatorNameLabel = createElement("label", "", "Name");
    const operatorNameInput = createElement("input", "");
    operatorNameInput.type = "text";
    operatorNameInput.autocomplete = "name";
    const operatorPhoneField = createElement("div", "operon-chatbot-operator-field");
    const operatorPhoneLabel = createElement("label", "", "Phone");
    const operatorPhoneInput = createElement("input", "");
    operatorPhoneInput.type = "tel";
    operatorPhoneInput.autocomplete = "tel";
    const operatorEmailField = createElement("div", "operon-chatbot-operator-field");
    operatorEmailField.setAttribute("data-wide", "true");
    const operatorEmailLabel = createElement("label", "", "Email optional");
    const operatorEmailInput = createElement("input", "");
    operatorEmailInput.type = "email";
    operatorEmailInput.autocomplete = "email";
    const operatorMessageField = createElement("div", "operon-chatbot-operator-field");
    operatorMessageField.setAttribute("data-wide", "true");
    const operatorMessageLabel = createElement("label", "", "What do you need help with?");
    const operatorMessageInput = createElement("textarea", "");
    operatorMessageInput.rows = 2;
    const operatorStatus = createElement("p", "operon-chatbot-operator-status", "");
    const operatorButton = createElement("button", "operon-chatbot-operator-button", "Send operator request");
    operatorButton.type = "submit";
    operatorNameField.appendChild(operatorNameLabel);
    operatorNameField.appendChild(operatorNameInput);
    operatorPhoneField.appendChild(operatorPhoneLabel);
    operatorPhoneField.appendChild(operatorPhoneInput);
    operatorEmailField.appendChild(operatorEmailLabel);
    operatorEmailField.appendChild(operatorEmailInput);
    operatorMessageField.appendChild(operatorMessageLabel);
    operatorMessageField.appendChild(operatorMessageInput);
    operatorGrid.appendChild(operatorNameField);
    operatorGrid.appendChild(operatorPhoneField);
    operatorGrid.appendChild(operatorEmailField);
    operatorGrid.appendChild(operatorMessageField);
    operatorForm.appendChild(operatorGrid);
    operatorForm.appendChild(operatorStatus);
    operatorForm.appendChild(operatorButton);
    operatorSection.appendChild(operatorTitle);
    operatorSection.appendChild(operatorCopy);
    operatorSection.appendChild(operatorForm);

    const inputWrap = createElement("form", "operon-chatbot-input-wrap");
    const textInput = createElement("input", "operon-chatbot-input");
    textInput.type = "text";
    textInput.placeholder = "Ask about flooring or quote scope";
    textInput.setAttribute("aria-label", "Chat assistant input");
    const sendButton = createElement("button", "operon-chatbot-send", "Send");
    sendButton.type = "submit";
    inputWrap.appendChild(textInput);
    inputWrap.appendChild(sendButton);

    const route = createElement("div", "operon-chatbot-route");
    const routeCopy = createElement("div", "operon-chatbot-route-copy", "Next");
    const routeLink = createElement("a", "operon-chatbot-route-link", "Start quote");
    routeLink.href = "quote.html";
    routeLink.setAttribute("data-chatbot-route", "true");
    route.appendChild(routeCopy);
    route.appendChild(routeLink);

    panel.appendChild(head);
    panel.appendChild(messages);
    panel.appendChild(summary);
    panel.appendChild(operatorSection);
    panel.appendChild(inputWrap);
    panel.appendChild(route);
    shell.appendChild(panel);
    shell.appendChild(nudge);
    shell.appendChild(toggle);
    root.appendChild(shell);
    document.body.appendChild(root);

    let isOpen = false;
    let lastFocusedBeforeOpen = null;

    function getFocusableElements() {
      return Array.from(panel.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
        .filter(function (item) {
          return !item.hasAttribute("disabled");
        });
    }

    function setOpen(next) {
      isOpen = !!next;
      panel.setAttribute("data-open", isOpen ? "true" : "false");
      panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (isOpen) {
        nudge.setAttribute("data-visible", "false");
      }
      if (isOpen) {
        lastFocusedBeforeOpen = document.activeElement || toggle;
        window.setTimeout(function () {
          textInput.focus();
        }, 0);
      } else if (lastFocusedBeforeOpen && typeof lastFocusedBeforeOpen.focus === "function") {
        lastFocusedBeforeOpen.focus();
      }
      settings.onToggle(isOpen);
    }

    function render(snapshot) {
      const transcript = snapshot && Array.isArray(snapshot.transcript) ? snapshot.transcript : [];
      const structured = snapshot && snapshot.structuredOutput ? snapshot.structuredOutput : null;
      const routeSuggestion = snapshot && snapshot.routeSuggestion ? snapshot.routeSuggestion : null;
      const siteState = snapshot && snapshot.siteState ? snapshot.siteState : null;
      const triggerNudge = snapshot && snapshot.triggerNudge ? snapshot.triggerNudge : null;
      const operatorHandoff = snapshot && snapshot.operatorHandoff ? snapshot.operatorHandoff : null;

      messages.innerHTML = "";

      transcript.forEach(function (item) {
        const bubble = createElement("div", "operon-chatbot-message");
        bubble.setAttribute("data-role", item.role);
        bubble.textContent = item.text;

        if (item.role === "assistant" && Array.isArray(item.actions) && item.actions.length) {
          const actions = createElement("div", "operon-chatbot-actions");
          item.actions.forEach(function (action) {
            const chip = createElement("button", "operon-chatbot-chip", action.label);
            chip.type = "button";
            chip.setAttribute("data-chatbot-action", action.id);
            actions.appendChild(chip);
          });
          bubble.appendChild(actions);
        }

        messages.appendChild(bubble);
      });

      const summaryCopy = structured ? buildSummary(structured, siteState) : "";
      const validationCopy = structured ? buildValidation(structured) : "";
      summary.hidden = !summaryCopy && !validationCopy;
      summaryText.hidden = !summaryCopy;
      summaryValidation.hidden = !validationCopy;
      summaryText.textContent = summaryCopy;
      summaryValidation.textContent = validationCopy;

      operatorSection.hidden = !operatorHandoff;
      route.hidden = !!operatorHandoff;
      if (operatorHandoff) {
        operatorTitle.textContent = operatorHandoff.title || "Need a person?";
        operatorCopy.textContent = operatorHandoff.copy || "Send your contact details and project note so the team can follow up.";
        operatorButton.textContent = operatorHandoff.primaryLabel || "Send operator request";
      }

      if (routeSuggestion && routeSuggestion.href) {
        routeCopy.textContent = "Next";
        routeLink.textContent = routeSuggestion.label || "Continue";
        routeLink.href = routeSuggestion.href;
        routeLink.setAttribute("data-chatbot-focus-id", routeSuggestion.focusId || "");
      }

      if (!isOpen && triggerNudge && triggerNudge.text) {
        nudge.textContent = triggerNudge.text;
        nudge.setAttribute("data-visible", "true");
      }

      messages.scrollTop = messages.scrollHeight;
    }

    function buildSummary(structured, siteState) {
      const parts = [];

      if (structured.ready_for_quote) {
        parts.push("Ready to start quote");
      }
      if (structured.category || structured.recommended_category) {
        parts.push("Flooring: " + titleCase(structured.category || structured.recommended_category));
      } else if (siteState && siteState.selectedCategory) {
        parts.push("Flooring: " + titleCase(siteState.selectedCategory));
      }
      if (hasValue(structured.area)) {
        parts.push("Area: " + structured.area + " m²");
      } else if (siteState && hasValue(siteState.realArea)) {
        parts.push("Area: " + siteState.realArea + " m²");
      }
      if (structured.existing_floor) {
        parts.push("Existing floor: " + titleCase(structured.existing_floor));
      }
      if (structured.subfloor_condition) {
        parts.push("Subfloor: " + titleCase(structured.subfloor_condition));
      }
      if (structured.access) {
        parts.push("Site details: " + titleCase(structured.access));
      }
      if (hasValue(structured.stairs)) {
        parts.push("Stairs: " + (structured.stairs ? "yes" : "no"));
      }

      return parts.join(" • ");
    }

    function buildValidation(structured) {
      const flags = Array.isArray(structured.validation_flags) ? structured.validation_flags : [];
      if (!flags.length) {
        return "";
      }

      return "Check: " + flags.map(function (flag) {
        return titleCase(flag);
      }).join(" • ");
    }

    function hasValue(value) {
      return value !== null && typeof value !== "undefined" && value !== "";
    }

    function titleCase(value) {
      return String(value || "").replace(/_/g, " ").replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen);
    });

    nudge.addEventListener("click", function () {
      setOpen(true);
    });

    close.addEventListener("click", function () {
      setOpen(false);
    });

    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !isOpen) {
        return;
      }

      const focusable = getFocusableElements();
      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    messages.addEventListener("click", function (event) {
      const button = event.target.closest("[data-chatbot-action]");
      if (!button) {
        return;
      }

      settings.onAction(button.getAttribute("data-chatbot-action"));
    });

    inputWrap.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = textInput.value.trim();
      if (!value) {
        return;
      }

      textInput.value = "";
      settings.onTextSubmit(value);
    });

    operatorForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = operatorNameInput.value.trim();
      const phone = operatorPhoneInput.value.trim();
      const email = operatorEmailInput.value.trim();
      const message = operatorMessageInput.value.trim();

      operatorStatus.removeAttribute("data-state");
      if (!name) {
        operatorStatus.textContent = "Please enter your name.";
        operatorStatus.setAttribute("data-state", "error");
        operatorNameInput.focus();
        return;
      }
      if (!phone && !email) {
        operatorStatus.textContent = "Please enter a phone number or email so we can contact you.";
        operatorStatus.setAttribute("data-state", "error");
        operatorPhoneInput.focus();
        return;
      }
      if (email && !/.+@.+\..+/.test(email)) {
        operatorStatus.textContent = "Email format looks invalid.";
        operatorStatus.setAttribute("data-state", "error");
        operatorEmailInput.focus();
        return;
      }

      operatorButton.disabled = true;
      operatorStatus.textContent = "Sending request...";
      Promise.resolve(settings.onOperatorSubmit({
        name: name,
        phone: phone,
        email: email,
        message: message
      })).then(function () {
        operatorStatus.textContent = "Request sent. A real person will follow up shortly.";
        operatorStatus.setAttribute("data-state", "success");
        operatorMessageInput.value = "";
      }).catch(function (error) {
        operatorStatus.textContent = error && error.message ? error.message : "Could not send the request. Please try again.";
        operatorStatus.setAttribute("data-state", "error");
      }).finally(function () {
        operatorButton.disabled = false;
      });
    });


    routeLink.addEventListener("click", function (event) {
      const focusId = routeLink.getAttribute("data-chatbot-focus-id") || "";
      const routeUrl = new URL(routeLink.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const samePage = routeUrl.pathname === currentUrl.pathname && routeUrl.origin === currentUrl.origin;
      const focusTarget = focusId ? document.getElementById(focusId) : null;

      if (!samePage || !focusTarget) {
        return;
      }

      event.preventDefault();
      focusTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(function () {
        if (typeof focusTarget.focus === "function") {
          focusTarget.focus({ preventScroll: true });
        }
      }, 220);
      setOpen(false);
    });

    return {
      root: root,
      render: render,
      open: function () {
        setOpen(true);
      },
      close: function () {
        setOpen(false);
      },
      destroy: function () {
        root.remove();
      }
    };
  }

  window.OperonChatbotUI = {
    createChatbotUI: createChatbotUI
  };
}());
