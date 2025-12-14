"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  BookOpen,
  Menu,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/xano/auth-context";
import { UserButton } from "@/components/auth";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  const isTeacher = user?.role === "teacher";

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    ...(isTeacher
      ? [{ href: "/teacher", label: "Teach", icon: GraduationCap }]
      : []),
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-50 pointer-events-none">
      <div className="pointer-events-auto px-8">
        <div className="glass-navbar mx-auto w-full max-w-[1200px] rounded-full px-8 py-3">
          
          <div className="grid grid-cols-[auto_1fr_auto] items-center w-full">
            
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo-white.svg"
                alt="Simply Learn"
                width={100}
                height={18}
                priority
                className="h-4 sm:h-5 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            <nav className="hidden md:flex justify-center gap-2">
              {isAuthenticated &&
                loggedInLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                      pathname === link.href
                        ? "text-foreground bg-white/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ))}
            </nav>

            <div className="flex items-center justify-end gap-3">
              {isLoading ? (
                <div className="w-10 h-10 rounded-full glass animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <UserButton />
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild className="md:hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5"
                      >
                        <Menu className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-48 max-w-[90vw] glass-heavy rounded-xl border-white/10 mt-2 z-50"
                    >
                      {loggedInLinks.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link
                            href={link.href}
                            className="flex items-center gap-2.5 py-2 text-muted-foreground hover:text-foreground"
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
                      className="h-10 px-5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5"
                    >
                      Log in
                    </Button>
                  </Link>

                  <Link href="/auth/signup">
                    <Button
                      size="sm"
                      className="h-10 px-5 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
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
      </div>
    </header>
  );
}
