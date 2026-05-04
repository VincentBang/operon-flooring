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
- Brand position: Operon Flooring is not only a quick quote tool; it presents clear flooring estimates, professional installation, quality workmanship, an experienced installation team, reliable Sydney service, clean product selection, correct scope, quote transparency, and final site confirmation before work.
- Quote validation must be positioned as quote clarity and scope review, not price comparison.
- Homepage should stay clean, visual, premium, and not overloaded with tool or form language.

## Structure

- Homepage = clean premium conversion and trust page, not the full quote wizard
- Quote wizard = dedicated `quote.html` pricing engine and lead capture page
- Floorplan = measurement assistant
- Product pages = SEO + product selection
- Suburb pages = local ranking support
- Blog = authority and internal-link support
- All quote CTAs should navigate to `quote.html`
- Homepage must still support SEO through concise structured sections, internal links, schema, and lower-page/expandable content where appropriate
- Quote form = pricing engine + lead capture
- Supabase / analytics = tracking layer
- Agents = execution layer
- Chatbot = guided conversion assistant layer; it supports product guidance, quote explanation, missing information collection, and quote scope review without replacing the quote wizard

## Deployment Workflow

- `main` = production
- `dev` = development
- workflow = `local -> optional dev preview -> optional merge -> main -> deploy`
- never push development work directly to production
- default execution rule = make changes locally first and validate locally; only push to GitHub / `dev` / `main` or trigger Netlify review when the user explicitly asks

## Agent Priority System

Use this priority order when `continue execution` ranks tasks:

1. Conversion
2. Quote accuracy
3. Product catalogue
4. SEO product pages
5. Chatbot assistant / guided conversion
6. Suburb pages
7. Internal linking
8. Analytics tracking
9. Lead capture without email
10. Blog / maintenance content
11. Backlinks
12. Future SaaS infrastructure

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

## Chatbot Assistant System

- chatbot improvement is now part of the main agent loop as a candidate task category
- chatbot tasks belong to the `Chatbot Agent`
- chatbot should behave as a guided decision system, not a free-form Q&A assistant or pricing tool
- chatbot may improve product guidance conversations, quote explanation, missing information collection, quote validation support, routing suggestions, structured JSON output, memory files, and safe UX inside `apps/web/chatbot/`
- chatbot may route or suggest paths toward `quote.html`, `products.html`, `floorplan.html`, and `quote-review.html`, but current conversion guidance should avoid fragmenting the main quote flow
- chatbot must not calculate prices, display estimated prices, expose internal rates, replace the quote flow, override product selection, modify `quoteCalculator.js`, modify `pricingRules.js`, modify `products.js`, or change `productSelection.js` unless explicitly approved
- chatbot must not auto-fill forms unless the user confirms and a future integration task explicitly approves it
- safe chatbot tasks without approval are limited to files inside `apps/web/chatbot/`, including memory, flow, JSON schema, copy, routing suggestion, safety, test, and documentation improvements
- chatbot tasks requiring approval include injecting chatbot into new live pages, changing `quote.html`, changing `products.html`, modifying product/pricing files, or enabling quote form auto-fill

Every future 50-task queue should include at least 3 chatbot-related candidate tasks, such as:

- improve chatbot product guidance flow
- improve chatbot quote explanation flow
- improve chatbot quote-review support
- improve chatbot missing information JSON mapping
- improve chatbot idle/stuck-user prompts
- improve chatbot routing suggestions
- improve chatbot memory from latest site changes
- audit chatbot for accidental pricing claims
- validate chatbot does not interfere with quote flow

These are candidates only. Execute them only when their `priority_score = (impact × confidence) / effort` ranks high enough and the task is safe.

## Product Catalogue System

