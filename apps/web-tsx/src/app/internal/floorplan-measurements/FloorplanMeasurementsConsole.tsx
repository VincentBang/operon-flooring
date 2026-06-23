"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AuthState = "idle" | "checking" | "authenticated" | "denied" | "error" | "unconfigured";

type SessionRow = {
  id: string;
  created_at?: string;
  updated_at?: string;
  submitted_at?: string;
  status?: string;
  measurement_mode?: string;
  selected_area_m2?: number;
  measured_area_m2?: number;
  confidence_level?: string;
  review_required?: boolean;
  uploaded_file_id?: string | null;
  quote_request_id?: string | null;
  current_customer_version_id?: string | null;
  current_review_version_id?: string | null;
  approved_version_id?: string | null;
};

type SectionRow = {
  id?: string;
  client_section_id?: string;
  section_order?: number;
  label?: string;
  section_type?: string;
  selection_state?: string;
  geometry_json?: { points?: Array<{ x: number; y: number }> };
  area_m2?: number;
  confidence_level?: string;
  reviewer_notes?: string | null;
};

type VersionRow = {
  id: string;
  version_number?: number;
  version_status?: string;
  version_source?: string;
  page_width?: number;
  page_height?: number;
  pixels_per_metre?: number;
  selected_area_m2?: number;
  measured_area_m2?: number;
  adjusted_area_m2?: number;
  confidence_level?: string;
  sections?: SectionRow[];
};

type DetailResponse = {
  ok?: boolean;
  error?: string;
  session?: SessionRow;
  versions?: VersionRow[];
  events?: Array<{ id: string; event_type?: string; actor_type?: string; created_at?: string }>;
};

function formatDate(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
}

function formatArea(value?: number) {
  return `${Number(value || 0).toFixed(2)} m2`;
}

function getStatusCopy(status: AuthState, message: string) {
  if (status === "authenticated") return "Admin access verified. Floorplan review functions are available.";
  if (status === "checking") return "Checking admin access...";
  if (status === "unconfigured") return message || "Admin access is not configured in this environment.";
  if (status === "denied") return message || "Admin access denied.";
  if (status === "error") return message || "Admin access could not be checked.";
  return "Enter the approved admin token to load internal floorplan measurements.";
}

function safePointsForEditor(version?: VersionRow) {
  return (version?.sections || []).map((section) => ({
    client_section_id: section.client_section_id || section.id || "",
    label: section.label || "Room",
    section_type: section.section_type || "room",
    selection_state: section.selection_state || "include",
    confidence: section.confidence_level || "medium",
    area_m2: section.area_m2 || 0,
    reviewer_notes: section.reviewer_notes || "",
    points: section.geometry_json?.points || []
  }));
}

