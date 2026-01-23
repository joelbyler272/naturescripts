import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showTagline?: boolean
  linkToHome?: boolean
}

export function Logo({
  className,
  size = "md",
  showTagline = true,
  linkToHome = true
}: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-[1.6rem]",
    lg: "text-3xl"
  }

  const taglineSizes = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]"
  }

  const content = (
    <div className={cn("inline-block", className)}>
      <div className={cn(
        "font-semibold tracking-tight leading-none font-serif",
        sizeClasses[size]
      )}>
        <span className="text-foreground">Nature</span>
        <span className="text-accent font-light">Scripts</span>
      </div>
      {showTagline && (
        <span className={cn(
          "mt-0.5 block w-full text-right tracking-[0.4em] text-muted-foreground/40 uppercase",
          taglineSizes[size]
        )}>
          Protocol
        </span>
      )}
    </div>
  )

  if (linkToHome) {
    return (
      <Link href="/" className="cursor-pointer">
        {content}
      </Link>
    )
  }

  return content
}
