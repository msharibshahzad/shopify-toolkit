import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shopify-toolkit.vercel.app"),
  title: {
    default: "Shopify Toolkit — Free Tools for Store Owners",
    template: "%s | Shopify Toolkit",
  },
  description:
    "Free practical tools for Shopify merchants. Create product copy, check SEO metadata, clean catalog CSVs, and calculate profit margins.",
  applicationName: "Shopify Toolkit",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shopify Toolkit — Free Tools for Store Owners",
    description: "Create better listings, clean product data, and understand your margins.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
