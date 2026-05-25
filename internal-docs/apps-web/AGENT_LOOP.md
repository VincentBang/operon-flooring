# Operon Agent Loop

Source-of-truth status: permanent unattended execution loop for Codex runs.

## Purpose

When the owner says `continue execution`, Codex must behave like a ranked backlog executor instead of a one-task assistant.

The system supports longer unattended runs while preserving pricing safety, data integrity, quote accuracy, product interaction, and the premium customer experience.

Strategic operating model:

`Traffic -> Trust -> Instant Quote -> Quote Validation -> Data Capture -> System Intelligence`

Current execution phase is Phase 1 only: high-intent SEO traffic, conversion to quote, structured data capture, homepage/product/suburb/blog/guide optimization, analytics, technical SEO, and trust building.

Do not build SaaS, marketplace, pricing-logic changes, quote-calculation changes, backend-email changes, or product-data changes unless explicitly requested.

Protected unless specifically requested:

- `apps/web/quote.html`
- `apps/web/floorplan.html`
- `apps/web/quoteCalculator.js`
- `apps/web/pricingRules.js`
- `apps/web/products.js`
- `apps/web/productSelection.js`
- `apps/web/installRates.js`
- `apps/web/underlay.js`
- `apps/web/skirtingScotia.js`
- `apps/web/removalRates.js`
- `apps/web/locationZones.js`
- backend, API, email, Supabase, and chatbot live integration files

## Mode Detection

### Default Mode

Command:

`continue execution`

Run limit:

- complete up to 8 tasks unless blocked

### Long Mode

Command:

`continue execution long mode`

Run limit:

- complete up to 15 tasks unless blocked

### Overnight Mode

Command:

`continue execution overnight`

Run limit:

- complete up to 25 tasks unless blocked

## Source-Of-Truth Refresh

At the start of every run, read:

1. `apps/web/AGENTS.md`
2. `apps/web/AGENT_LOOP.md`
3. `apps/web/PROJECT_MEMORY.md`
4. `apps/web/OPERON_PRICING_RULES.md`
5. `apps/web/OPERON_SEO_STRATEGY.md`

Refresh additional files only when relevant:

- product catalogue tasks:
  - `apps/web/products.js`
- quote / pricing tasks:
  - `apps/web/quoteCalculator.js`
  - `apps/web/pricingRules.js`
  - `apps/web/installRates.js`
  - `apps/web/underlay.js`
  - `apps/web/skirtingScotia.js`
  - `apps/web/removalRates.js`
  - `apps/web/locationZones.js`
- analytics / lead tasks:
  - `apps/web/tracking.js`
- quote review / comparison tasks:
  - `apps/web/QUOTE_REVIEW_POLICY.md`
  - `apps/web/QUOTE_REVIEW_DATA_ENGINE.md`
  - `apps/web/quote-review.html`
- chatbot tasks:
  - `apps/web/chatbot/CHATBOT_AGENT.md`
  - `apps/web/chatbot/CHATBOT_MEMORY.md`
  - `apps/web/chatbot/CHATBOT_AGENT_LOOP.md`
  - `apps/web/chatbot/CHATBOT_CONVERSATION_FLOWS.md`
  - `apps/web/chatbot/CHATBOT_JSON_SCHEMA.md`
  - `apps/web/chatbot/INTEGRATION.md`
- page / SEO tasks:
  - affected product pages
  - affected suburb pages
  - affected blog pages
  - `apps/web/sitemap.xml`
  - `apps/web/robots.txt`

## SEO Intelligence Loop

Every unattended run must evaluate:

1. missing topical clusters
2. weak internal links
3. thin content risks
4. duplicate semantic intent
5. orphan pages
6. weak title/meta/H1 alignment
7. missing FAQ opportunities
8. missing schema opportunities
9. weak E-E-A-T and trust signals
10. pages with weak conversion paths
11. pages lacking unique utility
12. pages with excessive copy bloat
13. mobile UX weaknesses
14. image SEO weaknesses
15. Core Web Vitals risks

Continuously strengthen:

