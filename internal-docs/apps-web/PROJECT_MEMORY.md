# Project Memory

Source-of-truth status: active project memory for current business direction, page roles, and operating priorities.

## Business

- Sydney flooring quote and measurement website
- lead generation focus for laminate, hybrid, and engineered timber flooring
- long-term direction: trade-focused quoting, measurement, pricing, SEO, and margin operating system
- strategic model: Operon is a quote-led acquisition and decision system, not a conventional flooring brochure site
- system flow: `Traffic -> Trust -> Instant Quote -> Quote Validation -> Data Capture -> System Intelligence`
- current phase: Phase 1 only, focused on high-intent SEO traffic, quote conversion, structured data capture, and trust building
- long-term path remains Flooring -> Internal System -> SaaS -> Marketplace, but SaaS and marketplace work are out of scope for current execution unless explicitly requested

## Positioning

- Headline: `Professional Flooring Quotes for Sydney Homes`
- Supporting message: `Get a clearer laminate, hybrid, or engineered timber flooring estimate with area capture, product selection, and pricing built for real installation work.`
- Trust message: `Measured where needed. Priced clearly. Product and site details confirmed before installation starts.`
- Brand position: Operon Flooring is not only a quick quote tool; it presents clear flooring estimates, professional installation, quality workmanship, an experienced installation team, reliable Sydney service, clean product selection, correct scope, quote transparency, and final site confirmation before work.
- Installation trust policy: Operon should signal professionalism through scope clarity, process clarity, installation detail awareness, preparation discipline, quote transparency, real project proof, and flooring decision guidance. Avoid generic claims such as “best quality,” “premium workmanship,” and “Sydney’s best flooring.” Prefer real installation details, process explanations, project examples, scope guidance, operational clarity, and visual craftsmanship proof so customers feel Operon is structured, careful, professional, and detail-aware.
- Quote validation must be positioned as quote clarity and scope review, not price comparison.
- Homepage should stay clean, visual, premium, and not overloaded with tool or form language.
- Operon Scope Standard is a foundational operational framework that helps customers compare flooring quotes based on scope clarity, not price alone. It should quietly shape marketing, SEO, quote review, product pages, suburb pages, comparison guides, quote UX, installation-quality signaling, and future SaaS workflow logic without becoming forced public branding.
- Public copy should prefer plain language such as “clear scope before price comparison,” “final details confirmed before installation,” “know what is included before you decide,” “compare flooring quotes by scope, not just total price,” and “a cheaper quote may not describe the same job.”

## Structure

- Homepage = clean premium conversion and trust page, not the full quote flow
- Quote flow = dedicated `quote.html` pricing engine and lead capture page
- Floorplan = measurement assistant
- Product pages = SEO + product selection
- Suburb pages = local ranking support
- Blog = authority and internal-link support
- All quote CTAs should navigate to `quote.html`
- Homepage must still support SEO through concise structured sections, internal links, schema, and lower-page/expandable content where appropriate
- Quote form = pricing engine + lead capture
- Supabase / analytics = tracking layer
- Agents = execution layer
- Chatbot = guided conversion assistant layer; it supports product guidance, quote explanation, missing information collection, and quote scope review without replacing the quote flow

## Quote Review System

- Quote review is not document analysis software. It is a structured flooring decision-confidence system.
- Quote review is a scope-first trust and data-capture system, not a price-comparison gimmick.
- Raw uploaded quote files are temporary evidence; structured extracted data is the long-term intelligence asset.
- OCR/API extraction must stay backend-only. Frontend should call Operon endpoints, never OpenAI or OCR providers directly.
- AI-assisted quote review should use GPT-4.1 mini as a staged backend workflow: OCR extraction, structured field extraction, scope classification, Operon comparison mapping, then consultant-style decision report.
- AI should be invisible in customer-facing review language. The customer should feel flooring expertise, not AI hype.
- Comparable Operon estimates are allowed only when enough fields are extracted and only through existing pricing logic.
- If exact product/range is unknown but product category is clear, quote review should fall back to category-level comparison rather than pretending no comparison is possible.
- Quote review should preserve two layers of status:
  - customer-facing review status such as `COMPARABLE_WITH_CAUTION`
  - internal Operon comparison status such as `OPERON_CATEGORY_ESTIMATE_ONLY`
- Quote review must not expose internal rates, duplicate pricing logic, or auto-claim Operon is better because the comparison is incomplete.
- The report should feel like a senior flooring consultant: concise executive summary, extracted quote details, scope confidence, why quotes differ, Operon comparable estimate only when safe, price interpretation, questions to clarify, and next step CTA.
- Price is interpreted after scope. Do not lead with price difference before explaining missing inclusions, exclusions, site risks, and comparison confidence.
- Quote review should use risk dimensions such as pricing clarity risk, scope completeness risk, variation risk, installation risk, product certainty, and comparison confidence instead of declaring a quote good or bad.
- Quote review should now operate as decision-confidence infrastructure with an intelligence loop: track whether customers request an Operon estimate, proceed with Operon, choose a competitor, return after a competitor quote, encounter later variations, or identify won/lost reasons.
- Operon Scope Standard is the internal completeness benchmark for quote review: product, range/colour, thickness, area, wastage/material allowance, supply/install split, underlay/acoustic layer, removal/disposal, prep/levelling, trims, stairs, door trimming, access, moisture/subfloor checks, warranty, exclusions, and final site confirmation.
- Scope Standard dimensions now include product definition, area and measurement, installation scope, site/access, risk/preparation, finishing/accessories, commercial clarity, quality signals, exclusions/assumptions, and final site confirmation.
- Quote review should classify product clarity, area clarity, installation clarity, site/access clarity, prep/risk clarity, finishing clarity, commercial clarity, exclusion clarity, and final confirmation requirement before any price interpretation.
- Scope confidence labels should be: High scope definition, Medium scope definition, Low scope definition.
- Quote review should classify job definition as high, medium, or low rather than using a single generic confidence score.
- Confidence must be separated into extraction confidence, scope confidence, comparison confidence, product match confidence, price confidence, and site risk confidence where relevant.
- Quote review should flag likely variation risks such as floor levelling, acoustic underlay, removal/disposal, trims, stairs, moisture preparation, apartment access, parking/lift restrictions, unclear product range, and warranty ambiguity using calm wording: “Potential variation risk if not confirmed.”
- Installation quality risk should be assessed by whether the uploaded quote clearly handles prep, moisture checks, underlay/acoustic details, trims, warranty, installation method, exclusions, and access/site assumptions.
- Every completed quote review should recommend one next best action, such as confirming missing scope, choosing a closest Operon product, building a structured Operon estimate, requesting site confirmation, asking the contractor to confirm inclusions in writing, or manual review.
- Customer decision state may be inferred or asked for when useful, such as researching, comparing prices, worried about hidden costs, apartment compliance concern, quality-focused, budget-sensitive, urgent replacement, overwhelmed, or already has a preferred contractor. Use it for relevance, not pressure.
- Future follow-up should be based on review context: missing acoustic underlay should lead to acoustic guidance, missing prep to floor preparation explanation, product uncertainty to product comparison, and scope-thin quotes to quote checklist education.
- Competitor intelligence must be normalized and used internally only for patterns such as common missing scope, common product categories, suburb pricing patterns, under-scoped quote patterns, frequent exclusions, and common wording.
- Future price-positioning intelligence such as unusually low, market-normal, or premium-positioned is a backlog item only and should not be implemented until enough structured historical data exists.
- Quote review should attract customers who value clarity, professionalism, scope confidence, and reduced surprises, not purely lowest-price shopping.
- Customer-facing privacy copy should explain that uploaded quotes are processed securely, may be stored temporarily for review support, and that structured quote details may be retained to improve the quoting system.
- Recommended retention:
  - raw uploaded files: 7–30 days
  - OCR text: 30–90 days
  - structured extracted data: long term

