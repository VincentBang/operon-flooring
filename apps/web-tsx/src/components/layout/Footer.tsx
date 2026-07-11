import { routes } from "@/lib/routes";

const footerGroups = [
  {
    title: "Products",
    links: [
      { href: routes.hybrid, label: "Hybrid Flooring Sydney" },
      { href: routes.laminate, label: "Laminate Flooring Sydney" },
      { href: routes.engineered, label: "Engineered Timber Flooring Sydney" },
      { href: routes.products, label: "Products page" }
    ]
  },
  {
    title: "Actions",
    links: [
      { href: routes.quote, label: "Start Quote" },
      { href: routes.roomVisualiser, label: "Room Visualiser" },
      { href: routes.floorplan, label: "Upload Floor Plan" },
      { href: routes.quoteReview, label: "Quote Review" },
      { href: routes.blog, label: "Flooring Guides" }
    ]
  },
  {
    title: "Locations",
    links: [
      { href: routes.edmondsonPark, label: "Edmondson Park" },
      { href: routes.liverpool, label: "Liverpool" },
      { href: routes.leppington, label: "Leppington" },
      { href: routes.camden, label: "Camden" },
      { href: routes.campbelltown, label: "Campbelltown" },
      { href: routes.parramatta, label: "Parramatta" },
      { href: routes.bankstown, label: "Bankstown" },
      { href: routes.auburn, label: "Auburn" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: routes.recentProjects, label: "Recent Projects" },
      { href: routes.contact, label: "Contact" },
      { href: "/privacy-policy.html", label: "Privacy Policy" },
      { href: "/terms.html", label: "Terms" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="site-footer footer-contained">
      <div className="container site-footer-inner footer-grid">
        <section className="footer-col footer-brand footer-brand-block" aria-label="Operon contact details">
          <a className="footer-logo" href="/" aria-label="Operon Flooring home">
            <img src="/assets/operon-flooring-sydney-brand-logo.webp" alt="Operon Flooring Sydney logo" width="154" height="33" />
          </a>
          <p className="footer-brand-copy">Flooring quotes and installation guidance for Sydney projects.</p>
          <a className="footer-brand-cta" href={routes.quote}>Start quote</a>
        </section>
        {footerGroups.map((group) => (
          <section className="footer-col" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="container site-footer-bottom footer-bottom">
        <span>© 2026 Operon Flooring</span>
      </div>
    </footer>
  );
}