- semantic authority
- topical depth
- crawl graph density
- quote-start pathways
- quote-review pathways
- floorplan-tool pathways
- product discovery pathways
- real project proof
- utility moat

Forbidden:

- generic AI filler
- duplicated suburb templates
- keyword stuffing
- fake project claims
- fake reviews
- fake guarantees
- bloated SEO text
- thin doorway pages

## Semantic Authority Map

Maintain and expand these topic clusters:

1. Flooring quotes Sydney
2. Hybrid flooring Sydney
3. Laminate flooring Sydney
4. Engineered timber flooring Sydney
5. Flooring installation cost
6. Flooring quote review / validation
7. Flooring measurement / floor plans
8. Flooring comparison guides
9. Flooring problems and risks
10. Subfloor preparation
11. Apartment flooring
12. Flooring for homes, investors, and builders
13. Flooring maintenance
14. Flooring visual selection
15. Local suburb flooring pages
16. Real project case studies

Every new or edited page must define:

- target intent
- topic cluster
- primary user question
- conversion path
- internal links in
- internal links out
- schema opportunity
- trust proof opportunity
- risk of duplication

## Content Quality Enforcement

Reject or rewrite content that:

- sounds generic
- repeats existing site copy
- lacks flooring-specific detail
- lacks installation nuance
- lacks decision value
- lacks conversion purpose
- weakens premium UX
- creates thin suburb pages
- creates fake authority
- overuses keywords unnaturally
- adds long paragraphs without user value

Every important content page must include at least one of:

- practical flooring decision guidance
- product tradeoff
- cost implication
- installation consideration
- preparation risk
- measurement issue
- apartment or site constraint
- quote comparison insight
- maintenance implication
- real project or operational detail

## Internal Link Graph Rules

Every important page should link:

1. upward to a parent commercial page
2. sideways to related comparison or problem pages
3. downward to supporting guides, suburb pages, or project pages
4. toward one or more conversion paths:
   - `quote.html`
   - `quote-review.html`
   - `floorplan.html`
   - `products.html`

Target:

- 3 to 8 contextual internal links per important page
- avoid footer-only linking
- avoid random link dumping
- avoid repeated exact-match anchor spam
- use natural anchors that match user intent

Codex must identify orphan pages and weakly connected pages during every run.

## CRO Optimization Loop

Every unattended run must look for:

1. weak CTA placement
2. unclear next step
3. excessive section length
4. weak mobile hierarchy
5. trust gaps
6. poor quote-start momentum
7. poor quote-review momentum
8. pages that educate but do not convert
9. pages with too many competing actions
10. pages with unclear product paths
11. quote review surfaces that expose backend/process language instead of customer guidance
12. quote review sections that compare price before clarifying scope

Priority conversion paths:

1. Start instant quote
2. Validate existing quote
3. Browse flooring products
4. Use floor plan tool
5. Read relevant guide
6. Contact / request help

Every SEO page must support at least one conversion path.

## Operon Scope Standard Governance

The Operon Scope Standard is a foundational operational framework that helps customers compare flooring quotes based on scope clarity, not price alone.

Use it quietly across content, SEO, CRO, product, suburb, quote-review, and future workflow tasks. Do not turn it into a forced public slogan.

Every relevant content, SEO, CRO, quote-review, product-page, suburb-page, comparison-guide, or marketing task must check:

1. Does this strengthen scope clarity?
2. Does this reduce customer uncertainty?
3. Does this avoid cheapest-price positioning?
4. Does this improve trust?
5. Does this support quote review intelligence?
6. Does this help customers compare properly?
7. Does this preserve premium minimal UX?
8. Does this avoid generic flooring marketing?

Scope Standard dimensions:

- product definition
- area and measurement
- installation scope
- site and access
- risk and preparation
- finishing and accessories
- commercial clarity
- quality signals
- exclusions and assumptions
- final site confirmation

Customer-facing language should be plain:

- "Clear scope before price comparison"
- "Final details confirmed before installation"
- "Know what is included before you decide"
- "Compare flooring quotes by scope, not just total price"
- "A cheaper quote may not describe the same job"

