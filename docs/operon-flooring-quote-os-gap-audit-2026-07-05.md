# Operon Flooring Quote OS Gap Audit - 2026-07-05

## Current Public Capabilities

| Capability | Current status |
| --- | --- |
| Quote flow | Functional public quote path with calculation, save, email flags and tests. |
| Product context | Product page and product-to-quote handoff exist. |
| Quote review | Upload/OCR and quick check exist; browser-safe OCR response appears implemented. |
| Floorplan tool | Public floorplan measurement exists; Phase 2/2.5 internal review and benchmark foundations exist. |
| Chatbot | Routing/qualification logic and safe lead-event architecture exist. |
| Lead events | Stage 3 lead-event foundation exists in repo/tests; needs ongoing live QA. |
| Admin dashboard | Initial admin dashboard and floorplan measurement console exist. |
| Follow-up queue | Dry-run direction exists; not an automated messaging system. |

## Quote OS Readiness By Layer

| Layer | Status | Gap |
| --- | --- | --- |
| Public acquisition | Strong | Product no-JS/performance and local page polish needed. |
| Lead/event model | Partially built | Needs final compatibility QA across quote/contact/review/floorplan/chatbot writes. |
| Product context | Partially built | Public catalogue needs server-safe pricing boundary and better static fallback. |
| Quote review context | Stronger than baseline | Continue report specificity and dashboard handoff. |
| Floorplan measurement context | In progress | Needs real approved redacted samples and operational reviewer workflow QA. |
| Quote versioning | Not complete | Need internal quote version tables/functions before proposal generation. |
| Internal review | Partially built | Measurement console exists, but site visit/quote review queues need operational QA. |
| Follow-up queue | Dry-run only | Must remain dry-run until explicit approval for messaging. |
| Site visit preparation | Not built | Need checklist, rooms/photos, notes, and quote impact fields. |
| Proposal generation | Not built | Requires private quote versions and approved customer-safe output format. |
| Outcome tracking | Not built | Need won/lost/job outcome records. |

## Missing Operating Layers

Priority missing layers:

1. Quote versioning.
2. Site visit checklist and photos.
3. Private rate-card model and server-side internal quote engine.
4. Proposal generator with customer-safe output.
5. Follow-up queue dry-run operational workflow.
6. Job outcome tracking.
7. Admin reporting for lead source, product mix, suburbs and conversion.

## Floorplan Tool Gap

The public floorplan tool is useful, but Quote OS needs the internal review chain to be operational:

- uploaded file record;
- measurement session;
- candidate/draft measurement versions;
- reviewer approval;
- server-side area recalculation;
- quote linkage;
- benchmark QA against real redacted floorplans.

Current blocker: real approved, redacted reviewed sample corpus is still required for higher-confidence Phase 3 detection work.

## Pricing Boundary Gap

The Quote OS cannot mature safely until private pricing is server-owned:

- public site collects product/area/scope;
- server calculates public estimate;
- internal console can calculate private quote versions;
- browser never receives private rates, supplier costs, margins or access multipliers.

This migration must be parity-tested before replacing existing public quote behavior.

## Recommended Quote OS Sequence

1. Finish Sprint A public hygiene fixes so acquisition pages remain stable.
2. Complete Supabase/RLS verification for lead/event/upload tables.
3. Finish floorplan real sample corpus and operational reviewer QA.
4. Build read-only quote version model.
5. Build internal quote console skeleton.
6. Add site visit checklist and photo records.
7. Add internal quote version creation.
8. Add proposal generator only after quote versions are stable.
9. Add follow-up queue dry-run.
10. Add reporting and job outcomes.

## Risks

| Risk | Mitigation |
| --- | --- |
| Internal pricing leaks to frontend | Server-side private pricing engine and leak tests. |
| Dashboard misses leads | Function-write compatibility audit and lead/event contract tests. |
| Floorplan detection over-promises | Keep detection reviewer-only until benchmark gate passes. |
| Follow-up automation sends poor messages | Keep dry-run only until human approval. |
| SEO expansion creates thin pages | Use Search Console demand and quality gates before publishing. |

## Next Quote OS Task

Before building more UI, run a narrow compatibility QA:

- quote submit creates/links lead;
- contact enquiry creates/links lead;
- quote-review creates/links lead or event;
- floorplan upload/session links to lead when context exists;
- chatbot qualification writes safe lead event;
- admin dashboard reads all above without exposing private data.
