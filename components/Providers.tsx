"use client";

import { AuthProvider } from "@/lib/xano/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
