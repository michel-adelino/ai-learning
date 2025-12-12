"use client"

import { useEffect, useState } from "react"
import MuxPlayer from "@mux/mux-player-react"
import { VideoOff, Loader2 } from "lucide-react"
import { getMuxSignedTokens } from "@/lib/actions/mux-xano"
import { motion } from "framer-motion"

interface MuxVideoPlayerXanoProps {
  playbackId: string | null | undefined
  title?: string
  className?: string
}

interface MuxTokens {
  playback: string
  thumbnail: string
  storyboard: string
}

export function MuxVideoPlayerXano({ playbackId, title, className }: MuxVideoPlayerXanoProps) {
  const [tokens, setTokens] = useState<MuxTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playbackId) {
      setIsLoading(false)
      return
    }

    async function fetchTokens() {
      try {
        const result = await getMuxSignedTokens(playbackId as string)
        if (result.error) {
          setError(result.error)
        } else if (result.playbackToken && result.thumbnailToken && result.storyboardToken) {
          setTokens({
            playback: result.playbackToken,
            thumbnail: result.thumbnailToken,
            storyboard: result.storyboardToken,
          })
        }
      } catch (err) {
        setError("Failed to load video")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTokens()
  }, [playbackId])

  if (!playbackId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`aspect-video glass-card rounded-2xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
            <VideoOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No video available</p>
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`aspect-video glass-card rounded-2xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4"
          >
            <Loader2 className="w-8 h-8 text-muted-foreground" />
          </motion.div>
          <p className="text-muted-foreground font-medium">Loading video...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`aspect-video glass-card rounded-2xl flex items-center justify-center border border-red-500/20 ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <VideoOff className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl overflow-hidden glass-card ${className}`}
    >
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
        className="aspect-video"
        accentColor="#ffffff"
        primaryColor="#ffffff"
        secondaryColor="#09090b"
      />
    </motion.div>
  )
}
