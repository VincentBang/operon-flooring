# Supabase Connector Reauthentication Runbook

Date: 2026-06-04

Purpose: resume Stage 3 read-only verification when the Supabase connector reports that reauthentication is required.

## What Happened

A read-only verification query for the Operon Flooring project was attempted through the Supabase connector.

Project:

- Operon Flooring
- Project ref: `pwohrvtwuctmxwwirrim`

Result:

- Connector returned: reauthentication required.
- No customer rows were returned.
- No database changes were attempted.

## Next Steps

1. Reauthenticate the Supabase connector in Codex/ChatGPT.
2. Re-run the read-only queries in:
   - `internal-docs/apps-web/STAGE3_SUPABASE_VERIFICATION_QUERIES.sql`
3. Confirm only counts, schema metadata, RLS, and grants.
4. Do not dump customer rows.
5. Record results in:
   - `internal-docs/apps-web/STAGE3_LEAD_OS_IMPLEMENTATION_STATUS.md`

## Expected Checks

- All seven Stage 3 lead tables exist.
- `lead_id` exists on quote/review/upload detail tables.
- RLS is enabled on all new Stage 3 tables.
- `anon` and `authenticated` have no table grants on new Stage 3 tables.
- Counts by source/status are visible to service role only.
- Link coverage counts are available without printing row data.
