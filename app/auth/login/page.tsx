"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, LogIn } from "lucide-react"
import { AuthForm } from "@/components/auth"
import { motion } from "framer-motion"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-[15%] right-[10%] w-[300px] h-[300px] bg-emerald-400/[0.02] rounded-full blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image src="/logo-white.svg" alt="Simply Learn" width={140} height={24} className="h-6 w-auto" />
          </Link>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative glass-card rounded-2xl p-6 overflow-hidden"
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

          <div className="relative">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle mb-3 text-xs text-emerald-400 font-medium">
                <LogIn className="w-3 h-3" />
                Welcome back
              </div>
              <h1 className="text-xl font-bold mb-1 text-gradient">Sign in to your account</h1>
              <p className="text-muted-foreground text-sm">Continue your learning journey</p>
            </div>

            <AuthForm mode="login" redirectTo="/dashboard" />

            <div className="mt-5 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{" "}
              <Link
                href="/auth/signup"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
