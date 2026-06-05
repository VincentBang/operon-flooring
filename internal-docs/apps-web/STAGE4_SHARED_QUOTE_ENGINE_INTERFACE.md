# Stage 4 Shared Quote Engine Interface

Date: 2026-06-04

Purpose: define a common quote output interface that can serve Flooring first and future Operon verticals later.

## Customer-Safe Output

```json
{
  "ok": true,
  "vertical": "flooring",
  "quote_id": "uuid",
  "quote_reference": "379",
  "estimate": {
    "subtotal_ex_gst": 3500,
    "gst": 350,
    "total_inc_gst": 3850,
    "display_mode": "estimate"
  },
  "scope": {
    "product_category": "hybrid",
    "product_label": "Hybrid flooring",
    "measured_area_m2": 60,
    "estimated_order_area_m2": 66,
    "main_inclusions": [],
    "exclusions": []
  },
  "confidence": {
    "score": 72,
    "level": "medium",
    "review_flags": []
  },
  "assumptions": [],
  "next_step": "Operon will review product, area and site details before booking."
}
```

## Forbidden Output

Never return to public browser:

- Internal rates
- Unit install rates
- Removal rates
- Stair rates
- Access multipliers
- Location/access multipliers
- Supplier costs
- Margins
- Markups
- Private pricing rules
- Private pricing rule names
- Raw pricing table rows

## Server Interface

Future server module:

```text
calculateOperonQuote(input, context) -> customerSafeQuoteResult
```

Inputs:

- Validated customer project facts
- Product/category selection
- Measurement source
- Extras and uncertainty flags
- Vertical context

Server-only context:

- Private pricing support library
- Product pricing support data
- Location/access support data
- Version metadata

## Migration Requirement

The current customer-facing output must remain equivalent before and after server-pricing migration. Any total change must be explained by a verified bug fix, not by migration drift.
