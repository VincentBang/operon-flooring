import type { Metadata } from "next";
import { LegacySeoPageView } from "@/components/seo/LegacySeoPageView";
import { createPageMetadata } from "@/lib/metadata";
import { legacySeoPages } from "@/lib/legacySeoPages";
import { ProductAuthoritySection } from "@/lib/productSeoGuides";
import { routes } from "@/lib/routes";

const page = legacySeoPages["engineered-timber-flooring-sydney"];

export const metadata: Metadata = createPageMetadata({
  title: "Engineered Timber Flooring Sydney | Quote Scope & Projects",
  description:
    "Compare engineered timber flooring for Sydney homes, apartments, stairs and feature rooms. Start a quote with product, area, method and inclusions reviewed.",
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
            <span className="eyebrow">Engineered timber quote depth</span>
            <h2>Premium timber quotes need more than a square-metre total</h2>
            <p>
              Engineered timber flooring is often chosen for premium Sydney homes, feature living spaces, apartment upgrades and stair details.
              A useful quote should make the product range, colour direction, installation method, measured area, trims, stairs and preparation assumptions clear before a customer compares totals.
            </p>
            <div className="link-grid">
              <a className="link-card" href={routes.products}>
                <strong>Browse engineered timber ranges</strong>
                <span>Compare product directions before starting a quote.</span>
              </a>
              <a className="link-card" href={routes.recentProjects}>
                <strong>View recent timber projects</strong>
                <span>Use real project photos to understand finish, pattern and stair scope.</span>
              </a>
              <a className="link-card" href={routes.quoteReview}>
                <strong>Review an engineered timber quote</strong>
                <span>Check whether product, area, method, trims and exclusions are clear.</span>
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Installation method</span>
            <h2>Direct-stick, floating, patterned and stair work should be named</h2>
            <p>
              Engineered timber quotes can differ because the written scope may allow for different installation methods, stair details, herringbone or chevron patterns,
              floor preparation and transition finishes. Those details should be written plainly before booking.
            </p>
            <a className="button button-primary" href={`${routes.quote}?from=seo_engineered&category=engineered#quoteForm`} data-track-cta="engineered_quote_click">
              Start engineered timber quote
            </a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Related quote guides</span>
            <h2>Check the scope before comparing</h2>
            <div className="link-grid">
              <a className="link-card" href="/blog/flooring-stairs-and-stair-nosing.html"><strong>Stairs and stair nosing</strong><span>Understand why stairs need clear scope notes.</span></a>
              <a className="link-card" href="/blog/scotia-vs-skirting.html"><strong>Scotia vs skirting</strong><span>Compare finishing options before accepting a quote.</span></a>
              <a className="link-card" href="/blog/why-flooring-quotes-vary.html"><strong>Why quotes vary</strong><span>See why two timber quotes can include different work.</span></a>
            </div>
          </article>
        </div>
      </section>
      <ProductAuthoritySection category="engineered" />
    </LegacySeoPageView>
  );
}
