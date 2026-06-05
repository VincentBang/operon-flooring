# Stage 5 Shadow Dispatch Plan

Date: 2026-06-04

Purpose: define a recommendation-only dispatch system where humans stay in control.

## Shadow Dispatch Behavior

- System recommends contractor options.
- Operator sees reasons.
- Operator approves, changes, or rejects.
- Override reason is recorded.

## Recommendation Inputs

- Suburb
- Product category
- Job value
- Complexity
- Contractor service area
- Capacity
- Scorecard metrics
- Similar job proof

## Output

```json
{
  "recommended_contractors": [
    {
      "contractor_id": "uuid",
      "fit_level": "high",
      "reasons": ["Services suburb", "Hybrid flooring proof", "Fast response history"],
      "risks": []
    }
  ]
}
```

## Non-Goals

- No automatic dispatch.
- No customer-visible contractor selection.
- No marketplace bidding.
- No payment handling.

## Safety

- Operator approval required.
- Contractor capacity must be current.
- Quality blockers override score.
- Complaint/rework risks visible.
