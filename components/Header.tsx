"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LayoutDashboard, BookOpen, Menu, GraduationCap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/xano/auth-context"
import { UserButton } from "@/components/auth"

export function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuth()

  const isTeacher = user?.role === "teacher"

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    ...(isTeacher ? [{ href: "/teacher", label: "Teach", icon: GraduationCap }] : []),
  ]

  return (
    <header
      className="fixed top-5 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
    >
      <div
        className="glass-navbar rounded-full px-6 py-2.5 pointer-events-auto w-full max-w-[1200px] relative"
      >
        <div className="flex items-center w-full relative">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <Image
              src="/logo-white.svg"
              alt="Simply Learn"
              width={100}
              height={18}
              className="h-5 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </Link>

          {/* Navigation Links - Center (only for authenticated users) */}
          {isAuthenticated ? (
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-1 pointer-events-auto">
              {loggedInLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
                    pathname === link.href
                      ? "text-foreground bg-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right Side - Login & Start Free (anchored to right edge) */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-auto">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full glass animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <UserButton />
                {/* Mobile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="md:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground hover:bg-white/5 h-8 w-8 rounded-full"
                    >
                      <Menu className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-heavy rounded-xl border-white/10 mt-2">
                    {loggedInLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground py-2"
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-white/5 font-medium h-8 rounded-full text-sm px-4"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="btn-shiny bg-foreground text-background hover:bg-foreground/90 font-medium h-8 rounded-full text-sm px-4"
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
