import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sitemap Analyzer",
  description: "Tool to analyze sitemaps and generate CSV reports with page metadata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}