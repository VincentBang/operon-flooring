import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { legacyBlogPages } from "@/lib/legacyBlogPages";

const page = legacyBlogPages.index;
const quoteReviewCluster = [
  {
    href: "/blog/flooring-quote-review-sydney.html",
    title: "Flooring quote review Sydney",
    body: "Check whether a written flooring quote is ready to compare."
  },
  {
    href: "/blog/flooring-quote-checklist.html",
    title: "Flooring quote checklist",
    body: "Use a practical checklist for product, area, inclusions and exclusions."
  },
  {
    href: "/blog/how-to-compare-flooring-quotes.html",
    title: "How to compare flooring quotes",
    body: "Compare scope before comparing the headline total."
  },
  {
    href: "/blog/what-should-be-included-in-flooring-quote.html",
    title: "What should be included in a flooring quote?",
    body: "Know the items that should be visible before you accept."
  },
  {
    href: "/blog/common-flooring-quote-exclusions.html",
    title: "Common flooring quote exclusions",
    body: "Find the items commonly left out or marked for review."
  },
  {
    href: "/blog/questions-to-ask-before-accepting-flooring-quote.html",
    title: "Questions to ask before accepting",
    body: "Send better questions back before deciding."
  },
  {
    href: "/flooring-installation-cost-sydney.html",
    title: "Flooring installation cost Sydney",
    body: "Check the scope items that make installation quotes easier to compare."
  }
];
const productCluster = [
  {
    href: "/hybrid-flooring-sydney.html",
    title: "Hybrid flooring Sydney",
    body: "Practical category guide for busy homes, apartments and rentals."
  },
  {
    href: "/laminate-flooring-sydney.html",
    title: "Laminate flooring Sydney",
    body: "Value-focused timber-look flooring for dry internal spaces."
  },
  {
    href: "/engineered-timber-flooring-sydney.html",
    title: "Engineered timber flooring Sydney",
    body: "Premium timber character, finish expectations and quote scope."
  },
  {
    href: "/blog/laminate-vs-hybrid.html",
    title: "Hybrid vs laminate flooring",
    body: "Compare practical tradeoffs before choosing a product path."
  }
];

export const metadata: Metadata = createPageMetadata({
  title: page.title,
  description: page.description,
  path: page.canonicalPath,
  image: page.image,
  robots: page.robots
});

export default function BlogIndexPage() {
  return (
    <Layout>
      {page.jsonLd ? <JsonLd data={page.jsonLd} /> : null}
      <div className="legacy-seo-content" dangerouslySetInnerHTML={{ __html: page.html }} />
      <section className="section" aria-label="Flooring quote review guides">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Quote review cluster</span>
            <h2 style={{ marginTop: 18 }}>Compare flooring quotes with the written scope in front of you</h2>
            <p>
              These guides help Sydney customers check product clarity, measured area, supply and installation scope, removal, disposal,
              floor preparation, stairs, trims, terms and exclusions before accepting a flooring quote.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {quoteReviewCluster.map((guide) => (
                <Link className="link-card" href={guide.href} key={guide.href}>
                  <strong>{guide.title}</strong>
                  <span>{guide.body}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
      <section className="section" aria-label="Flooring product guides">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Product authority cluster</span>
            <h2 style={{ marginTop: 18 }}>Choose the flooring category before comparing the quote</h2>
            <p>
              These product guides explain who each flooring path suits, what to watch out for, and how product choice affects the written quote scope.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {productCluster.map((guide) => (
                <Link className="link-card" href={guide.href} key={guide.href}>
                  <strong>{guide.title}</strong>
                  <span>{guide.body}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
