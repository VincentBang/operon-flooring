# Operon Chatbot Integration Contract

This chatbot is an isolated guided decision layer. It supports product guidance, quote explanation, missing-detail collection, quote-scope review, stuck-user recovery, near-completion nudges, and future structured handoff. It is not a pricing engine, product selector, quote-flow replacement, or free-form AI assistant.

## System Boundary

The system hierarchy must remain:

```text
User -> Chatbot assistant layer
     -> Product system
     -> Quote wizard
     -> quoteCalculator.js as source of truth
```

The chatbot may guide the user toward the product system or quote page. It must not become part of those systems.

## Allowed Behavior

The chatbot may:

- read current page state from DOM and localStorage without writing to either
- detect the current quote step and the next missing input for guidance only
- explain laminate, hybrid, and engineered timber at a category level
- explain estimate versus final quote
- explain common scope factors such as area, removal, floor preparation, trims, furniture, access, and stairs
- collect optional draft details into its own structured JSON
- identify missing or risky scope details
- suggest navigation to `products.html`, `quote.html`, or `quote-review.html`
- use short guided responses with one key point and one next step
- show idle, stuck-user, and near-submit nudges without auto-navigation
- scroll/focus a relevant visible section after user clicks a suggestion
- prepare quote-field and localStorage draft payloads for future integration
- run isolated preview and Node tests under `apps/web/chatbot/`

## Forbidden Behavior

The chatbot must never:

- calculate prices, rates, subtotals, totals, discounts, or quote outputs
- claim Operon is cheaper than a competitor
- compare competitor pricing
- describe the online estimate as the final quote
- modify quote form fields directly
- write to quote/product localStorage keys
- submit forms
- override product selection
- call `quoteCalculator.js`
- import or depend on pricing modules
- mutate product, quote, pricing, or submission logic

## Files That Must Not Be Touched By Chatbot Work

Do not edit these files as part of chatbot behavior or integration unless a separate task explicitly changes the isolation boundary:

```text
apps/web/index.html
apps/web/quote.html
apps/web/products.html
apps/web/products.js
apps/web/productSelection.js
apps/web/quoteCalculator.js
apps/web/pricingRules.js
apps/web/installRates.js
apps/web/underlay.js
apps/web/skirtingScotia.js
apps/web/removalRates.js
apps/web/locationZones.js
```

For launch wiring, the only acceptable live-page change is a minimal script include and mount call on an explicitly approved page. That wiring must not modify form, product, or pricing logic.

## Module Load Order

The approved module order is:

```text
chatbotPrompts.js
chatbotPolicy.js
chatbotKnowledge.js
chatbotScenarios.js
chatbotSiteState.js
chatbotStateMapper.js
chatbotLogic.js
chatbotUI.js
chatbot.js
```

Use `chatbotBootstrap.js` to load these files. Do not duplicate script ordering by hand unless the bootstrap is unavailable.

## Approved Mount Pattern

Future page wiring should use the bootstrap:

```html
<script src="chatbot/chatbotBootstrap.js"></script>
<script>
  window.OperonChatbotBootstrap.mount({
    basePath: "chatbot/",
    openOnInit: false
  });
</script>
```

For a preview page inside `apps/web/chatbot/`, use:

```js
window.OperonChatbotBootstrap.mount({
  basePath: "./",
  pageKey: "index",
  openOnInit: true
});
```

`openOnInit` should default to `false` on live pages. The assistant should not auto-open aggressively or block CTAs/forms.

## Page Presets

`chatbotBootstrap.js` owns page-aware presets:

- `index`: general pathfinding
- `products`: product/category guidance
- `quote`: quote scope helper
- `quote-review`: quote scope review helper
- `default`: neutral fallback

Preset detection must only affect chatbot copy, title, subtitle, readonly state hints, and route suggestions. It must not affect product, quote, pricing, or form behavior.

## Guided Decision Behaviour

The assistant must behave like a guided decision system, not a Q&A bot. Each response should stay short, customer-facing, and avoid internal labels:

```text
Short answer.
One practical insight.
One forward action or one question.
```

Approved flows:

