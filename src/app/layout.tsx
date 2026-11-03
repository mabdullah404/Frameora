import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frameora-delta.vercel.app"),
  title: {
    default: "Frameora — Editorial Photography & Visual Stories",
    template: "%s — Frameora",
  },
  description: "Curated photography sanctuary and visual journal preserving authentic landscapes, travel moments, and community frames.",
  keywords: ["photography", "landscape photography", "visual stories", "travel photography", "Bangladesh", "Frameora", "photo essays", "editorial portfolio"],
  authors: [{ name: "Md. Abdullah Al Mamun" }],
  creator: "Md. Abdullah Al Mamun",
  openGraph: {
    title: "Frameora — Editorial Photography & Visual Stories",
    description: "Discover extraordinary photography collections, places, and visual journals through the lens.",
    url: "https://frameora-delta.vercel.app",
    siteName: "Frameora",
    images: [
      {
        url: "/images/hero-landscape.jpg",
        width: 1200,
        height: 630,
        alt: "Frameora Photography Sanctuary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frameora — Editorial Photography",
    description: "Discover extraordinary photography collections through the lens.",
    images: ["/images/hero-landscape.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0b10] text-gray-100 relative">
        <div className="ambient-glow-bg" />
        <Providers>
          {/* সব page-এর উপরে একই Navbar থাকবে */}
          <Navbar />
          {/* এখানে প্রতিটি page-এর নিজস্ব content দেখাবে */}
          <div className="relative z-10 flex-1">{children}</div>
          {/* সব page-এর নিচে Footer থাকবে */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
