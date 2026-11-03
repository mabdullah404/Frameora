"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We encountered an issue while loading photographs. Please check your network and try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`relative my-8 mx-auto max-w-md overflow-hidden rounded-3xl border border-rose-500/30 bg-[#121422]/90 p-8 text-center backdrop-blur-xl shadow-2xl ${className}`}
      role="alert"
    >
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-20 bg-rose-600/15 blur-[50px] pointer-events-none rounded-full" />

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg">
        <AlertCircle className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xs mx-auto">
        {message}
      </p>

      {onRetry && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 hover:scale-[1.02] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
