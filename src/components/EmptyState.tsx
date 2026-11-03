"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  FolderOpen,
  Camera,
  UploadCloud,
  Compass,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface EmptyStateProps {
  type?: "favorites" | "albums" | "search" | "uploads" | "general";
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const emptyConfigs = {
  favorites: {
    icon: Heart,
    iconColor: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    defaultTitle: "No favorite moments yet",
    defaultDesc: "Click the heart icon on any photo in the gallery to curate your personal collection.",
    defaultActionText: "Discover Photos",
    defaultActionHref: "/explore",
  },
  albums: {
    icon: FolderOpen,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    defaultTitle: "No album collections found",
    defaultDesc: "Explore photography galleries to view curated albums or upload new sets.",
    defaultActionText: "Explore Collections",
    defaultActionHref: "/explore",
  },
  search: {
    icon: Search,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-500/20",
    defaultTitle: "No matching frames found",
    defaultDesc: "We couldn't find any photographs matching your query. Try different keywords or reset your filters.",
    defaultActionText: "Reset Search & Filters",
    defaultActionHref: undefined,
  },
  uploads: {
    icon: UploadCloud,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    defaultTitle: "No photos uploaded yet",
    defaultDesc: "Share your first photographic capture with the community or save private personal memories.",
    defaultActionText: "Upload First Frame",
    defaultActionHref: undefined,
  },
  general: {
    icon: Camera,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-500/20",
    defaultTitle: "No frames available",
    defaultDesc: "There are currently no items to display in this view.",
    defaultActionText: "Return to Explore",
    defaultActionHref: "/explore",
  },
};

export default function EmptyState({
  type = "general",
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  const config = emptyConfigs[type] || emptyConfigs.general;
  const Icon = config.icon;

  const displayTitle = title || config.defaultTitle;
  const displayDesc = description || config.defaultDesc;
  const displayActionText = actionText || config.defaultActionText;
  const displayHref = actionHref !== undefined ? actionHref : config.defaultActionHref;

  return (
    <div
      className={`relative my-8 mx-auto max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#121422]/60 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-24 bg-purple-600/10 blur-[60px] pointer-events-none rounded-full" />

      {/* Center Icon */}
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${config.bgColor} ${config.borderColor} ${config.iconColor} shadow-lg`}
      >
        <Icon className="h-8 w-8" />
      </div>

      {/* Texts */}
      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
        {displayTitle}
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
        {displayDesc}
      </p>

      {/* Action Button */}
      {(onAction || displayHref) && (
        <div className="mt-6">
          {displayHref ? (
            <Link
              href={displayHref}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              <span>{displayActionText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{displayActionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
