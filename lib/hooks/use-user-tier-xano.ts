"use client";

import { useAuth } from "@/lib/xano/auth-context";
import type { Tier } from "@/lib/xano/types";

/**
 * Client-side hook to get the current user's subscription tier.
 */
export function useUserTier(): Tier {
  const { user } = useAuth();
  return user?.tier ?? "free";
}

/**
 * Check if a user tier has access to content at the specified tier.
 *
 * - Free content (or no tier specified): accessible to everyone
 * - Pro content: requires pro or ultra plan
 * - Ultra content: requires ultra plan
 */
export function hasTierAccess(
  userTier: Tier,
  contentTier: Tier | null | undefined
): boolean {
  // Free content or no tier = accessible to everyone
  if (!contentTier || contentTier === "free") return true;

  const tierHierarchy: Record<Tier, number> = {
    free: 0,
    pro: 1,
    ultra: 2,
  };

  return tierHierarchy[userTier] >= tierHierarchy[contentTier];
}
