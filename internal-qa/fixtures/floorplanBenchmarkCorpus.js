"use strict";

function section(id, label, points, options) {
  const settings = options || {};
  return {
    client_section_id: id,
    label: label,
    section_type: settings.section_type || "room",
    selection_state: settings.selection_state || "include",
    confidence: settings.confidence || "high",
    points: points,
    coordinate_space: "normalized_page",
    notes: settings.notes || undefined
  };
}

function shifted(points, dx, dy) {
  return points.map(function (point) {
    return {
      x: Math.max(0, Math.min(1, point.x + dx)),
      y: Math.max(0, Math.min(1, point.y + dy))
    };
  });
}

const PAGE = {
  page_width: 1000,
  page_height: 1000,
  pixels_per_metre: 100,
  coordinate_space: "normalized_page"
};

const livingRectangle = [
  { x: 0.1, y: 0.1 },
  { x: 0.6, y: 0.1 },
  { x: 0.6, y: 0.5 },
  { x: 0.1, y: 0.5 }
];

const longRoom = [
  { x: 0.08, y: 0.12 },
  { x: 0.88, y: 0.12 },
  { x: 0.88, y: 0.42 },
  { x: 0.08, y: 0.42 }
];

const lShape = [
  { x: 0.1, y: 0.1 },
  { x: 0.7, y: 0.1 },
  { x: 0.7, y: 0.4 },
  { x: 0.5, y: 0.4 },
  { x: 0.5, y: 0.6 },
  { x: 0.1, y: 0.6 }
];

