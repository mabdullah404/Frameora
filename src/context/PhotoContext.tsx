"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import photosRaw from "@/data/photos.json";
import { Photo } from "@/types/photo";

// Filter base catalog (browser-renderable formats)
const initialValidPhotos: Photo[] = (photosRaw as Photo[]).filter(
  (p) =>
    !p.image.toLowerCase().endsWith(".heic") &&
    !p.image.toLowerCase().endsWith(".mp4")
);

export interface PendingSubmission {
  id: string;
  title: string;
  category: string;
  photographer: string;
  image: string;
  location?: string;
  description: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface UploadPhotoPayload {
  title: string;
  category: string;
  image: string;
  photographer: string;
  location?: string;
  description?: string;
  uploaderId?: string;
  uploaderEmail?: string;
  isPrivate?: boolean;
}

interface PhotoContextType {
  photos: Photo[];
  favorites: string[];
  likes: Record<string, number>;
  pendingQueue: PendingSubmission[];
  toggleFavorite: (photoId: string) => void;
  isFavorite: (photoId: string) => boolean;
  toggleLike: (photoId: string) => void;
  getLikesCount: (photoId: string) => number;
  removePhoto: (photoId: string) => void;
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string, reason?: string) => void;
  uploadPhoto: (payload: UploadPhotoPayload) => Promise<Photo>;
  updatePhotoPrivacy: (photoId: string, isPrivate: boolean) => Promise<boolean>;
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  userFollowers: number;
  userFollowing: number;
  toggleFollowUser: () => void;
  isFollowingCreator: boolean;
}

const PhotoContext = createContext<PhotoContextType>({
  photos: initialValidPhotos,
  favorites: [],
  likes: {},
  pendingQueue: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  toggleLike: () => {},
  getLikesCount: () => 0,
  removePhoto: () => {},
  approveSubmission: () => {},
  rejectSubmission: () => {},
  uploadPhoto: async () => initialValidPhotos[0],
  updatePhotoPrivacy: async () => false,
  isUploadModalOpen: false,
  openUploadModal: () => {},
  closeUploadModal: () => {},
  userFollowers: 0,
  userFollowing: 0,
  toggleFollowUser: () => {},
  isFollowingCreator: false,
});

