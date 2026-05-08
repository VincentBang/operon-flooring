# Quote Review Data Engine

## Purpose

Quote Advisor is a scope intelligence layer. It does not calculate final prices, rank external quote totals, or expose Operon internal rates.

It captures how external flooring quotes are structured so Operon can understand common missing scope, customer concerns, and conversion patterns before users move into `quote.html`.

## Operating Position

The quote review system is not document analysis software.
It is a structured flooring decision-confidence system.

Quote review must compare scope first, price second.

Raw uploaded files are temporary evidence.
Structured extracted data is the long-term intelligence asset.

Quote review has four layers:

1. Extraction Layer
2. Scope Analysis Layer
3. Operon Comparable Estimate Layer
4. Data Intelligence Layer

The review should not behave like a generic comment widget. It should extract visible data, explain missing scope, generate an Operon comparable estimate only when safe, and retain structured intelligence without depending on long-term raw-file storage.

The system should reduce uncertainty, not increase technical complexity.
AI should be invisible to the customer; it is backend infrastructure, not the product identity.

## GPT-4.1 Mini Workflow

When AI is enabled, quote review uses GPT-4.1 mini through backend-only calls.

The workflow is staged:

1. OCR extraction
Reads uploaded PDF/image evidence and returns readable text or strict extraction JSON.

2. Structured field extraction
Extracts supplier, document type, product, category, thickness, quantity, unit price, GST, total, address/suburb, line items, visible scope and visible exclusions.

3. Scope classification
Separates extracted information into known, unclear, missing, inferred and risky.

4. Operon comparison mapping
Maps the quote into exact match, category-level comparison, manual product required, scope too unclear, or site confirmation required.

5. Decision report
Creates a consultant-style review focused on scope clarity, price context, risk, questions to ask and next action.

Rule:
Do not collapse these into one large prompt. Staged processing keeps confidence control clearer and makes failures easier to debug.

## Decision Report Requirements

The final report must feel like a professional flooring consultant review.

Required report sections:

- Executive Summary
- Extracted Quote Details
- Scope Confidence
- Why Quotes Can Differ
- Operon Comparable Estimate
- Price Difference Interpretation
- Questions To Clarify
- Next Step CTA

Output tone:

- concise
- calm
- educational
- scope-first
- no competitor attack language
- no AI hype language
- no fixed-price certainty when site or scope details are missing

## Data Governance

Private storage by default applies to all uploaded quote files.

Implementation rules:

- uploaded files must stay private
- OCR/API keys stay backend-only
- browser uploads go to Operon backend functions, never directly to AI providers
- raw uploaded PDF/image files are temporary evidence, not the permanent intelligence layer
- structured extracted data is the preferred long-term record
- raw files should only be retained temporarily unless a stronger operational or legal reason exists
- recommended raw file retention: 7–30 days
- recommended OCR text retention: 30–90 days
- structured quote-review data may be retained long-term
- personal information should be minimized or redacted where practical
- customer-facing privacy copy should explain that uploaded quotes may be processed to extract flooring scope and pricing details
- do not store more customer data than needed for quote review, follow-up, or operational analysis

## Data Collected

The frontend builds a `quoteReviewPayload` and saves it locally as:

- `latestQuoteReview`
- `operon-quote-intelligence-v1`

Payload fields:

- `review_mode`: `quick` or `detailed`
- `customer_name`, `phone`, `email`: optional detailed mode contact fields
- `suburb`, `postcode`: optional location context
- `flooring_type`
- `area_m2`
- `uploaded_quote_url`: future storage URL, currently `null`
- `uploaded_quote_reference`: local file name reference only
- `quote_total`: customer-entered external quote total for context only
- `quote_provider_name`: optional provider/company name
- `included_items`: selected scope items
- `missing_items`: non-pricing scope gaps
- `risk_items`: high/medium/low scope risks and consequences
- `clarity_score`: non-pricing scope completeness score from 0 to 100
- `risk_level`: `low`, `moderate`, `high`, or `not_assessed`
- `confidence_level`: `low`, `medium`, `high`, or `not_assessed`
- `advisor_summary`: rendered executive summary, risks, strengths, insight and decision guidance
- `recommended_next_step`: currently `quote.html`
- `next_step_taken`
- `converted_to_quote`
- `linked_quote_lead_id`: future link to `quote_leads`

Future outcome fields:

