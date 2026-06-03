import { routes } from "@/lib/routes";

const navItems = [
  { href: routes.home, label: "Home" },
  { href: routes.quote, label: "Quote" },
  { href: routes.products, label: "Flooring Products" },
  { href: routes.floorplan, label: "Floor Plan" },
  { href: routes.blog, label: "Guides" }
];

export function Header() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="site-logo" href="/" aria-label="Operon Flooring home">
        <img src="/assets/operon-flooring-sydney-logo.png" alt="Operon Flooring Sydney logo" width="184" height="58" />
      </a>
      <nav className="site-nav">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="site-actions">
        <a className="button button-secondary" href={routes.contact} data-track-cta="header_contact_click">Contact</a>
        <a className="button button-primary" href={routes.quote}>Start quote</a>
      </div>
    </header>
  );
}
