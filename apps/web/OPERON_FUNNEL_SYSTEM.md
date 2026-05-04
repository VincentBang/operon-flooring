# Operon Funnel System

Updated: 2026-05-04

Purpose: turn Operon Flooring from a set of pages into a structured conversion system that improves lead quality, completion rate, decision speed, and data advantage without changing pricing logic or exposing internal rates.

## Funnel Layers

1. Entry: homepage, SEO pages, blog, suburb pages.
2. Product selection: category guidance and recommended product path.
3. Quote flow: guided estimate with one decision per step.
4. Summary: estimate context, confidence, included scope, and next step.
5. Submit: lead capture, local backup, Netlify/Supabase save path.
6. Thank-you: immediate reassurance, timing capture, and next actions.
7. Follow-up: SMS/email playbook and future automation queue.
8. Close: scope confirmation, site assessment, final quote, booking.
9. Data feedback: intent, product, quote, stage, and conversion signals.

## Layer 1: Entry

Current implementation:

- Homepage now routes users into three clear intent paths:
  - `quote`: start the guided quote flow.
  - `products`: browse product direction first.
  - `review`: check an existing quote for scope clarity.
- Entry path clicks emit `funnel_intent_select`.
- Standard CTA clicks still emit `cta_click`.

Conversion goal:

- Reduce hesitation by matching the visitor's readiness.
- Avoid forcing product browsers into the quote too early.
- Avoid forcing users with an existing quote into a generic estimate path.

## Layer 2: Product Selection

Current implementation:

- Product flow defaults to recommended option.
- Product category is guided before product range detail.
- Product pages and catalogue bridge into `quote.html`.

Rules:

- Keep product choice narrow.
- Use recommendation first.
- Do not make colour selection mandatory unless the pricing/product model requires it.
- Do not expose internal product cost, margin, installer cost, or rate logic.

## Layer 3: Quote Flow

Current implementation:

- Quote flow is now seven steps:
  1. Details
  2. Property
  3. Flooring
  4. Area
  5. Stairs
  6. Extras
  7. Summary
- Each step uses short guidance, persistence messaging, and step tracking.
- Measurement supports `I'm not sure yet` and routes to site assessment, floorplan lookup, or product discovery.

Rules:

- One decision per step wherever practical.
- Use `Not sure` as a real path, not a disguised validation error.
- Keep pricing calculation inside `quoteCalculator.js` or approved private runtime only.
- Keep wastage inside quote calculation only.

## Layer 4: Stairs And Extras

Current implementation:

- Stairs are separated from extras.
- Stairs are stored as a scope flag:
  - `stairs`
  - `stairsCount`
  - `stairsCountRange`
  - `stairsRequiresReview`
- Exact stair pricing is not calculated in the wizard.
- Extras are grouped into:
  - Critical: removal, disposal, floor preparation.
  - Common: underlay, skirting/scotia, finishing.
  - Optional: door trimming, furniture moving, notes/photos.
- Extras use progressive disclosure and a `Continue with standard setup` path.

Conversion goal:

- Capture high-impact scope without making the user feel interrogated.
- Reduce mismatched quotes caused by missed stairs, removal, disposal, prep, trims, or access.

## Layer 5: Summary

Current implementation:

- Summary explains:
  - estimate total or pending measurement
  - confidence level
  - selected product
  - quote path
  - real and chargeable area
  - included scope
  - items that may affect final price
- Summary copy keeps the estimate positioned as a starting estimate, not a final locked quote.

Rules:

- Do not expose line-level internal rates.
- Do not overwhelm the customer with every calculation detail.
- Control uncertainty with confidence and scope language.

## Layer 6: Submit And Thank-You

Current implementation:

- Submit saves lead payload backup locally.
- Submit routes to Netlify/Supabase save paths where configured.
- Thank-you page confirms receipt and captures project timing:
  - `hot`: ready soon
  - `warm`: comparing
  - `cold`: planning
- Thank-you CTAs route back to estimate, products, or quote review.

Conversion goal:

- Prevent a post-submit dead end.
- Let ready leads self-identify.
- Give comparing users a trust-building next action.

## Layer 7: Follow-Up

Current implementation:

- `POST_SUBMIT_CONVERSION_SYSTEM.md` defines the follow-up playbook.
- `OPERON_CLOSE_SCRIPTS.md` defines channel-specific phone, SMS, email, chatbot, and objection-handling scripts.
- `AUTOMATED_CLOSE_SYSTEM.md` defines Supabase lead scoring, event tracking, scheduled processing, chatbot signals, and safe queued close actions.
- SMS/email sending is not enabled yet.
- Follow-up automation must remain server-side and disabled until provider credentials and consent/compliance are ready.

Three-layer follow-up:

- Layer 1: immediate receipt and next-step reassurance.
- Layer 2: 24-72 hour clarity follow-up for hot/warm leads.
- Layer 3: 3-14 day planning support for warm/cold leads.

Rules:

- No fake urgency.
- No automatic discounts.
- No pressure language.
- No frontend provider keys.

## Layer 8: Close Support

Close support should help the customer decide by clarifying:

- final product/range
- area and measurement confidence
- stairs/access
- removal/disposal
- floor preparation
- trims/skirting/door trimming
- timing and site assessment need

Recommended close actions:

- Confirm scope.
- Request site assessment where needed.
- Request floor plan/photos where useful.
- Confirm final quote before booking.

Close scripts:

- Use `OPERON_CLOSE_SCRIPTS.md` for phone, SMS, email, chatbot responses, and objection handling.
- Keep every close conversation anchored to scope clarity, preparation, access, and final confirmation before work.
- Offer choices instead of pushing for immediate commitment.
- Use `process-leads` to score engagement and queue manual close actions when a lead reaches `closing`.

## Layer 9: Data Feedback

Current data signals:

- `cta_click`
- `CTA_click`
- `funnel_intent_select`
- `chatbot_interaction`
- `chatbot_hesitation_detected`
- `product_catalogue_view`
- `product_filter_change`
- `product_select`
- `quote_start`
- `step_view`
- `step_complete`
- `step_error`
- `quote_submit`
- `quote_submit_success`
- `quote_submit_error`
- `summary_view`
- `quote_thank_you_view`
- `thank_you_lead_stage_select`
- `lead_stage_selected`

Data advantage goal:

- Learn which entry path converts best.
- Learn where quote drop-off happens.
- Learn which product categories and scope flags create better leads.
- Learn which lead stages progress to site assessment or booking.

## Remaining Weak Points

- Follow-up SMS/email is a playbook only until provider and consent setup are complete.
- Close-stage outcomes are not yet stored as structured CRM events.
- Product pricing and catalogue admin remain split between local files, Supabase compatibility tables, and future canonical tables.
- Thank-you lead stage is stored locally unless backend persistence is added.
- Site assessment booking is still a soft CTA, not a true scheduler.

## Next Optimisation Priority

The next best optimisation is backend lead enrichment:

- persist `funnel_intent`
- persist `lead_stage`
- persist `stairsRequiresReview`
- persist extras decisions
- create `site_assessment_requested`
- create `conversion_to_booking`

Do this through server-side Netlify/Supabase functions only. Do not change customer-facing pricing logic to add this data layer.
