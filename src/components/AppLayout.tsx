'use client'

import { useState, useEffect } from 'react'
import { NavigationCore } from '@/components/NavigationCore'
import { cn } from '@/lib/utils'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  return (
    <div className="dark">
      <div className="flex h-screen bg-background">
        <NavigationCore 
          variant="app-router"
          isCollapsed={isCollapsed}
          onToggleCollapse={setIsCollapsed}
        />
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 ease-in-out",
            isLargeScreen && isCollapsed && "lg:ml-16",
            isLargeScreen && !isCollapsed && "lg:ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}