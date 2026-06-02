import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://operonflooring.com.au"),
  title: "Operon Flooring",
  description: "Sydney flooring quotes, product guidance, floor plan support and quote review.",
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
