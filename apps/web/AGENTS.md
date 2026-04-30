# Operon Flooring Agent System

## Goal
Build a high-conversion flooring quote system that ranks in Sydney and generates leads.

## Priorities (in order)
1. Conversion (quote flow)
2. SEO structure
3. Content expansion
4. Backlinks
5. Optimisation

## Rules
- Keep UI clean and simple
- Do NOT clutter homepage
- Do NOT expose internal pricing logic
- Do NOT add visualiser
- Do NOT break quote logic
- Do NOT push directly to `main`
- Use `dev` for active work and treat `main` as production only

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

## Workflow
Always:
1. analyze
2. improve highest-impact area
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
- keep deployment safety in mind and prefer `dev -> preview -> main`

### SEO Agent
- manage pages, keywords, internal links, and ranking tracker work

### CRO Agent
- monitor funnel drop-off and improve conversion

### Revenue Agent
- track lead → job → revenue → margin
