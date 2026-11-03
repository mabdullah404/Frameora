"use client";

import { AuthProvider } from "@/context/AuthContext";
import { PhotoProvider } from "@/context/PhotoContext";
import { ToastProvider } from "@/context/ToastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <PhotoProvider>{children}</PhotoProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
