# Operon Agent Loop

## Execution Mode

The system runs in ranked execution batches.

Each time the user says:

`continue execution`

the system must run a full multi-task cycle instead of stopping after one small change.

## Task Queue Rule

On every `continue execution` run:

1. generate the next 10 tasks
2. rank them by priority score
3. save all 10 tasks into `task_queue.json`
4. execute task 1 immediately
5. after task 1 completes, automatically move to task 2
6. after task 2 completes, automatically move to task 3
7. stop only when:
   - 3 tasks are completed in that session, or
   - a real blocking issue occurs

The remaining tasks stay in queue.

## Priority Scoring

Base formula:

`priority_score = (impact × confidence) / effort`

Execution focus order must still be respected:

1. conversion improvements
2. SEO structure
3. content pages
4. backlinks
5. analytics

Do not pick random tasks just because they are easy.

## Full Iteration Cycle

### Step 1 — Planner

- review `AGENTS.md`
- review `PROJECT_MEMORY.md`
- refresh source-of-truth files when the task touches pricing, SEO, analytics, or product catalogue logic
- read `task_queue.json` if available
- generate the next 10 ranked tasks
- choose the top task
- output the task and reason

### Step 2 — Builder

- implement the structural, UI, or code change for the active task

### Step 3 — SEO

- improve content, or
- create a page, or
- improve internal linking where relevant to the active task

### Step 4 — CRO

- simplify UI
- improve CTA clarity
- reduce friction where relevant to the active task

### Step 5 — Validation

- check nothing broke
- confirm logic still works
- confirm mobile UX is still acceptable
- if the improvement did not land properly, fix it before moving on

### Step 6 — Logging

Update `PROJECT_MEMORY.md` with:

## Last Iteration
- Task completed
- Changes made
- Next improvement idea

## Main Rule

Do not stop after one task.

Complete up to 3 tasks per `continue execution` run unless blocked.

## Output Format

Each `continue execution` run must output:

1. Tasks generated (top 10)
2. Tasks completed (up to 3)
3. Changes made
4. Why they matter
5. Remaining tasks
6. Next best focus area

## Blocking Rule

Stop early only if:

- a destructive decision needs user approval
- a missing dependency or external system blocks safe progress
- continuing would likely break quote logic or pricing logic

Otherwise, keep going through the batch.