- product selection -> `products.html`
- cost explanation -> `quote.html`
- quote validation -> `quote-review.html`
- missing information collection -> `quote.html`
- stuck-user recovery -> current page next step
- near-completion push -> review scope, then submit through the quote page

The chatbot may ask only one question at a time. It must not calculate prices, display numeric estimates, or replace the quote flow.

## Readonly Page State

`chatbotSiteState.js` may read:

- selected category / range / product IDs from DOM or localStorage
- quote step number
- measurement method
- entered area
- quote mode

It must not write fields, trigger calculations, submit forms, or mutate localStorage. Any route suggestion that focuses a field must require a user click first.

## Structured Output Schema

The chatbot structured output is prepared by `chatbotStateMapper.js`.

Current shape:

```json
{
  "version": "1.0.0",
  "category": "hybrid",
  "selection_mode": "recommend",
  "area": 52,
  "measurement_method": "manual_total",
  "existing_floor": "carpet",
  "removal_disposal": "unsure",
  "subfloor_condition": "unsure",
  "floor_prep_type": "unsure",
  "stairs": 0,
  "access": "easy",
  "furniture": "some",
  "property_type": "house",
  "level": "",
  "has_lift": "na",
  "parking_access": "easy",
  "quote_mode": "supply_install",
  "readiness": "review",
  "scenario_id": "replacing_carpet",
  "scenario_step": 3,
  "scenario_flags": ["removal_scope_review"],
  "notes": [],
  "confidence_flags": ["category_selected"],
  "validation_flags": ["subfloor_review_recommended"],
  "missing_items": []
}
```

Rules:

- Output is draft-only.
- Empty values mean unknown, not false.
- `validation_flags` are warnings for review, not pricing decisions.
- `scenario_flags` describe assistant playbook context only.
- `category` is category-level guidance and does not override product selection.

## Quote Field Draft Mapping

`toQuoteFieldDraft(...)` prepares a future-compatible mapping:

```json
{
  "quoteMode": "supply_install",
  "selectedProductCategory": "hybrid",
  "productChoiceMode": "recommend",
  "totalAreaM2": "52",
  "measurementMethod": "manual_total",
  "removalType": "carpet",
  "removalDisposal": "unsure",
  "floorPrepType": "unsure",
  "stairs": "no",
  "furnitureType": "yes",
  "parkingAccess": "easy",
  "propertyType": "house",
  "level": "",
  "hasLift": "na"
}
```

This mapping must not be applied automatically. A future integration layer may read it only after the page wiring has been explicitly approved.

## LocalStorage Draft Format

`toLocalStorageDraft(...)` returns prepared string values only:

```json
{
  "operon_chatbot_draft": "{...}",
  "operon_chatbot_quote_field_draft": "{...}"
}
```

The chatbot module must not write these keys automatically. Any future storage write requires a separate integration decision.

## Scenario Playbooks

`chatbotScenarios.js` owns controlled scenario flows:

- `apartment_renovation`
- `replacing_carpet`
- `install_only`
- `unknown_area`
- `water_resistance_needed`
- `premium_finish`
- `ready_to_submit_check`

Scenario steps may patch chatbot draft fields only. They must not patch live quote fields.

## Testing

Run the isolated test suite with:

```bash
node apps/web/chatbot/tests/chatbot.test.js
```

Before launch wiring, tests must pass and preview should be manually checked:

```text
apps/web/chatbot/preview.html
```

## Launch Checklist

Before mounting on a live page:

- Confirm the approved page and exact mount location.
- Confirm `openOnInit: false`.
- Confirm chatbot does not cover primary CTAs or form controls on desktop/mobile.
- Run `node apps/web/chatbot/tests/chatbot.test.js`.
- Check the preview page.
- Check browser console on the approved page.
- Confirm no product, quote, pricing, or submission behavior changed.

## Rollback Plan

Rollback for live mounting must be simple:

- remove the script include for `chatbot/chatbotBootstrap.js`
- remove the mount call
- leave the isolated `apps/web/chatbot/` module in place

No product, quote, or pricing rollback should be required if this contract is followed.