## Customer-Facing UI Policy

- Customer pages should feel like guided decisions, not documentation.
- Choice cards should use short labels and obvious selected backgrounds; avoid long explanatory sentences inside every option.
- Helper text is only allowed when it prevents a real mistake or explains the next required action.
- Remove redundant confirmation/status copy such as “progress saved” when the state is already obvious or handled silently.
- Backend thresholds, pricing formulas, rate logic, internal labels, implementation details, and “saved to system” language must stay out of customer-facing UI.
- Use plain customer language for visible labels; keep technical/internal variable names only inside code and documentation.
- Product and quote pages should show what the customer needs to decide now, then hide or defer details that can be confirmed later.

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
- quote flow rule: for `Installation Only + Engineered Timber`, ask for `Board pattern` first (`Straight plank`, `Herringbone`, `Chevron`) before showing or locking the installation method
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

- SEO exists to capture demand and move users into quote start, quote validation, or decision clarity.
- homepage is conversion-first with SEO support below the hero.
- core pages are high-intent conversion assets: `/flooring-sydney`, `/hybrid-flooring-sydney`, `/laminate-flooring-sydney`, `/engineered-timber-flooring-sydney`, and `/flooring-quote-sydney`.
- current active product pages use `.html` URLs; future clean URL work should preserve redirects and canonical consistency.
- priority premium suburb expansion list: Mosman, Bondi, Double Bay, Vaucluse, Rose Bay, Chatswood, Wahroonga, Pymble, Balmain, Castle Hill.
- each suburb page must be unique, practical, and locally specific; no repeated template pages.
- blog content must answer real buyer questions and link users into quote, quote validation, and relevant product pages.
- every SEO/content page must include primary CTA `Get your flooring quote` and secondary CTA `Validate your quote` where natural.
- content should stay practical, trade-informed, compact, skim-friendly, and free of generic filler.

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

These are candidates only. Execute them only when their `priority_score = ((seo_impact + conversion_impact + trust_impact + utility_impact + risk_reduction + data_capture_value) × confidence) / effort` ranks high enough and the task is safe.

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
- if the supplier category page is thin, check the supplier brochure PDF and representative product pages before leaving range-level metadata shallow; brochure-backed range specs should be preferred over placeholder summaries
- standard catalogue rule: all range cards should use `View X colours` as a compact popup preview, not a long inline drawer
- standard catalogue rule: selecting a range and browsing colours are separate actions; if final colour must be chosen, enforce it later in `quote.html`
- standard product-import rule: if a supplier colour page has second or third gallery images, save those extra images locally and attach them through `galleryImages` for that product
- standard product-import rule: if a supplier colour page exposes two or more usable gallery images, every imported colour should keep a few local images in its popup, not only a single swatch image
- standard product-import rule: if a specific supplier colour page only has one usable image, inherit a few gallery images from the same range so the popup still shows a fuller customer-facing preview
- product import completion rule: do not mark a supplier range upload complete until each colour page has been checked for extra gallery images and any found images have been downloaded locally and attached in `apps/web/products.js`
- range metadata completion rule: do not mark a supplier range upload complete until range-level description, feature, and technical content has been checked against the supplier category page, brochure, and at least one representative product page
- range metadata completion rule: customer-facing range details must include a visible `Range details` / product information trigger on the range card and the modal should show description, features, and technical specs with plank, board, or panel size whenever the supplier provides it
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
- `quote.html` quote flow can use the private Netlify quote runtime path and local calculator fallback; homepage no longer contains the quote flow
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
- quote flow uses the central calculator instead of embedded rate tables
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
  - `seo_impact`
  - `conversion_impact`
  - `trust_impact`
  - `utility_impact`
  - `risk_reduction`
  - `data_capture_value`
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
- Validation performed: task queue JSON parsed successfully, queue length stayed at 50, queue contains 3 chatbot tasks, and the 2026-05-07 SEO/CRO loop update now supersedes the earlier single-score queue schema with multidimensional scoring fields
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

## Latest Overnight Customer UI Policy Pass

