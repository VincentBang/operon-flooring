# Quote Review Policy

Source-of-truth status: operating policy for quote review extraction, scope comparison, storage, and privacy controls.

## Quote Review Operating Policy

The quote review system is not document analysis software.
It is a structured flooring decision-confidence system.

The goal is not summarizing PDFs, showing AI intelligence, attacking competitors, or declaring quotes “good” or “bad”.

The goal is reducing uncertainty, increasing trust, increasing scope clarity, improving customer confidence, educating customers, guiding better flooring decisions, and collecting structured operational intelligence.

Quote review has four layers:

1. Extraction Layer
Extract visible competitor quote data from uploaded PDF/image/text.

2. Scope Analysis Layer
Identify what is clear, missing, unclear, or risky.

3. Operon Comparable Estimate Layer
Generate an Operon comparable estimate only when enough data exists and only through existing pricing logic.

4. Data Intelligence Layer
Store structured extracted data and comparison signals for future operational learning.

Quote review should not be a generic comment tool.
It should become a structured trust and data-capture asset.

Quote review must compare scope first, price second.

The customer experience should feel like a professional flooring consultant reviewing scope, pricing, risk, and installation clarity. It should not feel like OCR software, accounting software, a chatbot summary, or a procurement spreadsheet.

## Core Philosophy Rules

### 1. Scope First, Price Second

"Price comparison without scope comparison is unreliable.
The system must prioritize scope clarity before price interpretation."

### 2. Reduce Uncertainty, Not Increase Complexity

"The system must reduce uncertainty, not overwhelm customers with technical complexity."

### 3. Calm Advisory Tone

"The review experience should feel:
- calm
- professional
- operationally mature
- educational
- trustworthy

Avoid:
- aggressive sales language
- fear tactics
- AI hype
- competitor attacks
- exaggerated warnings
- manipulative copy"

### 4. AI Should Be Invisible

"AI is backend infrastructure, not the product identity.

The customer-facing experience should emphasize:
- clarity
- professionalism
- structured guidance
- flooring expertise
- scope understanding

not AI hype."

### 5. Do Not Simulate Certainty

"The system must never pretend certainty when scope information is incomplete.

Uncertainty should be communicated calmly and professionally."

### 6. Decision Guidance > AI Summary

"The goal of the review is not to summarize the document.
The goal is to help the customer make a clearer flooring decision."

### 7. Quote Review Is A Conversion Bridge

"Quote review should naturally transition customers toward:
- structured comparison
- clearer scope understanding
- Operon estimate generation
- site confirmation

without aggressive selling."

### 8. Structured Data Is The Moat

"The long-term value of quote review comes from structured operational intelligence:
- pricing patterns
- scope gaps
- suburb trends
- installation risks
- conversion behavior
- quote variance

not raw uploaded files."

### 9. Do Not Optimize For Cheapest Customers

"The system should attract customers who value:
- clarity
- professionalism
- scope confidence
- reduced surprises

not purely lowest-price shopping."

## Multi-Stage AI Processing Policy

Use GPT-4.1 mini through backend-only calls when AI processing is enabled.

Do not use one giant prompt.

Recommended stages:

1. OCR extraction
Convert uploaded PDF/image into readable text or structured text evidence. This stage extracts only.

2. Structured field extraction
Return strict JSON for supplier, product, category, thickness, quantity, unit price, GST, total, address/suburb, line items, visible scope, and visible exclusions.

3. Scope classification
Separate quote details into:
- known
- unclear
- missing
- inferred
- risky

4. Operon comparison mapping
Map the extracted quote into Operon comparison status using exact match, category match, or manual product required. Use existing pricing logic only.

5. Decision report generation
Generate a concise consultant-style review with scope confidence, price context, questions to clarify, and next action.

Benefits:

- lower hallucination risk
- lower token cost
- clearer confidence separation
- easier debugging
- stronger consultant-style output

