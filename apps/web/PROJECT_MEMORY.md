# Project Memory

Source-of-truth status: active project memory for current business direction, page roles, and operating priorities.

## Business

- Sydney flooring quote and measurement website
- lead generation focus for laminate, hybrid, and engineered timber flooring
- long-term direction: trade-focused quoting, measurement, pricing, SEO, and margin operating system

## Positioning

- Headline: `Professional Flooring Quotes for Sydney Homes`
- Supporting message: `Get a clearer laminate, hybrid, or engineered timber flooring estimate with area capture, product selection, and pricing built for real installation work.`
- Trust message: `Measured where needed. Priced clearly. Product and site details confirmed before installation starts.`

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
- workflow = `local -> optional dev preview -> optional merge -> main -> deploy`
- never push development work directly to production
- default execution rule = make changes locally first and validate locally; only push to GitHub / `dev` / `main` or trigger Netlify review when the user explicitly asks

## Pricing Logic

- `real_area` = actual measured flooring area
- standard wastage = `10%`
- herringbone / chevron wastage = `20%`
- `chargeable_area = real_area × wastage_factor`
- material supply uses `chargeable_area`
- installation labour uses `real_area`
- skirting and scotia use `chargeable_area` allowance, not perimeter
- laminate and hybrid are quoted as standard floating-floor installation only
- engineered timber standard planks can be quoted as floating or direct glue
- engineered herringbone and chevron are quoted as direct glue only
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
- task queue exists for multi-step execution runs and now stores a ranked 50-task unattended backlog

## Product Catalogue System

- product data now stored centrally in `apps/web/products.js`
- central catalogue page now lives at `apps/web/products.html`
- product pages can show brand, range, colour, and price
- customer can select product from product page
- selected product feeds the quote engine
- laminate, hybrid, and engineered use the same system
- only confirmed live catalogue products should be shown
- current live catalogue includes ETF Hybrid 7.0mm, 8.0mm, and 9.0mm ranges with supplier imagery

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
- first 12-guide maintenance cluster now published
- maintenance pillar now includes pets and checklist articles in addition to the original cleaning, water-damage, lifting and comparison guides
- internal linking strategy added
- maintenance content supports SEO, trust, and quote conversion

## HRT ETF 7.0mm Hybrid Product Range

- added HRT Timber Flooring ETF 7.0mm Hybrid Waterproof Flooring to the product catalogue
- colours stored centrally in `apps/web/products.js`
- product cards displayed on `apps/web/hybrid-flooring-sydney.html`
- selecting a colour saves the product to localStorage and connects back to the quote form
- `pricePerM2` stays editable in the central product data file

## HRT ETF 8.0mm and 9.0mm Hybrid Product Ranges

- added HRT Timber Flooring ETF 8.0mm Hybrid Flooring and ETF 9.0mm Hybrid Flooring to the central hybrid catalogue
- supplier main images and gallery images are stored locally in `apps/web/images/products/hybrid`
- new products follow the same localStorage selection flow as the 7.0mm range
- gallery images are mapped centrally in `apps/web/products.js` so product popups keep working without duplicating catalogue data elsewhere

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
- unattended agent loop upgraded to 50 ranked tasks with default / long / overnight run modes

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

- Task completed: executed an overnight unattended batch focused on explicit product-data state, safer floorplan-to-quote handoff, deeper suburb pages, and local QA audits for FAQs and internal links
- Tasks completed this run: `PROD-DATA-001`, `PROD-DATA-002`, `QUOTE-003`, `SEO-PROD-003`, `SUB-001`, `SUB-002`, `SUB-003`, `SUB-004`, `SUB-005`, `QA-002`
- Files changed this run: `apps/web/products.js`, `apps/web/products.html`, `apps/web/floorplan.html`, `apps/web/index.html`, `apps/web/parramatta-flooring.html`, `apps/web/liverpool-flooring.html`, `apps/web/auburn-flooring.html`, `apps/web/blacktown-flooring.html`, `apps/web/miranda-flooring.html`, `apps/web/OPERON_SEO_STRATEGY.md`, `apps/web/blog-keywords.json`, `apps/web/data/metrics.json`, `apps/web/task_queue.json`, `apps/web/PROJECT_MEMORY.md`
- Validation performed: `node --check apps/web/products.js`, inline-script parse checks for `apps/web/index.html`, `apps/web/products.html`, `apps/web/floorplan.html`, and the five suburb pages, FAQ schema-to-visible-question alignment checks for the laminate, hybrid, and engineered money pages, product-id/category consistency checks in `products.js`, `task_queue.json` JSON parse validation, targeted confirmation that the new floorplan handoff key exists in both quote pages, and a broken-link audit across the homepage, products page, money pages, suburb pages, and blog hub
- Known risks: the suburb and catalogue improvements are still locally validated only, so visual/mobile browser QA is still the main remaining gap before any future push or deploy; the quote runtime still depends on the Netlify environment for end-to-end submit verification; `OPERON_SEO_STRATEGY.md` had older suburb URL examples and is now partially corrected, but future internal SEO support files should still be watched for stale URL references
- Next best tasks: `BLOG-001`, `BLOG-002`, `BLOG-003`, `BLOG-004`, `BLOG-005`, `LEAD-003`, `LEAD-004`, then `SEO-INFRA-002`
- Blocked items: `OPERON_PLAN.md` and `OPERON_STATUS.md` were still not present in `apps/web`, so execution continued from `AGENTS.md`, `AGENT_LOOP.md`, `PROJECT_MEMORY.md`, pricing rules, SEO strategy, catalogue, and tracking files instead; deployed runtime / Supabase / Netlify checks still require explicit approval plus configured external environment variables before they can be validated end-to-end

