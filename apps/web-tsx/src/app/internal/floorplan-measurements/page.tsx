import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { FloorplanMeasurementsConsole } from "./FloorplanMeasurementsConsole";

export const metadata: Metadata = createPageMetadata({
  title: "Floorplan Measurement Review | Operon Flooring",
  description: "Protected internal floorplan measurement review console.",
  path: "/internal/floorplan-measurements.html",
  robots: "noindex,nofollow"
});

export default function InternalFloorplanMeasurementsPage() {
  return (
    <Layout>
      <section className="hero">
        <div className="shell">
          <article className="hero-card">
            <span className="eyebrow">Internal review</span>
            <h1>Floorplan measurements</h1>
            <p>
              Protected review queue for customer-submitted floorplan measurements.
            </p>
            <p className="hero-trust">
              No customer files, storage paths or pricing data are rendered before admin access is verified.
            </p>
            <FloorplanMeasurementsConsole />
          </article>
        </div>
      </section>
    </Layout>
  );
}
