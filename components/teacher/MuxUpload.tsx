"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { CheckCircle, AlertCircle, Loader2, Film, CloudUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/xano/auth-context"
import { createMuxUploadUrl, getMuxUploadStatus, getMuxAssetStatus } from "@/lib/xano/client"
import { motion, AnimatePresence } from "framer-motion"

interface MuxUploadProps {
  onUploadComplete: (playbackId: string, duration: number) => void
  onError?: (error: string) => void
}

type UploadStatus = "idle" | "getting-url" | "uploading" | "processing" | "complete" | "error"

export function MuxUpload({ onUploadComplete, onError }: MuxUploadProps) {
  const { authToken } = useAuth()
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file || !authToken) return
      processFile(file)
    },
    [authToken],
  )

  const processFile = async (file: File) => {
    if (!authToken) return

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file")
      onError?.("Please select a video file")
      return
    }

    // Validate file size (max 5GB)
    const maxSize = 5 * 1024 * 1024 * 1024
    if (file.size > maxSize) {
      setError("File size must be less than 5GB")
      onError?.("File size must be less than 5GB")
      return
    }

    setError(null)
    setStatus("getting-url")

    try {
      // Get upload URL from Xano/MUX
      const { upload_url, upload_id } = await createMuxUploadUrl(authToken, window.location.origin)

      if (!upload_url || !upload_id) {
        throw new Error("Invalid response from upload URL endpoint")
      }

      setUploadId(upload_id)
      setStatus("uploading")

      // Upload file directly to MUX
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setProgress(percent)
        }
      })

      xhr.addEventListener("load", async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setStatus("processing")
          // Poll for upload status to get asset_id, then poll asset status
          await pollUploadStatus(upload_id)
        } else {
          throw new Error("Upload failed")
        }
      })

      xhr.addEventListener("error", () => {
        setStatus("error")
        setError("Upload failed. Please try again.")
        onError?.("Upload failed")
      })

      xhr.open("PUT", upload_url)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
    } catch (err) {
      setStatus("error")
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
      onError?.(message)
    }
  }

  // Poll upload status to get asset_id
  const pollUploadStatus = useCallback(
    async (uploadId: string) => {
      if (!authToken) return

      const maxAttempts = 30 // 2.5 minutes max for upload processing
      let attempts = 0

      const checkUpload = async () => {
        try {
          const upload = await getMuxUploadStatus(authToken, uploadId)

          if (upload.status === "asset_created" && upload.asset_id) {
            // Now poll for asset status
            await pollAssetStatus(upload.asset_id)
            return
          }

          if (upload.status === "errored" || upload.status === "cancelled" || upload.status === "timed_out") {
            setStatus("error")
            setError("Upload processing failed")
            onError?.("Upload processing failed")
            return
          }

          attempts++
          if (attempts < maxAttempts) {
            setTimeout(checkUpload, 5000) // Check every 5 seconds
          } else {
            setStatus("error")
            setError("Upload processing timeout. Please check later.")
            onError?.("Upload processing timeout")
          }
        } catch (err) {
          setStatus("error")
          setError("Failed to check upload status")
          onError?.("Failed to check upload status")
        }
      }

      await checkUpload()
    },
    [authToken, onError],
  )

  // Poll asset status to get playback_id and duration
  const pollAssetStatus = useCallback(
    async (assetId: string) => {
      if (!authToken) return

      const maxAttempts = 60 // 5 minutes max
      let attempts = 0

      const checkStatus = async () => {
        try {
          const asset = await getMuxAssetStatus(authToken, assetId)

          if (asset.status === "ready") {
            setStatus("complete")
            onUploadComplete(asset.playback_id, asset.duration || 0)
            return
          }

          if (asset.status === "errored") {
            setStatus("error")
            setError("Video processing failed")
            onError?.("Video processing failed")
            return
          }

          attempts++
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, 5000) // Check every 5 seconds
          } else {
            setStatus("error")
            setError("Processing timeout. Please check later.")
            onError?.("Processing timeout")
          }
        } catch (err) {
          setStatus("error")
          setError("Failed to check video status")
          onError?.("Failed to check video status")
        }
      }

      await checkStatus()
    },
    [authToken, onUploadComplete, onError],
  )

  const reset = () => {
    setStatus("idle")
    setProgress(0)
    setError(null)
    setUploadId(null)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [authToken],
  )

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.label
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 glass-card ${
              isDragging ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <div className="flex flex-col items-center justify-center py-6">
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4"
              >
                <CloudUpload className={`w-8 h-8 ${isDragging ? "text-white" : "text-muted-foreground"}`} />
              </motion.div>
              <p className="mb-2 text-sm text-foreground font-medium">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">MP4, WebM, MOV (MAX. 5GB)</p>
            </div>
            <input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} />
          </motion.label>
        )}

        {status === "getting-url" && (
          <motion.div
            key="getting-url"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center h-56 glass-card rounded-2xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4"
            >
              <Loader2 className="w-7 h-7 text-muted-foreground" />
            </motion.div>
            <p className="text-foreground font-medium">Preparing upload...</p>
          </motion.div>
        )}

        {status === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center h-56 glass-card rounded-2xl border border-white/20"
          >
            <div className="w-full max-w-xs px-6">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center"
                >
                  <Film className="w-7 h-7 text-white" />
                </motion.div>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="text-foreground font-semibold">{progress}%</span>
              </div>
              <div className="w-full h-2.5 glass rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-white/60 to-white rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {status === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center h-56 glass-card rounded-2xl border border-amber-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4"
            >
              <Loader2 className="w-7 h-7 text-amber-400" />
            </motion.div>
            <p className="text-foreground font-medium">Processing video...</p>
            <p className="text-xs text-muted-foreground mt-2">This may take a few minutes</p>
          </motion.div>
        )}

        {status === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center h-56 glass-card rounded-2xl border border-emerald-500/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <p className="text-foreground font-medium mb-4">Video uploaded successfully!</p>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="glass border-white/10 hover:bg-white/5 bg-transparent"
            >
              Upload another video
            </Button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center h-56 glass-card rounded-2xl border border-red-500/20"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="glass border-white/10 hover:bg-white/5 bg-transparent"
            >
              Try again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