export function PhotoProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>(initialValidPhotos);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userFollowers, setUserFollowers] = useState(0);
  const [userFollowing, setUserFollowing] = useState(0);
  const [isFollowingCreator, setIsFollowingCreator] = useState(false);

  const [pendingQueue, setPendingQueue] = useState<PendingSubmission[]>([
    {
      id: "sub-1",
      title: "Sylhet Tea Garden Morning",
      category: "travel",
      photographer: "Abdullah",
      image: "/images/travel/Shylet/IMG_5879.JPG",
      location: "Sylhet, Bangladesh",
      description: "Serene morning sunlight shimmering on emerald tea terraces.",
      submittedAt: "15 mins ago",
      status: "pending",
    },
    {
      id: "sub-2",
      title: "Campus Discussion at BUBT",
      category: "BUBT",
      photographer: "Abdullah",
      image: "/images/BUBT/IMG_2807.JPG",
      location: "BUBT, Mirpur, Dhaka",
      description: "Memorable tech discussion with colleagues at campus.",
      submittedAt: "1 hour ago",
      status: "pending",
    },
    {
      id: "sub-3",
      title: "Sunset Reflection on Water",
      category: "Nature",
      photographer: "Abdullah",
      image: "/images/hero-landscape.jpg",
      location: "Bangladesh",
      description: "Vibrant golden hour reflection over peaceful mountain waters.",
      submittedAt: "2 hours ago",
      status: "pending",
    },
  ]);

  // Load photos from MongoDB + localStorage
  useEffect(() => {
    // 1. Fetch user-uploaded photos from MongoDB backend API
    fetch("/api/photos")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.photos) && data.photos.length > 0) {
          const dbPhotos: Photo[] = data.photos.map((p: any) => ({
            id: p._id || p.id,
            title: p.title,
            category: p.category,
            folder: p.category,
            image: p.image,
            photographer: p.photographer || "Abdullah",
            location: p.location || "Bangladesh",
            description: p.description || "",
            uploaderId: p.uploaderId,
            uploaderEmail: p.uploaderEmail,
            isPrivate: Boolean(p.isPrivate),
            createdAt: p.createdAt,
          }));

          setPhotos((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const newOnes = dbPhotos.filter((item) => !existingIds.has(item.id));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch(() => {
        // Fallback to local catalog
      });

    // 2. Load favorites
    try {
      const storedFavs = localStorage.getItem("frameora_favorites");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }

      const storedLikes = localStorage.getItem("frameora_likes");
      if (storedLikes) {
        setLikes(JSON.parse(storedLikes));
      }

      const storedFollowing = localStorage.getItem("frameora_following_creator");
      if (storedFollowing === "true") {
        setIsFollowingCreator(true);
        setUserFollowing(1);
      }

      // Load removed photos
      const storedRemoved = localStorage.getItem("frameora_removed_photos");
      if (storedRemoved) {
        const removedIds: string[] = JSON.parse(storedRemoved);
        setPhotos((prev) => prev.filter((p) => !removedIds.includes(p.id)));
      }
    } catch {}
  }, []);

  // Upload photo to MongoDB backend
  const uploadPhoto = async (payload: UploadPhotoPayload): Promise<Photo> => {
    const isPriv = Boolean(payload.isPrivate);
    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to save photo to database");
      }

      const newPhoto: Photo = {
        id: data.photo.id || `photo-${Date.now()}`,
        title: data.photo.title || payload.title,
        category: data.photo.category || payload.category,
        folder: data.photo.category || payload.category,
        image: data.photo.image || payload.image,
        photographer: data.photo.photographer || payload.photographer || "Abdullah",
        location: data.photo.location || payload.location || "Bangladesh",
        description: data.photo.description || payload.description || "",
        uploaderId: data.photo.uploaderId || payload.uploaderId,
        uploaderEmail: data.photo.uploaderEmail || payload.uploaderEmail,
        isPrivate: isPriv,
        createdAt: data.photo.createdAt || new Date(),
      };

      // Add to front of live gallery
      setPhotos((prev) => [newPhoto, ...prev]);

      return newPhoto;
    } catch (err: any) {
      // Offline fallback: save to state
      const fallbackPhoto: Photo = {
        id: `local-photo-${Date.now()}`,
        title: payload.title,
        category: payload.category,
        folder: payload.category,
        image: payload.image,
        photographer: payload.photographer || "Abdullah",
        location: payload.location || "Bangladesh",
        description: payload.description || "",
        uploaderId: payload.uploaderId,
        uploaderEmail: payload.uploaderEmail,
        isPrivate: isPriv,
        createdAt: new Date(),
      };
      setPhotos((prev) => [fallbackPhoto, ...prev]);
      return fallbackPhoto;
    }
  };

  const updatePhotoPrivacy = async (photoId: string, isPrivate: boolean): Promise<boolean> => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isPrivate } : p))
    );

    try {
      const res = await fetch("/api/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photoId, isPrivate }),
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  };

  const toggleFavorite = (photoId: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(photoId)) {
        updated = prev.filter((id) => id !== photoId);
      } else {
        updated = [...prev, photoId];
      }
      try {
        localStorage.setItem("frameora_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isFavorite = (photoId: string) => favorites.includes(photoId);

  const toggleLike = (photoId: string) => {
    setLikes((prev) => {
      const isLiked = isFavorite(photoId);
      const current = prev[photoId] || 0;
      const updatedCount = isLiked ? Math.max(0, current - 1) : current + 1;
      const updated = { ...prev, [photoId]: updatedCount };
      try {
        localStorage.setItem("frameora_likes", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toggleFavorite(photoId);

    // Sync like to MongoDB backend in background
    fetch("/api/photos/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId, userId: "guest_or_user" }),
    }).catch(() => {});
  };

  const getLikesCount = (photoId: string) => {
    return likes[photoId] ?? 0;
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== photoId);
      try {
        const storedRemoved = localStorage.getItem("frameora_removed_photos");
        const removedIds: string[] = storedRemoved ? JSON.parse(storedRemoved) : [];
        if (!removedIds.includes(photoId)) {
          removedIds.push(photoId);
          localStorage.setItem("frameora_removed_photos", JSON.stringify(removedIds));
        }
      } catch {}
      return updated;
    });

    // Delete in MongoDB in background
    fetch(`/api/photos?id=${photoId}`, { method: "DELETE" }).catch(() => {});
    setFavorites((prev) => prev.filter((id) => id !== photoId));
  };

  const approveSubmission = (submissionId: string) => {
    const item = pendingQueue.find((s) => s.id === submissionId);
    if (!item) return;

    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      title: item.title,
      category: item.category,
      folder: item.category,
      photographer: "Abdullah",
      image: item.image,
      location: item.location || "Bangladesh",
      description: item.description,
      isPrivate: false,
      createdAt: new Date(),
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setPendingQueue((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: "approved" } : s))
    );

    // Save to MongoDB
    fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPhoto),
    }).catch(() => {});
  };

  const rejectSubmission = (submissionId: string) => {
    setPendingQueue((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: "rejected" } : s))
    );
  };

  const toggleFollowUser = () => {
    setIsFollowingCreator((prev) => {
      const next = !prev;
      setUserFollowing(next ? 1 : 0);
      try {
        localStorage.setItem("frameora_following_creator", next ? "true" : "false");
      } catch {}
      return next;
    });
  };

  const openUploadModal = useCallback(() => setIsUploadModalOpen(true), []);
  const closeUploadModal = useCallback(() => setIsUploadModalOpen(false), []);

  const value = useMemo(
    () => ({
      photos,
      favorites,
      likes,
      pendingQueue,
      toggleFavorite,
      isFavorite,
      toggleLike,
      getLikesCount,
      removePhoto,
      approveSubmission,
      rejectSubmission,
      uploadPhoto,
      updatePhotoPrivacy,
      isUploadModalOpen,
      openUploadModal,
      closeUploadModal,
      userFollowers,
      userFollowing,
      toggleFollowUser,
      isFollowingCreator,
    }),
    [
      photos,
      favorites,
      likes,
      pendingQueue,
      toggleFavorite,
      isFavorite,
      toggleLike,
      getLikesCount,
      removePhoto,
      approveSubmission,
      rejectSubmission,
      uploadPhoto,
      updatePhotoPrivacy,
      isUploadModalOpen,
      openUploadModal,
      closeUploadModal,
      userFollowers,
      userFollowing,
      toggleFollowUser,
      isFollowingCreator,
    ]
  );

  return (
    <PhotoContext.Provider value={value}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotos() {
  return useContext(PhotoContext);
}