- product data now stored centrally in `apps/web/products.js`
- central catalogue page now lives at `apps/web/products.html`
- product pages can show brand, range, colour, and price
- customer can select product from product page
- selected product feeds the quote engine
- laminate, hybrid, and engineered use the same system
- only confirmed live catalogue products should be shown
- current live catalogue includes ETF Hybrid 7.0mm, 8.0mm, and 9.0mm ranges with supplier imagery
- if a supplier product page exposes range-level `Description`, `Features`, and `Technical` content, capture it as structured range metadata in `apps/web/products.js` so the range card can show those tabs directly in the catalogue
- standard catalogue rule: all range cards should use `View X colours` as a compact popup preview, not a long inline drawer
- standard catalogue rule: selecting a range and browsing colours are separate actions; if final colour must be chosen, enforce it later in `quote.html`
- standard product-import rule: if a supplier colour page has second or third gallery images, save those extra images locally and attach them through `galleryImages` for that product
- standard catalogue UX rule: if a colour image opens from a `View X colours` popup, the single-image lightbox must include a back button to return to that full colour popup

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
- `quote.html` quote wizard can use the private Netlify quote runtime path and local calculator fallback; homepage no longer contains the quote wizard
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
  - `impact`
  - `confidence`
  - `effort`
  - `priority_score`
  - `approval_required`
  - `dependencies`
  - `risk_level`
  - `files_likely_affected`
  - `validation_checklist`
  - `status`
  - `notes`
- chatbot tasks use:
  - `category`: `chatbot`
  - `assigned_agent`: `Chatbot Agent`
  - `approval_required`: `false` only when all likely affected files are inside `apps/web/chatbot/`
- queue file:
  - `apps/web/task_queue.json`
- future unattended run history format is documented in `AGENT_LOOP.md`
- run history is planning-only and must not trigger GitHub push, Netlify deploy, Supabase writes, or email sending by itself

## Latest Overnight Continuation