## Central Pricing Foundation

- quote calculation has been moved behind `apps/web/quoteCalculator.js`
- install rates, underlay, skirting/scotia, removal, suburb zones, and pricing rules now live in separate central JS files
- quote wizard uses the central calculator instead of embedded rate tables
- selected products are resolved from central product data before pricing
- suburb zone matching now uses a central location zone library with a default Sydney fallback
- customer output stays bundled and avoids exposing raw labour/material rates

## Execution Queue

- `continue execution` now means:
  - read execution source-of-truth files first
  - generate and rank 50 tasks
  - save all 50 tasks into `apps/web/task_queue.json`
  - execute tasks in ranked order
  - complete up to 8 tasks unless blocked
- `continue execution long mode` now means:
  - complete up to 15 ranked tasks unless blocked
- `continue execution overnight` now means:
  - complete up to 25 ranked tasks unless blocked
- all queue items must include:
  - `id`
  - `title`
  - `category`
  - `assigned_agent`
  - `impact_score`
  - `confidence_score`
  - `effort_score`
  - `priority_score`
  - `dependencies`
  - `risk_level`
  - `files_likely_affected`
  - `validation_checklist`
  - `status`
  - `notes`
- queue file:
  - `apps/web/task_queue.json`
- future unattended run history format is documented in `AGENT_LOOP.md`
- run history is planning-only and must not trigger GitHub push, Netlify deploy, Supabase writes, or email sending by itself

## Latest Overnight Continuation

- Tasks completed this continuation: `BLOG-001`, `BLOG-002`, `BLOG-003`, `BLOG-004`, `BLOG-005`, `SEO-INFRA-003`, `ANALYTICS-004`, `SAAS-001`, `SAAS-002`, `SAAS-003`, `BACKLINK-001`, `BACKLINK-002`, `BACKLINK-003`, `LINK-002`
- Files changed this continuation: `apps/web/index.html`, `apps/web/dashboard.html`, `apps/web/agent-task-engine.js`, `apps/web/backlink-tracker.html`, `apps/web/OPERON_SEO_STRATEGY.md`, `apps/web/OPERON_SUPABASE_DATABASE_IMPLEMENTATION.md`, `apps/web/AGENT_LOOP.md`, `apps/web/PROJECT_MEMORY.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and the five priority suburb pages
- Validation performed: product scripts checked, agent task engine checked, inline scripts parsed with JSON-LD excluded, schema coverage audited, suburb internal links resolved, and `git diff --check` passed
- Known risk: `QA-003` remains pending because it requires browser-render mobile viewport review rather than static validation
- Current queue state after this continuation: 49 of 50 tasks done, 1 pending

## TODO / NEXT_ACTIONS

- future Supabase lead and queue sync contracts are documented in `OPERON_SUPABASE_DATABASE_IMPLEMENTATION.md`; they are planning-only and do not enable live writes
- confirm real product ranges, colours, and supplier pricing in `products.js`
- run `supabase/pricing_schema.sql` and verify private pricing tables in Supabase
- set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Netlify for the private quote function
- set `RESEND_API_KEY` and `OPERON_QUOTE_FROM_EMAIL` in Netlify if `Email quote` should be live
- keep the Netlify Forms quote-request path verified on live/branch deploys; simple localhost previews now save a local backup but cannot submit forms
- keep `sitemap.xml` aligned with the active SEO page set
- keep Quick Room Mode hidden from customer UI until reliable
- keep visualiser hidden and out of customer-facing navigation