Avoid:

- proprietary-standard language
- forced "Operon Scope Standard" branding
- cheapest-price positioning
- generic "premium workmanship" claims
- fear tactics or competitor attacks

## Quote Review Governance Loop

When a task touches quote review, validate these rules before and after changes:

1. scope is compared before price
2. OCR/API processing stays backend-only
3. uploaded files remain private or temporary by design
4. raw files are treated as temporary evidence, not the permanent intelligence layer
5. structured extracted data is favored over long-term raw storage
6. no duplicate pricing logic is added inside quote review
7. no internal rates are exposed in UI, payloads, or docs intended for customers
8. customer-facing privacy copy stays clear, short, and accurate
9. comparable estimates use existing pricing logic only when enough fields exist
10. if exact product match is unavailable, category-level comparison is used where safe instead of pretending comparison is impossible
11. mobile review UI stays clear without expanding every detail by default
12. GPT-4.1 mini quote review work stays multi-stage, not one giant prompt
13. extraction confidence and comparison confidence remain separate
14. output reads like a flooring consultant review, not an OCR summary, chatbot response, or spreadsheet
15. price is interpreted through scope clarity and comparison confidence
16. quote review reduces uncertainty instead of adding technical complexity
17. AI stays invisible in customer-facing language
18. risk dimensions are used instead of good/bad quote labels
19. likely variation risks are educational, not fear-based
20. quote review converts through trust and decision confidence, not aggressive selling
21. outcome tracking is treated as structured intelligence, not raw file retention
22. Operon Scope Standard is used to judge completeness before price comparison
23. confidence is separated into extraction, scope, comparison, product match, price, and site risk where relevant
24. next-best-action guidance recommends one calm step, not a stack of competing CTAs
25. low-confidence or unusual reviews escalate to manual clarification instead of pretending certainty
26. future price-positioning labels remain disabled until enough structured historical data exists

Quote review goals:

- reduce uncertainty
- improve trust
- improve scope clarity
- improve conversion quality
- collect structured operational intelligence
- learn from outcomes, including won/lost reasons, variations, returned customers, and missing-scope issues
- predict likely variation risks calmly
- assess installation quality evidence without attacking competitors
- recommend one appropriate next best action

Quote review should not optimize for:

- maximum AI output
- maximum document summary length
- maximum token usage
- cheapest-price comparison

Quote review intelligence candidates for future task queues:

- add or improve outcome capture for quote-review-to-quote conversions
- map missing scope to follow-up education content
- refine variation risk prediction from extracted quote fields
- improve Operon Scope Standard scoring
- audit confidence labels for generic or misleading scores
- add human review escalation triggers for unusual quote structures
- normalize structured competitor wording without exposing sensitive data publicly

## Site Quality Governance

Maintain consistent:

- typography
- spacing
- button styles
- card styles
- headings
- CTA hierarchy
- mobile layout
- section rhythm
- visual density
- premium feel

Avoid:

- random styling
- inconsistent layouts
- excessive helper text
- overexplaining
- clutter
- duplicate sections
- visual noise

Operon must feel like a clean, structured, premium flooring decision system.

## Performance Budget Rules

Avoid:

- oversized images
- unnecessary JavaScript
- unnecessary libraries
- duplicated CSS
- blocking scripts
- layout shifts
- heavy stock image usage
- excessive third-party scripts

Prioritize:

- compressed images
- WebP or AVIF where suitable
- lazy loading
- stable dimensions
- mobile speed
- clean CSS reuse
- Core Web Vitals stability

Every visual or content improvement must consider page speed.

## Real Project Authority Loop

Prioritize real project content over generic blogs where possible.

Project pages should include:

- suburb
- property type
- flooring type
- product or range if known
- project size if available
- preparation work
- installation constraints
- customer decision context
- timeline
- visual outcome
- before/after photos if available
- internal links to product, suburb, quote, and guide pages

Do not invent fake projects. If no real project data exists, create placeholders only in documentation or backlog, not live fake pages.

