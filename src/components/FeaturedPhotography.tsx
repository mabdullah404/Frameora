"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";
import LightboxModal from "@/components/LightboxModal";
import {
  Heart,
  Lock,
  Compass,
  ArrowRight,
  Sparkles,
  Camera,
  UploadCloud,
  ShieldCheck,
  FolderOpen,
} from "lucide-react";

export default function FeaturedPhotography() {
  const { isLoggedIn, user } = useAuth();
  const { photos, isFavorite, toggleLike, getLikesCount } = usePhotos();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Photography folder photos (always accessible publicly to visitors)
  const photographyPhotos = useMemo(() => {
    return photos.filter((p) => p.folder === "Photography" || p.category === "Photography");
  }, [photos]);

  // Categories available depending on auth state
  const categories = useMemo(() => {
    if (!isLoggedIn) {
      return ["Photography"];
    }
    return ["All", "Photography", "travel", "BUBT", "Memorise", "Mems"];
  }, [isLoggedIn]);

  const displayedPhotos = useMemo(() => {
    if (!isLoggedIn) {
      // Unauthenticated visitors strictly see photography images only
      return photographyPhotos;
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
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 uppercase tracking-widest mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Curated by Abdullah</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Curated <span className="text-gradient-purple">Photography</span>
          </h2>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-gray-400">
            {!isLoggedIn
              ? "বর্তমানে আপনি উন্মুক্ত ফটোগ্রাফি ফ্রেমগুলো দেখছেন। ভ্রমণ, ক্যাম্পাস লাইফ ও অন্যান্য অ্যালবাম দেখতে লগইন করুন।"
              : `স্বাগতম, ${user?.name || "Member"}! আপনার জন্য সকল কালেকশন এবং ছবি আপলোড ফিচার উন্মুক্ত রয়েছে।`}
          </p>
        </div>

        {/* View All link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all self-start md:self-auto"
        >
          <span>{isLoggedIn ? `Explore All (${photos.length})` : "Explore Gallery"}</span>
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
              {cat === "Photography" ? "Public Photography" : cat}
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

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={(e) => handleLikeClick(e, photo.id)}
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

      {/* Bangla Onboarding & Feature Explanation Banner for Visitors */}
      {!isLoggedIn && (
        <div className="mt-14 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#181432]/90 via-[#101124]/90 to-[#0c0d18]/95 p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl backdrop-blur-2xl">
          {/* Top ambient glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-36 bg-purple-600/20 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 border border-purple-500/40 px-4 py-1.5 text-xs font-semibold text-purple-200 mb-4 shadow-sm">
              <Sparkles className="h-4 w-4 text-purple-300" />
              <span>ফ্রেমওরা (Frameora) প্ল্যাটফর্মে আপনাকে স্বাগতম!</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              সকল প্রিমিয়াম ফিচার ও প্রাইভেট অ্যালবাম আনলক করুন
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
              বর্তমানে আপনি ভিজিটর হিসেবে শুধুমাত্র উন্মুক্ত <strong className="text-purple-300">ফটোগ্রাফি</strong> সেকশনের ছবিগুলো উপভোগ করছেন। সিলেট ও টাঙ্গাইল ভ্রমণ, বিইউবিটি ক্যাম্পাস জীবন, গোল্ডেন মেমোরিজ এবং মেমস স্কোয়াডের শত শত এক্সক্লুসিভ ছবি দেখতে এবং নিজের ছবি আপলোড করতে নিচে থেকে খুব সহজেই <strong className="text-white">সাইন ইন</strong> অথবা <strong className="text-white">ফ্রি অ্যাকাউন্ট</strong> তৈরি করুন।
            </p>

            {/* Feature Highlight Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 mb-3">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white">৬টি প্রাইভেট অ্যালবাম</h4>
                <p className="mt-1 text-[11px] text-gray-400 leading-relaxed">
                  ট্রাভেল, ক্যাম্পাস, মেমোরিজ ও মেমস স্কোয়াডের শত শত ছবি আনলক হবে।
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white">ফটো আপলোড ও শেয়ার</h4>
                <p className="mt-1 text-[11px] text-gray-400 leading-relaxed">
                  আপনার নিজস্ব তোলা ছবি সরাসরি ক্লাউড সার্ভারে নিরাপদে সেভ করতে পারবেন।
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 mb-3">
                  <Heart className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white">পার্সোনাল ফেভারিট</h4>
                <p className="mt-1 text-[11px] text-gray-400 leading-relaxed">
                  পছন্দের মুহূর্তগুলোতে লাভ (❤️) দিয়ে নিজস্ব ফেভারিট কালেকশন সাজান।
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white">নিরাপদ ও বিজ্ঞাপনমুক্ত</h4>
                <p className="mt-1 text-[11px] text-gray-400 leading-relaxed">
                  সম্পূর্ণ ফ্রেশ, ফাস্ট এবং উচ্চমানের ভিজ্যুয়াল স্টোরি এক্সপেরিয়েন্স।
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/signin"
                className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
              >
                লগইন করুন (Sign In)
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-xs sm:text-sm font-semibold text-gray-200 hover:bg-white/10 hover:text-white transition-all"
              >
                ফ্রি অ্যাকাউন্ট তৈরি করুন
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
