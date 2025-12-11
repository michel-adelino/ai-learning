"use server";

import { cookies } from "next/headers";
import { getMuxSignedTokens as apiGetMuxSignedTokens } from "@/lib/xano/client";

const AUTH_TOKEN_COOKIE = "xano_auth_token";

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

interface MuxTokensResult {
  playbackToken: string | null;
  thumbnailToken: string | null;
  storyboardToken: string | null;
  error?: string;
}

export async function getMuxSignedTokens(
  playbackId: string | null | undefined
): Promise<MuxTokensResult> {
  if (!playbackId) {
    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: "playbackId is required",
    };
  }

  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: "Authentication required",
    };
  }

  try {
    const tokens = await apiGetMuxSignedTokens(authToken, playbackId);

    return {
      playbackToken: tokens.playback,
      thumbnailToken: tokens.thumbnail,
      storyboardToken: tokens.storyboard,
    };
  } catch (error) {
    console.error("Failed to get MUX tokens:", error);
    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: error instanceof Error ? error.message : "Failed to get tokens",
    };
  }
}

// For admin: create upload URL
export async function createMuxUploadUrl(): Promise<{
  uploadUrl: string | null;
  uploadId: string | null;
  error?: string;
}> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      uploadUrl: null,
      uploadId: null,
      error: "Authentication required",
    };
  }

  const XANO_API_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "";

  try {
    const response = await fetch(`${XANO_API_URL}/mux/create-upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create upload URL");
    }

    const data = await response.json();
    return {
      uploadUrl: data.upload_url,
      uploadId: data.upload_id,
    };
  } catch (error) {
    console.error("MUX upload URL creation error:", error);
    return {
      uploadUrl: null,
      uploadId: null,
      error: error instanceof Error ? error.message : "Failed to create upload",
    };
  }
}

// For admin: check upload status
export async function getMuxUploadStatus(uploadId: string): Promise<{
  status: "waiting" | "preparing" | "ready" | "errored" | null;
  playbackId: string | null;
  assetId: string | null;
  error?: string;
}> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      status: null,
      playbackId: null,
      assetId: null,
      error: "Authentication required",
    };
  }

  const XANO_API_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "";

  try {
    const response = await fetch(`${XANO_API_URL}/mux/upload-status/${uploadId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get upload status");
    }

    const data = await response.json();
    return {
      status: data.status,
      playbackId: data.playback_id,
      assetId: data.asset_id,
    };
  } catch (error) {
    console.error("MUX status check error:", error);
    return {
      status: null,
      playbackId: null,
      assetId: null,
      error: error instanceof Error ? error.message : "Failed to get status",
    };
  }
}
