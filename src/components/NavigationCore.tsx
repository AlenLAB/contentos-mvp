'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Edit3,
  Calendar,
  List,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Edit,
  Users,
  Sparkles,
  MessageCircle,
  Clock,
  Lightbulb,
  Shield,
  BarChart3,
  FileText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { semanticTypography } from '@/lib/typography'
import { themeClass, themeComponents } from '@/lib/theme/enforce'

// Navigation configuration
const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: 'calendar',
    name: 'Calendar', 
    href: '/calendar',
    icon: Calendar,
    badge: null,
  },
  {
    id: 'postcards',
    name: 'All Posts',
    href: '/postcards',
    icon: FileText,
    badge: '14',
  },
  {
    id: 'editor',
    name: 'Editor',
    href: '/editor/new',
    icon: Edit3,
    badge: null,
  },
  {
    id: 'generate',
    name: 'Generate',
    href: '/generate',
    icon: Sparkles,
    badge: null,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    badge: null,
  },
]

// Tips for the sidebar
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

interface NavigationProps {
  currentView?: string
  onViewChange?: (view: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: (collapsed: boolean) => void
  variant?: 'app-router' | 'view-based'
}

function NavigationContent({
  currentView,
  onViewChange,
  isCollapsed = false,
  onToggleCollapse,
  variant = 'app-router'
}: NavigationProps) {
  const pathname = usePathname()
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  // Determine active item based on variant
  const getActiveId = () => {
    if (variant === 'view-based' && currentView) {
      return currentView
    }
    
    // App router mode - determine from pathname
    if (pathname === '/' || pathname === '/dashboard') return 'dashboard'
    if (pathname === '/calendar') return 'calendar'
    if (pathname === '/postcards') return 'postcards'
    if (pathname.startsWith('/editor')) return 'editor'
    if (pathname === '/generate') return 'generate'
    if (pathname === '/analytics') return 'analytics'
    if (pathname === '/settings') return 'settings'
    return 'dashboard'
  }

  const activeId = getActiveId()

  // Handle item clicks based on variant
  const handleItemClick = (item: typeof navigationItems[0]) => {
    if (variant === 'view-based' && onViewChange) {
      onViewChange(item.id)
    }
    // App router variant will use Link navigation naturally
  }

  // Tip cycling effect
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
      className={themeClass(
        "flex h-full flex-col transition-premium",
        themeComponents.navigation.glass,
        "text-white border-r shadow-navigation",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="border-b border-zinc-800/50 padding-premium-md bg-zinc-800/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center space-premium-sm", isCollapsed && "justify-center")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-glow-emerald">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <h2 className="text-heading-3 text-white tracking-tight">ContentOS</h2>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleCollapse?.(!isCollapsed)}
            className="text-zinc-400 nav-item hover:bg-zinc-700/50 padding-premium-xs rounded-lg transition-premium"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 padding-premium-sm space-y-premium-xs overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeId === item.id

          const content = (
            <div
              className={cn(
                "nav-item",
                "w-full space-premium-sm h-10 rounded-xl border border-transparent backdrop-blur-sm",
                isActive
                  ? "active bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-white border-emerald-500/20 shadow-glow-emerald"
                  : "border-transparent",
                isCollapsed ? "justify-center px-2" : "justify-start px-4",
                "flex items-center text-zinc-300"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-premium shrink-0",
                  isActive ? "text-emerald-400 drop-shadow-premium" : "text-zinc-400"
                )}
              />
              {!isCollapsed && (
                <>
                  <span className={cn("flex-1 text-left", semanticTypography.navItem)}>{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-zinc-700/60 text-zinc-200 border-zinc-600/40 backdrop-blur-sm text-caption"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
          )

          if (variant === 'app-router') {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="block focus-visible"
                title={isCollapsed ? item.name : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </Link>
            )
          } else {
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="block w-full"
                title={isCollapsed ? item.name : undefined}
              >
                {content}
              </button>
            )
          }
        })}
      </nav>

      {/* Tips Section */}
      <div className="border-t border-zinc-700/30 p-3">
        {!isCollapsed ? (
          <div className="rounded-xl bg-gradient-to-r from-zinc-800/40 to-zinc-700/20 p-3 border border-zinc-600/20 backdrop-blur-sm shadow-inner-premium">
            <div className="flex items-start justify-between mb-2">
              <div className="text-xl">{tips[currentTipIndex].icon}</div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTip}
                  className="h-6 w-6 p-0 text-zinc-400 nav-item hover:bg-zinc-600/50 rounded focus-visible"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTip}
                  className="h-6 w-6 p-0 text-zinc-400 nav-item hover:bg-zinc-600/50 rounded focus-visible"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <h4 className={cn("text-white mb-1", semanticTypography.cardTitle)}>{tips[currentTipIndex].title}</h4>
            <p className={cn("text-zinc-300 leading-relaxed", semanticTypography.description)}>{tips[currentTipIndex].content}</p>
            <div className="flex gap-1 mt-2">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 rounded-full transition-premium",
                    index === currentTipIndex ? "bg-emerald-400 w-4" : "bg-zinc-600 w-1"
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

// Desktop/Mobile Wrapper Component
export function NavigationCore(props: NavigationProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  
  const isCollapsed = props.isCollapsed !== undefined ? props.isCollapsed : internalCollapsed
  const handleToggle = props.onToggleCollapse || setInternalCollapsed

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-zinc-900/50 z-50">
        <NavigationContent
          {...props}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggle}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-zinc-400 nav-item"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-zinc-900 border-zinc-800">
          <NavigationContent
            {...props}
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

// Export both the core component and the content for flexibility
export { NavigationContent }
export default NavigationCore