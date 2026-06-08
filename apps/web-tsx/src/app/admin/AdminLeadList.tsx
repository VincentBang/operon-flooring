"use client";

import { useEffect, useState } from "react";
import { AdminLeadDetail } from "./AdminLeadDetail";

type LeadListRow = {
  id: string;
  created_at?: string;
  last_activity_at?: string;
  primary_source?: string;
  source_detail?: string;
  status?: string;
  priority?: string;
  customer_name?: string;
  suburb?: string;
  postcode?: string;
  product_category?: string;
  area_m2?: number;
  estimate_total_inc_gst?: number;
  confidence_level?: string;
  missing_info_count?: number;
  risk_flag_count?: number;
  quote_review_status?: string;
  floorplan_status?: string;
  contact_status?: string;
  follow_up_status?: string;
  next_action?: string;
};

type LeadListResponse = {
  ok?: boolean;
  leads?: LeadListRow[];
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

export function AdminLeadList({ adminToken }: { adminToken: string }) {
  const [leads, setLeads] = useState<LeadListRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");

  async function loadLeads() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/lead-dashboard?action=list&limit=50", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => null)) as LeadListResponse | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(payload?.error || "Lead list could not be loaded.");
        return;
      }
      setLeads(Array.isArray(payload.leads) ? payload.leads : []);
      setStatus("ready");
    } catch {
      setStatus("error");
      setMessage("Lead list could not be loaded.");
    }
  }

  useEffect(() => {
    loadLeads();
  }, [adminToken]);

  return (
    <section className="admin-lead-list" aria-labelledby="adminLeadListTitle">
      <div className="admin-lead-list-head">
        <div>
          <span className="eyebrow">Lead list</span>
          <h2 id="adminLeadListTitle">Latest website leads</h2>
          <p>Quote, contact, quote-review, floorplan, product handoff and operator leads from the unified parent model.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={loadLeads} disabled={status === "loading"}>
          {status === "loading" ? "Loading" : "Refresh"}
        </button>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>Lead list unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {status === "ready" && leads.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No leads returned</strong>
          <span>The dashboard function responded successfully, but no rows matched the current list query.</span>
        </div>
      ) : null}

      {selectedLeadId ? (
        <AdminLeadDetail adminToken={adminToken} leadId={selectedLeadId} onClose={() => setSelectedLeadId("")} />
      ) : null}

      {leads.length > 0 ? (
        <div className="admin-lead-table-wrap">
          <table className="admin-lead-table">
            <thead>
              <tr>
                <th scope="col">Updated</th>
                <th scope="col">Source</th>
                <th scope="col">Customer</th>
                <th scope="col">Suburb</th>
                <th scope="col">Product</th>
                <th scope="col">Estimate</th>
                <th scope="col">Status</th>
                <th scope="col">Next action</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{formatDate(lead.last_activity_at || lead.created_at)}</td>
                  <td>
                    <strong>{humanize(lead.primary_source)}</strong>
                    <span>{humanize(lead.source_detail)}</span>
                  </td>
                  <td>{lead.customer_name || "Name not supplied"}</td>
                  <td>{[lead.suburb, lead.postcode].filter(Boolean).join(" ") || "Not recorded"}</td>
                  <td>{humanize(lead.product_category)}</td>
                  <td>{formatMoney(lead.estimate_total_inc_gst)}</td>
                  <td>
                    <strong>{humanize(lead.status)}</strong>
                    <span>{humanize(lead.priority)}</span>
                  </td>
                  <td>{lead.next_action || "Review lead"}</td>
                  <td>
                    <button className="admin-table-action" type="button" onClick={() => setSelectedLeadId(lead.id)}>
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
