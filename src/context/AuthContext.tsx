"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useSession, signOut as authSignOut } from "@/lib/auth-client";

export type UserRole = "guest" | "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  photosCount: number;
  albumsCount: number;
  followersCount: number;
  followingCount: number;
  // Personal Info (Optional)
  phone?: string;
  bloodGroup?: string;
  dob?: string;
  gender?: string;
  location?: string;
  joinedDate?: string;
  // Photography Info (Optional)
  photographerName?: string;
  experience?: string;
  favoriteCategory?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
};

export const ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mabdullah539629@gmail.com"
).toLowerCase().trim();

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  role: UserRole;
  isAdmin: boolean;
  login: (asRole?: UserRole, customUser?: Partial<AuthUser>) => void;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<AuthUser>) => Promise<boolean>;
  refetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  role: "guest",
  isAdmin: false,
  login: () => {},
  logout: async () => {},
  updateProfile: async () => false,
  refetchProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRoleState] = useState<UserRole>("guest");
  const [mounted, setMounted] = useState(false);

  // Fetch extended profile data from MongoDB Atlas
  const fetchDbProfile = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setUser((prev) => {
          if (!prev) return prev;
          const merged: AuthUser = {
            ...prev,
            name: data.profile.name || prev.name,
            username: data.profile.username || prev.username,
            avatar: data.profile.avatar !== undefined ? data.profile.avatar : prev.avatar,
            bio: data.profile.bio !== undefined ? data.profile.bio : prev.bio,
            phone: data.profile.phone,
            bloodGroup: data.profile.bloodGroup,
            dob: data.profile.dob,
            gender: data.profile.gender,
            location: data.profile.location,
            photographerName: data.profile.photographerName,
            experience: data.profile.experience,
            favoriteCategory: data.profile.favoriteCategory,
            website: data.profile.website,
            facebook: data.profile.facebook,
            instagram: data.profile.instagram,
            linkedin: data.profile.linkedin,
          };
          try {
            localStorage.setItem("frameora_user", JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (err) {
      console.warn("Could not fetch extended profile from database:", err);
    }
  }, []);

  // Sync with Better Auth session whenever it updates
  useEffect(() => {
    if (sessionData?.user) {
      const email = (sessionData.user.email || "").toLowerCase().trim();
      const isOwner = email === ADMIN_EMAIL;
      const detectedRole: UserRole = isOwner ? "admin" : "user";

      // If user has a valid Google/OAuth avatar, use it. Otherwise, default to empty string.
      // (NO MORE automatic hardcoded photo assignment!)
      const initialAvatar = sessionData.user.image || "";

      const realUser: AuthUser = {
        id: sessionData.user.id || `user-${Date.now()}`,
        name: sessionData.user.name || "Member",
        username: email ? email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") : "member",
        email: sessionData.user.email,
        role: detectedRole,
        avatar: initialAvatar,
        bio: isOwner
          ? "Creator of Frameora. Preserving authentic landscapes, nature, and visual stories."
          : "Photography explorer & member of Frameora.",
        photosCount: 0,
        albumsCount: 0,
        followersCount: 0,
        followingCount: 0,
      };

      setIsLoggedIn(true);
      setUser(realUser);
      setRoleState(detectedRole);

      try {
        localStorage.setItem("frameora_auth", "true");
        localStorage.setItem("frameora_role", detectedRole);
        localStorage.setItem("frameora_user", JSON.stringify(realUser));
      } catch {}

      // Fetch any saved custom profile and avatar from MongoDB
      fetchDbProfile(email);
    } else if (!isPending) {
      // Check local storage fallback
      try {
        const storedAuth = localStorage.getItem("frameora_auth");
        const storedUser = localStorage.getItem("frameora_user");

        if (storedAuth === "true" && storedUser) {
          const parsed: AuthUser = JSON.parse(storedUser);
          const isOwner = (parsed.email || "").toLowerCase().trim() === ADMIN_EMAIL;
          parsed.role = isOwner ? "admin" : "user";
          setIsLoggedIn(true);
          setUser(parsed);
          setRoleState(parsed.role);
          if (parsed.email) {
            fetchDbProfile(parsed.email);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setRoleState("guest");
        }
      } catch {
        setIsLoggedIn(false);
        setUser(null);
        setRoleState("guest");
      }
    }
    setMounted(true);
  }, [sessionData, isPending, fetchDbProfile]);

  const login = useCallback(
    (asRole?: UserRole, customUser?: Partial<AuthUser>) => {
      const targetEmail = customUser?.email || (asRole === "admin" ? ADMIN_EMAIL : "member@frameora.com");
      const isOwner = targetEmail.toLowerCase().trim() === ADMIN_EMAIL;
      const verifiedRole: UserRole = isOwner ? "admin" : "user";

      // Do NOT set any automatic hardcoded photo
      const assignedAvatar = customUser?.avatar || "";

      const newUser: AuthUser = {
        id: customUser?.id || (isOwner ? "admin-abdullah" : `user-${Date.now()}`),
        name: customUser?.name || (isOwner ? "Md. Abdullah Al Mamun" : "Community Member"),
        username: customUser?.username || (isOwner ? "mabdullah404" : targetEmail.split("@")[0]),
        email: targetEmail,
        role: verifiedRole,
        avatar: assignedAvatar,
        bio: customUser?.bio || (isOwner ? "Creator of Frameora." : "Photography explorer on Frameora."),
        photosCount: customUser?.photosCount || 0,
        albumsCount: customUser?.albumsCount || 0,
        followersCount: 0,
        followingCount: 0,
        phone: customUser?.phone,
        bloodGroup: customUser?.bloodGroup,
        dob: customUser?.dob,
        gender: customUser?.gender,
        location: customUser?.location,
        photographerName: customUser?.photographerName,
        experience: customUser?.experience,
        favoriteCategory: customUser?.favoriteCategory,
        website: customUser?.website,
        facebook: customUser?.facebook,
        instagram: customUser?.instagram,
        linkedin: customUser?.linkedin,
      };

      setIsLoggedIn(true);
      setUser(newUser);
      setRoleState(verifiedRole);

      try {
        localStorage.setItem("frameora_auth", "true");
        localStorage.setItem("frameora_role", verifiedRole);
        localStorage.setItem("frameora_user", JSON.stringify(newUser));
      } catch {}

      if (targetEmail) {
        fetchDbProfile(targetEmail);
      }
    },
    [fetchDbProfile]
  );

  const logout = useCallback(async () => {
    try {
      await authSignOut();
    } catch {}

    setIsLoggedIn(false);
    setUser(null);
    setRoleState("guest");

    try {
      localStorage.setItem("frameora_auth", "false");
      localStorage.setItem("frameora_role", "guest");
      localStorage.removeItem("frameora_user");
    } catch {}
  }, []);

  const updateProfile = useCallback(
    async (updated: Partial<AuthUser>): Promise<boolean> => {
      let success = true;

      setUser((prev) => {
        if (!prev) return prev;
        const updatedUser: AuthUser = { ...prev, ...updated };
        try {
          localStorage.setItem("frameora_user", JSON.stringify(updatedUser));
        } catch {}
        return updatedUser;
      });

      // Save to MongoDB Atlas via /api/user/profile
      try {
        const currentUserEmail = user?.email || (updated.email as string);
        if (currentUserEmail) {
          const res = await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: currentUserEmail,
              ...updated,
            }),
          });
          const data = await res.json();
          success = Boolean(data.success);
        }
      } catch (err) {
        console.error("Database save failed:", err);
        success = false;
      }

      return success;
    },
    [user?.email]
  );

  const refetchProfile = useCallback(async () => {
    if (user?.email) {
      await fetchDbProfile(user.email);
    }
  }, [user?.email, fetchDbProfile]);

  const value = useMemo(
    () => ({
      isLoggedIn: mounted ? isLoggedIn : false,
      user: mounted ? user : null,
      role: mounted ? role : "guest",
      isAdmin: mounted ? role === "admin" && user?.email?.toLowerCase().trim() === ADMIN_EMAIL : false,
      login,
      logout,
      updateProfile,
      refetchProfile,
    }),
    [mounted, isLoggedIn, user, role, login, logout, updateProfile, refetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
