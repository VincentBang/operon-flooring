# Stage 3 Supabase Schema Verification - 2026-06-05

Scope: read-only verification of the Operon Flooring Supabase project after the approved additive Stage 3 lead schema migrations. No customer rows were dumped and no SQL changes were applied in this check.

Project checked:
- Supabase project: Operon Flooring
- Project ref: pwohrvtwuctmxwwirrim
- Region: ap-southeast-2
- Database: Postgres 17

Migration status:
- 20260603214612_stage3_lead_operating_system is applied.
- 20260603215839_stage3_lead_fk_indexes is applied.

Tables confirmed present:
- operon_leads
- operon_lead_events
- operon_lead_notes
- operon_lead_files
- operon_follow_ups
- operon_floorplan_reviews
- operon_lead_status_history

Detail-table lead links confirmed:
- operon_quote_requests.lead_id uuid
- operon_quote_reviews.lead_id uuid
- operon_uploaded_files.lead_id uuid

RLS and public-role access:
- RLS is enabled on all new Stage 3 tables.
- anon and authenticated have zero table grants on the new Stage 3 lead tables.
- This matches the approved model: public browser writes should go through Netlify Functions using service-role credentials, not direct table access.

Current counts:
- operon_leads: 0 rows by primary_source/status.
- Detail link coverage:
  - operon_quote_requests: 59 total rows, 0 linked rows.
  - operon_quote_reviews: 3 total rows, 0 linked rows.
  - operon_uploaded_files: 22 total rows, 0 linked rows.

Interpretation:
- Zero lead rows is expected because the Stage 3 Function write integrations are local-only and have not been deployed.
- Existing quote/review/upload rows are not backfilled yet. Backfill remains a separate approval step using STAGE3_LEAD_BACKFILL_SQL_DRAFT.sql.

Advisor notes:
- Security advisor reports INFO-level "RLS enabled, no policy" notices for the new service-role-only Stage 3 tables. This is expected until protected admin access is implemented.
- Performance advisor reports unused indexes on new Stage 3 tables. This is expected because the admin dashboard is not active yet.
- Performance advisor also reports unrelated unindexed foreign keys on existing follow-up/pricing/quote tables. Handle separately; do not change pricing or production behavior inside Stage 3 dashboard setup.

Next safe step:
- Deploy or preview the local Function lead-write changes only after explicit approval.
- Then submit one controlled preview quote/contact/review test and verify operon_leads plus operon_lead_events populate without exposing data to anon/browser clients.

2026-06-13 note:
- `operon_chatbot_qualifications` was added to the Stage 3 verification query set after the chatbot qualification bridge migration was introduced locally.
- If that table is missing in the live project, do not enable the chatbot-qualified lead dashboard panel until the additive migration is applied and RLS/grants are rechecked.
