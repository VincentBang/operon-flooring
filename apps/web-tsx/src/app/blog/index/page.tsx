import type { Metadata } from "next";
import Link from "next/link";
import { HomeChatbot } from "@/components/HomeChatbot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { legacyBlogPages } from "@/lib/legacyBlogPages";
import { routes } from "@/lib/routes";

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
const practicalGuideCluster = [
  {
    href: "/blog/how-to-measure-floor-area.html",
    title: "How to measure floor area",
    body: "Prepare room measurements or a floor plan before starting an estimate."
  },
  {
    href: "/blog/do-you-need-floor-preparation.html",
    title: "Do you need floor preparation?",
    body: "Understand why preparation may stay subject to review until site conditions are visible."
  },
  {
    href: "/blog/flooring-maintenance-checklist.html",
    title: "Flooring maintenance checklist",
    body: "Plan routine care around the selected flooring type and manufacturer guidance."
  },
  {
    href: "/blog/how-to-clean-hybrid-flooring.html",
    title: "How to clean hybrid flooring",
    body: "Use a practical cleaning routine without over-wetting or abrasive products."
  },
  {
    href: "/blog/how-to-clean-laminate-flooring.html",
    title: "How to clean laminate flooring",
    body: "Protect laminate joins and finish with a low-moisture maintenance routine."
  },
  {
    href: "/blog/engineered-timber-floor-maintenance.html",
    title: "Engineered timber maintenance",
    body: "Keep the timber surface, finish and indoor conditions in mind after installation."
  },
  {
    href: "/blog/floor-repair-or-replace.html",
    title: "Repair or replace flooring?",
    body: "Use the condition, affected area and product type to frame the next inspection question."
  },
  {
    href: "/blog/best-flooring-for-pets-sydney.html",
    title: "Flooring for homes with pets",
    body: "Compare maintenance, moisture and surface-wear considerations before choosing a category."
  }
];
const localSearchCluster = [
  {
    href: "/flooring-miranda.html",
    title: "Flooring Miranda",
    body: "Local guide for Miranda hybrid, laminate and timber flooring quote scope."
  },
  {
    href: "/flooring-liverpool.html",
    title: "Flooring Liverpool",
    body: "Liverpool quote guidance for product choice, access, removal, stairs and trims."
  },
  {
    href: "/flooring-edmondson-park.html",
    title: "Timber flooring Edmondson Park",
    body: "Edmondson Park timber, hybrid and flooring quote help for scope clarity."
  },
  {
    href: "/flooring-quote-sydney.html",
    title: "Flooring quote Sydney guide",
    body: "Use the core Sydney quote guide before comparing written totals."
  }
];
const conversionCluster = [
  {
    href: routes.quote,
    title: "Start instant flooring quote",
    body: "Use product, area, removal, stairs and site notes to create a structured starting estimate."
  },
  {
    href: routes.quoteReview,
    title: "Check an existing quote",
    body: "Upload a written quote or run a quick completeness check before comparing totals."
  },
  {
    href: routes.floorplan,
    title: "Measure from a floor plan",
    body: "Use a plan to create a clearer area when room measurements are not ready."
  },
  {
    href: routes.products,
    title: "Browse flooring products",
    body: "Shortlist hybrid, laminate or engineered timber before starting the quote."
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
      <section className="section" aria-label="Flooring quote starting points">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Start with the right path</span>
            <h2 style={{ marginTop: 18 }}>Use the guides, then move into the quote flow</h2>
            <p>
              The guide hub should help customers choose the next action, not just read more pages. Start a quote when you know the project direction,
              check an existing quote when you already have written scope, or use a floor plan when area is still uncertain.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {conversionCluster.map((guide) => (
                <Link className="link-card" href={guide.href} key={guide.href}>
                  <strong>{guide.title}</strong>
                  <span>{guide.body}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
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
      <section className="section" aria-label="Flooring planning and maintenance guides">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Practical flooring guides</span>
            <h2 style={{ marginTop: 18 }}>Measure, maintain and diagnose before choosing the next step</h2>
            <p>
              Use these guides for practical questions that sit around the quote: measuring the area, identifying preparation uncertainty,
              maintaining the selected floor and deciding when an inspection may be useful.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {practicalGuideCluster.map((guide) => (
                <Link className="link-card" href={guide.href} key={guide.href}>
                  <strong>{guide.title}</strong>
                  <span>{guide.body}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
      <section className="section" aria-label="Sydney flooring quote pages">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Local quote paths</span>
            <h2 style={{ marginTop: 18 }}>Sydney pages Google is already testing</h2>
            <p>
              These local quote pages connect suburb intent back to product choice, quote clarity, floorplan area and quote review.
            </p>
            <div className="link-grid" style={{ marginTop: 22 }}>
              {localSearchCluster.map((guide) => (
                <Link className="link-card" href={guide.href} key={guide.href}>
                  <strong>{guide.title}</strong>
                  <span>{guide.body}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
      <HomeChatbot pageKey="blog" />
    </Layout>
  );
}
