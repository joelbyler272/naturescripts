"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"

interface NavigationProps {
  variant?: "default" | "floating" | "minimal"
  isAuthenticated?: boolean
  userTier?: "free" | "pro"
}

export function Navigation({
  variant = "default",
  isAuthenticated = false,
  userTier = "free"
}: NavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  // Floating navigation variant
  if (variant === "floating") {
    return (
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 rounded-full bg-foreground/95 backdrop-blur-sm px-6 py-3 shadow-lg">
          <Logo size="sm" showTagline={false} />

          <div className="h-4 w-px bg-background/20" />

          <div className="flex items-center gap-5">
            <Link
              href="/herbs"
              className={cn(
                "text-sm transition-colors",
                isActive("/herbs") ? "text-background" : "text-background/60 hover:text-background"
              )}
            >
              Herbs
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "text-sm transition-colors",
                isActive("/dashboard") ? "text-background" : "text-background/60 hover:text-background"
              )}
            >
              Dashboard
            </Link>
          </div>

          <Link
            href="/sign-in"
            className="ml-2 text-sm px-4 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>
    )
  }

  // Authenticated navigation (with user dropdown)
  if (isAuthenticated) {
    return (
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm transition-colors",
                  isActive("/dashboard") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/herbs"
                className={cn(
                  "text-sm transition-colors",
                  isActive("/herbs") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Herbal Database
              </Link>
              {userTier === "pro" && (
                <Link
                  href="/tracking"
                  className={cn(
                    "text-sm transition-colors flex items-center gap-1.5",
                    isActive("/tracking") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>Tracking</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Pro</Badge>
                </Link>
              )}
              {userTier === "free" && (
                <Link href="/upgrade">
                  <Button variant="outline" size="sm" className="text-xs rounded-full">
                    Upgrade to Pro
                  </Button>
                </Link>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Default unauthenticated navigation
  return (
    <nav className="flex items-center justify-between py-4">
      <Logo />

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/herbs"
          className={cn(
            "text-sm transition-colors",
            isActive("/herbs") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Herbal Database
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            "text-sm transition-colors",
            isActive("/dashboard") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="text-sm px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>
  )
}
