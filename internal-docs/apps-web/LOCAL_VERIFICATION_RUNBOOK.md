# Local Verification Runbook

Date: 2026-06-04

Use this before any preview or production deploy.

## Standard Local Gates

Run:

```bash
npm run build --prefix apps/web-tsx
npm run test:local-gates
git diff --check
```

What this covers:

- Public leak check
- Static output contract
- Conversion/revenue-path unit tests
- Stage 3 lead-write contracts
- Pricing/privacy leak contract
- Lead qualification contract
- Direct browser Supabase write inventory
- Task A2 quote fallback removal readiness contract
- Task A2 tracking write decision contract
- Admin response safety contract
- Lead status/priority contract
- Stage 3 schema/docs consistency
- Local public/source-map probe
- Customer-facing Function response safety for quote save, quote-review save/email/OCR, upload, contact and operator request paths

## Additional Function Packaging Check

Run when Netlify Functions changed:

```bash
npx netlify functions:build --src netlify/functions --functions /tmp/operon-functions-build --debug
```

Then confirm helper-only Stage 3 files are not packaged as public function endpoints.

## Deploy Rules

- Do not production deploy without human approval.
- Do not draft deploy when the task says to minimize Netlify credits.
- Prefer Git-based branch previews if CLI draft upload stalls.
- Always report deploy ID, preview URL, and build warnings when a deploy is approved.

## Known Accepted Warnings

- Next.js multiple-lockfile warning remains known and intentionally unfixed for now.
- Public pricing-support inventory remains known until Stage 4 server-side pricing migration.
- Task A2 direct browser Supabase writes have been removed locally from checked quote/tracking public runtimes.
- Task A2 public browser Supabase config has been removed locally from `quoteRuntime.js`.
- Task A2 still needs approved preview QA before production because quote save/upload/tracking behavior changed from browser Supabase paths to Function/local/GA paths.
- Admin/internal Functions and pricing-boundary endpoints are not treated as public customer-flow responses. Review them separately before exposing new routes or changing admin access.
