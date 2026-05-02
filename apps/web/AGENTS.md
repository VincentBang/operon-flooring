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
- SEO / page work:
  - active product pages, suburb pages, blog pages, sitemap, and robots files directly affected by the task

## Execution Priority Order

Use this order when scores are close or tradeoffs are unclear:

1. Conversion
2. Quote accuracy
3. Product catalogue
4. SEO product pages
5. Suburb pages
6. Internal linking
7. Analytics tracking
8. Lead capture without email
9. Maintenance / blog content
10. Backlink preparation
11. Future SaaS infrastructure

## Hard Rules

- Keep UI clean, premium, and minimal.
- Use warm off-white backgrounds, white cards, charcoal CTAs, and bronze only as a subtle accent.
- Stay mobile-first.
- Do not clutter the homepage.
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

## Continue Execution Modes

### Default

When the user says:

`continue execution`

Codex must:

1. read the source-of-truth files
2. generate a ranked backlog of 50 tasks
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
