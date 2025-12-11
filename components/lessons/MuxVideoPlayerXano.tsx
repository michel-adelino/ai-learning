"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { VideoOff } from "lucide-react";
import { getMuxSignedTokens } from "@/lib/actions/mux-xano";

interface MuxVideoPlayerXanoProps {
  playbackId: string | null | undefined;
  title?: string;
  className?: string;
}

interface MuxTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

export function MuxVideoPlayerXano({
  playbackId,
  title,
  className,
}: MuxVideoPlayerXanoProps) {
  const [tokens, setTokens] = useState<MuxTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playbackId) {
      setIsLoading(false);
      return;
    }

    async function fetchTokens() {
      try {
        const result = await getMuxSignedTokens(playbackId as string);
        if (result.error) {
          setError(result.error);
        } else if (
          result.playbackToken &&
          result.thumbnailToken &&
          result.storyboardToken
        ) {
          setTokens({
            playback: result.playbackToken,
            thumbnail: result.thumbnailToken,
            storyboard: result.storyboardToken,
          });
        }
      } catch (err) {
        setError("Failed to load video");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, [playbackId]);

  if (!playbackId) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No video available</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-pulse" />
          <p className="text-zinc-500">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-zinc-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={
        tokens
          ? {
              playback: tokens.playback,
              thumbnail: tokens.thumbnail,
              storyboard: tokens.storyboard,
            }
          : undefined
      }
      metadata={{
        video_title: title || "Lesson Video",
      }}
      className={`aspect-video rounded-xl overflow-hidden ${className}`}
      accentColor="#8b5cf6"
      primaryColor="#ffffff"
      secondaryColor="#18181b"
    />
  );
}
