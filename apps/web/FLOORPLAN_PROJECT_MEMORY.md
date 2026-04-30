# Operon Floorplan Tool Project Memory

Last updated: 2026-04-30  
Primary page: `/apps/web/floorplan.html`

## Purpose

This page is the floor plan measurement tool for the Operon quote flow.

Its job is to:

1. upload a floor plan
2. set scale
3. trace rooms and sections
4. calculate room areas
5. total selected flooring area
6. pass confirmed area into `index.html`

This page is not a visualiser and not an AI room preview tool.

## Source Files To Read Before Editing

1. `apps/web/CODEX_PROJECT_MEMORY.md`
2. `/Users/daibang/Downloads/OPERON_PRICING_RULES.md`
3. `apps/web/index.html`
4. `apps/web/floorplan.html`

## Primary Design Principle

Trace Room Mode is the default and primary mode.

The page should feel:

- simple
- practical
- mobile friendly where possible
- measurement focused
- consistent with `index.html`
- not like a messy tech demo

## UI Consistency Rules

`floorplan.html` should visually match `index.html`.

Use the same:

- background colour
- typography
- primary and secondary button style
- card radius
- subtle shadow level
- container width
- section spacing
- calm premium visual tone

Current customer-facing structure:

1. header / nav
2. full-width hero
3. short measurement flow cards
4. main measurement tool
5. selected area summary
6. quote return CTA
7. short supporting SEO section
8. footer

The page should focus on one workflow only:

upload floor plan → set scale → trace rooms → use area in quote

Avoid:

- gradients
- loud visual effects
- dense technical copy
- visible Quick Room Mode controls

## Core User Flow

1. Upload floor plan
2. Set scale
3. Trace room
4. Room auto-closes near the start point
5. Room area is calculated
6. Room is added to the measurement table
7. Saved room can be fine-tuned by dragging corners or edge handles
8. Total selected flooring area is updated
9. User sends the area into quote

## Trace Room Mode Rules

Trace Room Mode is the main workflow.

### Scale flow

Required behaviour:

1. user presses `Set Scale`
2. user clicks first point
3. user clicks second point
4. a modal / popup asks for real distance in metres
5. user enters distance and saves
6. scale is confirmed immediately

There must be no separate `Confirm Scale` button.

UI note:

- first row should contain both `Step 1. Set scale` and `Reset scale`
- after scale is confirmed, `Step 1. Set scale` should change to `Step 1. Scale set`
- if `Reset scale` is pressed, `Step 1. Scale set` should return to `Step 1. Set scale`

### Trace flow

Required behaviour:

1. user presses `Trace Room`
2. user clicks points around the room
3. points connect into a polygon
4. when the newest point is near the first point:
   - snap to the first point
   - close polygon
   - calculate area
   - ask for room / section name
   - add it to saved rooms
   - reset trace state for the next room

There must be no separate `Save Trace Room` button.

UI note:

- `Step 2. Trace room`, `Undo point`, and `Clear trace` should stay on the same row because they belong to the same tracing task
- `Trace room` should not look visually ahead of the workflow before scale is ready

### Saved room adjustment

After a room is saved:

- the room can be selected from the table or canvas
- corner handles should allow point-by-point correction
- edge handles should allow whole wall-line correction
- area should recalculate after adjustment

This is important because small tracing errors should not force a full retrace.

### Auto-close rules

- use a snap threshold around 12–20 px
- only allow closing after at least 3 existing points

### Area calculation

- use shoelace formula on pixel points
- convert pixel area into m² using confirmed scale
- round sensibly, typically 2 decimals

### Scale requirement

Preferred behaviour:

- require scale before tracing a room for saving

## Measurement Table Requirements

Each saved section should show:

- room / section name
- area m²
- include in quote checkbox
- editable name
- delete action

Total selected flooring area:

- sum only checked / included rooms

Display:

`Total selected flooring area: X m²`

## Quote Connection

The simplest supported connection is localStorage.

Save:

```js
localStorage.setItem("operon_confirmed_floorplan_area", totalArea)
localStorage.setItem("operon_floorplan_rooms", JSON.stringify(rooms))
```

For compatibility with the current quote page, also save:

```js
localStorage.setItem("operon-floorplan-area", totalArea)
```

Button label:

`Use this area in quote`

Navigation rule:

- when the customer opens quote from the floorplan tool, return them to `index.html` Step 4 so the area handoff feels like one continuous flow
- the quote page should surface a short handoff message rather than forcing the customer to guess what changed

## Quick Room Mode Position

Quick Room Mode is secondary only.

It should be labelled:

`Assisted room selection — experimental`

It must not be presented as the main or most reliable method.

Current customer-facing rule:

- Quick Room Mode UI is intentionally hidden until automatic floor plan segmentation is reliable
- the customer-facing page should show one clear tracing workflow only:
  upload floor plan → set scale → trace rooms → select included rooms → use area in quote

If segmentation is not actually reliable, do not fake confidence.

Current dedicated memory file:

- `apps/web/QUICK_ROOM_MODE_MEMORY.md`

Current Quick Room implementation status:

- only foundation work is in place so far
- assisted-image preparation is available
- debug views can show original / grayscale / threshold / cleaned
- room segmentation is not built yet
- Trace Room Mode remains the confirmed measurement path

## Future Quick Room Segmentation Hierarchy

When improved later, Quick Room Mode should follow this order:

1. exterior boundary detection
2. interior usable area detection
3. wet-area exclusion
4. flooring-area segmentation
5. room / zone proposal
6. customer selection
7. selected area total

No overlapping sections should ever be double-counted.

Customers must always be able to:

- select
- deselect
- rename
- adjust
- manually override

## Copy Principles

Use wording like:

- `Upload floor plan`
- `Set scale`
- `Trace room`
- `Add rooms automatically`
- `Review selected area`
- `Use area in quote`

Helpful microcopy:

- `Click two points on a known wall length, then enter the real distance.`
- `Trace around the room. When you return near the start point, the room will close automatically.`
- `Select only the rooms where flooring will be installed.`

Avoid:

- visualiser language
- AI hype
- confusing technical wording
- duplicate controls

## Suggested Core Functions

Keep logic grouped around these functions:

- `initFloorplanTool()`
- `handlePlanUpload()`
- `startScaleMode()`
- `handleScalePointClick(point)`
- `openScaleDistanceModal()`
- `confirmScale(distanceMeters)`
- `startTraceMode()`
- `handleTracePointClick(point)`
- `shouldAutoClosePolygon(points, newPoint)`
- `closeAndSavePolygon()`
- `calculatePolygonAreaPx(points)`
- `convertPixelAreaToSquareMeters(areaPx)`
- `addMeasuredRoom(room)`
- `renderRoomsTable()`
- `calculateSelectedTotalArea()`
- `saveAreaForQuote()`

Avoid spreading pricing / measurement logic through unrelated event handlers.

## Debug Checklist

After changes, test:

1. page loads without JS errors
2. upload works
3. set scale uses one flow only
4. second scale click opens distance input
5. entering distance confirms scale
6. trace mode requires scale
7. polygon points draw correctly
8. polygon auto-snaps near the start point
9. polygon auto-saves without save button
10. room appears in table
11. total area updates
12. include / exclude updates total
13. delete updates total
14. quote handoff saves localStorage
15. quick room mode does not over-claim

## Guardrails

Do not:

- rebuild the app framework
- add heavy dependencies
- fake AI segmentation
- make Quick Room Mode the default
- add visualiser features
- require both `Enter distance` and `Confirm scale`
- require both auto-close and `Save traced room`
