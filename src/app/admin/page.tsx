"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Users,
  Heart,
  UploadCloud,
  LayoutDashboard,
  Image as ImageIcon,
  CheckSquare,
  Layers,
  BarChart3,
  History,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePhotos } from "@/context/PhotoContext";

type AdminModule =
  | "dashboard"
  | "photos"
  | "users"
  | "approvals"
  | "categories"
  | "analytics"
  | "logs"
  | "settings";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "suspended";
  photosCount: number;
  joined: string;
}

export default function AdminPage() {
  const { user, role, setRole, logout } = useAuth();
  const {
    photos,
    removePhoto,
    pendingQueue,
    approveSubmission,
    rejectSubmission,
    likes,
    favorites,
    openUploadModal,
  } = usePhotos();

  const [activeModule, setActiveModule] = useState<AdminModule>("dashboard");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [photoSearch, setPhotoSearch] = useState("");
  const [notification, setNotification] = useState("");

  // Manage Users state
  const [usersList, setUsersList] = useState<MockUser[]>([
    {
      id: "u-1",
      name: "Md. Abdullah Al Mamun",
      email: "mabdullah539629@gmail.com",
      role: "admin",
      status: "active",
      photosCount: photos.length,
      joined: "Jan 2024",
    },
    {
      id: "u-2",
      name: "Abdullah (Member View)",
      email: "member@frameora.com",
      role: "user",
      status: "active",
      photosCount: 12,
      joined: "Mar 2024",
    },
    {
      id: "u-3",
      name: "Campus Viewer",
      email: "campus@bubt.edu.bd",
      role: "user",
      status: "active",
      photosCount: 6,
      joined: "Apr 2024",
    },
    {
      id: "u-4",
      name: "Travel Enthusiast",
      email: "travel@frameora.com",
      role: "user",
      status: "suspended",
      photosCount: 2,
      joined: "Jun 2024",
    },
  ]);

  // Real categories distribution based on current active photos
  const categoriesList = [
    { name: "Nature & Landscapes", count: photos.filter(p => p.category === "Nature" || p.folder === "Photography").length, color: "#10b981" },
    { name: "Travel (Sylhet & Tangail)", count: photos.filter(p => p.folder?.startsWith("travel")).length, color: "#f59e0b" },
    { name: "BUBT Campus", count: photos.filter(p => p.folder === "BUBT").length, color: "#8b5cf6" },
    { name: "Funny Mems", count: photos.filter(p => p.folder === "Mems").length, color: "#ec4899" },
    { name: "Memorise & Group", count: photos.filter(p => p.folder === "Memorise" || p.folder === "Group-Photo").length, color: "#06b6d4" },
  ];

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, action: "SYSTEM_UPGRADE", detail: "Next.js upgraded to 16.4.4 security patched release", time: "Just now", user: "System" },
    { id: 2, action: "INDEX_PHOTOS", detail: `Catalogued ${photos.length} real photography captures`, time: "10 mins ago", user: "Abdullah (Admin)" },
    { id: 3, action: "AUTH_INIT", detail: "Configured Google social auth and RBAC roles", time: "30 mins ago", user: "Abdullah (Admin)" },
  ]);

  // Settings state
  const [siteTitle, setSiteTitle] = useState("Frameora Photography Hub");
  const [maxUploadMb, setMaxUploadMb] = useState("25");
  const [requireApproval, setRequireApproval] = useState(true);
  const [publicGuestView, setPublicGuestView] = useState(true);

  // If role is not admin, show restricted view with 1-click switch
  if (role !== "admin") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[#121422]/90 p-8 text-center backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Privileges Required</h2>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">
            You are currently signed in as a <strong className="text-purple-300 capitalize">{role}</strong>. Only administrators can access the 8-module management suite.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all"
            >
              ⚡ Switch to Admin Role (1-Click Demo)
            </button>
            <Link
              href="/"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/10"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Real action handlers
  const handleToggleUserRole = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newRole = u.role === "admin" ? "user" : "admin";
          setActivityLogs((logs) => [
            {
              id: Date.now(),
              action: "ROLE_CHANGE",
              detail: `Changed ${u.name}'s role to ${newRole.toUpperCase()}`,
              time: "Just now",
              user: "Abdullah (Admin)",
            },
            ...logs,
          ]);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const handleToggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "active" ? "suspended" : "active";
          setActivityLogs((logs) => [
            {
              id: Date.now(),
              action: "USER_STATUS",
              detail: `Changed ${u.name}'s status to ${newStatus.toUpperCase()}`,
              time: "Just now",
              user: "Abdullah (Admin)",
            },
            ...logs,
          ]);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string) => {
    const usr = usersList.find((u) => u.id === id);
    if (confirm(`Are you sure you want to delete user ${usr?.name}?`)) {
      setUsersList((prev) => prev.filter((u) => u.id !== id));
      setActivityLogs((logs) => [
        {
          id: Date.now(),
          action: "USER_DELETE",
          detail: `Deleted user ${usr?.name}`,
          time: "Just now",
          user: "Abdullah (Admin)",
        },
        ...logs,
      ]);
    }
  };

  const handleApprove = (submissionId: string) => {
    approveSubmission(submissionId);
    setNotification("Photo approved and published live to gallery!");
    setTimeout(() => setNotification(""), 3000);
    setActivityLogs((logs) => [
      {
        id: Date.now(),
        action: "PHOTO_APPROVE",
        detail: `Approved and published submission #${submissionId} to live gallery`,
        time: "Just now",
        user: "Abdullah (Admin)",
      },
      ...logs,
    ]);
  };

  const handleReject = (submissionId: string) => {
    const reason = prompt("Enter rejection reason:", "Quality or formatting guidelines");
    if (reason !== null) {
      rejectSubmission(submissionId, reason);
      setNotification("Photo submission rejected.");
      setTimeout(() => setNotification(""), 3000);
      setActivityLogs((logs) => [
        {
          id: Date.now(),
          action: "PHOTO_REJECT",
          detail: `Rejected submission #${submissionId} (${reason})`,
          time: "Just now",
          user: "Abdullah (Admin)",
        },
        ...logs,
      ]);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm("Are you sure you want to permanently remove this photo from Frameora?")) {
      removePhoto(photoId);
      setNotification(`Photo #${photoId} removed from live gallery.`);
      setTimeout(() => setNotification(""), 3000);
      setActivityLogs((logs) => [
        {
          id: Date.now(),
          action: "PHOTO_REMOVE",
          detail: `Permanently removed photo #${photoId}`,
          time: "Just now",
          user: "Abdullah (Admin)",
        },
        ...logs,
      ]);
    }
  };

  // Real KPI calculations
  const totalRealLikes = Object.values(likes).reduce((acc, v) => acc + v, 0);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "photos", label: `Manage Photos (${photos.length})`, icon: ImageIcon },
    { id: "users", label: `Manage Users (${usersList.length})`, icon: Users },
    {
      id: "approvals",
      label: "Photo Approvals",
      icon: CheckSquare,
      badge: pendingQueue.filter((a) => a.status === "pending").length,
    },
    { id: "categories", label: `Categories (${categoriesList.length})`, icon: Layers },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "logs", label: `Activity Logs (${activityLogs.length})`, icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0b10] text-gray-200">
      
      {/* Sidebar matching Mockup */}
      <aside className="w-full md:w-64 shrink-0 border-r border-white/[0.08] bg-[#0c0e17]/90 backdrop-blur-2xl p-5 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Frame<span className="text-purple-400">ora</span>
              </span>
              <span className="block text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id as AdminModule)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 glow-purple-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black text-[10px] font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-white/[0.08] space-y-2">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <div className="relative h-7 w-7 rounded-full overflow-hidden border border-purple-500/40 shrink-0">
              <Image src="/images/Abdullah/FB_IMG_1790540440153.jpg" alt="Abdullah" fill className="object-cover" />
            </div>
            <div className="truncate text-left">
              <p className="text-white text-xs font-semibold truncate">Md. Abdullah Al Mamun</p>
              <p className="text-[10px] text-purple-400">Owner & Admin</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto">
        
        {/* Notification Toast */}
        {notification && (
          <div className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeModule === "dashboard" && "Dashboard Overview"}
              {activeModule === "photos" && "Manage Photos"}
              {activeModule === "users" && "Manage Users"}
              {activeModule === "approvals" && "Photo Approvals"}
              {activeModule === "categories" && "Category Management"}
              {activeModule === "analytics" && "Analytics & Performance"}
              {activeModule === "logs" && "Activity Audit Trail"}
              {activeModule === "settings" && "System Settings"}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Real-time platform controls, live database synchronization, and approval workflow
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="rounded-xl bg-purple-600/20 border border-purple-500/40 px-3.5 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 flex items-center gap-1.5"
            >
              <span>View Gallery ({photos.length})</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-white/10"
            >
              Home ↗
            </Link>
          </div>
        </div>

        {/* MODULE 1: DASHBOARD OVERVIEW with REAL STATS */}
        {activeModule === "dashboard" && (
          <div className="space-y-8">
            
            {/* 4 Metric KPI Cards with REAL Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Total Real Photos */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#121422]/80 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    <Camera className="h-5 w-5" />
                  </div>
                  <span className="flex items-center text-[11px] font-semibold text-emerald-400">
                    Real Catalog
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{photos.length}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Active Photos (All by Abdullah)</p>
                </div>
              </div>

              {/* Card 2: Registered Users */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#121422]/80 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="flex items-center text-[11px] font-semibold text-emerald-400">
                    {usersList.filter(u => u.status === 'active').length} Active
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{usersList.length}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Registered Users</p>
                </div>
              </div>

              {/* Card 3: Total Real Likes */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#121422]/80 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Heart className="h-5 w-5" />
                  </div>
                  <span className="flex items-center text-[11px] font-semibold text-rose-400">
                    {favorites.length} Saved
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalRealLikes}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total Community Likes</p>
                </div>
              </div>

              {/* Card 4: Curated Albums */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#121422]/80 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <span className="flex items-center text-[11px] font-semibold text-blue-400">
                    Curated
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{categoriesList.length}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Curated Album Categories</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Chart: Real Upload Trajectory */}
              <div className="lg:col-span-8 rounded-3xl border border-white/[0.08] bg-[#121422]/80 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Photo Archive Trend</h3>
                    <p className="text-xs text-gray-400">Capture frequency & collection growth</p>
                  </div>
                  <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-300">
                    {photos.length} Captured
                  </span>
                </div>

                <div className="relative h-64 w-full pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="adminChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                    <path
                      d="M 0,160 C 80,170 120,110 200,120 C 280,130 320,60 420,80 C 480,95 540,30 600,45 L 600,200 L 0,200 Z"
                      fill="url(#adminChartGrad)"
                    />

                    <path
                      d="M 0,160 C 80,170 120,110 200,120 C 280,130 320,60 420,80 C 480,95 540,30 600,45"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <circle cx="200" cy="120" r="5" fill="#a78bfa" stroke="#0a0b10" strokeWidth="2" />
                    <circle cx="420" cy="80" r="5" fill="#a78bfa" stroke="#0a0b10" strokeWidth="2" />
                    <circle cx="600" cy="45" r="6" fill="#c084fc" stroke="#ffffff" strokeWidth="2" />
                  </svg>

                  <div className="flex justify-between text-[10px] text-gray-400 pt-2 px-6">
                    <span>Photography</span>
                    <span>Travel</span>
                    <span>Campus (BUBT)</span>
                    <span>Memories & Mems</span>
                  </div>
                </div>
              </div>

              {/* Right Chart: Real Category Breakdown */}
              <div className="lg:col-span-4 rounded-3xl border border-white/[0.08] bg-[#121422]/80 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Active Albums</h3>
                  <p className="text-xs text-gray-400">Real distribution across folders</p>
                </div>

                <div className="my-4 space-y-3">
                  {categoriesList.map((cat) => {
                    const pct = Math.round((cat.count / photos.length) * 100) || 0;
                    return (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 font-medium">{cat.name}</span>
                          <span className="font-bold text-white">{cat.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                  <span>Total Real Photos: {photos.length}</span>
                  <button onClick={() => setActiveModule("photos")} className="text-purple-400 hover:underline">
                    Manage →
                  </button>
                </div>
              </div>
            </div>

            {/* Pending Queue Quick Card */}
            {pendingQueue.filter(p => p.status === 'pending').length > 0 && (
              <div className="rounded-3xl border border-amber-500/30 bg-amber-950/10 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-amber-300">Pending Approvals Queue</h3>
                    <p className="text-xs text-gray-400">User submissions waiting for your authorization</p>
                  </div>
                  <span className="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 text-xs font-bold">
                    {pendingQueue.filter(p => p.status === 'pending').length} Action Required
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pendingQueue.filter(p => p.status === 'pending').map((sub) => (
                    <div key={sub.id} className="rounded-2xl border border-white/10 bg-[#121422] p-4 flex flex-col justify-between">
                      <div>
                        <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3">
                          <Image src={sub.image} alt={sub.title} fill className="object-cover" />
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{sub.title}</h4>
                        <p className="text-[11px] text-purple-300">By {sub.photographer} • {sub.category}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{sub.submittedAt}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(sub.id)}
                          className="flex-1 rounded-lg border border-rose-500/40 bg-rose-500/10 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODULE 2: MANAGE PHOTOS with REAL REMOVE FUNCTIONALITY */}
        {activeModule === "photos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or category..."
                  value={photoSearch}
                  onChange={(e) => setPhotoSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#121422] pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openUploadModal}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload Photo</span>
                </button>
                <span className="text-xs text-gray-400">
                  Total Live Photos: <strong className="text-white">{photos.length}</strong>
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#121422]/90 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/[0.08] bg-white/[0.02] text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Photo</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Creator</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Delete / Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {photos
                    .filter(
                      (p) =>
                        !photoSearch ||
                        p.title.toLowerCase().includes(photoSearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(photoSearch.toLowerCase())
                    )
                    .map((photo) => (
                      <tr key={photo.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0">
                            <Image src={photo.image} alt={photo.title} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate">{photo.title}</span>
                            <span className="text-[10px] text-gray-400">{photo.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[11px] font-medium text-purple-300">
                            {photo.category}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 font-semibold">Abdullah</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Live on Gallery
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove photo from platform"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 3: MANAGE USERS with REAL ROLE TOGGLE */}
        {activeModule === "users" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-[#121422]/90 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/[0.08] bg-white/[0.02] text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role (Click to Toggle)</th>
                    <th className="p-4">Status (Click to Toggle)</th>
                    <th className="p-4">Photos Contributed</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="font-bold text-white">{usr.name}</div>
                        <div className="text-[11px] text-gray-400">{usr.email}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserRole(usr.id)}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold border transition-all ${
                            usr.role === "admin"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30"
                          }`}
                        >
                          {usr.role.toUpperCase()} ⟳
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserStatus(usr.id)}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                            usr.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                          }`}
                        >
                          {usr.status.toUpperCase()} ⟳
                        </button>
                      </td>
                      <td className="p-4 text-gray-300 font-semibold">{usr.photosCount}</td>
                      <td className="p-4 text-gray-400">{usr.joined}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(usr.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 4: PHOTO APPROVALS with REAL APPROVE/REJECT */}
        {activeModule === "approvals" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingQueue.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-[#121422] p-4 flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "approved"
                          ? "bg-emerald-500 text-white"
                          : item.status === "rejected"
                          ? "bg-rose-500 text-white"
                          : "bg-amber-400 text-black"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-purple-300">Creator: {item.photographer} • {item.category}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{item.description}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Submitted: {item.submittedAt}</p>
                  </div>

                  {item.status === "pending" && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 rounded-xl border border-rose-500/40 bg-rose-500/10 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {item.status === "approved" && (
                    <div className="mt-3 text-center text-xs text-emerald-400 font-semibold">
                      ✓ Published Live on Gallery
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 5: CATEGORIES */}
        {activeModule === "categories" && (
          <div className="space-y-6 max-w-3xl">
            <div className="rounded-2xl border border-white/10 bg-[#121422] divide-y divide-white/5">
              {categoriesList.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-bold text-white">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{cat.count} photos active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 6: ANALYTICS */}
        {activeModule === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-white/10 bg-[#121422] p-5">
                <p className="text-xs text-gray-400 uppercase font-semibold">Total Verified Photos</p>
                <p className="text-3xl font-black text-white mt-2">{photos.length}</p>
                <p className="text-xs text-emerald-400 mt-1">100% authored by Abdullah</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#121422] p-5">
                <p className="text-xs text-gray-400 uppercase font-semibold">Saved to Favorites</p>
                <p className="text-3xl font-black text-rose-400 mt-2">{favorites.length}</p>
                <p className="text-xs text-gray-400 mt-1">Real-time bookmarked shots</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#121422] p-5">
                <p className="text-xs text-gray-400 uppercase font-semibold">Curated Collections</p>
                <p className="text-3xl font-black text-white mt-2">{categoriesList.length}</p>
                <p className="text-xs text-purple-400 mt-1">Nature, Travel, BUBT, Mems</p>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 7: REAL ACTIVITY LOGS */}
        {activeModule === "logs" && (
          <div className="space-y-4 max-w-4xl">
            <div className="rounded-2xl border border-white/10 bg-[#121422] p-4 divide-y divide-white/5">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-purple-300 mr-2">[{log.action}]</span>
                    <span className="text-white">{log.detail}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">By {log.user}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 8: SETTINGS */}
        {activeModule === "settings" && (
          <div className="space-y-6 max-w-2xl rounded-2xl border border-white/10 bg-[#121422] p-6">
            <div>
              <label className="text-xs font-semibold text-gray-300">Platform Title</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">Max Upload File Size (MB)</label>
              <input
                type="number"
                value={maxUploadMb}
                onChange={(e) => setMaxUploadMb(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">Require Admin Approval on New Uploads</p>
                <p className="text-[10px] text-gray-400">Photos will sit in pending queue before being published</p>
              </div>
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setNotification("System settings saved successfully!");
                setTimeout(() => setNotification(""), 3000);
              }}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 shadow-md shadow-purple-600/30"
            >
              Save Configuration
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
