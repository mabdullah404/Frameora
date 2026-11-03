"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setNotification("Connecting to Google Authentication...");
    setIsLoading(true);
    try {
      const { signIn } = await import("@/lib/auth-client");
      await signIn.social({
        provider: "google",
        callbackURL: "/explore",
      });
    } catch (err: any) {
      setIsLoading(false);
      setNotification("");
      toast.error("Google Sign-Up failed. Please check connection.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }
    if (password.length < 6) {
      toast.error("পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      toast.error("পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!");
      return;
    }

    const isAdminAccount = email.toLowerCase().trim() === "mabdullah539629@gmail.com";
    login(isAdminAccount ? "admin" : "user", {
      name: name.trim(),
      email: email.trim(),
      avatar: "", // NO automatic hardcoded image!
    });
    toast.success("🎉 অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম ফ্রেমওরায়।");
    router.push(isAdminAccount ? "/admin" : "/profile");
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121422]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-24 bg-purple-600/20 blur-[60px] pointer-events-none rounded-full" />

        <div className="text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Frame<span className="text-purple-400">ora</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">Create Account</h1>
          <p className="mt-1.5 text-xs text-gray-300">
            Join the Frameora community to share, organize, and explore photography.
          </p>
        </div>

        {notification && (
          <div className="mt-5 rounded-xl border border-purple-500/30 bg-purple-600/10 p-3 text-center text-xs font-semibold text-purple-300">
            {notification}
          </div>
        )}

        {/* Social Authentication: Google */}
        <div className="mt-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleAuth}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-purple-500/40 hover:scale-[1.01] disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-white/[0.08]" />
          <span className="absolute bg-[#121422] px-3 text-[11px] uppercase tracking-wider text-gray-500">
            or with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300">Create Password</label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300">Confirm Password</label>
            <div className="relative mt-1.5">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                title={showConfirmPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                aria-label={showConfirmPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all hover:scale-[1.01]"
          >
            Create Free Account
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
