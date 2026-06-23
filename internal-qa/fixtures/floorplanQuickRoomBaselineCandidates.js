"use strict";

const quickRoom = require("../../apps/web/floorplanQuickRoom.js");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toPixelPoint(point, width, height) {
  return {
    x: Math.round(clamp(Number(point.x) || 0, 0, 1) * (width - 1)),
    y: Math.round(clamp(Number(point.y) || 0, 0, 1) * (height - 1))
  };
}

function setMaskPixel(mask, width, height, x, y, thickness) {
  const radius = Math.max(0, Math.floor((Number(thickness) || 1) / 2));
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const px = x + dx;
      const py = y + dy;
      if (px >= 0 && px < width && py >= 0 && py < height) {
        mask[(py * width) + px] = 1;
      }
    }
  }
}

function drawLine(mask, width, height, first, second, thickness) {
  let x0 = first.x;
  let y0 = first.y;
  const x1 = second.x;
  const y1 = second.y;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    setMaskPixel(mask, width, height, x0, y0, thickness);
    if (x0 === x1 && y0 === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function drawPolygon(mask, width, height, points, thickness) {
  const pixelPoints = points.map(function (point) {
    return toPixelPoint(point, width, height);
  });
  for (let index = 0; index < pixelPoints.length; index += 1) {
    drawLine(mask, width, height, pixelPoints[index], pixelPoints[(index + 1) % pixelPoints.length], thickness);
  }
}

function buildWallMaskFromReviewedItem(item, options) {
  const settings = Object.assign({ width: 320, height: 320, wallThickness: 3 }, options || {});
  const mask = new Uint8Array(settings.width * settings.height);
  const sections = item && item.reviewed && Array.isArray(item.reviewed.sections) ? item.reviewed.sections : [];

  sections.forEach(function (section) {
    const points = Array.isArray(section.points) ? section.points : [];
    if (points.length >= 3) {
      drawPolygon(mask, settings.width, settings.height, points, settings.wallThickness);
    }
  });

  return {
    mask: mask,
    width: settings.width,
    height: settings.height
  };
}

function normalizeCandidatePoint(point, width, height) {
  return {
    x: Number((clamp(Number(point.x) || 0, 0, width) / width).toFixed(6)),
    y: Number((clamp(Number(point.y) || 0, 0, height) / height).toFixed(6))
  };
}

function confidenceForAdapter(rawConfidence) {
  return String(rawConfidence || "").toLowerCase() === "low" ? "low" : "medium";
}

function quickRoomCandidatePayloadForItem(item, options) {
  const settings = Object.assign({ maxCandidates: 12, minAreaM2: 1, wallCloseRadius: 0 }, options || {});
  const wallMask = buildWallMaskFromReviewedItem(item, settings);
  const pageWidth = Number(item.reviewed && item.reviewed.page_width) || 1000;
  const fixturePixelsPerMetre = Number(item.reviewed && item.reviewed.pixels_per_metre) || 100;
  const pixelsPerMetre = fixturePixelsPerMetre * (wallMask.width / pageWidth);
  const candidates = quickRoom.detectAllRoomCandidatesFromMask(wallMask.mask, wallMask.width, wallMask.height, {
    pixelsPerMetre: pixelsPerMetre,
    closeRadius: settings.wallCloseRadius,
    maxCandidates: settings.maxCandidates,
    minRegionPixels: 25,
    minAreaM2: settings.minAreaM2,
    maxAreaM2: 180
  });

  return {
    method: "quick_room_baseline",
    final: false,
    customer_visible: false,
    benchmark_item_id: item.id,
    candidates: candidates.map(function (candidate, index) {
      return {
        candidate_id: "quick-room-" + item.id + "-" + (index + 1),
        label: candidate.displayName || "Quick room candidate " + (index + 1),
        section_type: "room",
        confidence: confidenceForAdapter(candidate.confidence),
        raw_confidence: candidate.confidence,
        selection_state: "not_sure",
        coordinate_space: "normalized_page",
        points: (candidate.polygon || []).map(function (point) {
          return normalizeCandidatePoint(point, wallMask.width, wallMask.height);
        })
      };
    })
  };
}

module.exports = {
  buildWallMaskFromReviewedItem: buildWallMaskFromReviewedItem,
  quickRoomCandidatePayloadForItem: quickRoomCandidatePayloadForItem,
  _test: {
    drawLine: drawLine,
    drawPolygon: drawPolygon
  }
};
