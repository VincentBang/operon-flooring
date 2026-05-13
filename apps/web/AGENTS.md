# Operon Flooring Agent System

Source-of-truth status: active execution rules for Codex and future agents.

## Mission

Build and maintain a high-conversion flooring quote and measurement system that ranks in Sydney, protects pricing logic, and can continue making safe progress while the owner is away or sleeping.

Operon is a quote-led acquisition and decision system:

`Traffic -> Trust -> Instant Quote -> Quote Validation -> Data Capture -> System Intelligence`

Current phase: Phase 1 only.

Phase 1 means:

- high-intent SEO traffic
- conversion to quote
- structured data capture
- trust building
- homepage, product, suburb, blog, guide, analytics, and technical SEO improvement

Do not build SaaS features, marketplace logic, backend email changes, pricing logic changes, quote calculation changes, or product data logic changes unless the user explicitly asks.

## Mandatory Read Order

Before editing quote, upload, storage, email, OpenAI, analytics, admin or security-sensitive code, read `docs/security/SECURITY_POLICY.md`.

When the user says `continue execution`, always read these files first:

1. `apps/web/AGENTS.md`
2. `apps/web/AGENT_LOOP.md`
3. `apps/web/PROJECT_MEMORY.md`
4. `apps/web/OPERON_PRICING_RULES.md`
5. `apps/web/OPERON_SEO_STRATEGY.md`

Then refresh supporting source-of-truth files when relevant:

- product catalogue work:
  - `apps/web/products.js`
- quote / pricing / scope work:
  - `apps/web/quoteCalculator.js`
  - `apps/web/pricingRules.js`
  - `apps/web/installRates.js`
  - `apps/web/underlay.js`
  - `apps/web/skirtingScotia.js`
  - `apps/web/removalRates.js`
  - `apps/web/locationZones.js`
- analytics / lead capture work:
  - `apps/web/tracking.js`
- chatbot assistant work:
  - `apps/web/chatbot/CHATBOT_AGENT.md`
  - `apps/web/chatbot/CHATBOT_MEMORY.md`
  - `apps/web/chatbot/CHATBOT_AGENT_LOOP.md`
  - `apps/web/chatbot/CHATBOT_CONVERSATION_FLOWS.md`
  - `apps/web/chatbot/CHATBOT_JSON_SCHEMA.md`
  - `apps/web/chatbot/INTEGRATION.md`
- SEO / page work:
  - active product pages, suburb pages, blog pages, sitemap, and robots files directly affected by the task

## Execution Priority Order

Use this order when scores are close or tradeoffs are unclear:

1. Conversion
2. Quote accuracy
3. Core SEO conversion pages
4. Product SEO pages
5. Suburb pages
6. Blog authority pages
7. Internal linking
8. Chatbot assistant / guided conversion
9. Analytics tracking
10. Lead capture without email
11. Backlinks
12. Future SaaS positioning documentation only, with execution approval required

## Agent Roles

All agents must follow the protected-file rules. Do not edit quote flow, floorplan tool, pricing logic, product data, backend/API/email logic, Supabase functions, or chatbot live integration unless the user explicitly requests that work.

### Chatbot Agent

Purpose: improve the chatbot as a conversion assistant layer.

Responsibilities:

- improve product guidance conversations
- improve quote explanation
- improve missing information collection
- improve quote validation support
- improve routing to `quote.html`, `products.html`, `floorplan.html`, and `quote-review.html`
- improve structured JSON output
- improve chatbot memory files
- improve chatbot UX only when safe

Hard rules:

- chatbot is assistant only
- chatbot must not calculate prices
- chatbot must not expose internal rates
- chatbot must not replace quote flow
- chatbot must not modify `quoteCalculator.js`
- chatbot must not modify `pricingRules.js`
- chatbot must not modify `products.js`
- chatbot must not change `productSelection.js` unless explicitly approved
- chatbot must not auto-fill forms unless the user confirms

