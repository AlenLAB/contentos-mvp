"use client"

import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  isActive?: boolean
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbNavigation({ items, className }: BreadcrumbNavigationProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-6", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => items[0]?.onClick?.()}
      >
        <Home className="h-3 w-3" />
      </Button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 font-medium transition-colors duration-200",
              item.isActive ? "text-foreground cursor-default" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={item.onClick}
            disabled={item.isActive}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  )
}
