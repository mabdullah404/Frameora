"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import UploadModal from "@/components/UploadModal";
import {
  Camera,
  Search,
  Heart,
  FolderOpen,
  Compass,
  Home,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  UploadCloud,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user, role, setRole, logout } = useAuth();
  const { isUploadModalOpen, openUploadModal, closeUploadModal, favorites } = usePhotos();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: `Favorites (${favorites.length})`, href: "/explore?tab=favorites", icon: Heart },
    { name: "Albums", href: "/profile?tab=albums", icon: FolderOpen },
  ];

  const roleColors: Record<UserRole, { bg: string; text: string; dot: string; label: string }> = {
    guest: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400", dot: "bg-amber-400", label: "Guest" },
    user: { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400", dot: "bg-blue-400", label: "Member" },
    admin: { bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400", label: "Admin" },
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0b10]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          
          {/* Logo matching mockup */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all">
                <Camera className="h-5 w-5" />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  Frame<span className="text-purple-400">ora</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links matching Mockup */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href) && !link.href.includes("?"));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-all rounded-full ${
                    isActive
                      ? "text-white bg-white/10 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-purple-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* REAL Photo Upload Button if logged in */}
            {isLoggedIn && (
              <button
                type="button"
                onClick={openUploadModal}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
                title="Upload Photo to MongoDB"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload</span>
              </button>
            )}

            {/* Quick Search Button */}
            <Link
              href="/explore"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Search photos"
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Quick RBAC Role Selector Dropdown */}
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${roleColors[role].bg} ${roleColors[role].text}`}
                title="Change active user role"
              >
                <span className={`h-2 w-2 rounded-full ${roleColors[role].dot} animate-pulse`} />
                <span>{roleColors[role].label}</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#121422] p-1.5 shadow-2xl backdrop-blur-xl z-50">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Select Role View
                  </div>
                  {(["guest", "user", "admin"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        role === r
                          ? "bg-purple-600/20 text-purple-300 font-semibold"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span className="capitalize">{r === "user" ? "Member (User)" : r}</span>
                      {role === r && <span className="text-purple-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Dashboard Quick Shortcut if Admin */}
            {role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-600/20 px-3.5 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 hover:border-purple-400 transition-all glow-purple-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Profile or Sign In */}
            {!isLoggedIn ? (
              <Link
                href="/signin"
                className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/40 transition-all"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-purple-500/50 transition-all"
                >
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border border-purple-500/40">
                    <Image
                      src={user?.avatar || "/images/Abdullah/FB_IMG_1790540440153.jpg"}
                      alt={user?.name || "Avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#121422] p-2 shadow-2xl backdrop-blur-xl z-50">
                    <div className="border-b border-white/[0.08] px-3 py-2.5">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">@{user?.username}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300 uppercase tracking-wide">
                        {role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          openUploadModal();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-purple-300 hover:bg-purple-600/10 transition-colors"
                      >
                        <UploadCloud className="h-4 w-4 text-purple-400" />
                        <span>Upload Photo</span>
                      </button>

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4 text-purple-400" />
                        <span>My Profile</span>
                      </Link>

                      {role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-purple-300 hover:bg-purple-600/10 transition-colors"
                        >
                          <ShieldCheck className="h-4 w-4 text-purple-400" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/[0.08] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {isLoggedIn && (
              <button
                type="button"
                onClick={openUploadModal}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white"
                title="Upload Photo"
              >
                <UploadCloud className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div className="border-b border-white/10 bg-[#0c0e17]/95 px-5 py-4 backdrop-blur-2xl md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5"
                >
                  <link.icon className="h-4 w-4 text-purple-400" />
                  <span>{link.name}</span>
                </Link>
              ))}

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openUploadModal();
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-purple-300 bg-purple-600/10 border border-purple-500/30"
                >
                  <UploadCloud className="h-4 w-4 text-purple-400" />
                  <span>Upload Photo to MongoDB</span>
                </button>
              )}

              {role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg bg-purple-600/10 border border-purple-500/30 px-3 py-2 text-sm font-semibold text-purple-300"
                >
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5"
                  >
                    <User className="h-4 w-4 text-purple-400" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 text-center rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Upload Modal */}
      <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} />
    </>
  );
}
