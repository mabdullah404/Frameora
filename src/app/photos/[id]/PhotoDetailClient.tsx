"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";
import UserAvatar from "@/components/UserAvatar";
import LightboxModal from "@/components/LightboxModal";
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Lock,
  MapPin,
  Check,
  Maximize2,
  Calendar,
  FolderOpen,
  Camera,
  Shield,
  Tag,
} from "lucide-react";

export default function PhotoDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();
  const { photos, isFavorite, toggleLike, getLikesCount } = usePhotos();
  const { toast } = useToast();

  const photo = photos.find((p) => p.id === id);

  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    love: 124,
    fire: 48,
    laugh: 26,
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/explore");
    }
  };

  if (!photo) {
    return notFound();
  }

  // Check if guest is trying to access a non-Photography photo
  const isRestricted = !isLoggedIn && photo.folder !== "Photography" && photo.category !== "Nature";

  const handleReact = (type: string) => {
    if (userReaction === type) {
      setUserReaction(null);
      setReactions((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    } else {
      setUserReaction(type);
      setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      toast.success("✨ রিঅ্যাকশন যোগ করা হয়েছে!");
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const shareData = {
        title: `${photo.title} — Frameora`,
        text: `Check out this photograph "${photo.title}" on Frameora`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          toast.success("✅ শেয়ার সম্পন্ন হয়েছে!");
          return;
        } catch (err: any) {
          if (err.name === "AbortError") return;
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("🔗 ছবির লিঙ্ক ক্লিপবোর্ডে কপি হয়েছে!");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        toast.info("লিঙ্ক: " + window.location.href);
      }
    }
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      toast.warning("ছবি ফেভারিটে যুক্ত করতে অনুগ্রহ করে লগইন করুন!");
      return;
    }
    const alreadyLiked = isFavorite(photo.id);
    toggleLike(photo.id);
    if (alreadyLiked) {
      toast.info("ফেভারিট থেকে সরানো হয়েছে");
    } else {
      toast.success("❤️ ফেভারিটে যোগ করা হয়েছে!");
    }
  };

  const handleDownloadOriginal = async () => {
    if (!isLoggedIn) {
      toast.warning("ছবি ডাউনলোড করতে অনুগ্রহ করে লগইন করুন!");
      return;
    }
    toast.info("মূল কোয়ালিটিতে ছবি ডাউনলোড শুরু হচ্ছে...");
    try {
      const res = await fetch(photo.image);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const ext = photo.image.split(".").pop()?.split("?")[0] || "jpg";
      const filename = `${photo.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_original.${ext}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("✅ মূল কোয়ালিটির ছবি ডাউনলোড সম্পন্ন হয়েছে!");
    } catch {
      const link = document.createElement("a");
      link.href = photo.image;
      link.download = `${photo.title}_original.jpg`;
      link.target = "_blank";
      link.click();
    }
  };

  const userHasLiked = isFavorite(photo.id);
  const currentLikes = getLikesCount(photo.id);

  // Related photos from the same folder
  const relatedPhotos = photos
    .filter(
      (p) =>
        p.id !== photo.id &&
        p.folder === photo.folder
    )
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Top Breadcrumb & Navigation with Smart Back Button */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/10 hover:border-purple-500/40 transition-all shadow-sm active:scale-95"
          title="Return to previous gallery page"
        >
          <ArrowLeft className="h-4 w-4 text-purple-400" />
          <span>← Back to Gallery</span>
        </button>

        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs text-purple-300 font-medium">
          Album: <strong className="text-white capitalize">{photo.category || photo.folder}</strong>
        </span>
      </div>

      {/* If Restricted (Guest trying to view member photo) */}
      {isRestricted ? (
        <div className="mt-10 rounded-3xl border border-purple-500/30 bg-[#121422]/90 p-8 text-center backdrop-blur-xl shadow-2xl sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-6">
            <Lock className="h-8 w-8" />
          </div>

          <span className="inline-block rounded-full bg-purple-500/10 border border-purple-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
            Member-Only Frame
          </span>

          <h1 className="mt-4 text-2xl font-black text-white sm:text-4xl">
            This Frame is Locked for Guests
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-gray-300 leading-relaxed">
            This photo belongs to the <strong>{photo.folder}</strong> collection. Sign in with Google or use the 1-click Demo bypass to unlock all {photos.length} original frames.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signin"
              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110"
            >
              Sign In to Unlock
            </Link>

            <button
              type="button"
              onClick={() => login("user")}
              className="rounded-full border border-purple-500/40 bg-purple-600/10 px-6 py-3 text-xs font-semibold text-purple-300 hover:bg-purple-600/20"
            >
              ⚡ Instant Member Bypass (1-Click)
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {/* Main Photo Card */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#121422] shadow-2xl">
            {/* The Image */}
            <div className="relative min-h-[420px] sm:min-h-[580px] w-full bg-black/40 flex items-center justify-center group/img">
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-contain cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Fullscreen Trigger Overlay Pill */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/70 border border-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-purple-600 hover:border-purple-500 transition-all shadow-xl"
                title="View Fullscreen Lightbox"
              >
                <Maximize2 className="h-3.5 w-3.5 text-purple-300" />
                <span>Fullscreen</span>
              </button>
            </div>

            {/* Bottom Meta & Reactions Bar */}
            <div className="p-6 sm:p-8 border-t border-white/[0.08] bg-[#0f111c]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-0.5 text-xs font-semibold text-purple-300">
                      {photo.category}
                    </span>
                    {photo.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-purple-400" />
                        <span>{photo.location}</span>
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {photo.title}
                  </h1>

                  <p className="mt-2 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                    {photo.description}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <UserAvatar
                      src={photo.photographer === "Abdullah" || photo.photographer?.includes("Mamun") ? "/images/Abdullah/FB_IMG_1790540440153.jpg" : undefined}
                      name={photo.photographer || "Creator"}
                      size="sm"
                      className="border border-purple-500/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{photo.photographer || "Md. Abdullah Al Mamun"}</p>
                      <p className="text-[10px] text-purple-300">
                        {photo.photographer === "Abdullah" || photo.photographer?.includes("Mamun")
                          ? "Original Photographer & Author"
                          : "Frameora Community Contributor"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {/* Real Favorite Button */}
                  <button
                    type="button"
                    onClick={handleLike}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                      userHasLiked
                        ? "border-rose-500/50 bg-rose-500/20 text-rose-300"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-rose-500/40"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${userHasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>{currentLikes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:border-purple-500/40"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 text-purple-400" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadOriginal}
                    className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500 transition-all hover:scale-105"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Original</span>
                  </button>
                </div>
              </div>

              {/* Reaction Badges & Tags */}
              <div className="mt-6 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-semibold mr-2">Reactions:</span>
                  {[
                    { key: "love", emoji: "❤️", count: reactions.love },
                    { key: "fire", emoji: "🔥", count: reactions.fire },
                    { key: "laugh", emoji: "😂", count: reactions.laugh },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleReact(item.key)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all ${
                        userReaction === item.key
                          ? "bg-purple-600/30 border-purple-500 text-purple-200 shadow-md"
                          : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/40"
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.count}</span>
                    </button>
                  ))}
                </div>

                {/* Clickable Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-purple-400 mr-1" />
                  {[photo.category, photo.folder, photo.location].filter(Boolean).map((t, idx) => (
                    <Link
                      key={idx}
                      href={`/explore?category=${encodeURIComponent(t!)}`}
                      className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:border-purple-500/40 hover:text-purple-300 transition-colors"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Photo Specifications Table */}
              <div className="mt-6 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                    <Camera className="h-3.5 w-3.5" />
                    <span className="font-semibold text-[11px] uppercase tracking-wider">Capture</span>
                  </div>
                  <div className="font-bold text-white">Original DSLR / Mobile</div>
                  <div className="text-[10px] text-gray-400">Authentic Uncompressed</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span className="font-semibold text-[11px] uppercase tracking-wider">Collection</span>
                  </div>
                  <div className="font-bold text-white capitalize">{photo.folder || "Photography"}</div>
                  <div className="text-[10px] text-gray-400">Curated Album</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="font-semibold text-[11px] uppercase tracking-wider">Location</span>
                  </div>
                  <div className="font-bold text-white truncate">{photo.location || "Bangladesh"}</div>
                  <div className="text-[10px] text-gray-400">Geotagged Sanctuary</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Shield className="h-3.5 w-3.5" />
                    <span className="font-semibold text-[11px] uppercase tracking-wider">License</span>
                  </div>
                  <div className="font-bold text-white">Frameora Portfolio</div>
                  <div className="text-[10px] text-gray-400">Personal & Editorial Use</div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Photos */}
          {relatedPhotos.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-white mb-4">
                More from this Collection
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedPhotos.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/photos/${rel.id}`}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#121422] hover:border-purple-500/50 transition-all"
                  >
                    <Image src={rel.image} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <p className="text-xs font-bold text-white line-clamp-1">{rel.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <LightboxModal
          photos={[photo, ...relatedPhotos]}
          currentIndex={0}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={() => {}}
        />
      )}
    </main>
  );
}
