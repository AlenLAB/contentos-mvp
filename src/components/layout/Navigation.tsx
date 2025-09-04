'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Edit3, 
  Calendar, 
  List,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Editor',
    href: '/editor/new',
    icon: Edit3,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'All Posts',
    href: '/postcards',
    icon: List,
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <nav className={cn(
      "h-screen bg-card border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className={cn(
              "font-bold text-xl transition-opacity duration-300",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}>
              ContentOS
            </h2>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-accent rounded"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === '/editor/new' && pathname.startsWith('/editor/'))
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span className={cn(
                      "transition-opacity duration-300",
                      isCollapsed ? "opacity-0 w-0" : "opacity-100"
                    )}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Settings/Footer */}
        <div className="p-4 border-t">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings size={20} className="shrink-0" />
            <span className={cn(
              "transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            )}>
              Settings
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}