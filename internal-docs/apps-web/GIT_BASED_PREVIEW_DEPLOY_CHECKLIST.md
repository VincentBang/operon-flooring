# Git-Based Preview Deploy Checklist

Date: 2026-06-04

Purpose: use Netlify's Git-based preview flow when manual CLI draft deploy uploads stall.

## When To Use

Use this only after human approval to push a dev branch.

Good fit:

- Stage 3 lead-write verification.
- Netlify Function behavior that needs real env vars.
- Preview-only QA without production deploy.

Do not use:

- Without approval.
- For production.
- When local gates fail.
- For checks that can run locally without consuming Netlify deploy minutes.

## Pre-Push Local Gates

Run:

```bash
npm run build --prefix apps/web-tsx
npm run test:local-gates
git diff --check
```

Optional function packaging check:

```bash
npx netlify functions:build --src netlify/functions --functions /tmp/operon-functions-build --debug
```

## Branch

Recommended branch:

- `codex/stage3-lead-writes-preview`

Before push:

- Confirm changed files are expected.
- Confirm no secrets.
- Confirm no production config changes unless explicitly approved.
- Confirm no production deploy or CLI draft deploy has been run for the same local-only verification.

## Preview QA

Use:

- `STAGE3_LEAD_WRITE_PREVIEW_QA_CHECKLIST.md`

Verify:

- Quote lead creation.
- Contact lead creation.
- Quote-review lead creation.
- Operator lead creation.
- Upload link-only behavior.
- No public response leaks.
- Customer-facing Function errors are safe and bounded.
- Server logs use short reasons rather than raw provider error objects.
- Quote-review email responses do not echo customer email addresses.

## Production Safety

- Do not merge to `main` until preview passes and human approves.
- Do not use `--prod`.
- Preserve current production rollback path.