export function FloorplanMeasurementsConsole() {
  const [token, setToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [authMessage, setAuthMessage] = useState("");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [status, setStatus] = useState("customer_submitted");
  const [workState, setWorkState] = useState("");
  const [editorJson, setEditorJson] = useState("[]");
  const [quoteRequestId, setQuoteRequestId] = useState("");

  const selectedVersion = useMemo(() => {
    const versions = detail?.versions || [];
    return versions.find((version) => version.id === detail?.session?.current_review_version_id)
      || versions.find((version) => version.id === detail?.session?.current_customer_version_id)
      || versions[versions.length - 1];
  }, [detail]);

  async function verifyAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setAuthState("denied");
      setAuthMessage("Admin authentication required.");
      return;
    }
    setAuthState("checking");
    try {
      const response = await fetch("/.netlify/functions/admin-session-status", {
        headers: { Authorization: `Bearer ${trimmed}` },
        cache: "no-store"
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.authenticated) {
        setVerifiedToken(trimmed);
        setToken("");
        setAuthState("authenticated");
        setAuthMessage("");
        return;
      }
      setAuthState(response.status === 503 ? "unconfigured" : response.status === 401 || response.status === 403 ? "denied" : "error");
      setAuthMessage(payload?.error || "");
    } catch {
      setAuthState("error");
      setAuthMessage("Admin access could not be checked.");
    }
  }

  async function loadSessions() {
    if (!verifiedToken) return;
    setWorkState("Loading floorplan measurements...");
    const query = new URLSearchParams();
    query.set("limit", "50");
    if (status) query.set("status", status);
    const response = await fetch(`/.netlify/functions/list-internal-floorplan-measurements?${query}`, {
      headers: { Authorization: `Bearer ${verifiedToken}` },
      cache: "no-store"
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      setWorkState(payload?.error || "Floorplan measurements could not be loaded.");
      return;
    }
    setSessions(payload.sessions || []);
    setWorkState("");
  }

  async function loadDetail(sessionId: string) {
    setSelectedId(sessionId);
    setWorkState("Loading measurement detail...");
    const response = await fetch(`/.netlify/functions/get-internal-floorplan-measurement?session_id=${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${verifiedToken}` },
      cache: "no-store"
    });
    const payload = (await response.json().catch(() => null)) as DetailResponse | null;
    if (!response.ok || !payload?.ok) {
      setWorkState(payload?.error || "Measurement detail could not be loaded.");
      return;
    }
    setDetail(payload);
    setEditorJson(JSON.stringify(safePointsForEditor(payload.versions?.[payload.versions.length - 1]), null, 2));
    setQuoteRequestId(payload.session?.quote_request_id || "");
    setWorkState("");
  }

  async function saveDraft() {
    if (!detail?.session || !selectedVersion) return;
    let sections;
    try {
      sections = JSON.parse(editorJson);
    } catch {
      setWorkState("Editor JSON is not valid.");
      return;
    }
    const response = await fetch("/.netlify/functions/save-floorplan-review-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${verifiedToken}` },
      body: JSON.stringify({
        session_id: detail.session.id,
        parent_version_id: selectedVersion.id,
        page_width: selectedVersion.page_width,
        page_height: selectedVersion.page_height,
        pixels_per_metre: selectedVersion.pixels_per_metre,
        confidence_level: "medium",
        source: "internal_floorplan_review",
        sections
      })
    });
    const payload = await response.json().catch(() => null);
    setWorkState(payload?.error || (response.ok ? "Review draft saved." : "Review draft could not be saved."));
    if (response.ok) await loadDetail(detail.session.id);
  }

  async function approve(versionId: string) {
    if (!detail?.session) return;
    const response = await fetch("/.netlify/functions/approve-floorplan-measurement", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${verifiedToken}` },
      body: JSON.stringify({ session_id: detail.session.id, version_id: versionId })
    });
    const payload = await response.json().catch(() => null);
    setWorkState(payload?.error || (response.ok ? "Measurement approved." : "Measurement could not be approved."));
    if (response.ok) await loadDetail(detail.session.id);
  }

  async function linkApproved() {
    if (!detail?.session) return;
    const response = await fetch("/.netlify/functions/link-approved-floorplan-measurement", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${verifiedToken}` },
      body: JSON.stringify({ session_id: detail.session.id, quote_request_id: quoteRequestId || undefined })
    });
    const payload = await response.json().catch(() => null);
    setWorkState(payload?.error || (response.ok ? "Approved measurement linked to Quote OS." : "Approved measurement could not be linked."));
    if (response.ok) await loadDetail(detail.session.id);
  }

  async function openPrivateDocument() {
    const uploadedFileId = detail?.session?.uploaded_file_id;
    if (!uploadedFileId) {
      setWorkState("No private floorplan file is linked to this measurement.");
      return;
    }
    setWorkState("Opening private floorplan document...");
    const response = await fetch(`/.netlify/functions/stream-internal-floorplan-document?uploaded_file_id=${encodeURIComponent(uploadedFileId)}`, {
      headers: { Authorization: `Bearer ${verifiedToken}` },
      cache: "no-store"
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setWorkState(payload?.error || "Private floorplan document could not be opened.");
      return;
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    setWorkState("Private floorplan document opened in a temporary viewer.");
  }

  useEffect(() => {
    if (verifiedToken) {
      loadSessions();
    }
  }, [verifiedToken, status]);

  const authenticated = authState === "authenticated";

  return (
    <div className="admin-auth-shell internal-floorplan-console" aria-live="polite">
      <form className="admin-auth-form" onSubmit={verifyAdmin}>
        <label htmlFor="floorplanAdminToken">Admin access token</label>
        <div className="admin-auth-row">
          <input id="floorplanAdminToken" type="password" value={token} autoComplete="off" onChange={(event) => setToken(event.target.value)} disabled={authenticated || authState === "checking"} />
          <button className="button button-primary" type="submit" disabled={authenticated || authState === "checking"}>{authenticated ? "Verified" : "Verify"}</button>
        </div>
      </form>
      <div className={`admin-auth-status admin-auth-status-${authState}`}>
        <strong>{authenticated ? "Verified internal floorplan console" : "Locked internal console"}</strong>
        <span>{getStatusCopy(authState, authMessage)}</span>
      </div>

      {authenticated ? (
        <div className="internal-floorplan-grid">
          <section className="admin-lead-list">
            <div className="admin-lead-list-head">
              <div>
                <span className="admin-status-badge">Review queue</span>
                <h2>Measurement sessions</h2>
                <p>Customer submissions and reviewer drafts. No storage path or pricing data is shown.</p>
              </div>
              <button className="admin-table-action" type="button" onClick={loadSessions}>Refresh</button>
            </div>
            <label className="admin-filter-field">
              <span>Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">All</option>
                <option value="customer_submitted">Customer submitted</option>
                <option value="review_draft">Review draft</option>
                <option value="approved">Approved</option>
                <option value="linked_to_quote">Linked to quote</option>
              </select>
            </label>
            <div className="admin-lead-table-wrap">
              <table className="admin-lead-table">
                <thead>
                  <tr><th>Status</th><th>Area</th><th>Confidence</th><th>Submitted</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td><strong>{session.status}</strong><span>{session.measurement_mode}</span></td>
                      <td><strong>{formatArea(session.selected_area_m2)}</strong><span>{session.review_required ? "Review required" : "Review optional"}</span></td>
                      <td>{session.confidence_level || "unknown"}</td>
                      <td>{formatDate(session.submitted_at || session.created_at)}</td>
                      <td><button className="admin-table-action" type="button" onClick={() => loadDetail(session.id)}>Open</button></td>
                    </tr>
                  ))}
                  {!sessions.length ? <tr><td colSpan={5}>No floorplan sessions loaded.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-lead-detail">
            <div className="admin-lead-detail-head">
              <div>
                <span className="admin-status-badge admin-status-badge-dry-run">Internal only</span>
                <h2>Measurement detail</h2>
                <p>{selectedId ? selectedId : "Select a session to review."}</p>
              </div>
            </div>
            {detail?.session ? (
              <>
                <div className="admin-detail-grid">
                  <div className="admin-detail-block"><strong>Status</strong><span>{detail.session.status}</span></div>
                  <div className="admin-detail-block"><strong>Selected area</strong><span>{formatArea(detail.session.selected_area_m2)}</span></div>
                  <div className="admin-detail-block"><strong>Uploaded file</strong><span>{detail.session.uploaded_file_id ? "Private file linked" : "No private file linked"}</span></div>
                </div>
                {detail.session.uploaded_file_id ? (
                  <div className="admin-detail-section">
                    <h3>Private plan viewer</h3>
                    <p>Open the uploaded floorplan through the admin-only stream. No storage location is shown in the browser.</p>
                    <button className="admin-table-action" type="button" onClick={openPrivateDocument}>Open private floorplan</button>
                  </div>
                ) : null}
                <div className="admin-detail-section">
                  <h3>Versions</h3>
                  <div className="admin-followup-meta">
                    {(detail.versions || []).map((version) => (
                      <button className="admin-table-action" type="button" key={version.id} onClick={() => {
                        setEditorJson(JSON.stringify(safePointsForEditor(version), null, 2));
                      }}>
                        v{version.version_number} · {version.version_status} · {formatArea(version.selected_area_m2)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="admin-detail-section">
                  <h3>Reviewer draft editor</h3>
                  <p>Edit safe section geometry JSON only. The server recalculates area before saving. Add reviewer_notes per section when a correction needs context.</p>
                  <textarea className="internal-floorplan-editor" value={editorJson} onChange={(event) => setEditorJson(event.target.value)} spellCheck={false} />
                  <div className="admin-followup-actions">
                    <button className="admin-table-action" type="button" onClick={saveDraft}>Save review draft</button>
                    {selectedVersion ? <button className="admin-table-action" type="button" onClick={() => approve(selectedVersion.id)}>Approve selected version</button> : null}
                  </div>
                </div>
                <div className="admin-detail-section">
                  <h3>Quote OS handoff</h3>
                  <p>Link only an approved area into the internal quote workflow. This does not calculate price.</p>
                  <label className="admin-filter-field">
                    <span>Quote request ID (optional)</span>
                    <input value={quoteRequestId} onChange={(event) => setQuoteRequestId(event.target.value)} placeholder="UUID if known" />
                  </label>
                  <button className="admin-table-action" type="button" onClick={linkApproved}>Link approved measurement</button>
                </div>
                <div className="admin-detail-section">
                  <h3>Timeline</h3>
                  <ol className="admin-detail-list">
                    {(detail.events || []).map((event) => (
                      <li key={event.id}><strong>{event.event_type}</strong><span>{formatDate(event.created_at)} · {event.actor_type}</span></li>
                    ))}
                  </ol>
                </div>
              </>
            ) : (
              <div className="admin-empty-state"><strong>No session selected</strong><span>Open a measurement from the queue.</span></div>
            )}
          </section>
        </div>
      ) : null}
      {workState ? <div className="admin-auth-status admin-auth-status-idle"><strong>Status</strong><span>{workState}</span></div> : null}
    </div>
  );
}
