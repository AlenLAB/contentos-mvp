'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SidebarNavigation } from '@/components/Sidebar'
import { ParticleSystem } from '@/components/PremiumEffects'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Map pathnames to view names used by V0 sidebar
  const getViewFromPath = (path: string) => {
    if (path === '/' || path === '/dashboard') return 'dashboard'
    if (path === '/calendar') return 'calendar'
    if (path === '/postcards') return 'postcards'
    if (path.startsWith('/editor')) return 'editor'
    if (path === '/generate') return 'editor' // Map generate to editor view
    return 'dashboard'
  }
  
  const handleViewChange = (view: string) => {
    // Navigate to the appropriate route based on view selection
    switch(view) {
      case 'dashboard':
        router.push('/dashboard')
        break
      case 'calendar':
        router.push('/calendar')
        break
      case 'postcards':
        router.push('/postcards')
        break
      case 'editor':
        router.push('/editor/new')
        break
      case 'scheduler':
        router.push('/calendar') // Map to calendar for now
        break
      default:
        router.push('/dashboard')
    }
  }
  
  return (
    <div className="flex h-screen bg-background">
      <ParticleSystem />
      <SidebarNavigation 
        currentView={getViewFromPath(pathname)}
        onViewChange={handleViewChange}
        onToggle={setIsCollapsed}
        isCollapsed={isCollapsed}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}