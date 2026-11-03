"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Camera,
  MapPin,
  Phone,
  Droplet,
  Calendar,
  Briefcase,
  Compass,
  Globe,
  Share2,
  Check,
  Sparkles,
  Lock,
} from "lucide-react";
import { AuthUser } from "@/context/AuthContext";
import UserAvatar from "./UserAvatar";

interface ProfileEditModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  onClose: () => void;
  onOpenCropModal: () => void;
  onSave: (updated: Partial<AuthUser>) => Promise<boolean>;
}

export default function ProfileEditModal({
  isOpen,
  user,
  onClose,
  onOpenCropModal,
  onSave,
}: ProfileEditModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "personal" | "photography">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // Personal Info (Optional)
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  // Photography Info (Optional)
  const [photographerName, setPhotographerName] = useState("");
  const [experience, setExperience] = useState("");
  const [favoriteCategory, setFavoriteCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Populate form when user changes or modal opens
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setPhone(user.phone || "");
      setBloodGroup(user.bloodGroup || "");
      setDob(user.dob || "");
      setGender(user.gender || "");
      setLocation(user.location || "");
      setPhotographerName(user.photographerName || "");
      setExperience(user.experience || "");
      setFavoriteCategory(user.favoriteCategory || "");
      setWebsite(user.website || "");
      setFacebook(user.facebook || "");
      setInstagram(user.instagram || "");
      setLinkedin(user.linkedin || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData: Partial<AuthUser> = {
      name: name.trim() || user?.name,
      username: username.trim() || user?.username,
      bio: bio.trim(),
      phone: phone.trim(),
      bloodGroup: bloodGroup.trim(),
      dob: dob.trim(),
      gender: gender.trim(),
      location: location.trim(),
      photographerName: photographerName.trim(),
      experience: experience.trim(),
      favoriteCategory: favoriteCategory.trim(),
      website: website.trim(),
      facebook: facebook.trim(),
      instagram: instagram.trim(),
      linkedin: linkedin.trim(),
    };

    const ok = await onSave(updatedData);
    setIsSubmitting(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#121422] p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header & Avatar Action */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/[0.08]">
          <div className="relative group shrink-0">
            <UserAvatar
              src={user?.avatar}
              name={name || user?.name}
              size="xl"
              className="border-4 border-purple-500/40 shadow-xl"
            />
            <button
              type="button"
              onClick={onOpenCropModal}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white border-2 border-[#121422] shadow-lg hover:bg-purple-500 hover:scale-110 transition-all"
              title="Change or Crop Profile Picture"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Customize Profile
              </h2>
              <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300 uppercase">
                {user?.role || "Member"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Personalize your public display, credentials, and photography details
            </p>

            <button
              type="button"
              onClick={onOpenCropModal}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{user?.avatar ? "Change Profile Picture (Crop / Zoom)" : "Upload Profile Picture"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "basic", label: "Basic Info", icon: User },
            { id: "personal", label: "Personal Info (Optional)", icon: Droplet },
            { id: "photography", label: "Photography & Socials", icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Forms */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Md. Abdullah"
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-purple-400 font-bold">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-8 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full rounded-xl border border-white/5 bg-white/[0.03] pl-10 pr-3.5 py-2.5 text-xs text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-500">Email is linked to your secure login account</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Bio / About Me
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell fellow photographers about yourself, your passion, or your work..."
                  className="w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFO (OPTIONAL & PRIVATE) */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-3 flex items-start gap-2.5 text-xs text-purple-300">
                <Lock className="h-4 w-4 shrink-0 text-purple-400 mt-0.5" />
                <span>
                  আপনার ব্যক্তিগত তথ্যগুলো সম্পূর্ণ সুরক্ষিত ও প্রাইভেট থাকবে। এগুলো অন্য কোনো সাধারণ ভিজিটর দেখতে পারবে না।
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Phone Number (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1700-000000"
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Blood Group (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A Positive (A+)</option>
                      <option value="A-">A Negative (A-)</option>
                      <option value="B+">B Positive (B+)</option>
                      <option value="B-">B Negative (B-)</option>
                      <option value="O+">O Positive (O+)</option>
                      <option value="O-">O Negative (O-)</option>
                      <option value="AB+">AB Positive (AB+)</option>
                      <option value="AB-">AB Negative (AB-)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Date of Birth (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Gender (ঐচ্ছিক)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Location / Address (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHY & SOCIALS (OPTIONAL) */}
          {activeTab === "photography" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Photographer Name / Handle (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={photographerName}
                    onChange={(e) => setPhotographerName(e.target.value)}
                    placeholder="e.g. Abdullah Visuals"
                    className="w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Photography Experience (ঐচ্ছিক)
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Hobbyist / Beginner">Hobbyist / Beginner</option>
                    <option value="Enthusiast (1-3 years)">Enthusiast (1-3 years)</option>
                    <option value="Semi-Professional (3-5 years)">Semi-Professional (3-5 years)</option>
                    <option value="Professional (5+ years)">Professional (5+ years)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Favourite Photography Category
                  </label>
                  <select
                    value={favoriteCategory}
                    onChange={(e) => setFavoriteCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#181a2b] px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Nature & Landscapes">Nature & Landscapes</option>
                    <option value="Travel & Adventure">Travel & Adventure</option>
                    <option value="Street & Urban">Street & Urban</option>
                    <option value="Portrait & People">Portrait & People</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Campus & Life">Campus & Life</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Portfolio / Website (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Social Media Links (ঐচ্ছিক)
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400">f</span>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook Profile URL or username"
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-pink-400">ig</span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram Profile URL or @handle"
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-400">in</span>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn Profile URL"
                      className="w-full rounded-xl border border-white/10 bg-[#181a2b] pl-10 pr-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
