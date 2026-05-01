# Operon Flooring Agent System

Source-of-truth status: active execution rules for Codex and future agents.

## Source Of Truth

Before major work, read these files in this order:

1. `apps/web/PROJECT_MEMORY.md`
2. `apps/web/OPERON_PRICING_RULES.md`
3. `apps/web/OPERON_BUSINESS_OBJECTIVES_MARKETING_SEO_BRIEF.md`
4. `apps/web/OPERON_SEO_STRATEGY.md`
5. `apps/web/OPERON_SUPABASE_DATABASE_IMPLEMENTATION.md`

## Goal

Build a high-conversion flooring quote and measurement system that ranks in Sydney and generates qualified leads.

## Priorities (in order)

1. Conversion
2. Quote accuracy
3. SEO structure
4. Product catalogue
5. Analytics / revenue feedback
6. Backlinks
7. Future SaaS infrastructure

## Core Rules

- Keep UI clean and simple
- Do NOT clutter homepage
- Do NOT expose internal pricing logic
- Do NOT reintroduce hardcoded rate cards inside HTML pages
- Do NOT add visualiser
- Do NOT break quote logic
- Do NOT break floorplan handoff
- Do NOT push directly to `main`
- Use `dev` for active work and treat `main` as production only
- Default delivery workflow: make changes locally and validate locally first. Do not push to GitHub, `dev`, Netlify, or `main` unless the user explicitly asks for a push or deploy step.

## Page Roles

- Homepage = conversion page
- Floorplan = measurement assistant
- Product pages = SEO + product selection
- Quote form = pricing engine + lead capture
- Supabase / analytics = tracking layer
- Agents = execution layer

## SEO Rules

- 1 H1 per page
- structured H2 sections
- internal linking required
- follow word count limits

## UX Rules

- mobile-first
- minimal friction
- step-by-step flow

## Content Rules

- no fluff
- no generic AI writing
- practical and clear

## Product Catalogue Rules

- do not duplicate product pricing across multiple files
- update central product data only
- preserve quote integration
- preserve SEO content
- preserve clean mobile UI
- keep placeholder products clearly marked until supplier data is confirmed
- when adding supplier product ranges, centralise them in `apps/web/products.js`
- use unique image alt text for every supplier product image
- connect product selection back into the quote form
- do not overclaim supplier warranty or bathroom suitability

## Pricing Foundation Rules

- keep runtime pricing data in the central JS modules under `apps/web/`
- use `quoteCalculator.js` as the only place for instant quote calculation logic
- use the Netlify private quote runtime for private Supabase-backed pricing when live secrets are involved:
  - `netlify/functions/_supabasePricing.js`
  - `netlify/functions/calculate-private-quote.js`
- keep floorplan measurement separate from wastage and pricing logic
- store selected product by product id so catalogue, quote form, and future database sync stay aligned
- customer-facing quote output must stay bundled and must not expose labour rate, material rate, margin, or raw surcharge formulas
- if Google Sheets pricing is enabled, treat `pricingSourceConfig.js` and the published sheet tabs as the editable source while keeping local JS data as the safe fallback
- prefer private Supabase pricing tables over public browser-readable sources when privacy matters
- do not expose Supabase pricing tables to anon select if sell-rate privacy matters
- never put service-role secrets into frontend HTML or public JS files

## Maintenance Content Rules

- be practical and trade-informed
- link back to the quote tool
- avoid warranty or legal overclaims
- preserve clean UI
- use FAQs and internal links

## Floorplan Rules

- Trace Room Mode stays customer-visible and primary
- Quick Room Mode stays hidden and future-only until reliable
- do not store uploaded image/base64 in localStorage by default
- only persist measurement results required for quote handoff

## Workflow

Always:

1. analyze
2. improve the highest-impact area
3. implement
4. validate
5. repeat

## Continue Execution Rule

When the user says `continue execution`:

1. generate the next 10 ranked tasks
2. save them to `task_queue.json`
3. complete the top 3 tasks in order unless blocked
4. validate after each task
5. update `PROJECT_MEMORY.md` after the run

Do not stop after one small task.

## Analytics Delivery Rule

Do analytics and operating-system work in phases.

Required order:

1. tracking
2. analytics schema
3. quote funnel events
4. revenue admin
5. dashboard
6. task queue
7. SEO tracker
8. backlink tracker
9. blog generator

Do not try to perfect every analytics layer in one run if that increases fragility.

## Agent Responsibilities

### Planner

- choose the next task based on priority score

### Builder

- implement UI and code changes
- keep deployment safety in mind and prefer `local review first`, then only `push -> dev -> Netlify dev deploy -> main` when the user explicitly requests that release flow

### SEO Agent

- manage pages, keywords, internal links, and ranking tracker work

### CRO Agent

- monitor funnel drop-off and improve conversion

### Revenue Agent

- track lead -> job -> revenue -> margin

## TODO / NEXT_ACTIONS

- replace placeholder product rows with confirmed supplier ranges
- keep sitemap, internal links, and active SEO pages aligned
- improve suburb page depth before creating more pages
- keep analytics and revenue layers lightweight and non-blocking