## Consultant Report Structure

The customer-facing report should use these sections:

1. Executive Summary
- status
- extraction confidence
- comparison confidence
- key issue
- recommendation

2. Extracted Quote Details
- supplier
- product
- category
- thickness
- area
- unit price
- subtotal
- GST
- total
- visible scope
- address/suburb

3. Scope Confidence
- what is clear
- what is unclear
- what is missing

4. Why Quotes Can Differ
Explain floor preparation, underlay, acoustic requirements, trims, access, moisture, removal/disposal, warranty assumptions, and installation complexity.

5. Operon Comparable Estimate
Show only when comparison confidence is sufficient. Clearly label exact comparison, category-level estimate only, or site confirmation required.

6. Price Difference Interpretation
Explain differences through scope confidence, not competitor criticism.

7. Questions To Clarify
Use direct questions the customer can ask before accepting.

8. Next Step CTA
Route to structured Operon estimate, missing-scope confirmation, or product selection depending on comparison status.

Tone rules:

- calm
- professional
- practical
- educational
- no competitor attacks
- no AI hype
- no overclaimed certainty
- no giant tables

## Risk Scoring System

Quote review should use structured risk dimensions rather than declaring a quote good or bad.

Recommended dimensions:

- Pricing clarity risk
- Scope completeness risk
- Variation risk
- Installation risk
- Product certainty
- Comparison confidence

Each risk dimension should include a short “Why this matters” explanation. The explanation should educate without creating fear.

## Likely Variation Risk System

Highlight likely variation risks when they are missing, unclear, or subject to confirmation:

- floor levelling
- acoustic underlay
- apartment access
- trims/transitions
- moisture preparation
- removal and disposal
- stair detailing

Purpose:
Help customers understand hidden future costs without implying the other quote is wrong.

## Visual Comparison Rules

Prefer simple comparison blocks/cards.

Avoid massive spreadsheets.

Good structure:

Competitor Quote
- Supply: clear / unclear
- Install: clear / unclear
- Underlay: clear / unclear
- Prep: clear / unclear
- Trims: clear / unclear

Operon Estimate
- Supply: included or assumed when selected
- Install: included or assumed when selected
- Underlay assumptions: clearly shown
- Prep assumptions: clearly shown
- Trims: clearly shown or to confirm

## Human Escalation Rule

If comparison confidence is low, recommend manual clarification or site confirmation.

Suggested wording:
“This quote has low comparison confidence. Manual clarification may produce a more reliable comparison.”

## Quote Review Intelligence Loop

Quote review must evolve from one-time analysis into a learning system.

Track post-review outcomes where possible:

- did the customer request an Operon estimate?
- did the customer proceed with Operon?
- did the customer choose the competitor?
- final accepted price if known
- whether variations were added later
- whether missing scope became an issue
- whether customer returned after choosing or considering a competitor quote
- lost reason if known
- won reason if known

Purpose:
Outcome data is more valuable than raw quote uploads. It shows which quote gaps matter in real jobs, which review findings lead to better decisions, and which customers need manual clarification.

Rules:

- outcome tracking must not become customer pressure
- outcome tracking should be structured, not free-form notes only
- raw uploaded files are not the learning asset; structured outcome and scope data is the learning asset
- won/lost reasons should be practical, such as scope clarity, timing, product preference, price confidence, site complexity, or customer not ready

## Variation Prediction Engine

Quote review should identify likely future variation risks before the customer compares totals.

Common variation risks:

- floor levelling
- acoustic underlay
- removal/disposal
- trims/transitions
- stairs
- moisture preparation
- apartment access
- parking/lift restrictions
- unclear product range
- warranty ambiguity

Customer-facing language:
“Potential variation risk if not confirmed.”

Do not say the competitor will charge variations.
Do not imply bad faith.
Do not create fear.

## Installation Quality Risk Engine

The review should assess whether the quote gives enough evidence of installation quality control.

