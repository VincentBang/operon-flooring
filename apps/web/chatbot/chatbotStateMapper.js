(function () {
  const VERSION = "1.0.0";

  function toNumber(value) {
    if (value === null || value === "" || typeof value === "undefined") {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  function normaliseText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function createDraft() {
    return {
      version: VERSION,
      intent: "",
      category: "",
      recommended_category: "",
      selection_mode: "recommend",
      reason: "",
      area: null,
      area_m2: null,
      measurement_method: "",
      existing_floor: "",
      removal_disposal: "",
      subfloor_condition: "",
      floor_prep_type: "",
      stairs: null,
      access: "",
      furniture: "",
      property_type: "",
      level: "",
      has_lift: "",
      parking_access: "",
      quote_mode: "supply_install",
      readiness: "",
      ready_for_quote: false,
      next_step: "quote.html",
      included_items: [],
      missing_items_to_check: [],
      scenario_id: "",
      scenario_step: 0,
      scenario_flags: [],
      notes: [],
      confidence_flags: [],
      validation_flags: [],
      missing_items: []
    };
  }

  function sanitiseDraft(input) {
    const base = createDraft();
    const notes = Array.isArray(input && input.notes) ? input.notes : [];
    const includedItems = Array.isArray(input && input.included_items) ? input.included_items : [];
    const missingItemsToCheck = Array.isArray(input && input.missing_items_to_check) ? input.missing_items_to_check : [];
    const scenarioFlags = Array.isArray(input && input.scenario_flags) ? input.scenario_flags : [];
    const confidenceFlags = Array.isArray(input && input.confidence_flags) ? input.confidence_flags : [];
    const validationFlags = Array.isArray(input && input.validation_flags) ? input.validation_flags : [];
    const missingItems = Array.isArray(input && input.missing_items) ? input.missing_items : [];

    return {
      version: VERSION,
      intent: normaliseIntent(input && input.intent),
      category: normaliseCategory(input && input.category),
      recommended_category: normaliseCategory(input && input.recommended_category),
      selection_mode: normaliseSelectionMode(input && input.selection_mode) || base.selection_mode,
      reason: normaliseText(input && input.reason),
      area: toNumber(input && input.area),
      area_m2: toNumber(typeof input !== "undefined" && input ? (input.area_m2 != null ? input.area_m2 : input.area) : null),
      measurement_method: normaliseMeasurementMethod(input && input.measurement_method),
      existing_floor: normaliseExistingFloor(input && input.existing_floor),
      removal_disposal: normaliseRemovalDisposal(input && input.removal_disposal),
      subfloor_condition: normaliseSubfloorCondition(input && input.subfloor_condition),
      floor_prep_type: normaliseFloorPrepType(input && input.floor_prep_type),
      stairs: normaliseStairs(input && input.stairs),
      access: normaliseAccess(input && input.access),
      furniture: normaliseFurniture(input && input.furniture),
      property_type: normalisePropertyType(input && input.property_type),
      level: normaliseLevel(input && input.level),
      has_lift: normaliseLift(input && input.has_lift),
      parking_access: normaliseParking(input && input.parking_access),
      quote_mode: normaliseQuoteMode(input && input.quote_mode) || base.quote_mode,
      readiness: normaliseReadiness(input && input.readiness),
      ready_for_quote: !!(input && input.ready_for_quote),
      next_step: normaliseNextStep(input && input.next_step) || base.next_step,
      included_items: includedItems.map(normaliseText).filter(Boolean),
      missing_items_to_check: missingItemsToCheck.map(normaliseText).filter(Boolean),
      scenario_id: normaliseScenarioId(input && input.scenario_id),
      scenario_step: normaliseScenarioStep(input && input.scenario_step),
      scenario_flags: scenarioFlags.map(normaliseText).filter(Boolean),
      notes: notes.map(normaliseText).filter(Boolean),
      confidence_flags: confidenceFlags.map(normaliseText).filter(Boolean),
      validation_flags: validationFlags.map(normaliseText).filter(Boolean),
      missing_items: missingItems.map(normaliseText).filter(Boolean)
    };
  }

  function normaliseCategory(value) {
    const allowed = ["laminate", "hybrid", "engineered"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseIntent(value) {
    const allowed = [
      "product_guidance",
      "quote_explanation",
      "missing_info_collection",
      "quote_review",
      "scope_validation",
      "route_next_step",
      "install_only",
      "unsupported"
    ];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseSelectionMode(value) {
    const allowed = ["recommend", "choose_range", "decide_later"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseExistingFloor(value) {
    const allowed = ["none", "carpet", "floating", "glue_down", "tile", "vinyl", "unsure", "other"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseRemovalDisposal(value) {
    const allowed = ["yes", "no", "unsure"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseSubfloorCondition(value) {
    const allowed = ["good", "minor_prep", "heavy_prep", "unsure"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseFloorPrepType(value) {
    const allowed = ["none", "basic", "levelling", "manual", "unsure"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseStairs(value) {
    if (value === 0 || value === "0" || value === false || value === "no") {
      return 0;
    }
    if (value === 1 || value === "1" || value === true || value === "yes") {
      return 1;
    }
    return null;
  }

  function normaliseAccess(value) {
    const allowed = ["easy", "limited", "apartment", "unsure"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseFurniture(value) {
    const allowed = ["none", "some", "unsure"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normalisePropertyType(value) {
    const allowed = ["house", "townhouse", "unit_apartment", "commercial_other"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseLevel(value) {
    const allowed = ["ground", "level_1", "level_2_plus", "other_unsure"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseLift(value) {
    const allowed = ["yes", "no", "na"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseParking(value) {
    const allowed = ["easy", "limited", "unsure"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseQuoteMode(value) {
    const allowed = ["supply_install", "install_only"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseMeasurementMethod(value) {
    const allowed = ["manual_total", "room_by_room", "floorplan_upload"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseReadiness(value) {
    const allowed = ["browsing", "unsure", "ready", "review"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseNextStep(value) {
    const allowed = ["quote.html", "products.html", "quote-review.html"];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseScenarioId(value) {
    const allowed = [
      "apartment_renovation",
      "replacing_carpet",
      "install_only",
      "unknown_area",
      "water_resistance_needed",
      "premium_finish",
      "ready_to_submit_check"
    ];
    return allowed.indexOf(value) >= 0 ? value : "";
  }

  function normaliseScenarioStep(value) {
    const parsed = Number(value || 0);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : 0;
  }

  function buildMissingItems(draft) {
    const missing = [];

    if (!draft.category) {
      missing.push("category");
    }
    if (draft.area === null) {
      missing.push("area");
    }
    if (!draft.existing_floor) {
      missing.push("existing_floor");
    }
    if (draft.existing_floor && draft.existing_floor !== "none" && !draft.removal_disposal) {
      missing.push("removal_disposal");
    }
    if (!draft.subfloor_condition) {
      missing.push("subfloor_condition");
    }
    if (draft.stairs === null) {
      missing.push("stairs");
    }
    if (!draft.access) {
      missing.push("access");
    }
    if (!draft.furniture) {
      missing.push("furniture");
    }

    return missing;
  }

  function buildMissingItemsToCheck(draft) {
    const items = [];

    if (!draft.existing_floor) {
      items.push("existing floor");
    }
    if (draft.existing_floor && draft.existing_floor !== "none" && !draft.removal_disposal) {
      items.push("disposal");
    }
    if (!draft.subfloor_condition || draft.subfloor_condition === "unsure" || draft.subfloor_condition === "heavy_prep") {
      items.push("floor preparation");
    }
    if (!draft.access || draft.access === "limited" || draft.access === "unsure" || draft.access === "apartment") {
      items.push("access");
    }
    if (draft.stairs === null || draft.stairs === 1) {
      items.push("stairs");
    }
    if (!draft.furniture || draft.furniture === "unsure") {
      items.push("furniture");
    }

    return Array.from(new Set(items));
  }

  function buildIncludedItems(draft) {
    const items = [];

    if (draft.quote_mode === "supply_install") {
      items.push("supply", "installation");
    } else if (draft.quote_mode === "install_only") {
      items.push("installation");
    }
    if (draft.existing_floor && draft.existing_floor !== "none") {
      items.push("removal to review");
    }
    if (draft.furniture === "some") {
      items.push("furniture handling to review");
    }

    return Array.from(new Set(items));
  }

  function buildConfidenceFlags(draft) {
    const flags = [];

    if (draft.category) {
      flags.push("category_selected");
    }
    if (draft.area !== null) {
      flags.push("area_captured");
    }
    if (draft.access === "apartment") {
      flags.push("apartment_context");
    }
    if (draft.quote_mode === "install_only") {
      flags.push("install_only_path");
    }
    if (draft.scenario_id) {
      flags.push("scenario_" + draft.scenario_id);
    }
    if (draft.readiness === "ready") {
      flags.push("ready_to_quote");
    }

    return flags;
  }

  function buildValidationFlags(draft) {
    const flags = [];

    if (draft.readiness === "ready" && draft.area === null) {
      flags.push("area_missing_for_ready_state");
    }
    if (draft.existing_floor && draft.existing_floor !== "none" && !draft.removal_disposal) {
      flags.push("removal_disposal_not_confirmed");
    }
    if (draft.access === "apartment" && !draft.has_lift) {
      flags.push("apartment_lift_not_confirmed");
    }
    if (draft.stairs === 1) {
      flags.push("stairs_require_manual_review");
    }
    if (draft.subfloor_condition === "heavy_prep" || draft.subfloor_condition === "unsure") {
      flags.push("subfloor_review_recommended");
    }
    if (draft.access === "limited" || draft.access === "unsure") {
      flags.push("access_review_recommended");
    }
    (draft.scenario_flags || []).forEach(function (flag) {
      if (flags.indexOf(flag) === -1) {
        flags.push(flag);
      }
    });

    return flags;
  }

  function toStructuredOutput(input) {
    const draft = sanitiseDraft(input);
    draft.missing_items = buildMissingItems(draft);
    draft.confidence_flags = buildConfidenceFlags(draft);
    draft.validation_flags = buildValidationFlags(draft);
    draft.floor_prep_type = draft.floor_prep_type || mapSubfloorToPrepType(draft.subfloor_condition);
    draft.area_m2 = draft.area;
    draft.recommended_category = draft.recommended_category || draft.category;
    draft.included_items = draft.included_items.length ? draft.included_items : buildIncludedItems(draft);
    draft.missing_items_to_check = draft.missing_items_to_check.length ? draft.missing_items_to_check : buildMissingItemsToCheck(draft);
    draft.ready_for_quote = draft.readiness === "ready" && draft.missing_items.length === 0;
    return draft;
  }

  function toQuoteFieldDraft(input) {
    const draft = toStructuredOutput(input);

    return {
      quoteMode: draft.quote_mode || "supply_install",
      selectedProductCategory: draft.category || "",
      productChoiceMode: draft.selection_mode || "recommend",
      totalAreaM2: draft.area === null ? "" : String(draft.area),
      measurementMethod: draft.measurement_method || "",
      removalType: mapExistingFloorToRemovalType(draft.existing_floor),
      removalDisposal: draft.removal_disposal || "",
      floorPrepType: draft.floor_prep_type || mapSubfloorToPrepType(draft.subfloor_condition),
      stairs: draft.stairs === 1 ? "yes" : draft.stairs === 0 ? "no" : "",
      furnitureType: mapFurnitureToQuoteField(draft.furniture),
      parkingAccess: draft.parking_access || mapAccessToParking(draft.access),
      propertyType: draft.property_type || mapAccessToPropertyType(draft.access),
      level: draft.level || "",
      hasLift: draft.has_lift || ""
    };
  }

  function toLocalStorageDraft(input) {
    const draft = toStructuredOutput(input);

    return {
      operon_chatbot_draft: JSON.stringify(draft),
      operon_chatbot_quote_field_draft: JSON.stringify(toQuoteFieldDraft(draft))
    };
  }

  function toHandoffReadiness(input) {
    const draft = toStructuredOutput(input);
    const quoteFieldDraft = toQuoteFieldDraft(draft);
    const requiredMissing = getHandoffMissingFields(draft);
    const reviewFlags = getReviewBlockingFlags(draft.validation_flags);
    const blockedByIntent = draft.intent === "unsupported" || draft.intent === "product_guidance";
    const blockedByRoute = draft.next_step === "products.html";
    let status = "blocked";
    let reason = "";

    if (blockedByIntent) {
      reason = "intent is advisory or unsupported";
    } else if (blockedByRoute) {
      reason = "suggested route is not quote handoff";
    } else if (requiredMissing.length) {
      reason = "required handoff fields missing";
    } else if (reviewFlags.length || draft.next_step === "quote-review.html" || draft.readiness === "review") {
      status = "needs_review";
      reason = "validation flags require quote review";
    } else {
      status = "ready";
      reason = "basic quote draft fields are available";
    }

    return {
      status: status,
      safe_to_apply: false,
      reason: reason,
      next_step: draft.next_step,
      required_missing: requiredMissing,
      review_flags: reviewFlags,
      allowed_quote_fields: getAllowedQuoteFieldNames(quoteFieldDraft),
      blocked_fields: getBlockedHandoffFields()
    };
  }

  function getHandoffMissingFields(draft) {
    const required = [
      "category",
      "area",
      "measurement_method",
      "existing_floor",
      "subfloor_condition",
      "stairs",
      "access",
      "furniture",
      "quote_mode"
    ];

    return required.filter(function (fieldName) {
      if (fieldName === "stairs") {
        return draft.stairs === null;
      }
      if (fieldName === "area") {
        return draft.area === null;
      }
      return !draft[fieldName];
    });
  }

  function getReviewBlockingFlags(flags) {
    const reviewRequired = [
      "stairs_require_manual_review",
      "subfloor_review_recommended",
      "access_review_recommended",
      "apartment_lift_not_confirmed",
      "removal_disposal_not_confirmed",
      "area_missing_for_ready_state"
    ];

    return (Array.isArray(flags) ? flags : []).filter(function (flag) {
      return reviewRequired.indexOf(flag) >= 0;
    });
  }

  function getAllowedQuoteFieldNames(quoteFieldDraft) {
    return Object.keys(quoteFieldDraft).filter(function (key) {
      return [
        "quoteMode",
        "selectedProductCategory",
        "productChoiceMode",
        "totalAreaM2",
        "measurementMethod",
        "removalType",
        "removalDisposal",
        "floorPrepType",
        "stairs",
        "furnitureType",
        "parkingAccess",
        "propertyType",
        "level",
        "hasLift"
      ].indexOf(key) >= 0;
    });
  }

  function getBlockedHandoffFields() {
    return [
      "prices",
      "totals",
      "discounts",
      "internal rates",
      "margins",
      "quote submission fields",
      "customer contact fields",
      "Supabase fields",
      "lead form status",
      "selected product IDs"
    ];
  }

  function mapExistingFloorToRemovalType(value) {
    const map = {
      none: "none",
      carpet: "carpet",
      floating: "floating",
      glue_down: "glue_down",
      tile: "tile",
      vinyl: "vinyl",
      unsure: "unsure",
      other: "other"
    };

    return map[value] || "";
  }

  function mapSubfloorToPrepType(value) {
    const map = {
      good: "none",
      minor_prep: "levelling",
      heavy_prep: "manual",
      unsure: "unsure"
    };

    return map[value] || "";
  }

  function mapFurnitureToQuoteField(value) {
    const map = {
      none: "no",
      some: "yes",
      unsure: ""
    };

    return map[value] || "";
  }

  function mapAccessToParking(value) {
    const map = {
      easy: "easy",
      limited: "limited",
      apartment: "limited",
      unsure: "unsure"
    };

    return map[value] || "";
  }

  function mapAccessToPropertyType(value) {
    if (value === "apartment") {
      return "unit_apartment";
    }

    return "";
  }

  window.OperonChatbotStateMapper = {
    createDraft: createDraft,
    sanitiseDraft: sanitiseDraft,
    toStructuredOutput: toStructuredOutput,
    toQuoteFieldDraft: toQuoteFieldDraft,
    toLocalStorageDraft: toLocalStorageDraft,
    toHandoffReadiness: toHandoffReadiness
  };
}());
