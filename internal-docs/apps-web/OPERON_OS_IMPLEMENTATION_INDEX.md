# Operon OS Implementation Index

Date: 2026-06-04

Purpose: keep the Stage 3-5 implementation sequence clear after the TSX cutover and Stage 2 conversion hardening.

## Current Rule

No production deploy, push, pricing migration, dashboard build, or contractor-network work should start without explicit approval and a green local gate run.

## Local Gates

Run from repo root:

```bash
npm run test:local-gates
git diff --check
```

Run TSX build when frontend/CSS/static output changes:

```bash
npm run build --prefix apps/web-tsx
```

Current local-only changeset review:

- `LOCAL_CHANGESET_REVIEW_2026-06-04.md`
- `LOCAL_COMMIT_GROUPING_2026-06-04.md`

## Stage 3: Internal Flooring Operating System

Foundation docs:

- `STAGE3_ADMIN_DASHBOARD_MVP_PLAN.md`
- `STAGE3_ADMIN_AUTH_DECISION_MATRIX.md`
- `STAGE3_ADMIN_AUTH_FUNCTION_CONTRACT.md`
- `STAGE3_ADMIN_AUTH_SHELL_PLAN.md`
- `STAGE3_ADMIN_FUNCTION_GAP_REGISTER.md`
- `STAGE3_ADMIN_DISCOVERABILITY_GUARDRAIL.md`
- `STAGE3_ADMIN_READ_FUNCTION_CONTRACT.md`
- `STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md`
- `STAGE3_ADMIN_WRITE_FUNCTION_CONTRACT.md`
- `STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`
- `STAGE3_LEAD_FUNCTION_COMPATIBILITY_MAP.md`
- `STAGE3_LEAD_DATA_DICTIONARY.md`
- `STAGE3_LEAD_OS_IMPLEMENTATION_STATUS.md`
- `STAGE3_DASHBOARD_SECURITY_TEST_PLAN.md`
- `STAGE3_SUPABASE_SCHEMA_VERIFICATION_2026-06-05.md`

Schema:

- `supabase/migrations/20260604_stage3_lead_operating_system.sql`
- `supabase/migrations/20260604_stage3_lead_fk_indexes.sql`
- `STAGE3_LEAD_SCHEMA_ROLLBACK_SQL_DRAFT.sql`
- `STAGE3_LEAD_BACKFILL_SQL_DRAFT.sql`

Implementation checklists:

- `TASK_3_4_ADMIN_AUTH_SHELL_IMPLEMENTATION_CHECKLIST.md`
- `TASK_3_5_LEAD_LIST_IMPLEMENTATION_CHECKLIST.md`
- `TASK_3_6_LEAD_DETAIL_IMPLEMENTATION_CHECKLIST.md`
- `TASK_3_7_STATUS_PIPELINE_CHECKLIST.md`
- `TASK_3_8_FOLLOW_UP_QUEUE_CHECKLIST.md`
- `TASK_3_9_QUOTE_REVIEW_QUEUE_CHECKLIST.md`
- `TASK_3_10_FLOORPLAN_REVIEW_QUEUE_CHECKLIST.md`
- `TASK_3_11_REPORTING_DASHBOARD_CHECKLIST.md`
- `TASK_3_12_SECURITY_AUDIT_CHECKLIST.md`

Recommended next code task after approval:

1. Verify Supabase connector access or use approved SQL runner.
2. Preview-test Stage 3 lead writes from quote/contact/review/upload/operator flows.
3. Verify the locked admin shell route (`/admin.html`) is noindex, not in sitemap, and not exposed with lead data.
4. Connect real admin auth only after lead-write verification passes.

## Stage 4: Shared Operon OS Foundation

## Task A2: Direct Browser Supabase Write Removal

Task A2 docs:

- `DIRECT_BROWSER_SUPABASE_WRITE_INVENTORY.md`
- `TASK_A2_DIRECT_BROWSER_SUPABASE_FUNCTION_ROUTE_PLAN.md`
- `TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md`
- `TASK_A2_NO_DIRECT_BROWSER_WRITE_ACCEPTANCE_CONTRACT.md`
- `TASK_A2_QUOTE_FALLBACK_REMOVAL_READINESS.md`
- `TASK_A2_TRACKING_WRITE_DECISION.md`

Current Task A2 stance:

- Quote fallback writes have been removed locally from `quoteRuntime.js`; approved preview proof is still required before production.
- Tracking direct browser writes have been removed locally from `tracking.js`; approved preview proof is still required before production.
- Public browser Supabase config has been removed locally from `quoteRuntime.js`; approved preview proof is still required before production.
- No direct browser Supabase write targets remain in the checked public runtimes.
- Strict RLS/GraphQL hardening should wait until no-direct-browser-write contracts pass.

## Stage 4: Shared Operon OS Foundation

Planning docs:

- `STAGE4_SHARED_TYPES_PACKAGE_PLAN.md`
- `STAGE4_SHARED_QUOTE_ENGINE_INTERFACE.md`
- `STAGE4_SHARED_UPLOAD_REVIEW_FRAMEWORK_PLAN.md`
- `STAGE4_SERVER_SIDE_PRICING_MIGRATION_PLAN.md`
- `STAGE4_PRICING_MIGRATION_TEST_PLAN.md`
- `STAGE4_OPERON_KITCHENS_INTEGRATION_PLAN.md`
- `STAGE4_INTERNAL_SAAS_ALPHA_PLAN.md`

Stage 4 should not start implementation until:

- Stage 3 dashboard MVP is stable.
- Lead source coverage is verified.
- Pricing leak contract is green.
- Direct browser Supabase writes are function-routed or explicitly accepted.

## Stage 5: Controlled Contractor Network

Planning docs:

- `STAGE5_PARTNER_NETWORK_CRITERIA.md`
- `STAGE5_LEAD_ALLOCATION_RULES_PLAN.md`
- `STAGE5_CONTRACTOR_SCORECARD_PLAN.md`
- `STAGE5_SHADOW_DISPATCH_PLAN.md`
- `STAGE5_CUSTOMER_PROTECTION_PROCESS.md`
- `STAGE5_MONETISATION_TEST_PLAN.md`
- `STAGE5_GO_NO_GO_REPORT_TEMPLATE.md`

Stage 5 remains blocked until:

- Stage 3 internal operations are stable.
- Stage 4 shared OS foundation is proven internally.
- Quality-control and customer protection processes are operational.
- Unit economics are visible.

## Known Open Risks

- Legacy public pricing-support files still exist and are tracked by `pricingLeakContract.test.js`.
- No direct browser Supabase write targets remain in the checked public runtimes.
- Public Supabase browser config cleanup remains a separate Phase 3 task.
- Direct-browser write removal status is tracked in `TASK_A2_DIRECT_BROWSER_SUPABASE_FUNCTION_ROUTE_PLAN.md`.
- Quote fallback local removal and preview requirements are tracked in `TASK_A2_QUOTE_FALLBACK_REMOVAL_READINESS.md`.
- Tracking write removal decision is tracked in `TASK_A2_TRACKING_WRITE_DECISION.md`.
- Supabase connector needs reauthentication for direct dashboard/table verification.
- Netlify draft deploys should be minimized and only run after human approval.