- `operon_estimate_requested`: whether the user moved from review into `quote.html`
- `site_confirmation_requested`: whether the user requested a site or scope confirmation
- `customer_decision_state`: researching, comparing prices, worried about hidden costs, apartment compliance concern, quality-focused, budget-sensitive, urgent replacement, overwhelmed/confused, or already has preferred contractor
- `won_lost_outcome`: won, lost, pending, no_response, or unknown
- `won_lost_reason`: scope clarity, timing, product preference, price confidence, site complexity, customer not ready, chose competitor, or unknown
- `variation_observed_later`: whether a missing or unclear item became a real variation later
- `returned_after_competitor`: whether the customer returned after considering or choosing another quote
- `followup_content_path`: quote checklist, floor preparation guide, acoustic/underlay guide, product comparison, stair clarification, access clarification, or none

Recommended record shape:

```json
{
  "quote_review_id": "...",
  "created_at": "...",
  "suburb": "Yagoona",
  "property_type": "house/apartment/unknown",
  "supplier_name": "redacted or normalized",
  "product_type": "hybrid",
  "thickness_mm": 7,
  "area_m2": 73,
  "unit_price_ex_gst": 48,
  "total_ex_gst": 3504,
  "total_inc_gst": 3854.40,
  "included_scope": ["supply", "install"],
  "missing_scope": ["underlay", "removal", "floor prep", "trims", "warranty"],
  "risk_dimensions": [
    {
      "key": "scope_completeness",
      "level": "high",
      "score": 42,
      "why_this_matters": "Missing scope makes the headline total less reliable."
    }
  ],
  "likely_variation_risks": ["floor prep", "underlay", "trims"],
  "comparison_status": "comparable_with_caution",
  "extraction_confidence": "high",
  "comparison_confidence": "medium"
}
```

Extended structure, when available:

```json
{
  "competitor_quote": {
    "supplier_name": "redacted or normalized",
    "document_type": "quote/invoice/estimate/unknown",
    "quote_or_invoice_number": "optional/redacted",
    "issue_date": "optional",
    "job_suburb": "optional",
    "job_address_redacted": "optional",
    "line_items": []
  },
  "operon_comparison": {
    "product_match_level": "exact/category/manual_required",
    "operon_estimate_available": true,
    "operon_estimate_ex_gst": null,
    "operon_estimate_inc_gst": null,
    "price_difference_amount": null,
    "price_difference_percent": null,
    "comparison_band": "within_10_percent/10_to_20_percent/over_20_percent/operon_lower/not_comparable",
    "comparison_confidence": "high/medium/low"
  },
  "privacy": {
    "raw_file_storage": "temporary/private/not_stored",
    "raw_file_delete_after_days": 30,
    "ocr_text_delete_after_days": 90,
    "personal_data_minimized": true
  },
  "user_next_action": "build_operon_quote/confirm_missing_scope/select_product/request_site_confirmation/no_action"
}
```

Future outcome extension:

```json
{
  "outcome_tracking": {
    "operon_estimate_requested": true,
    "site_confirmation_requested": false,
    "customer_decision_state": "comparing prices",
    "won_lost_outcome": "pending",
    "won_lost_reason": "unknown",
    "variation_observed_later": null,
    "returned_after_competitor": false,
    "followup_content_path": "quote checklist"
  }
}
```

## Why It Matters

The data identifies where real quotes are incomplete or unclear:

- product or range not specified
- installation method missing
- floor preparation excluded
- removal listed without disposal
- moisture protection not addressed
- access, lifts or parking omitted
- finishing items such as trims not listed

This improves future quote clarity without turning the site into a quote ranking tool.

## Scoring Logic

`clarity_score` is based only on scope completeness:

- product specified
- installation specified
- area specified
- removal specified
- disposal specified
- floor preparation specified
- access specified
- skirting/trims specified
- stairs specified
- moisture protection specified

No internal rates, margins or pricing rules are used.

## Risk Dimensions

Decision confidence should be expressed through structured dimensions:

- pricing clarity risk
- scope completeness risk
- variation risk
- installation risk
- product certainty
- comparison confidence

Each dimension should include:

- level: `low`, `moderate`, or `high`
- score: non-pricing confidence score
- why_this_matters: short customer education

Do not reduce review output to a good/bad quote label.

Confidence must be visualized separately:

- extraction confidence
- scope confidence
- comparison confidence
- product match confidence
- price confidence
- site risk confidence

Do not collapse these into one generic confidence score when the underlying data quality differs.

## Operon Scope Standard

Use Operon Scope Standard as the internal completeness model for quote review.

A well-defined flooring quote should clarify:

- product type
- brand/range/colour where possible
- thickness
- area
- material allowance/wastage assumptions
- supply/install split where relevant
- underlay/acoustic layer
- removal/disposal
- floor preparation/levelling
- trims/scotia/skirting
- stairs
- door trimming
- access/lift/parking
- moisture/subfloor checks
- warranty
- exclusions
- final site confirmation

This standard is used to judge quote completeness, not to attack competitors or declare a quote wrong.

## Job Definition Completeness

Quote review should produce a simple completeness label:

- High definition
- Medium definition
- Low definition

Factors:

- product clarity
- area clarity
- price clarity
- scope clarity
- site risk clarity
- warranty/exclusion clarity

Low definition means the quote needs clarification before price comparison. It does not mean the quote is bad.

## Likely Variation Risks

Quote review should flag likely variation risks when scope is unclear:

- floor levelling
- acoustic underlay
- apartment access
- trims/transitions
- moisture preparation
- removal/disposal
- stairs

The purpose is to help the customer ask better questions, not to attack another contractor.

Customer-facing phrasing:
“Potential variation risk if not confirmed.”

Do not say a competitor will charge variations.

## Installation Quality Risk

Quote review should assess whether the uploaded quote clearly explains installation quality control.

Quality risk signals:

- no floor preparation detail
- no moisture check
- no underlay/acoustic detail
- no trim/scotia/skirting detail
- no warranty
- unclear installation method
- unclear exclusions
- unclear access/site assumptions

Recommended wording:
“This quote does not clearly show how these installation details are handled.”

The system should explain the practical consequence only when it helps the customer make a better decision.

## Operon Comparable Estimate Layer

After OCR/API extraction, the system should map the competitor quote to Operon’s quote system and generate a structured comparable estimate only when enough data exists.

Required extracted fields:

- product type
- brand/range if available
- thickness if available
- area/quantity
- unit price if available
- total ex GST / inc GST if available
- scope description
- included items
- missing or unclear items

Matching rules:

1. Exact match
If exact brand/range exists in Operon data, use exact product comparison.

2. Category match
If only product category exists, use category-level comparison.

3. Manual product required
If product cannot be matched, do not generate a direct estimate. Ask the customer to choose the closest Operon product/category first.

Pricing rule:
Use existing Operon pricing logic only. Do not duplicate or fork pricing logic inside quote review.

## Comparison Statuses

Internal comparison statuses:

- `OPERON_COMPARABLE_READY`
- `OPERON_CATEGORY_ESTIMATE_ONLY`
- `OPERON_SCOPE_TOO_UNCLEAR`
- `OPERON_PRODUCT_MATCH_REQUIRED`
- `OPERON_SITE_CONFIRMATION_REQUIRED`

Customer-facing review statuses may still use:

- `READY_TO_COMPARE`
- `COMPARABLE_WITH_CAUTION`
- `NOT_READY_SCOPE_MISSING`
- `NOT_READY_EXTRACTION_FAILED`

Example expectation:

Hybrid 7mm, 73m², $48/m² ex GST, $3,854.40 inc GST, supply and install only

- extraction confidence: high
- comparison confidence: medium or low
- customer-facing status: `COMPARABLE_WITH_CAUTION`
- Operon comparison mode: category-level estimate only unless exact brand/range is known

## Price Difference Bands

When Operon estimate and competitor total are comparable, classify the difference:

1. Operon within 0–10% higher
“Operon is close to this quote. Compare inclusions carefully.”

2. Operon 10–20% higher
“Operon estimate is higher, but includes clearer assumptions and scope protection. Check whether the competitor quote includes the same items.”

3. Operon 20%+ higher
“Operon estimate is materially higher. Do not compare price alone. The competitor quote may be under-scoped, or Operon’s assumptions may include items not listed. Confirm inclusions before deciding.”

4. Operon lower
“Operon estimate is lower based on current extracted information, but final site details still need confirmation.”

Do not hide the Operon estimate simply because it is higher. Explain price difference through scope confidence and comparison confidence.

## Quote Review Intelligence Loop

Quote review data should support outcome learning.

Track where possible:

- whether the customer requested an Operon estimate
- whether the customer proceeded with Operon
- whether the customer chose the competitor
- final accepted price if known
- whether variations were added later
- whether missing scope became an issue
- whether the customer returned after a competitor quote
- lost reason if known
- won reason if known

Outcome data is more valuable than raw uploads because it connects quote clarity to real customer decisions.

## Customer Decision State