- Tasks completed this run: `UI-POLICY-001`, `COPY-QUOTE-001`, `COPY-PRODUCTS-001`, `COPY-SEO-PAGES-001`, `CHATBOT-COPY-001`, `SEO-MEMORY-001`, `QA-COPY-SCAN-001`, `QA-SCRIPT-001`, `QA-FINAL-001`
- Files changed this run: `apps/web/AGENTS.md`, `apps/web/CODEX_PROJECT_MEMORY.md`, `apps/web/OPERON_BUSINESS_OBJECTIVES_MARKETING_SEO_BRIEF.md`, `apps/web/OPERON_SEO_STRATEGY.md`, `apps/web/OPERON_SEO_EXECUTION_PLAN.md`, `apps/web/PROJECT_MEMORY.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, `apps/web/quote.html`, `apps/web/products.html`, `apps/web/products.js`, priority suburb pages, product money pages, selected blog pages, and chatbot memory/guardrail files
- Customer UI policy added: customer pages should feel like guided decisions, option cards should use short labels and obvious selected states, helper text should only prevent real mistakes or guide the next action, and backend thresholds, formulas, implementation labels, pending-price labels, and progress-save language should stay out of customer screens
- Site-wide copy policy added: secondary explanation copy should be short, premium and skimmable. Prefer `Start estimate`, `Review quote`, `Final details confirmed before installation`, and `Structured estimate first. Site confirmation before work starts.` Avoid repeated quote-process explanations and long CTA helper paragraphs.
- Stricter copy direction added: secondary explanation should usually be one neat line or removed entirely when the primary heading, card title, or CTA is already enough.
- Utility-page copy rule: on `quote.html`, `floorplan.html`, `quote-review.html`, `thank-you.html`, and `products.html`, helper copy should only explain the next action or a real risk. Avoid repeating process explanations once a section title already says the same thing.
- Interactive product system policy added: SEO/product pages must preserve working live product selections, product cards, browsing behavior, product-related JavaScript, filters/sorting, recommendation behavior, selected states, and quote handoff. SEO structure should wrap and improve interaction, not replace it.
- Customer-facing copy changes: quote flow Step 3 wording was shortened, product catalogue pending-price wording was replaced with review/confirmation language, suburb/product/blog pages now use plain `quote` / `quote flow` language, and chatbot-facing wording was aligned with the same policy
- Queue update: `apps/web/task_queue.json` was refreshed to exactly 50 ranked tasks, with 6 chatbot candidates and 9 tasks marked done in this run
- Validation performed: `node --check apps/web/products.js`, `node --check apps/web/quoteCalculator.js`, `node apps/web/tests/quoteCalculator.validation.js`, task queue JSON/schema sanity check, inline script parsing for touched customer pages, chatbot syntax checks, targeted customer-copy scan, and `git diff --check`
- Known risks: visual mobile/browser QA is still required for quote flow, products, floorplan, and Quote Advisor; no GitHub push, Netlify deploy, Supabase write, or email sending was performed
- Next best tasks: browser-review mobile quote/product/floorplan/quote-review pages, then continue reducing helper-text density in remaining quote steps if the simplified Step 3 direction feels right

## Latest Overnight SEO/CRO System Run

- Tasks completed this run: `QUEUE-20260507-001`, `HYBRID-SEO-REFRESH-001`, `LAMINATE-SEO-REFRESH-001`, `ENGINEERED-SEO-REFRESH-001`, `LINK-GRAPH-001`, `CONTENT-REFRESH-REGISTER-001`, `PROJECT-PROOF-BACKLOG-001`, `CHATBOT-MEMORY-001`, `PRODUCT-FAQ-SCHEMA-001`, `PRODUCT-CTA-001`, `PRODUCT-CHECKLIST-001`, `QA-STATIC-001`, `MEMORY-OVERNIGHT-001`
- Files changed this run: `apps/web/task_queue.json`, `apps/web/hybrid-flooring-sydney.html`, `apps/web/laminate-flooring-sydney.html`, `apps/web/engineered-timber-flooring-sydney.html`, `apps/web/INTERNAL_LINK_GRAPH_AUDIT.md`, `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/PROJECT_CASE_STUDY_BACKLOG.md`, `apps/web/chatbot/CHATBOT_MEMORY.md`, and `apps/web/PROJECT_MEMORY.md`
- Queue update: `apps/web/task_queue.json` now contains exactly 50 tasks using `seo_impact`, `conversion_impact`, `trust_impact`, `utility_impact`, `risk_reduction`, `data_capture_value`, `confidence`, `effort`, and `priority_score`
- Product SEO refresh: hybrid, laminate, and engineered timber pages now have cleaner customer-facing FAQ answers, visible quote checklists, stronger quote-review CTAs, and more contextual product/comparison links while preserving live product interaction
- Trust/proof governance: created a planning-only real project proof backlog so case studies can be prepared without inventing fake projects
- Content and link governance: created content refresh and internal link graph registers to prioritize existing-page refreshes, prevent cannibalization, and guide crawl-depth work
- Chatbot memory update: refreshed chatbot strategy language so it stays a short decision-first guide into quote, product, floorplan, and quote-review pathways
- Validation performed: task queue JSON parsed successfully, queue length is exactly 50, product page inline scripts parse, product page FAQ JSON-LD parses, each refreshed product page has exactly one H1, refreshed product page local links resolve, backend/system wording scan passed after excluding CSS margin false positives, and `git diff --check` passed for changed files
- Known risks: visual mobile/browser QA is still recommended for the three refreshed product SEO pages; no GitHub push, Netlify deploy, Supabase write, backend/email change, quote logic change, pricing logic change, product data edit, or floorplan logic edit was performed
- Next best tasks: browser QA refreshed product pages on mobile, audit suburb pages for unique local intent, and add natural product links from high-performing comparison/problem guides

## Latest 2026-05-08 SEO Continuation Run

- Tasks completed this run: `NO-BACKEND-WORDING-SCAN-001`, `ROBOTS-SITEMAP-QA-001`, `PRODUCT-INTERACTION-GUARD-001`, `SUBURB-PROJECT-PROOF-001`, `PRODUCT-INTENT-MAP-001`, `SUBURB-INTENT-AUDIT-001`, `GUIDE-MEASUREMENT-PATH-001`, and `BLOG-PRODUCT-LINKS-001`
- Files changed this run: `apps/web/blog/how-to-measure-floor-area.html`, `apps/web/blog/laminate-vs-hybrid.html`, `apps/web/blog/hybrid-flooring-problems.html`, `apps/web/floor-care-maintenance.html`, `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/PROJECT_CASE_STUDY_BACKLOG.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Content refresh: replaced clipped or generic guide copy with compact measurement, product-comparison, hybrid-problem, and maintenance decision guidance; added natural quote-review and product/category links where the reader is comparing scope or considering replacement
- SEO governance: added a product SEO intent map, suburb intent audit notes for Parramatta/Liverpool/Auburn, and a priority suburb project-proof map that requires real project data before any case study goes live
- Validation performed: `task_queue.json` parsed successfully, sitemap has 37 local targets and all resolve, edited page JSON-LD parses, edited page links resolve, clipped-fragment scan passed for the edited pages, and `git diff --check` passed
- Known risks: the wider maintenance/blog cluster still contains older generic snippets and should be handled in a future content-quality batch; visual mobile/browser QA was not run in this pass
- Protected-file status: no quote calculation, pricing logic, product data, floorplan logic, backend/email, Supabase, or chatbot live integration files were edited in this run
- Next best tasks: run browser QA for refreshed pages, continue the maintenance-guide placeholder cleanup, audit visible images for alt/dimensions/lazy loading, then review quote-review entry points across commercial and guide pages