Safe chatbot task types allowed without approval:

- edit files inside `apps/web/chatbot/`
- update chatbot memory
- update chatbot conversation flows
- update chatbot JSON schemas
- improve chatbot copy
- improve chatbot routing suggestions
- improve chatbot safety rules
- improve chatbot tests/docs

Chatbot task types requiring approval:

- injecting chatbot into new live pages
- changing `quote.html`
- changing `products.html`
- modifying `productSelection.js`
- modifying any pricing-related file
- enabling auto-fill into quote form

Forbidden chatbot task types:

- chatbot price calculation
- chatbot displaying estimated price
- chatbot modifying `quoteCalculator.js`
- chatbot overriding product or pricing logic

### SEO Strategist Agent

Purpose: own topic clusters, keyword intent, internal link graph, and the content roadmap.

Responsibilities:

- map every important page to a topic cluster and search intent
- identify missing topical clusters, orphan pages, duplicate semantic intent, and weak internal links
- prioritize pages that strengthen commercial, local, comparison, problem/risk, project, and utility clusters
- protect against generic AI filler, keyword stuffing, thin suburb pages, and fake authority
- ensure every SEO task has a conversion path toward `quote.html`, `quote-review.html`, `floorplan.html`, or `products.html`

### Onsite Optimization Agent

Purpose: own page-level crawl clarity and search presentation.

Responsibilities:

- improve title/meta/H1 alignment
- maintain logical heading hierarchy
- add or refine schema only when it matches visible content
- keep canonical, sitemap, robots, FAQ, and breadcrumb opportunities clean
- improve page structure without removing live product interaction

### CRO Agent

Purpose: own conversion hierarchy and mobile decision flow.

Responsibilities:

- improve CTA hierarchy, section flow, and quote-start momentum
- reduce scroll friction and competing actions
- keep mobile flows simple, skimmable, and easy to tap
- preserve premium trust while guiding users toward quote, validation, product browsing, floorplan tool, or contact/help
- avoid changing quote calculation or quote step logic unless explicitly requested

### Content Quality Agent

Purpose: prevent generic AI content, duplication, overexplaining, and weak suburb pages.

Responsibilities:

- reject or rewrite content that lacks flooring-specific detail, installation nuance, decision value, or conversion purpose
- compress bloated copy into clear sections, FAQs, tables, guide blocks, or internal links
- ensure every important page includes practical trade logic, product tradeoffs, cost implications, installation considerations, preparation risks, measurement issues, apartment/site constraints, quote comparison insight, maintenance implications, or real operational detail
- prevent fake reviews, fake guarantees, fake projects, and thin doorway pages

### Technical SEO Agent

Purpose: own technical crawl health, page speed, schema hygiene, and accessibility.

Responsibilities:

- maintain sitemap, robots, canonical tags, structured data, image SEO, performance, and accessibility quality
- identify Core Web Vitals risks, layout shifts, oversized images, duplicated CSS, blocking scripts, and unnecessary JavaScript
- keep SEO improvements lightweight and mobile-first
- validate links, schema, no horizontal overflow, and page load risks after changes

### Project Proof Agent

Purpose: own real project/case-study backlog and trust proof structure.

Responsibilities:

- prioritize real project content over generic blogs where possible
- define case-study data needs: suburb, property type, flooring type, product/range, project size, preparation work, constraints, customer decision context, timeline, outcome, and photos
- never invent fake projects
- create documentation/backlog placeholders when real project data is missing

### Utility Moat Agent

Purpose: own calculators, quote validation, floorplan entry points, and decision tools.

Responsibilities:

- prioritize useful tools and interactive systems over generic content volume
- improve entry points to quote tool, quote validation tool, floor plan measurement tool, area/wastage calculators, product comparison, visual selection, and quote clarity checklists
- protect quote/pricing/floorplan logic while improving discoverability, UX, and conversion paths around those utilities

### Internal Linking Agent

Purpose: own crawl graph density, contextual link quality, and semantic page relationships.

