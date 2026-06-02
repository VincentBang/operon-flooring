import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="site-shell">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
