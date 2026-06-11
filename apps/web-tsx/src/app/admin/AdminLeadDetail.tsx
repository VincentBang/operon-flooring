"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type DetailLead = {
  id: string;
  created_at?: string;
  updated_at?: string;
  last_activity_at?: string;
  primary_source?: string;
  source_detail?: string;
  status?: string;
  priority?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  project?: {
    suburb?: string;
    postcode?: string;
    product_category?: string;
    product_name?: string;
    area_m2?: number;
    estimated_order_area_m2?: number;
  };
  quote?: {
    estimate_total_inc_gst?: number;
    confidence_score?: number;
    confidence_level?: string;
    missing_info_flags?: string[];
    risk_flags?: string[];
  };
  statuses?: {
    quote_review_status?: string;
    floorplan_status?: string;
    contact_status?: string;
    follow_up_status?: string;
  };
  next_action?: string;
};

type DetailEvent = {
  id: string;
  created_at?: string;
  event_type?: string;
  source?: string;
  source_table?: string;
  customer_safe?: boolean;
  metadata?: Record<string, unknown>;
};

type DetailNote = {
  id: string;
  created_at?: string;
  note?: string;
  note_type?: string;
  created_by?: string;
};

type DetailFile = {
  id: string;
  created_at?: string;
  uploaded_file_id?: string;
  file_role?: string;
  safe_filename?: string;
  file_type?: string;
  file_size_bytes?: number;
  storage_status?: string;
};

type DetailResponse = {
  ok?: boolean;
  lead?: DetailLead;
  events?: DetailEvent[];
  notes?: DetailNote[];
  files?: DetailFile[];
  error?: string;
};

const STATUS_OPTIONS = [
  "New",
  "Needs review",
  "Waiting customer",
  "Quote sent",
  "Site measure booked",
  "Won",
  "Lost",
  "Archived"
];