## Utility Moat Prioritization

Prioritize useful tools and interactive systems over generic content volume.

High-value utility assets:

- quote tool
- quote validation tool
- floor plan measurement tool
- flooring area calculator
- wastage calculator
- flooring cost guide
- product comparison tool
- visual selection flow
- quote clarity checklist

Utility assets should:

- reduce customer uncertainty
- increase time on site
- support conversion
- capture structured data
- differentiate Operon from generic flooring websites

## Anti-Bloat Rule

Continuously simplify:

- repeated helper text
- duplicated paragraphs
- unnecessary explanations
- weak subcopy
- redundant CTAs
- generic SEO sections
- long blocks that hurt mobile UX

Preserve:

- clarity
- speed
- premium feel
- decision simplicity
- crawlable content
- conversion paths

Do not remove valuable SEO content. Instead:

- relocate
- compress
- structure
- convert to FAQ
- convert to guide page
- convert to internal link block

## Progressive Disclosure Check

During every SEO, CRO, UX, or content task, check:

1. Is visible copy too wordy?
2. Should explanation be moved into an accordion?
3. Is the accordion answer useful enough?
4. Does the page still clearly communicate its purpose without expanding anything?
5. Does the hidden content strengthen SEO without becoming spam?
6. Is mobile UX still clean?

Visible copy must stay short, premium, direct, and easy to scan. Accordions, FAQs, and details blocks can carry deeper explanation when they answer real customer questions about quote scope, product tradeoffs, installation risks, floor preparation, underlay/acoustic requirements, apartment constraints, cost variation, or maintenance.

Do not use expandable content for keyword stuffing, generic filler, duplicated answers, or hiding all important page meaning. If the answer becomes long, link to or create a dedicated guide page.

## Business Impact Governance

Prioritize work that improves:

- quote starts
- quote completion rate
- quote review usage
- floorplan usage
- structured data capture
- trust
- conversion efficiency
- high-intent organic traffic
- user engagement quality
- operational leverage

Avoid prioritizing:

- vanity traffic
- cosmetic-only changes
- decorative UI work without measurable value
- generic content volume
- low-intent SEO pages

## Content Refresh Loop

Continuously audit existing pages for:

- outdated wording
- weak CTAs
- missing internal links
- weak trust signals
- declining differentiation
- duplicate semantic intent
- schema drift
- content bloat
- mobile UX issues

Refresh strong pages before creating unnecessary new pages.

## Search Intent Classification

Every page must classify:

- primary intent
- secondary intent
- funnel stage
- decision stage
- conversion destination

Intent types:

- transactional
- comparison
- informational
- validation
- local-commercial
- measurement
- problem-solving

Avoid pages competing for identical intent.

## Keyword Cannibalization Prevention

Before creating new pages:

- audit overlapping intent
- detect duplicate topic coverage
- identify weak competing pages
- merge overlapping weak pages where needed

Prefer strong semantic clusters over many overlapping pages.

## Trust Signal Governance

Continuously strengthen:

- real project proof
- installation realism
- quote clarity
- process clarity
- operational transparency
- flooring expertise
- practical decision guidance

Avoid:

- fake urgency
- fake scarcity
- fake trust badges
- fake reviews
- exaggerated claims

## Structured Data Capture Strategy

Prioritize flows that safely capture:

- flooring preferences
- area sizes
- suburb demand
- property types
- installation concerns
- quote comparison patterns
- product preferences
- scope complexity

Captured data should support:

- future quote intelligence
- UX improvement
- SEO prioritization
- operational insights
- future AI systems

Do not collect unnecessary data.

## Experimentation Loop

Allow safe experimentation for:

- CTA wording
- heading hierarchy
- section ordering
- trust placement
- intent routing
- quote-start pathways
- product selection pathways

Track:

- quote starts
- interaction depth
- conversion rate
- bounce reduction
- engagement quality

Do not experiment with:

- pricing logic
- quote calculations
- measurement accuracy
- backend systems

## Information Architecture Governance

Continuously maintain:

- clean hierarchy
- semantic URL structure
- scalable page organization
- predictable navigation
- logical page relationships

