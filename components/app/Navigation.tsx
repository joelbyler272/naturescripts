"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { routes } from "@/lib/constants/routes"

interface NavigationProps {
  isAuthenticated?: boolean
  userTier?: "free" | "pro"
  onSignOut?: () => void
}

export function Navigation({
  isAuthenticated = false,
  userTier = "free",
  onSignOut
}: NavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path + '/'))

  // Authenticated navigation (with user dropdown)
  if (isAuthenticated) {
    return (
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href={routes.dashboard}
                className={cn(
                  "text-sm transition-colors",
                  isActive(routes.dashboard) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link
                href={routes.remedies}
                className={cn(
                  "text-sm transition-colors",
                  isActive(routes.remedies) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Remedy Database
              </Link>
              <Link
                href={routes.library}
                className={cn(
                  "text-sm transition-colors",
                  isActive(routes.library) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Library
              </Link>
              {userTier === "free" && (
                <Link href={routes.upgrade}>
                  <Button variant="outline" size="sm" className="text-xs rounded-full">
                    Upgrade to Pro
                  </Button>
                </Link>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={routes.settings} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {userTier === "pro" && (
                    <DropdownMenuItem asChild>
                      <Link href={routes.tracking} className="cursor-pointer">
                        Tracking
                        <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">Pro</Badge>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={onSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/50 py-3 space-y-1">
              <Link
                href={routes.dashboard}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-2 py-2 text-sm rounded-md transition-colors",
                  isActive(routes.dashboard) ? "text-foreground bg-secondary/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link
                href={routes.remedies}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-2 py-2 text-sm rounded-md transition-colors",
                  isActive(routes.remedies) ? "text-foreground bg-secondary/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Remedy Database
              </Link>
              <Link
                href={routes.library}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-2 py-2 text-sm rounded-md transition-colors",
                  isActive(routes.library) ? "text-foreground bg-secondary/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Library
              </Link>
              <Link
                href={routes.settings}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-2 py-2 text-sm rounded-md transition-colors",
                  isActive(routes.settings) ? "text-foreground bg-secondary/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Settings
              </Link>
              {userTier === "free" && (
                <Link
                  href={routes.upgrade}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Upgrade to Pro
                </Link>
              )}
              {onSignOut && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onSignOut(); }}
                  className="block w-full text-left px-2 py-2 text-sm text-destructive hover:bg-secondary/50 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Unauthenticated navigation (for public pages)
  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href={routes.remedies}
              className={cn(
                "text-sm transition-colors",
                isActive(routes.remedies) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Remedy Database
            </Link>
            <Link
              href={routes.library}
              className={cn(
                "text-sm transition-colors",
                isActive(routes.library) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Library
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={routes.signIn}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={routes.onboarding}
              className="text-sm px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Start Consultation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
