"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Heart,
  FolderArchive,
  UploadCloud,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function PowerfulFeatures() {
  const features = [
    {
      title: "Ultra HD Photo Gallery",
      desc: "Curated photography with natural aspect ratio rendering, fullscreen lightbox zoom, and instant metadata.",
      icon: Camera,
      badge: "Viewing",
      color: "from-purple-500/20 to-indigo-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Curated Favorites",
      desc: "Save breathtaking moments with 1-click bookmarks, synchronized securely across all your devices.",
      icon: Heart,
      badge: "Collection",
      color: "from-rose-500/20 to-pink-500/20",
      iconColor: "text-rose-400",
    },
    {
      title: "Structured Albums",
      desc: "Browse categorized collections for Nature, Travel, BUBT Campus Life, and Golden Memories.",
      icon: FolderArchive,
      badge: "Portfolios",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Studio & Bio Customization",
      desc: "Upload original uncompressed captures, edit profile bio, crop avatars, and manage visibility.",
      icon: UploadCloud,
      badge: "Studio",
      color: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-widest mb-3">
          Platform Architecture
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Crafted for <span className="text-gradient-purple">Photographers</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
          Everything you need for an immersive, distraction-free photography portfolio.
        </p>
      </div>

      {/* Features Grid & Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Grid: 4 Core Feature Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#121422]/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feat.color} border border-black/5 dark:border-white/10 ${feat.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-300/90 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="mt-3.5 text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-gray-400">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Card: Curated Visual Anchor (Image Background - Keep White) */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 min-h-[340px] flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b from-[#151728] to-[#0a0b12] keep-white shadow-xl">
          <Image
            src="/images/aesthetic-nature-sanctuary.jpg"
            alt="Aesthetic Mountain Landscape"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover opacity-60 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/40 to-black/20" />

          {/* Top Badge */}
          <div className="relative z-10 flex justify-end">
            <span className="rounded-full bg-black/60 backdrop-blur-md border border-purple-500/30 px-3.5 py-1 text-xs font-serif italic text-purple-200 keep-white">
              Capture • Preserve • Inspire
            </span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 pt-12">
            <h4 className="text-xl sm:text-2xl font-bold text-white leading-snug keep-white">
              Every shutter click preserves a living memory.
            </h4>
            <p className="mt-2 text-xs text-gray-200 leading-relaxed keep-white">
              Experience authentic photography, uncompressed quality, and curated travel chronicles across Bengal.
            </p>

            <Link
              href="/explore"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all group keep-white"
            >
              <span>Browse All Collections</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
