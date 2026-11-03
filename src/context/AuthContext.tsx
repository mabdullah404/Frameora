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
  updateProfile: (updated: Partial<AuthUser>) => void;
  refetchSession?: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  role: "guest",
  isAdmin: false,
  login: () => {},
  logout: async () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRoleState] = useState<UserRole>("guest");
  const [mounted, setMounted] = useState(false);

  // Sync with Better Auth session whenever it updates
  useEffect(() => {
    if (sessionData?.user) {
      const email = (sessionData.user.email || "").toLowerCase().trim();
      const isOwner = email === ADMIN_EMAIL;
      const detectedRole: UserRole = isOwner ? "admin" : "user";

      const realUser: AuthUser = {
        id: sessionData.user.id || `user-${Date.now()}`,
        name: sessionData.user.name || "Member",
        username: email ? email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") : "member",
        email: sessionData.user.email,
        role: detectedRole,
        avatar: sessionData.user.image || "/images/Abdullah/FB_IMG_1790540440153.jpg",
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
    } else if (!isPending) {
      // No active server session. Check local storage fallback.
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
  }, [sessionData, isPending]);

  const login = useCallback(
    (asRole?: UserRole, customUser?: Partial<AuthUser>) => {
      const targetEmail = customUser?.email || (asRole === "admin" ? ADMIN_EMAIL : "member@frameora.com");
      const isOwner = targetEmail.toLowerCase().trim() === ADMIN_EMAIL;
      const verifiedRole: UserRole = isOwner ? "admin" : "user";

      const newUser: AuthUser = {
        id: customUser?.id || (isOwner ? "admin-abdullah" : `user-${Date.now()}`),
        name: customUser?.name || (isOwner ? "Md. Abdullah Al Mamun" : "Community Member"),
        username: customUser?.username || (isOwner ? "mabdullah404" : targetEmail.split("@")[0]),
        email: targetEmail,
        role: verifiedRole,
        avatar: customUser?.avatar || "/images/Abdullah/FB_IMG_1790540440153.jpg",
        bio: customUser?.bio || (isOwner ? "Creator of Frameora." : "Photography explorer on Frameora."),
        photosCount: customUser?.photosCount || 0,
        albumsCount: customUser?.albumsCount || 0,
        followersCount: 0,
        followingCount: 0,
      };

      setIsLoggedIn(true);
      setUser(newUser);
      setRoleState(verifiedRole);

      try {
        localStorage.setItem("frameora_auth", "true");
        localStorage.setItem("frameora_role", verifiedRole);
        localStorage.setItem("frameora_user", JSON.stringify(newUser));
      } catch {}
    },
    []
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

  const updateProfile = useCallback((updated: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...updated };
      try {
        localStorage.setItem("frameora_user", JSON.stringify(updatedUser));
      } catch {}
      return updatedUser;
    });
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: mounted ? isLoggedIn : false,
      user: mounted ? user : null,
      role: mounted ? role : "guest",
      isAdmin: mounted ? role === "admin" && user?.email?.toLowerCase().trim() === ADMIN_EMAIL : false,
      login,
      logout,
      updateProfile,
    }),
    [mounted, isLoggedIn, user, role, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
