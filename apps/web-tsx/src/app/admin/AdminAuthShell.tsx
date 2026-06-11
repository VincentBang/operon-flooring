"use client";

import { FormEvent, useState } from "react";
import { AdminChatbotLeads } from "./AdminChatbotLeads";
import { AdminFollowUpQueue } from "./AdminFollowUpQueue";
import { AdminLeadList } from "./AdminLeadList";
import { AdminReportingSummary } from "./AdminReportingSummary";
import { AdminReviewQueues } from "./AdminReviewQueues";

type AuthState = "idle" | "checking" | "authenticated" | "denied" | "unconfigured" | "error";

type SessionResponse = {
  ok?: boolean;
  authenticated?: boolean;
  role?: string;
  access?: string;
  error?: string;
};

function getStatusCopy(status: AuthState, message: string) {
  if (status === "authenticated") {
    return "Admin shell unlocked. Lead data remains disconnected until the next approved dashboard slice.";
  }
  if (status === "checking") {
    return "Checking admin access...";
  }
  if (status === "unconfigured") {
    return message || "Admin access is not configured in this environment.";
  }
  if (status === "denied") {
    return message || "Admin access denied.";
  }
  if (status === "error") {
    return message || "Admin access could not be checked.";
  }
  return "Enter the approved admin token to verify the protected shell.";
}

export function AdminAuthShell() {
  const [token, setToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [status, setStatus] = useState<AuthState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setStatus("denied");
      setMessage("Admin authentication required.");
      return;
    }

    setStatus("checking");
    setMessage("");

    try {
      const response = await fetch("/.netlify/functions/admin-session-status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${trimmed}`
        },
        cache: "no-store"
      });
      const payload = (await response.json().catch(() => null)) as SessionResponse | null;
      if (response.ok && payload?.authenticated) {
        setStatus("authenticated");
        setMessage("");
        setVerifiedToken(trimmed);
        setToken("");
        return;
      }
      if (response.status === 503) {
        setStatus("unconfigured");
      } else if (response.status === 401 || response.status === 403) {
        setStatus("denied");
      } else {
        setStatus("error");
      }
      setMessage(payload?.error || "");
    } catch {
      setStatus("error");
      setMessage("Admin access could not be checked.");
    }
  }

  const authenticated = status === "authenticated";

  return (
    <div className="admin-auth-shell" aria-live="polite">
      <form className="admin-auth-form" onSubmit={handleSubmit}>
        <label htmlFor="adminAccessToken">Admin access token</label>
        <div className="admin-auth-row">
          <input
            id="adminAccessToken"
            name="adminAccessToken"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            disabled={status === "checking" || authenticated}
          />
          <button className="button button-primary" type="submit" disabled={status === "checking" || authenticated}>
            {status === "checking" ? "Checking" : authenticated ? "Verified" : "Verify"}
          </button>
        </div>
      </form>

      <div className={`admin-auth-status admin-auth-status-${status}`}>
        <strong>{authenticated ? "Verified admin shell" : "Locked admin shell"}</strong>
        <span>{getStatusCopy(status, message)}</span>
      </div>

      {!authenticated ? (
        <div className="admin-auth-preview" aria-label="Future dashboard modules">
          <div>
            <strong>Lead list</strong>
            <span>Verify access first</span>
          </div>
          <div>
            <strong>Lead detail</strong>
            <span>Not connected yet</span>
          </div>
          <div>
            <strong>Status pipeline</strong>
            <span>Not connected yet</span>
          </div>
        </div>
      ) : null}

      {authenticated && verifiedToken ? (
        <div>
          <AdminChatbotLeads adminToken={verifiedToken} />
          <AdminLeadList adminToken={verifiedToken} />
          <AdminFollowUpQueue adminToken={verifiedToken} />
          <AdminReviewQueues adminToken={verifiedToken} />
          <AdminReportingSummary adminToken={verifiedToken} />
          <button
            className="button button-secondary admin-lock-button"
            type="button"
            onClick={() => {
              setVerifiedToken("");
              setStatus("idle");
              setMessage("");
            }}
          >
            Lock admin shell
          </button>
        </div>
      ) : null}
    </div>
  );
}
