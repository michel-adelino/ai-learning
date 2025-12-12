"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  text?: string
  size?: "sm" | "md" | "lg"
  isFullScreen?: boolean
  className?: string
}

const sizeStyles = {
  sm: { spinner: 20, ring: 2 },
  md: { spinner: 28, ring: 2.5 },
  lg: { spinner: 40, ring: 3 },
}

const textSizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
}

function LoadingSpinner({ text, size = "md", isFullScreen = false, className }: LoadingSpinnerProps) {
  const { spinner, ring } = sizeStyles[size]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5",
        isFullScreen && "min-h-screen p-8 bg-background",
        className,
      )}
    >
      <div className="relative" style={{ width: spinner, height: spinner }}>
        {/* Outer glow */}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0 rounded-full bg-white/10 blur-lg"
          style={{ transform: "scale(2)" }}
        />

        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            border: `${ring}px solid transparent`,
            borderTopColor: "rgba(255, 255, 255, 0.6)",
            borderRightColor: "rgba(255, 255, 255, 0.3)",
          }}
        />

        {/* Inner dot */}
        <motion.div
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="rounded-full bg-gradient-to-br from-white/80 to-white/40"
            style={{ width: spinner * 0.25, height: spinner * 0.25 }}
          />
        </motion.div>
      </div>

      {text && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn("text-muted-foreground font-medium tracking-tight", textSizeStyles[size])}
        >
          {text}
        </motion.span>
      )}
    </div>
  )
}

export default LoadingSpinner
