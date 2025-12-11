"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code2,
  Play,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Menu,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/xano/auth-context";
import { UserButton } from "@/components/auth";

const loggedOutLinks = [
  { href: "#courses", label: "Courses" },
  { href: "/pricing", label: "Pricing" },
  { href: "#testimonials", label: "Reviews" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  const isUltra = user?.tier === "ultra";
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    // Teacher dashboard link
    ...(isTeacher
      ? [{ href: "/teacher", label: "Teach", icon: GraduationCap }]
      : []),
    // Show "Account" for Ultra users, "Upgrade" for others
    ...(isUltra
      ? [{ href: "/pricing", label: "Account", icon: Sparkles }]
      : [{ href: "/pricing", label: "Upgrade", icon: Sparkles }]),
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-r from-violet-600 to-fuchsia-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                <Code2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">
              Simply Learn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/50 px-2 py-1.5 rounded-2xl border border-zinc-800/50">
            {!isAuthenticated
              ? loggedOutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                      pathname === link.href
                        ? "text-white bg-linear-to-r from-violet-600/80 to-fuchsia-600/80 shadow-lg shadow-violet-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    )}
                  >
                    {link.label}
                  </Link>
                ))
              : loggedInLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                      pathname === link.href
                        ? "text-white bg-linear-to-r from-violet-600/80 to-fuchsia-600/80 shadow-lg shadow-violet-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* CTA or User Button */}
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-zinc-800 animate-pulse" />
            ) : (
              <UserButton />
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-900 border-zinc-800"
              >
                {!isAuthenticated
                  ? loggedOutLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-zinc-300"
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  : loggedInLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-zinc-300"
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}

                {!isAuthenticated && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/login"
                        className="flex items-center gap-2 text-zinc-300"
                      >
                        <Play className="w-4 h-4" />
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
