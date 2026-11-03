"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Heart,
  Share2,
  Check,
} from "lucide-react";
import { Photo } from "@/types/photo";
import { usePhotos } from "@/context/PhotoContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface LightboxModalProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggleLike, getLikesCount } = usePhotos();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  const currentPhoto = photos[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1);
    }
  }, [currentIndex, onNavigate, photos.length]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, onNavigate, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleShare = () => {
    if (!currentPhoto) return;
    const shareUrl = `${window.location.origin}/photos/${currentPhoto.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("🔗 ছবির লিঙ্ক ক্লিপবোর্ডে কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLike = () => {
    if (!currentPhoto) return;
    if (!isLoggedIn) {
      toast.warning("ছবি ফেভারিটে যুক্ত করতে অনুগ্রহ করে সাইন ইন করুন!");
      return;
    }
    const alreadyLiked = isFavorite(currentPhoto.id);
    toggleLike(currentPhoto.id);
    if (alreadyLiked) {
      toast.info("ফেভারিট থেকে সরানো হয়েছে");
    } else {
      toast.success("❤️ ফেভারিটে যোগ করা হয়েছে!");
    }
  };

  if (!isOpen || !currentPhoto) return null;

  const userHasLiked = isFavorite(currentPhoto.id);
  const currentLikes = getLikesCount(currentPhoto.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo Lightbox"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl transition-all"
    >
      {/* Top Controls Bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        {/* Counter */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-md border border-white/10">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="hidden sm:inline-block text-xs text-purple-300 font-semibold capitalize">
            {currentPhoto.category || currentPhoto.folder}
          </span>
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <a
            href={currentPhoto.image}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
            title="Download Original"
          >
            <Download className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-600/80 hover:text-white transition-all border border-white/10"
            title="Close Lightbox (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Photo Area with Floating Arrows */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden select-none">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white border border-white/15 backdrop-blur-md hover:bg-purple-600 hover:border-purple-500 hover:scale-110 transition-all shadow-xl"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* The Image */}
        <div className="relative h-full w-full max-h-[75vh] max-w-5xl flex items-center justify-center">
          <Image
            src={currentPhoto.image}
            alt={currentPhoto.title}
            fill
            sizes="100vw"
            className="object-contain drop-shadow-2xl rounded-lg"
            priority
          />
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 sm:right-8 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white border border-white/15 backdrop-blur-md hover:bg-purple-600 hover:border-purple-500 hover:scale-110 transition-all shadow-xl"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Bar: Photographer strictly Abdullah */}
      <div className="relative z-20 mx-auto max-w-5xl w-full px-4 pb-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/10 bg-[#121422]/85 px-6 py-3.5 backdrop-blur-xl shadow-2xl">
          
          {/* Photo Details & Photographer */}
          <div className="flex items-center gap-3.5">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-purple-500/40">
              <Image
                src="/images/Abdullah/FB_IMG_1790540440153.jpg"
                alt="Abdullah"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {currentPhoto.title}
              </h3>
              <p className="text-xs text-gray-400">
                By <span className="text-purple-300 font-semibold">Abdullah</span>
                {currentPhoto.location && ` • ${currentPhoto.location}`}
              </p>
            </div>
          </div>

          {/* Likes & Share Buttons */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                userHasLiked
                  ? "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20"
                  : "border-white/15 bg-white/5 text-gray-300 hover:border-rose-500/40 hover:text-white"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  userHasLiked ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
              <span>{currentLikes}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:border-purple-500/40 hover:text-white transition-all"
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
          </div>
        </div>
      </div>
    </div>
  );
}
