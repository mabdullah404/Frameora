"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { id, message, type, duration };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toastMethods = useMemo(
    () => ({
      success: (msg: string, d?: number) => addToast(msg, "success", d),
      error: (msg: string, d?: number) => addToast(msg, "error", d),
      info: (msg: string, d?: number) => addToast(msg, "info", d),
      warning: (msg: string, d?: number) => addToast(msg, "warning", d),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}

      {/* Floating Toast Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const config = {
            success: {
              icon: CheckCircle2,
              iconColor: "text-emerald-400",
              border: "border-emerald-500/30",
              bg: "bg-[#0f1917]/95",
              glow: "shadow-emerald-500/20",
            },
            error: {
              icon: AlertCircle,
              iconColor: "text-rose-400",
              border: "border-rose-500/30",
              bg: "bg-[#1f0f14]/95",
              glow: "shadow-rose-500/20",
            },
            info: {
              icon: Info,
              iconColor: "text-purple-400",
              border: "border-purple-500/30",
              bg: "bg-[#151226]/95",
              glow: "shadow-purple-500/20",
            },
            warning: {
              icon: AlertTriangle,
              iconColor: "text-amber-400",
              border: "border-amber-500/30",
              bg: "bg-[#1f190e]/95",
              glow: "shadow-amber-500/20",
            },
          }[t.type];

          const IconComponent = config.icon;

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border ${config.border} ${config.bg} p-3.5 backdrop-blur-xl shadow-xl ${config.glow} transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`shrink-0 ${config.iconColor}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-gray-200 leading-snug line-clamp-2">
                  {t.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 rounded-lg p-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside ToastProvider
    return {
      toast: {
        success: (msg: string) => console.log("[Toast Success]", msg),
        error: (msg: string) => console.error("[Toast Error]", msg),
        info: (msg: string) => console.log("[Toast Info]", msg),
        warning: (msg: string) => console.warn("[Toast Warning]", msg),
      },
    };
  }
  return context;
}
