# Operon Pricing Optimisation Layer

Updated: 2026-05-05

Purpose: use historical quote and outcome data to guide intelligent price ranges while keeping `quoteCalculator.js` as the base pricing authority.

## Safety Rule

`quoteCalculator.js` remains unchanged. The optimisation layer runs after the base estimate is calculated.

The layer may:

- show a customer-friendly price range
- store outcome data
- aggregate bucket metrics
- recommend target bands internally

The layer must not:

- expose internal rates, margins, installer costs, or surcharge formulas
- automatically cut margin
- silently rewrite calculator logic
- replace final site confirmation

## Data Schema

Migration:

- `supabase/migrations/20260505_pricing_optimization_layer.sql`

Tables:

- `quote_pricing_outcomes`
- `pricing_optimization_buckets`

Captured inputs:

- `suburb`
- `postcode`
- `suburb_cluster`
- `flooring_type`
- `area_band`
- `stairs_flag`
- `extras_flags`

Captured outputs:

- `quote_total`
- `breakdown_totals`
- `confidence_level`

Captured outcomes:

- `close_status`: `won`, `lost`, `no_response`
- `final_price`
- `close_time_hours`
- `lost_reason`

## Bucket Model

Primary bucket:

```text
(suburb_cluster, flooring_type, area_band, stairs_flag)
```

Area bands:

- `small`: under 30 m2
- `medium`: 30-69 m2
- `large`: 70-119 m2
- `xlarge`: 120 m2+

## Aggregation Logic

Function:

- `supabase/functions/calculate-pricing-optimization/index.ts`

Metrics per bucket:

- `win_rate`
- `avg_price`
- `median_price`
- `p25`
- `p40`
- `p50`
- `p65`
- `p75`
- `avg_winning_price`
- `median_winning_price`

Target band:

```text
target_range = [p40, p65]
target_price = median_winning_price
```

Fallback:

- If not enough won data exists, `target_price` falls back to bucket median price.
- Bucket confidence is `low` under 10 samples, `medium` from 10-29 samples, and `high` from 30+ samples.

## Adjustment Rules

File:

- `apps/web/pricingAdjustment.js`

Rules:

- Market fit: if base estimate is above historical `p75`, reduce the displayed target slightly.
- Market fit: if base estimate is below historical `p25`, increase the displayed target slightly.
- Confidence: low confidence creates a wider range; high confidence creates a tighter range.
- Complexity: stairs, prep, access, warnings, or manual review create a modest upward bias.

Important:

- These are display-range rules only.
- The base estimate is preserved and stored.
- Final pricing remains confirmed after scope/site review.

## UI Changes

`quote.html` now loads:

- `pricingAdjustment.js`

The summary step can display:

- price range
- base estimate note
- confidence indicator

Example:

```text
$6,420 - $7,180
Base estimate $6,790 · medium confidence range
```

If measurement is unknown:

- no price range is shown
- estimate remains pending measurement

## Runtime Integration

Netlify lookup function:

- `netlify/functions/pricing-optimization-insight.js`

Supabase functions:

- `calculate-pricing-optimization`
- `record-pricing-outcome`

Flow:

1. User completes quote.
2. `quoteCalculator.js` calculates base estimate.
3. `pricingAdjustment.js` applies a post-calculation range.
4. Netlify optionally fetches the historical bucket.
5. UI shows range and confidence.
6. Outcome is later recorded as won/lost/no_response.
7. Aggregation refreshes bucket metrics.

## Example Scenarios

### Above Market Band

Input:

- hybrid
- medium area
- no stairs
- base estimate above bucket `p75`

Result:

- display target is reduced slightly
- range remains close to base estimate
- no internal margin data is exposed

### Below Market Band

Input:

- laminate
- small area
- simple access
- base estimate below bucket `p25`

Result:

- display target is increased slightly
- protects against underpricing and margin erosion

### Low Confidence

Input:

- measurement unknown or rough
- unclear extras

Result:

- range is wider
- final confirmation language remains visible

### Complex Scope

Input:

- stairs or floor prep
- difficult access

Result:

- upward bias applied to range
- customer sees realistic uncertainty rather than a fake precise price

## Risks

- Early sample sizes may be too small, so bucket confidence starts low.
- Bad outcome labelling can teach the wrong signal.
- If final-price data is missing, winning-price targets are less reliable.
- Range display can reduce precision anxiety but must not feel vague.
- Live deployment requires migration/function rollout before relying on historical buckets.