- Tasks completed this continuation: `BLOG-001`, `BLOG-002`, `BLOG-003`, `BLOG-004`, `BLOG-005`, `SEO-INFRA-003`, `ANALYTICS-004`, `SAAS-001`, `SAAS-002`, `SAAS-003`, `BACKLINK-001`, `BACKLINK-002`, `BACKLINK-003`, `LINK-002`
- Files changed this continuation: `apps/web/index.html`, `apps/web/dashboard.html`, `apps/web/agent-task-engine.js`, `apps/web/backlink-tracker.html`, `apps/web/OPERON_SEO_STRATEGY.md`, `apps/web/OPERON_SUPABASE_DATABASE_IMPLEMENTATION.md`, `apps/web/AGENT_LOOP.md`, `apps/web/PROJECT_MEMORY.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and the five priority suburb pages
- Validation performed: product scripts checked, agent task engine checked, inline scripts parsed with JSON-LD excluded, schema coverage audited, suburb internal links resolved, and `git diff --check` passed
- Known risk: `QA-003` remains pending because it requires browser-render mobile viewport review rather than static validation
- Current queue state after chatbot-loop integration: 46 of 50 tasks done, 4 pending, including 3 safe chatbot candidate tasks required for future `continue execution` cycles

## Latest Chatbot Agent Loop Update

- Task completed: added chatbot improvement into the main agent loop and project memory as a standing high-ROI candidate category
- Files changed this update: `apps/web/AGENTS.md`, `apps/web/AGENT_LOOP.md`, `apps/web/PROJECT_MEMORY.md`, `apps/web/task_queue.json`
- New agent role: `Chatbot Agent`
- New queue rule: every future 50-task queue must include at least 3 chatbot-related candidate tasks
- Current chatbot queue candidates: `CHATBOT-001`, `CHATBOT-002`, `CHATBOT-003`
- Validation performed: task queue JSON parsed successfully, queue length stayed at 50, queue contains 3 chatbot tasks, queue schema now uses `impact`, `confidence`, `effort`, `priority_score`, and `approval_required`
- Known risks: chatbot work remains safe only while it stays inside `apps/web/chatbot/`; live page injection, quote/product changes, product selection changes, pricing files, and auto-fill remain approval-gated
- Next best chatbot tasks: audit chatbot for accidental pricing claims, improve product guidance flow, improve quote-review and missing-information JSON mapping

## Latest Funnel System Update

- Task completed: structured the entry-to-conversion funnel into one system covering homepage entry, product selection, quote flow, summary, submit, thank-you, follow-up, close support, and data feedback
- Files changed this update: `apps/web/index.html`, `apps/web/tracking.js`, `apps/web/OPERON_FUNNEL_SYSTEM.md`, `apps/web/PROJECT_MEMORY.md`
- Homepage change: added a three-path intent router for `quote`, `products`, and `review`
- Analytics change: homepage intent path clicks now emit `funnel_intent_select`; tracking comments now reflect the seven-step quote flow
- Validation performed: homepage JavaScript and quote inline JavaScript parsed successfully with `new Function`
- Known risks: follow-up SMS/email remains a playbook only until provider credentials, consent/compliance rules, and backend queue execution are ready
- Next best funnel task: persist `funnel_intent`, `lead_stage`, `stairsRequiresReview`, and extras decisions through the server-side lead save path

## Latest Close Script System Update

- Task completed: created a structured close-stage script pack for phone, SMS, email, chatbot, and objection handling
- Files changed this update: `apps/web/OPERON_CLOSE_SCRIPTS.md`, `apps/web/OPERON_FUNNEL_SYSTEM.md`, `apps/web/POST_SUBMIT_CONVERSION_SYSTEM.md`, `apps/web/PROJECT_MEMORY.md`
- Close framework: acknowledge, clarify details, control risk, guide next step, and offer choice
- Safety rules: no pressure, no discounting, no fake urgency, no claims that Operon is always cheaper, and no internal rates or pricing formulas exposed
- Conversion focus: keep close-stage conversations anchored to scope clarity, preparation, access, stairs, removal/disposal, trims, measurement confidence, and final confirmation before work
- Validation performed: close-script file reviewed and `git diff --check` passed for the touched documentation files
- Known risks: scripts are playbooks only; SMS/email automation still needs provider credentials, compliance rules, opt-out handling, and backend queue execution before becoming live
- Next best close task: map submitted quote lead states to the correct phone/SMS/email/chatbot script without enabling outbound sending yet

## Latest Automated Close System Update

- Task completed: built the safe automated close foundation using Supabase lead-stage fields, engagement scoring, event tracking, scheduled processing, and chatbot signals
- Files changed this update: `supabase/migrations/20260504_automated_close_system.sql`, `supabase/functions/process-leads/index.ts`, `supabase/functions/create-followup-queue/index.ts`, `netlify/functions/save-quote-request.js`, `apps/web/tracking.js`, `apps/web/quote.html`, `apps/web/chatbot/chatbot.js`, `apps/web/AUTOMATED_CLOSE_SYSTEM.md`, `apps/web/OPERON_FUNNEL_SYSTEM.md`, `apps/web/PROJECT_MEMORY.md`
- Database additions: `lead_stage`, `engagement_score`, `last_activity`, `last_action`, close automation run audit table, and `manual_close_call` queue template
- Events now supporting close scoring: `quote_submit`, `quote_submit_success`, `CTA_click`, `cta_click`, `chatbot_interaction`, `chatbot_hesitation_detected`, `summary_view`, thank-you CTA and lead-stage events
- Automation function: `process-leads` scores recent quote requests, updates lead stage, queues safe follow-up/close actions, and skips paused or human-escalated leads
- Safety rules: no quote/pricing calculation changes, no internal rates exposed, no automatic SMS/email sending enabled, and human escalation stops automation when reply/call/site assessment/final quote/job status is recorded
- Validation performed: local JS syntax checks and SQL/TypeScript static review were completed; live Supabase migration/function deployment still requires explicit approval and environment access
- Known risks: real 5-10 minute scheduling, provider sending, consent/opt-out enforcement, and live database verification remain deployment tasks
- Next best close task: deploy migration/function to Supabase staging, run `process-leads?limit=5` in dry-run mode, then inspect `close_automation_runs` and `followup_messages`

## Latest Close Probability System Update

- Task completed: added an explainable close probability layer for lead prioritisation and action routing
- Files changed this update: `supabase/migrations/20260504_close_probability_system.sql`, `supabase/functions/calculate-close-score/index.ts`, `supabase/functions/process-leads/index.ts`, `netlify/functions/save-quote-request.js`, `apps/web/CLOSE_PROBABILITY_MODEL.md`, `apps/web/AUTOMATED_CLOSE_SYSTEM.md`, `apps/web/PROJECT_MEMORY.md`
- Scoring model: `close_score = intent + engagement + completeness - friction`, clamped to `0-100`
- New outputs: `close_score`, `close_probability`, `close_band`, `close_reasons`, `next_action`, and `priority_rank`
- Action mapping: high leads route to immediate human contact, medium leads to guided follow-up, low leads to nurture, and very low leads to minimal automation
- Integration: new quote saves get an initial deterministic close score; `calculate-close-score` can recalculate on lead creation, event update, or scheduled batch; `process-leads` uses `close_band` / `close_score` to adjust follow-up timing and manual close escalation
- Validation performed: function TypeScript and edited JavaScript syntax checks passed; SQL migration reviewed locally; no pricing or quote calculation logic changed
- Known risks: live scoring still needs Supabase migration/function deployment, then calibration against real won/lost outcomes
- Next best close task: deploy `calculate-close-score` in dry-run mode and compare scored leads against actual customer quality before enabling dashboard prioritisation

## Latest Pricing Optimisation Layer Update

- Task completed: added a safe post-calculation pricing optimisation layer using historical quote/outcome buckets and customer-facing price ranges
- Files changed this update: `apps/web/pricingAdjustment.js`, `apps/web/quote.html`, `apps/web/PRICING_OPTIMIZATION_LAYER.md`, `netlify/functions/pricing-optimization-insight.js`, `supabase/migrations/20260505_pricing_optimization_layer.sql`, `supabase/functions/calculate-pricing-optimization/index.ts`, `supabase/functions/record-pricing-outcome/index.ts`, `apps/web/PROJECT_MEMORY.md`
- Base pricing rule: `quoteCalculator.js` remains unchanged and remains the base estimate authority
- Data model: captures suburb/postcode, suburb cluster, flooring type, area band, stairs flag, extras flags, quote total, breakdown totals, confidence level, close status, final price, close time, and lost reason
- Bucket model: aggregates by `(suburb_cluster, flooring_type, area_band, stairs_flag)` and computes win rate, average/median price, p25/p40/p50/p65/p75, average winning price, median winning price, target range, and target price
- UI change: quote summary can show a price range with a base estimate note and confidence indicator; measurement-unknown leads still show pending measurement instead of a fake range
- Safety rules: optimisation adjusts display guidance only, does not expose internal rates or margins, does not silently discount, and final pricing still requires scope/site confirmation
- Validation performed: JavaScript syntax, quote inline script parsing, TypeScript checks for Supabase functions, and `git diff --check` passed locally
- Known risks: historical bucket confidence is low until real won/lost outcomes are captured; outcome labelling quality directly affects future pricing guidance
- Next best pricing task: deploy the schema/functions, record a few real won/lost outcomes with `record-pricing-outcome`, run `calculate-pricing-optimization` in dry-run mode, then compare ranges against actual margins before relying on them

## Latest Stair Pricing System Update

- Task completed: mapped stairs from a simple review flag into a range-based, width-tiered pricing model for quote flow, local fallback, Supabase schema, and Netlify private pricing compatibility
- Stair scope collected from customers: known stair width yes/no, width in mm if known, straight tread quantity, winder/triangular tread quantity, landing up to 1 m², landing up to 2 m², one-side open tread quantity, and two-side open tread quantity
- Pricing rule: hybrid and laminate use `1200 mm` as the short/long tier guide; engineered timber uses `plank_length_mm / 2`
- Patterned engineered rule: herringbone and chevron stair pricing uses the matching straight plank range length, not the shorter herringbone/chevron board length
- If stair width is unknown, the quote uses the short-width allowance and warns that the final stair price changes if confirmed width is over the guide
- Files changed this update: `apps/web/stairRates.js`, `apps/web/quote.html`, `apps/web/quoteCalculator.js`, `apps/web/pricingSource.js`, `apps/web/pricingSourceConfig.js`, `netlify/functions/_supabasePricing.js`, `supabase/migrations/20260504_stair_pricing_schema.sql`, `supabase/seed_stair_pricing.sql`, `apps/web/OPERON_SUPABASE_DATABASE_IMPLEMENTATION.md`, `apps/web/OPERON_PRICING_RULES.md`, `apps/web/STAIR_PRICING_SETUP.md`, and `apps/web/tests/quoteCalculator.validation.js`
- Validation performed: local quote calculator tests pass, edited JavaScript syntax checks pass, Netlify helper syntax check passes, and quote inline scripts parse
- Known risk: actual stair prices are placeholder `0` values until `price_short` and `price_long` are filled per range/type/tier in Supabase or local fallback

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
