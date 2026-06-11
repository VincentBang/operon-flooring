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
  metadata?: {
    task_type?: string;
    reason?: string;
    priority?: string;
    suggested_message?: string;
    source?: string;
    dry_run_only?: boolean;
  };
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

function taskTitle(item: FollowUpItem) {
  if (item.metadata?.task_type) return humanize(item.metadata.task_type);
  if (item.lead?.customer_name) return item.lead.customer_name;
  return "Lead follow-up";
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
  const [generating, setGenerating] = useState(false);

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

  async function runAction(item: FollowUpItem, action: "mark_done" | "archive" | "snooze") {
    if (action === "archive" && !window.confirm("Archive this dry-run follow-up?")) {
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

  async function generateDryRunTasks() {
    setGenerating(true);
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
          action: "generate_dry_run"
        })
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; created?: number; skipped?: number; error?: string } | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(payload?.error || "Dry-run follow-up generation failed.");
        return;
      }
      setMessage(`Dry-run queue refreshed: ${payload.created || 0} created, ${payload.skipped || 0} skipped.`);
      await loadFollowUps();
    } catch {
      setStatus("error");
      setMessage("Dry-run follow-up generation failed.");
    } finally {
      setGenerating(false);
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
          <h2 id="adminFollowupTitle">Dry-run follow-ups</h2>
          <p>Internal operator queue only. No email or SMS is sent from this view.</p>
        </div>
        <div className="admin-followup-toolbar">
          <button className="button button-secondary" type="button" onClick={generateDryRunTasks} disabled={generating}>
            {generating ? "Generating" : "Generate dry-run tasks"}
          </button>
          <button className="button button-secondary" type="button" onClick={loadFollowUps} disabled={status === "loading"}>
            {status === "loading" ? "Loading" : "Refresh"}
          </button>
        </div>
      </div>

      {status === "error" ? (
        <div className="admin-auth-status admin-auth-status-denied">
          <strong>Follow-up queue unavailable</strong>
          <span>{message}</span>
        </div>
      ) : null}

      {message && status !== "error" ? (
        <div className="admin-auth-status admin-auth-status-idle">
          <strong>Queue update</strong>
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
                <strong>{taskTitle(item)}</strong>
                <span>{formatDate(item.due_at)} · {humanize(item.channel)} · {humanize(item.metadata?.priority || item.lead?.priority)}</span>
              </div>
              <p>{item.next_action || item.lead?.next_action || "Review lead"}</p>
              {item.metadata?.reason ? <p><strong>Reason:</strong> {item.metadata.reason}</p> : null}
              {item.metadata?.suggested_message ? (
                <blockquote className="admin-followup-suggestion">
                  <strong>Internal suggested message</strong>
                  <span>{item.metadata.suggested_message}</span>
                </blockquote>
              ) : null}
              <div className="admin-followup-meta">
                <span>{humanize(item.status)}</span>
                <span>{humanize(item.lead?.primary_source)}</span>
                <span>{item.lead?.suburb || "Suburb not recorded"}</span>
                <span>{humanize(item.lead?.product_category)}</span>
                {item.metadata?.dry_run_only ? <span>Dry-run only</span> : null}
              </div>
              <div className="admin-followup-actions">
                <button type="button" onClick={() => runAction(item, "mark_done")} disabled={savingId === item.id}>Done</button>
                <button type="button" onClick={() => runAction(item, "snooze")} disabled={savingId === item.id}>Snooze 2d</button>
                <button type="button" onClick={() => runAction(item, "archive")} disabled={savingId === item.id}>Archive</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
