"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 sm:h-28 sm:w-28 text-xl sm:text-2xl",
  "2xl": "h-28 w-28 sm:h-32 sm:w-32 text-2xl sm:text-3xl",
};

export default function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
  priority = false,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when src changes (e.g. after avatar crop or login)
  useEffect(() => {
    setImgError(false);
  }, [src]);

  // Generate clean initials from user's full name (e.g., "Md. Abdullah" -> "MA")
  const getInitials = (n?: string | null): string => {
    if (!n) return "";
    const cleaned = n.replace(/[^a-zA-Z\s]/g, "").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const containerSize = sizeClasses[size] || sizeClasses.md;

  const hasValidImage = Boolean(src && !imgError && src.trim() !== "");
  const isDataOrBlob = Boolean(src && (src.startsWith("data:") || src.startsWith("blob:")));

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold select-none transition-all ${containerSize} ${className}`}
    >
      {hasValidImage && src ? (
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          unoptimized={isDataOrBlob}
          sizes="(max-width: 640px) 120px, 160px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white shadow-inner">
          {initials ? (
            <span className="tracking-wider">{initials}</span>
          ) : (
            <User className="h-1/2 w-1/2 text-purple-200" />
          )}
        </div>
      )}
    </div>
  );
}