Where possible, infer or capture the customer’s decision state:

- researching
- comparing prices
- worried about hidden costs
- apartment compliance concern
- quality-focused
- budget-sensitive
- urgent replacement
- overwhelmed/confused
- already has preferred contractor

Use this context to adjust the review tone and next step.
Do not manipulate the customer or use pressure tactics.

## Next Best Action Engine

Every completed review should recommend one calm next step.

Allowed next actions:

- confirm missing scope before comparing price
- choose closest Operon product for comparison
- build structured Operon estimate
- request site confirmation
- ask contractor to confirm inclusions in writing
- manual review recommended

Selection logic:

- high extraction confidence + low scope confidence -> confirm missing scope first
- product unmatched -> choose closest Operon product
- high site risk -> request site confirmation
- low extraction confidence -> manual review recommended
- adequate comparison confidence -> build structured Operon estimate

## Customer Follow-Up Intelligence

Future follow-up should be context-aware:

- missing acoustic underlay -> apartment/acoustic guide
- missing prep -> floor preparation explanation
- unclear product -> hybrid/laminate/engineered comparison
- scope-thin quote -> quote checklist
- unclear stairs -> stair detail clarification
- apartment access unclear -> access/lift/parking clarification

Follow-up should educate and build trust.
It should not spam, pressure, or discount-sell.

## Competitor Intelligence Normalization

Long-term structured data should identify market patterns:

- common missing scope items
- common product categories
- common unit price bands
- suburb pricing patterns
- under-scoped quote patterns
- frequent exclusions
- common competitor wording

Do not display sensitive competitor intelligence publicly.
Use normalized or aggregated intelligence internally for pricing, positioning, and quote-quality improvement.

## Future Price Positioning Intelligence

Future-only:
When enough structured historical data exists, classify external quote position:

- unusually low
- market-normal
- premium-positioned
- not enough data

Do not implement or show this until there is enough data to support it.
Scope confidence must remain more important than price positioning.

## Success Metrics

Track:

- quote uploads
- successful extraction rate
- review completion rate
- Operon estimate generated rate
- quote review to quote start conversion
- quote review to site confirmation conversion
- missing scope frequency
- product match frequency
- manual review requests
- customer follow-up engagement
- won/lost outcome where known

North star:
Quote reviews that create clearer customer decisions and useful structured operational intelligence.

## Outcome Learning Loop

Outcome data should close the loop between quote-review findings and real business results.

Useful questions:

- Which missing scope items most often lead to manual review?
- Which review statuses most often lead to an Operon estimate?
- Which customers return after a competitor quote?
- Which missing items later become variations?
- Which follow-up education path improves reply quality?
- Which suburbs or property types create more low-definition quote reviews?

Do not expose this intelligence publicly.
Use it internally to improve quote review, follow-up, content prioritisation, and future workflow logic.

## Supabase Target

Migration:

`supabase/migrations/20260504_quote_review_data_engine.sql`

Target table:

`quote_reviews`

Security posture:

- RLS enabled
- no anonymous insert/select policies
- writes go through `netlify/functions/save-quote-review.js`
- service role key stays in Netlify environment variables only

Required environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Netlify Function

Function stub:

`netlify/functions/save-quote-review.js`

Behaviour:

- accepts `quoteReviewPayload`
- validates and normalises allowed fields
- inserts into `quote_reviews`
- returns `review_id`
- fails safely; user is never blocked from continuing to `quote.html`

## Future Intelligence

Once enough rows are stored, Operon can analyse:

- average external quote total by flooring type and suburb
- common missing scope by contractor quote
- quote completeness score trends
- conversion rate by risk level
- most common scope gaps
- suburb-level quote variation
- competitor scope patterns

This should stay framed as quote clarity and scope intelligence, not quote ranking.

## Frontend Flow

1. User chooses Quick or Detailed mode.
2. User enters quote scope details.
3. Quote Advisor builds non-pricing risk output.
4. Payload saves to localStorage.
5. Clicking `Get structured estimate` marks `converted_to_quote = true`.
6. The browser attempts `/.netlify/functions/save-quote-review`.
7. User continues to `quote.html?source=quote_review` whether the server save succeeds or fails.

## Privacy Note

Customer-facing copy should stay short and clear:

“Uploaded quotes are used to extract flooring scope and pricing details for review. Files are processed securely and may be stored temporarily to support the review. Structured quote details may be retained to improve Operon’s quoting system.”

Do not expose the internal market intelligence strategy publicly.
