"use client";

import { useEffect, useMemo, useState } from "react";

type ChatbotQualification = {
  id: string;
  lead_id?: string;
  event_id?: string;
  created_at?: string;
  source_page?: string;
  source_url?: string;
  intent?: string;
  suburb?: string;
  property_type?: string;
  product_category?: string;
  area_status?: string;
  approx_area_m2?: number;
  stairs_status?: string;
  removal_status?: string;
  floorplan_status?: string;
  existing_quote_status?: string;
  urgency?: string;
  next_action?: string;
  handoff_url?: string;
  missing_info?: string[];
  confidence?: string;
};

type ChatbotEvent = {
  id: string;
  created_at?: string;
  event_type?: string;
  source?: string;
  customer_safe?: boolean;
  metadata?: Record<string, unknown>;
};

type ChatbotDetailResponse = {
  ok?: boolean;
  qualification?: ChatbotQualification;
  lead?: {
    id?: string;
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
      product_category?: string;
      area_m2?: number;
    };
    next_action?: string;
  } | null;
  events?: ChatbotEvent[];
  follow_up_recommendation?: string;
  error?: string;
};

type ChatbotListResponse = {
  ok?: boolean;
  chatbot_qualifications?: ChatbotQualification[];
  error?: string;
};

const FILTERS = {
  intent: ["all", "start_quote", "existing_quote_review", "product_help", "floorplan_help", "contact_human", "general_question"],
  confidence: ["all", "high", "medium", "low", "unknown"],
  next_action: ["all", "start_quote_form", "review_existing_quote", "choose_product", "upload_floorplan", "review_contact_request"],
  source_page: ["all", "/", "/products.html", "/quote.html", "/quote-review.html", "/floorplan.html", "/blog/", "/contact.html"]
};

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function humanize(value?: string) {
  return String(value || "not recorded").replace(/[_-]/g, " ");
}

function displayList(items?: string[]) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  return safeItems.length ? safeItems.map(humanize).join(", ") : "None recorded";
}

function activeFilterSummary(filters: Record<string, string>) {
  const active = Object.entries(filters)
    .filter(([, value]) => value && value !== "all")
    .map(([key, value]) => `${humanize(key)}: ${humanize(value)}`);
  return active.length ? active.join(" · ") : "Showing all chatbot-qualified lead events.";
}

function formatEventMetadata(metadata?: Record<string, unknown>) {
  if (!metadata || typeof metadata !== "object") return "";
  return [
    metadata.intent ? `Intent: ${humanize(String(metadata.intent))}` : "",
    metadata.handoff_url ? `Handoff: ${String(metadata.handoff_url)}` : "",
    metadata.next_action ? `Next: ${humanize(String(metadata.next_action))}` : "",
    metadata.device_type ? `Device: ${humanize(String(metadata.device_type))}` : "",
    metadata.source_page ? `Source: ${String(metadata.source_page)}` : ""
  ].filter(Boolean).slice(0, 5).join(" · ");
}

function buildQuery(filters: Record<string, string>) {
  const params = new URLSearchParams({ action: "chatbot-list", limit: "50" });
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      params.set(key, value);
    }
  });
  return params.toString();
}

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="admin-filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{humanize(option)}</option>
        ))}
      </select>
    </label>
  );
}

