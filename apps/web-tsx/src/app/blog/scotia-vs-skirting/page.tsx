import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { legacyBlogPages } from "@/lib/legacyBlogPages";
import { routes } from "@/lib/routes";

const page = legacyBlogPages["scotia-vs-skirting"];

export const metadata: Metadata = createPageMetadata({
  title: "Scotia vs Skirting | Flooring Finish & Quote Scope",
  description: "Compare scotia, skirting, trims and wall-edge finishes for flooring quotes, including what to check before accepting a Sydney flooring quote.",
  path: page.canonicalPath,
  image: page.image,
  robots: page.robots
});

export default function BlogGuidePage() {
  return (
    <Layout>
      {page.jsonLd ? <JsonLd data={page.jsonLd} /> : null}
      <div className="legacy-seo-content" dangerouslySetInnerHTML={{ __html: page.html }} />
      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Finish details and quote scope</span>
            <h2 style={{ marginTop: 18 }}>Confirm wall-edge finishing before accepting the quote</h2>
            <p>
              Scotia, skirting, trims, transitions and door clearance can change how complete a flooring quote really is. Ask for the finishing
              method in writing before comparing totals.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              <a className="link-card" href={routes.quoteReview}>
                <strong>Review a written quote</strong>
                <span>Check whether trims, scotia, skirting and exclusions are clearly listed.</span>
              </a>
              <a className="link-card" href={routes.quote}>
                <strong>Start a structured quote</strong>
                <span>Add product, area, stairs and finishing notes in the quote flow.</span>
              </a>
              <a className="link-card" href="/blog/flooring-stairs-and-stair-nosing.html">
                <strong>Stairs and stair nosing</strong>
                <span>Review another common finishing detail before booking.</span>
              </a>
              <a className="link-card" href={routes.recentProjects}>
                <strong>View finished projects</strong>
                <span>Use real project photos to check finishing expectations.</span>
              </a>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
