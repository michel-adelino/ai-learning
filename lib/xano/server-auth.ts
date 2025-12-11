import { cookies } from "next/headers";
import type { Tier, User } from "@/lib/xano/types";
import { getCurrentUser } from "@/lib/xano/client";

const AUTH_TOKEN_COOKIE = "xano_auth_token";

/**
 * Get auth token from cookies (for server components)
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

/**
 * Get current user from server-side
 */
export async function getServerUser(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    return await getCurrentUser(token);
  } catch {
    return null;
  }
}

/**
 * Check if the current user has access to content at the specified tier.
 *
 * - Free content (or no tier specified): accessible to everyone
 * - Pro content: requires pro or ultra plan
 * - Ultra content: requires ultra plan
 */
export async function hasAccessToTier(
  requiredTier: Tier | null | undefined
): Promise<boolean> {
  // Free content or no tier = accessible to everyone
  if (!requiredTier || requiredTier === "free") return true;

  const user = await getServerUser();
  if (!user) return false;

  const tierHierarchy: Record<Tier, number> = {
    free: 0,
    pro: 1,
    ultra: 2,
  };

  return tierHierarchy[user.tier] >= tierHierarchy[requiredTier];
}

/**
 * Get the user's current subscription tier.
 */
export async function getUserTier(): Promise<Tier> {
  const user = await getServerUser();
  return user?.tier ?? "free";
}

/**
 * Get user ID for server-side operations
 */
export async function getUserId(): Promise<number | null> {
  const user = await getServerUser();
  return user?.id ?? null;
}
