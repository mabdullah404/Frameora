"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";
import LightboxModal from "@/components/LightboxModal";
import EmptyState from "@/components/EmptyState";
import {
  FolderOpen,
  ArrowLeft,
  Lock,
  Heart,
  Eye,
  Download,
  Calendar,
  Sparkles,
  Camera,
} from "lucide-react";
import type { Photo } from "@/types/photo";

interface AlbumMeta {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  category: string;
  folder: string;
  memberOnly?: boolean;
  dateRange: string;
}

const ALBUM_DEFINITIONS: AlbumMeta[] = [
  {
    id: "nature",
    title: "Nature & Landscapes",
    subtitle: "Untamed Horizons & Natural Light",
    description: "Serene mornings, rolling hills, water lilies, and atmospheric landscapes captured across Bangladesh.",
    cover: "/images/hero-landscape.jpg",
    category: "Nature",
    folder: "Photography",
    dateRange: "2023 – 2026",
  },
  {
    id: "travel",
    title: "Sylhet & Tangail Travel",
    subtitle: "Journeys Through Emerald Waters",
    description: "Visual chronicles across Ratargul swamp forest, Jaflong rivers, and Tangail heritage vistas.",
    cover: "/images/travel/Shylet/IMG_5879.JPG",
    category: "travel",
    folder: "travel",
    dateRange: "2024 – 2026",
  },
  {
    id: "campus",
    title: "BUBT Campus Life",
    subtitle: "The University Chronicles",
    description: "Academic corridors, golden hour campus walks, friendship, and everyday university spirit.",
    cover: "/images/BUBT/IMG_2807.JPG",
    category: "BUBT",
    folder: "BUBT",
    memberOnly: true,
    dateRange: "2022 – 2026",
  },
  {
    id: "memories",
    title: "Golden Memories",
    subtitle: "Unforgettable Milestones",
    description: "Candid portraits, spontaneous laughter, gatherings, and nostalgia preserved in time.",
    cover: "/images/Memorise/IMG_0079.JPG",
    category: "Memorise",
    folder: "Memorise",
    memberOnly: true,
    dateRange: "2021 – 2026",
  },
  {
    id: "brotherhood",
    title: "Brotherhood & Group",
    subtitle: "Bond That Transcends Time",
    description: "Gatherings, group expeditions, celebrations, and solidarity with brothers and close companions.",
    cover: "/images/Group-Photo/IMG_2285.JPG",
    category: "Group-Photo",
    folder: "Group-Photo",
    memberOnly: true,
    dateRange: "2023 – 2026",
  },
  {
    id: "mems",
    title: "Funny Mems Squad",
    subtitle: "Raw Smiles & Unfiltered Joy",
    description: "Lighthearted captures, comedic expressions, and unscripted spontaneous fun.",
    cover: "/images/Mems/IMG_0026.JPG",
    category: "Mems",
    folder: "Mems",
    memberOnly: true,
    dateRange: "2023 – 2026",
  },
];

