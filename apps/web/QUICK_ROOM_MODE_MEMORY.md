# Quick Room Mode Memory

Source-of-truth status: future-only experimental memory. Quick Room Mode stays hidden from customer UI until reliable.

Last updated: 2026-04-28  
Primary file: `/apps/web/floorplan.html`

## Purpose

Quick Room Mode is a future assisted-measurement workflow inside the Operon floor plan tool.

Its long-term goal is to:

1. load an uploaded floor plan
2. detect page / drawing boundary
3. separate exterior from interior
4. suggest room / flooring sections
5. help exclude wet / non-flooring areas
6. let the customer select only flooring zones
7. total selected m²
8. send confirmed area into `index.html`

This is not a magic AI feature.  
Manual correction must always remain possible.

## Guardrails

- Trace Room Mode stays primary and default.
- Quick Room Mode stays hidden from customer UI until reliable.
- Do not claim automatic room detection is accurate unless it is.
- Do not fake OCR or AI segmentation.
- Do not double-count overlapping regions.
- Do not include exterior areas in totals.
- Do not remove manual correction tools.

## Current Foundation State

Completed in the current experimental phase:

- Quick Room foundation UI cleaned up and kept hidden from customers
- status panel added
- central `quickRoomState` added
- image normalisation pipeline added
- debug view pipeline added
- advanced detection sliders added

Current Quick Room status panel shows:

- uploaded plan
- scale set
- detection status
- suggested zones count
- selected total area

Current debug views:

- original
- grayscale
- threshold
- cleaned

Current limitation:

- no true room segmentation yet
- no region detection yet
- no wet-area heuristics yet
- no Quick Room table yet

## Central State Shape

```js
const quickRoomState = {
  imageLoaded: false,
  imageElement: null,
  canvas: null,
  ctx: null,
  scale: null,
  originalCanvas: null,
  processedCanvas: null,
  grayscaleCanvas: null,
  thresholdCanvas: null,
  cleanedCanvas: null,
  detectedRegions: [],
  suggestedRooms: [],
  selectedRoomIds: new Set(),
  excludedRegions: [],
  debugMode: false,
  detectionStatus: "Not started",
  currentView: "original",
  settings: {
    contrast: 1.5,
    threshold: 160,
    noisePasses: 1
  }
};
```

## Phased Build Plan

### Phase 0 — Clean hidden foundation

- keep Trace Room Mode primary
- keep Quick Room Mode hidden
- do not expose it as a customer workflow until reliable
- add status panel
- centralise state

### Phase 1 — Image normalisation

- `loadFloorplanImage(file)`
- `drawImageToCanvas(image)`
- `normaliseImage()`
- `convertToGrayscale()`
- `increaseContrast()`
- `thresholdImage()`
- `removeNoise()`
- add debug views

### Phase 2 — Wall / line detection

- `detectDarkPixels()`
- `detectWallLines()`
- `createBinaryWallMask()`
- add threshold and noise tuning
- show wall mask overlay

### Phase 3 — Exterior vs interior

- flood fill from canvas edges
- treat dark wall pixels as barriers
- mark edge-connected white regions as exterior
- derive interior candidate mask

Target functions:

- `floodFillExterior()`
- `createExteriorMask()`
- `createInteriorCandidateMask()`

### Phase 4 — Interior cleanup

- remove tiny interior blobs
- close small wall gaps
- smooth and merge fragmented interior regions

### Phase 5 — Room / section segmentation

- connected component analysis
- region contours
- pixel region area
- suggested region objects

Each region should eventually look like:

```js
{
  id,
  type: "unknown",
  label: "Area 1",
  polygon,
  boundingBox,
  areaPx,
  areaM2,
  confidence,
  included: true,
  manuallyEdited: false
}
```

### Phase 6 — Wet / non-flooring exclusion

- no fake OCR
- future OCR can look for labels like bath, ensuite, wc, laundry, garage, balcony
- for now use manual room-type classification UI

### Phase 7 — Region selection UI

For each region:

- include / exclude checkbox
- room label
- room type dropdown
- area m²
- confidence
- delete button

### Phase 8 — Manual correction tools

Minimum:

- rename
- include / exclude
- delete
- manually add traced room

Future:

- merge selected regions
- split region polygon

### Phase 9 — Area conversion

Use the same scale system as Trace Room Mode.

```js
metresPerPixel = realDistanceM / pixelDistance
areaM2 = areaPx * metresPerPixel * metresPerPixel
```

If scale is missing, region suggestions can display but m² should not be trusted.

### Phase 10 — Quote connection

When ready, save:

```js
localStorage.setItem("operon_confirmed_floorplan_area", selectedTotalArea)
localStorage.setItem("operon_floorplan_rooms", JSON.stringify(suggestedRooms))
localStorage.setItem("operon_floorplan_source", "quick_room_mode")
```

### Phase 11 — Debug mode

Debug mode should eventually expose:

- original image
- threshold image
- wall mask
- exterior mask
- interior candidate mask
- detected regions
- selected regions
- scale
- region count
- selected total

### Phase 12 — Customer simplification

Normal customer flow should stay:

1. Upload floor plan
2. Set scale
3. Trace rooms
4. Select rooms for flooring
5. Use selected area in quote

All technical controls stay inside `Advanced detection settings` or debug mode.

## Recommended Next Phase

Next safe phase is Phase 2:

- create a binary wall mask from the cleaned image
- keep thresholds adjustable
- show wall mask in debug mode
- do not attempt room splitting yet
