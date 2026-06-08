# Search Console Export Folder

Create one folder per month:

```text
internal-docs/seo/search-console/YYYY-MM/
```

Expected files:

- `queries.csv`
- `pages.csv`
- `indexing.csv`
- `sitemaps.csv`
- `core-web-vitals.csv`
- `rich-results.csv`

Then run from repo root:

```bash
node scripts/analyze-gsc-seo-loop.js internal-docs/seo/search-console/YYYY-MM
```

The output is:

```text
monthly-seo-report.md
```

Do not commit exports containing sensitive query annotations or private notes unless reviewed.