Responsibilities:

- identify orphan pages, weakly connected pages, and missing parent/child/sibling relationships
- add natural internal links toward quote, quote review, floorplan, product, guide, suburb, and project pathways
- avoid footer-only linking, random link dumping, and repeated exact-match anchor spam
- preserve premium UX and avoid cluttering pages with link blocks that do not help the customer decide

### Trust Signal Agent

Purpose: own real trust proof, process clarity, and customer confidence.

Responsibilities:

- strengthen real project proof, installation realism, quote clarity, process clarity, operational transparency, and flooring expertise
- communicate installation trust through scope clarity, process clarity, installation detail awareness, preparation discipline, quote transparency, real project proof, and flooring decision guidance
- avoid fake urgency, fake scarcity, fake badges, fake reviews, fake guarantees, and exaggerated claims
- avoid generic quality claims such as “best quality,” “premium workmanship,” “Sydney’s best flooring,” or similar unsupported superlatives
- prefer real installation details, process explanations, project examples, scope guidance, operational clarity, and visual craftsmanship proof
- keep trust copy concise and grounded in real flooring operations
- support conversion without making the estimate feel unreliable

### Information Architecture Agent

Purpose: own scalable page organization, navigation clarity, and semantic structure.

Responsibilities:

- maintain clean hierarchy, semantic URL structure, predictable navigation, and logical page relationships
- prevent disconnected pages, random content creation, orphan structures, and overlapping navigation
- classify page intent, funnel stage, decision stage, and conversion destination before page creation
- protect existing live quote, product, and floorplan pathways

### Analytics Intelligence Agent

Purpose: own measurement quality, behavior signals, and data-informed backlog prioritization.

Responsibilities:

- improve safe tracking for quote starts, quote completion, quote review usage, floorplan usage, product interactions, CTA clicks, and friction signals
- use behavior data to prioritize SEO, CRO, UX, and content refresh work
- support structured data capture without collecting unnecessary data
- avoid backend, email, Supabase, or analytics architecture overhauls without owner approval

### Friction Detection Agent

Purpose: own user-effort reduction across pages and conversion transitions.

Responsibilities:

- identify abandoned flows, dead-end pages, excessive cognitive load, unclear instructions, mobile friction, form hesitation points, and weak transitions
- prioritize reducing uncertainty and effort
- keep mobile UX clean, compact, and easy to skim
- avoid changing pricing logic, quote calculations, measurement accuracy, or backend systems

### Content Refresh Agent

Purpose: own existing-page improvement before unnecessary new page creation.

Responsibilities:

- audit strong pages for outdated wording, weak CTAs, missing links, weak trust signals, schema drift, content bloat, and mobile UX issues
- refresh high-value pages before creating overlapping new pages
- identify cannibalization risks and recommend merges for weak overlapping pages
- preserve uniqueness, concise copy, and premium UX consistency

## Hard Rules

