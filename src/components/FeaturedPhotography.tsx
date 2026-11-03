"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import LightboxModal from "@/components/LightboxModal";
import {
  Heart,
  Lock,
  Compass,
  ArrowRight,
} from "lucide-react";

export default function FeaturedPhotography() {
  const { isLoggedIn, user } = useAuth();
  const { photos, isFavorite, toggleLike, getLikesCount } = usePhotos();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Photography folder photos (always accessible publicly to guests)
  const photographyPhotos = useMemo(() => {
    return photos.filter((p) => p.folder === "Photography" || p.category === "Photography");
  }, [photos]);

  // Categories available depending on auth state
  const categories = useMemo(() => {
    if (!isLoggedIn) {
      return ["All Photography", "Nature"];
    }
    return ["All", "Photography", "travel", "BUBT", "Memorise", "Mems", "Abdullah"];
  }, [isLoggedIn]);

  const displayedPhotos = useMemo(() => {
    if (!isLoggedIn) {
      return photographyPhotos.slice(0, 12);
    }
    if (activeTab === "All") {
      return photos.slice(0, 16);
    }
    return photos.filter((p) => p.category === activeTab || p.folder === activeTab).slice(0, 16);
  }, [isLoggedIn, activeTab, photographyPhotos, photos]);

  const handleCardClick = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section
      id="explore-preview"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 uppercase tracking-widest mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Authored by Abdullah</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Curated <span className="text-gradient-purple">Frames</span>
          </h2>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-gray-400">
            {!isLoggedIn
              ? "You are previewing public frames. Sign in to unlock high-res travel albums, university memories, and funny mems."
              : `Welcome, ${user?.name || "Abdullah"}! All ${photos.length} real album collections are unlocked.`}
          </p>
        </div>

        {/* View All link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all self-start md:self-auto"
        >
          <span>Explore All {photos.length} Photos</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all capitalize ${
                isSelected
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-[#121422] border border-white/10 text-gray-300 hover:border-purple-500/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Photo Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedPhotos.map((photo, index) => {
          const isLiked = isFavorite(photo.id);
          const currentLikes = getLikesCount(photo.id);

          return (
            <div
              key={photo.id}
              onClick={() => handleCardClick(index)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/[0.08] bg-[#121422]/70 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/20"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-black/10 to-black/30" />

                {/* Heart Button: Real toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(photo.id);
                  }}
                  className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
                    isLiked
                      ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-110"
                      : "bg-black/40 text-white border-white/20 hover:bg-rose-500/80"
                  }`}
                  title={isLiked ? "Saved in Favorites" : "Add to Favorites"}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`} />
                </button>

                {/* Tag */}
                <span className="absolute top-3.5 left-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-purple-300">
                  {photo.category}
                </span>

                {/* Bottom Overlay: Strictly Abdullah */}
                <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-purple-500/40 shrink-0">
                      <Image
                        src="/images/Abdullah/FB_IMG_1790540440153.jpg"
                        alt="Abdullah"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">Abdullah</p>
                      <p className="text-[10px] text-gray-400 truncate">{photo.title}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/20 shrink-0">
                    ❤️ {currentLikes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guest Locked Albums Banner if not logged in */}
      {!isLoggedIn && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-[#16182c] to-[#0d0e17] p-8 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Unlock All 6 Private Collections
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Sign in to browse Sylhet & Tangail Travel, BUBT Campus, Golden Memories, and Funny Mems with the photographer community.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signin"
                className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all"
              >
                Sign In to Unlock
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photos={displayedPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}