Quality risk signals:

- no floor preparation detail
- no moisture check
- no underlay/acoustic detail
- no trim/scotia/skirting detail
- no warranty
- unclear installation method
- unclear exclusions
- unclear access/site assumptions

Customer-facing language:
“This quote does not clearly show how these installation details are handled.”

The system should explain the practical consequence only when useful. For example, missing floor preparation detail can affect final price and installation finish. Keep the tone calm and non-accusatory.

## Operon Scope Standard

The Operon Scope Standard is a foundational operational framework that helps customers compare flooring quotes based on scope clarity, not price alone.

It is the internal completeness standard for evaluating flooring quote clarity.

A properly structured flooring quote should clarify:

1. Product Definition
- product type
- brand/range/colour where available
- thickness
- plank dimensions if relevant
- warranty where available

2. Area and Measurement
- measured area
- chargeable area if different
- wastage assumptions
- room count
- stairs if applicable

3. Installation Scope
- supply only vs supply and install
- installation method
- underlay/acoustic layer
- moisture barrier if relevant
- furniture handling

4. Site and Access
- house/apartment
- level
- lift access
- parking/loading
- stairs
- occupied/vacant property
- strata restrictions

5. Risk and Preparation
- subfloor condition
- levelling
- moisture
- removal/disposal
- existing flooring
- unknown site risks

6. Finishing and Accessories
- trims
- scotia
- skirting
- stair nosing
- door trimming
- transition trims

7. Commercial Clarity
- GST status
- subtotal
- total
- payment terms
- quote validity
- variation conditions

8. Quality Signals
- floor prep awareness
- expansion gaps
- moisture checks
- acoustic compliance
- transition detail
- manufacturer compliance

9. Exclusions and Assumptions
- what is excluded
- what is assumed
- what needs confirmation
- what may trigger variations

10. Final Site Confirmation
- measurements
- access
- subfloor
- moisture
- preparation
- stairs
- trims
- risk conditions

Use this standard to compare quote completeness.
Do not use it to claim competitors are wrong.

Quote review must use the Scope Standard to classify:

- product clarity
- area clarity
- installation clarity
- site/access clarity
- prep/risk clarity
- finishing clarity
- commercial clarity
- exclusion clarity
- final confirmation requirement

Scope confidence labels:

- High scope definition
- Medium scope definition
- Low scope definition

The review should never compare price without first assessing scope definition.

## Job Definition Completeness Score

Quote review should classify how well the job is defined.

Preferred customer-facing labels:

- High definition
- Medium definition
- Low definition

Alternative label:

- Scope definition confidence: High / Medium / Low

Avoid raw percentages in customer UI unless the interface supports them cleanly.

Completeness factors:

- product clarity
- area clarity
- price clarity
- scope clarity
- site risk clarity
- warranty/exclusion clarity

Low definition does not mean the quote is bad. It means the customer should confirm more details before comparing price.

## Customer Decision State

Where possible, infer or ask for the customer’s decision state:

- researching
- comparing prices
- worried about hidden costs
- apartment compliance concern
- quality-focused
- budget-sensitive
- urgent replacement
- overwhelmed/confused
- already has preferred contractor

Use decision state to adjust tone and next-step guidance.

Rules:

- do not manipulate the customer
- do not push aggressive selling
- use the decision state to make advice more relevant
- keep the review focused on clarity, scope, and next action

## Next Best Action Engine

Quote review must recommend one calm next step.

Allowed next actions:

- Confirm missing scope before comparing price
- Choose closest Operon product for comparison
- Build structured Operon estimate
- Request site confirmation
- Ask contractor to confirm inclusions in writing
- Manual review recommended

Avoid aggressive CTAs.
Avoid multiple competing next steps in the executive summary.

The next action should be selected from the current confidence state:

- high extraction + medium comparison: build structured estimate or confirm missing scope
- high extraction + low scope confidence: confirm missing scope first
- low extraction confidence: manual review recommended
- product unmatched: choose closest Operon product
- high site risk: request site confirmation

## Customer Follow-Up Intelligence

If customer contact details are provided, future follow-up should be based on the review context.

Examples:

- missing acoustic underlay -> send apartment/acoustic guide
- missing prep -> send floor preparation explanation
- product unclear -> send hybrid/laminate/engineered comparison
- quote is scope-thin -> send quote checklist
- stairs unclear -> send stair-detail clarification prompt
- apartment access unclear -> send access/lift/parking clarification prompt

Purpose:
Follow-up should educate and build trust, not spam.

Rules:

- follow-up must match the customer’s actual review context
- do not send generic marketing if a practical clarification is better
- do not use urgency or discount pressure
- respect consent and opt-out requirements

## Competitor Intelligence Normalization

Long-term structured data should help identify market patterns:

- common missing scope items
- common product categories
- common unit price bands
- suburb pricing patterns
- under-scoped quote patterns
- frequent exclusions
- common competitor wording

Do not display sensitive competitor intelligence publicly.
Use normalized, anonymized, or aggregated insights internally for pricing, positioning, and quote intelligence.

## Confidence Visualization

Separate confidence types:

- Extraction confidence
- Scope confidence
- Comparison confidence
- Product match confidence
- Price confidence
- Site risk confidence

Never show one generic confidence score if the underlying confidence differs.

Example:

- Extraction confidence: High
- Scope confidence: Low
- Comparison confidence: Medium

Confidence must help the customer understand what can be trusted and what still needs confirmation.

## Price Positioning Intelligence

Future-only backlog item:
Only when enough structured historical data exists, classify competitor quote position:

- unusually low
- market-normal
- premium-positioned
- not enough data

Do not implement this classification until enough structured quote data exists.
Do not present it as a judgment of the competitor.
Use it internally first, then customer-facing only if the language remains calm, qualified, and scope-first.

## Quote Review Success Metrics

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

## AI Cost Optimization

Use:

1. deterministic extraction first
2. structured parsing second
3. GPT reasoning third

Do not use GPT for tasks solvable deterministically.

## Quote Review Data Governance Principles

- Private storage by default
- Backend-only AI processing
- Minimal data retention
- Structured extraction over raw storage
- API key isolation
- Optional file auto-deletion
- Customer transparency

Implementation rules:

1. Uploaded quote files must use private storage only.
2. OpenAI/OCR/API keys must never be exposed in frontend code.
3. Browser should call Operon backend/Edge Function, not OpenAI directly.
4. Raw uploaded PDF/image files should be temporary evidence, not permanent intelligence.
5. Store structured extracted fields long-term.
6. Store raw files only temporarily unless customer/business policy explicitly requires longer retention.
7. Recommended raw file retention: 7–30 days.
8. Recommended OCR text retention: 30–90 days.
9. Structured quote data may be retained long-term.
10. Personal information should be minimized or redacted where practical.
11. Customer-facing privacy copy must be clear that uploaded quotes may be processed to extract flooring scope and pricing details.
12. Do not store more customer data than needed for quote review, follow-up, or operational analysis.

## Structured Quote Review Data Model

After extraction and review, save structured data in a dedicated quote review record.

Minimum recommended record:

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

Extend the model if safe with:

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

## Raw File vs Structured Intelligence Rule

Raw uploaded files are temporary evidence.
Structured extracted data is the permanent intelligence layer.

Default retention:

- raw uploaded files: 7–30 days
- OCR text: 30–90 days
- structured extracted data: long term
- anonymized competitor price/scope signals: long term

Do not keep raw customer documents forever unless there is a clear operational, legal, or customer-support reason.

## Operon Comparable Estimate Rule

After OCR/API extraction, if enough fields are available, the system should map the competitor quote to Operon’s quote system and generate a structured comparable estimate using Operon’s existing pricing logic.

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

