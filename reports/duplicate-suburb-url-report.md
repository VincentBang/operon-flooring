# Duplicate Suburb URL Report

Preferred pattern: `flooring-[suburb].html`

Forced 301 redirects are implemented in `netlify.toml`. The current sitemap lists the preferred `flooring-[suburb].html` URLs and excludes the legacy `[suburb]-flooring.html` URLs.

| Preferred canonical URL | Duplicate URL | Duplicate title / H1 | Preferred title / H1 | Recommended action |
| --- | --- | --- | --- | --- |
| `flooring-auburn.html` | `auburn-flooring.html` | `Flooring in Auburn \| Operon Flooring` / `Flooring in Auburn` | `Flooring Auburn \| Hybrid, Laminate & Timber Quotes` / `Flooring quote and installation in Auburn` | Implemented forced 301. Useful old local context merged into the preferred page. |
| `flooring-blacktown.html` | `blacktown-flooring.html` | `Flooring in Blacktown \| Operon Flooring` / `Flooring in Blacktown` | `Flooring Blacktown \| Hybrid, Laminate & Timber Quotes` / `Flooring quote and installation in Blacktown` | Implemented forced 301. Useful old local context merged into the preferred page. |
| `flooring-liverpool.html` | `liverpool-flooring.html` | `Flooring in Liverpool \| Operon Flooring` / `Flooring in Liverpool` | `Flooring Liverpool \| Hybrid, Laminate & Timber Quotes` / `Flooring quote and installation in Liverpool` | Implemented forced 301. Useful old local context merged into the preferred page. |
| `flooring-miranda.html` | `miranda-flooring.html` | `Flooring in Miranda \| Operon Flooring` / `Flooring in Miranda` | `Flooring Miranda \| Hybrid, Laminate & Timber Quotes` / `Flooring quote and installation in Miranda` | Implemented forced 301. Miranda-specific finish, moisture and mixed-property context merged into the preferred page. |
| `flooring-parramatta.html` | `parramatta-flooring.html` | `Flooring in Parramatta \| Operon Flooring` / `Flooring in Parramatta` | `Flooring Parramatta \| Hybrid, Laminate & Timber Quotes` / `Flooring quote and installation in Parramatta` | Implemented forced 301. Useful old local context merged into the preferred page. |

Next safe step:
Monitor Search Console coverage and performance after deployment. Miranda should be watched closely because it is already close to page 1 for several terms.
