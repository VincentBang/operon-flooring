import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

const contactJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://operonflooring.com.au/contact.html#contact",
      url: "https://operonflooring.com.au/contact.html",
      name: "Contact Operon Flooring",
      description: "Contact Operon Flooring for Sydney flooring quotes, quote review, floor plan questions and product enquiries."
    },
    {
      "@type": "Organization",
      "@id": "https://operonflooring.com.au/#organization",
      name: "Operon Flooring",
      url: "https://operonflooring.com.au/",
      email: "quotes@operonflooring.com.au",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "quotes@operonflooring.com.au",
        areaServed: "Sydney"
      }
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Should I contact Operon or start the quote first?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "If you know the area or have a floor plan, starting the quote is usually faster. If you have a general question or an existing quote to discuss, the contact form is suitable."
          }
        },
        {
          "@type": "Question",
          name: "Can I send an existing flooring quote?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can use the quote review page or contact Operon with the details. The focus is scope clarity, not cheapest-price comparison."
          }
        },
        {
          "@type": "Question",
          name: "Is the online estimate final?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The online estimate is a starting point based on product, area and the details provided. Final scope is reviewed before work is booked."
          }
        }
      ]
    }
  ]
};

export const metadata: Metadata = createPageMetadata({
  title: "Contact Operon Flooring | Sydney Flooring Quotes",
  description: "Contact Operon Flooring for Sydney flooring quotes, quote review, floor plan upload support, product guidance and installation scope confirmation.",
  path: routes.contact,
  image: "/assets/operon-social-preview.png"
});

