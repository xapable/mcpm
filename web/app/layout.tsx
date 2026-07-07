import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { CopyCodeButtons } from "@/components/CopyCodeButtons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mcpm — MCP Package Manager",
  description: "Discover, publish, and manage MCP tools for AI agents.",
  icons: {
    icon: "/favicon.svg",
  },
  // Google Search Console verification — replace with your own verification code
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <CopyCodeButtons />
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
