'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Edit3,
  Calendar,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  FileText,
  Settings,
  HelpCircle,
  Layers
} from "lucide-react"

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and stats"
  },
  {
    title: "Postcards",
    href: "/postcards",
    icon: Layers,
    description: "Manage content"
  },
  {
    title: "Editor",
    href: "/editor/new",
    icon: Edit3,
    description: "Create new postcard"
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Schedule content"
  },
  {
    title: "Generate",
    href: "/generate",
    icon: Sparkles,
    description: "AI content generation"
  }
]

const bottomNavigationItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App settings"
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Documentation"
  }
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') return true
    if (href === '/editor/new' && pathname?.startsWith('/editor')) return true
    return pathname === href
  }

  return (
    <div className="min-h-screen flex bg-zinc-900">
      {/* Top Navigation Bar with Glassmorphic Effect */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900/70 backdrop-blur-lg border-b border-zinc-800 z-40 flex items-center px-4">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white hover:bg-zinc-800 rounded-lg transition-colors md:hidden"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Logo/Brand */}
        <div className={cn(
          "flex items-center gap-2",
          isMobile ? "ml-4" : (sidebarCollapsed ? "ml-20" : "ml-72")
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">ContentOS</span>
        </div>

        {/* Top Navigation Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 bottom-0 bg-zinc-950 border-r border-zinc-800 transition-all duration-300 flex flex-col z-30",
          isMobile ? (
            sidebarOpen 
              ? "left-0 w-64" 
              : "-left-64 w-64"
          ) : (
            sidebarCollapsed 
              ? "left-0 w-16" 
              : "left-0 w-64"
          )
        )}
      >
        {/* Collapse Toggle (Desktop Only) */}
        {!isMobile && (
          <div className="p-2 border-b border-zinc-800">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                sidebarCollapsed && "rotate-180"
              )} />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                  active 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  active && "text-emerald-400"
                )} />
                
                {(!sidebarCollapsed || isMobile) && (
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    {!sidebarCollapsed && (
                      <div className={cn(
                        "text-xs",
                        active 
                          ? "text-emerald-400/70" 
                          : "text-zinc-500"
                      )}>
                        {item.description}
                      </div>
                    )}
                  </div>
                )}
                
                {sidebarCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-zinc-800 p-4 space-y-1">
          {bottomNavigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                  active 
                    ? "bg-zinc-800 text-white" 
                    : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                
                {(!sidebarCollapsed || isMobile) && (
                  <span className="text-sm">{item.title}</span>
                )}
                
                {sidebarCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* User Section */}
        {(!sidebarCollapsed || isMobile) && (
          <div className="border-t border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Alen</div>
                <div className="text-xs text-zinc-500">
                  AI-First Builder
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen bg-zinc-900 pt-16",
        isMobile ? "ml-0" : (sidebarCollapsed ? "ml-16" : "ml-64"),
        "transition-all duration-300"
      )}>
        {children}
      </main>
    </div>
  )
}