- Keep UI clean, premium, and minimal.
- Build pages as acquisition and decision assets, not generic content pages.
- Every page must drive quote start, quote validation, or decision clarity.
- Every SEO/content page must pass the 5-second understanding test: what it is, what to do next, and why Operon is different.
- Every SEO/content page must include a primary quote CTA and secondary quote validation CTA in hero, mid-page, or end-page positions where natural.
- Content must educate, clarify scope, reduce uncertainty, and route users toward `quote.html` or `quote-review.html`.
- Apply the Operon Scope Standard quietly as an internal framework across SEO, CRO, quote review, product pages, suburb pages, comparison guides, chatbot support and future workflow logic. It should improve product definition, area clarity, installation scope, site/access context, preparation/risk clarity, finishing detail, commercial clarity, exclusions and final confirmation without becoming a public slogan.
- Do not overuse the term "Operon Scope Standard" in customer-facing pages. Prefer plain wording such as "clear scope before price comparison", "know what is included before you decide", and "final details confirmed before installation."
- Use warm off-white backgrounds, white cards, charcoal CTAs, and bronze only as a subtle accent.
- Stay mobile-first.
- Do not clutter the homepage.
- Position quote validation as quote clarity / scope review, never as cheapest-price comparison.
- Homepage is not the full quote-flow page. Keep it as a clean premium conversion, trust, and SEO-support page.
- The full quote flow lives on `quote.html`; all quote CTAs should navigate to `quote.html`.
- SEO page builds must not modify `quote.html`, `floorplan.html`, pricing logic, quote calculation, product data logic, or backend email. They may only link into `quote.html` and `quote-review.html`.
- SEO/product pages must not become static brochure pages. Preserve working live product selection sections, product cards, product browsing interaction, product-related JavaScript, filtering/sorting, and recommendation behavior.
- The SEO component system must wrap and improve the product interaction layer, not replace it. Refactor layout, spacing, typography, section hierarchy, CTA placement, responsive/mobile UX, SEO content structure, and visual clarity only.
- Product interaction is strategically valuable for engagement, dwell time, conversion, and differentiation. Treat it as a curated, premium exploration layer, not clutter.
- On SEO/product pages, product interaction should appear after the hero, quick value cards, and short explanation where practical. Product cards should stay compact, elegant, skimmable, mobile-friendly, and show a clear selected state.
- Preserve homepage SEO with concise sections, internal links, schema, and lower-page/expandable content without reintroducing a heavy form.
- Keep customer-facing copy plain English wherever possible, without renaming the underlying pricing variables unless needed for code safety.
- Customer-facing UI must be decision-first: short labels, clear selected states, and minimal helper text.
- Do not turn option cards into explanatory paragraphs; only add helper text when it prevents a real mistake or guides the next action.
- Hide redundant status copy such as “progress saved” and keep backend thresholds, internal formulas, implementation labels, and system-save language out of customer screens.
- Secondary explanation copy must stay lean: shorten long paragraphs under headings, repeated CTA helper lines, “no obligation” reassurance lines, and repeated quote-process explanations.
- Secondary explanation should usually be one neat line, or removed completely when the heading, card title, or CTA already makes the section clear.
- Preferred microcopy: `Start estimate`, `Review quote`, `Final details confirmed before installation`, and `Structured estimate first. Site confirmation before work starts.`
- Avoid defensive or over-explained copy such as long “choose your flooring type, enter your area...” paragraphs, repeated “the fastest route depends...” sections, and unnecessary quote-process explanations.
- Do not add a visualiser or reintroduce one into customer-facing scope.
- Do not expose internal labour rate, margin, material rate, surcharge formula, or installer cost.
- Do not duplicate pricing logic.
- `apps/web/quoteCalculator.js` remains the only instant quote calculation source.
- `apps/web/products.js` remains the central product source.
- Floorplan measurement must not apply wastage.
- Wastage only applies inside `apps/web/quoteCalculator.js`.
- Do not create spammy or thin duplicate suburb pages.
- Do not use generic filler copy.
- Do not rely on generic quality claims such as “best quality,” “premium workmanship,” or “Sydney’s best flooring.” Installation trust must come from specific details, process clarity, preparation discipline, scope guidance, project proof, and operational clarity.
- Do not publish long undifferentiated text blocks, repeated templates, or generic AI SEO content.
- Do not create suburb pages without local uniqueness, practical flooring recommendations, quote explanation, scope clarity, and CTA.
- Do not push to GitHub, `dev`, Netlify, or `main` unless the user explicitly asks.
- Do not deploy unless the user explicitly asks.
- Chatbot improvement is a standing candidate category for future `continue execution` runs, but it is not mandatory execution. Only run chatbot tasks when they rank high enough and stay inside the safe chatbot task rules.

## Continue Execution Modes

### Default

When the user says:

`continue execution`

Codex must:

1. read the source-of-truth files
2. generate a ranked backlog of 50 tasks
   - include the required SEO, CRO, technical SEO, internal linking/schema, chatbot, analytics, QA, project proof, and utility candidates
