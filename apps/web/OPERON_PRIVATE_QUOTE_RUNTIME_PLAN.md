# Operon Private Quote Runtime Plan

Source-of-truth status: staged plan for moving quote calculation off the browser and onto private Supabase-backed server logic.

## Why This Exists

Private pricing is not truly private if the browser can read:

- sell prices
- install rates
- suburb adjustments
- quote rules

That is why the correct next step after private Supabase tables is a server-side quote path.

## Current State

Current frontend:

- still has local JS fallback pricing
- keeps the quote tool working
- is useful while the private runtime is being connected

New server function:

- `netlify/functions/calculate-private-quote.js`
- reads pricing from Supabase using server credentials
- returns customer-safe quote output only

Helper:

- `netlify/functions/_supabasePricing.js`

## Required Netlify Environment Variables

Add these in Netlify:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not expose the service role key in frontend code.

## Runtime Flow

1. customer enters quote inputs
2. frontend sends request to:
   - `/.netlify/functions/calculate-private-quote`
3. Netlify function reads private Supabase pricing tables
4. function calculates quote
5. browser receives only customer-safe totals and line items

## What Still Needs Wiring

1. update the quote page to call the Netlify function
2. keep the current local calculator as fallback during rollout
3. once stable, reduce or remove browser-held private pricing data

## Recommended Rollout

### Phase 1

- run `supabase/pricing_schema.sql`
- set Netlify env vars
- deploy the function
- test the function directly

### Phase 2

- wire quote preview calls to the private function
- keep local fallback

### Phase 3

- switch customer quote totals fully to private runtime
- remove unnecessary browser exposure of private pricing

## Important Boundary

Product catalogue text and public product metadata may still remain in frontend code if you want.

Private commercial pricing should move behind the function.
