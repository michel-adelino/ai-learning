"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/xano/auth-context";
import { LogOut, User, Settings, Crown } from "lucide-react";
import { AuthModal } from "./AuthModal";


export function UserButton() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-800 animate-pulse" />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Button
          onClick={() => setShowAuthModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          Sign In
        </Button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase();

  const tierColors = {
    free: "text-zinc-400",
    pro: "text-violet-400",
    ultra: "text-amber-400",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar_url || undefined} alt={user.email} />
            <AvatarFallback className="bg-violet-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-zinc-900 border-zinc-800"
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-white">
              {user.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : user.email}
            </p>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <div className={`flex items-center gap-1 text-xs ${tierColors[user.tier]}`}>
              <Crown className="w-3 h-3" />
              <span className="capitalize">{user.tier} Plan</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer"
          >
            <User className="w-4 h-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            {user.tier === "ultra" ? "Account" : "Upgrade"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
