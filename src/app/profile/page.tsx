"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Heart,
  FolderOpen,
  Edit3,
  Calendar,
  MapPin,
  ExternalLink,
  Lock,
  Sparkles,
  ArrowRight,
  Check,
  UploadCloud,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import LightboxModal from "@/components/LightboxModal";

export default function ProfilePage() {
  const { user, isLoggedIn, role, updateProfile } = useAuth();
  const {
    photos,
    favorites,
    isFavorite,
    toggleLike,
    openUploadModal,
    userFollowers,
    userFollowing,
    toggleFollowUser,
    isFollowingCreator,
  } = usePhotos();

  const [activeTab, setActiveTab] = useState<"photos" | "albums" | "favorites" | "activity">("photos");
  const [isEditing, setIsEditing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isAdmin = role === "admin";

  // Profile edit form state
  const [name, setName] = useState(user?.name || "Md. Abdullah Al Mamun");
  const [bio, setBio] = useState(
    user?.bio || (isAdmin ? "Creator of Frameora. Frontend & Full-Stack Developer." : "Photography explorer & memory collector.")
  );

  // Photos belonging to this user:
  // If admin: all catalog photos. If normal member: photos uploaded by them (or empty if fresh user)
  const myUploadedPhotos = isAdmin
    ? photos
    : photos.filter((p) => p.uploaderId === user?.id || p.photographer === user?.name);

  // Real user favorited photos
  const favoritePhotos = photos.filter((p) => isFavorite(p.id));

  // Curated Real Albums (only for admin/creator; 0 for new member)
  const albums = isAdmin
    ? [
        {
          id: "nature",
          title: "Nature & Landscapes",
          count: photos.filter((p) => p.category === "Nature" || p.folder === "Photography").length,
          cover: "/images/hero-landscape.jpg",
          category: "Nature",
        },
        {
          id: "travel",
          title: "Sylhet & Tangail Travel",
          count: photos.filter((p) => p.folder?.startsWith("travel")).length,
          cover: "/images/travel/Shylet/IMG_5879.JPG",
          category: "travel",
        },
        {
          id: "campus",
          title: "BUBT Campus Life",
          count: photos.filter((p) => p.folder === "BUBT").length,
          cover: "/images/BUBT/IMG_2807.JPG",
          category: "BUBT",
        },
        {
          id: "memories",
          title: "Golden Memories",
          count: photos.filter((p) => p.folder === "Memorise").length,
          cover: "/images/Memorise/IMG_0079.JPG",
          category: "Memorise",
        },
        {
          id: "mems",
          title: "Funny Mems Squad",
          count: photos.filter((p) => p.folder === "Mems").length,
          cover: "/images/Mems/IMG_0026.JPG",
          category: "Mems",
        },
        {
          id: "group",
          title: "Brotherhood & Group",
          count: photos.filter((p) => p.folder === "Group-Photo").length,
          cover: "/images/Group-Photo/IMG_2285.JPG",
          category: "Group-Photo",
        },
      ]
    : [];

  // Calculate real reaction count received on user's photos
  const totalReactionsReceived = myUploadedPhotos.reduce((acc, p) => acc + (favorites.includes(p.id) ? 1 : 0), 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, bio });
    setIsEditing(false);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[#121422]/80 p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Profile Restricted</h2>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            Please sign in to view your profile, manage uploads, and view favorited photos.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/signin"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all"
            >
              Sign In to View
            </Link>
            <Link
              href="/explore"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/10"
            >
              Back to Public Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Profile Header */}
      <div className="rounded-3xl border border-white/10 bg-[#121422]/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative group">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-purple-500/40 shadow-2xl ring-4 ring-black/40">
                <Image
                  src={isAdmin ? "/images/Abdullah/FB_IMG_1790540440153.jpg" : (user?.avatar || "/images/Abdullah/FB_IMG_1790540440153.jpg")}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white border-2 border-[#121422] shadow-lg hover:bg-purple-500 hover:scale-110 transition-all"
                title="Change Photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="max-w-xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {user?.name || (isAdmin ? "Md. Abdullah Al Mamun" : "New Community Member")}
                </h1>
                <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-0.5 text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  {role}
                </span>
              </div>

              <p className="mt-1 text-sm text-purple-400 font-medium">
                @{user?.username || (isAdmin ? "mabdullah404" : "member")}
              </p>

              <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                {user?.bio || (isAdmin ? "Passionate photographer & visual curator." : "Photography explorer on Frameora.")}
              </p>

              {/* Member Info */}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-purple-400" />
                  <span>Dhaka, Bangladesh</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Upload Photo & Follow & Edit */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
            
            {/* Real Upload Photo Button */}
            <button
              type="button"
              onClick={openUploadModal}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Photo</span>
            </button>

            {/* Follow Button (if member viewing creator) */}
            {!isAdmin && (
              <button
                type="button"
                onClick={toggleFollowUser}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition-all ${
                  isFollowingCreator
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                }`}
              >
                {isFollowingCreator ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Following Creator</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Follow Abdullah</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Bio</span>
            </button>
          </div>
        </div>

        {/* Real User Stats (starts at 0 for fresh user!) */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {myUploadedPhotos.length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">My Uploads</p>
          </div>
          <div className="p-2 border-l border-white/5 sm:border-white/[0.08]">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {albums.length}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Albums</p>
          </div>
          <div className="p-2 border-t sm:border-t-0 sm:border-l border-white/[0.08]">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-400">
              {isAdmin ? favorites.length : totalReactionsReceived}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
              {isAdmin ? "Favorited" : "Reactions Received"}
            </p>
          </div>
          <div className="p-2 border-t sm:border-t-0 border-l border-white/[0.08]">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAdmin ? (isFollowingCreator ? 1 : 0) : userFollowing}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
              {isAdmin ? "Followers" : "Following"}
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="mt-8 border-b border-white/[0.08] flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: "photos", label: `My Photos (${myUploadedPhotos.length})`, icon: Camera },
            { id: "albums", label: `Albums (${albums.length})`, icon: FolderOpen },
            { id: "favorites", label: `Favorites (${favorites.length})`, icon: Heart },
            { id: "activity", label: "Activity Feed", icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative pb-3 flex items-center gap-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive ? "text-purple-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: My Photos */}
      {activeTab === "photos" && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {isAdmin ? "All Catalog Photos" : "My Uploaded Photos"}{" "}
              <span className="text-sm font-normal text-gray-400">({myUploadedPhotos.length} frames)</span>
            </h2>
            <button
              type="button"
              onClick={openUploadModal}
              className="text-xs text-purple-400 hover:underline flex items-center gap-1"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload New Frame</span>
            </button>
          </div>

          {myUploadedPhotos.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border border-white/10 bg-[#121422]/50">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">You haven&apos;t uploaded any photos yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Share your first photo frame with the community! Uploads are saved directly to MongoDB Atlas.
              </p>
              <button
                type="button"
                onClick={openUploadModal}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload First Photo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {myUploadedPhotos.slice(0, 20).map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121422] aspect-[4/3] hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-600/10 transition-all"
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="text-xs font-semibold text-white line-clamp-1">{photo.title}</p>
                    <p className="text-[11px] text-purple-300">{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Albums */}
      {activeTab === "albums" && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Album Collections</h2>
              <p className="text-xs text-gray-400">
                {albums.length === 0 ? "You have not created any custom albums yet." : "Curated collections"}
              </p>
            </div>
          </div>

          {albums.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border border-white/10 bg-[#121422]/50">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 mb-3">
                <FolderOpen className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">No custom albums yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Explore the public gallery or upload photos to organize them into albums.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/explore?category=${album.category}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#121422]/80 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/15"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={album.cover}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121422] via-transparent to-black/30" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                        {album.title}
                      </h3>
                      <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                        {album.count} photos
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: REAL FAVORITES */}
      {activeTab === "favorites" && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Bookmarked Favorites</h2>
              <p className="text-xs text-gray-400">
                {favoritePhotos.length === 0
                  ? "You have not favorited any photos yet."
                  : `You have saved ${favoritePhotos.length} favorite ${favoritePhotos.length === 1 ? "photo" : "photos"}`}
              </p>
            </div>
            <Link
              href="/explore"
              className="text-xs text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Browse Explore</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {favoritePhotos.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border border-white/10 bg-[#121422]/50">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
                <Heart className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">No favorite photos collected yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Click the heart icon on any photo in the Explore Gallery to save it directly into your personal favorites collection!
              </p>
              <Link
                href="/explore"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500"
              >
                Go to Explore Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favoritePhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121422] aspect-[4/3] hover:border-rose-500/40 transition-all"
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(photo.id);
                    }}
                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg"
                    title="Remove from favorites"
                  >
                    <Heart className="h-3.5 w-3.5 fill-white" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="text-xs font-bold text-white">{photo.title}</p>
                    <p className="text-[11px] text-purple-300">By {photo.photographer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Activity Feed with REAL activity */}
      {activeTab === "activity" && (
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#121422]/60 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-4">Platform Activity Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
                <Camera className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-200">
                  {myUploadedPhotos.length > 0
                    ? `Uploaded ${myUploadedPhotos.length} photo frames to the live platform`
                    : "Signed in to Frameora community"}
                </p>
                <span className="text-[10px] text-gray-500">Live Session</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600/20 text-rose-400">
                <Heart className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-200">
                  {favorites.length > 0
                    ? `Curated ${favorites.length} favorite photos into personal collection`
                    : "No favorite photos saved yet"}
                </p>
                <span className="text-[10px] text-gray-500">Real-time sync</span>
              </div>
            </div>

            {isFollowingCreator && (
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-200">Started following photographer Md. Abdullah Al Mamun</p>
                  <span className="text-[10px] text-gray-500">Follower connection active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#121422] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300">Bio</label>
                <textarea
                  value={bio}
                  rows={3}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photos={activeTab === "favorites" ? favoritePhotos : myUploadedPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
