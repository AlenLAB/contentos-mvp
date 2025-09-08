'use client'

import { useState } from 'react'
import { NavigationCore } from '@/components/NavigationCore'
import { ParticleSystem } from '@/components/PremiumEffects'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <div className="dark">
      <div className="flex h-screen bg-background">
        <ParticleSystem />
        <NavigationCore 
          variant="app-router"
          isCollapsed={isCollapsed}
          onToggleCollapse={setIsCollapsed}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}