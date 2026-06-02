import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Enquiry Received | Operon Flooring",
  description: "Your Operon Flooring enquiry has been received. We will review the details and respond with the next practical step.",
  path: routes.contactThankYou,
  image: "/assets/operon-social-preview.png",
  robots: "noindex,follow"
});

export default function ContactThankYouPage() {
  return (
    <Layout>
      <section className="hero">
        <div className="shell">
          <article className="hero-card text-center">
            <span className="eyebrow">Enquiry Received</span>
            <h1>Thanks, we received your enquiry</h1>
            <p>We will review your enquiry and respond with the next step.</p>
            <p className="hero-trust">Scope clarity first. Final details confirmed before booking.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={routes.quote}>Start flooring quote</a>
              <a className="button button-secondary" href={routes.quoteReview}>Check existing quote</a>
              <a className="button button-secondary" href="/#top">Return home</a>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
