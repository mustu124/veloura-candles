import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { FloatingNav } from "@/components/floating-nav";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Maison Velora | Luxury Candles & Home Fragrance",
  description: "A cinematic luxury candle and fragrance house with bespoke inquiry ordering.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Maison Velora",
    description: "Luxury candles composed like private rituals.",
    images: ["/assets/hero-candle.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>
        <Providers>
          <div className="luxury-noise" />
          <FloatingNav />
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
