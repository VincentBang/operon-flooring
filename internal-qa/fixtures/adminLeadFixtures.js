const listResponse = {
  ok: true,
  leads: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      created_at: "2026-06-04T00:00:00.000Z",
      last_activity_at: "2026-06-04T00:10:00.000Z",
      primary_source: "quote",
      source_detail: "direct_quote_submit",
      status: "New",
      priority: "normal",
      customer_name: "Synthetic Quote Lead",
      suburb: "Auburn",
      postcode: "2144",
      product_category: "hybrid",
      area_m2: 60,
      estimate_total_inc_gst: 3850,
      confidence_level: "medium",
      missing_info_count: 1,
      risk_flag_count: 0,
      next_action: "Review quote request"
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      created_at: "2026-06-04T00:20:00.000Z",
      last_activity_at: "2026-06-04T00:25:00.000Z",
      primary_source: "quote",
      source_detail: "product_handoff",
      status: "New",
      priority: "normal",
      customer_name: "Synthetic Product Lead",
      suburb: "Parramatta",
      postcode: "2150",
      product_category: "laminate",
      area_m2: 45,
      estimate_total_inc_gst: 2750,
      confidence_level: "medium",
      missing_info_count: 0,
      risk_flag_count: 1,
      next_action: "Confirm selected product and follow up"
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      created_at: "2026-06-04T00:30:00.000Z",
      last_activity_at: "2026-06-04T00:35:00.000Z",
      primary_source: "quote_review",
      source_detail: "quick_check",
      status: "Needs review",
      priority: "high",
      customer_name: "Synthetic Review Lead",
      suburb: "Sydney",
      postcode: "2000",
      product_category: "engineered_timber",
      area_m2: 80,
      estimate_total_inc_gst: 9800,
      confidence_level: "low",
      missing_info_count: 4,
      risk_flag_count: 3,
      next_action: "Review quote comparison and offer Operon comparison quote"
    },
    {
      id: "44444444-4444-4444-8444-444444444444",
      created_at: "2026-06-04T00:40:00.000Z",
      last_activity_at: "2026-06-04T00:42:00.000Z",
      primary_source: "contact",
      source_detail: "contact_form",
      status: "New",
      priority: "normal",
      customer_name: "Synthetic Contact Lead",
      suburb: "Bankstown",
      postcode: "2200",
      product_category: "",
      area_m2: null,
      estimate_total_inc_gst: null,
      confidence_level: "",
      missing_info_count: 0,
      risk_flag_count: 0,
      contact_status: "internal_notification_sent",
      next_action: "Review contact enquiry"
    },
    {
      id: "55555555-5555-4555-8555-555555555555",
      created_at: "2026-06-04T00:50:00.000Z",
      last_activity_at: "2026-06-04T00:52:00.000Z",
      primary_source: "chatbot",
      source_detail: "operator_request",
      status: "New",
      priority: "normal",
      customer_name: "Synthetic Operator Lead",
      suburb: "",
      postcode: "",
      product_category: "",
      area_m2: null,
      estimate_total_inc_gst: null,
      confidence_level: "",
      missing_info_count: 0,
      risk_flag_count: 0,
      next_action: "Review operator request"
    },
    {
      id: "88888888-8888-4888-8888-888888888888",
      created_at: "2026-06-04T01:00:00.000Z",
      last_activity_at: "2026-06-04T01:05:00.000Z",
      primary_source: "floorplan",
      source_detail: "floorplan_handoff",
      status: "Needs review",
      priority: "normal",
      customer_name: "Synthetic Floorplan Lead",
      suburb: "Liverpool",
      postcode: "2170",
      product_category: "hybrid",
      area_m2: 62,
      estimate_total_inc_gst: null,
      confidence_level: "low",
      missing_info_count: 2,
      risk_flag_count: 1,
      floorplan_status: "needs_review",
      next_action: "Review floorplan area before quoting"
    }
  ],
  next_cursor: "synthetic-cursor-2"
};

