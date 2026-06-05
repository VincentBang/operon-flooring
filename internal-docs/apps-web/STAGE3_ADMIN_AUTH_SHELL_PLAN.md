# Stage 3 Admin Auth Shell Plan

Date: 2026-06-04

Purpose: define Task 3.4 before connecting a protected internal dashboard shell to real admin authentication or lead data.

## Current Local Status

A locked local admin shell has been scaffolded at `/admin.html`.

Current guarantees:

- It renders a locked state only.
- It uses `noindex,nofollow`.
- It is excluded from sitemap by contract.
- It makes no admin Function calls.
- It does not create a Supabase browser client.
- It renders no lead, quote, upload, OCR, contact, or pricing data.

This scaffold is not a completed admin auth implementation. It exists only to reserve and test the static route surface safely.

## Objective

Create a private admin entry point for Operon Flooring operators without exposing lead data, pricing internals, uploaded file paths, raw OCR text, or service-role access to the browser.

## Recommended MVP Approach

Use protected Netlify Functions as the admin boundary.

Frontend:

- Renders an admin login/shell route.
- Stores only a short-lived admin session token/cookie.
- Calls admin Functions for data.
- Never calls Supabase directly for lead data.

Backend:

- Admin Functions validate session/role.
- Admin Functions use service-role credentials server-side.
- Admin Functions return only dashboard-safe fields.

## Route Shell

Initial routes:

- `/admin.html`
- `/admin` behavior must be explicitly accepted, redirected, or blocked before any deploy
- `/admin/leads`
- `/admin/leads/[id]`

All routes should render a locked state when unauthenticated.

Current redirect/config observation:

- No explicit `/admin` redirect or block is currently defined in `netlify.toml`.
- Local static export currently generates `out/admin.html`.
- Do not change production Netlify config until the admin route surface decision is approved.

Route-surface decision note:

- `STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md`

## Authentication Options

Decision matrix:

- `STAGE3_ADMIN_AUTH_DECISION_MATRIX.md`

### Option A: Netlify Identity

Pros:

- Fits Netlify deployment.
- Supports invite-only internal users.
- Can use role/app metadata.

Cons:

- Needs careful setup and testing in preview/production.

### Option B: Supabase Auth Admin Claims

Pros:

- Centralizes auth in Supabase.
- Could support future multi-vertical admin.

Cons:

- More integration work.
- Must avoid direct browser reads of sensitive lead tables.

### Option C: Temporary Admin Token

Pros:

- Fastest internal-only bridge.
- Useful for a private preview proof.

Cons:

- Not ideal long term.
- Must be short-lived, environment-configured, and never committed.

Recommendation:

- Use Option A or B for production admin.
- Use Option C only for a local/private proof if explicitly approved.

## Admin Function Set

Minimum shell functions:

- `admin-session-status`
- `admin-login` or auth callback integration
- `admin-logout`
- `admin-leads-list`

Do not implement write actions until read access and audit logging are verified.

## Data Safety Rules

Admin shell responses must not include:

- Service-role keys
- Storage bucket/path
- Signed URLs unless short-lived and explicitly requested
- Raw OCR text by default
- Uploaded file public URLs
- Supplier costs
- Margins
- Internal rate tables
- Access multipliers
- Pricing rules
- Full chatbot transcript unless separately protected and approved

## Verification

Local checks:

- Unauthenticated `/admin.html` shows locked state.
- `/admin.html` has `noindex,nofollow`.
- `/admin.html` is excluded from sitemap.
- `/admin.html` generated output contains no lead table names, customer records, storage paths, service-role terms, or private pricing fields.
- Unauthenticated admin function calls return 401/403.
- Authenticated admin function calls return minimal test payload.
- Public pages unaffected.
- `npm run build` passes.
- `npm run check:public-leaks` passes.
- `git diff --check` passes.

Preview checks after approval:

- Admin route not indexable.
- Admin route unavailable without auth.
- Admin function unavailable without auth.
- `/admin` route behavior reviewed so it does not create an unwanted indexable duplicate surface.
- Existing quote/contact/review/upload flows unchanged.

## Rollback

Because the shell should be additive:

- Remove `/admin` route.
- Remove admin Functions.
- Leave lead-write functions and schema untouched unless separately rolling back Stage 3.

## Decision Needed Before Coding

Choose admin auth approach:

- Netlify Identity
- Supabase Auth admin claims
- Temporary environment admin token for private proof only

Record the decision using:

- `STAGE3_ADMIN_AUTH_DECISION_MATRIX.md`