## Latest 2026-05-08 Chatbot Agent Continuation Run

- Tasks completed this run: `CHATBOT-QUOTE-REVIEW-001`, `CHATBOT-COVERAGE-001`, and `CHATBOT-FRICTION-001`
- Files changed this run: `apps/web/chatbot/CHATBOT_CONVERSATION_FLOWS.md`, `apps/web/chatbot/CHATBOT_KNOWLEDGE_INDEX.md`, `apps/web/chatbot/CHATBOT_MEMORY.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Quote-review support: added safe phrasing, detailed review handoff rules, quote-advisor examples, and explicit boundaries against ranking quotes or claiming Operon is cheaper
- Friction support: added flows for stuck quote users, near-submit uncertainty, area uncertainty, product choice uncertainty, stairs, and access notes
- Knowledge coverage: documented current quote-review coverage, product-page refresh alignment, and safe friction-handling pattern for future chatbot responses
- Validation performed: chatbot doc coverage check passed, `task_queue.json` parsed successfully with 50 tasks and all three chatbot tasks marked done, `node apps/web/chatbot/tests/chatbot.test.js` passed, and `git diff --check` passed
- Protected-file status: no quote logic, pricing logic, product data, floorplan logic, live page wiring, backend/email, Supabase, or chatbot runtime logic was edited in this chatbot pass
- Known risks: the existing modified `apps/web/chatbot/chatbotLogic.js` predates this run and was intentionally left untouched; isolated chatbot runtime tests should be run before any code-level chatbot change
- Next best chatbot tasks: add or update isolated scenario tests for quote-review/stuck-user prompts, then consider docs-to-runtime alignment if live behavior needs the new flows

## Latest 2026-05-08 Analytics Intelligence Agent Continuation Run

- Task completed this run: `DATA-CAPTURE-MAP-001`
- Files changed this run: `apps/web/OPERON_FUNNEL_SYSTEM.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Analytics scope: added a safe structured data capture map across entry pages, product discovery, quote progress, scope shape, floorplan usage, quote review, submission, thank-you, and close feedback
- Safety rules reinforced: no unnecessary data collection, no backend writes, no quote calculation changes, no pricing logic changes, no internal rates exposed, and no raw uploaded plans/photos/quote-review text stored as general analytics events
- Implementation order documented: audit CTA coverage first, standardise CTA metadata, then persist submitted safe scope fields server-side before building admin dashboards
- Validation performed: `task_queue.json` parsed successfully and `git diff --check` passed for the edited files
- Protected-file status: no quote logic, pricing logic, product data, floorplan logic, backend/email, Supabase migration, or chatbot runtime files were edited in this analytics pass
- Next best analytics task: `ANALYTICS-CTA-AUDIT-001`, auditing CTA tracking coverage on product SEO pages while keeping `quote.html` and pricing files untouched

## Latest 2026-05-08 SEO Audit Continuation Run

