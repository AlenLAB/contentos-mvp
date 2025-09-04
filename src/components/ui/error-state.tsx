"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  onGoHome?: () => void
  className?: string
  variant?: "inline" | "page" | "card"
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  onGoHome,
  className,
  variant = "inline",
}: ErrorStateProps) {
  if (variant === "inline") {
    return (
      <Alert className={cn("border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20", className)}>
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          {message}
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="ml-2 h-auto p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Try again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-card border border-border rounded-lg p-6", className)}>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{message}</p>
            {(onRetry || onGoHome) && (
              <div className="flex items-center space-x-2 pt-2">
                {onRetry && (
                  <Button variant="outline" size="sm" onClick={onRetry}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                )}
                {onGoHome && (
                  <Button variant="ghost" size="sm" onClick={onGoHome}>
                    <Home className="h-3 w-3 mr-1" />
                    Go Home
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Page variant
  return (
    <div className={cn("flex flex-col items-center justify-center text-center space-y-6 py-16", className)}>
      <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>

      <div className="flex items-center space-x-3">
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button variant="outline" onClick={onGoHome}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  )
}
