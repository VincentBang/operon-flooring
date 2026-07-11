import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { createPageMetadata } from "@/lib/metadata";
import { legacySeoPages } from "@/lib/legacySeoPages";
import { routes } from "@/lib/routes";

const page = legacySeoPages["apartment-flooring-sydney"];

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
            <span className="eyebrow">Apartment planning</span>
            <h2 style={{ marginTop: 18 }}>Confirm the building process before choosing the installation date</h2>
            <p>
              Apartment projects can involve lift bookings, loading access, working-hour limits and written building requirements. Ask the building
              manager or strata contact what applies to the property, then include those details in the flooring quote rather than assuming one rule
              applies to every building.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              <div className="link-card"><strong>Access and delivery</strong><span>Confirm lift access, loading arrangements and permitted working times before booking.</span></div>
              <div className="link-card"><strong>Existing floor removal</strong><span>Check how removed flooring and packaging can leave the building, including disposal and common-area protection.</span></div>
              <div className="link-card"><strong>Acoustic questions</strong><span>Ask for the building&apos;s current requirements and confirm that the proposed flooring system can be reviewed against them.</span></div>
              <div className="link-card"><strong>Occupied apartments</strong><span>Record furniture, room access and neighbour-sensitive work so the written scope is realistic.</span></div>
            </div>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Apartment quote path</span>
            <h2 style={{ marginTop: 18 }}>Carry product, area and building notes into one clear scope</h2>
            <p>
              Start with the details you know now. A floor plan can create a starting area, while a written quote review can identify missing removal,
              preparation, underlay, trims or access details before you compare totals.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              <a className="link-card" href={routes.products}><strong>Compare flooring products</strong><span>Shortlist hybrid, laminate or engineered timber for the rooms being updated.</span></a>
              <a className="link-card" href={routes.floorplan}><strong>Measure from a floor plan</strong><span>Trace only the apartment rooms receiving new flooring.</span></a>
              <a className="link-card" href={routes.quoteReview}><strong>Review a written quote</strong><span>Check whether product, acoustic, removal and finishing details are visible.</span></a>
              <a className="link-card" href={routes.quote}><strong>Start an apartment flooring estimate</strong><span>Add area and known scope now, then leave uncertain details for review.</span></a>
            </div>
          </article>
        </div>
      </section>
    </LegacySeoPageView>
  );
}