3. score every task using `priority_score = ((seo_impact + conversion_impact + trust_impact + utility_impact + risk_reduction + data_capture_value) × confidence) / effort`
4. save all 50 tasks into `apps/web/task_queue.json`
5. execute tasks in ranked order
6. complete up to 8 tasks unless blocked

### Long Mode

When the user says:

`continue execution long mode`

Codex must complete up to 15 tasks unless blocked.

### Overnight Mode

When the user says:

`continue execution overnight`

Codex must complete up to 25 tasks unless blocked.

## Task Queue Requirements

`apps/web/task_queue.json` must stay as the ranked source-of-truth backlog for unattended work.

Every task entry must include:

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

Allowed categories:

- `seo`
- `content`
- `cro`
- `technical_seo`
- `schema`
- `internal_linking`
- `performance`
- `accessibility`
- `homepage`
- `product_page`
- `suburb_page`
- `blog`
- `project_case_study`
- `quote_review`
- `floorplan_entry`
- `chatbot`
- `analytics`
- `qa`
- `documentation`

Every 50-task queue must include at least:

- 8 SEO/content tasks
- 5 CRO tasks
- 5 technical SEO/performance tasks
- 5 internal linking/schema tasks
- 3 chatbot candidate tasks
- 3 analytics/tracking tasks
- 3 QA/stability tasks
- 2 real project/case study candidate tasks
- 2 utility/tool improvement candidate tasks

For chatbot tasks, use:

- `category`: `chatbot`
- `assigned_agent`: `Chatbot Agent`
- `approval_required`: `false` only when all likely affected files are inside `apps/web/chatbot/`

Allowed statuses:

- `pending`
- `in_progress`
- `done`
- `blocked`

## Stop Early Only If

- a destructive change needs approval
- a missing external dependency blocks safe progress
- continuing may break quote logic
- continuing may expose internal rates
- continuing may corrupt pricing or product data
- a push or deploy step is required but not explicitly approved

## Validation Standard

Validate after every completed task.

Minimum validation rule:

1. confirm the targeted behavior changed as intended
2. confirm no quote logic regression was introduced
3. confirm no pricing logic changed
4. confirm no internal pricing detail became customer-visible
5. confirm no product data was corrupted
6. confirm no floorplan logic changed unless requested
7. confirm affected links, storage, or event hooks still work
8. confirm mobile behavior still makes sense when UI is touched
9. confirm title/meta/H1 still align when SEO pages are touched
10. confirm schema matches visible content when schema is touched
11. confirm CTAs still route correctly
12. confirm no duplicate content, fake claims, or keyword stuffing was introduced
13. confirm no performance-heavy asset was added without reason

For SEO/content tasks, additionally verify:

1. clear search intent
2. clear conversion path
3. useful internal links added where natural
4. content strengthens a defined topic cluster
5. no generic filler or thin doorway content
6. no live product interaction was removed or replaced

For chatbot-related tasks, additionally verify:

1. only allowed files changed
2. chatbot does not calculate prices
3. chatbot does not expose internal rates
4. chatbot routes users to correct pages
5. chatbot responses are short and conversion-focused
6. chatbot asks one question at a time
7. chatbot memory aligns with current site logic
8. no live quote/product flow is broken

## PROJECT_MEMORY Update Rule

After every `continue execution` run, update `apps/web/PROJECT_MEMORY.md` with:

- tasks completed
- files changed
- validation performed
- known risks
- next best tasks
- blocked items

## Run Output Format

After every `continue execution` run, output:

1. `50-task queue generated or updated`
2. `Tasks completed this run`
3. `Files changed`
4. `Validation completed`
5. `Blockers`
6. `Remaining high-priority tasks`
7. `Next recommended command`

## Workflow

Always:

1. analyze
2. rank
3. implement safely
4. validate after each task
5. log the run
6. continue until the mode limit or a real blocker is reached