function DetailPanel({
  adminToken,
  qualificationId,
  onClose
}: {
  adminToken: string;
  qualificationId: string;
  onClose: () => void;
}) {
  const [payload, setPayload] = useState<ChatbotDetailResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadDetail() {
      setStatus("loading");
      setMessage("");
      try {
        const response = await fetch(`/.netlify/functions/lead-dashboard?action=chatbot-detail&qualification_id=${encodeURIComponent(qualificationId)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
          cache: "no-store"
        });
        const result = (await response.json().catch(() => null)) as ChatbotDetailResponse | null;
        if (cancelled) return;
        if (!response.ok || !result?.ok) {
          setStatus("error");
          setMessage(result?.error || "Chatbot lead detail could not be loaded.");
          return;
        }
        setPayload(result);
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Chatbot lead detail could not be loaded.");
        }
      }
    }
    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [adminToken, qualificationId]);

  const qualification = payload?.qualification;
  const lead = payload?.lead;

  return (
    <section className="admin-lead-detail" aria-labelledby="adminChatbotDetailTitle">
      <div className="admin-lead-detail-head">
        <div>
          <span className="eyebrow">Chatbot lead detail</span>
          <h2 id="adminChatbotDetailTitle">{humanize(qualification?.intent)}</h2>
          <p>{qualification ? `${formatDate(qualification.created_at)} · ${qualification.source_page || "Source not recorded"}` : "Loading protected chatbot detail."}</p>
          {qualification ? <span className="admin-status-badge admin-status-badge-chatbot">Chatbot-qualified lead</span> : null}
        </div>
        <button className="button button-secondary" type="button" onClick={onClose}>Close detail</button>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>Chatbot detail unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="admin-empty-state">
          <strong>Loading chatbot detail</strong>
          <span>Reading through the protected dashboard function.</span>
        </div>
      ) : null}

      {status === "ready" && qualification ? (
        <>
          <div className="admin-detail-grid">
            <div className="admin-detail-block">
              <strong>Qualification</strong>
              <span>Intent: {humanize(qualification.intent)}</span>
              <span>Confidence: {humanize(qualification.confidence)}</span>
              <span>Next: {humanize(qualification.next_action)}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Project summary</strong>
              <span>Suburb: {qualification.suburb || "Not recorded"}</span>
              <span>Property: {humanize(qualification.property_type)}</span>
              <span>Product: {humanize(qualification.product_category)}</span>
              <span>Area: {qualification.approx_area_m2 ? `${qualification.approx_area_m2} m2` : humanize(qualification.area_status)}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Scope signals</strong>
              <span>Stairs: {humanize(qualification.stairs_status)}</span>
              <span>Removal: {humanize(qualification.removal_status)}</span>
              <span>Floor plan: {humanize(qualification.floorplan_status)}</span>
              <span>Existing quote: {humanize(qualification.existing_quote_status)}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Handoff</strong>
              <span>{qualification.handoff_url || "Not recorded"}</span>
              <span>Source: {qualification.source_page || "Not recorded"}</span>
              <span>Event: {qualification.event_id || "Not recorded"}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Related lead</strong>
              <span>{lead?.id || qualification.lead_id || "Not matched"}</span>
              <span>{lead ? `${humanize(lead.primary_source)} · ${humanize(lead.source_detail)}` : "No parent lead detail returned"}</span>
              <span>{lead ? `${humanize(lead.status)} · ${humanize(lead.priority)}` : "No status returned"}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Follow-up recommendation</strong>
              <span>{payload?.follow_up_recommendation || "Review chatbot qualification"}</span>
            </div>
            <div className="admin-detail-block">
              <strong>Missing info</strong>
              <span>{displayList(qualification.missing_info)}</span>
            </div>
          </div>

          <div className="admin-detail-section">
            <h3>Event timeline</h3>
            {(payload?.events || []).length ? (
              <ol className="admin-detail-list">
                {(payload?.events || []).map((event) => (
                  <li key={event.id}>
                    <strong>{humanize(event.event_type)} · {formatDate(event.created_at)}</strong>
                    <span>{formatEventMetadata(event.metadata) || humanize(event.source)}</span>
                  </li>
                ))}
              </ol>
            ) : <p>No timeline events returned.</p>}
          </div>
        </>
      ) : null}
    </section>
  );
}

export function AdminChatbotLeads({ adminToken }: { adminToken: string }) {
  const [filters, setFilters] = useState({
    intent: "all",
    confidence: "all",
    next_action: "all",
    source_page: "all"
  });
  const [rows, setRows] = useState<ChatbotQualification[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const query = useMemo(() => buildQuery(filters), [filters]);

  async function loadRows() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/.netlify/functions/lead-dashboard?${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => null)) as ChatbotListResponse | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(payload?.error || "Chatbot leads could not be loaded.");
        return;
      }
      setRows(Array.isArray(payload.chatbot_qualifications) ? payload.chatbot_qualifications : []);
      setStatus("ready");
    } catch {
      setStatus("error");
      setMessage("Chatbot leads could not be loaded.");
    }
  }

  useEffect(() => {
    loadRows();
  }, [query, adminToken]);

  function setFilter(key: keyof typeof filters, value: string) {
    setSelectedId("");
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="admin-lead-list" aria-labelledby="adminChatbotLeadsTitle">
      <div className="admin-lead-list-head">
        <div>
          <span className="eyebrow">Chatbot qualified leads</span>
          <h2 id="adminChatbotLeadsTitle">Latest chatbot-qualified events</h2>
          <p>Read-only view of safe chatbot qualification signals, handoffs, missing info and next action.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={loadRows} disabled={status === "loading"}>
          {status === "loading" ? "Loading" : "Refresh"}
        </button>
      </div>

      <div className="admin-filter-row" aria-label="Chatbot lead filters">
        <FilterSelect label="Intent" value={filters.intent} options={FILTERS.intent} onChange={(value) => setFilter("intent", value)} />
        <FilterSelect label="Confidence" value={filters.confidence} options={FILTERS.confidence} onChange={(value) => setFilter("confidence", value)} />
        <FilterSelect label="Next action" value={filters.next_action} options={FILTERS.next_action} onChange={(value) => setFilter("next_action", value)} />
        <FilterSelect label="Source page" value={filters.source_page} options={FILTERS.source_page} onChange={(value) => setFilter("source_page", value)} />
      </div>
      <div className="admin-filter-summary" aria-live="polite">
        <strong>Active filters</strong>
        <span>{activeFilterSummary(filters)}</span>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>Chatbot leads unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {status === "ready" && rows.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No chatbot-qualified events returned</strong>
          <span>The protected dashboard function responded, but no rows matched the current filters.</span>
        </div>
      ) : null}

      {selectedId ? (
        <DetailPanel adminToken={adminToken} qualificationId={selectedId} onClose={() => setSelectedId("")} />
      ) : null}

      {rows.length > 0 ? (
        <div className="admin-lead-table-wrap">
          <table className="admin-lead-table">
            <thead>
              <tr>
                <th scope="col">Created</th>
                <th scope="col">Intent</th>
                <th scope="col">Source page</th>
                <th scope="col">Suburb</th>
                <th scope="col">Product</th>
                <th scope="col">Scope</th>
                <th scope="col">Confidence</th>
                <th scope="col">Missing info</th>
                <th scope="col">Next action</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.created_at)}</td>
                  <td>
                    <span className="admin-status-badge admin-status-badge-chatbot">Chatbot-qualified</span>
                    <strong>{humanize(row.intent)}</strong>
                    <span>{humanize(row.urgency)}</span>
                  </td>
                  <td>{row.source_page || "Not recorded"}</td>
                  <td>{row.suburb || "Not recorded"}</td>
                  <td>{humanize(row.product_category)}</td>
                  <td>
                    <strong>{humanize(row.area_status)}</strong>
                    <span>Stairs {humanize(row.stairs_status)} · removal {humanize(row.removal_status)}</span>
                    <span>Floor plan {humanize(row.floorplan_status)} · quote {humanize(row.existing_quote_status)}</span>
                  </td>
                  <td>{humanize(row.confidence)}</td>
                  <td>{displayList(row.missing_info)}</td>
                  <td>{humanize(row.next_action)}</td>
                  <td>
                    <button className="admin-table-action" type="button" onClick={() => setSelectedId(row.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
