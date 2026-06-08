"use client";

import { useEffect, useState } from "react";

type Summary = {
  total?: number;
  by_status?: Record<string, number>;
  by_source?: Record<string, number>;
  by_product_category?: Record<string, number>;
  by_suburb?: Record<string, number>;
  quote_review_count?: number;
  floorplan_count?: number;
  open_high_priority_count?: number;
};

type SummaryResponse = {
  ok?: boolean;
  summary?: Summary;
  error?: string;
};

function humanize(value: string) {
  return String(value || "not recorded").replace(/[_-]/g, " ");
}

function TopList({ title, values }: { title: string; values?: Record<string, number> }) {
  const rows = Object.entries(values || {})
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6);
  return (
    <div className="admin-report-card">
      <strong>{title}</strong>
      {rows.length ? (
        <ul>
          {rows.map(([label, count]) => (
            <li key={label}>
              <span>{humanize(label)}</span>
              <b>{count}</b>
            </li>
          ))}
        </ul>
      ) : (
        <span>No rows returned</span>
      )}
    </div>
  );
}

export function AdminReportingSummary({ adminToken }: { adminToken: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  async function loadSummary() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/lead-dashboard?action=summary", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => null)) as SummaryResponse | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(payload?.error || "Reporting summary could not be loaded.");
        return;
      }
      setSummary(payload.summary || null);
      setStatus("ready");
    } catch {
      setStatus("error");
      setMessage("Reporting summary could not be loaded.");
    }
  }

  useEffect(() => {
    loadSummary();
  }, [adminToken]);

  return (
    <section className="admin-reporting-summary" aria-labelledby="adminReportingTitle">
      <div className="admin-lead-list-head">
        <div>
          <span className="eyebrow">Reporting</span>
          <h2 id="adminReportingTitle">Lead operating snapshot</h2>
          <p>Aggregate dashboard only. Detail drilldown remains protected by the lead detail panel.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={loadSummary} disabled={status === "loading"}>
          {status === "loading" ? "Loading" : "Refresh"}
        </button>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>Reporting unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {status === "ready" ? (
        <>
          <div className="admin-report-metrics">
            <div><strong>{summary?.total || 0}</strong><span>Total leads</span></div>
            <div><strong>{summary?.quote_review_count || 0}</strong><span>Quote reviews</span></div>
            <div><strong>{summary?.floorplan_count || 0}</strong><span>Floorplans</span></div>
            <div><strong>{summary?.open_high_priority_count || 0}</strong><span>High priority</span></div>
          </div>
          <div className="admin-report-grid">
            <TopList title="By status" values={summary?.by_status} />
            <TopList title="By source" values={summary?.by_source} />
            <TopList title="By product" values={summary?.by_product_category} />
            <TopList title="By suburb" values={summary?.by_suburb} />
          </div>
        </>
      ) : null}
    </section>
  );
}