function AlbumsContent() {
  const searchParams = useSearchParams();
  const initialAlbumId = searchParams.get("album");
  const { isLoggedIn } = useAuth();
  const { photos, isFavorite, toggleLike, getLikesCount } = usePhotos();
  const { toast } = useToast();

  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(initialAlbumId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Calculate album photo counts dynamically
  const albumsWithCounts = useMemo(() => {
    return ALBUM_DEFINITIONS.map((album) => {
      const count = photos.filter((p) => {
        if (album.id === "nature") {
          return p.folder === "Photography" || p.category === "Nature";
        }
        if (album.id === "travel") {
          return p.folder?.startsWith("travel") || p.category.toLowerCase() === "travel";
        }
        return p.folder === album.folder || p.category === album.category;
      }).length;
      return { ...album, count };
    });
  }, [photos]);

  const activeAlbum = albumsWithCounts.find((a) => a.id === selectedAlbumId);

  // Photos belonging to the active selected album
  const albumPhotos = useMemo(() => {
    if (!activeAlbum) return [];
    return photos.filter((p) => {
      if (activeAlbum.id === "nature") {
        return p.folder === "Photography" || p.category === "Nature";
      }
      if (activeAlbum.id === "travel") {
        return p.folder?.startsWith("travel") || p.category.toLowerCase() === "travel";
      }
      return p.folder === activeAlbum.folder || p.category === activeAlbum.category;
    });
  }, [photos, activeAlbum]);

  const handleSelectAlbum = (album: (typeof albumsWithCounts)[0]) => {
    if (album.memberOnly && !isLoggedIn) {
      toast.warning("🔒 এই অ্যালবামটি শুধুমাত্র রেজিস্টার্ড মেম্বারদের জন্য। অনুগ্রহ করে সাইন ইন করুন।");
      return;
    }
    setSelectedAlbumId(album.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPhoto = async (e: React.MouseEvent, photo: Photo) => {
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

  const handleToggleLike = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warning("ছবি ফেভারিটে যুক্ত করতে অনুগ্রহ করে লগইন করুন!");
      return;
    }
    const alreadyLiked = isFavorite(photoId);
    toggleLike(photoId);
    if (alreadyLiked) {
      toast.info("ফেভারিট থেকে সরানো হয়েছে");
    } else {
      toast.success("❤️ ফেভারিটে যোগ করা হয়েছে!");
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* If Inside a Specific Album View */}
      {activeAlbum ? (
        <div>
          {/* Breadcrumb & Back Button */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
            <button
              type="button"
              onClick={() => setSelectedAlbumId(null)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Albums</span>
            </button>

            <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-semibold">
              {albumPhotos.length} Photographs
            </span>
          </div>

          {/* Album Banner */}
          <div className="relative mt-8 rounded-3xl overflow-hidden border border-white/10 bg-[#121422] p-6 sm:p-10 shadow-2xl">
            <div className="absolute inset-0 z-0">
              <Image
                src={activeAlbum.cover}
                alt={activeAlbum.title}
                fill
                priority
                className="object-cover blur-2xl opacity-20 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-[#121422]/90 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-300">
                {activeAlbum.dateRange}
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white">
                {activeAlbum.title}
              </h1>
              <p className="mt-1 text-sm font-semibold text-purple-200">
                {activeAlbum.subtitle}
              </p>
              <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                {activeAlbum.description}
              </p>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {albumPhotos.map((photo, index) => {
              const userHasLiked = isFavorite(photo.id);
              const currentLikes = getLikesCount(photo.id);

              return (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#121422]/70 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/15 shadow-sm"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-black/10 to-black/30" />

                    <div className="absolute top-2.5 inset-x-2.5 sm:top-3.5 sm:inset-x-3.5 flex items-center justify-between">
                      <span className="rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold text-purple-300 keep-white">
                        {photo.category}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(e, photo.id)}
                        className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md border transition-all keep-white ${
                          userHasLiked
                            ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-105"
                            : "bg-black/40 text-white border-white/20 hover:bg-rose-500/80"
                        }`}
                        title={userHasLiked ? "Remove from Favorites" : "Save to Favorites"}
                      >
                        <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${userHasLiked ? "fill-white" : ""}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 photo-card-overlay">
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-[11px] sm:text-xs font-bold text-white drop-shadow-md truncate keep-white">
                            {photo.title}
                          </h2>
                          <p className="text-[9px] sm:text-[10px] text-gray-300 drop-shadow-sm truncate keep-white">
                            {photo.location || photo.folder}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleDownloadPhoto(e, photo)}
                            className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-black/60 text-gray-200 border border-white/10 hover:bg-purple-600 hover:text-white transition-colors keep-white"
                            title="Download Original Quality"
                          >
                            <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>

                          <Link
                            href={`/photos/${photo.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-black/60 text-gray-200 border border-white/10 hover:bg-purple-600 hover:text-white transition-colors keep-white"
                            title="Open Details"
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

          {albumPhotos.length === 0 && (
            <div className="mt-12">
              <EmptyState
                type="albums"
                title="No photos in this album yet"
                description="This album is ready for photography frames to be added."
                actionText="Back to All Albums"
                onAction={() => setSelectedAlbumId(null)}
              />
            </div>
          )}
        </div>
      ) : (
        /* Albums Overview Page */
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.08] dark:border-white/[0.08] pb-6 sm:pb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-widest mb-3">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Curated Portfolios</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Photo <span className="text-gradient-purple">Albums</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                Explore structured photo essays and memory vaults by Md. Abdullah Al Mamun
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121422] px-5 py-2.5 text-xs font-semibold text-slate-800 dark:text-gray-200 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-white transition-all self-start md:self-auto shadow-sm"
            >
              <Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Explore All {photos.length} Frames</span>
            </Link>
          </div>

          {/* Guest Unlock Notice */}
          {!isLoggedIn && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 px-5 py-3.5 shadow-sm">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-0">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-950 dark:text-purple-100">
                    🔒 ক্যাম্পাস লাইফ, গোল্ডেন মেমোরিজ এবং ব্রাদারহুড অ্যালবামগুলো দেখতে সাইন ইন করুন
                  </p>
                  <p className="mt-0.5 text-[11px] text-purple-800/80 dark:text-purple-300/80">
                    সাইন ইন করলেই সকল প্রাইভেট কালেকশন আনলক হবে এবং নিজস্ব ফ্রেম আপলোড ও বুকমার্ক করতে পারবেন।
                  </p>
                </div>
              </div>
              <Link
                href="/signin"
                className="self-start sm:self-auto shrink-0 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition-all keep-white"
              >
                লগইন করে আনলক করুন →
              </Link>
            </div>
          )}

          {/* Albums Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albumsWithCounts.map((album) => {
              const isLocked = Boolean(album.memberOnly && !isLoggedIn);

              return (
                <div
                  key={album.id}
                  onClick={() => handleSelectAlbum(album)}
                  className={`group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 cursor-pointer ${
                    isLocked
                      ? "border-white/[0.08] bg-[#121422]/60 hover:border-purple-500/30"
                      : "border-white/[0.08] bg-[#121422]/80 hover:border-purple-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/20"
                  }`}
                >
                  {/* Album Cover */}
                  <div className="relative h-56 w-full overflow-hidden bg-black/40">
                    <Image
                      src={album.cover}
                      alt={album.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover transition-transform duration-700 ${
                        isLocked ? "blur-[2px] opacity-75" : "group-hover:scale-105"
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-[#121422]/40 to-transparent" />

                    {/* Top Status */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                      <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-[11px] font-semibold text-purple-300">
                        {album.count} Photos
                      </span>

                      {isLocked ? (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md">
                          <Lock className="h-3 w-3" />
                          <span>Members Only</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-300 bg-black/50 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md font-medium">
                          {album.dateRange}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {album.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-purple-300/80">
                      {album.subtitle}
                    </p>
                    <p className="mt-2 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>{isLocked ? "Sign in to Unlock" : "View Collection"}</span>
                        <span>→</span>
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {album.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal
          photos={albumPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}
    </main>
  );
}

export default function AlbumsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl p-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-400">Loading album portfolios...</p>
        </div>
      }
    >
      <AlbumsContent />
    </Suspense>
  );
}