const TERMINAL_STATUSES = ["Won", "Lost", "Archived"];

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatMoney(value?: number) {
  if (!Number.isFinite(Number(value))) return "Not estimated";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function humanize(value?: string) {
  return String(value || "not recorded").replace(/[_-]/g, " ");
}

function formatEventMetadata(metadata?: Record<string, unknown>) {
  if (!metadata || typeof metadata !== "object") return "";
  const parts = [
    metadata.intent ? `Intent: ${humanize(String(metadata.intent))}` : "",
    metadata.handoff_path ? `Handoff: ${String(metadata.handoff_path)}` : "",
    metadata.next_action ? `Next: ${String(metadata.next_action)}` : "",
    metadata.device_type ? `Device: ${humanize(String(metadata.device_type))}` : "",
    metadata.source_page ? `Source page: ${String(metadata.source_page)}` : ""
  ].filter(Boolean);
  return parts.slice(0, 5).join(" · ");
}

function formatFileSize(value?: number) {
  const bytes = Number(value || 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return "Size not recorded";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ListBlock({ title, items }: { title: string; items?: string[] }) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  return (
    <div className="admin-detail-block">
      <strong>{title}</strong>
      {safeItems.length ? (
        <ul>
          {safeItems.map((item) => <li key={item}>{humanize(item)}</li>)}
        </ul>
      ) : (
        <span>None recorded</span>
      )}
    </div>
  );
}

export function AdminLeadDetail({
  adminToken,
  leadId,
  onClose
}: {
  adminToken: string;
  leadId: string;
  onClose: () => void;
}) {
  const [payload, setPayload] = useState<DetailResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [statusWriteState, setStatusWriteState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusWriteMessage, setStatusWriteMessage] = useState("");

  const loadDetail = useCallback(async function loadDetail(cancelledRef?: { cancelled: boolean }) {
      setStatus("loading");
      setMessage("");
      setPayload(null);
      try {
        const response = await fetch(`/.netlify/functions/lead-dashboard?action=detail&lead_id=${encodeURIComponent(leadId)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
          cache: "no-store"
        });
        const detail = (await response.json().catch(() => null)) as DetailResponse | null;
        if (cancelledRef?.cancelled) return;
        if (!response.ok || !detail?.ok) {
          setStatus("error");
          setMessage(detail?.error || "Lead detail could not be loaded.");
          return;
        }
        setPayload(detail);
        setNextStatus(detail.lead?.status || "");
        setStatus("ready");
      } catch {
        if (!cancelledRef?.cancelled) {
          setStatus("error");
          setMessage("Lead detail could not be loaded.");
        }
      }
  }, [adminToken, leadId]);

  useEffect(() => {
    const cancelledRef = { cancelled: false };
    loadDetail(cancelledRef);
    return () => {
      cancelledRef.cancelled = true;
    };
  }, [loadDetail]);

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nextStatus || nextStatus === lead?.status) {
      setStatusWriteState("error");
      setStatusWriteMessage("Choose a different status before saving.");
      return;
    }
    if (TERMINAL_STATUSES.includes(nextStatus)) {
      const confirmed = window.confirm(`Move this lead to ${nextStatus}?`);
      if (!confirmed) return;
    }

    setStatusWriteState("saving");
    setStatusWriteMessage("");
    try {
      const response = await fetch("/.netlify/functions/lead-status-admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        },
        cache: "no-store",
        body: JSON.stringify({
          lead_id: leadId,
          status: nextStatus,
          reason: statusReason
        })
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        setStatusWriteState("error");
        setStatusWriteMessage(result?.error || "Lead status could not be updated.");
        return;
      }
      setStatusWriteState("saved");
      setStatusWriteMessage("Lead status updated.");
      setStatusReason("");
      await loadDetail();
    } catch {
      setStatusWriteState("error");
      setStatusWriteMessage("Lead status could not be updated.");
    }
  }

  const lead = payload?.lead;

  return (
    <section className="admin-lead-detail" aria-labelledby="adminLeadDetailTitle">
      <div className="admin-lead-detail-head">
        <div>
          <span className="eyebrow">Lead detail</span>
          <h2 id="adminLeadDetailTitle">{lead?.customer?.name || "Selected lead"}</h2>
          <p>{lead ? `${humanize(lead.primary_source)} · ${humanize(lead.status)} · ${formatDate(lead.last_activity_at)}` : "Loading protected lead detail."}</p>
        </div>
        <button className="button button-secondary" type="button" onClick={onClose}>Close detail</button>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>Lead detail unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="admin-empty-state">
          <strong>Loading lead detail</strong>
          <span>Reading through the protected dashboard function.</span>
        </div>
      ) : null}

      {status === "ready" && lead ? (
        <>
          <div className="admin-detail-grid">
            <div className="admin-detail-block">
              <strong>Customer</strong>
              <span>{lead.customer?.name || "Name not supplied"}</span>
              <span>{lead.customer?.email || "Email not supplied"}</span>
              <span>{lead.customer?.phone || "Phone not supplied"}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Project</strong>
              <span>{[lead.project?.suburb, lead.project?.postcode].filter(Boolean).join(" ") || "Suburb not recorded"}</span>
              <span>{humanize(lead.project?.product_category)}</span>
              <span>{lead.project?.area_m2 ? `${lead.project.area_m2} m2 measured` : "Area not recorded"}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Quote</strong>
              <span>{formatMoney(lead.quote?.estimate_total_inc_gst)}</span>
              <span>{humanize(lead.quote?.confidence_level)}</span>
              <span>{lead.quote?.confidence_score ? `${lead.quote.confidence_score}% confidence` : "Score not recorded"}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Next action</strong>
              <span>{lead.next_action || "Review lead"}</span>
              <span>{humanize(lead.priority)}</span>
              <span>{humanize(lead.status)}</span>
            </div>
            <form className="admin-detail-block admin-status-form" onSubmit={handleStatusSubmit}>
              <strong>Status update</strong>
              <label htmlFor="adminLeadStatus">Lead status</label>
              <select id="adminLeadStatus" value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>
                {STATUS_OPTIONS.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
              <label htmlFor="adminLeadStatusReason">Reason</label>
              <input
                id="adminLeadStatusReason"
                value={statusReason}
                onChange={(event) => setStatusReason(event.target.value)}
                maxLength={500}
                placeholder="Optional internal reason"
              />
              <button className="button button-primary" type="submit" disabled={statusWriteState === "saving"}>
                {statusWriteState === "saving" ? "Saving" : "Save status"}
              </button>
              {statusWriteMessage ? <span>{statusWriteMessage}</span> : null}
            </form>
            <ListBlock title="Missing info" items={lead.quote?.missing_info_flags} />
            <ListBlock title="Risk flags" items={lead.quote?.risk_flags} />
            <div className="admin-detail-block">
              <strong>Linked status</strong>
              <span>Quote review: {humanize(lead.statuses?.quote_review_status)}</span>
              <span>Floorplan: {humanize(lead.statuses?.floorplan_status)}</span>
              <span>Contact: {humanize(lead.statuses?.contact_status)}</span>
              <span>Follow-up: {humanize(lead.statuses?.follow_up_status)}</span>
            </div>
          </div>

          <div className="admin-detail-section">
            <h3>Files</h3>
            {(payload.files || []).length ? (
              <ul className="admin-detail-list">
                {(payload.files || []).map((file) => (
                  <li key={file.id}>
                    <strong>{file.safe_filename || file.uploaded_file_id || "Uploaded file"}</strong>
                    <span>{humanize(file.file_role)} · {file.file_type || "type not recorded"} · {formatFileSize(file.file_size_bytes)} · {humanize(file.storage_status)}</span>
                  </li>
                ))}
              </ul>
            ) : <p>No safe file metadata linked.</p>}
          </div>

          <div className="admin-detail-section">
            <h3>Notes</h3>
            {(payload.notes || []).length ? (
              <ul className="admin-detail-list">
                {(payload.notes || []).map((note) => (
                  <li key={note.id}>
                    <strong>{humanize(note.note_type)} · {formatDate(note.created_at)}</strong>
                    <span>{note.note || "Note text missing"}</span>
                  </li>
                ))}
              </ul>
            ) : <p>No internal notes recorded.</p>}
          </div>

          <div className="admin-detail-section">
            <h3>Event timeline</h3>
            {(payload.events || []).length ? (
              <ol className="admin-detail-list">
                {(payload.events || []).map((event) => (
                  <li key={event.id}>
                    <strong>{humanize(event.event_type)} · {formatDate(event.created_at)}</strong>
                    <span>{humanize(event.source)} · {event.customer_safe === false ? "internal event" : "customer-safe event"}</span>
                    {formatEventMetadata(event.metadata) ? <span>{formatEventMetadata(event.metadata)}</span> : null}
                  </li>
                ))}
              </ol>
            ) : <p>No event timeline recorded.</p>}
          </div>
        </>
      ) : null}
    </section>
  );
}
