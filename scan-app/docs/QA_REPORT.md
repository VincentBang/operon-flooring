# QA Report

## Scope

Phase 1 manual polygon measurement only.

No AR, LiDAR, quote pricing, product catalogue, or quote wizard integration was implemented.

## Validation Completed

- Geometry unit tests cover rectangle area/perimeter.
- Geometry unit tests reject self-crossing polygons.
- Geometry unit tests reject rooms with fewer than 3 points.
- Model unit tests verify structured report totals.
- Model unit tests verify portable JSON can be consumed by the mock quote reader.
- Model unit tests verify unsupported schemas are rejected.

## Manual QA Checklist

1. Run `npm start` from `/scan-app/`.
2. Open `http://localhost:4173`.
3. Click on the grid to add at least 3 points.
4. Drag existing points to edit the polygon.
5. Add a second room and verify totals update.
6. Generate JSON and confirm it includes all rooms.
7. Run mock quote read and confirm it accepts the JSON.
8. Draw a self-crossing room and confirm validation flags it.

## Known Phase 1 Limits

- Manual input only.
- Coordinates use meters on a 1-meter grid with quarter-meter snapping.
- No background image, AR scan, LiDAR, or scale calibration.
- No real quote-system connection.
- No persistent browser storage yet.

