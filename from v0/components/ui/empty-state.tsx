"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  variant?: "default" | "minimal" | "illustration"
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center space-y-4 py-12",
        variant === "minimal" && "py-8",
        className,
      )}
    >
      {variant === "illustration" ? (
        <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-muted/50 rounded-full animate-pulse" />
        </div>
      ) : Icon ? (
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-2">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : null}

      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {action && (
        <Button onClick={action.onClick} className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
          {action.label}
        </Button>
      )}
    </div>
  )
}
