import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { createPageMetadata } from "@/lib/metadata";
import { legacySeoPages } from "@/lib/legacySeoPages";
import { routes } from "@/lib/routes";

const page = legacySeoPages["flooring-installation-cost-sydney"];
const title = "Flooring Installation Cost Sydney | Quote Scope Guide";
const description =
  "Understand what affects flooring installation cost in Sydney: product type, measured area, removal, disposal, underlay, stairs, trims and floor preparation.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
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
            <span className="eyebrow">Sydney quote drivers</span>
            <h2 style={{ marginTop: 18 }}>What changes a flooring installation quote?</h2>
            <p>
              Flooring installation cost in Sydney is easier to understand when the quote separates product choice, measured area, removal,
              disposal, floor preparation, underlay, stairs, trims and final site confirmation. The goal is not to guess a final price from one
              number, but to make the scope clear enough to compare.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              <a className="link-card" href={routes.hybrid}>
                <strong>Hybrid flooring scope</strong>
                <span>See where hybrid can suit homes, apartments and practical renovation projects.</span>
              </a>
              <a className="link-card" href={routes.laminate}>
                <strong>Laminate flooring scope</strong>
                <span>Review dry-area use cases, underlay and quote clarity considerations.</span>
              </a>
              <a className="link-card" href={routes.engineered}>
                <strong>Engineered timber scope</strong>
                <span>Compare installation method, trims and preparation questions before reviewing totals.</span>
              </a>
              <a className="link-card" href={routes.flooringQuoteSydney}>
                <strong>Flooring quote Sydney guide</strong>
                <span>Use the quote guide to understand inclusions before comparing written estimates.</span>
              </a>
            </div>
          </article>
        </div>
      </section>

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
              <a className="link-card" href={routes.quote}>
                <strong>Start a structured quote</strong>
                <span>Add the details you know now and leave uncertain items for review.</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Cost guide FAQs</span>
            <h2 style={{ marginTop: 18 }}>Flooring installation cost questions</h2>
            <div className="faq" style={{ marginTop: 22 }}>
              <details open>
                <summary>Why do Sydney flooring installation quotes vary?</summary>
                <p>
                  Quotes can vary because the product category, area basis, existing floor removal, disposal, preparation, underlay, stairs and
                  trims may be included differently.
                </p>
              </details>
              <details>
                <summary>Should I compare quotes by square metre only?</summary>
                <p>
                  No. A square-metre figure is only useful when the product, preparation, removal, disposal, stairs, trims and exclusions are also
                  clear.
                </p>
              </details>
              <details>
                <summary>What should I prepare before asking for a flooring quote?</summary>
                <p>
                  Start with product direction, approximate area, property type, photos or a floor plan, old flooring type, stairs and any access
                  notes. Anything uncertain can be reviewed later.
                </p>
              </details>
            </div>
          </article>
        </div>
      </section>
    </LegacySeoPageView>
  );
}
