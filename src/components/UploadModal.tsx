"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Camera,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Globe,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { user } = useAuth();
  const { uploadPhoto } = usePhotos();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Nature");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Image size exceeds 15MB limit");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for your photo");
      return;
    }
    if (!imagePreview) {
      setError("Please upload an image file");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await uploadPhoto({
        title: title.trim(),
        category,
        image: imagePreview,
        photographer: user?.name || "Member",
        location: location.trim() || "Bangladesh",
        description: description.trim(),
        uploaderId: user?.id || `user-${Date.now()}`,
        uploaderEmail: user?.email || "",
        isPrivate: Boolean(isPrivate),
      });

      setSuccess(true);
      toast.success(
        isPrivate
          ? "🔒 প্রাইভেট ছবি সফলভাবে আপলোড সম্পন্ন হয়েছে! এটি শুধু আপনার প্রোফাইলে থাকবে।"
          : "🎉 পাবলিক ছবি সফলভাবে আপলোড সম্পন্ন হয়েছে! এক্সপ্লোরে সবাই দেখতে পাবে।"
      );
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setTitle("");
        setLocation("");
        setDescription("");
        setIsPrivate(false);
        setImagePreview(null);
      }, 1200);
    } catch (err: any) {
      const msg = err.message || "Failed to upload photo. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start sm:items-center pt-8 sm:pt-12 pb-16">
      <div className="relative w-full max-w-xl rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121422] p-5 sm:p-8 shadow-2xl my-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/15 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload New Photo</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Preserve your authentic frames with full original resolution
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Photo successfully saved to MongoDB in original quality!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Drag & Drop / File Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
              Photo Image <span className="text-rose-400">*</span>
            </label>

            {imagePreview ? (
              <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-purple-500/40 group">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 keep-white"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 keep-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-purple-500/50 rounded-2xl p-6 text-center bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">
                    Click to browse or drag and drop an image
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                    Original uncompressed resolution preserved (JPG, PNG, WebP)
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Privacy Toggle: Public vs Private */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
              Privacy Settings <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  !isPrivate
                    ? "border-emerald-500/60 bg-emerald-500/15 text-slate-900 dark:text-white ring-1 ring-emerald-500/40"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-gray-400 hover:border-slate-300"
                }`}
              >
                <Globe className={`h-4 w-4 mt-0.5 shrink-0 ${!isPrivate ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-gray-400"}`} />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Public (উন্মুক্ত)</p>
                  <p className="text-[10px] text-slate-600 dark:text-gray-300 mt-0.5 leading-tight">
                    Explore গ্যালারিতে সবার জন্য দৃশ্যমান ও মূল কোয়ালিটিতে ডাউনলোডযোগ্য।
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  isPrivate
                    ? "border-purple-500/60 bg-purple-500/20 text-slate-900 dark:text-white ring-1 ring-purple-500/40"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-gray-400 hover:border-slate-300"
                }`}
              >
                <Lock className={`h-4 w-4 mt-0.5 shrink-0 ${isPrivate ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-gray-400"}`} />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Private (ব্যক্তিগত)</p>
                  <p className="text-[10px] text-slate-600 dark:text-gray-300 mt-0.5 leading-tight">
                    শুধুমাত্র আপনার ব্যক্তিগত প্রোফাইলে থাকবে। অন্য কেউ দেখতে বা ডাউনলোড করতে পারবে না।
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              Photo Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. Misty Sunrise over Sylhet Hills"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-sm"
              />
            </div>
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-gray-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="Nature">🌿 Nature & Landscape</option>
                  <option value="travel">✈️ Travel</option>
                  <option value="Portrait">👤 Portrait</option>
                  <option value="Urban">🏙️ Urban / Street</option>
                  <option value="BUBT">🎓 BUBT Campus</option>
                  <option value="Memorise">📸 Golden Memories</option>
                  <option value="Mems">😂 Funny Mems</option>
                  <option value="Others">🔲 Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Sylhet, Bangladesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              Description / Story
            </label>
            <textarea
              rows={2}
              placeholder="Tell the story behind this shot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181a2b] px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none shadow-sm"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 disabled:opacity-50 keep-white"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Publish Photo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
