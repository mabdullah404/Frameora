"use client";

import React from "react";
import { Camera } from "lucide-react";

interface PhotoSkeletonProps {
  count?: number;
  className?: string;
}

export default function PhotoSkeleton({ count = 8, className = "" }: PhotoSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
      aria-label="Loading photos"
      role="status"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121422]/60 aspect-[4/5] animate-pulse flex flex-col justify-between p-4"
        >
          {/* Top Badge Shimmer */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-16 rounded-full bg-white/[0.08]" />
            <div className="h-8 w-8 rounded-full bg-white/[0.08]" />
          </div>

          {/* Center Aperture Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-purple-400/40">
            <Camera className="h-6 w-6 animate-spin-slow" />
          </div>

          {/* Bottom Title & Author Shimmer */}
          <div className="space-y-2 pt-4">
            <div className="h-4 w-3/4 rounded-lg bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-white/[0.08]" />
              <div className="h-3 w-1/3 rounded-lg bg-white/[0.06]" />
            </div>
          </div>

          {/* Shimmer overlay gradient */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
