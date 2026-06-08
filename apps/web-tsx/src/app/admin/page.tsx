import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { AdminAuthShell } from "./AdminAuthShell";

export const metadata: Metadata = createPageMetadata({
  title: "Operon OS Admin | Operon Flooring",
  description: "Protected Operon Flooring internal dashboard shell.",
  path: "/admin.html",
  robots: "noindex,nofollow"
});

export default function AdminShellPage() {
  return (
    <Layout>
      <section className="hero">
        <div className="shell">
          <article className="hero-card">
            <span className="eyebrow">Operon OS</span>
            <h1>Admin access required</h1>
            <p>
              This internal dashboard shell is locked until protected admin authentication is connected.
            </p>
            <p className="hero-trust">
              No lead data is rendered here. Public quote, product, floorplan and quote-review flows are unchanged.
            </p>
            <AdminAuthShell />
            <div className="hero-actions">
              <a className="button button-secondary" href="/">Return to website</a>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
