# Chatbot Edge-Case Intent Set

Purpose: keep common messy customer prompts routed safely while the chatbot remains isolated from quote, product, pricing, form, localStorage, Supabase, and lead capture systems.

Run:

```sh
node apps/web/chatbot/tests/chatbot.test.js
```

## Required Edge Cases

| Prompt | Expected intent/path | Expected route | Notes |
| --- | --- | --- | --- |
| I have tiles and stairs | `scope_validation` | `quote-review.html` | Capture tile removal and stairs as review risks |
| I'm in an apartment with no lift | `scope_validation` | `quote-review.html` | Flag apartment access, level, parking, loading, strata |
| I have my own flooring | `install_only` scenario | `quote.html` | Keep product selection advisory; no product override |
| The floor is uneven | `scope_validation` | `quote-review.html` | Flag floor prep or levelling review |
| I only have a floorplan | `missing_info_collection` | `quote.html` | Guide to the quote area step and preserve floor plan as measurement context |
| I need herringbone | `product_guidance` | `products.html` | Treat as engineered/premium product guidance |

## Pass Criteria

- No prices, totals, rates, formulas, or discounts.
- No automatic navigation.
- No quote form writes.
- No product-system writes.
- No localStorage writes.
- Structured output captures the useful draft signal when possible.

## Maintenance

Add one edge case at a time. Each new row should have a matching test and should stay within `apps/web/chatbot/`.
