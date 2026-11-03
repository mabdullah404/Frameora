"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";
import { useToast } from "@/context/ToastContext";
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
  Menu,
  X,
  UploadCloud,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user, role, logout } = useAuth();
  const { isUploadModalOpen, openUploadModal, closeUploadModal, favorites } = usePhotos();
  const { toast } = useToast();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = isLoggedIn
    ? [
        { name: "Home", href: "/", icon: Home },
        { name: "Explore All", href: "/explore", icon: Compass },
        { name: `Favorites (${favorites.length})`, href: "/explore?tab=favorites", icon: Heart },
        { name: "Albums", href: "/profile?tab=albums", icon: FolderOpen },
      ]
    : [
        { name: "Home", href: "/", icon: Home },
        { name: "Photography", href: "/explore", icon: Compass },
      ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    toast.info("Logged out successfully");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0b10]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          
          {/* Logo */}
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href) && !link.href.includes("?"));
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Auth Controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick Search */}
            <Link
              href="/explore"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Search photos"
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Upload Button: Unlocked for logged-in members */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={openUploadModal}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
                title="Upload Photo to Server"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload</span>
              </button>
            ) : null}

            {/* Admin Shortcut if Admin */}
            {isLoggedIn && role === "admin" && (
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-600/20 px-3.5 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 hover:border-purple-400 transition-all glow-purple-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Profile (Logged In) OR Sign In / Sign Up (Visitor) */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:brightness-110 transition-all"
                >
                  Create Account
                </Link>
              </div>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-purple-500/50 transition-all"
                  aria-label="User profile menu"
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
                      <p className="text-sm font-semibold text-white truncate">{user?.name || "Member"}</p>
                      <p className="text-xs text-gray-400 truncate">@{user?.username || "user"}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300 uppercase tracking-wide">
                        {role === "admin" ? "Admin" : "Member"}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4 text-purple-400" />
                        <span>My Profile & Albums</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          openUploadModal();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <UploadCloud className="h-4 w-4 text-purple-400" />
                        <span>Upload New Photo</span>
                      </button>

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
                        onClick={handleLogout}
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

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-300 hover:text-white md:hidden"
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

              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openUploadModal();
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-purple-300 bg-purple-600/10 border border-purple-500/30"
                  >
                    <UploadCloud className="h-4 w-4 text-purple-400" />
                    <span>Upload Photo</span>
                  </button>

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5"
                  >
                    <User className="h-4 w-4 text-purple-400" />
                    <span>My Profile</span>
                  </Link>

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

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center rounded-xl border border-purple-500/30 bg-purple-500/10 py-2.5 text-xs font-semibold text-purple-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center rounded-xl bg-purple-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30"
                  >
                    Create Free Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Upload Modal (Global) */}
      <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} />
    </>
  );
}
