# Project Memory

Source-of-truth status: active project memory for current business direction, page roles, and operating priorities.

## Business

- Sydney flooring quote and measurement website
- lead generation focus for laminate, hybrid, and engineered timber flooring
- long-term direction: trade-focused quoting, measurement, pricing, SEO, and margin operating system

## Positioning

- Headline: `Get a Flooring Quote in Minutes`
- Supporting message: `Estimate your laminate, hybrid or engineered timber flooring cost. Enter your area, measure room by room, or upload a floor plan.`
- Trust message: `Final quote confirmed before work starts.`

## Structure

- Homepage = conversion
- Floorplan = measurement assistant
- Product pages = SEO + product selection
- Suburb pages = local ranking support
- Blog = authority and internal-link support
- Quote form = pricing engine + lead capture
- Supabase / analytics = tracking layer
- Agents = execution layer

## Deployment Workflow

- `main` = production
- `dev` = development
- workflow = `dev -> test preview -> merge -> main -> deploy`
- never push development work directly to production

## Pricing Logic

- `real_area` = actual measured flooring area
- standard wastage = `10%`
- herringbone / chevron wastage = `20%`
- `chargeable_area = real_area × wastage_factor`
- material supply uses `chargeable_area`
- installation labour uses `real_area`
- skirting and scotia use `chargeable_area` allowance, not perimeter
- customer-facing quotes must not expose internal rates or multipliers
- central pricing runtime now lives in:
  - `apps/web/products.js`
  - `apps/web/installRates.js`
  - `apps/web/underlay.js`
  - `apps/web/skirtingScotia.js`
  - `apps/web/removalRates.js`
  - `apps/web/locationZones.js`
  - `apps/web/pricingRules.js`
  - `apps/web/quoteCalculator.js`
- quote pages should read those central files instead of embedding rate cards inside HTML
- floorplan returns `real_area` only; wastage must be applied in `quoteCalculator.js`
- product selection is stored by `operon_selected_product_id` with category fallback in localStorage
- optional Google Sheets pricing source scaffold now exists:
  - `apps/web/pricingSourceConfig.js`
  - `apps/web/pricingSource.js`
- pricing can stay local or be switched to published Google Sheets without removing the local fallback

## SEO System

- homepage is conversion-first with SEO content below the quote tool
- internal linking network supports product, suburb, cost, and blog pages
- priority suburb pages: Parramatta, Liverpool, Auburn, Blacktown, Miranda
- content should stay practical, trade-informed, and free of generic filler

## Analytics System

- GA4-ready tracking exists in the frontend
- localStorage + optional Supabase funnel tracking exists
- quote-to-revenue admin scaffold exists
- SEO, backlink, and ranking tracker scaffolds exist
- task queue exists for multi-step execution runs

## Product Catalogue System

- product data now stored centrally in `apps/web/products.js`
- central catalogue page now lives at `apps/web/products.html`
- product pages can show brand, range, colour, and price
- customer can select product from product page
- selected product feeds the quote engine
- laminate, hybrid, and engineered use the same system
- current products are placeholders until supplier data is confirmed

## Supabase Pricing Privacy

- private pricing schema now exists in `supabase/pricing_schema.sql`
- Supabase is now the preferred long-term source of truth for prices and rate tables
- Google Sheets may still be useful for drafting, but public sheet reads are not preferred for private pricing
- current frontend still has local JS fallback until server-side quote calculation is connected
- private server-side quote runtime now exists in:
  - `netlify/functions/_supabasePricing.js`
  - `netlify/functions/calculate-private-quote.js`
- rollout notes now live in:
  - `apps/web/OPERON_SUPABASE_PRICING_SETUP.md`
  - `apps/web/OPERON_PRIVATE_QUOTE_RUNTIME_PLAN.md`
- homepage quote wizard now tries the private Netlify quote runtime first and falls back to the local calculator if the runtime is unavailable
- customer-facing catalogue pricing now has a Netlify-backed Supabase source for:
  - `categoryMeta`
  - `products`
- this keeps product sell prices updateable in Supabase without exposing private install-rate tables in the browser

## Floor Care & Maintenance Content Pillar

- pillar page planned and created
- first five maintenance and problem guides created
- remaining blog topics defined in a central strategy file
- internal linking strategy added
- maintenance content supports SEO, trust, and quote conversion

## HRT ETF 7.0mm Hybrid Product Range

- added HRT Timber Flooring ETF 7.0mm Hybrid Waterproof Flooring to the product catalogue
- colours stored centrally in `apps/web/products.js`
- product cards displayed on `apps/web/hybrid-flooring-sydney.html`
- selecting a colour saves the product to localStorage and connects back to the quote form
- `pricePerM2` stays editable in the central product data file

## Completed

- homepage redesign
- floorplan tool
- SEO structure setup
- product catalogue integration
- agent system memory
- local tracking scaffold
- dashboard scaffold
- analytics schema scaffold
- revenue admin scaffold
- backlink and ranking tracker scaffold
- task queue execution mode upgrade

## Next Priorities

- replace placeholder catalogue rows with confirmed supplier data
- align sitemap and internal linking with all active SEO pages
- deepen suburb pages before expanding into more suburbs
- validate analytics and revenue loop on live traffic
- validate the new central pricing engine on live quote scenarios and connect underlay UI when ready
- continue backlinks only after on-site structure is clean

## Analytics Rollout Order

Implement analytics and operating-system work in this order:

1. `tracking.js`
2. Supabase analytics schema
3. quote funnel events
4. revenue admin page
5. dashboard
6. task queue
7. SEO tracker
8. backlink tracker
9. blog generator

Reason:

- this reduces fragile code
- keeps each layer testable
- prioritises traffic -> quote -> job -> margin -> next action

## Last Iteration

- Task completed: created a central flooring catalogue page and moved the category pages to a featured-products model
- Changes made: added `products.html`, wired it to `products.js`, added category and attribute filters, added product selection and quote CTAs, updated the category landing pages to show featured products only, and linked the homepage plus sitemap to the new central catalogue
- Next improvement idea: add confirmed supplier prices to more product rows, then expand the catalogue filters with richer product metadata where real ranges support it

## Central Pricing Foundation

- quote calculation has been moved behind `apps/web/quoteCalculator.js`
- install rates, underlay, skirting/scotia, removal, suburb zones, and pricing rules now live in separate central JS files
- quote wizard uses the central calculator instead of embedded rate tables
- selected products are resolved from central product data before pricing
- suburb zone matching now uses a central location zone library with a default Sydney fallback
- customer output stays bundled and avoids exposing raw labour/material rates

## Execution Queue

- `continue execution` now means:
  - generate top 10 tasks
  - save queue
  - complete top 3 tasks unless blocked
- queue file:
  - `apps/web/task_queue.json`

## TODO / NEXT_ACTIONS

- confirm real product ranges, colours, and supplier pricing in `products.js`
- run `supabase/pricing_schema.sql` and verify private pricing tables in Supabase
- set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Netlify for the private quote function
- wire `index.html` to the private quote function with local calculator fallback
- keep `sitemap.xml` aligned with the active SEO page set
- keep Quick Room Mode hidden from customer UI until reliable
- keep visualiser hidden and out of customer-facing navigation
