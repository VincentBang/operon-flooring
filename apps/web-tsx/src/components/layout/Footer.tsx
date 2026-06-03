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
    <footer className="site-footer">
      <div className="site-footer-inner">
        <section className="footer-brand" aria-label="Operon contact details">
          <a className="footer-logo" href="/" aria-label="Operon Flooring home">
            <img src="/assets/operon-flooring-sydney-logo.png" alt="Operon Flooring Sydney logo" width="154" height="49" />
          </a>
          <p>Flooring quotes and installation guidance for Sydney projects.</p>
          <a className="footer-brand-cta" href={routes.quote}>Start quote</a>
        </section>
        {footerGroups.map((group) => (
          <section key={group.title}>
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
      <div className="site-footer-bottom">
        <span>© 2026 Operon Flooring</span>
      </div>
    </footer>
  );
}
