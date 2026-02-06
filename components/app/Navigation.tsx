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
import { User, Settings, LogOut } from "lucide-react"
import { routes } from "@/lib/constants/routes"

interface NavigationProps {
  isAuthenticated?: boolean
  userTier?: "free" | "pro"
}

export function Navigation({
  isAuthenticated = false,
  userTier = "free"
}: NavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  // Authenticated navigation (with user dropdown)
  if (isAuthenticated) {
    return (
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            <div className="flex items-center space-x-6">
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
                  <Button variant="ghost" size="icon" className="rounded-full">
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