Avoid:

- disconnected pages
- random content creation
- overlapping navigation
- orphan structures

## Reusable Content Block Strategy

Create reusable structured content blocks for:

- FAQs
- suburb context
- installation process
- flooring comparisons
- trust sections
- quote guidance
- CTA sections

Reusable blocks must:

- remain customizable
- preserve uniqueness
- avoid duplicate copy
- maintain premium UX consistency

## Competitor Defense Loop

Continuously strengthen differentiation against:

- generic flooring SEO sites
- quote marketplaces
- AI-generated spam sites
- local flooring competitors

Strengthen Operon through:

- utility
- trust
- structured workflows
- quote validation
- measurement systems
- operational intelligence
- real project proof

## User Friction Detection

Continuously identify:

- abandoned flows
- dead-end pages
- excessive cognitive load
- unclear instructions
- mobile friction
- form hesitation points
- weak conversion transitions

Prioritize reducing uncertainty and effort.

## Asset Compounding Strategy

Reuse and strengthen:

- guides
- comparisons
- FAQs
- visuals
- project pages
- quote education
- measurement insights

One strong asset should reinforce multiple pages and pathways.

## Strategic Continuity Rule

Every unattended run must preserve:

- Operon positioning
- utility-first philosophy
- premium UX direction
- concise copy policy
- SEO quality standards
- anti-bloat rules
- protected pricing architecture

Avoid strategic drift over time.

## Human Review Escalation

Require owner approval before:

- major homepage restructuring
- navigation redesign
- quote funnel restructuring
- pricing-related UX changes
- mass schema deployment
- large-scale content deletion
- major dependency additions
- analytics architecture overhaul

## AI Search Readiness

Structure content for:

- semantic clarity
- entity relevance
- concise answers
- FAQ extraction
- structured comparisons
- utility integration

Prioritize helpfulness and operational clarity over keyword density.

## Closed-Loop Learning Model

The long-term operating cycle is:

`Traffic -> Behavior -> Analytics -> Prioritized Improvements -> Better Conversion -> More Structured Data -> Better Intelligence -> Better SEO -> More Traffic`

Every unattended run should strengthen this feedback loop.

## Ranked Backlog Rule

Every run must:

1. generate or refresh a ranked backlog of 50 tasks
2. score each task using:

`priority_score = ((seo_impact + conversion_impact + trust_impact + utility_impact + risk_reduction + data_capture_value) × confidence) / effort`

3. save all 50 tasks into `apps/web/task_queue.json`
4. sort the queue from highest `priority_score` to lowest
5. preserve dependency order and do not start blocked dependency chains early
6. avoid unsafe tasks unless explicitly approved

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

## Task Schema

Each task in `apps/web/task_queue.json` must include:

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

Use `category = "chatbot"` for chatbot assistant tasks.

Allowed statuses:

- `pending`
- `in_progress`
- `done`
- `blocked`

## Planner Step

Before execution begins, Codex must:

1. read all source-of-truth files
2. read current `apps/web/task_queue.json` if present
3. inspect current repo structure
4. identify changed priorities
5. detect weak SEO clusters
6. detect orphan or weak pages
7. detect content bloat
8. detect pages without clear conversion path
9. detect schema gaps
10. detect technical SEO issues
11. detect mobile UX risks
12. generate or refresh the 50-task queue
13. rank by updated priority score
14. execute highest-ranked safe tasks

For any SEO, suburb, product, guide, project, or blog task, identify before editing:

- target intent
- topic cluster
- page role
- primary user question
- conversion path
- affected files
- internal links in and out
- schema opportunity
- trust proof opportunity
- risk of duplication
- confirmation that no pricing, quote calculation, product data, floorplan, backend email, or chatbot live integration logic is affected
- confirmation that protected files are untouched unless the user explicitly requested otherwise

Reject or rewrite tasks that would create generic filler content, duplicated suburb templates, long unstructured copy, weak CTAs, fake claims, or pages that do not help users decide.

