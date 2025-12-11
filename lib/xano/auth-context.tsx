"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, Tier } from "@/lib/xano/types";
import {
  login as apiLogin,
  signup as apiSignup,
  getCurrentUser,
  updateProfile as apiUpdateProfile,
  upgradeTier as apiUpgradeTier,
} from "@/lib/xano/client";

const AUTH_TOKEN_KEY = "xano_auth_token";

// Helper to set cookie (for middleware to read)
function setAuthCookie(token: string) {
  // Set cookie with 7 days expiry
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

// Helper to remove cookie
function removeAuthCookie() {
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    role?: "student" | "teacher"
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  }) => Promise<void>;
  upgradeTier: (tier: "pro" | "ultra") => Promise<void>;
  refreshUser: () => Promise<void>;
  hasTier: (tier: Tier) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        if (storedToken) {
          setAuthToken(storedToken);
          // Sync cookie with localStorage token for middleware
          setAuthCookie(storedToken);
          const userData = await getCurrentUser(storedToken);
          setUser(userData);
        } else {
          // No token in localStorage, ensure cookie is also cleared
          removeAuthCookie();
        }
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem(AUTH_TOKEN_KEY);
        removeAuthCookie();
        setAuthToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, response.authToken);
      setAuthCookie(response.authToken);
      setAuthToken(response.authToken);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
      role?: "student" | "teacher"
    ) => {
      setIsLoading(true);
      try {
        const response = await apiSignup(email, password, firstName, lastName, role);
        localStorage.setItem(AUTH_TOKEN_KEY, response.authToken);
        setAuthCookie(response.authToken);
        setAuthToken(response.authToken);
        setUser(response.user);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    removeAuthCookie();
    setAuthToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

  const updateProfile = useCallback(
    async (data: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
    }) => {
      if (!authToken) throw new Error("Not authenticated");
      const updatedUser = await apiUpdateProfile(authToken, data);
      setUser(updatedUser);
    },
    [authToken]
  );

  const upgradeTier = useCallback(
    async (tier: "pro" | "ultra") => {
      if (!authToken) throw new Error("Not authenticated");
      const updatedUser = await apiUpgradeTier(authToken, tier);
      setUser(updatedUser);
    },
    [authToken]
  );

  const refreshUser = useCallback(async () => {
    if (!authToken) return;
    try {
      const userData = await getCurrentUser(authToken);
      setUser(userData);
    } catch (error) {
      // Token might be expired
      logout();
    }
  }, [authToken, logout]);

  const hasTier = useCallback(
    (tier: Tier): boolean => {
      if (!user) return false;
      
      const tierHierarchy: Record<Tier, number> = {
        free: 0,
        pro: 1,
        ultra: 2,
      };

      return tierHierarchy[user.tier] >= tierHierarchy[tier];
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        authToken,
        login,
        signup,
        logout,
        updateProfile,
        upgradeTier,
        refreshUser,
        hasTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for getting auth token (useful for API calls)
export function useAuthToken(): string | null {
  const { authToken } = useAuth();
  return authToken;
}

// Hook for checking if user has required tier
export function useRequireTier(requiredTier: Tier): {
  hasAccess: boolean;
  isLoading: boolean;
  user: User | null;
} {
  const { user, isLoading, hasTier } = useAuth();
  return {
    hasAccess: hasTier(requiredTier),
    isLoading,
    user,
  };
}
