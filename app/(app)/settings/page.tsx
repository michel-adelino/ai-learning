"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, User, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/xano/auth-context"
import { AnimatedBackground } from "../home-client"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const { user, updateProfile, isAuthenticated, isLoading: authLoading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    avatar_url: "",
  })

  // Update form when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        avatar_url: user.avatar_url || "",
      })
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-foreground" />
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-foreground">Please sign in to access settings.</p>
        <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Send all fields - the backend will handle empty strings properly
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: formData.avatar_url,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const initials =
    `${formData.first_name?.[0] || ""}${formData.last_name?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">Update your profile information and avatar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-3xl glass-card"
            >
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <Camera className="w-5 h-5 text-muted-foreground" />
                </div>
                Profile Picture
              </h2>

              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24 border-2 border-white/10">
                  <AvatarImage src={formData.avatar_url || undefined} alt="Avatar preview" />
                  <AvatarFallback className="glass text-foreground text-2xl">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor="avatar_url" className="text-muted-foreground">
                      Avatar URL
                    </Label>
                    <Input
                      id="avatar_url"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="mt-2 glass border-white/10 text-foreground placeholder:text-muted-foreground rounded-xl h-11"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter a URL to an image (JPG, PNG, GIF). You can use services like{" "}
                      <a
                        href="https://imgur.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline"
                      >
                        Imgur
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://gravatar.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline"
                      >
                        Gravatar
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-3xl glass-card"
            >
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                Personal Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first_name" className="text-muted-foreground">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="mt-2 glass border-white/10 text-foreground placeholder:text-muted-foreground rounded-xl h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="last_name" className="text-muted-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="mt-2 glass border-white/10 text-foreground placeholder:text-muted-foreground rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-2 glass-subtle border-white/5 text-muted-foreground cursor-not-allowed rounded-xl h-11"
                />
                <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
              </div>
            </motion.div>

            {/* Status Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl glass border border-red-500/20 text-red-400"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl glass border border-emerald-500/20 text-emerald-400"
              >
                Profile updated successfully!
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-end"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 rounded-xl glow-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
