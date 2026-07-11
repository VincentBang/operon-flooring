# Operon Flooring Deployment Standard

Reviewed: 2026-07-11

Governance: Operon AI Development System v1.0.0

## Current deployment model

- Provider: Netlify
- Configuration: netlify.toml
- Build command: npm --prefix apps/web-tsx ci && npm --prefix apps/web-tsx run build
- Publish directory: apps/web-tsx/out
- Frontend output: Next.js static export
- Server functions: netlify/functions
- Data and storage: Supabase, accessed primarily through server-side functions

## Default restrictions

- Automatic deployment: false
- Push to main: false
- Production changes: false
- Commit: requires explicit instruction
- Push: requires explicit instruction
- Merge: requires explicit instruction
- Deploy or provider trigger: requires explicit instruction

Build success, READY_FOR_REVIEW status or local acceptance does not authorise a deployment.

## Required approval

A deployment instruction must identify:

- the approved task and accepted specification;
- target branch and target Netlify context;
- exact commit or reviewed change set;
- whether a preview or production deploy is authorised;
- data/schema/environment changes, if any;
- rollback owner and rollback trigger;
- required post-deploy checks.

Never infer production authority from a request to build, test, preview or prepare.

## Pre-deployment gates

Before any approved release:

1. working-tree provenance is understood;
2. the task is ACCEPTED or the user explicitly authorises release;
3. required build, typecheck and targeted tests pass;
4. generated static routes, canonical URLs, sitemap and redirects pass where affected;
5. public leak and security checks pass;
6. quote, pricing, product and data outcomes are verified where affected;
7. environment-variable names are documented without exposing values;
8. Supabase migrations/RLS/storage changes have separate approval and rollback;
9. known limitations and monitoring are recorded;
10. the exact deploy target is confirmed.

Revenue-sensitive quote, product, route and conversion work requires a preview review before production unless the user explicitly accepts the documented risk.

## Netlify boundaries

Do not change without explicit scope:

- build or publish settings;
- redirects, headers or 404 protections;
- function packaging;
- deploy contexts;
- production environment variables;
- domain or DNS settings;
- deploy hooks.

Preserve the .html canonical and redirect contract unless an approved architecture decision replaces it.

## Supabase boundaries

Code deployment does not imply permission to:

- apply migrations;
- change RLS or grants;
- change storage buckets or policies;
- deploy Edge Functions;
- edit production data;
- rotate or expose credentials.

Every production Supabase action requires explicit target, verification and rollback instructions.

## Secret handling

- Never print secret values in commands, logs or reports.
- Verify presence without outputting values when credentials are required.
- Use provider-managed environment variables.
- Rotate any credential suspected of exposure before release.

## Post-deployment checks

When production deployment is explicitly approved:

- confirm the deployed commit/context;
- probe affected routes and functions;
- verify canonical, sitemap and redirect behaviour;
- run safe customer-path smoke checks without creating real leads unless approved;
- check browser console and responsive layout for UI work;
- verify monitoring and analytics only with non-personal events;
- record evidence, incidents and rollback decision.

## Rollback

The approved specification must name the rollback path. Typical static-site rollback uses the last known-good Netlify deploy or a reviewed revert commit. Data/schema rollback must be separately designed and must not assume destructive reversal is safe.

Stop and escalate if rollback would lose customer data or require guessing production state.

## Current task status

The 2026-07-11 governance installation is documentation-only.

- No deployment performed
- No Netlify production setting changed
- No Supabase production setting changed
- No push performed
- No merge performed
