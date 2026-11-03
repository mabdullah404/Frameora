"use client";

import { AuthProvider } from "@/context/AuthContext";
import { PhotoProvider } from "@/context/PhotoContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PhotoProvider>{children}</PhotoProvider>
    </AuthProvider>
  );
}
