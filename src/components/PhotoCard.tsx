"use client";

import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

type PhotoCardProps = {
  photo: Photo;
  isLocked?: boolean;
};

export default function PhotoCard({ photo, isLocked = false }: PhotoCardProps) {
  const { isLoggedIn } = useAuth();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const isRestricted = !isLoggedIn && photo.folder !== "Photography";
  const locked = isLocked || isRestricted;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#171717] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl hover:shadow-black/50">
      <div>
        {/* Photo Thumbnail Container */}
        <Link
          href={locked ? "/signin" : `/photos/${photo.id}`}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-black/40"
          aria-label={`View ${photo.title}`}
        >
          <Image
            src={photo.image}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              locked ? "blur-[2px] opacity-70" : ""
            }`}
          />

          {/* Locked Overlay if not signed in */}
          {locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center backdrop-blur-xs transition-opacity group-hover:bg-black/70">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg">
                🔒
              </span>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                Member Only
              </p>
              <p className="mt-1 text-[11px] text-gray-300">
                Sign in to view
              </p>
            </div>
          )}

          {/* Top Category / Fun Tag Badge */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {photo.funTag ? (
              <span className="rounded-full bg-amber-400/95 px-2.5 py-1 text-[11px] font-bold text-black shadow-md">
                {photo.funTag}
              </span>
            ) : (
              <span className="rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-[11px] font-medium tracking-wide text-amber-300 backdrop-blur-md">
                {photo.category}
              </span>
            )}
          </div>

          {/* Quick Reaction Button */}
          {!locked && (
            <button
              type="button"
              onClick={handleLike}
              className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs backdrop-blur-md transition-all ${
                hasLiked
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                  : "bg-black/60 text-white hover:bg-black/90 hover:text-amber-300"
              }`}
              title="React to this photo"
            >
              <span>{photo.folder === "Mems" ? "😂" : "❤️"}</span>
              {likes > 0 && <span className="font-semibold">{likes}</span>}
            </button>
          )}
        </Link>

        {/* Photo Info */}
        <div className="p-4 sm:p-5">
          <h3 className="line-clamp-2 text-base font-bold text-white transition-colors group-hover:text-amber-400 sm:text-lg">
            {photo.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-300 sm:text-sm">
            {photo.description}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 sm:px-5">
        <span className="truncate text-xs text-gray-400">
          By {photo.photographer}
        </span>

        <Link
          href={locked ? "/signin" : `/photos/${photo.id}`}
          className="shrink-0 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300 hover:underline"
        >
          {locked ? "Sign in →" : "View photo →"}
        </Link>
      </div>
    </article>
  );
}
