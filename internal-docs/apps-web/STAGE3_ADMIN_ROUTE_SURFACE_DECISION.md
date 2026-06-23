# Stage 3 Admin Route Surface Decision

Date: 2026-06-04

Purpose: record how `/admin` and `/admin.html` should behave before any preview or production deploy includes the locked admin shell.

Current local state:

- Static export generates `out/admin.html`.
- Static export also generates `out/admin.txt`, the Next static/RSC payload for the locked shell.
- `next build` reports the app route as `/admin`, but the static export file surface remains `admin.html` and `admin.txt`.
- `/admin.html` is locked and `noindex,nofollow`.
- `/admin.html` is excluded from sitemap.
- `netlify.toml` now defines `/admin` -> `/admin.html` as a forced 301 redirect.
- `netlify.toml` also defines `/internal/floorplan-measurements` -> `/internal/floorplan-measurements.html` as a forced 301 redirect.
- Admin auth shell and protected modules exist locally, but no preview/production admin release is approved yet.

## Local Decision

The local decision is Option A: redirect extensionless protected routes to their `.html` canonical surfaces.

### Option A: Redirect `/admin` to `/admin.html`

Use when:

- `/admin.html` is the approved public path for the locked admin shell.
- The redirect is explicitly documented and tested.

Requirements:

- `/admin` returns 301 or 302 to `/admin.html`.
- `/internal/floorplan-measurements` returns 301 or 302 to `/internal/floorplan-measurements.html`.
- `/admin.html` remains `noindex,nofollow`.
- `/internal/floorplan-measurements.html` remains `noindex,nofollow`.
- `/admin.html` remains out of sitemap.
- `/internal/floorplan-measurements.html` remains out of sitemap.
- The locked shell renders no lead data.

### Option B: Block `/admin`

Use when:

- Only `/admin.html` should exist during the locked-shell stage.
- Extensionless admin route should not serve a duplicate surface.

Requirements:

- `/admin` returns 404 or 403.
- `/admin.html` remains available only if intentionally included in the preview.
- `/admin.html` remains `noindex,nofollow`.
- `/admin.html` remains out of sitemap.

### Option C: Keep `/admin` Documented But Unchanged

Use only for local development if no deploy will include the shell.

Requirements:

- Do not deploy until the route is tested in the target hosting behavior.
- Record the observed preview behavior for `/admin`.
- Confirm search engines cannot index a duplicate admin route.

## Recommended Path

For the first approved preview with the locked shell:

1. Verify `/admin` redirects to `/admin.html`.
2. Verify `/internal/floorplan-measurements` redirects to `/internal/floorplan-measurements.html`.
3. Verify `/admin.html` remains locked, noindex, and out of sitemap.
4. Verify `/admin` behavior with HTTP status and headers in preview.
5. Verify unauthenticated dashboard functions return 401/403 before any lead data query.
6. Verify admin data loads only after the approved token succeeds.

## Stop Conditions

Stop before preview or production if:

- `/admin` returns an indexable 200.
- `/admin.html` appears in sitemap.
- `/admin.html` lacks `noindex,nofollow`.
- `out/admin.txt` contains lead, quote, upload, customer, storage, OCR, or pricing data.
- Admin output contains lead, quote, upload, customer, storage, OCR, or pricing data.
- The extensionless protected routes return indexable 200 surfaces.