- Tasks completed this run: `FINAL-QA-NEXT-RUN-001`, `QUOTE-REVIEW-SEO-ENTRY-001`, `IMAGE-SEO-AUDIT-001`, `PRODUCT-SECTION-DENSITY-001`, `CONTACT-PATH-AUDIT-001`, `FLOORPLAN-ENTRY-001`, and `ACCESSIBILITY-CTA-001`
- Files changed this run: `apps/web/INTERNAL_LINK_GRAPH_AUDIT.md`, `apps/web/QA_NOTES.md`, `apps/web/OPERON_FUNNEL_SYSTEM.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Link graph audit: quote-review pathways are strongest on homepage, quote/quote-review, thank-you, and product SEO pages; suburb and maintenance pages should add quote-review links only when scope uncertainty is part of the page intent
- Technical SEO audit: image tags were reviewed for alt text, lazy loading, and dimensions; dynamic catalogue images have alt/lazy handling but no fixed width/height attributes
- CRO/accessibility audit: CTA labels are visible; existing `thank-you.html` hash-only `Call now` and `Send message` actions are logged for later contact-action cleanup
- Product page audit: hybrid, laminate and engineered pages have one H1 each and section counts are still manageable after checklist additions
- Validation performed: `task_queue.json` parsed, all visible JSON-LD blocks parsed, sitemap has 37 local targets, static internal links resolved after excluding generated catalogue href strings, and `git diff --check` passed
- Protected-file status: no quote calculation, pricing logic, product data, floorplan logic, backend/email, Supabase, chatbot runtime, or live product interaction code was changed in this run
- Known risks: visual browser QA is still pending; dynamic catalogue image dimensions need a careful product-page UX pass before any code edit
- Next best SEO tasks: `MAINTENANCE-CTA-001`, `TRUST-COPY-AUDIT-001`, `PRODUCT-PAGE-HEADINGS-001`, `GUIDE-CANNIBALIZATION-001`, and `PRODUCT-RANGE-CONTENT-AUDIT-001`

## Latest 2026-05-08 SEO Safe Task Follow-Up

- Tasks completed this run: `GUIDE-CARD-REUSE-001`, `MAINTENANCE-CTA-001`, `HOMEPAGE-CRO-AUDIT-001`, `TRUST-COPY-AUDIT-001`, and `PRODUCT-PAGE-HEADINGS-001`
- Files changed this run: `apps/web/floor-care-maintenance.html`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Floor care CRO: added product-browse and quote-review CTAs to the repair-vs-replace section while keeping quote as the primary path and floorplan as the measurement path
- Homepage audit: confirmed the homepage has hero quote/review CTAs, a three-path intent router, quote-process CTA, quote-review CTA, floorplan CTA, SEO support links, and final quote CTA without requiring restructuring
- Trust audit: scanned public pages for fake reviews, guarantees, urgency, cheapest-price promises, and overclaims; the only cheapest wording is defensive quote-review positioning
- Product heading audit: hybrid, laminate and engineered timber pages each have one H1 and no heading-level jumps
- Guide-card audit: `seo-pages.css` already has reusable responsive card/grid patterns for `section-card`, `mini-card`, `faq-card`, `link-card`, `grid-2`, `grid-3`, and `link-grid`
- Validation performed: floor-care JSON-LD parsed, floor-care CTA links resolved, queue status check passed for the five tasks, and `git diff --check` passed
- Protected-file status: no quote calculation, pricing logic, product data, floorplan logic, backend/email, Supabase, chatbot runtime, or product interaction code was changed in this run
- Next best SEO tasks: `GUIDE-CANNIBALIZATION-001`, `PRODUCT-RANGE-CONTENT-AUDIT-001`, `ANALYTICS-CTA-AUDIT-001`, `QUOTE-VALIDATION-CONTENT-001`, and `LOCALBUSINESS-SCHEMA-AUDIT-001`

## Latest 2026-05-08 SEO Planning/Audit Continuation

- Tasks completed this run: `GUIDE-CANNIBALIZATION-001`, `PRODUCT-RANGE-CONTENT-AUDIT-001`, `ANALYTICS-CTA-AUDIT-001`, `QUOTE-VALIDATION-CONTENT-001`, and `SCHEMA-BREADCRUMB-001`
- Files changed this run: `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Guide cannibalization: mapped comparison, cost, repair/replacement, and problem-guide intent boundaries without merging, deleting, or creating pages
- Product range audit: confirmed `products.html` already supports range-first browsing, range detail review, colour preview, range selection, selected-range banner, and quote handoff; no product data, product JS, or pricing files were edited
- Analytics CTA audit: product SEO pages have visible quote/product/quote-review/guide/floorplan CTAs and preserve category handoff via `data-save-category`, but explicit `data-track-cta` labels are still a future metadata pass
- Quote validation content: planned a safe educational support guide concept while preserving `quote-review.html` as the owner of upload/review intent
- Schema audit: deferred `BreadcrumbList` schema because the product SEO pages do not yet show visible breadcrumb navigation
- Validation performed: `task_queue.json` parsed successfully with 50 tasks and these five tasks marked done, queue rollup checked, and `git diff --check` passed
- Protected-file status: no quote calculation, pricing logic, product data, floorplan logic, backend/email, Supabase, chatbot runtime, tracking runtime, or product interaction code was changed in this run
- Next best SEO tasks: prioritize the remaining safe pending items by queue score after reviewing the updated 42 done / 8 pending rollup

## Latest 2026-05-08 SEO Mobile/Local Routing Continuation

- Tasks completed this run: `PRODUCT-PAGE-MOBILE-QA-001`, `LOCAL-SERVICE-NAV-001`, `AI-SEARCH-FAQ-001`, `BLOG-INDEX-CRO-001`, and `QUOTE-CLARITY-GUIDE-001`
- Files changed this run: `apps/web/parramatta-flooring.html`, `apps/web/liverpool-flooring.html`, `apps/web/auburn-flooring.html`, `apps/web/blacktown-flooring.html`, `apps/web/miranda-flooring.html`, `apps/web/blog/index.html`, `apps/web/flooring-installation-cost-sydney.html`, `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Product mobile QA: Browser loaded the hybrid product page and confirmed hero CTAs, selected-range banner, product range cards and quote links in the DOM; screenshot capture timed out, so static responsive CSS checks were used as the backstop
- Local routing: suburb pages keep visible quote/product/floorplan paths and now add contextual guide links where the local concern benefits from preparation, measurement, repair-vs-replace or product-comparison guidance
- Copy quality: corrected clipped or generic suburb copy on Parramatta, Auburn, Blacktown and Miranda, plus one clipped cost-page sentence and the blog index hero summary
- Blog CRO: added a direct quote-review route to the blog hub while keeping quote, product, floorplan and maintenance paths visible
- AI-search FAQ audit: product and cost pages already have concise visible answer blocks; no schema changes were needed
- Quote clarity planning: added a planning-only quote clarity checklist guide brief to `SEO_CONTENT_REFRESH_REGISTER.md`; no new page was published
- Validation performed: clipped-fragment scan passed for edited pages, visible JSON-LD on affected commercial pages parsed, edited-page links resolved locally, `task_queue.json` parsed successfully with 50 tasks and these five tasks marked done, and `git diff --check` passed
- Protected-file status: no quote calculation, pricing logic, product data, floorplan logic, backend/email, Supabase, chatbot runtime, tracking runtime, or product interaction code was changed in this run
- Next best SEO tasks: continue with the remaining queue items after reviewing the updated 47 done / 3 pending rollup

## Latest 2026-05-08 Technical SEO Queue Close

- Tasks completed this run: `PERFORMANCE-CSS-001`, `BLOG-FAQ-SCHEMA-AUDIT-001`, and `LOCALBUSINESS-SCHEMA-AUDIT-001`
- Files changed this run: `apps/web/blog/index.html`, `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`
- Blog schema: added `FAQPage` JSON-LD to the blog hub because its four visible FAQ answers were the only blog FAQ coverage gap
- CSS audit: kept `seo-pages.css` unchanged after confirming it is the active shared responsive layout system for SEO pages, cards, catalogue modules, modals and mobile breakpoints
- LocalBusiness audit: kept business schema concentrated on the homepage, with contact-page Organization/ContactPoint schema; no fake ratings, reviews, opening hours, address or phone markup was added
- Validation performed: blog FAQ schema coverage check passed, all JSON-LD blocks in the audited pages parsed, `task_queue.json` parsed successfully with 50 tasks and these final three tasks marked done, queue rollup is 50 done / 0 pending, and `git diff --check` passed
- Protected-file status: no quote calculation, pricing logic, product data, floorplan logic, backend/email, Supabase, chatbot runtime, tracking runtime, or product interaction code was changed in this run
- Next best SEO tasks: the current 50-task queue is complete; create or refresh the next queue before continuing unattended execution

## Latest 2026-05-08 Overnight SEO Queue 002

- Tasks completed this run: the top 25 items in the refreshed 50-task queue, from `SEO-NEXT-QUEUE-002` through `FLOORPLAN-SEO-COPY-AUDIT-002`.
- Files changed this run: selected public blog/content HTML files, `apps/web/floor-care-maintenance.html`, `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/INTERNAL_LINK_GRAPH_AUDIT.md`, `apps/web/PROJECT_CASE_STUDY_BACKLOG.md`, `apps/web/QA_NOTES.md`, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`.
- Schema fixes: `blog/flooring-cost-sydney.html` FAQ schema now includes the visible online-quote question; `floor-care-maintenance.html` FAQ schema now matches the visible manufacturer-care question wording.
- Content quality: tightened selected generic snippets on cost, installation cost, engineered-vs-laminate, gaps/expansion, hybrid cleaning, laminate cleaning and maintenance checklist pages.
- Planning/audit outputs: refreshed quote-clarity guide brief, premium suburb proof roadmap, apartment flooring cluster plan, cost/prep cluster map, AI answer block gap map, quote-review link policy, product checklist reuse map and blog hub density notes.
- Validation performed: sitemap/canonical crawl snapshot, JSON-LD parse checks, FAQ schema/visible-question checks, static link checks, queue parse/status check, and `git diff --check`.
- Protected-file status: no live page logic, quote calculation, pricing logic, product data, floorplan runtime, backend/email, Supabase, chatbot runtime, tracking runtime, quote.html, floorplan.html, quoteCalculator.js, pricingRules.js, products.js, or product interaction code was changed.
- Next best SEO tasks: continue from the remaining 25 pending queue items, starting with `MAINTENANCE-CLUSTER-LINK-MAP-002`, `PRIVACY-QUOTE-REVIEW-COPY-AUDIT-002`, `SUBURB-ORPHAN-PAGE-AUDIT-002`, `QUOTE-PATH-PARAM-CONSISTENCY-002`, and `QUOTE-REVIEW-SEO-COPY-GUARD-002`.

