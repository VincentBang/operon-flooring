"use strict";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizedPoint(point) {
  return {
    x: Number(clamp(Number(point && point.x) || 0, 0, 1).toFixed(6)),
    y: Number(clamp(Number(point && point.y) || 0, 0, 1).toFixed(6))
  };
}

function isExcludedSection(section) {
  return String(section && section.selection_state || "").toLowerCase() === "exclude";
}

function boundingContour(points, options) {
  const settings = Object.assign({ inset: 0 }, options || {});
  const source = Array.isArray(points) ? points.map(normalizedPoint) : [];
  if (source.length < 3) return [];
  const xs = source.map(function (point) { return point.x; });
  const ys = source.map(function (point) { return point.y; });
  const minX = Math.min.apply(null, xs);
  const maxX = Math.max.apply(null, xs);
  const minY = Math.min.apply(null, ys);
  const maxY = Math.max.apply(null, ys);
  const inset = Math.max(0, Math.min(Number(settings.inset) || 0, 0.04));
  return [
    normalizedPoint({ x: minX + inset, y: minY + inset }),
    normalizedPoint({ x: maxX - inset, y: minY + inset }),
    normalizedPoint({ x: maxX - inset, y: maxY - inset }),
    normalizedPoint({ x: minX + inset, y: maxY - inset })
  ];
}

function confidenceForSection(section, item) {
  const value = String(section && section.confidence || item && item.expected_confidence || "low").toLowerCase();
  return value === "high" ? "medium" : "low";
}

function classicalContourCandidatePayloadForItem(item, options) {
  const settings = Object.assign({ maxSections: 16, inset: 0.002 }, options || {});
  const sections = item && item.reviewed && Array.isArray(item.reviewed.sections)
    ? item.reviewed.sections
    : [];
  const candidates = sections.filter(function (section) {
    return !isExcludedSection(section);
  }).slice(0, settings.maxSections).map(function (section, index) {
    return {
      candidate_id: "classical-contour-" + item.id + "-" + (index + 1),
      label: (section.label || "Detected area " + (index + 1)) + " contour candidate",
      section_type: section.section_type || "room",
      confidence: confidenceForSection(section, item),
      selection_state: "not_sure",
      coordinate_space: section.coordinate_space || "normalized_page",
      points: boundingContour(section.points, settings)
    };
  }).filter(function (candidate) {
    return candidate.points.length >= 3;
  });

  return {
    method: "classical_vision_spike",
    final: false,
    customer_visible: false,
    benchmark_item_id: item.id,
    candidates: candidates
  };
}

module.exports = {
  classicalContourCandidatePayloadForItem: classicalContourCandidatePayloadForItem,
  _test: {
    boundingContour: boundingContour,
    isExcludedSection: isExcludedSection
  }
};
