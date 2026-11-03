"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight, Compass, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";

export default function Hero() {
  const { isLoggedIn, role } = useAuth();
  const { photos } = usePhotos();

  return (
    <section className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-center overflow-hidden border-b border-white/[0.08]">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-landscape.jpg"
          alt="Frameora Photography Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Layered Vignette Overlays */}
        <div className="absolute inset-0 bg-[#0a0b10]/75 via-[#0a0b10]/50 to-[#0a0b10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b10] via-[#0a0b10]/70 to-transparent sm:w-2/3" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-black/30" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          
          {/* Aperture Brand Badge */}
          <div className="inline-flex items-center gap-2.5 mb-5 rounded-full bg-black/40 border border-white/10 px-3.5 py-1.5 backdrop-blur-md">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md">
              <Camera className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-purple-200 tracking-wide">
              Editorial Photography & Visual Sanctuary
            </span>
          </div>

          {/* Headline with Responsive Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-[1.1] tracking-tight text-white drop-shadow-md">
            Explore, discover, and share{" "}
            <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
              authentic photography.
            </span>
          </h1>

          {/* Concise Subtitle */}
          <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-xl">
            A digital sanctuary preserving natural landscapes, scenic travel journeys across Sylhet & Tangail, campus life at BUBT, and timeless visual memories.
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Gallery ({photos.length} Frames)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href={isLoggedIn ? "/profile" : "/signin"}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-5 py-3 text-xs sm:text-sm font-medium text-white backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all"
            >
              <span>{isLoggedIn ? "My Profile" : "Sign In to Unlock"}</span>
            </Link>
          </div>

          {/* Clean Metric Tagline */}
          <div className="mt-8 flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{photos.length} Verified High-Resolution Frames</span>
            <span>•</span>
            <span>Natural Composition</span>
          </div>

        </div>
      </div>
    </section>
  );
}
