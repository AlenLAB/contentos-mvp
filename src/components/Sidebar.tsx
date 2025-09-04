"use client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  FileText,
  BarChart3,
  Menu,
  Home,
  Edit,
  Users,
  Sparkles,
  MessageCircle,
  Clock,
  Lightbulb,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface SidebarNavigationProps {
  currentView: string
  onViewChange: (view: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: (collapsed: boolean) => void
}

const navigationGroups = [
  {
    label: "Overview & Planning",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "calendar", label: "Calendar", icon: Calendar },
      { id: "scheduler", label: "Scheduler", icon: Clock },
    ],
  },
  {
    label: "Content Management",
    items: [
      { id: "postcards", label: "Postcards", icon: FileText, badge: "14" },
      { id: "editor", label: "Editor", icon: Edit },
    ],
  },
  {
    label: "Analytics & People",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "team", label: "Team", icon: MessageCircle, badge: "3" },
      { id: "audience", label: "Audience", icon: Users },
    ],
  },
  {
    label: "Tools & System",
    items: [
      { id: "discovery", label: "Discovery", icon: Lightbulb },
      { id: "qc", label: "Quality Control", icon: Shield, badge: "✓" },
    ],
  },
]

const tips = [
  {
    title: "Best Posting Times",
    content: "Post on LinkedIn between 8-10 AM for maximum engagement",
    icon: "⏰",
  },
  {
    title: "Content Strategy",
    content: "Use 3-5 hashtags per post for optimal reach without spam",
    icon: "📈",
  },
  {
    title: "Engagement Tip",
    content: "Ask questions in your posts to boost comment rates by 50%",
    icon: "💬",
  },
  {
    title: "Visual Content",
    content: "Posts with images get 2.3x more engagement than text-only",
    icon: "🖼️",
  },
  {
    title: "Consistency",
    content: "Post 3-5 times per week to maintain audience engagement",
    icon: "📅",
  },
]

function SidebarContent({
  currentView,
  onViewChange,
  isCollapsed: externalCollapsed,
  onToggleCollapse,
}: SidebarNavigationProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsed)
    } else {
      setInternalCollapsed(newCollapsed)
    }
  }

  useEffect(() => {
    if (!isCollapsed) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length)
      }, 20000)
      return () => clearInterval(interval)
    }
  }, [isCollapsed])

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length)
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 text-white border-r border-zinc-700/50 backdrop-blur-xl transition-all duration-300 shadow-2xl",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="border-b border-zinc-700/30 p-4 bg-zinc-800/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white tracking-tight">ContentOS</h2>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("profile")}
                className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-full transition-all duration-200 overflow-hidden"
                title="Profile"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                  JD
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("settings")}
                className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 p-1.5 rounded-lg transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navigationGroups.map((group, groupIndex) => (
          <div key={group.label}>
            {groupIndex > 0 && (
              <div className="relative mb-3 -mx-3">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/30 to-transparent h-px" />
              </div>
            )}

            {!isCollapsed && (
              <div className="px-2 mb-2">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{group.label}</p>
              </div>
            )}

            {/* Group items with enhanced hover effects */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 h-10 text-zinc-300 hover:text-white transition-all duration-300 rounded-xl border border-transparent backdrop-blur-sm",
                      "hover:bg-gradient-to-r hover:from-zinc-800/60 hover:to-zinc-700/40 hover:border-zinc-600/30 hover:shadow-lg hover:shadow-zinc-900/20",
                      isActive &&
                        "bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-white border-emerald-500/20 shadow-lg shadow-emerald-500/10",
                      isCollapsed ? "justify-center px-2" : "justify-start px-4",
                    )}
                    onClick={() => onViewChange(item.id)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-all duration-300",
                        isActive ? "text-emerald-400 drop-shadow-sm" : "text-zinc-400",
                      )}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-zinc-700/60 text-zinc-200 border-zinc-600/40 backdrop-blur-sm"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-700/30 p-3">
        {!isCollapsed ? (
          <div className="rounded-xl bg-gradient-to-r from-zinc-800/40 to-zinc-700/20 p-3 border border-zinc-600/20 backdrop-blur-sm shadow-inner">
            <div className="flex items-start justify-between mb-2">
              <div className="text-xl">{tips[currentTipIndex].icon}</div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTip}
                  className="h-6 w-6 p-0 text-zinc-400 hover:text-white hover:bg-zinc-600/50 rounded"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTip}
                  className="h-6 w-6 p-0 text-zinc-400 hover:text-white hover:bg-zinc-600/50 rounded"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">{tips[currentTipIndex].title}</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">{tips[currentTipIndex].content}</p>
            <div className="flex gap-1 mt-2">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    index === currentTipIndex ? "bg-emerald-400 w-4" : "bg-zinc-600 w-1",
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-gradient-to-r from-zinc-800/40 to-zinc-700/20 p-2 border border-zinc-600/20 backdrop-blur-sm shadow-inner flex justify-center">
            <div className="text-lg">{tips[currentTipIndex].icon}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function SidebarNavigation({
  currentView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
}: SidebarNavigationProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-zinc-900">
        <SidebarContent
          currentView={currentView}
          onViewChange={onViewChange}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-zinc-900">
          <SidebarContent currentView={currentView} onViewChange={onViewChange} />
        </SheetContent>
      </Sheet>
    </>
  )
}
