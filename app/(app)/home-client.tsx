"use client"

import { motion } from "framer-motion"

// Glow orb background element with enhanced glass effect
export function GlowOrb({
  color = "white",
  size = 700,
  blur = 150,
  className = "",
}: {
  color?: "gray" | "white" | "zinc" | "amber"
  size?: number
  blur?: number
  className?: string
}) {
  const colorMap = {
    gray: "rgba(113, 113, 122, 0.08)",
    white: "rgba(255, 255, 255, 0.04)",
    zinc: "rgba(161, 161, 170, 0.06)",
    amber: "rgba(251, 191, 36, 0.06)",
  }

  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colorMap[color]} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}

// Animated background with enhanced glow orbs
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Primary orbs */}
      <GlowOrb color="white" size={900} blur={200} className="top-[-30%] left-[-20%]" />
      <GlowOrb color="zinc" size={700} blur={180} className="bottom-[-20%] right-[-15%]" />
      <GlowOrb color="gray" size={500} blur={150} className="top-[40%] right-[10%]" />
      <GlowOrb color="white" size={400} blur={120} className="bottom-[20%] left-[5%]" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  )
}

// Floating particles effect
export function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
