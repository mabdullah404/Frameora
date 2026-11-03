"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

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

const DEFAULT_ADMIN_USER: AuthUser = {
  id: "user-abdullah",
  name: "Md. Abdullah Al Mamun",
  username: "mabdullah404",
  email: "mabdullah539629@gmail.com",
  role: "admin",
  avatar: "/images/Abdullah/FB_IMG_1790540440153.jpg",
  bio: "Creator of Frameora. Preserving authentic landscapes, nature, and visual stories.",
  photosCount: 68,
  albumsCount: 6,
  followersCount: 0,
  followingCount: 0,
};

const DEFAULT_MEMBER_USER: AuthUser = {
  id: "user-member",
  name: "New Member",
  username: "new_member",
  email: "member@frameora.com",
  role: "user",
  avatar: "/images/Abdullah/FB_IMG_1790540440153.jpg",
  bio: "Just joined Frameora to explore and share photography.",
  photosCount: 0,
  albumsCount: 0,
  followersCount: 0,
  followingCount: 0,
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  role: UserRole;
  login: (asRole?: UserRole) => void;
  logout: () => void;
  toggleAuth: () => void;
  setRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  role: "guest",
  login: () => {},
  logout: () => {},
  toggleAuth: () => {},
  setRole: () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRoleState] = useState<UserRole>("guest");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("frameora_auth");
      const storedUser = localStorage.getItem("frameora_user");

      if (storedAuth === "true" && storedUser) {
        const parsed = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUser(parsed);
        setRoleState(parsed.role || "user");
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
    setMounted(true);
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === "guest") {
      setIsLoggedIn(false);
      setUser(null);
      try {
        localStorage.setItem("frameora_auth", "false");
        localStorage.setItem("frameora_role", "guest");
        localStorage.removeItem("frameora_user");
      } catch {}
    } else if (newRole === "admin") {
      setIsLoggedIn(true);
      setUser(DEFAULT_ADMIN_USER);
      try {
        localStorage.setItem("frameora_auth", "true");
        localStorage.setItem("frameora_role", "admin");
        localStorage.setItem("frameora_user", JSON.stringify(DEFAULT_ADMIN_USER));
      } catch {}
    } else {
      setIsLoggedIn(true);
      setUser(DEFAULT_MEMBER_USER);
      try {
        localStorage.setItem("frameora_auth", "true");
        localStorage.setItem("frameora_role", "user");
        localStorage.setItem("frameora_user", JSON.stringify(DEFAULT_MEMBER_USER));
      } catch {}
    }
  }, []);

  const login = useCallback((asRole: UserRole = "admin") => {
    setRole(asRole);
  }, [setRole]);

  const logout = useCallback(() => {
    setRole("guest");
  }, [setRole]);

  const toggleAuth = useCallback(() => {
    setRoleState((curr) => {
      if (curr === "admin") {
        setRole("user");
        return "user";
      } else if (curr === "user") {
        setRole("guest");
        return "guest";
      } else {
        setRole("admin");
        return "admin";
      }
    });
  }, [setRole]);

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
      login,
      logout,
      toggleAuth,
      setRole,
      updateProfile,
    }),
    [mounted, isLoggedIn, user, role, login, logout, toggleAuth, setRole, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
