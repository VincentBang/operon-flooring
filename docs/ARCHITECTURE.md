# Operon Flooring Architecture

Status: verified current-state overview

Reviewed: 2026-07-11

Governance: Operon AI Development System v1.0.0

This document describes the architecture that exists in this repository. Proposed designs remain in their source planning documents and are not implementation authority.

## System boundary

Operon Flooring is an isolated product repository. Its runtime, routes, data, pricing, SEO and deployment must not depend on Operon Kitchens, Operon Bathrooms or Oz Timber.

The shared Operon governance folder defines workflow only. It is not a runtime dependency.

The untracked operon-bathrooms/.next/trace path is an accidental or historical cache within this Git root. It is not part of the architecture and must remain untouched until separately reviewed.

## High-level flow

    Customer browser
      -> Netlify static export from apps/web-tsx/out
      -> browser runtimes for quote, products, floorplan, review and chatbot
      -> Netlify Functions for validation, pricing support, writes, uploads, OCR, email and admin reads
      -> Supabase database, private storage and selected Edge Functions
      -> approved external providers such as GA4, email and OCR/model services when configured

The browser must receive only customer-safe output. Secrets, service-role access, private pricing, raw OCR, customer file locations and admin-only data remain server-side.

## Frontend

### Primary application

apps/web-tsx is a Next.js 15 App Router application using React 19 and TypeScript. next.config.mjs enables static export and unoptimised images.

Verified route composition at inspection:

- 92 page.tsx routes in total;
- 31 blog routes;
- 42 /flooring-* routes;
- 19 other public and internal routes.

The current count includes the uncommitted /room-visualiser route.

Shared frontend layers include:

- src/app for route entry points;
- src/components for layout, SEO and workflow components;
- src/lib for routes, legacy page definitions, catalogue/lead helpers and product metadata;
- public for runtime JavaScript, assets, sitemap, robots and Netlify form registration.

### Legacy application

apps/web contains the prior static HTML/JavaScript implementation and 87 HTML files at inspection. It remains useful for rollback, source comparison and tests that have not migrated. It is not the Netlify publish directory.

Do not copy legacy behaviour into the Next app or delete legacy files without an approved migration decision.

## URL and static-output contract

- Next exports to apps/web-tsx/out.
- Canonical public pages generally use .html URLs.
- netlify.toml redirects extensionless routes to their .html equivalents.
- / is canonical for the homepage.
- /blog/ is the guide index.
- /blog.html intentionally returns 404.
- legacy aliases redirect to the selected canonical URL.
- the hidden legacy /visualiser and /visualiser.html routes redirect to /.

Route work normally requires coordinated changes to the app route, routes registry, sitemap, Netlify redirects and static-output tests.

## Customer workflows

### Quote

The quote workflow collects project, product, area, scope and contact inputs. Browser runtime calls Netlify Functions for customer-safe calculation, request persistence, optional upload and email. Unknown scope should remain visible as review flags rather than silently becoming confirmed exclusions.

### Products

The product catalogue combines public product/range data, selection state and quote handoff. A server-backed public catalogue endpoint exists, while public pricing-support JavaScript remains for compatibility.

### Quote review

The quote-review flow supports a quick completeness check and uploaded-document review. OCR is server-side. Customer responses should contain structured review output, not raw extracted quote text.

### Floorplan

The public tool supports upload, scale, manual tracing, room/area handling and quote handoff. Local implementation also includes private session review, draft/version approval and quote-linking foundations through protected internal functions.

### Room visualiser

The current dirty branch adds /room-visualiser.html as a browser-local prototype. Existing branch documents constrain it to local image/object-URL handling, manual correction and browser-native canvas/ImageData assist. It has no approval for production, storage, server upload, hosted model assets, vendor calls or photo/mask quote handoff.

### Contact and chatbot

Contact uses a Netlify Function and hidden form registration. The chatbot is a routing and qualification assistant; it must not calculate prices or expose internal pricing.

## Server layer

netlify/functions contains customer-facing and admin/internal handlers plus shared security, data and pricing helpers.

Key capability groups:

- quote calculation and persistence;
- contact and email;
- customer file upload;
- quote-review OCR and report persistence;
- public catalogue pricing;
- chatbot and operator lead events;
- lead dashboard, status and follow-up;
- floorplan measurement review and document streaming;
- runtime health and controlled pricing optimisation.

All handlers must validate method, input and response shape. Admin data requires protected server access.

## Data layer

The supabase directory contains:

- schema and seed SQL;
- versioned migrations;
- draft migrations and rollback/RLS verification material;
- six Edge Functions for lead processing, follow-up, close scoring and pricing outcomes.

The local repository describes intended schema; it does not prove live production state.

Data classes include leads/events, quote requests/items/rooms, uploads, reviews, product ranges, pricing support, follow-ups, chatbot qualifications and floorplan measurement/review records.

## Upload and storage boundary

- Only approved customer file types and sizes are accepted.
- Client validation is advisory; server validation is required.
- Storage is private.
- Server-generated paths must not trust customer file names.
- Public responses must not expose storage buckets, paths or permanent URLs.
- Internal streaming or signed access must be short-lived and protected.
- Retention and deletion need explicit operational implementation and verification.

## Admin architecture

Static admin route shells call protected Netlify Functions. Existing access uses an environment-managed admin token/session check. This is a limited MVP boundary.

Before scaling:

- adopt least-privilege authenticated identities;
- verify RLS and grants against the target project;
- preserve noindex and public-response guards;
- add auditability for sensitive reads and writes.

## Analytics

GA4 is integrated across shared tracking and key workflows. Events must remain behavioural and non-personal. The analytics layer must not receive names, contact details, addresses, notes, uploads, raw OCR, raw quote payloads, file names or internal pricing.

## SEO architecture

SEO is implemented through static metadata, canonical URL ownership, sitemap, robots, structured data, internal links and Netlify redirect controls. The app contains product authority, local authority, project proof and guide clusters.

Static-output tests are the main regression surface for generated URL and content contracts.

## Security boundaries

The authoritative product policy is docs/security/SECURITY_POLICY.md.

Protected boundaries:

- secrets and service-role credentials remain in environment-managed server contexts;
- private pricing and commercial logic remain server-side;
- upload and OCR content is untrusted and sensitive;
- public/browser data access is least-privilege;
- admin endpoints require authentication or the approved temporary token gate;
- logs and analytics exclude personal and sensitive payloads.

## Deployment architecture

netlify.toml defines:

- build: npm --prefix apps/web-tsx ci && npm --prefix apps/web-tsx run build
- publish: apps/web-tsx/out
- response headers and asset caching;
- protected 404 routes;
- extensionless and legacy redirects;
- function packaging.

No deployment is automatic under repository governance. Build success does not authorise deploy.

## Architecture risks and conflicts

1. apps/web and apps/web-tsx duplicate parts of the frontend and runtime surface.
2. Some tests still rely on legacy paths.
3. Public pricing-support JavaScript remains until server-side pricing is complete.
4. Admin token access is not a final identity system.
5. Live Supabase state is unknown without approved provider verification.
6. Historical documents propose cross-product reuse, including a Kitchens integration/reuse section. These are non-authoritative and must not become runtime coupling.
7. The nested operon-bathrooms cache creates accidental-scope risk.
8. Existing dirty room-visualiser work is incomplete and not ready to merge according to its 2026-07-11 QA record.
9. The scheduled `process-followups` handler defaults to sending when no explicit enable flag is configured, despite dry-run-first operating documents. Its production environment state and public invocation boundary are unverified, so a separate approved fail-closed hardening task is required.

## Detailed source documents

Use these for deeper product-specific context, subject to the authority hierarchy:

- docs/security/SECURITY_POLICY.md
- docs/operon-flooring-quote-os-architecture.md
- docs/operon-flooring-floorplan-current-state-and-advanced-roadmap.md
- docs/operon-flooring-full-site-audit-2026-07-05.md
- docs/operon-flooring-security-privacy-audit-2026-07-05.md
- docs/operon-flooring-seo-master-plan.md
- docs/operon-flooring-room-visualiser-master-plan.md

If a source plan conflicts with current code or root governance, current repository reality and root governance win.
