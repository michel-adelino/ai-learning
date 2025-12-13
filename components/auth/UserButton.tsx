"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/xano/auth-context"
import { LogOut, User, Settings, Crown } from "lucide-react"
import { AuthModal } from "./AuthModal"
import { motion } from "framer-motion"

export function UserButton() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (isLoading) {
    return <div className="w-9 h-9 rounded-full glass animate-pulse" />
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Button
          onClick={() => setShowAuthModal(true)}
          className="bg-foreground hover:bg-foreground/90 text-background rounded-xl"
        >
          Sign In
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  const initials =
    `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase()

  const tierColors = {
    free: "text-muted-foreground",
    pro: "text-foreground",
    ultra: "text-amber-400",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Avatar className="h-10 w-10 border-2 border-white/10">
              <AvatarImage src={user.avatar_url || undefined} alt={user.email} />
              <AvatarFallback className="glass text-foreground font-medium">{initials}</AvatarFallback>
            </Avatar>
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 glass-heavy rounded-xl border-white/10 p-2" align="end">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src={user.avatar_url || undefined} alt={user.email} />
            <AvatarFallback className="glass text-foreground text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 leading-none min-w-0">
            <p className="font-medium text-foreground truncate">
              {user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <div className={`flex items-center gap-1 text-xs ${tierColors[user.tier]}`}>
              <Crown className="w-3 h-3" />
              <span className="capitalize">{user.tier} Plan</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-white/5 my-1" />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground cursor-pointer py-2.5 px-3 rounded-lg"
          >
            <User className="w-4 h-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground cursor-pointer py-2.5 px-3 rounded-lg"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {(user.tier || "").toLowerCase() !== "ultra" && (
          <DropdownMenuItem asChild>
            <Link
              href="/pricing"
              className="flex items-center gap-3 text-amber-400 hover:text-amber-300 cursor-pointer py-2.5 px-3 rounded-lg"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-white/5 my-1" />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 cursor-pointer py-2.5 px-3 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