const detailResponses = {
  quote: {
    ok: true,
    lead: {
      id: "11111111-1111-4111-8111-111111111111",
      primary_source: "quote",
      source_detail: "direct_quote_submit",
      status: "New",
      priority: "normal",
      customer: {
        name: "Synthetic Quote Lead",
        email: "synthetic.quote@example.invalid",
        phone: "0400000000"
      },
      project: {
        suburb: "Auburn",
        postcode: "2144",
        product_category: "hybrid",
        product_name: "Synthetic hybrid range",
        area_m2: 60,
        estimated_order_area_m2: 66
      },
      quote: {
        estimate_total_inc_gst: 3850,
        confidence_score: 72,
        confidence_level: "medium",
        missing_info_flags: ["access_details"],
        risk_flags: []
      },
      statuses: {
        quote_review_status: "none",
        floorplan_status: "none",
        contact_status: "customer_and_internal_email_sent",
        follow_up_status: "queued"
      },
      next_action: "Review quote request"
    },
    events: [
      {
        event_type: "quote_submitted",
        source: "save-quote-request",
        created_at: "2026-06-04T00:10:00.000Z",
        metadata: {
          source_detail: "direct_quote_submit",
          followup_queued: 1
        }
      }
    ],
    notes: [],
    files: []
  },
  quoteReview: {
    ok: true,
    lead: {
      id: "33333333-3333-4333-8333-333333333333",
      primary_source: "quote_review",
      source_detail: "quick_check",
      status: "Needs review",
      priority: "high",
      customer: {
        name: "Synthetic Review Lead",
        email: "synthetic.review@example.invalid",
        phone: "0400000001"
      },
      project: {
        suburb: "Sydney",
        postcode: "2000",
        product_category: "engineered_timber",
        area_m2: 80
      },
      quote: {
        estimate_total_inc_gst: 9800,
        confidence_level: "low",
        missing_info_flags: ["product_range", "floor_preparation", "warranty_terms"],
        risk_flags: ["unclear_scope", "low_document_clarity"]
      },
      statuses: {
        quote_review_status: "saved",
        floorplan_status: "none",
        contact_status: "none",
        follow_up_status: "none"
      },
      next_action: "Review quote comparison and offer Operon comparison quote"
    },
    events: [
      {
        event_type: "quote_review_saved",
        source: "save-quote-review",
        created_at: "2026-06-04T00:35:00.000Z",
        metadata: {
          review_mode: "quick_check",
          missing_item_count: 3,
          risk_flag_count: 2
        }
      }
    ],
    notes: [],
    files: []
  },
  upload: {
    ok: true,
    lead: {
      id: "11111111-1111-4111-8111-111111111111",
      primary_source: "quote",
      status: "New",
      priority: "normal"
    },
    events: [
      {
        event_type: "file_uploaded",
        source: "upload-customer-file",
        created_at: "2026-06-04T00:12:00.000Z",
        metadata: {
          source: "quote",
          file_type: "application/pdf",
          file_size_bytes: 120000
        }
      }
    ],
    notes: [
      {
        id: "66666666-6666-4666-8666-666666666666",
        body: "Synthetic internal note for fixture testing.",
        created_by: "synthetic-admin",
        created_at: "2026-06-04T00:15:00.000Z"
      }
    ],
    files: [
      {
        uploaded_file_id: "77777777-7777-4777-8777-777777777777",
        safe_filename: "synthetic-quote.pdf",
        file_role: "quote_attachment",
        file_type: "application/pdf",
        file_size_bytes: 120000,
        storage_status: "stored_private",
        created_at: "2026-06-04T00:12:00.000Z"
      }
    ],
    status_history: [
      {
        from_status: "New",
        to_status: "Needs review",
        changed_by: "synthetic-admin",
        changed_at: "2026-06-04T00:16:00.000Z"
      }
    ]
  },
  floorplan: {
    ok: true,
    lead: {
      id: "88888888-8888-4888-8888-888888888888",
      primary_source: "floorplan",
      source_detail: "floorplan_handoff",
      status: "Needs review",
      priority: "normal",
      customer: {
        name: "Synthetic Floorplan Lead",
        email: "synthetic.floorplan@example.invalid",
        phone: "0400000002"
      },
      project: {
        suburb: "Liverpool",
        postcode: "2170",
        product_category: "hybrid",
        area_m2: 62
      },
      quote: {
        estimate_total_inc_gst: null,
        confidence_level: "low",
        missing_info_flags: ["floorplan_scale_review", "product_confirmation"],
        risk_flags: ["measurement_confidence"]
      },
      statuses: {
        quote_review_status: "none",
        floorplan_status: "needs_review",
        contact_status: "none",
        follow_up_status: "queued"
      },
      next_action: "Review floorplan area before quoting"
    },
    events: [
      {
        event_type: "floorplan_handoff_saved",
        source: "floorplan",
        created_at: "2026-06-04T01:05:00.000Z",
        metadata: {
          area_method: "floorplan_review",
          file_uploaded: true,
          confidence_level: "low"
        }
      }
    ],
    notes: [],
    files: [
      {
        uploaded_file_id: "99999999-9999-4999-8999-999999999999",
        safe_filename: "synthetic-floorplan.pdf",
        file_role: "floorplan_upload",
        file_type: "application/pdf",
        file_size_bytes: 180000,
        storage_status: "stored_private",
        created_at: "2026-06-04T01:02:00.000Z"
      }
    ]
  }
};

const errorResponses = {
  unauthenticated: {
    ok: false,
    error: "Admin authentication required."
  },
  forbidden: {
    ok: false,
    error: "Admin access denied."
  },
  missingLead: {
    ok: false,
    error: "Lead not found."
  },
  invalidFilter: {
    ok: false,
    error: "Invalid dashboard filter."
  },
  unavailable: {
    ok: false,
    error: "Dashboard data is temporarily unavailable."
  }
};

const filterFixtures = {
  status: {
    query: { status: "Needs review" },
    expectedLeadIds: ["33333333-3333-4333-8333-333333333333"]
  },
  source: {
    query: { source: "quote" },
    expectedLeadIds: [
      "11111111-1111-4111-8111-111111111111",
      "22222222-2222-4222-8222-222222222222"
    ]
  },
  priority: {
    query: { priority: "high" },
    expectedLeadIds: ["33333333-3333-4333-8333-333333333333"]
  },
  productCategory: {
    query: { product_category: "laminate" },
    expectedLeadIds: ["22222222-2222-4222-8222-222222222222"]
  },
  suburb: {
    query: { suburb: "Bankstown" },
    expectedLeadIds: ["44444444-4444-4444-8444-444444444444"]
  },
  dateRange: {
    query: {
      created_from: "2026-06-04T00:20:00.000Z",
      created_to: "2026-06-04T00:40:00.000Z"
    },
    expectedLeadIds: [
      "22222222-2222-4222-8222-222222222222",
      "33333333-3333-4333-8333-333333333333",
      "44444444-4444-4444-8444-444444444444"
    ]
  },
  pagination: {
    query: {
      limit: 2,
      cursor: "synthetic-cursor-1"
    },
    expectedLimitCap: 100,
    expectedNextCursor: "synthetic-cursor-2"
  },
  empty: {
    query: { source: "upload" },
    expectedLeadIds: []
  }
};

module.exports = {
  listResponse,
  detailResponses,
  errorResponses,
  filterFixtures
};
