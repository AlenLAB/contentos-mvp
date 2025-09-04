"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText, Calendar, Edit } from "lucide-react"

interface EmptyStateProps {
  type: "posts" | "calendar" | "drafts" | "general"
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ type, title, description, actionLabel, onAction }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "posts":
        return <FileText className="h-12 w-12 text-muted-foreground/50" />
      case "calendar":
        return <Calendar className="h-12 w-12 text-muted-foreground/50" />
      case "drafts":
        return <Edit className="h-12 w-12 text-muted-foreground/50" />
      default:
        return <Plus className="h-12 w-12 text-muted-foreground/50" />
    }
  }

  return (
    <Card className="border-dashed border-2 animate-fade-in">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mb-4 animate-pulse-subtle">{getIcon()}</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="shadow-premium hover-lift transition-premium group">
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
