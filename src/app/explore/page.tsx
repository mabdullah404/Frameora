"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Photo } from "@/types/photo";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";
import LightboxModal from "@/components/LightboxModal";
import UserAvatar from "@/components/UserAvatar";
import EmptyState from "@/components/EmptyState";
import {
  Search,
  Heart,
  ChevronDown,
  Lock,
  Sparkles,
  SlidersHorizontal,
  Compass,
  UploadCloud,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const { isLoggedIn, user, role } = useAuth();
  const { photos, favorites, isFavorite, toggleLike, getLikesCount, openUploadModal } = usePhotos();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialTab === "favorites" ? "Favorites" : "All"
  );
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "likes">("latest");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLockedModal, setShowLockedModal] = useState(false);

  // Category pills with real Favorites badge and rich categories
  const categoryPills = [
    { id: "All", label: "All", emoji: "" },
    { id: "Favorites", label: `Favorites (${favorites.length})`, emoji: "❤️" },
    { id: "Nature", label: "Nature & Landscape", emoji: "🌿" },
    { id: "travel", label: "Travel & Scenic", emoji: "✈️" },
    { id: "Portrait", label: "Portrait", emoji: "👤" },
    { id: "Urban", label: "Street & Urban", emoji: "🏙️" },
    { id: "Wildlife", label: "Wildlife", emoji: "🐾" },
    { id: "Abstract", label: "Abstract", emoji: "🌀" },
    { id: "BUBT", label: "Campus Life", emoji: "🎓", memberOnly: true },
    { id: "Memorise", label: "Memories", emoji: "📸", memberOnly: true },
    { id: "Mems", label: "Funny Mems", emoji: "😂", memberOnly: true },
    { id: "Others", label: "More", emoji: "🔲" },
  ];

  // Filter accessible photos based on auth status and strict privacy
  const accessiblePhotos = useMemo(() => {
    // Exclude any private photo from public explore unless it belongs to the viewing uploader
    const publicOrOwn = photos.filter((p) => {
      if (!p.isPrivate) return true;
      if (isLoggedIn && user?.email && p.uploaderEmail?.toLowerCase() === user.email.toLowerCase()) return true;
      if (isLoggedIn && user?.id && p.uploaderId === user.id) return true;
      return false;
    });

    if (!isLoggedIn) {
      // Unauthenticated visitors strictly see public photography & nature
      return publicOrOwn.filter(
        (p) => p.folder === "Photography" || p.category === "Photography" || p.category === "Nature"
      );
    }
    return publicOrOwn;
  }, [photos, isLoggedIn, user]);

  // Filtered and Sorted photos based on search, category and sort order
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    const result = accessiblePhotos.filter((photo) => {
      const matchesSearch =
        !query ||
        photo.title.toLowerCase().includes(query) ||
        photo.category.toLowerCase().includes(query) ||
        (photo.location && photo.location.toLowerCase().includes(query)) ||
        (photo.funTag && photo.funTag.toLowerCase().includes(query));

      let matchesCat = true;
      if (selectedCategory === "Favorites") {
        matchesCat = isFavorite(photo.id);
      } else if (selectedCategory !== "All") {
        if (selectedCategory === "Others") {
          matchesCat = photo.category !== "Nature" && photo.category !== "travel";
        } else if (selectedCategory === "Nature") {
          matchesCat = photo.category === "Nature" || photo.category === "Photography";
        } else if (selectedCategory === "Memorise") {
          matchesCat = photo.folder === "Memorise" || photo.category === "Memories";
        } else if (selectedCategory === "Abstract") {
          matchesCat = photo.category.toLowerCase() === "abstract" || photo.category === "Art";
        } else {
          matchesCat =
            photo.category.toLowerCase() === selectedCategory.toLowerCase() ||
            photo.folder?.toLowerCase() === selectedCategory.toLowerCase();
        }
      }

      return matchesSearch && matchesCat;
    });

    // Apply sorting
    if (sortBy === "likes") {
      result.sort((a, b) => getLikesCount(b.id) - getLikesCount(a.id));
    } else if (sortBy === "oldest") {
      result.reverse();
    }
    // "latest" keeps default chronological / newest order

    return result;
  }, [accessiblePhotos, searchTerm, selectedCategory, isFavorite, sortBy, getLikesCount]);

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCategorySelect = (catId: string, isMemberOnly?: boolean) => {
    if (isMemberOnly && !isLoggedIn) {
      toast.warning("এই অ্যালবামটি দেখতে অনুগ্রহ করে লগইন বা সাইন আপ করুন।");
      setShowLockedModal(true);
      return;
    }
    setSelectedCategory(catId);
  };

  const handleLikePhoto = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warning("ছবি ফেভারিটে যুক্ত করতে অনুগ্রহ করে লগইন করুন!");
      setShowLockedModal(true);
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

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.08] dark:border-white/[0.08] pb-6 sm:pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-widest mb-2.5">
            <Compass className="h-3.5 w-3.5" />
            <span>Curated Sanctuary</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore <span className="text-gradient-purple">Photography</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
            Real collection of {photos.length} captures by Md. Abdullah Al Mamun
          </p>
        </div>

        {/* Search Bar + Category Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Real Upload Button if logged in */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={openUploadModal}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:brightness-110 keep-white"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Photo</span>
            </button>
          )}

          {/* Search Input */}
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121422] pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 shadow-sm backdrop-blur-xl focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              aria-label="Sort Photos"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121422] pl-3.5 pr-8 py-2.5 text-xs font-semibold text-slate-800 dark:text-gray-200 shadow-sm backdrop-blur-xl focus:border-purple-500 focus:outline-none hover:border-purple-500/40 cursor-pointer"
            >
              <option value="latest" className="bg-white dark:bg-[#121422] text-slate-900 dark:text-white">Latest Uploads</option>
              <option value="oldest" className="bg-white dark:bg-[#121422] text-slate-900 dark:text-white">Oldest Captures</option>
              <option value="likes" className="bg-white dark:bg-[#121422] text-slate-900 dark:text-white">Most Liked ❤️</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-gray-400" />
          </div>

          {/* Quick Clear or Favorites Toggle */}
          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === "Favorites" ? "All" : "Favorites")}
            className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 text-xs font-semibold transition-all shadow-sm ${
              selectedCategory === "Favorites"
                ? "bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/50 text-rose-600 dark:text-rose-400"
                : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#121422] text-slate-700 dark:text-gray-200 hover:border-purple-500/50"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${selectedCategory === "Favorites" ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" : "text-slate-400 dark:text-gray-400"}`} />
            <span>Favorites ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categoryPills.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id, cat.memberOnly)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 glow-purple-sm keep-white"
                  : "border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121422]/60 text-slate-700 dark:text-gray-300 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-white shadow-sm"
              }`}
            >
              {cat.emoji && <span>{cat.emoji}</span>}
              <span>{cat.label}</span>
              {cat.memberOnly && !isLoggedIn && (
                <Lock className="h-3 w-3 text-amber-500 dark:text-amber-400 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Guest Mode Notice banner if not logged in */}
      {!isLoggedIn && (
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 px-4 py-3.5 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-0">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-950 dark:text-purple-100">
                🔒 আপনি বর্তমানে উন্মুক্ত ফটোগ্রাফির {accessiblePhotos.length}টি ফ্রেম দেখছেন
              </p>
              <p className="mt-0.5 text-[11px] text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                ট্যুর, ক্যাম্পাস লাইফ, মেমোরিজ ও প্রাইভেট কালেকশন দেখতে এবং ফুল-রেজুলেশন ছবি ডাউনলোড করতে সাইন ইন করুন।
              </p>
            </div>
          </div>
          <Link
            href="/signin"
            className="self-start sm:self-auto shrink-0 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition-all keep-white"
          >
            লগইন করে সব আনলক করুন ({photos.length}) →
          </Link>
        </div>
      )}

      {/* Showing count text */}
      <div className="mt-5 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
        <span>Showing {filteredPhotos.length} of {accessiblePhotos.length} photos</span>
        {selectedCategory === "Favorites" && favorites.length === 0 && (
          <span className="text-amber-500 dark:text-amber-400">No favorites saved yet. Click the heart icon on any photo!</span>
        )}
      </div>

      {/* Photo Grid: 2 Columns on Mobile, 3-4 Columns on Desktop with Natural 4/3 Aspect Ratio */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {filteredPhotos.map((photo, index) => {
          const userHasLiked = isFavorite(photo.id);
          const currentLikes = getLikesCount(photo.id);

          return (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(index)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#121422]/70 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/15"
            >
              {/* Photo Image - Balanced Aspect Ratio with focal top/center */}
              <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-black/10 to-black/30" />

                {/* Top-Right Heart Button */}
                <button
                  type="button"
                  onClick={(e) => handleLikePhoto(e, photo.id)}
                  className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
                    userHasLiked
                      ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-105 keep-white"
                      : "bg-black/40 text-white border-white/20 hover:bg-rose-500/80 keep-white"
                  }`}
                  title={userHasLiked ? "Remove from Favorites" : "Save to Favorites"}
                >
                  <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${userHasLiked ? "fill-white" : ""}`} />
                </button>

                {/* Category badge */}
                <span className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-purple-300 keep-white">
                  {photo.category}
                </span>

                {/* Bottom Overlay: Photographer & Title */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 flex items-center justify-between photo-card-overlay">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <UserAvatar
                      src={photo.photographer === "Abdullah" || photo.photographer?.includes("Mamun") ? "/images/Abdullah/FB_IMG_1790540440153.jpg" : undefined}
                      name={photo.photographer || "Creator"}
                      size="xs"
                      className="border border-purple-500/40 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] sm:text-xs font-bold text-white drop-shadow-md truncate keep-white">
                        {photo.photographer || "Abdullah"}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-gray-300 line-clamp-1 drop-shadow-sm truncate keep-white">
                        {photo.title}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-semibold text-gray-200 bg-black/50 px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 shrink-0 keep-white">
                    ❤️ {currentLikes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div className="mt-12">
          <EmptyState
            type={selectedCategory === "Favorites" ? "favorites" : "search"}
            title={selectedCategory === "Favorites" ? "No favorite photos collected yet" : `No frames matched "${searchTerm}"`}
            description={
              selectedCategory === "Favorites"
                ? "Click the heart button on any photo in the gallery to collect them into your personal favorites!"
                : "We couldn't find any photographs matching your current search and filters. Try adjusting terms or exploring other categories."
            }
            actionText="Reset All Filters"
            onAction={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
          />
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {/* Locked Feature Modal for Visitors */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-purple-500/30 bg-[#121422] p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">প্রাইভেট মেম্বার অ্যালবাম</h3>
            <p className="mt-2 text-xs text-gray-300 leading-relaxed">
              সিলেট ও টাঙ্গাইল ভ্রমণ, BUBT ক্যাম্পাস লাইফ এবং মেমোরিজ অ্যালবামগুলো দেখতে এবং ছবি ফেভারিট করতে অনুগ্রহ করে লগইন করুন।
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/signin"
                className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 shadow-md shadow-purple-600/30"
              >
                লগইন করুন (Sign In)
              </Link>
              <Link
                href="/signup"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10"
              >
                ফ্রি অ্যাকাউন্ট তৈরি করুন
              </Link>
              <button
                type="button"
                onClick={() => setShowLockedModal(false)}
                className="w-full rounded-xl border border-white/5 py-2 text-xs text-gray-400 hover:text-white"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen text-center py-20 text-gray-400">Loading Explore...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
