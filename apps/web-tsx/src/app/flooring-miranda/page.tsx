import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { createPageMetadata } from "@/lib/metadata";
import { legacySeoPages } from "@/lib/legacySeoPages";
import { routes } from "@/lib/routes";

const page = legacySeoPages["flooring-miranda"];

export const metadata: Metadata = createPageMetadata({
  title: "Flooring Miranda | Laminate, Hybrid & Timber Quote Help",
  description:
    "Plan a Miranda flooring quote for laminate, hybrid or timber-look flooring with product, area, removal, stairs, trims and floorplan details clear.",
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
            <span className="eyebrow">Miranda flooring choices</span>
            <h2>Laminate, hybrid and timber flooring in Miranda</h2>
            <p>
              Search Console is already testing this page for Miranda flooring queries, so the most useful next step is making the product paths clearer.
              A Miranda quote should separate the flooring category from the room area, removal, disposal, floor preparation, trims and any stair or access notes.
            </p>
            <div className="link-grid">
              <a className="link-card" href={routes.laminate}>
                <strong>Laminate flooring Miranda</strong>
                <span>Best for dry internal rooms, rental refreshes and budget-conscious timber-look updates.</span>
              </a>
              <a className="link-card" href={routes.hybrid}>
                <strong>Hybrid flooring Miranda</strong>
                <span>Useful for practical family areas where durability and easier care matter.</span>
              </a>
              <a className="link-card" href={routes.engineered}>
                <strong>Timber and engineered timber</strong>
                <span>Better for finish-led spaces where product range, installation method and trims need clearer review.</span>
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Quote clarity</span>
            <h2>What to check before comparing Miranda quotes</h2>
            <p>
              Before comparing totals, check whether the written quote names the product category or range, measured area, existing floor type, removal,
              disposal, underlay, trims and any floor preparation assumptions. This prevents a cheaper-looking quote from simply leaving work unclear.
            </p>
            <a className="button button-secondary" href={routes.quoteReview} data-track-cta="miranda_quote_review_click">
              Review an existing quote
            </a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Area support</span>
            <h2>Use a floor plan if room sizes are unclear</h2>
            <p>
              If you have a floor plan for a Miranda home, apartment or townhouse, use it to create a clearer starting area before final review.
            </p>
            <a className="button button-primary" href={`${routes.quote}?from=seo_miranda#quoteForm`} data-track-cta="miranda_quote_click">
              Start Miranda flooring quote
            </a>
          </article>
        </div>
      </section>
    </LegacySeoPageView>
  );
}