Chatbot tasks are candidates, not mandatory execution. Execute chatbot tasks only when they rank high enough, stay inside safe chatbot rules, and do not alter live integration unless explicitly requested.

## Execution Step

Execute tasks in ranked order.

For each task:

1. mark the task `in_progress`
2. make the smallest safe change that creates compounding value
3. validate immediately
4. update related documentation if needed
5. update internal links if relevant
6. update sitemap if a new public page is added
7. mark the task `done` or `blocked`
8. continue to the next ranked safe task

Do not stop after one small task unless blocked.

## Safe Chatbot Execution Rules

Allowed chatbot work without approval:

- edit files inside `apps/web/chatbot/`
- update chatbot memory
- update chatbot conversation flows
- update chatbot JSON schemas
- improve chatbot copy
- improve chatbot routing suggestions
- improve chatbot safety rules
- improve chatbot tests/docs

Require approval before:

- injecting chatbot into new live pages
- changing `quote.html`
- changing `products.html`
- modifying `productSelection.js`
- modifying any pricing-related file
- enabling auto-fill into quote form
- changing live operator handoff behavior

Forbidden:

- chatbot price calculation
- chatbot displaying estimated price
- chatbot modifying `quoteCalculator.js`
- chatbot overriding product/pricing logic

## Safety Stop Rule

Stop early only if:

- a destructive change needs approval
- a missing external dependency blocks safe progress
- continuing may break quote logic
- continuing may expose internal rates
- continuing may corrupt pricing or product data
- continuing may modify protected files without explicit approval
- a push or deploy step is required but not explicitly approved

Otherwise keep executing until the mode limit is reached.

## Validation Rule

Validate after every task.

Minimum checks:

1. target behavior changed as intended
2. no quote logic regression
3. no pricing logic changed
4. no internal rates exposed
5. no product data corrupted
6. no floorplan logic changed unless requested
7. affected links still work
8. mobile layout still holds
9. title/meta/H1 still align
10. schema matches visible content
11. CTAs still route correctly
12. no duplicate content introduced
13. no fake claims introduced
14. no performance-heavy asset added without reason

For SEO/content tasks also check:

- clear search intent
- clear conversion path
- internal links added where useful
- no keyword stuffing
- no generic filler
- page strengthens a topic cluster

For chatbot-related tasks, additionally validate:

1. only allowed files changed
2. chatbot does not calculate prices
3. chatbot does not expose internal rates
4. chatbot routes users to correct pages
5. chatbot responses are short and conversion-focused
6. chatbot asks one question at a time
7. chatbot memory aligns with current site logic
8. no live quote/product flow is broken

## Logging Rule

After the run, update `apps/web/PROJECT_MEMORY.md` with:

- tasks completed
- files changed
- validation performed
- known risks
- next best tasks
- blocked items

## Multi-Cycle Run History Format

Future automation can append run history without changing deploy behavior.

Each run history entry should include:

- `run_id`: stable timestamp or UUID
- `started_at`: ISO timestamp
- `finished_at`: ISO timestamp
- `mode`: `default`, `long`, or `overnight`
- `local_only`: true unless the user explicitly requested a push or deploy
- `queue_total`: total tasks in `apps/web/task_queue.json`
- `completed_before`: completed task count at run start
- `completed_after`: completed task count at run end
- `completed_task_ids`: task ids completed during the run
- `blocked_task_ids`: task ids blocked during the run
- `remaining_task_ids`: highest-priority remaining task ids
- `files_changed`: local files edited during the run
- `validation_completed`: commands or checks that passed
- `validation_deferred`: checks that still require browser, Netlify, Supabase, or user access
- `notes`: short operational summary

Completed, blocked, and remaining tasks must stay separate so future automation can resume safely.

Run history must not trigger GitHub push, Netlify deploy, Supabase writes, or email sending by itself.

## Permanent Output Format

Each unattended run should report:

1. `50-task queue generated or updated`
2. `Tasks completed this run`
3. `Files changed`
4. `Validation completed`
5. `Blockers`
6. `Remaining high-priority tasks`
7. `Next recommended command`
