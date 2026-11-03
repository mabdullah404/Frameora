"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Heart,
  FolderArchive,
  Search,
  Play,
  Calendar,
  Bell,
  BarChart3,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

export default function PowerfulFeatures() {
  const features = [
    {
      title: "Photo Gallery",
      desc: "Ultra HD photo viewer with responsive masonry layout and instant metadata extraction.",
      icon: Camera,
      badge: "Core",
      color: "from-purple-500/20 to-indigo-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Favorites",
      desc: "Bookmark moments you love with 1-click hearts and custom private collections.",
      icon: Heart,
      badge: "Popular",
      color: "from-rose-500/20 to-pink-500/20",
      iconColor: "text-rose-400",
    },
    {
      title: "Albums",
      desc: "Organize trips, campus life, events and memoirs into clean categorized albums.",
      icon: FolderArchive,
      badge: "Organize",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Smart Search",
      desc: "Instant search by photographer, location, tags, and category filters.",
      icon: Search,
      badge: "Fast",
      color: "from-teal-500/20 to-emerald-500/20",
      iconColor: "text-teal-400",
    },
    {
      title: "Slideshow",
      desc: "Immersive fullscreen presentation mode with keyboard arrows and lightbox zoom.",
      icon: Play,
      badge: "Immersive",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
    },
    {
      title: "Memory Timeline",
      desc: "Scroll through dates, years, and locations to relive precious moments in order.",
      icon: Calendar,
      badge: "Timeline",
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
    },
    {
      title: "Notifications",
      desc: "Stay notified whenever fellow photographers like or comment on your frames.",
      icon: Bell,
      badge: "Live",
      color: "from-yellow-500/20 to-amber-500/20",
      iconColor: "text-yellow-400",
    },
    {
      title: "Analytics",
      desc: "Deep insights into photo views, download stats, top categories and growth curves.",
      icon: BarChart3,
      badge: "Insights",
      color: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
    {
      title: "Secure & Private",
      desc: "Role-based access control (Guest / Member / Admin) keeping your personal memories protected.",
      icon: ShieldCheck,
      badge: "Protected",
      color: "from-violet-500/20 to-purple-500/20",
      iconColor: "text-violet-400",
    },
    {
      title: "Creator Archive",
      desc: "High-resolution curated visual archive authored by Md. Abdullah Al Mamun.",
      icon: Users,
      badge: "Authored",
      color: "from-indigo-500/20 to-fuchsia-500/20",
      iconColor: "text-indigo-400",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header matching Bottom-Right of mockup */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4">
          Built for Creatives
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Powerful <span className="text-gradient-purple">Features</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          Everything you need for a complete photography experience
        </p>
      </div>

      {/* Features Grid & Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Grid: 8-10 Feature Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-2xl border border-white/[0.07] bg-[#121422]/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-[#16182c]/80 hover:shadow-xl hover:shadow-purple-600/10 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feat.color} border border-white/10 ${feat.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-300/80 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Card: AI Futuristic Camera Lens Visual with "Capture Share Inspire" */}
        <div className="lg:col-span-4 relative rounded-3xl overflow-hidden border border-white/10 min-h-[480px] flex flex-col justify-between p-7 bg-gradient-to-b from-[#151728] to-[#0a0b12]">
          {/* Background Image: AI Automation Creative Visual */}
          <Image
            src="/images/ai-creative-lens.jpg"
            alt="AI Digital Lens Capture Share Inspire"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover opacity-60 transition-transform duration-700 hover:scale-105"
          />
          {/* Dark purple gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/50 to-transparent" />

          {/* Top Floating Badge with handwritten style feel */}
          <div className="relative z-10 flex justify-end">
            <div className="rotate-[-6deg] rounded-2xl bg-black/60 backdrop-blur-md border border-purple-500/30 px-5 py-3 shadow-xl">
              <span className="block text-xl sm:text-2xl font-serif italic text-purple-200 tracking-wide">
                Capture
              </span>
              <span className="block text-2xl sm:text-3xl font-serif italic font-bold text-white tracking-wide">
                Share
              </span>
              <span className="block text-3xl sm:text-4xl font-serif italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                Inspire.
              </span>
            </div>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 pt-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-xs text-purple-300 font-medium mb-3 backdrop-blur-md">
              <Camera className="h-3.5 w-3.5" />
              <span>Full Lens Experience</span>
            </div>
            <h4 className="text-2xl font-bold text-white leading-snug">
              Every shutter click tells an eternal story.
            </h4>
            <p className="mt-2 text-xs text-gray-300 leading-relaxed">
              Join Frameora to curate your personal visual archive, collaborate with photographers, and share your vision with the world.
            </p>

            <Link
              href="/explore"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all group"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
