# HTML to TSX Migration Status

## Current Production Deployment

- Production publish directory remains `apps/web`.
- `netlify.toml` has no build command and no base directory.
- Netlify Functions remain in `netlify/functions`.
- Redirects and headers are currently defined in `netlify.toml`.
- `sitemap.xml` and `robots.txt` currently live in `apps/web`.
- Netlify Forms are used by `apps/web/quote.html`.

## Backup

- Backup location: `backups/operon-html-2026-05-27/apps-web`.
- Backup is outside the current Netlify publish directory.
- The backup intentionally excludes `.env`, `.env.local`, `node_modules`, `tests`, `qa-screenshots`, `supabase-audit-exports`, and source maps.
- This backup is for rollback only and must not become a deploy target.

## Parallel TSX App

- TSX foundation location: `apps/web-tsx`.
- This folder is not currently deployed.
- The TSX app uses a separate local `package.json` so root production deployment stays untouched.
- Current foundation includes:
  - Next config
  - TypeScript config
  - root layout
  - shared layout
  - header
  - footer
  - SEO JSON-LD helper
  - button link component
  - site config
  - global styles
  - initial homepage route

## Approved URL Preservation Strategy

Decision approved: preserve current `.html` public URLs during the TSX migration.

The current site depends on `.html` URLs such as:

- `/quote.html`
- `/products.html`
- `/quote-review.html`
- `/floorplan.html`
- `/hybrid-flooring-sydney.html`
- `/flooring-randwick.html`

Verified strategy:

- Use Next static export with `output: "export"`.
- Keep `trailingSlash: false`.
- Build extensionless source routes, such as `src/app/quote/page.tsx`.
- Next exports those routes as `.html` files, such as `out/quote.html`.
- Keep canonicals, sitemap entries and internal links on the current `.html` URLs.
- Use shared public route constants from `apps/web-tsx/src/lib/routes.ts`.

Do not migrate to extensionless URLs during this parity migration.

Verification result:

- `out/quote.html` generated.
- `out/products.html` generated.
- `out/floorplan.html` generated.
- `out/quote/index.html` was not generated.
- `out/products/index.html` was not generated.
- `out/floorplan/index.html` was not generated.

## Deployment Changes Not Yet Made

No changes have been made to:

- `netlify.toml`
- production publish directory
- production build command
- root package scripts
- current HTML files

## Next Safe Step

Wait for approval to migrate low-risk pages into `apps/web-tsx` while keeping `apps/web` live and unchanged.

## First Low-Risk Page Batch

Migrated into the parallel TSX app:

- `recent-flooring-projects.html` -> `apps/web-tsx/src/app/recent-flooring-projects/page.tsx` -> `out/recent-flooring-projects.html`
- `contact.html` -> `apps/web-tsx/src/app/contact/page.tsx` -> `out/contact.html`
- `contact-thank-you.html` -> `apps/web-tsx/src/app/contact-thank-you/page.tsx` -> `out/contact-thank-you.html`
- `flooring-edmondson-park.html` -> `apps/web-tsx/src/app/flooring-edmondson-park/page.tsx` -> `out/flooring-edmondson-park.html`
- `laminate-flooring-sydney.html` -> `apps/web-tsx/src/app/laminate-flooring-sydney/page.tsx` -> `out/laminate-flooring-sydney.html`

The blog index was not migrated in this batch. With `trailingSlash: false`, a `src/app/blog/page.tsx` route is expected to export as `out/blog.html`, which would not preserve the current `/blog/` canonical shape. Blog routing needs a separate strategy before migration.

Static assets used by the migrated pages were copied into `apps/web-tsx/public` so the exported `out` folder can serve the referenced image paths during preview. The full `apps/web/images` library was not copied.
