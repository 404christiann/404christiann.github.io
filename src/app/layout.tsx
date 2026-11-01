import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import SiteAnalytics from "@/components/SiteAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "builder 🔧",
  description: "builder 🔧",
  icons: {
    icon: { url: "/brand/white-dot-favicon.png", sizes: "64x64", type: "image/png" },
    apple: { url: "/brand/white-dot-apple-touch.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