Product matching rules:

1. Exact match:
If exact brand/range exists in Operon database, use exact product comparison.

2. Category match:
If only product category exists, use category-level comparison.
Example:
Hybrid 7mm -> hybrid category, 7mm thickness, exact range unknown.

3. Manual product required:
If product cannot be matched, do not generate direct estimate.
Ask customer to select closest Operon product/category.

Pricing rule:
Use existing quote/pricing logic only.
Do not duplicate or fork pricing logic inside quote review.

## Comparison Status Rules

Use these statuses:

1. OPERON_COMPARABLE_READY
Use when:
- product/category known
- area known
- scope reasonably clear

2. OPERON_CATEGORY_ESTIMATE_ONLY
Use when:
- product category known
- exact brand/range missing
- area known

3. OPERON_SCOPE_TOO_UNCLEAR
Use when:
- competitor quote has price but major scope is missing

4. OPERON_PRODUCT_MATCH_REQUIRED
Use when:
- product cannot be matched

5. OPERON_SITE_CONFIRMATION_REQUIRED
Use when:
- site, subfloor, stairs, removal, apartment, or other scope risks materially change what needs review

Also preserve customer-facing review statuses where useful:

- READY_TO_COMPARE
- COMPARABLE_WITH_CAUTION
- NOT_READY_SCOPE_MISSING
- NOT_READY_EXTRACTION_FAILED

For the example:
Hybrid 7mm, 73m2, $48/m2 ex GST, $3,854.40 inc GST, supply and install only

Expected:

- extraction_confidence: high
- comparison_confidence: medium or low
- comparison_status: comparable_with_caution
- Operon comparison: category-level estimate only unless exact product/range is known

## Price Difference Band Rules

Calculate difference between competitor quote and Operon estimate when comparable.

Band 1:
Operon within 0–10% higher
Message:
“Operon is close to this quote. Compare inclusions carefully.”

Band 2:
Operon 10–20% higher
Message:
“Operon estimate is higher, but includes clearer assumptions and scope protection. Check whether the competitor quote includes the same items.”

Band 3:
Operon 20%+ higher
Message:
“Operon estimate is materially higher. Do not compare price alone. The competitor quote may be under-scoped, or Operon’s assumptions may include items not listed. Confirm inclusions before deciding.”

Band 4:
Operon lower
Message:
“Operon estimate is lower based on current extracted information, but final site details still need confirmation.”

Important:
Do not hide Operon estimate simply because it is higher.
Explain the price difference through scope confidence.

## Quote Review Display Rules

Quote review UI should show:

1. Competitor Quote Extracted
- supplier
- product
- area
- unit price
- total
- visible scope

2. Operon Comparable Estimate
- product/category used
- area used
- estimate total
- GST status
- assumptions
- comparison level: exact / product / category

3. Price Difference
- competitor total
- Operon estimate
- difference $
- difference %
- comparison status

4. Scope Gap Analysis
Missing or unclear:
- underlay/acoustic layer
- removal/disposal
- floor prep/levelling
- trims/scotia/skirting
- stairs
- door trimming
- moisture testing
- access/lift/parking
- warranty
- exclusions

5. Decision Guidance
Use:
- “If both quotes include the same scope, compare price.”
- “If scope is different, the cheaper quote may not be cheaper after variations.”
- “Ask the contractor to confirm missing items in writing.”

6. CTA
If comparable:
“Build a structured Operon quote from this review”

If scope unclear:
“Confirm missing scope before comparing price”

If product unmatched:
“Choose closest Operon product to compare”

## Customer Transparency Copy

Suggested copy:
“Uploaded quotes are used to extract flooring scope and pricing details for review. Files are processed securely and may be stored temporarily to support the review. Structured quote details may be retained to improve Operon’s quoting system.”

Keep it short.
Do not make it scary.
Do not overpromise.
Do not say files are deleted immediately unless implemented.