## Latest 2026-05-08 Overnight SEO Queue 002 Closeout

- Tasks completed this run: the remaining 25 Queue 002 items, from `MAINTENANCE-CLUSTER-LINK-MAP-002` through `RANK-TRACKER-KEYWORD-GROUPS-002`.
- Files changed this run: `apps/web/privacy-policy.html`, `apps/web/contact.html`, `apps/web/index.html`, `apps/web/quote-review.html`, `apps/web/INTERNAL_LINK_GRAPH_AUDIT.md`, `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/QA_NOTES.md`, `apps/web/OPERON_SEO_STRATEGY.md`, `apps/web/OPERON_FUNNEL_SYSTEM.md`, chatbot documentation, `apps/web/task_queue.json`, and `apps/web/PROJECT_MEMORY.md`.
- Customer-facing safe fixes: privacy page now explains quote/floorplan/quote-review data handling; contact FAQ visible copy now matches schema; homepage now links to Cabramatta and Eastern Suburbs service pages; homepage and quote-review footer legal links were completed.
- Audits completed: maintenance cluster links, quote path parameters, quote-review positioning, products-page SEO copy, blog/suburb orphan risk, sitemap blog coverage, robots/noindex guard, contact schema match, mobile nav pattern, guide title/meta uniqueness, footer consistency, image alt/dimension coverage, product-page schema opportunity, social metadata coverage, clean URL roadmap, Search Console metrics placeholder, backlinkable assets and rank-tracker keyword groups.
- Validation performed: task queue parses at 50 done / 0 pending, blog sitemap coverage is complete, contact JSON-LD parses, contact visible FAQ/schema match passed, suburb orphan check passed after homepage links, static image alt check passed, and `git diff --check` passed.
- Protected-file status: no quote calculation, pricing logic, product data, floorplan runtime, backend/email, Supabase, chatbot runtime, tracking runtime, analytics runtime or product catalogue logic was changed.
- Next best SEO task: Queue 002 is fully complete; create a new ranked SEO-safe queue before continuing unattended execution.

## Latest 2026-05-08 Overnight Full Agent Loop Queue 003

- Tasks completed this run: 27 Queue 003 tasks across documentation, SEO strategy, quote review policy, site copy policy, marketing policy, internal linking, case-study planning, chatbot documentation, analytics mapping, sitemap/link/schema validation and QA notes.
- Files changed this run: `apps/web/OPERON_SCOPE_STANDARD_APPLICATION_AUDIT.md`, `apps/web/SITE_COPY_POLICY.md`, `apps/web/OPERON_BUSINESS_OBJECTIVES_MARKETING_SEO_BRIEF.md`, `apps/web/OPERON_SEO_STRATEGY.md`, `apps/web/QUOTE_REVIEW_POLICY.md`, `apps/web/AGENT_LOOP.md`, `apps/web/PROJECT_MEMORY.md`, `apps/web/SEO_CONTENT_REFRESH_REGISTER.md`, `apps/web/INTERNAL_LINK_GRAPH_AUDIT.md`, `apps/web/PROJECT_CASE_STUDY_BACKLOG.md`, `apps/web/chatbot/CHATBOT_MEMORY.md`, `apps/web/chatbot/CHATBOT_CONVERSATION_FLOWS.md`, `apps/web/AGENTS.md`, `apps/web/QUOTE_REVIEW_DATA_ENGINE.md`, `apps/web/OPERON_FUNNEL_SYSTEM.md`, `apps/web/QA_NOTES.md`, and `apps/web/task_queue.json`.
- Scope Standard system: created a dedicated application audit and propagated the framework through policy, SEO, quote review, chatbot, project-proof and funnel documentation while keeping the term internal rather than public marketing language.
- Quote-review intelligence: added future outcome fields, outcome learning loop, scope-definition labels, confidence separation and next-best-action guidance without changing quote review runtime code.
- Funnel/analytics planning: mapped future safe signals for scope definition, missing scope categories, decision state, next best action and observed variations; no backend tracking implementation was changed.
- Chatbot docs: added a safe flow for users asking what to check in a flooring quote and recorded Scope Standard routing guidance.
- Validation performed: sitemap local-target check passed with 37 URLs and no missing files; quote and quote-review links across 52 HTML files resolve locally; JSON-LD parsed for homepage, quote-review, contact and blog hub; public HTML has no “Operon Scope Standard” branding; `git diff --check` passed for changed policy/docs files.
- Queue state: Queue 003 now has 50 tasks, with 27 done, 18 pending and 5 blocked because they require explicit approval for protected quote, product, floorplan, backend or Supabase areas.
- Protected-file status: no quote calculation, pricing logic, product data, floorplan runtime, backend/email, Supabase function, tracking runtime or product catalogue logic was edited in this pass. Existing dirty protected files predated this pass and were left untouched.
- Next best tasks: refresh older problem guides with compact scope-confirmation blocks, strengthen the floor-preparation guide as the prep owner, audit product-page installation implication copy, and run browser/mobile QA when ready.

