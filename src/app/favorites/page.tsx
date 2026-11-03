"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";
import LightboxModal from "@/components/LightboxModal";
import EmptyState from "@/components/EmptyState";
import UserAvatar from "@/components/UserAvatar";
import {
  Heart,
  Download,
  Eye,
  Trash2,
  ArrowRight,
  Compass,
  Sparkles,
  Lock,
} from "lucide-react";
import type { Photo } from "@/types/photo";

export default function FavoritesPage() {
  const { isLoggedIn, login } = useAuth();
  const { photos, favorites, toggleLike, getLikesCount } = usePhotos();
  const { toast } = useToast();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter photos that are in the user's favorites
  const favoritePhotos = photos.filter((p) => favorites.includes(p.id));

  const handleRemoveFavorite = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    toggleLike(photoId);
    toast.info("ফেভারিট তালিকা থেকে সরানো হয়েছে");
  };

  const handleDownloadOriginal = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warning("ছবি ডাউনলোড করতে অনুগ্রহ করে লগইন করুন!");
      return;
    }
    toast.info("মূল কোয়ালিটিতে ছবি ডাউনলোড শুরু হচ্ছে...");
    try {
      const res = await fetch(photo.image);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const ext = photo.image.split(".").pop()?.split("?")[0] || "jpg";
      const filename = `${photo.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_original.${ext}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("✅ মূল কোয়ালিটির ছবি ডাউনলোড সম্পন্ন হয়েছে!");
    } catch {
      const a = document.createElement("a");
      a.href = photo.image;
      a.download = `${photo.title}_original.jpg`;
      a.target = "_blank";
      a.click();
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[#121422]/90 p-8 text-center backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">
            <Heart className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            Personal Bookmarks
          </span>
          <h1 className="mt-2 text-2xl font-black text-white">
            Sign In to Access Favorites
          </h1>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            Your favorites are synchronized across your devices. Sign in with Google or your account to view and manage your curated collection.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/signin"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all text-center"
            >
              Sign In to View Favorites
            </Link>
            <Link
              href="/explore"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/10 text-center"
            >
              Browse Explore Gallery
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.08] dark:border-white/[0.08] pb-6 sm:pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-widest mb-3">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" />
            <span>Curated Collection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            My <span className="text-gradient-purple">Favorites</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
            You have saved {favoritePhotos.length} {favoritePhotos.length === 1 ? "frame" : "frames"} to your personal sanctuary
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121422] px-5 py-2.5 text-xs font-semibold text-slate-800 dark:text-gray-200 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-white transition-all self-start md:self-auto shadow-sm"
        >
          <Compass className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span>Discover More Frames</span>
        </Link>
      </div>

      {/* Content Grid */}
      {favoritePhotos.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            type="favorites"
            title="Your favorites collection is empty"
            description="You haven't bookmarked any photographs yet. Explore our curated photography albums and click the heart icon to save frames here."
            actionText="Discover Beautiful Photos"
            actionHref="/explore"
          />
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {favoritePhotos.map((photo, index) => {
            const currentLikes = getLikesCount(photo.id);

            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#121422]/70 backdrop-blur-xl transition-all duration-300 hover:border-rose-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-600/10 flex flex-col justify-between shadow-sm"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-black/10 to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 sm:top-3.5 sm:inset-x-3.5 flex items-center justify-between">
                    <span className="rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold text-purple-300 keep-white">
                      {photo.category}
                    </span>

                    {/* Remove from favorites button */}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFavorite(e, photo.id)}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-rose-500/90 text-white backdrop-blur-md border border-rose-400 hover:scale-110 transition-transform shadow-lg keep-white"
                      title="Remove from Favorites"
                    >
                      <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white text-white" />
                    </button>
                  </div>

                  {/* Bottom details & quick actions */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 photo-card-overlay">
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-[11px] sm:text-xs font-bold text-white drop-shadow-md truncate keep-white">
                          {photo.title}
                        </h2>
                        <p className="text-[9px] sm:text-[10px] text-gray-300 drop-shadow-sm truncate keep-white">
                          {photo.location || photo.folder || "Bangladesh"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Download button */}
                        <button
                          type="button"
                          onClick={(e) => handleDownloadOriginal(e, photo)}
                          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-black/60 text-gray-200 border border-white/10 hover:bg-purple-600 hover:text-white transition-colors keep-white"
                          title="Download Original Quality"
                        >
                          <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>

                        {/* Detail Link */}
                        <Link
                          href={`/photos/${photo.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-black/60 text-gray-200 border border-white/10 hover:bg-purple-600 hover:text-white transition-colors keep-white"
                          title="Open Details Page"
                        >
                          <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal
          photos={favoritePhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}
    </main>
  );
}
