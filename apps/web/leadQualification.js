(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.OperonLeadQualification = factory();
  }
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const STATUSES = Object.freeze({
    NEW: "New",
    NEEDS_MISSING_INFO: "Needs missing info",
    REMOTE_ESTIMATE_SENT: "Remote estimate sent",
    SITE_CONFIRMATION_ELIGIBLE: "Site confirmation eligible",
    SITE_CONFIRMATION_BOOKED: "Site confirmation booked",
    MANUAL_REVIEW_REQUIRED: "Manual review required",
    QUOTED: "Quoted",
    WON: "Won",
    LOST: "Lost",
    LOW_PRIORITY: "Low priority"
  });

  const PRIORITIES = Object.freeze({
    A: "A",
    B: "B",
    C: "C",
    D: "D"
  });

  const NEXT_ACTIONS = Object.freeze({
    REQUEST_FLOOR_PLAN: "request floor plan",
    REQUEST_PHOTOS: "request photos",
    CALL_CUSTOMER: "call customer",
    SEND_ESTIMATE_EXPLANATION: "send estimate explanation",
    BOOK_SITE_CONFIRMATION: "book site confirmation",
    FOUNDER_REVIEW: "founder review",
    MARK_LOW_PRIORITY: "mark low priority",
    REQUEST_MISSING_INFO: "request missing information"
  });

  const ANALYTICS_EVENTS = Object.freeze({
    A: "lead_qualified_A",
    B: "lead_qualified_B",
    C: "lead_qualified_C",
    D: "lead_manual_review_required",
    SITE_CONFIRMATION_BOOKED: "site_confirmation_booked",
    MISSING_INFO_REQUESTED: "missing_info_requested",
    LOW_PRIORITY: "lead_marked_low_priority"
  });

  const FOLLOW_UP_TEMPLATES = Object.freeze({
    missing_area_floorplan: {
      title: "Missing area/floorplan",
      subject: "Flooring quote - area confirmation",
      body: "Hi {first_name}, thanks for sending through the flooring details. To make the estimate useful, could you send either the approximate room sizes or a floor plan? Once we have the area, we can review the product and scope properly before any site confirmation is discussed."
    },
    product_not_selected: {
      title: "Product not selected",
      subject: "Flooring quote - product direction",
      body: "Hi {first_name}, thanks for the quote request. Before we firm up the estimate, could you let us know whether you are leaning toward hybrid, laminate or engineered timber? If you are unsure, we can start with a practical product direction and review options from there."
    },
    removal_scope_unclear: {
      title: "Removal/scope unclear",
      subject: "Flooring quote - scope check",
      body: "Hi {first_name}, thanks for the details. A few scope items still need confirming, especially removal, disposal, trims or floor preparation. Could you send a quick note or photos of the existing floor so we can review the estimate more accurately?"
    },
    stairs_access_review: {
      title: "Stairs/access needs review",
      subject: "Flooring quote - stairs or access review",
      body: "Hi {first_name}, thanks for the quote request. Because the job includes stairs, apartment access or another site condition that can change the scope, we will review this manually before confirming the next step."
    },
    site_confirmation_eligibility: {
      title: "Site confirmation eligibility",
      subject: "Flooring quote - site confirmation next step",
      body: "Hi {first_name}, thanks for the clear quote details. The request has enough information for us to review site confirmation eligibility. We will check product direction, area, scope and timing before booking anything in."
    },
    low_priority_polite: {
      title: "Low-priority polite response",
      subject: "Flooring quote - next step",
      body: "Hi {first_name}, thanks for reaching out. Based on the current details, this may not be ready for a site confirmation yet. If you can send product direction, approximate area and timing, we can reassess the request."
    }
  });

  const DEFAULT_OPTIONS = Object.freeze({
    minimumJobAreaM2: 25
  });

  function normaliseText(value) {
    return String(value == null ? "" : value).trim();
  }

  function lower(value) {
    return normaliseText(value).toLowerCase();
  }

  function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function boolValue(value) {
    return value === true || value === "true" || value === "yes" || value === "1";
  }

  function hasValue(value) {
    return normaliseText(value) !== "";
  }

  function getNested(source, path, fallback) {
    return path.reduce(function (value, key) {
      return value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, key)
        ? value[key]
        : undefined;
    }, source) ?? fallback;
  }

  function inferTimeframe(lead) {
    const raw = lower(lead.timeframe || lead.timeline || lead.leadStage || lead.lead_stage);
    if (["hot", "ready soon", "soon", "urgent"].indexOf(raw) >= 0) return "ready soon";
    if (["warm", "comparing", "this month", "1-3 months"].indexOf(raw) >= 0) return "realistic";
    if (["cold", "planning", "later", "not sure"].indexOf(raw) >= 0) return "planning";
    return "";
  }

  function inferFloorplanStatus(lead) {
    const method = lower(lead.measurementMethod || lead.measurement_method || lead.areaMethod || lead.area_method);
    const status = lower(lead.measurementStatus || lead.measurement_status);
    const floorplanSource = normaliseText(lead.floorplanSource || lead.floorplan_source || lead.floorplanMeasurementMode);
    const hasFloorplan = boolValue(lead.hasFloorplan || lead.has_floorplan)
      || method.indexOf("floorplan") >= 0
      || hasValue(floorplanSource)
      || numberValue(lead.floorplanAreaFound || lead.floorplan_area_found) > 0;
    if (hasFloorplan) return "attached";
    if (status === "unknown" || method.indexOf("unknown") >= 0) return "missing";
    return status || method || "";
  }

  function inferReviewAttached(lead) {
    const review = lead.quoteReview || lead.quote_review || lead.quoteReviewPayload || lead.quote_review_payload_json;
    if (!review) return false;
    if (typeof review === "string") return review.trim() !== "" && review.trim() !== "{}";
    if (typeof review === "object") return Object.keys(review).length > 0;
    return false;
  }

  function getRiskFlags(fields, lead) {
    const flags = [];
    const notes = lower(lead.notes || lead.customerNotes || lead.siteNotes || "");
    const scopeSignals = lead.scopeSignals || lead.scope_signals || {};
    const missingScope = Array.isArray(scopeSignals.missingOrUnclearScope)
      ? scopeSignals.missingOrUnclearScope
      : Array.isArray(scopeSignals.missing_or_unclear_scope)
        ? scopeSignals.missing_or_unclear_scope
        : [];

    if (fields.stairsStatus === "yes" || fields.stairsStatus === "not_sure" || /stair/.test(notes)) {
      flags.push("stairs");
    }
    if (fields.apartmentAccessRisk === "risk" || /apartment|strata|lift|parking|access/.test(notes)) {
      flags.push("apartment/access");
    }
    if (fields.floorPrepRisk === "risk" || /prep|level|subfloor|moisture|uneven|concrete/.test(notes)) {
      flags.push("floor prep");
    }
    if (boolValue(lead.reviewRequired || lead.review_required || lead.manualReviewRequired || lead.manual_review_required)) {
      flags.push("review required");
    }
    missingScope.forEach(function (item) {
      const text = lower(item);
      if (/stair|access|prep|moisture|subfloor|removal|disposal/.test(text)) {
        flags.push(normaliseText(item));
      }
    });

    return Array.from(new Set(flags));
  }

  function getMissingFields(fields) {
    const missing = [];
    if (!fields.suburbPostcode) missing.push("suburb/postcode");
    if (!fields.quoteMode) missing.push("quote mode");
    if (!fields.productCategory || fields.productCategory === "not_sure") missing.push("product category");
    if (!fields.areaStatus) missing.push("area or floorplan");
    if (!fields.removalStatus) missing.push("removal status");
    if (!fields.stairsStatus) missing.push("stairs status");
    if (!fields.timeframe) missing.push("timeframe");
    if (!fields.customerAcceptedRange) missing.push("estimate range acceptance");
    return missing;
  }

  function normaliseLead(rawLead) {
    const lead = rawLead && typeof rawLead === "object" ? rawLead : {};
    const realArea = numberValue(lead.realArea || lead.real_area || getNested(lead, ["measurement", "realArea"], 0));
    const quoteTotal = numberValue(lead.quoteTotal || lead.quote_total || getNested(lead, ["pricing", "totalIncGst"], 0));
    const quoteRangeLow = numberValue(lead.quoteRangeLow || lead.quote_range_low);
    const quoteRangeHigh = numberValue(lead.quoteRangeHigh || lead.quote_range_high);
    const productCategory = lower(lead.category || lead.productCategory || lead.product_category || getNested(lead, ["job", "productCategory"], ""));
    const measurementStatus = lower(lead.measurementStatus || lead.measurement_status || getNested(lead, ["measurement", "status"], ""));
    const nextStepRequired = lower(lead.nextStepRequired || lead.next_step_required || getNested(lead, ["measurement", "nextStepRequired"], ""));
    const propertyType = lower(lead.propertyType || lead.property_type || getNested(lead, ["property", "type"], ""));
    const level = lower(lead.level || lead.propertyLevel || lead.property_level || getNested(lead, ["property", "level"], ""));
    const hasLift = lower(lead.hasLift || lead.has_lift || getNested(lead, ["property", "hasLift"], ""));
    const parking = lower(lead.parkingAccess || lead.parking_access || getNested(lead, ["property", "parking"], ""));
    const removal = lower(lead.removalStatus || lead.removal_status || lead.existingFloorToRemove || getNested(lead, ["job", "existingFloorToRemove"], ""));
    const stairs = lower(lead.stairsStatus || lead.stairs_status || getNested(lead, ["job", "stairsIncluded"], "") || getNested(lead, ["extras", "stairs", "selected"], ""));
    const floorPrep = lower(lead.floorPrepRisk || lead.floor_prep_risk || getNested(lead, ["job", "subfloorCondition"], "") || getNested(lead, ["extras", "scopeChecks", "subfloorCondition"], ""));

    const acceptsMeasurementReview = ["site_assessment", "floorplan_lookup", "measure_manually", "measurement_review"].indexOf(nextStepRequired) >= 0
      || hasValue(lead.floorplanLookupAddress || lead.floorplan_lookup_address);

    const fields = {
      suburbPostcode: [lead.suburb, lead.postcode, getNested(lead, ["customer", "suburb"], ""), getNested(lead, ["customer", "postcode"], "")]
        .some(hasValue),
      quoteMode: normaliseText(lead.quoteMode || lead.quote_mode || getNested(lead, ["job", "quoteMode"], "")),
      productCategory: productCategory,
      areaStatus: realArea > 0 || acceptsMeasurementReview ? "available" : "",
      floorplanStatus: inferFloorplanStatus(lead),
      removalStatus: removal,
      stairsStatus: stairs === "true" ? "yes" : stairs === "false" ? "no" : stairs,
      apartmentAccessRisk: propertyType === "apartment" || /apartment|unit|strata/.test(propertyType) || ["yes", "no", "not_sure"].indexOf(hasLift) >= 0 || parking === "limited" ? "risk" : "",
      floorPrepRisk: /uneven|moisture|needs|not_sure|review|unknown/.test(floorPrep) ? "risk" : "",
      timeframe: inferTimeframe(lead),
      estimatedJobSize: realArea > 0 ? realArea : 0,
      confidenceLevel: normaliseText(lead.quoteConfidence || lead.quote_confidence || lead.confidenceLevel || lead.confidence_level || getNested(lead, ["measurement", "quoteConfidence"], "")),
      reviewRequired: boolValue(lead.reviewRequired || lead.review_required || lead.manualReviewRequired || lead.manual_review_required),
      customerAcceptedRange: boolValue(lead.customerAcceptedRange || lead.customer_accepted_range)
        || quoteTotal > 0
        || quoteRangeLow > 0
        || quoteRangeHigh > 0
        || boolValue(lead.estimateReady || lead.estimate_ready),
      leadSource: normaliseText(lead.leadSource || lead.lead_source || lead.source || lead.sourcePage || lead.source_page || "website"),
      quoteReviewAttached: inferReviewAttached(lead),
      contactName: normaliseText(lead.name || lead.customerName || getNested(lead, ["customer", "name"], "")),
      contactPhone: normaliseText(lead.phone || getNested(lead, ["customer", "phone"], "")),
      contactEmail: normaliseText(lead.email || getNested(lead, ["customer", "email"], "")),
      quoteSummary: normaliseText(lead.selectedProduct || lead.productName || getNested(lead, ["job", "productName"], "")) || productCategory || "No product direction",
      nextStepRequired: nextStepRequired,
      measurementStatus: measurementStatus
    };

    return { lead: lead, fields: fields };
  }

  function chooseTemplate(status, nextAction, riskFlags, missingFields) {
    if (status === STATUSES.LOW_PRIORITY) return "low_priority_polite";
    if (riskFlags.some(function (flag) { return /stair|access/.test(lower(flag)); })) return "stairs_access_review";
    if (riskFlags.length || missingFields.some(function (field) { return /removal|scope/.test(field); })) return "removal_scope_unclear";
    if (missingFields.indexOf("area or floorplan") >= 0) return "missing_area_floorplan";
    if (missingFields.indexOf("product category") >= 0) return "product_not_selected";
    if (nextAction === NEXT_ACTIONS.BOOK_SITE_CONFIRMATION) return "site_confirmation_eligibility";
    return "removal_scope_unclear";
  }

  function qualifyLead(rawLead, options) {
    const settings = Object.assign({}, DEFAULT_OPTIONS, options || {});
    const normalised = normaliseLead(rawLead);
    const lead = normalised.lead;
    const fields = normalised.fields;
    const missingFields = getMissingFields(fields);
    const riskFlags = getRiskFlags(fields, lead);
    const notes = lower(lead.notes || lead.customerNotes || lead.siteNotes || "");
    const asksOnlyForLook = /come (and )?(have a )?look|site visit|visit.*quote|measure.*onsite/.test(notes)
      && missingFields.length >= 2;
    const belowMinimum = fields.estimatedJobSize > 0
      && fields.estimatedJobSize < settings.minimumJobAreaM2
      && !boolValue(lead.founderApproved || lead.founder_approved);
    const majorRisk = riskFlags.length > 0;

    let status = STATUSES.NEW;
    let priority = PRIORITIES.B;
    let nextAction = NEXT_ACTIONS.SEND_ESTIMATE_EXPLANATION;

    if (belowMinimum) {
      status = STATUSES.LOW_PRIORITY;
      priority = PRIORITIES.C;
      nextAction = NEXT_ACTIONS.MARK_LOW_PRIORITY;
    } else if (majorRisk) {
      status = STATUSES.MANUAL_REVIEW_REQUIRED;
      priority = PRIORITIES.D;
      nextAction = NEXT_ACTIONS.FOUNDER_REVIEW;
    } else if (missingFields.length || asksOnlyForLook) {
      status = STATUSES.NEEDS_MISSING_INFO;
      priority = PRIORITIES.B;
      nextAction = missingFields.indexOf("area or floorplan") >= 0
        ? NEXT_ACTIONS.REQUEST_FLOOR_PLAN
        : missingFields.indexOf("product category") >= 0
          ? NEXT_ACTIONS.REQUEST_MISSING_INFO
          : NEXT_ACTIONS.CALL_CUSTOMER;
    } else {
      const siteEligible = fields.suburbPostcode
        && fields.productCategory
        && fields.productCategory !== "not_sure"
        && fields.areaStatus
        && ["ready soon", "realistic"].indexOf(fields.timeframe) >= 0
        && fields.customerAcceptedRange;

      if (siteEligible) {
        status = STATUSES.SITE_CONFIRMATION_ELIGIBLE;
        priority = PRIORITIES.A;
        nextAction = NEXT_ACTIONS.BOOK_SITE_CONFIRMATION;
      } else {
        status = STATUSES.REMOTE_ESTIMATE_SENT;
        priority = PRIORITIES.B;
        nextAction = NEXT_ACTIONS.SEND_ESTIMATE_EXPLANATION;
      }
    }

    const templateKey = chooseTemplate(status, nextAction, riskFlags, missingFields);

    return {
      status: status,
      priority: priority,
      qualificationFields: fields,
      missingFields: asksOnlyForLook
        ? Array.from(new Set(missingFields.concat(["site visit request without enough details"])))
        : missingFields,
      riskFlags: riskFlags,
      nextAction: nextAction,
      followUpTemplateKey: templateKey,
      followUpTemplate: FOLLOW_UP_TEMPLATES[templateKey],
      analyticsEvent: priority === PRIORITIES.D ? ANALYTICS_EVENTS.D : ANALYTICS_EVENTS[priority],
      evaluatedAt: new Date().toISOString()
    };
  }

  function buildDashboardLead(rawLead, options) {
    const qualification = rawLead && rawLead.qualification
      ? rawLead.qualification
      : qualifyLead(rawLead, options);
    const fields = qualification.qualificationFields || {};
    return {
      id: rawLead && (rawLead.id || rawLead.quoteId || rawLead.quote_id || rawLead.createdAt) || "lead-" + Date.now(),
      createdAt: rawLead && (rawLead.createdAt || rawLead.created_at || rawLead.submittedAt || rawLead.submitted_at) || qualification.evaluatedAt,
      status: rawLead && rawLead.operonLeadStatus || qualification.status,
      priority: rawLead && rawLead.operonLeadPriority || qualification.priority,
      riskFlags: qualification.riskFlags || [],
      nextAction: rawLead && rawLead.operonNextAction || qualification.nextAction,
      contact: {
        name: fields.contactName || "",
        phone: fields.contactPhone || "",
        email: fields.contactEmail || ""
      },
      quoteSummary: fields.quoteSummary || "",
      floorplanAttached: fields.floorplanStatus === "attached",
      quoteReviewAttached: !!fields.quoteReviewAttached,
      qualification: qualification,
      rawLead: rawLead || {}
    };
  }

  function trackQualification(qualification, source) {
    if (!qualification || typeof window === "undefined" || typeof window.operonTrack !== "function") {
      return;
    }
    window.operonTrack(qualification.analyticsEvent, {
      source: source || "lead_qualification",
      confidence_level: qualification.qualificationFields && qualification.qualificationFields.confidenceLevel || "",
      review_required: qualification.priority === PRIORITIES.D,
      event_context: qualification.nextAction || ""
    });
  }

  return {
    STATUSES: STATUSES,
    PRIORITIES: PRIORITIES,
    NEXT_ACTIONS: NEXT_ACTIONS,
    ANALYTICS_EVENTS: ANALYTICS_EVENTS,
    FOLLOW_UP_TEMPLATES: FOLLOW_UP_TEMPLATES,
    qualifyLead: qualifyLead,
    buildDashboardLead: buildDashboardLead,
    trackQualification: trackQualification
  };
}));
