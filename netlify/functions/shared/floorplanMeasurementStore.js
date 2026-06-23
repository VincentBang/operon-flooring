"use strict";

const Geometry = require("./floorplanGeometry");
const { getSupabaseTables } = require("../_supabaseTables");

const TABLES = {
  sessions: "operon_floorplan_measurement_sessions",
  versions: "operon_floorplan_measurement_versions",
  sections: "operon_floorplan_measurement_sections",
  events: "operon_floorplan_measurement_review_events",
  links: "operon_floorplan_quote_links",
  uploadedFiles: getSupabaseTables().uploadedFiles
};

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

function buildRestUrl(path, query) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }
  const url = new URL(config.url + "/rest/v1/" + path);
  Object.keys(query || {}).forEach(function (key) {
    const value = query[key];
    if (value !== null && typeof value !== "undefined") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function supabaseRequest(path, options) {
  const config = getSupabaseConfig();
  const settings = Object.assign({
    method: "GET",
    query: null,
    body: undefined,
    headers: {}
  }, options || {});
  const headers = Object.assign({
    apikey: config.serviceRoleKey,
    Authorization: "Bearer " + config.serviceRoleKey,
    Accept: "application/json"
  }, settings.headers || {});
  if (typeof settings.body !== "undefined") {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(buildRestUrl(path, settings.query), {
    method: settings.method,
    headers: headers,
    body: typeof settings.body === "undefined" ? undefined : JSON.stringify(settings.body)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("Supabase floorplan request failed: " + text.slice(0, 400));
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function getFirstRow(rows) {
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function findSessionByIdempotency(idempotencyKeyHash) {
  if (!idempotencyKeyHash) return null;
  const rows = await supabaseRequest(TABLES.sessions, {
    query: {
      idempotency_key_hash: "eq." + idempotencyKeyHash,
      select: "id,current_customer_version_id,approved_version_id,status"
    }
  });
  return getFirstRow(rows);
}

async function getSession(sessionId) {
  if (!Geometry.isUuid(sessionId)) return null;
  const rows = await supabaseRequest(TABLES.sessions, {
    query: {
      id: "eq." + sessionId,
      select: "*"
    }
  });
  return getFirstRow(rows);
}

async function getVersion(versionId) {
  if (!Geometry.isUuid(versionId)) return null;
  const rows = await supabaseRequest(TABLES.versions, {
    query: {
      id: "eq." + versionId,
      select: "*"
    }
  });
  return getFirstRow(rows);
}

async function getLatestVersionNumber(sessionId) {
  const rows = await supabaseRequest(TABLES.versions, {
    query: {
      measurement_session_id: "eq." + sessionId,
      select: "version_number",
      order: "version_number.desc",
      limit: "1"
    }
  });
  const row = getFirstRow(rows);
  return Number(row && row.version_number) || 0;
}

async function insertSession(payload) {
  const rows = await supabaseRequest(TABLES.sessions, {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: {
      id: payload.measurement_session_id || undefined,
      lead_id: payload.lead_id,
      quote_request_id: payload.quote_request_id,
      uploaded_file_id: payload.uploaded_file_id,
      idempotency_key_hash: payload.idempotency_key_hash,
      source: payload.source,
      status: "customer_submitted",
      measurement_mode: payload.measurement_mode,
      selected_area_m2: payload.selected_area_m2,
      measured_area_m2: payload.measured_area_m2,
      adjusted_area_m2: payload.adjusted_area_m2,
      confidence_level: payload.confidence_level,
      review_required: payload.review_required,
      metadata: payload.metadata
    }
  });
  return getFirstRow(rows);
}

async function patchSession(sessionId, body) {
  const rows = await supabaseRequest(TABLES.sessions, {
    method: "PATCH",
    query: {
      id: "eq." + sessionId
    },
    headers: {
      Prefer: "return=representation"
    },
    body: body
  });
  return getFirstRow(rows);
}

async function insertVersion(payload, sessionId, versionNumber, versionStatus, parentVersionId) {
  const rows = await supabaseRequest(TABLES.versions, {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: {
      measurement_session_id: sessionId,
      parent_version_id: parentVersionId || null,
      version_number: versionNumber,
      version_source: payload.version_source,
      version_status: versionStatus,
      page_width: payload.page_width,
      page_height: payload.page_height,
      pixels_per_metre: payload.pixels_per_metre,
      selected_area_m2: payload.selected_area_m2,
      measured_area_m2: payload.measured_area_m2,
      adjusted_area_m2: payload.adjusted_area_m2,
      confidence_level: payload.confidence_level,
      review_required: payload.review_required,
      geometry_summary: {
        section_count: payload.sections.length,
        included_count: payload.sections.filter(function (section) { return section.selection_state === "include"; }).length,
        excluded_count: payload.sections.filter(function (section) { return section.selection_state === "exclude"; }).length
      },
      metadata: payload.metadata
    }
  });
  return getFirstRow(rows);
}

async function insertSections(versionId, sections) {
  if (!sections.length) return [];
  return supabaseRequest(TABLES.sections, {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: sections.map(function (section, index) {
      return {
        measurement_version_id: versionId,
        client_section_id: section.client_section_id,
        section_order: index + 1,
        label: section.label,
        section_type: section.section_type,
        selection_state: section.selection_state,
        geometry_json: section.geometry_json,
        area_m2: section.area_m2,
        confidence_level: section.confidence_level,
        reviewer_notes: section.reviewer_notes,
        metadata: section.metadata
      };
    })
  });
}

async function getSections(versionId) {
  if (!Geometry.isUuid(versionId)) return [];
  const rows = await supabaseRequest(TABLES.sections, {
    query: {
      measurement_version_id: "eq." + versionId,
      select: "*",
      order: "section_order.asc"
    }
  });
  return Array.isArray(rows) ? rows : [];
}

async function recordEvent(body) {
  const rows = await supabaseRequest(TABLES.events, {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: {
      measurement_session_id: body.measurement_session_id,
      measurement_version_id: body.measurement_version_id || null,
      event_type: body.event_type,
      actor_type: body.actor_type || "system",
      actor_label: Geometry.toSafeText(body.actor_label, 120) || null,
      metadata: body.metadata || {}
    }
  });
  return getFirstRow(rows);
}

async function createCustomerSubmission(payload) {
  const existingSession = await findSessionByIdempotency(payload.idempotency_key_hash);
  if (existingSession && existingSession.current_customer_version_id) {
    return {
      session: existingSession,
      version: { id: existingSession.current_customer_version_id },
      idempotent: true
    };
  }

  const session = existingSession || await insertSession(payload);
  const nextVersion = await getLatestVersionNumber(session.id) + 1;
  const version = await insertVersion(payload, session.id, nextVersion, "customer_submitted", null);
  await insertSections(version.id, payload.sections);
  await patchSession(session.id, {
    current_customer_version_id: version.id,
    status: "customer_submitted",
    selected_area_m2: payload.selected_area_m2,
    measured_area_m2: payload.measured_area_m2,
    adjusted_area_m2: payload.adjusted_area_m2,
    confidence_level: payload.confidence_level,
    review_required: payload.review_required,
    submitted_at: new Date().toISOString()
  });
  await recordEvent({
    measurement_session_id: session.id,
    measurement_version_id: version.id,
    event_type: "customer_submitted",
    actor_type: "customer",
    metadata: {
      selected_area_m2: payload.selected_area_m2,
      confidence_level: payload.confidence_level,
      review_required: payload.review_required
    }
  });
  return { session: session, version: version, idempotent: false };
}

async function listSessions(limit, status) {
  const query = {
    select: "id,created_at,updated_at,submitted_at,status,source,measurement_mode,selected_area_m2,measured_area_m2,adjusted_area_m2,confidence_level,review_required,lead_id,quote_request_id,uploaded_file_id,current_customer_version_id,current_review_version_id,approved_version_id",
    order: "updated_at.desc",
    limit: String(Math.max(1, Math.min(Number(limit) || 50, 100)))
  };
  if (status) query.status = "eq." + status;
  const rows = await supabaseRequest(TABLES.sessions, { query: query });
  return Array.isArray(rows) ? rows : [];
}

async function getSessionDetail(sessionId) {
  const session = await getSession(sessionId);
  if (!session) return null;
  const versions = await supabaseRequest(TABLES.versions, {
    query: {
      measurement_session_id: "eq." + sessionId,
      select: "*",
      order: "version_number.asc"
    }
  });
  const events = await supabaseRequest(TABLES.events, {
    query: {
      measurement_session_id: "eq." + sessionId,
      select: "*",
      order: "created_at.asc"
    }
  });
  const sectionGroups = {};
  for (const version of Array.isArray(versions) ? versions : []) {
    sectionGroups[version.id] = await getSections(version.id);
  }
  return {
    session: session,
    versions: (Array.isArray(versions) ? versions : []).map(function (version) {
      return Object.assign({}, version, {
        sections: sectionGroups[version.id] || []
      });
    }),
    events: Array.isArray(events) ? events : []
  };
}

async function createReviewDraft(sessionId, payload, parentVersionId, actorLabel) {
  const session = await getSession(sessionId);
  if (!session) throw new Error("Floorplan measurement session not found.");
  const nextVersion = await getLatestVersionNumber(sessionId) + 1;
  const version = await insertVersion(Object.assign({}, payload, { version_source: "reviewer" }), sessionId, nextVersion, "review_draft", parentVersionId || session.current_customer_version_id);
  await insertSections(version.id, payload.sections);
  await patchSession(sessionId, {
    current_review_version_id: version.id,
    status: "review_draft",
    selected_area_m2: payload.selected_area_m2,
    measured_area_m2: payload.measured_area_m2,
    adjusted_area_m2: payload.adjusted_area_m2,
    confidence_level: payload.confidence_level,
    review_required: true
  });
  await recordEvent({
    measurement_session_id: sessionId,
    measurement_version_id: version.id,
    event_type: "review_draft_saved",
    actor_type: "admin",
    actor_label: actorLabel,
    metadata: {
      selected_area_m2: payload.selected_area_m2,
      parent_version_id: parentVersionId || session.current_customer_version_id || null
    }
  });
  return version;
}

async function approveVersion(sessionId, versionId, actorLabel) {
  const session = await getSession(sessionId);
  const sourceVersion = await getVersion(versionId);
  if (!session || !sourceVersion || sourceVersion.measurement_session_id !== sessionId) {
    throw new Error("Floorplan measurement version not found.");
  }
  const sourceSections = await getSections(versionId);
  const payload = {
    version_source: "reviewer",
    page_width: sourceVersion.page_width,
    page_height: sourceVersion.page_height,
    pixels_per_metre: sourceVersion.pixels_per_metre,
    selected_area_m2: sourceVersion.selected_area_m2,
    measured_area_m2: sourceVersion.measured_area_m2,
    adjusted_area_m2: sourceVersion.adjusted_area_m2,
    confidence_level: sourceVersion.confidence_level,
    review_required: false,
    sections: sourceSections.map(function (section) {
      return {
        client_section_id: section.client_section_id,
        label: section.label,
        section_type: section.section_type,
        selection_state: section.selection_state,
        confidence_level: section.confidence_level,
        geometry_json: section.geometry_json,
        area_m2: section.area_m2,
        reviewer_notes: section.reviewer_notes,
        metadata: section.metadata || {}
      };
    }),
    metadata: Object.assign({}, sourceVersion.metadata || {}, {
      approved_from_version_id: versionId
    })
  };
  const nextVersion = await getLatestVersionNumber(sessionId) + 1;
  const approvedVersion = await insertVersion(payload, sessionId, nextVersion, "approved", versionId);
  await insertSections(approvedVersion.id, payload.sections);
  await patchSession(sessionId, {
    approved_version_id: approvedVersion.id,
    status: "approved",
    selected_area_m2: approvedVersion.selected_area_m2,
    measured_area_m2: approvedVersion.measured_area_m2,
    adjusted_area_m2: approvedVersion.adjusted_area_m2,
    confidence_level: approvedVersion.confidence_level,
    review_required: false,
    approved_at: new Date().toISOString()
  });
  await recordEvent({
    measurement_session_id: sessionId,
    measurement_version_id: approvedVersion.id,
    event_type: "approved",
    actor_type: "admin",
    actor_label: actorLabel,
    metadata: {
      approved_from_version_id: versionId,
      selected_area_m2: approvedVersion.selected_area_m2
    }
  });
  return approvedVersion;
}

async function linkApprovedMeasurement(sessionId, quoteRequestId, actorLabel) {
  const session = await getSession(sessionId);
  if (!session || !session.approved_version_id) {
    throw new Error("Approved floorplan measurement is required before quote linkage.");
  }
  const approved = await getVersion(session.approved_version_id);
  const rows = await supabaseRequest(TABLES.links, {
    method: "POST",
    headers: {
      Prefer: "return=representation"
    },
    body: {
      measurement_session_id: sessionId,
      approved_version_id: approved.id,
      quote_request_id: Geometry.isUuid(quoteRequestId) ? quoteRequestId : session.quote_request_id,
      lead_id: session.lead_id,
      approved_area_m2: approved.selected_area_m2,
      confidence_level: approved.confidence_level,
      review_status: "approved",
      metadata: {
        linked_by: actorLabel || "admin",
        source: "floorplan_phase2"
      }
    }
  });
  const link = getFirstRow(rows);
  await recordEvent({
    measurement_session_id: sessionId,
    measurement_version_id: approved.id,
    event_type: "linked_to_quote_os",
    actor_type: "admin",
    actor_label: actorLabel,
    metadata: {
      quote_request_id: Geometry.isUuid(quoteRequestId) ? quoteRequestId : session.quote_request_id || null,
      approved_area_m2: approved.selected_area_m2
    }
  });
  return link;
}

async function getUploadedFile(fileId) {
  if (!Geometry.isUuid(fileId)) return null;
  const rows = await supabaseRequest(TABLES.uploadedFiles, {
    query: {
      id: "eq." + fileId,
      select: "id,safe_filename,file_type,file_size_bytes,storage_bucket,file_path"
    }
  });
  return getFirstRow(rows);
}

module.exports = {
  TABLES: TABLES,
  createCustomerSubmission: createCustomerSubmission,
  createReviewDraft: createReviewDraft,
  getSessionDetail: getSessionDetail,
  getUploadedFile: getUploadedFile,
  linkApprovedMeasurement: linkApprovedMeasurement,
  listSessions: listSessions,
  approveVersion: approveVersion,
  recordEvent: recordEvent,
  supabaseRequest: supabaseRequest
};
