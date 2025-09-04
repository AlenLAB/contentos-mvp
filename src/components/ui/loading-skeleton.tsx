"use client"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "card" | "text" | "avatar" | "chart" | "list"
  count?: number
}

export function LoadingSkeleton({ className, variant = "card", count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded animate-shimmer w-24" />
              <div className="h-8 w-8 bg-muted rounded animate-shimmer" />
            </div>
            <div className="h-8 bg-muted rounded animate-shimmer w-20" />
            <div className="h-3 bg-muted rounded animate-shimmer w-32" />
          </div>
        )

      case "text":
        return (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-shimmer w-full" />
            <div className="h-4 bg-muted rounded animate-shimmer w-3/4" />
            <div className="h-4 bg-muted rounded animate-shimmer w-1/2" />
          </div>
        )

      case "avatar":
        return (
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-muted rounded-full animate-shimmer" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-shimmer w-24" />
              <div className="h-3 bg-muted rounded animate-shimmer w-16" />
            </div>
          </div>
        )

      case "chart":
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-4 bg-muted rounded animate-shimmer w-32 mb-4" />
            <div className="h-48 bg-muted rounded animate-shimmer" />
          </div>
        )

      case "list":
        return (
          <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-muted rounded animate-shimmer" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-shimmer w-32" />
                <div className="h-3 bg-muted rounded animate-shimmer w-20" />
              </div>
            </div>
            <div className="h-6 bg-muted rounded animate-shimmer w-16" />
          </div>
        )

      default:
        return <div className="h-4 bg-muted rounded animate-shimmer" />
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}
