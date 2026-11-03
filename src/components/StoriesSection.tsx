"use client";

import NextLink from "next/link";
import Image from "next/image";
import storiesData from "@/data/stories.json";
import { BookOpen, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export default function StoriesSection() {
  return (
    <section id="stories" className="py-12 sm:py-16 border-t border-white/[0.08] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 uppercase tracking-widest mb-2.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Visual Journals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Photo Essays & <span className="text-gradient-purple">Stories</span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-400 max-w-xl">
              Curated narrative journeys connecting light, natural tranquility, and heartfelt memories across Bengal.
            </p>
          </div>

          <NextLink
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors self-start sm:self-auto"
          >
            <span>Explore All Frames</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </NextLink>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storiesData.map((story) => (
            <NextLink
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-[#121422]/80 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/15"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-[#121422]/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-[11px] font-semibold text-purple-300">
                    {story.readTime}
                  </span>
                </div>
              </div>

              {/* Story Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-purple-400" />
                      <span>{story.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      <span className="truncate">{story.location.split(",")[0]}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                    {story.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Read Photo Essay</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-[11px] text-gray-500">
                    by {story.author.split(" ").pop()}
                  </span>
                </div>
              </div>
            </NextLink>
          ))}
        </div>

      </div>
    </section>
  );
}
