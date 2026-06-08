"use client";

import { useEffect, useState } from "react";

type FollowUpLead = {
  id?: string;
  customer_name?: string;
  primary_source?: string;
  status?: string;
  priority?: string;
  suburb?: string;
  product_category?: string;
  last_activity_at?: string;
  next_action?: string;
};

type FollowUpItem = {
  id: string;
  lead_id: string;
  due_at?: string;
  status?: string;
  channel?: string;
  next_action?: string;
  assigned_to?: string;
  updated_at?: string;
  lead?: FollowUpLead | null;
};

type FollowUpResponse = {
  ok?: boolean;
  follow_ups?: FollowUpItem[];
  error?: string;
};

function formatDate(value?: string) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
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

function getSnoozeDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
}

export function AdminFollowUpQueue({ adminToken }: { adminToken: string }) {
  const [items, setItems] = useState<FollowUpItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState("");

  async function loadFollowUps() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/lead-followup-admin?status=open&limit=50", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => null)) as FollowUpResponse | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(payload?.error || "Follow-up queue could not be loaded.");
        return;
      }
      setItems(Array.isArray(payload.follow_ups) ? payload.follow_ups : []);
      setStatus("ready");
    } catch {
      setStatus("error");
      setMessage("Follow-up queue could not be loaded.");
    }
  }

  async function runAction(item: FollowUpItem, action: "mark_done" | "cancel" | "snooze") {
    if (action === "cancel" && !window.confirm("Cancel this follow-up?")) {
      return;
    }
    setSavingId(item.id);
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/lead-followup-admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        },
        cache: "no-store",
        body: JSON.stringify({
          action,
          follow_up_id: item.id,
          lead_id: item.lead_id,
          due_at: action === "snooze" ? getSnoozeDate() : undefined
        })
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(payload?.error || "Follow-up action failed.");
        return;
      }
      await loadFollowUps();
    } catch {
      setStatus("error");
      setMessage("Follow-up action failed.");
    } finally {
      setSavingId("");
    }
  }

  useEffect(() => {
    loadFollowUps();
  }, [adminToken]);

  return (
    <section className="admin-followup-queue" aria-labelledby="adminFollowupTitle">
      <div className="admin-lead-list-head">
        <div>
          <span className="eyebrow">Follow-up queue</span>
          <h2 id="adminFollowupTitle">Manual follow-ups</h2>
          <p>Dry-run operator queue only. No email or SMS is sent from this view.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={loadFollowUps} disabled={status === "loading"}>
          {status === "loading" ? "Loading" : "Refresh"}
        </button>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>Follow-up queue unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {status === "ready" && items.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No open follow-ups</strong>
          <span>The protected queue returned no open manual follow-ups.</span>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="admin-followup-list">
          {items.map((item) => (
            <article className="admin-followup-item" key={item.id}>
              <div>
                <strong>{item.lead?.customer_name || "Lead follow-up"}</strong>
                <span>{formatDate(item.due_at)} · {humanize(item.channel)} · {humanize(item.lead?.priority)}</span>
              </div>
              <p>{item.next_action || item.lead?.next_action || "Review lead"}</p>
              <div className="admin-followup-meta">
                <span>{humanize(item.lead?.primary_source)}</span>
                <span>{item.lead?.suburb || "Suburb not recorded"}</span>
                <span>{humanize(item.lead?.product_category)}</span>
              </div>
              <div className="admin-followup-actions">
                <button type="button" onClick={() => runAction(item, "mark_done")} disabled={savingId === item.id}>Done</button>
                <button type="button" onClick={() => runAction(item, "snooze")} disabled={savingId === item.id}>Snooze 2d</button>
                <button type="button" onClick={() => runAction(item, "cancel")} disabled={savingId === item.id}>Cancel</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