const benchmarkCorpus = [
  {
    id: "synthetic-rectangle-clean",
    title: "Clean single-room rectangle",
    file_type: "synthetic-json",
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "high",
    reviewer_notes: "Baseline rectangle for confirming server-side area and reviewer approval.",
    expected_reviewed_area_m2: 20,
    expected_section_count: 1,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "high",
      page_key: "synthetic-rectangle-clean",
      ...PAGE,
      sections: [section("living", "Living and dining", livingRectangle)]
    },
    customer: {
      source: "floorplan_benchmark",
      measurement_mode: "manual_trace",
      confidence_level: "high",
      page_key: "synthetic-rectangle-clean-customer",
      ...PAGE,
      sections: [section("living-customer", "Living and dining", shifted(livingRectangle, 0.005, 0))]
    }
  },
  {
    id: "synthetic-long-open-plan",
    title: "Long open-plan living area",
    file_type: "synthetic-json",
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "high",
    reviewer_notes: "Wide rectangular room used to catch aspect-ratio or bounding-box mistakes.",
    expected_reviewed_area_m2: 24,
    expected_section_count: 1,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "high",
      page_key: "synthetic-long-open-plan",
      ...PAGE,
      sections: [section("open-plan", "Open plan living", longRoom)]
    },
    customer: {
      source: "floorplan_benchmark",
      measurement_mode: "manual_trace",
      confidence_level: "medium",
      page_key: "synthetic-long-open-plan-customer",
      ...PAGE,
      sections: [section("open-plan-customer", "Open plan living", shifted(longRoom, -0.004, 0.004), { confidence: "medium" })]
    }
  },
  {
    id: "synthetic-l-shaped-living",
    title: "L-shaped living and hallway",
    file_type: "synthetic-json",
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "medium",
    reviewer_notes: "Non-rectangular shape for reviewer validation before assisted detection experiments.",
    expected_reviewed_area_m2: 26,
    expected_section_count: 1,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "medium",
      page_key: "synthetic-l-shaped-living",
      ...PAGE,
      sections: [section("living-hall", "Living and hallway", lShape, { confidence: "medium" })]
    },
    customer: {
      source: "floorplan_benchmark",
      measurement_mode: "manual_trace",
      confidence_level: "medium",
      page_key: "synthetic-l-shaped-living-customer",
      ...PAGE,
      sections: [section("living-hall-customer", "Living and hallway", shifted(lShape, 0.003, -0.002), { confidence: "medium" })]
    }
  },
  {
    id: "synthetic-two-room-apartment",
    title: "Two-room apartment with separate bedroom",
    file_type: "synthetic-json",
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "high",
    reviewer_notes: "Multiple included sections; useful for room-count and aggregate checks.",
    expected_reviewed_area_m2: 33,
    expected_section_count: 2,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "high",
      page_key: "synthetic-two-room-apartment",
      ...PAGE,
      sections: [
        section("living", "Living room", [{ x: 0.08, y: 0.08 }, { x: 0.48, y: 0.08 }, { x: 0.48, y: 0.48 }, { x: 0.08, y: 0.48 }]),
        section("bedroom", "Bedroom", [{ x: 0.52, y: 0.08 }, { x: 0.86, y: 0.08 }, { x: 0.86, y: 0.58 }, { x: 0.52, y: 0.58 }])
      ]
    }
  },
  {
    id: "synthetic-wet-area-excluded",
    title: "Apartment with wet area excluded",
    file_type: "synthetic-json",
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "high",
    reviewer_notes: "Checks selected area excludes bathrooms while measured area can retain them for review.",
    expected_reviewed_area_m2: 24,
    expected_measured_area_m2: 24,
    expected_section_count: 3,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "high",
      page_key: "synthetic-wet-area-excluded",
      ...PAGE,
      sections: [
        section("living", "Living", [{ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.4 }, { x: 0.1, y: 0.4 }]),
        section("bedroom", "Bedroom", [{ x: 0.55, y: 0.1 }, { x: 0.85, y: 0.1 }, { x: 0.85, y: 0.5 }, { x: 0.55, y: 0.5 }]),
        section("bath", "Bathroom", [{ x: 0.1, y: 0.45 }, { x: 0.3, y: 0.45 }, { x: 0.3, y: 0.75 }, { x: 0.1, y: 0.75 }], { section_type: "wet_area", selection_state: "exclude" })
      ]
    }
  },
  {
    id: "synthetic-stairs-void-excluded",
    title: "Townhouse floor with stair void excluded",
    file_type: "synthetic-json",
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "medium",
    reviewer_notes: "Checks void/excluded sections do not flow into quote area.",
    expected_reviewed_area_m2: 30.8,
    expected_measured_area_m2: 30.8,
    expected_section_count: 2,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "medium",
      page_key: "synthetic-stairs-void-excluded",
      ...PAGE,
      sections: [
        section("upper-living", "Upper living", [{ x: 0.12, y: 0.12 }, { x: 0.82, y: 0.12 }, { x: 0.82, y: 0.56 }, { x: 0.12, y: 0.56 }], { confidence: "medium" }),
        section("stair-void", "Stair void", [{ x: 0.12, y: 0.6 }, { x: 0.27, y: 0.6 }, { x: 0.27, y: 0.8 }, { x: 0.12, y: 0.8 }], { section_type: "void", selection_state: "exclude", confidence: "medium" })
      ]
    }
  },
  {
    id: "synthetic-not-sure-balcony",
    title: "Balcony threshold marked not sure",
    file_type: "synthetic-json",
    plan_quality: "mixed_boundary",
    scale_availability: "known_wall",
    expected_confidence: "medium",
    reviewer_notes: "Validates not-sure sections require review and do not silently block the workflow.",
    expected_reviewed_area_m2: 18,
    expected_measured_area_m2: 22,
    expected_section_count: 2,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "medium",
      page_key: "synthetic-not-sure-balcony",
      ...PAGE,
      sections: [
        section("living", "Living", [{ x: 0.1, y: 0.1 }, { x: 0.55, y: 0.1 }, { x: 0.55, y: 0.5 }, { x: 0.1, y: 0.5 }], { confidence: "high" }),
        section("balcony-threshold", "Balcony threshold", [{ x: 0.6, y: 0.1 }, { x: 0.8, y: 0.1 }, { x: 0.8, y: 0.3 }, { x: 0.6, y: 0.3 }], { section_type: "outdoor", selection_state: "not_sure", confidence: "low" })
      ]
    }
  },
  {
    id: "synthetic-low-confidence-scan",
    title: "Low-confidence scanned plan trace",
    file_type: "synthetic-json",
    plan_quality: "low_contrast_scan",
    scale_availability: "known_wall",
    expected_confidence: "low",
    reviewer_notes: "Keeps low-confidence plans in the benchmark without treating them as automatic approvals.",
    expected_reviewed_area_m2: 13.68,
    expected_section_count: 1,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "low",
      page_key: "synthetic-low-confidence-scan",
      ...PAGE,
      sections: [section("bedroom", "Bedroom", [{ x: 0.18, y: 0.15 }, { x: 0.58, y: 0.12 }, { x: 0.62, y: 0.45 }, { x: 0.24, y: 0.51 }], { confidence: "low" })]
    }
  },
  {
    id: "synthetic-multipage-ground",
    title: "Multipage PDF ground floor",
    file_type: "synthetic-pdf-page",
    page_count: 2,
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "high",
    reviewer_notes: "Represents one page of a multipage PDF without storing an actual customer document.",
    expected_reviewed_area_m2: 41,
    expected_section_count: 2,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "high",
      page_key: "synthetic-multipage-ground",
      ...PAGE,
      sections: [
        section("living-kitchen", "Living and kitchen", [{ x: 0.08, y: 0.12 }, { x: 0.7, y: 0.12 }, { x: 0.7, y: 0.52 }, { x: 0.08, y: 0.52 }]),
        section("study", "Study", [{ x: 0.74, y: 0.12 }, { x: 0.94, y: 0.12 }, { x: 0.94, y: 0.93 }, { x: 0.74, y: 0.93 }])
      ]
    }
  },
  {
    id: "synthetic-irregular-hallway",
    title: "Irregular hallway with nook",
    file_type: "synthetic-json",
    plan_quality: "clean_vector",
    scale_availability: "known_wall",
    expected_confidence: "medium",
    reviewer_notes: "A small irregular area that should stay reviewer-led before Phase 3 detection.",
    expected_reviewed_area_m2: 11.19,
    expected_section_count: 1,
    reviewed: {
      source: "floorplan_benchmark",
      measurement_mode: "reviewed_trace",
      confidence_level: "medium",
      page_key: "synthetic-irregular-hallway",
      ...PAGE,
      sections: [
        section("hallway", "Hallway and nook", [
          { x: 0.18, y: 0.18 },
          { x: 0.52, y: 0.18 },
          { x: 0.52, y: 0.34 },
          { x: 0.43, y: 0.34 },
          { x: 0.43, y: 0.57 },
          { x: 0.18, y: 0.57 }
        ], { confidence: "medium" })
      ]
    }
  }
];

module.exports = benchmarkCorpus;
