"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, Play, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";

export default function Hero() {
  const { role } = useAuth();
  const { photos } = usePhotos();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden border-b border-white/[0.08]">
      {/* Background Hero Image with Mountain & Hiker from Mockup */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-landscape.jpg"
          alt="Frameora Photography Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Layered Vignette Overlays matching Top-Left Mockup */}
        <div className="absolute inset-0 bg-[#0a0b10]/70 via-[#0a0b10]/40 to-[#0a0b10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b10] via-[#0a0b10]/80 to-transparent sm:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-black/30" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 pt-16 sm:px-8 sm:pt-24 lg:pt-28 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl">
          
          {/* Glowing Aperture Brand Badge */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white shadow-xl shadow-purple-600/40 glow-purple">
              <Camera className="h-7 w-7" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                Frame<span className="text-purple-400">ora</span>
              </span>
              <span className="text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
                Visual Sanctuary
              </span>
            </div>
          </div>

          {/* Headline matching Mockup */}
          <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
            Explore, discover, and share{" "}
            <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
              beautiful photography.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
            A digital sanctuary created by Md. Abdullah Al Mamun. Preserving authentic landscapes, travel journeys across Sylhet & Tangail, campus life at BUBT, and cherished personal memories.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all"
            >
              <span>Explore Gallery ({photos.length} Photos)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#features-section"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <Play className="h-2.5 w-2.5 fill-white text-white ml-0.5" />
              </div>
              <span>Platform Features</span>
            </a>
          </div>

          {/* Real Author Attribution Cluster */}
          <div className="mt-12 flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[
                "/images/Abdullah/FB_IMG_1790540440153.jpg",
                "/images/Abdullah/FB_IMG_1790540474450.jpg",
                "/images/Abdullah/FB_IMG_1790540485371.jpg",
                "/images/Abdullah/FB_IMG_1790357325608.jpg",
              ].map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#0a0b10] shadow-md ring-1 ring-purple-500/40"
                >
                  <Image
                    src={src}
                    alt="Abdullah"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="text-xs sm:text-sm">
              <span className="font-bold text-white">{photos.length} Verified Frames</span>
              <p className="text-xs text-gray-400">Captured & Authored by Md. Abdullah Al Mamun</p>
            </div>
          </div>

          {/* Contextual Status Badge */}
          <div className="mt-6">
            {role === "guest" && (
              <p className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300">
                <span>✨ Guest Preview Mode: Public nature & photography unlocked.</span>
                <Link href="/signin" className="underline font-semibold hover:text-white">Sign In</Link>
                <span>to view all 6 albums!</span>
              </p>
            )}
            {role === "user" && (
              <p className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Member Access Active: Travel, Memories, Campus & Albums unlocked!</span>
              </p>
            )}
            {role === "admin" && (
              <p className="inline-flex items-center gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-xs text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Admin Privileges Active: Full 8-Module Dashboard accessible.</span>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Subtle Scroll Down Indicator without layout shifting */}
      <div className="relative z-10 pb-6 flex justify-center">
        <a
          href="#explore-preview"
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors opacity-80 hover:opacity-100"
          aria-label="Scroll to explore"
        >
          <span className="text-[11px] tracking-wider uppercase text-gray-400 font-medium">Explore Gallery</span>
          <ChevronDown className="h-4 w-4 text-purple-400" />
        </a>
      </div>
    </section>
  );
}
