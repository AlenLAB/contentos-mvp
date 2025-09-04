"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Keyboard, X } from "lucide-react"

interface KeyboardShortcutsProps {
  onViewChange: (view: string) => void
}

export function KeyboardShortcuts({ onViewChange }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: "Cmd + K", description: "Open command palette", action: () => setIsOpen(true) },
    { key: "Cmd + 1", description: "Go to Dashboard", action: () => onViewChange("dashboard") },
    { key: "Cmd + 2", description: "Go to Calendar", action: () => onViewChange("calendar") },
    { key: "Cmd + 3", description: "Go to Postcards", action: () => onViewChange("postcards") },
    { key: "Cmd + 4", description: "Go to Editor", action: () => onViewChange("editor") },
    { key: "Cmd + N", description: "Create new post", action: () => onViewChange("editor") },
    { key: "Escape", description: "Close dialogs", action: () => setIsOpen(false) },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const cmdKey = isMac ? e.metaKey : e.ctrlKey

      if (cmdKey && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }

      if (cmdKey && e.key >= "1" && e.key <= "4") {
        e.preventDefault()
        const views = ["dashboard", "calendar", "postcards", "editor"]
        onViewChange(views[Number.parseInt(e.key) - 1])
      }

      if (cmdKey && e.key === "n") {
        e.preventDefault()
        onViewChange("editor")
      }

      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onViewChange])

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-background/90 backdrop-blur-sm border shadow-premium hover-lift transition-premium"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        <Badge variant="outline" className="ml-1 text-xs">
          ⌘K
        </Badge>
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md shadow-premium-lg animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Keyboard Shortcuts</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-premium cursor-pointer"
              onClick={shortcut.action}
            >
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <Badge variant="outline" className="text-xs font-mono">
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
