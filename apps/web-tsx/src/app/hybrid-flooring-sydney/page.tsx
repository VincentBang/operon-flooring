import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { createPageMetadata } from "@/lib/metadata";
import { legacySeoPages } from "@/lib/legacySeoPages";
import { ProductAuthoritySection } from "@/lib/productSeoGuides";
import { routes } from "@/lib/routes";

const page = legacySeoPages["hybrid-flooring-sydney"];

export const metadata: Metadata = createPageMetadata({
  title: "Hybrid Flooring Sydney | Practical Ranges & Quote Scope",
  description:
    "Compare hybrid flooring for Sydney homes, apartments and rentals. Start a quote with product, area, removal, trims, floorplan and inclusions reviewed.",
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
            <span className="eyebrow">Hybrid flooring uses</span>
            <h2>Where hybrid flooring fits Sydney projects</h2>
            <p>
              Hybrid flooring is often considered for busy family homes, apartment refreshes, rental properties and practical timber-look renovations.
              The category can be useful where durability and easier maintenance matter, but the written quote should still make area, removal, trims,
              underlay and floor preparation clear.
            </p>
            <div className="link-grid">
              <a className="link-card" href={routes.products}>
                <strong>Browse hybrid products</strong>
                <span>Shortlist a range before starting the structured quote flow.</span>
              </a>
              <a className="link-card" href="/blog/laminate-vs-hybrid.html">
                <strong>Hybrid vs laminate</strong>
                <span>Compare everyday durability, wet-area caution and quote inclusions.</span>
              </a>
              <a className="link-card" href={routes.floorplan}>
                <strong>Need a better area?</strong>
                <span>Upload a floor plan to create a clearer starting measurement.</span>
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Quote implications</span>
            <h2>Hybrid flooring quotes should not rely on product name alone</h2>
            <p>
              A useful hybrid quote should state the product direction, measured area, existing flooring, removal and disposal, trims, door clearance,
              floor preparation assumptions and anything still subject to final site review.
            </p>
            <a className="button button-secondary" href={routes.quoteReview} data-track-cta="hybrid_quote_review_click">
              Check an existing hybrid quote
            </a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Sydney homes</span>
            <h2>Common hybrid flooring situations</h2>
            <div className="link-grid">
              <a className="link-card" href={routes.edmondsonPark}><strong>Newer family homes</strong><span>Open-plan layouts, stairs and scotia/skirting choices.</span></a>
              <a className="link-card" href={routes.parramatta}><strong>Apartments</strong><span>Acoustic, access and building details need early review.</span></a>
              <a className="link-card" href={routes.liverpool}><strong>Rental refreshes</strong><span>Removal, disposal and practical range choice should be clear.</span></a>
            </div>
          </article>
        </div>
      </section>
      <ProductAuthoritySection category="hybrid" />
    </LegacySeoPageView>
  );
}
