'use client'

// DEPRECATED: This component has been replaced by NavigationCore
// Use NavigationCore instead for consistent navigation across the app

import { NavigationCore } from '@/components/NavigationCore'

// Legacy wrapper for backward compatibility
export default function Navigation() {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Navigation.tsx is deprecated. Use NavigationCore instead.')
  }
  
  return (
    <NavigationCore 
      variant="app-router"
    />
  )
}