export default function ContactPage() {
  return (
    <Layout>
      <JsonLd data={contactJsonLd} />
      <nav className="mobile-sticky-cta" aria-label="Quick contact actions">
        <a href={routes.contact} data-track-cta="mobile_contact_click">Contact</a>
        <a className="primary" href={routes.quote} data-track-cta="click_start_quote_mobile_sticky">Start quote</a>
        <a href={routes.quoteReview} data-track-cta="click_quote_validation">Check quote</a>
      </nav>

      <section className="hero contact-hero">
        <div className="shell">
          <article className="hero-card">
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="eyebrow">Contact Operon Flooring</span>
                <h1>Contact Operon Flooring</h1>
                <p>Need a flooring quote, quote review or help choosing a product? Send your details and Operon will review the best next step.</p>
                <div className="hero-actions">
                  <a className="button button-primary" href={routes.quote}>Start flooring quote</a>
                  <a className="button button-secondary" href={routes.quoteReview}>Check an existing quote</a>
                </div>
                <p className="hero-trust">Online quotes available 24/7. Sydney and surrounding suburbs.</p>
              </div>

              <aside className="contact-panel" aria-label="Contact details">
                <div className="contact-method">
                  <strong>Email</strong>
                  <a href="mailto:quotes@operonflooring.com.au" data-track-cta="click_contact_email">quotes@operonflooring.com.au</a>
                  <span className="contact-note">For quote, floor plan and project questions.</span>
                </div>
                <div className="contact-method">
                  <strong>Quote path</strong>
                  <a href={routes.quote}>Start a structured quote</a>
                  <span className="contact-note">Best when you know the product direction or approximate area.</span>
                </div>
                <div className="contact-method">
                  <strong>Business hours</strong>
                  <span className="contact-note">Monday to Friday: 8:00am-5:30pm<br />Saturday: 9:00am-2:00pm<br />Sunday: Closed</span>
                </div>
                <div className="contact-method">
                  <strong>Online quotes</strong>
                  <a href={routes.quote}>Available 24/7</a>
                  <span className="contact-note">Start with approximate details if needed.</span>
                </div>
              </aside>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Choose A Next Step</span>
            <h2>What do you need help with?</h2>
            <div className="link-grid">
              <a className="link-card" href={routes.quote}><strong>Start a flooring quote</strong><span>Enter the product, area and details you know now.</span></a>
              <a className="link-card" href={routes.floorplan}><strong>Upload a floor plan</strong><span>Measure the flooring area without manually measuring every room.</span></a>
              <a className="link-card" href={routes.quoteReview}><strong>Check an existing quote</strong><span>Review inclusions, exclusions and questions before comparing totals.</span></a>
              <a className="link-card" href={routes.products}><strong>Browse flooring products</strong><span>Compare hybrid, laminate and engineered timber before choosing a range.</span></a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Enquiry Form</span>
            <h2>Send a flooring enquiry</h2>
            <p>Share the project type, suburb and what you need help with.</p>
            <form
              className="contact-form"
              name="contact-enquiry"
              method="POST"
              action="/.netlify/functions/contact-enquiry"
              data-netlify="true"
              {...{ "netlify-honeypot": "bot-field" }}
            >
              <input type="hidden" name="form-name" value="contact-enquiry" />
              <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" hidden aria-hidden="true" />
              <div className="contact-form-grid">
                <div className="contact-field"><label htmlFor="contactName">Full name</label><input id="contactName" name="name" type="text" autoComplete="name" placeholder="Your name" required /></div>
                <div className="contact-field"><label htmlFor="contactPhone">Phone</label><input id="contactPhone" name="phone" type="tel" autoComplete="tel" placeholder="Mobile or best contact number" /></div>
                <div className="contact-field"><label htmlFor="contactEmail">Email</label><input id="contactEmail" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></div>
                <div className="contact-field"><label htmlFor="contactSuburb">Suburb</label><input id="contactSuburb" name="suburb" type="text" autoComplete="address-level2" placeholder="e.g. Parramatta" /></div>
                <div className="contact-field">
                  <label htmlFor="contactTopic">What can we help with?</label>
                  <select id="contactTopic" name="topic" required defaultValue="">
                    <option value="">Select enquiry type</option>
                    <option value="new-flooring-quote">New flooring quote</option>
                    <option value="existing-quote-review">Review existing quote</option>
                    <option value="floor-plan">Floor plan or measurement question</option>
                    <option value="product-question">Product question</option>
                    <option value="other">Other enquiry</option>
                  </select>
                </div>
                <div className="contact-field">
                  <label htmlFor="contactTiming">Project timing</label>
                  <select id="contactTiming" name="timing" defaultValue="">
                    <option value="">Not sure yet</option>
                    <option value="as-soon-as-practical">As soon as practical</option>
                    <option value="next-4-weeks">Next 4 weeks</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="planning-only">Planning only</option>
                  </select>
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="contactMessage">Message</label>
                <textarea id="contactMessage" name="message" placeholder="Tell us what flooring you are considering, the property type, approximate area, or what is unclear in your quote." required />
              </div>
              <p className="contact-note">Please do not include sensitive payment details.</p>
              <button className="button button-primary" type="submit">Send enquiry</button>
            </form>
          </article>

          <aside className="section-card">
            <span className="eyebrow">What To Send</span>
            <h2>Useful details for a faster reply</h2>
            <p>These details help Operon understand the project before confirming the next step.</p>
            <ul className="contact-checklist">
              <li>Flooring type if known: hybrid, laminate or engineered timber.</li>
              <li>Suburb and property type.</li>
              <li>Approximate area or floor plan if available.</li>
              <li>Whether existing flooring needs removal.</li>
              <li>Stairs, apartment or building-requirement notes.</li>
              <li>Photos if available and your preferred timeframe.</li>
            </ul>
            <div className="hero-actions">
              <a className="button button-secondary" href={routes.floorplan}>Upload floor plan</a>
              <a className="button button-secondary" href={routes.products}>Browse products</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section"><div className="shell grid-2"><article className="section-card"><span className="eyebrow">After Enquiry</span><h2>What happens after you contact Operon?</h2><p>Operon reviews the information you send, checks the best next step, and follows up on missing details where needed. If you already have a quote, the review focuses on what is included, excluded or still subject to confirmation.</p></article><article className="section-card"><span className="eyebrow">Before Booking</span><h2>Final scope is reviewed before booking</h2><p>Product, measured area, main inclusions and final details are reviewed before work is booked. The quote and enquiry process help keep that next step clear.</p></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">Better Next Step</span><h2>Choose the path that matches where you are</h2><div className="grid-3"><a className="mini-card" href={routes.quote}><h3>Ready for an estimate?</h3><p>Start with area, product and key details.</p></a><a className="mini-card" href={routes.quoteReview}><h3>Already have a quote?</h3><p>Check inclusions and open questions.</p></a><a className="mini-card" href={routes.products}><h3>Still choosing floors?</h3><p>Compare flooring options before estimating.</p></a></div></article></div></section>

      <section className="section"><div className="shell grid-3"><article className="faq-card"><h3>Should I contact Operon or start the quote first?</h3><p>If you know the area or have a floor plan, starting the quote is usually faster. If you have a general question or an existing quote to discuss, the contact form is suitable.</p></article><article className="faq-card"><h3>Can I send an existing flooring quote?</h3><p>Yes. You can use the quote review page or contact Operon with the details. The focus is scope clarity, not cheapest-price comparison.</p></article><article className="faq-card"><h3>Is the online estimate final?</h3><p>No. The online estimate is a starting point based on product, area and the details provided. Final scope is reviewed before work is booked.</p></article></div></section>

      <section className="section"><div className="shell"><article className="section-card text-center"><span className="eyebrow">Ready To Move</span><h2>Ready to price your flooring project?</h2><p>Start estimate or send an enquiry.</p><div className="hero-actions"><a className="button button-primary" href={routes.quote}>Start flooring quote</a><a className="button button-secondary" href="mailto:quotes@operonflooring.com.au">Email Operon Flooring</a></div></article></div></section>
    </Layout>
  );
}
