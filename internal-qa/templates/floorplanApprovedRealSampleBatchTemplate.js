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

function fixture(id, title, options) {
  const settings = options || {};
  const page = {
    page_width: 1000,
    page_height: 1000,
    pixels_per_metre: 100,
    coordinate_space: "normalized_page"
  };
  const sections = settings.sections || [
    section("main-area", "Main area", [
      { x: 0.1, y: 0.1 },
      { x: 0.5, y: 0.1 },
      { x: 0.5, y: 0.45 },
      { x: 0.1, y: 0.45 }
    ])
  ];

  return {
    id: id,
    title: title,
    file_type: settings.file_type || "reviewed-json-template",
    fixture_origin: "approved_real_reviewed_sample",
    usage_status: "approved_for_internal_benchmark",
    privacy_status: "customer_identifiers_removed",
    customer_identifiers_removed: true,
    plan_quality: settings.plan_quality || "mixed_boundary",
    scale_availability: settings.scale_availability || "known_wall",
    expected_confidence: settings.expected_confidence || "medium",
    reviewer_notes: settings.reviewer_notes || "Template only. Replace with a privacy-safe reviewed measurement summary before benchmark use.",
    page_count: settings.page_count || 1,
    expected_reviewed_area_m2: settings.expected_reviewed_area_m2,
    expected_measured_area_m2: settings.expected_measured_area_m2 || settings.expected_reviewed_area_m2,
    expected_section_count: sections.length,
    reviewed: Object.assign({
      source: "floorplan_benchmark_template",
      measurement_mode: "reviewed_trace",
      confidence_level: settings.expected_confidence || "medium",
      page_key: id
    }, page, {
      sections: sections
    })
  };
}

module.exports = [
  fixture("reviewed-sample-low-contrast-template", "Reviewed low contrast sample template", {
    file_type: "reviewed-image-template",
    plan_quality: "low_contrast_scan",
    expected_confidence: "low",
    expected_reviewed_area_m2: 14,
    reviewer_notes: "Template for a low-contrast approved sample. Keep only reviewed geometry and non-identifying labels."
  }),
  fixture("reviewed-sample-mixed-boundary-template", "Reviewed mixed boundary sample template", {
    plan_quality: "mixed_boundary",
    expected_reviewed_area_m2: 21,
    sections: [
      section("living-area", "Living area", [
        { x: 0.08, y: 0.08 },
        { x: 0.44, y: 0.08 },
        { x: 0.44, y: 0.42 },
        { x: 0.08, y: 0.42 }
      ]),
      section("entry-area", "Entry area", [
        { x: 0.46, y: 0.1 },
        { x: 0.68, y: 0.1 },
        { x: 0.68, y: 0.5 },
        { x: 0.46, y: 0.5 }
      ])
    ]
  }),
  fixture("reviewed-sample-void-adjacent-template", "Reviewed void adjacent sample template", {
    plan_quality: "mixed_boundary",
    expected_reviewed_area_m2: 15.6,
    expected_measured_area_m2: 17.4,
    sections: [
      section("hall-area", "Hall area", [
        { x: 0.12, y: 0.1 },
        { x: 0.48, y: 0.1 },
        { x: 0.48, y: 0.5 },
        { x: 0.12, y: 0.5 }
      ]),
      section("void-area", "Void area", [
        { x: 0.5, y: 0.12 },
        { x: 0.62, y: 0.12 },
        { x: 0.62, y: 0.27 },
        { x: 0.5, y: 0.27 }
      ], { section_type: "void", selection_state: "exclude" })
    ]
  }),
  fixture("reviewed-sample-multipage-template", "Reviewed multipage sample template", {
    file_type: "reviewed-pdf-page",
    plan_quality: "clear_vector",
    page_count: 2,
    expected_reviewed_area_m2: 15.84,
    sections: [
      section("level-area", "Level area", [
        { x: 0.12, y: 0.12 },
        { x: 0.56, y: 0.12 },
        { x: 0.56, y: 0.48 },
        { x: 0.12, y: 0.48 }
      ])
    ]
  }),
  fixture("reviewed-sample-irregular-template", "Reviewed irregular geometry sample template", {
    plan_quality: "mixed_boundary",
    expected_reviewed_area_m2: 15.4,
    sections: [
      section("open-plan-area", "Open plan area", [
        { x: 0.1, y: 0.1 },
        { x: 0.5, y: 0.1 },
        { x: 0.5, y: 0.28 },
        { x: 0.38, y: 0.28 },
        { x: 0.38, y: 0.48 },
        { x: 0.1, y: 0.48 }
      ])
    ]
  })
];
