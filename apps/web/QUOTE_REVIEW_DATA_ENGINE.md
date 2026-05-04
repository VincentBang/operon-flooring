# Quote Review Data Engine

## Purpose

Quote Advisor is a scope intelligence layer. It does not calculate final prices, rank external quote totals, or expose Operon internal rates.

It captures how external flooring quotes are structured so Operon can understand common missing scope, customer concerns, and conversion patterns before users move into `quote.html`.

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

The customer-facing page says:

“Uploaded quotes are used to provide the review and improve quote clarity. Personal details are handled according to our privacy policy.”

Do not expose the internal market intelligence strategy publicly.
