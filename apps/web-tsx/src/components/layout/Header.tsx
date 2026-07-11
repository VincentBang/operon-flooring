import { routes } from "@/lib/routes";
import Script from "next/script";

const navItems = [
  { href: routes.home, label: "Home" },
  { href: routes.quote, label: "Quote" },
  { href: routes.products, label: "Flooring Products" },
  { href: routes.roomVisualiser, label: "Visualiser" },
  { href: routes.floorplan, label: "Floor Plan" },
  { href: routes.blog, label: "Guides" }
];

export function Header() {
  return (
    <>
      <header className="site-header" aria-label="Primary navigation">
        <div className="shell nav">
          <a className="brand site-logo" href="/" aria-label="Operon Flooring home">
            <img src="/assets/operon-flooring-sydney-brand-logo.webp" alt="Operon Flooring Sydney logo" width="240" height="51" />
          </a>
          <nav className="nav-links site-nav" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <button className="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="header-actions site-actions">
            <a className="header-phone button button-secondary" href={routes.contact} data-track-cta="header_contact_click">Contact</a>
            <a className="button header-quote-button button-primary" href={routes.quote}>Start quote</a>
          </div>
        </div>
      </header>
      <Script src="/mobile-nav.js" strategy="afterInteractive" />
    </>
  );
}
