"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  maxLength?: number
  onSubmit?: (query: string) => void
  className?: string
  buttonText?: string
}

export function SearchBar({
  placeholder = "Describe your symptoms...",
  maxLength = 500,
  onSubmit,
  className,
  buttonText = "Start consultation"
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = () => {
    if (query.trim() && onSubmit) {
      onSubmit(query.trim())
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-full bg-foreground p-[5px] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, maxLength))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={placeholder}
            className="h-12 flex-1 bg-transparent px-5 text-[15px] text-background placeholder:text-background/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!query.trim()}
            className="
              h-12 shrink-0 rounded-full
              bg-accent px-6 text-[14px] font-medium text-accent-foreground
              transition-all duration-200
              hover:bg-accent/90
              hover:shadow-[0_0_0_4px_rgba(107,142,127,0.15)]
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-accent/50
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Micro-trust + counter */}
      <div className="mt-4 flex items-center justify-between px-3">
        <p className="text-[11px] text-muted-foreground/45">
          No diagnosis. Safety-checked for herb-drug interactions.
        </p>
        <span className="text-[11px] tabular-nums text-muted-foreground/35">
          {query.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}
