"use client"
// DEPRECATED: This component has been replaced by NavigationCore
// Use NavigationCore instead for consistent navigation across the app

import { NavigationCore } from "@/components/NavigationCore"

interface SidebarNavigationProps {
  currentView: string
  onViewChange: (view: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: (collapsed: boolean) => void
}

// DEPRECATED: Use NavigationCore instead
export function SidebarNavigation(props: SidebarNavigationProps) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('SidebarNavigation is deprecated. Use NavigationCore instead.')
  }
  
  return (
    <NavigationCore 
      variant="view-based"
      currentView={props.currentView}
      onViewChange={props.onViewChange}
      isCollapsed={props.isCollapsed}
      onToggleCollapse={props.onToggleCollapse}
    />
  )
}