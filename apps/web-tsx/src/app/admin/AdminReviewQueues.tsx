"use client";

import { useEffect, useState } from "react";

type QueueLead = {
  id: string;
  created_at?: string;
  last_activity_at?: string;
  primary_source?: string;
  source_detail?: string;
  status?: string;
  priority?: string;
  customer_name?: string;
  suburb?: string;
  product_category?: string;
  confidence_level?: string;
  missing_info_count?: number;
  risk_flag_count?: number;
  quote_review_status?: string;
  floorplan_status?: string;
  next_action?: string;
};

type QueueResponse = {
  ok?: boolean;
  leads?: QueueLead[];
  error?: string;
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

function QueuePanel({
  adminToken,
  title,
  source,
  emptyText,
  statusField
}: {
  adminToken: string;
  title: string;
  source: "quote_review" | "floorplan";
  emptyText: string;
  statusField: "quote_review_status" | "floorplan_status";
}) {
  const [leads, setLeads] = useState<QueueLead[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  async function loadQueue() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/.netlify/functions/lead-dashboard?action=list&source=${source}&limit=25`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => null)) as QueueResponse | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(payload?.error || `${title} could not be loaded.`);
        return;
      }
      setLeads(Array.isArray(payload.leads) ? payload.leads : []);
      setStatus("ready");
    } catch {
      setStatus("error");
      setMessage(`${title} could not be loaded.`);
    }
  }

  useEffect(() => {
    loadQueue();
  }, [adminToken]);

  return (
    <section className="admin-queue-panel" aria-label={title}>
      <div className="admin-queue-head">
        <div>
          <h3>{title}</h3>
          <p>{source === "quote_review" ? "Quote-review leads needing review or follow-up." : "Floorplan/upload leads needing area or file review."}</p>
        </div>
        <button className="admin-table-action" type="button" onClick={loadQueue} disabled={status === "loading"}>
          {status === "loading" ? "Loading" : "Refresh"}
        </button>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>{title} unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {status === "ready" && leads.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No rows returned</strong>
          <span>{emptyText}</span>
        </div>
      ) : null}

      {leads.length ? (
        <div className="admin-queue-list">
          {leads.map((lead) => (
            <article className="admin-queue-item" key={lead.id}>
              <div>
                <strong>{lead.customer_name || "Customer not supplied"}</strong>
                <span>{formatDate(lead.last_activity_at || lead.created_at)} · {lead.suburb || "Suburb not recorded"}</span>
              </div>
              <div className="admin-followup-meta">
                <span>{humanize(lead.source_detail)}</span>
                <span>{humanize(lead.product_category)}</span>
                <span>{humanize(lead[statusField])}</span>
                <span>{humanize(lead.confidence_level)}</span>
                <span>{Number(lead.missing_info_count || 0)} missing</span>
                <span>{Number(lead.risk_flag_count || 0)} risks</span>
              </div>
              <p>{lead.next_action || "Review lead"}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function AdminReviewQueues({ adminToken }: { adminToken: string }) {
  return (
    <section className="admin-review-queues" aria-labelledby="adminReviewQueuesTitle">
      <div className="admin-lead-list-head">
        <div>
          <span className="eyebrow">Review queues</span>
          <h2 id="adminReviewQueuesTitle">Quote-review and floorplan work</h2>
          <p>Read-only internal queues for review-heavy leads. Actions happen through lead detail, status and follow-up controls.</p>
        </div>
      </div>
      <div className="admin-review-queue-grid">
        <QueuePanel
          adminToken={adminToken}
          title="Quote-review queue"
          source="quote_review"
          statusField="quote_review_status"
          emptyText="No quote-review leads matched the queue filter."
        />
        <QueuePanel
          adminToken={adminToken}
          title="Floorplan queue"
          source="floorplan"
          statusField="floorplan_status"
          emptyText="No floorplan leads matched the queue filter."
        />
      </div>
      <div className="admin-auth-status admin-auth-status-authenticated">
        <strong>Floorplan measurement console</strong>
        <span>Open the protected internal console when a lead needs room geometry, reviewer draft, approval or Quote OS area linking.</span>
        <a className="admin-table-action" href="/internal/floorplan-measurements.html">Open measurement console</a>
      </div>
    </section>
  );
}
