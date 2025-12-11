"use client";

import { useState, useCallback } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/xano/auth-context";
import { createMuxUploadUrl, getMuxAssetStatus } from "@/lib/xano/client";

interface MuxUploadProps {
  onUploadComplete: (playbackId: string, duration: number) => void;
  onError?: (error: string) => void;
}

type UploadStatus = "idle" | "getting-url" | "uploading" | "processing" | "complete" | "error";

export function MuxUpload({ onUploadComplete, onError }: MuxUploadProps) {
  const { authToken } = useAuth();
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !authToken) return;

      // Validate file type
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file");
        onError?.("Please select a video file");
        return;
      }

      // Validate file size (max 5GB)
      const maxSize = 5 * 1024 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size must be less than 5GB");
        onError?.("File size must be less than 5GB");
        return;
      }

      setError(null);
      setStatus("getting-url");

      try {
        // Get upload URL from Xano/MUX
        const { upload_url, asset_id } = await createMuxUploadUrl(
          authToken,
          window.location.origin
        );
        setAssetId(asset_id);
        setStatus("uploading");

        // Upload file directly to MUX
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener("load", async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setStatus("processing");
            // Poll for asset status
            await pollAssetStatus(asset_id);
          } else {
            throw new Error("Upload failed");
          }
        });

        xhr.addEventListener("error", () => {
          setStatus("error");
          setError("Upload failed. Please try again.");
          onError?.("Upload failed");
        });

        xhr.open("PUT", upload_url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      } catch (err) {
        setStatus("error");
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        onError?.(message);
      }
    },
    [authToken, onError]
  );

  const pollAssetStatus = useCallback(
    async (assetId: string) => {
      if (!authToken) return;

      const maxAttempts = 60; // 5 minutes max
      let attempts = 0;

      const checkStatus = async () => {
        try {
          const asset = await getMuxAssetStatus(authToken, assetId);
          
          if (asset.status === "ready") {
            setStatus("complete");
            onUploadComplete(asset.playback_id, asset.duration || 0);
            return;
          }

          if (asset.status === "errored") {
            setStatus("error");
            setError("Video processing failed");
            onError?.("Video processing failed");
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, 5000); // Check every 5 seconds
          } else {
            setStatus("error");
            setError("Processing timeout. Please check later.");
            onError?.("Processing timeout");
          }
        } catch (err) {
          setStatus("error");
          setError("Failed to check video status");
          onError?.("Failed to check video status");
        }
      };

      await checkStatus();
    },
    [authToken, onUploadComplete, onError]
  );

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setAssetId(null);
  };

  return (
    <div className="space-y-4">
      {status === "idle" && (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-600 rounded-xl hover:border-violet-500 transition-colors cursor-pointer bg-zinc-900/60">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-zinc-400" />
            <p className="mb-2 text-sm text-zinc-300">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-zinc-400">MP4, WebM, MOV (MAX. 5GB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileSelect}
          />
        </label>
      )}

      {status === "getting-url" && (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-zinc-600 rounded-xl bg-zinc-900/60">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-2" />
          <p className="text-zinc-300">Preparing upload...</p>
        </div>
      )}

      {status === "uploading" && (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-violet-500 rounded-xl bg-zinc-900/60">
          <div className="w-full max-w-xs px-4">
            <div className="flex justify-between text-sm text-zinc-300 mb-2">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-amber-500 rounded-xl bg-zinc-900/60">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
          <p className="text-zinc-300">Processing video...</p>
          <p className="text-xs text-zinc-400 mt-1">This may take a few minutes</p>
        </div>
      )}

      {status === "complete" && (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-green-500 rounded-xl bg-zinc-900/60">
          <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
          <p className="text-zinc-200">Video uploaded successfully!</p>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="mt-4"
          >
            Upload another video
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-red-500 rounded-xl bg-zinc-900/60">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-red-300">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