## Latest 2026-05-08 200-Task Full Agent Loop

- Tasks completed this run: 145 of 200 tasks were completed through safe static audits, queue governance, policy-aligned planning, and documentation updates. The remaining 43 tasks are pending and 12 are blocked behind protected-file approval gates.
- Files changed this run: `apps/web/OPERON_200_TASK_AGENT_LOOP_RUN.md`, `apps/web/task_queue.json`, `apps/web/QA_NOTES.md`, and `apps/web/PROJECT_MEMORY.md`.
- Audit coverage: 19 high-value public pages were statically checked for one-H1 structure, quote/product/floorplan routes, selective quote-review routes, progressive disclosure usage, JSON-LD presence, image alt coverage, and mobile/CRO risk.
- Queue governance: `task_queue.json` now contains 200 ranked tasks across quote review, analytics, documentation, SEO, CRO, product page, suburb page, blog, internal linking, schema, chatbot, project proof, QA, performance, accessibility, and protected-system candidates.
- Completed safe batches: analytics scope-signal planning, SEO scope-cluster mapping, static mobile/CRO review, quote-review utility planning, product/suburb scope audits, internal-link mapping, schema-safety review, QA checks, performance/static-risk review, and accessibility/static-risk review.
- Key findings: all 19 audited pages have exactly one H1; all audited pages link to quote, products, and floorplan paths; quote-review links remain selective; 13 audited pages include JSON-LD; `products.html` has 2 static image alt gaps and dynamic catalogue images still need a later product-UI accessibility/performance pass.
- Validation performed: `task_queue.json` parsed successfully, sitemap local targets resolved, quote/quote-review links resolved in static scan, selected JSON-LD blocks parsed, public HTML has no forced "Operon Scope Standard" branding, and whitespace diff validation passed for files changed in this pass.
- Protected-file status: no quote calculation logic, pricing rules, product data, floorplan logic, backend/API/email functions, Supabase migrations/functions, tracking runtime, analytics runtime, or live chatbot runtime integration was changed. Existing dirty protected files predated this pass and were intentionally left untouched.
- Next best tasks: run browser/mobile QA across quote, products, floorplan and quote-review; then handle the 43 pending content/chatbot/project-proof tasks or explicitly approve a focused protected-file pass if runtime UX needs changes.

## Latest 2026-05-09 Continue Execution Overnight

- Tasks completed this run: 39 safe queue items, including `CHATBOT-LIVE-SCOPE-INJECTION-004`, `GUIDE-SCOPE-REFRESH-001-004` through `GUIDE-SCOPE-REFRESH-012-004`, `CHATBOT-SCOPE-001-004` through `CHATBOT-SCOPE-012-004`, `PROJECT-PROOF-SCOPE-001-004` through `PROJECT-PROOF-SCOPE-012-004`, and `BACKLOG-SAFE-194-004` through `BACKLOG-SAFE-200-004`.
- Files changed this run: chatbot runtime/docs/tests, selected problem-guide HTML pages, five suburb pages, three product money pages, `flooring-installation-cost-sydney.html`, `products.html`, `quote-review.html`, `PROJECT_CASE_STUDY_BACKLOG.md`, `OPERON_SCOPE_STANDARD_APPLICATION_AUDIT.md`, `apps/web/task_queue.json`, `apps/web/QA_NOTES.md`, and `apps/web/PROJECT_MEMORY.md`.
- Chatbot result guidance: the assistant now reads visible Quote Advisor result text as read-only context, explains one missing or unclear scope item, suggests one contractor question, and routes to a structured Operon estimate without calculating price or judging a competitor.
- Guide refresh: repair/replace, floor lifting, laminate water damage, hybrid problems, comparison guides, product money pages and suburb pages now include tighter scope-first guidance and quote-review routes where the intent is natural.
- Project proof planning: `PROJECT_CASE_STUDY_BACKLOG.md` now has page-specific proof intake fields for problem guides, suburb pages and product money pages so future trust proof can be collected without inventing public claims.
- Backlog governance: `OPERON_SCOPE_STANDARD_APPLICATION_AUDIT.md` now includes a safe future backlog register for copy, routing, product education, suburb proof, guide consolidation, mobile skim and analytics planning work.
- Queue state: the 200-task queue now has 189 done, 0 pending and 11 blocked.
- Validation performed: `node apps/web/chatbot/tests/chatbot.test.js`, queue parse/count checks, guide/page JSON-LD and H1 checks, local target existence checks and `git diff --check` passed for the touched files.
- Protected-file status: no quote calculation logic, pricing rules, product data, floorplan runtime, backend/API/email functions, Supabase migrations/functions, or tracking runtime was edited in this pass.
- Next best tasks: resolve the 11 blocked approval-gated items only if explicitly approved, otherwise run browser/mobile QA across quote, products, floorplan and quote-review before pushing.

## Latest 2026-05-09 Blocked Queue Closeout

