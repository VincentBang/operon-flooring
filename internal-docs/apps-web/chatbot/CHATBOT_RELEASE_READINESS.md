# Chatbot Release Readiness

Purpose: summarize whether the isolated chatbot assistant can remain mounted safely on approved pages without interfering with the Operon Flooring quote, pricing, product, form, or lead systems.

## Current Verdict

Status: ready for passive isolated mount.

The assistant is ready to stay mounted as a controlled, closed-by-default guided decision layer on the approved pages. It is not ready for automatic quote-field application, product overrides, pricing calls, lead submission, or live localStorage writes.

## Approved Pages

- `index.html`
- `products.html`
- `quote.html`
- `quote-review.html`
- `floorplan.html` for floor-plan measurement prompts only
- `thank-you.html` as an approved passive preset/mount only when the page includes the bootstrap

Mount condition:

- `openOnInit: false`
- user must choose to open the widget
- no auto-navigation
- no form updates
- readonly page-state reads are allowed

## Release Gates

| Gate | Required result | Status |
| --- | --- | --- |
| Isolation status | Chatbot files own chatbot behaviour | Pass |
| Passive mount | Approved pages use `openOnInit: false` | Pass |
| Readonly page state | Assistant may read current page progress only | Pass |
| Pricing calls | No quote calculator or pricing module calls from chatbot code | Pass |
| Form writes | No quote form field writes from chatbot code | Pass |
| localStorage writes | No live localStorage writes from chatbot code | Pass |
| Product logic | No product selection override from chatbot code | Pass |
| Scenario matrix | Required prompt routes pass without pricing output | Pass |
| Coverage map | Main customer journey prompts are covered | Pass |
| Response guardrails | Answers avoid pricing, pressure, and competitor-cheapest claims | Pass |
| Guided decision format | Responses stay short, include one key point, and end with a next step | Pass |
| Quote-review mode policy | Quick completeness and document-based review are separated | Pass |
| Floorplan route policy | `floorplan.html` is allowed only for explicit floor-plan measurement help | Pass |
| Thank-you preset | Treated as passive post-submit mount, not an active lead-capture path | Pass |
| Operator handoff | Explicit request only, with not-live-chat and privacy copy | Pass |
| Conversion triggers | Idle, stuck-user, and near-completion nudges remain advisory only | Pass |
| Handoff contract | Readiness is returned only, with `safe_to_apply: false` | Pass |
| Mobile overlap | Widget uses constrained mobile layout and pointer-safe root | Pass |

## Required Validation Command

```sh
node apps/web/chatbot/tests/chatbot.test.js
```

## Remaining Risks Before Deeper Integration

- Future form mapping must be explicit and separately approved.
- Future localStorage writes must target chatbot-specific keys only unless integration is approved.
- Future readonly page-state reads must stay limited to navigation and guidance signals.
- Future product handoff must not override product-system source of truth.
- Future quote handoff must not call pricing logic directly.
- Future live-page UI changes must check CTA overlap on mobile and desktop.
- Future chatbot UI changes must rerun the mobile overlap audit.
- Future lead capture must remain owned by the existing quote submission flow.
- Future operator follow-up must remain explicit and must not become silent lead capture.
- Future quote-review UI work must keep quick results separate from document extraction/product-match sections.
- Future conversion nudges must remain passive: no auto-navigation, no auto-submit, and no auto-field updates.

## Release Rule

This report only approves passive isolated mounting. It does not approve quote integration, product integration, pricing integration, form writes, localStorage writes, Supabase writes, or lead submission changes.
