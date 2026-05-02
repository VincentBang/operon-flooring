# Operon Agent Loop

Source-of-truth status: permanent unattended execution loop for Codex runs.

## Purpose

When the owner says `continue execution`, Codex must behave like a ranked backlog executor instead of a one-task assistant.

The system should support longer unattended runs while preserving pricing safety, data integrity, and quote accuracy.

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

Refresh additional files when relevant:

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
- page / SEO tasks:
  - affected product pages
  - affected suburb pages
  - affected blog pages
  - `apps/web/sitemap.xml`
  - `apps/web/robots.txt`

## Ranked Backlog Rule

Every run must:

1. generate or refresh a ranked backlog of 50 tasks
2. score each task using:

`priority_score = (impact × confidence) / effort`

3. save all 50 tasks into `apps/web/task_queue.json`
4. sort the queue from highest `priority_score` to lowest
5. preserve dependency order and do not start blocked dependency chains early

## Task Schema

Each task in `apps/web/task_queue.json` must include:

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

## Planner Step

Before execution begins:

1. read the current queue if it exists
2. compare queue items against current repo state and source-of-truth files
3. refresh rankings if business priorities, data, or blockers changed
4. ensure the 50-task backlog spans:
   - homepage / conversion
   - products page
   - product data
   - hybrid / laminate / engineered pages
   - suburb pages
   - maintenance / blog content
   - analytics tracking
   - lead capture without email
   - SEO infrastructure
   - QA / stability

## Execution Step

Execute tasks in ranked order.

For each task:

1. mark the task `in_progress`
2. make the change
3. validate immediately
4. mark the task `done` or `blocked`
5. move to the next ranked safe task

Do not stop after one small task.

## Safety Stop Rule

Stop early only if:

- a destructive change needs approval
- a missing external dependency blocks safe progress
- continuing may break quote logic
- continuing may expose internal rates
- continuing may corrupt pricing or product data
- a push or deploy step is required but not explicitly approved

Otherwise keep executing until the mode limit is reached.

## Validation Rule

Validate after every task.

Minimum checks:

1. target behavior changed as intended
2. no quote logic regression
3. no duplicated pricing logic introduced
4. no internal rates surfaced to customers
5. affected links, storage, analytics, or UI still work
6. mobile UX still holds if a UI task was touched

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
