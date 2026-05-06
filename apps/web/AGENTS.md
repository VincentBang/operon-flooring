# Operon Flooring Agent System

Source-of-truth status: active execution rules for Codex and future agents.

## Mission

Build and maintain a high-conversion flooring quote and measurement system that ranks in Sydney, protects pricing logic, and can continue making safe progress while the owner is away or sleeping.

## Mandatory Read Order

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

## Agent Roles

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

## Hard Rules

- Keep UI clean, premium, and minimal.
- Use warm off-white backgrounds, white cards, charcoal CTAs, and bronze only as a subtle accent.
- Stay mobile-first.
- Do not clutter the homepage.
- Position quote validation as quote clarity / scope review, never as cheapest-price comparison.
- Homepage is not the full quote-flow page. Keep it as a clean premium conversion, trust, and SEO-support page.
- The full quote flow lives on `quote.html`; all quote CTAs should navigate to `quote.html`.
- Preserve homepage SEO with concise sections, internal links, schema, and lower-page/expandable content without reintroducing a heavy form.
- Keep customer-facing copy plain English wherever possible, without renaming the underlying pricing variables unless needed for code safety.
- Customer-facing UI must be decision-first: short labels, clear selected states, and minimal helper text.
- Do not turn option cards into explanatory paragraphs; only add helper text when it prevents a real mistake or guides the next action.
- Hide redundant status copy such as “progress saved” and keep backend thresholds, internal formulas, implementation labels, and system-save language out of customer screens.
- Do not add a visualiser or reintroduce one into customer-facing scope.
- Do not expose internal labour rate, margin, material rate, surcharge formula, or installer cost.
- Do not duplicate pricing logic.
- `apps/web/quoteCalculator.js` remains the only instant quote calculation source.
- `apps/web/products.js` remains the central product source.
- Floorplan measurement must not apply wastage.
- Wastage only applies inside `apps/web/quoteCalculator.js`.
- Do not create spammy or thin duplicate suburb pages.
- Do not use generic filler copy.
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
   - include at least 3 chatbot-related candidate tasks
3. score every task using `priority_score = (impact × confidence) / effort`
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
3. confirm no internal pricing detail became customer-visible
4. confirm affected links, storage, or event hooks still work
5. confirm mobile behavior still makes sense when UI is touched

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
