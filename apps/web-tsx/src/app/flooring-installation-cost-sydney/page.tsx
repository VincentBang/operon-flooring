import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { createPageMetadata } from "@/lib/metadata";
import { legacySeoPages } from "@/lib/legacySeoPages";
import { routes } from "@/lib/routes";

const page = legacySeoPages["flooring-installation-cost-sydney"];

export const metadata: Metadata = createPageMetadata({
  title: page.title,
  description: page.description,
  path: page.canonicalPath,
  image: page.image,
  robots: page.robots
});

export default function Page() {
  return (
    <LegacySeoPageView page={page}>
      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Cost clarity next steps</span>
            <h2 style={{ marginTop: 18 }}>Make the scope clear before judging installation cost</h2>
            <p>
              Installation cost is easier to compare when the product category, measured area, removal, disposal, underlay, stairs, trims and
              preparation assumptions are written down first.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              <a className="link-card" href={routes.products}>
                <strong>Compare product categories</strong>
                <span>Shortlist hybrid, laminate or engineered timber before comparing quote scope.</span>
              </a>
              <a className="link-card" href={routes.floorplan}>
                <strong>Use a floor plan for area</strong>
                <span>Trace rooms from a plan when the measured area is unclear.</span>
              </a>
              <a className="link-card" href={routes.quoteReview}>
                <strong>Check an existing quote</strong>
                <span>Review whether inclusions, exclusions and preparation assumptions are visible.</span>
              </a>
              <a className="link-card" href={routes.recentProjects}>
                <strong>View project proof</strong>
                <span>See how preparation, stairs and finished product choice affect scope.</span>
              </a>
            </div>
          </article>
        </div>
      </section>
    </LegacySeoPageView>
  );
}
