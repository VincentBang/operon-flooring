# Operon Chatbot JSON Schema

The chatbot produces draft-only structured JSON for future integration. It must not apply this data to live quote forms yet.

## Product Guidance Output

```json
{
  "intent": "product_guidance",
  "recommended_category": "hybrid",
  "category": "hybrid",
  "selection_mode": "recommend",
  "reason": "water resistance and durability",
  "next_step": "quote.html"
}
```

Rules:

- `recommended_category` is guidance only.
- The product system remains responsible for real product selection.
- The quote page remains responsible for estimate output.

## Missing Info Output

```json
{
  "intent": "missing_info_collection",
  "category": "hybrid",
  "area_m2": null,
  "existing_floor": "carpet",
  "subfloor_condition": "unsure",
  "stairs": 0,
  "access": "easy",
  "ready_for_quote": false,
  "next_step": "quote.html"
}
```

Rules:

- `null` means unknown, not zero.
- `ready_for_quote` means enough to continue into the quote flow, not final quote readiness.
- The chatbot may highlight missing scope but must not calculate price.

## Quote Review Output

Quick check output:

```json
{
  "intent": "quick_quote_completeness",
  "review_mode": "quick",
  "flooring_type": "hybrid",
  "area_m2": 52,
  "included_items": ["supply", "installation"],
  "missing_items": ["floor_preparation", "disposal"],
  "risk_items": [
    {
      "key": "floor_preparation",
      "severity": "high",
      "title": "Floor preparation is not listed"
    }
  ],
  "clarity_score": 68,
  "risk_level": "moderate",
  "confidence_level": "low",
  "recommended_next_step": "quote-review.html"
}
```

Rules:

- Quick quote completeness is a no-file scope completeness check.
- It is based only on customer-entered or ticked information.
- It must not rank external quotes by price.
- It must not claim another quote is wrong.
- `clarity_score` is scope completeness only.
- It must not show document extraction, product match, or an Operon comparable estimate.
- No internal rates, margins, formulas, or calculated quote totals are allowed.
- The chatbot can collect draft values, but `quote-review.html` owns the real advisor payload.

Document review output:

```json
{
  "intent": "document_quote_review",
  "review_mode": "document",
  "business_shown_on_document": "Business shown on document",
  "document_type": "quote",
  "product_scope_line": "Hybrid 7mm supply and install",
  "flooring_type": "hybrid",
  "comparison_level": "category-level only",
  "extraction_confidence": "high",
  "decision_confidence": "low to medium",
  "product_match_status": "Product match not confirmed",
  "missing_items_to_check": ["brand/range", "underlay", "floor preparation", "trims"],
  "recommended_next_step": "quote.html?source=quote_review"
}
```

Rules:

- Document mode may extract visible document details.
- Extraction confidence means visible fields were read correctly.
- Comparison level means not comparable, category-level only, product-level, or scope-level.
- Decision confidence means how safe it is to compare the uploaded quote.
- Do not show high comparison confidence when the level is category-level only.
- If only category and thickness are shown, use "Product match not confirmed."

## Full Draft Output

```json
{
  "version": "1.0.0",
  "intent": "document_quote_review",
  "category": "hybrid",
  "recommended_category": "hybrid",
  "selection_mode": "recommend",
  "reason": "water resistance and durability",
  "area": 52,
  "area_m2": 52,
  "measurement_method": "manual_total",
  "existing_floor": "carpet",
  "removal_disposal": "unsure",
  "subfloor_condition": "unsure",
  "floor_prep_type": "unsure",
  "stairs": 0,
  "access": "easy",
  "furniture": "some",
  "property_type": "house",
  "level": "",
  "has_lift": "na",
  "parking_access": "easy",
  "quote_mode": "supply_install",
  "readiness": "review",
  "ready_for_quote": false,
  "next_step": "quote.html",
  "included_items": ["supply", "installation"],
  "missing_items_to_check": ["floor preparation", "disposal"],
  "scenario_id": "replacing_carpet",
  "scenario_step": 3,
  "scenario_flags": ["removal_scope_review"],
  "notes": [],
  "confidence_flags": ["category_selected"],
  "validation_flags": ["subfloor_review_recommended"],
  "missing_items": []
}
```

## Quote Field Draft Mapping

```json
{
  "quoteMode": "supply_install",
  "selectedProductCategory": "hybrid",
  "productChoiceMode": "recommend",
  "totalAreaM2": "52",
  "measurementMethod": "manual_total",
  "removalType": "carpet",
  "removalDisposal": "unsure",
  "floorPrepType": "unsure",
  "stairs": "no",
  "furnitureType": "yes",
  "parkingAccess": "easy",
  "propertyType": "house",
  "level": "",
  "hasLift": "na"
}
```

This is a prepared mapping only. It must not be applied automatically.