- Tasks completed this run: the remaining 11 approval-gated queue items, bringing `task_queue.json` to 200 done, 0 pending and 0 blocked.
- Files changed this run: `apps/web/quoteCalculator.js`, `apps/web/products.js`, `apps/web/quote.html`, `apps/web/floorplan.html`, `apps/web/products.html`, `apps/web/quote-review.html`, `netlify/functions/save-quote-request.js`, `supabase/migrations/20260509_scope_standard_signals.sql`, `apps/web/task_queue.json`, `apps/web/QA_NOTES.md`, and `apps/web/PROJECT_MEMORY.md`.
- Calculator scope fields: `quoteCalculator.js` now emits read-only `scopeSignals` that describe included scope, missing or unclear scope, variation risks and final-confirmation requirements. Pricing formulas, rates and totals were not changed.
- Product scope metadata: `products.js` now exposes derived product scope metadata from existing product/range fields, such as thickness, board size, warranty, installation note and quote prompts. No product prices or catalogue entries were changed.
- Lead/save plumbing: `quote.html` carries `scopeSignals` and product scope metadata into the payload; `save-quote-request.js` preserves scope signals in the existing raw payload path and can show missing scope in quote emails.
- Data readiness: added an additive Supabase migration for future `scope_signals`, `missing_scope_items`, `scope_definition_level` and next-action fields on quote requests/leads/reviews.
- Customer copy: floorplan handoff copy now clarifies that the tool transfers measured area while product/site scope is confirmed in the quote; products and quote-review pages received one compact decision-focused FAQ each.
- Validation performed: `task_queue.json` parsed at 200 done / 0 pending / 0 blocked, `node apps/web/tests/quoteCalculator.validation.js`, `node --check apps/web/quoteCalculator.js`, `node --check apps/web/products.js`, `node --check netlify/functions/save-quote-request.js`, and chatbot tests passed.
- Risk note: Supabase migration is additive and must still be applied to the database before those new columns are available outside raw payload storage.

## Latest 2026-05-09 Overnight Full Agents Queue 005

- Tasks completed this run: 25 safe Queue 005 items: `OVN-001`, `OVN-002`, `OVN-003`, `OVN-004`, `OVN-005`, `OVN-006`, `OVN-007`, `OVN-009`, `OVN-010`, `OVN-011`, `OVN-012`, `OVN-013`, `OVN-014`, `OVN-018`, `OVN-022`, `OVN-025`, `OVN-029`, `OVN-030`, `OVN-031`, `OVN-032`, `OVN-036`, `OVN-042`, `OVN-044`, `OVN-048`, and `OVN-049`.
- Files changed this run: `apps/web/task_queue.json`, `apps/web/QA_NOTES.md`, chatbot documentation under `apps/web/chatbot/`, `apps/web/PROJECT_CASE_STUDY_BACKLOG.md`, `apps/web/OPERON_SCOPE_STANDARD_APPLICATION_AUDIT.md`, and `apps/web/PROJECT_MEMORY.md`.
- Agent split: Worker A completed chatbot scope-first conversion, floorplan guidance, no-price-calculation, QA matrix and memory updates; Worker B completed technical SEO and QA documentation for sitemap, robots, metadata, H1, JSON-LD, links and conversion-route coverage; Worker C completed project-proof, photo/permission, premium suburb proof and trust-signal documentation.
- Floorplan policy captured: the floorplan tool remains a measurement assistant only. It sends real measured area into the quote flow and must not apply wastage, chargeable area, pricing, or final site-measurement claims.
- Measurement confidence language: floorplan confidence is measurement-quality language only and must stay separate from quote confidence, product confidence, and final scope confirmation.
- QA documentation added: `QA_NOTES.md` now includes floorplan public browser checks, mobile checks, hidden debug/prototype exposure notes, and manual QA placeholders for upload, scale, trace, selected area, quote handoff and footer overlap.
- Queue state: Queue 005 now has 50 ranked tasks, with 25 done and 25 pending. Scores use `priority_score = (impact_score x confidence_score) / effort_score`.
- Validation performed: `node apps/web/chatbot/tests/chatbot.test.js` passed, `npm run test:floorplan` passed, `git diff --check` passed for the updated queue/docs/chatbot/project-proof files, and internal-rate exposure scan found only forbidden examples or guardrail language, not customer-facing rate disclosures.
- Known risks: browser/mobile rendering QA was not run in this cycle; the worktree remains very dirty from previous Operon work; several protected runtime files are already modified from earlier tasks and were not reverted.
- Blocked items: live quote/product/floorplan/pricing/backend/Supabase/runtime changes remain approval-gated unless the user explicitly requests a focused protected-file pass.
- Next best tasks: run rendered mobile/browser QA for homepage, products, product SEO pages, `quote.html`, `quote-review.html`, and `floorplan.html`; then complete remaining safe documentation/content tasks or explicitly approve a narrow runtime QA/fix pass.

## TODO / NEXT_ACTIONS

- 2026-05-07: SEO/CRO/site-quality agent loop upgraded. Operon now treats SEO as a compounding authority system: topical clusters, internal link graph, content quality enforcement, CRO, technical SEO, project proof, and utility moat improvements are part of every continue execution run.
- 2026-05-07: Operon's agent system now includes SEO intelligence loops, CRO optimization loops, trust governance, data capture strategy, AI-search readiness, semantic authority governance, friction detection, content refresh systems, anti-cannibalization systems, utility moat prioritization, and closed-loop learning architecture.
- future Supabase lead and queue sync contracts are documented in `OPERON_SUPABASE_DATABASE_IMPLEMENTATION.md`; they are planning-only and do not enable live writes
- confirm real product ranges, colours, and supplier pricing in `products.js`
- run `supabase/pricing_schema.sql` and verify private pricing tables in Supabase
- set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Netlify for the private quote function
- set `RESEND_API_KEY` and `OPERON_QUOTE_FROM_EMAIL` in Netlify if `Email quote` should be live
- keep the Netlify Forms quote-request path verified on live/branch deploys; simple localhost previews now save a local backup but cannot submit forms
- keep `sitemap.xml` aligned with the active SEO page set
- keep Quick Room Mode hidden from customer UI until reliable
- keep visualiser hidden and out of customer-facing navigation
