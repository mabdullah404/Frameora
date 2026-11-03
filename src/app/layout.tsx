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
  title: "Frameora - Photography & Visual Stories",
  description: "Discover extraordinary photography collections, places, and stories through the lens.",
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
