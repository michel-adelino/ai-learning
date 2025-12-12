"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/xano/auth-context"
import { Loader2, GraduationCap, BookOpen, Mail, Lock, User } from "lucide-react"
import { motion } from "framer-motion"

interface AuthFormProps {
  mode: "login" | "signup"
  onSuccess?: () => void
  redirectTo?: string
}

export function AuthForm({ mode, onSuccess, redirectTo = "/dashboard" }: AuthFormProps) {
  const { login, signup } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student" as "student" | "teacher",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === "login") {
        await login(formData.email, formData.password)
      } else {
        await signup(formData.email, formData.password, formData.firstName, formData.lastName, formData.role)
      }

      document.cookie = `xano_auth_token=${localStorage.getItem("xano_auth_token")}; path=/; max-age=${60 * 60 * 24 * 7}`

      onSuccess?.()

      const redirectPath = formData.role === "teacher" && mode === "signup" ? "/teacher" : redirectTo
      router.push(redirectPath)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl glass border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {mode === "signup" && (
        <>
          {/* Role Selection - Compact */}
          <div className="space-y-1.5">
            <Label className="text-foreground font-medium text-xs">I want to...</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as "student" | "teacher" })}
              className="grid grid-cols-2 gap-2"
            >
              <motion.label
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.role === "student"
                    ? "border-emerald-500/40 glass ring-1 ring-emerald-500/30"
                    : "border-white/10 hover:border-white/20 glass-subtle"
                }`}
              >
                <RadioGroupItem value="student" id="student" className="sr-only" />
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${formData.role === "student" ? "bg-emerald-500/20" : "glass-subtle"}`}
                >
                  <BookOpen
                    className={`w-3.5 h-3.5 ${formData.role === "student" ? "text-emerald-400" : "text-muted-foreground"}`}
                  />
                </div>
                <p
                  className={`font-medium text-sm ${formData.role === "student" ? "text-foreground" : "text-muted-foreground"}`}
                >
                  Learn
                </p>
              </motion.label>
              <motion.label
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.role === "teacher"
                    ? "border-amber-500/50 glass ring-1 ring-amber-500/30"
                    : "border-white/10 hover:border-white/20 glass-subtle"
                }`}
              >
                <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${formData.role === "teacher" ? "bg-amber-500/20" : "glass-subtle"}`}
                >
                  <GraduationCap
                    className={`w-3.5 h-3.5 ${formData.role === "teacher" ? "text-amber-400" : "text-muted-foreground"}`}
                  />
                </div>
                <p
                  className={`font-medium text-sm ${formData.role === "teacher" ? "text-foreground" : "text-muted-foreground"}`}
                >
                  Teach
                </p>
              </motion.label>
            </RadioGroup>
          </div>

          {/* Name fields - compact */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-muted-foreground font-medium text-xs">
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm"
                  placeholder="John"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-muted-foreground font-medium text-xs">
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-y-1">
        <Label htmlFor="email" className="text-muted-foreground font-medium text-xs">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm"
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-muted-foreground font-medium text-xs">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-1">
        <Button
          type="submit"
          className="w-full h-9 btn-shiny bg-emerald-500 hover:bg-emerald-400 text-background font-semibold rounded-xl glow-emerald transition-all text-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === "login" ? "Signing in..." : "Creating account..."}
            </>
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
}
