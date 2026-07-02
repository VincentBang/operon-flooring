"use strict";

function section(id, label, points, options) {
  const settings = options || {};
  return {
    client_section_id: id,
    label: label,
    section_type: settings.section_type || "room",
    selection_state: settings.selection_state || "include",
    confidence: settings.confidence || "medium",
    points: points,
    coordinate_space: "normalized_page"
  };
}

const page = {
  page_width: 1000,
  page_height: 1000,
  pixels_per_metre: 100,
  coordinate_space: "normalized_page"
};

const SAMPLE_ROOM = [
  { x: 0.12, y: 0.12 },
  { x: 0.56, y: 0.12 },
  { x: 0.56, y: 0.48 },
  { x: 0.12, y: 0.48 }
];

const SAMPLE_SECOND_ROOM = [
  { x: 0.6, y: 0.12 },
  { x: 0.86, y: 0.12 },
  { x: 0.86, y: 0.44 },
  { x: 0.6, y: 0.44 }
];

module.exports = {
  id: "reviewed-sample-template",
  title: "Reviewed sample template",
  file_type: "reviewed-json-template",
  fixture_origin: "approved_real_reviewed_sample",
  usage_status: "approved_for_internal_benchmark",
  privacy_status: "customer_identifiers_removed",
  customer_identifiers_removed: true,
  plan_quality: "mixed_boundary",
  scale_availability: "known_wall",
  expected_confidence: "medium",
  reviewer_notes: "Template only. Replace with a privacy-safe reviewed measurement summary before benchmark use.",
  expected_reviewed_area_m2: 24.16,
  expected_section_count: 2,
  reviewed: {
    source: "floorplan_benchmark_template",
    measurement_mode: "reviewed_trace",
    confidence_level: "medium",
    page_key: "reviewed-sample-template",
    ...page,
    sections: [
      section("living-room", "Living room", SAMPLE_ROOM),
      section("bedroom", "Bedroom", SAMPLE_SECOND_ROOM)
    ]
  }
};
