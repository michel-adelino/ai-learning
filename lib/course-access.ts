import { hasAccessToTier as xanoHasAccessToTier, getUserTier as xanoGetUserTier } from "@/lib/xano/server-auth";
import type { Tier } from "@/lib/constants";

/**
 * Check if the current user has access to content at the specified tier.
 * Uses Xano to check tier subscriptions.
 *
 * - Free content (or no tier specified): accessible to everyone
 * - Pro content: requires pro or ultra tier
 * - Ultra content: requires ultra tier
 */
export async function hasAccessToTier(
  requiredTier: Tier | null | undefined
): Promise<boolean> {
  return xanoHasAccessToTier(requiredTier ?? "free");
}

/**
 * Get the user's current subscription tier.
 */
export async function getUserTier(): Promise<Tier> {
  return xanoGetUserTier();
}
