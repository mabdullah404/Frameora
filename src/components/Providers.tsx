"use client";

import { AuthProvider } from "@/context/AuthContext";
import { PhotoProvider } from "@/context/PhotoContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PhotoProvider>{children}</PhotoProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
