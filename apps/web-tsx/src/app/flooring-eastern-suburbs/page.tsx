import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { createPageMetadata } from "@/lib/metadata";
import { legacyAdditionalPages } from "@/lib/legacyAdditionalPages";
import { routes } from "@/lib/routes";

const page = legacyAdditionalPages["flooring-eastern-suburbs"];

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
            <span className="eyebrow">Eastern Suburbs quote paths</span>
            <h2 style={{ marginTop: 18 }}>Choose the next step before comparing totals</h2>
            <p>
              Eastern Suburbs flooring projects often need product, apartment access, acoustic, preparation and finishing details checked before
              a written quote is ready to compare.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              <a className="link-card" href={routes.products}>
                <strong>Browse product ranges</strong>
                <span>Compare hybrid, laminate and engineered timber before choosing a quote path.</span>
              </a>
              <a className="link-card" href={routes.quote}>
                <strong>Start a structured quote</strong>
                <span>Add product, area, access, removal, stairs and finishing details in one flow.</span>
              </a>
              <a className="link-card" href={routes.quoteReview}>
                <strong>Review another quote</strong>
                <span>Check whether product, area, exclusions and apartment assumptions are written clearly.</span>
              </a>
              <a className="link-card" href={routes.floorplan}>
                <strong>Measure from a floor plan</strong>
                <span>Trace apartment or renovation areas when manual measurement is not convenient.</span>
              </a>
            </div>
          </article>
        </div>
      </section>
    </LegacySeoPageView>
  );
}
