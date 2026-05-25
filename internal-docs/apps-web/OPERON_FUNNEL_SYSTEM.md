# Operon Funnel System

Updated: 2026-05-08

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

## Scope Standard Funnel Principle

The Operon Scope Standard supports the funnel quietly: it helps customers compare flooring quotes by scope clarity, not price alone.

Use it to improve:

- entry-page trust language
- product/category guidance
- quote flow completeness
- quote-review intelligence
- follow-up education
- close-stage scope confirmation
- future workflow logic

Customer-facing language should stay plain:

- clear scope before price comparison
- know what is included before you decide
- final details confirmed before installation
- a cheaper quote may not describe the same job

Do not turn this into public trademark-style branding.

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

## SEO Entry Data Capture Map

Use this as the safe measurement map for SEO and CRO work. It documents what should be observed, not new data collection requirements.

| Entry signal | Current or safe source | Funnel value | Guardrail |
| --- | --- | --- | --- |
| Quote-start click | CTA tracking on homepage, SEO pages, product pages and guides | Measures quote intent by page and topic cluster | Do not collect sensitive notes before the user enters the quote flow. |
| Quote-review click | Links from homepage, product pages, selected guides and thank-you page | Measures scope-clarity intent and existing-quote demand | Position as scope review, not cheapest-price comparison. |
| Floorplan click | Links from product pages, suburb pages, cost guides and measurement guide | Measures area-uncertainty and measurement-assistance demand | Floorplan remains measurement only; wastage and pricing stay in quote calculation. |
| Product browse click | Links from product SEO pages, suburb pages, guides and quote flow | Measures category/product exploration before estimate | Product selection remains owned by the product system. |
| Contact/help click | Footer/header paths and contact page | Measures support need outside self-serve quote flow | Do not replace quote CTAs with contact-first routing on high-intent pages. |

Next safe analytics improvements should stay event-level and page-level until explicit approval exists for deeper lead/profile joins.

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

Safe structured capture principles:

- Capture intent, scope category, confidence, and completion state before capturing more personal detail.
- Keep personal details limited to submitted quote requests, customer portal access, or explicit file uploads.
- Do not collect unnecessary notes, full addresses, uploaded plans, photos, or raw quote-review files as analytics events.
- Do not expose internal rates, margin logic, stair unit prices, supplier costs, or pricing formulas in analytics metadata.
- Keep backend persistence server-side. Frontend tracking can emit events, but long-term CRM fields should be saved through Netlify/Supabase functions.

Safe capture map:

| Funnel area | Safe structured fields | Why it helps | Risk control |
| --- | --- | --- | --- |
| Entry pages | `page_type`, `topic_cluster`, `cta_location`, `cta_intent`, `device_type`, `traffic_source` | Shows which SEO and guide pages create quote demand | Do not store raw query strings beyond approved UTM/source fields |
| Product discovery | `category`, `range`, `colour_selected`, `selection_source`, `product_choice_mode` | Shows whether users want exact ranges, budget guidance, or premium guidance | Do not store internal product cost, margin, or private supplier rates |
| Quote step progress | `step_number`, `step_name`, `validation_source`, `error_type`, `completion_state` | Identifies confusing steps and mobile friction | Store error categories, not long free-text user entries |
| Scope shape | `quote_mode`, `flooring_category`, `measurement_source`, `area_band`, `room_count_band`, `stairs_flag`, `extras_flags` | Improves lead quality and future follow-up routing | Use bands/booleans where exact values are not needed for analytics |
| Measurement tools | `floorplan_opened`, `floorplan_uploaded`, `scale_set`, `room_count`, `area_used` | Shows whether the floorplan tool creates better estimates | Do not persist uploaded plan images as analytics events |
| Quote review | `review_started`, `review_completed`, `confidence_level`, `category_detected`, `missing_information_count` | Measures demand for quote validation without overclaiming accuracy | Do not store raw supplier quote text in analytics tables |
| Submit and thank-you | `quote_reference`, `estimated_total`, `lead_stage`, `site_assessment_interest`, `copy_requested` | Links quote intent to follow-up priority and close probability | Customer PII belongs only in quote-request records, not general events |
| Close feedback | `lead_status`, `site_assessment_needed`, `final_quote_sent`, `accepted`, `lost_reason_category` | Closes the loop between SEO/quote behaviour and real outcomes | Admin-only fields; no public page exposure |

Scope Standard future signals:

| Signal | Source | Why it helps | Guardrail |
| --- | --- | --- | --- |
| `scope_definition_level` | Quote review or admin review | Separates high-definition quotes from unclear quotes | Do not treat as a public score until UX is ready. |
| `missing_scope_categories` | Quote review structured output | Shows common gaps such as prep, underlay, access, trims or stairs | Store categories, not raw competitor text. |
| `customer_decision_state` | Quote review / thank-you / close notes | Helps follow-up match the customer's concern | Use for relevance, not pressure. |
| `next_best_action` | Quote review output | Measures whether users need estimate, clarification, product selection or manual review | Keep one calm next step. |
| `variation_observed_later` | Admin/close feedback | Links early missing-scope warnings to real outcomes | Internal only; do not use as public competitor commentary. |

Recommended event taxonomy:

- Keep existing events: `cta_click`, `funnel_intent_select`, `product_catalogue_view`, `product_filter_change`, `product_select`, `quote_start`, `step_view`, `step_complete`, `step_error`, `quote_submit`, `quote_submit_success`, `quote_submit_error`, `summary_view`, `quote_thank_you_view`, and `lead_stage_selected`.
- Add future events only when they answer a conversion question, such as `quote_review_started`, `quote_review_completed`, `floorplan_area_used`, `site_assessment_requested`, and `quote_copy_requested`.
- Prefer stable category values over changing copy text. For example, use `cta_intent: "quote_start"` rather than the exact button label.

Analytics implementation order:

1. Audit CTA coverage on commercial, product, guide, quote-review, and floorplan entry pages.
2. Standardise CTA metadata using `cta_location`, `cta_intent`, and `page_type`.
3. Persist safe quote-scope fields through the server-side quote save path after submission.
4. Add admin-only close outcome fields so SEO and quote quality can be measured against real results.
5. Build dashboard views from aggregated fields, not raw customer notes or uploaded files.

## Remaining Weak Points

- Follow-up SMS/email is a playbook only until provider and consent setup are complete.
- Close-stage outcomes are not yet stored as structured CRM events.
- Product pricing and catalogue admin remain split between local files, Supabase compatibility tables, and future canonical tables.
- Thank-you lead stage is stored locally unless backend persistence is added.
- CTA metadata coverage is not yet fully audited across all SEO/product entry pages.
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

## Search Console Metrics Placeholder

When Search Console data is available, capture it manually or through an approved integration using stable page and cluster fields.

Suggested fields:

- date range
- query
- landing page
- cluster
- impressions
- clicks
- click-through rate
- average position
- device
- country
- notes or hypothesis

Initial clusters should match SEO strategy groups: quote intent, quote review, product, cost, measurement, maintenance/problem and local intent.

Do not add credentials, API integrations, scraping, backend writes or automated imports until explicitly approved.
