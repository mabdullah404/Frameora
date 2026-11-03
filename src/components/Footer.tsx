"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Camera, ArrowUp, Globe, Mail } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState("2026");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      name: "Portfolio",
      href: "https://personal-portfolio-code-orbit5.vercel.app/",
      label: "Portfolio",
      icon: <Globe className="h-4 w-4" />,
      hoverClass: "hover:text-purple-400 hover:border-purple-400/40",
    },
    {
      name: "GitHub",
      href: "https://github.com/mabdullah404",
      label: "GitHub",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      hoverClass: "hover:text-white hover:border-white/40",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/mabdullah404",
      label: "LinkedIn",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92M5.07 18.5h2.79v-8.37H5.07v8.37z" />
        </svg>
      ),
      hoverClass: "hover:text-blue-400 hover:border-blue-400/40",
    },
    {
      name: "X",
      href: "https://x.com/mabdullah404",
      label: "X",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverClass: "hover:text-sky-400 hover:border-sky-400/40",
    },
    {
      name: "Email",
      href: "mailto:mabdullah539629@gmail.com",
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      hoverClass: "hover:text-purple-300 hover:border-purple-300/40",
    },
  ];

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#0a0b10]/95 text-gray-400 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
                <Camera className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                Frame<span className="text-purple-400">ora</span>
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-relaxed text-gray-400">
              A community for photography lovers around the world. Preserving authentic landscapes, travel moments, campus stories, and visual memories.
            </p>

            {/* Icon-only social links */}
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 backdrop-blur transition-all hover:scale-110 ${social.hoverClass}`}
                  title={social.label}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column: Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-purple-400 transition-colors">
                  Explore Gallery
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-purple-400 transition-colors">
                  Profile & Albums
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-purple-400 transition-colors text-purple-300">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Collections
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              <li>
                <Link href="/explore?cat=Nature" className="hover:text-purple-400 transition-colors">
                  Nature & Landscapes
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=travel" className="hover:text-purple-400 transition-colors">
                  Travel & Journey
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=BUBT" className="hover:text-purple-400 transition-colors">
                  Campus Life
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=Mems" className="hover:text-purple-400 transition-colors">
                  Memories & Squad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-5 sm:flex-row text-xs">
          <p className="text-gray-500">
            © {year} Frameora. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400 hover:text-white hover:border-purple-400 transition-all"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
