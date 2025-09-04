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
  HelpCircle
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
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col",
          isMobile ? (
            sidebarOpen 
              ? "fixed inset-0 z-40 w-64" 
              : "fixed -left-64 w-64"
          ) : (
            sidebarCollapsed 
              ? "w-16" 
              : "w-64"
          )
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
          {(!sidebarCollapsed || isMobile) && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">ContentOS</span>
            </Link>
          )}
          
          {!isMobile && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                sidebarCollapsed && "rotate-180"
              )} />
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  active 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  active && "text-primary-foreground"
                )} />
                
                {(!sidebarCollapsed || isMobile) && (
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    {!sidebarCollapsed && (
                      <div className={cn(
                        "text-xs",
                        active 
                          ? "text-primary-foreground/80" 
                          : "text-gray-500 dark:text-gray-400"
                      )}>
                        {item.description}
                      </div>
                    )}
                  </div>
                )}
                
                {sidebarCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-1">
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
                    ? "bg-gray-100 dark:bg-gray-800" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                
                {(!sidebarCollapsed || isMobile) && (
                  <span className="text-sm">{item.title}</span>
                )}
                
                {sidebarCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* User Section */}
        {(!sidebarCollapsed || isMobile) && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                U
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">User</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Free Plan
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen",
        isMobile ? "ml-0" : (sidebarCollapsed ? "ml-16" : "ml-64"),
        "transition-all duration-300"
      )}>
        {children}
      </main>
    </div>
  )
}