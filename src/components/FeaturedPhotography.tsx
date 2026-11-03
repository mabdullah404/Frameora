"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";
import LightboxModal from "@/components/LightboxModal";
import UserAvatar from "@/components/UserAvatar";
import {
  Heart,
  Compass,
  ArrowRight,
  Sparkles,
  Camera,
  UploadCloud,
  ShieldCheck,
  FolderOpen,
} from "lucide-react";

export default function FeaturedPhotography() {
  const { isLoggedIn } = useAuth();
  const { photos, isFavorite, toggleLike, getLikesCount } = usePhotos();
  const { toast } = useToast();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Exactly 6 curated featured photographs
  const featuredPhotos = useMemo(() => {
    // Select 6 prime landscape and nature captures for the portfolio showcase
    const publicPhotos = photos.filter((p) => p.folder === "Photography" || p.category === "Nature");
    return (publicPhotos.length >= 6 ? publicPhotos : photos).slice(0, 6);
  }, [photos]);

  const handleCardClick = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const handleLikeClick = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warning("ছবি ফেভারিটে যুক্ত করতে অনুগ্রহ করে সাইন ইন বা অ্যাকাউন্ট তৈরি করুন!");
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
    <section
      id="explore-preview"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 uppercase tracking-widest mb-2.5">
            <Compass className="h-3.5 w-3.5" />
            <span>Curated Showcase</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            Featured <span className="text-gradient-purple">Photography</span>
          </h2>

          <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-gray-400">
            A handpicked preview of authentic landscapes, light, and natural harmony.
          </p>
        </div>

        {/* View All link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors self-start sm:self-auto"
        >
          <span>View All {photos.length} Frames</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 6 Curated Photo Cards with Natural Aspect Ratio */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPhotos.map((photo, index) => {
          const isLiked = isFavorite(photo.id);
          const currentLikes = getLikesCount(photo.id);

          return (
            <div
              key={photo.id}
              onClick={() => handleCardClick(index)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/[0.08] bg-[#121422]/70 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/15"
            >
              {/* Image with balanced aspect ratio and top focal alignment */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-black/10 to-black/30" />

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={(e) => handleLikeClick(e, photo.id)}
                  className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
                    isLiked
                      ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-110"
                      : "bg-black/40 text-white border-white/20 hover:bg-rose-500/80"
                  }`}
                  title={isLiked ? "Saved in Favorites" : "Add to Favorites"}
                >
                  <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-white" : ""}`} />
                </button>

                {/* Tag */}
                <span className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300">
                  {photo.category}
                </span>

                {/* Bottom Overlay: Photographer & Title */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-center justify-between photo-card-overlay">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserAvatar
                      src={photo.photographer === "Abdullah" || photo.photographer?.includes("Mamun") ? "/images/Abdullah/FB_IMG_1790540440153.jpg" : undefined}
                      name={photo.photographer || "Creator"}
                      size="xs"
                      className="border border-purple-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {photo.photographer || "Abdullah"}
                      </p>
                      <p className="text-[10px] text-gray-300 truncate">{photo.title}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-gray-200 bg-black/50 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                    ❤️ {currentLikes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Explore All Photos CTA Button */}
      <div className="mt-10 text-center">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
        >
          <Camera className="h-4 w-4" />
          <span>Explore All {photos.length} Photographs</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Visitor Onboarding Banner */}
      {!isLoggedIn && (
        <div className="mt-14 rounded-3xl border border-purple-500/30 bg-[#121422]/80 p-6 sm:p-8 text-center relative overflow-hidden shadow-xl backdrop-blur-xl">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-3.5 py-1 text-xs font-semibold text-purple-300 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ফ্রেমওরায় স্বাগতম</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              সকল প্রাইভেট অ্যালবাম ও ডাউনলোড সুবিধা আনলক করুন
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
              ট্রাভেল কালেকশন, বিইউবিটি ক্যাম্পাস জীবন, গোল্ডেন মেমোরিজ এবং ফুল-রেজোলিউশন ডাউনলোড উপভোগ করতে এখনই ফ্রেমওরায় সাইন ইন করুন।
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signin"
                className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all"
              >
                লগইন করুন (Sign In)
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
              >
                ফ্রি অ্যাকাউন্ট তৈরি করুন
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photos={featuredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}
