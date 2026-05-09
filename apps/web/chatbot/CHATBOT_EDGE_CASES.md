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
| I only have a floorplan | `floorplan_help` | `floorplan.html` | Route to measurement help only and do not calculate area |
| I need herringbone | `product_guidance` | `products.html` | Treat as engineered/premium product guidance |
| My quote only says supply and install | `quick_quote_completeness` | `quote-review.html` | No-file completeness check, not full document review |
| I have Hybrid 7mm quote | `document_quote_review` | `quote-review.html` | Upload written quote; product match not confirmed without brand/range/colour/spec |
| It says product match 35% | `quote_review_result_explanation` | `quote-review.html` | Explain low match is not confirmed; do not expose raw match scoring as customer guidance |
| I want a human to call me | `operator_handoff` | `quote.html?from=chatbot&support=operator` | Explicit follow-up request only, not live chat |

## Pass Criteria

- No prices, totals, rates, formulas, or discounts.
- No automatic navigation.
- No quote form writes.
- No product-system writes.
- No localStorage writes.
- Structured output captures the useful draft signal when possible.

## Maintenance

Add one edge case at a time. Each new row should have a matching test and should stay within `apps/web/chatbot/`.
