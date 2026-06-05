import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://operonflooring.com.au"),
  title: "Operon Flooring",
  description: "Sydney flooring quotes, product guidance, floor plan support and quote review.",
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/operon-flooring-favicon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }
    ],
    shortcut: ["/favicon.ico"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
