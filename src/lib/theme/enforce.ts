/**
 * ContentOS Design System - Token Enforcement Utilities
 * Runtime validation and enforcement of design tokens
 */

import { theme, type Theme } from './index'
import { cn } from '@/lib/utils'

// Approved token patterns for runtime validation
const APPROVED_PATTERNS = {
  colors: {
    text: ['text-white', 'text-zinc-400', 'text-zinc-500', 'text-emerald-400', 'text-emerald-500'],
    bg: ['bg-zinc-900', 'bg-zinc-800', 'bg-zinc-950', 'bg-emerald-500', 'bg-emerald-600'],
    border: ['border-zinc-800', 'border-zinc-700', 'border-emerald-500'],
  },
  spacing: ['p-4', 'p-6', 'm-4', 'm-6', 'gap-2', 'gap-4', 'space-y-2', 'space-y-4'],
  shadows: [
    'shadow-none', 'shadow-premium-xs', 'shadow-premium', 'shadow-premium-md',
    'shadow-premium-lg', 'shadow-premium-xl', 'shadow-premium-2xl',
    'shadow-inner-premium', 'shadow-glow-emerald', 'shadow-glow-emerald-lg',
    'shadow-card', 'shadow-card-hover', 'shadow-modal', 'shadow-navigation',
    'shadow-header', 'drop-shadow-premium', 'drop-shadow-premium-md'
  ],
  transitions: ['transition-premium', 'transition-all', 'duration-300', 'ease-out'],
  animations: [
    'animate-fade-in', 'animate-fade-out',
    'animate-slide-up', 'animate-slide-down', 'animate-slide-left', 'animate-slide-right',
    'animate-scale-in', 'animate-scale-out',
    'animate-progress-fill', 'animate-pulse-subtle', 'animate-spin-slow',
    'animate-bounce-subtle',
    'animation-delay-75', 'animation-delay-100', 'animation-delay-200',
    'animation-delay-300', 'animation-delay-500',
    'hover-lift'
  ],
}

// Deprecated patterns that should be replaced
const DEPRECATED_PATTERNS = {
  colors: {
    // Gray variants that should be zinc
    'text-gray-': 'text-zinc-',
    'bg-gray-': 'bg-zinc-',
    'border-gray-': 'border-zinc-',
    
    // Non-standard emerald usage
    'text-green-': 'text-emerald-',
    'bg-green-': 'bg-emerald-',
  },
  spacing: {
    // Arbitrary values that should use tokens
    'p-3': 'p-space-sm',
    'p-5': 'p-space-lg',
    'm-3': 'm-space-sm',
    'm-5': 'm-space-lg',
  },
  shadows: {
    'shadow-lg': 'shadow-premium',
    'shadow-xl': 'shadow-premium-lg',
  }
}

/**
 * Validates className against approved design tokens
 */
export const validateClassName = (className: string): {
  isValid: boolean
  warnings: string[]
  suggestions: string[]
} => {
  const warnings: string[] = []
  const suggestions: string[] = []
  const classes = className.split(' ')
  
  classes.forEach(cls => {
    // Check for deprecated patterns
    Object.entries(DEPRECATED_PATTERNS.colors).forEach(([deprecated, replacement]) => {
      if (cls.includes(deprecated)) {
        warnings.push(`Deprecated color class: ${cls}`)
        suggestions.push(`Use ${cls.replace(deprecated, replacement)} instead`)
      }
    })
    
    // Check for arbitrary spacing values
    const spacingMatch = cls.match(/^(p|m|gap)-(\d+)$/)
    if (spacingMatch && !APPROVED_PATTERNS.spacing.includes(cls)) {
      warnings.push(`Non-standard spacing: ${cls}`)
      suggestions.push(`Consider using design system spacing tokens`)
    }
    
    // Check for non-standard shadows
    if (cls.startsWith('shadow-') && !APPROVED_PATTERNS.shadows.includes(cls)) {
      warnings.push(`Non-standard shadow: ${cls}`)
      suggestions.push(`Use shadow-premium or shadow-premium-lg`)
    }
    
    // Check for inconsistent transitions
    if (cls.includes('duration-') && !cls.includes('transition-premium')) {
      warnings.push(`Inconsistent transition: ${cls}`)
      suggestions.push(`Use transition-premium for consistent animations`)
    }
    
    // Check for non-standard animations
    if (cls.startsWith('animate-') && !APPROVED_PATTERNS.animations.includes(cls)) {
      warnings.push(`Non-standard animation: ${cls}`)
      suggestions.push(`Use standardized animation classes`)
    }
  })
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions
  }
}

/**
 * Enforces theme consistency by replacing deprecated classes
 */
export const enforceTheme = (className: string): string => {
  let enforcedClass = className
  
  // Replace deprecated color patterns
  Object.entries(DEPRECATED_PATTERNS.colors).forEach(([deprecated, replacement]) => {
    enforcedClass = enforcedClass.replace(new RegExp(deprecated, 'g'), replacement)
  })
  
  // Replace deprecated spacing patterns
  Object.entries(DEPRECATED_PATTERNS.spacing).forEach(([deprecated, replacement]) => {
    enforcedClass = enforcedClass.replace(new RegExp(`\\b${deprecated}\\b`, 'g'), replacement)
  })
  
  return enforcedClass
}

/**
 * Creates theme-aware className with validation
 */
export const themeClass = (...classes: (string | undefined | null | false)[]): string => {
  const validClasses = classes.filter(Boolean) as string[]
  const className = cn(...validClasses)
  
  // In development, validate the className
  if (process.env.NODE_ENV === 'development') {
    const validation = validateClassName(className)
    if (!validation.isValid) {
      console.group('🎨 Theme Validation Warning')
      console.warn('Non-standard classes detected:', className)
      validation.warnings.forEach(warning => console.warn('⚠️', warning))
      validation.suggestions.forEach(suggestion => console.info('💡', suggestion))
      console.groupEnd()
    }
  }
  
  return enforceTheme(className)
}

/**
 * Component-specific theme utilities
 */
export const themeComponents = {
  // Card components
  card: {
    base: 'bg-card text-card-foreground border border-zinc-800 rounded-xl shadow-premium',
    interactive: 'hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-0.5',
    padding: 'p-6', // Using space-lg token
  },
  
  // Button components  
  button: {
    base: 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300',
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-premium',
    secondary: 'border border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800',
    ghost: 'hover:bg-zinc-800 text-zinc-400 hover:text-white',
    sizes: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    },
  },
  
  // Navigation components
  navigation: {
    glass: 'backdrop-filter backdrop-blur-xl bg-zinc-900/80 border border-zinc-800/50',
    item: 'flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-300',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  
  // Form components
  form: {
    input: 'h-10 px-3 border border-zinc-800 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all duration-300',
    label: 'text-sm font-medium text-zinc-400',
    error: 'text-sm text-red-500',
  },
  
  // Typography components
  typography: {
    display: 'text-4xl font-bold text-white tracking-tight leading-tight',
    h1: 'text-3xl font-bold text-white tracking-tight leading-tight',
    h2: 'text-2xl font-bold text-white leading-snug',
    h3: 'text-xl font-medium text-white leading-snug',
    body: 'text-base text-white leading-normal',
    bodySecondary: 'text-base text-zinc-400 leading-normal',
    caption: 'text-xs font-medium text-zinc-400 uppercase tracking-wide',
  },
}

/**
 * Utility for creating consistent spacing
 */
export const spacing = {
  xs: 'p-1',        // 4px
  sm: 'p-2',        // 8px  
  md: 'p-4',        // 16px
  lg: 'p-6',        // 24px
  xl: 'p-8',        // 32px
  
  // Specific spacing utilities
  cardPadding: 'p-6',
  sectionGap: 'space-y-8',
  elementGap: 'space-y-4',
  tightGap: 'space-y-2',
}

/**
 * Development helpers
 */
export const devHelpers = {
  /**
   * Scans the DOM for non-standard classes
   */
  auditClasses: (): void => {
    if (process.env.NODE_ENV === 'development') {
      const elements = document.querySelectorAll('[class]')
      const issues: string[] = []
      
      elements.forEach(element => {
        const className = element.className
        if (typeof className === 'string') {
          const validation = validateClassName(className)
          if (!validation.isValid) {
            issues.push(`Element ${element.tagName}: ${validation.warnings.join(', ')}`)
          }
        }
      })
      
      if (issues.length > 0) {
        console.group('🔍 Theme Audit Results')
        console.log(`Found ${issues.length} theme violations:`)
        issues.slice(0, 10).forEach(issue => console.warn('⚠️', issue))
        if (issues.length > 10) {
          console.log(`... and ${issues.length - 10} more`)
        }
        console.groupEnd()
      } else {
        console.log('✅ No theme violations found!')
      }
    }
  },
  
  /**
   * Lists all theme tokens
   */
  listTokens: (): void => {
    console.group('🎨 Available Theme Tokens')
    console.log('Colors:', Object.keys(theme.colors))
    console.log('Spacing:', Object.keys(theme.spacing))
    console.log('Typography:', Object.keys(theme.typography))
    console.groupEnd()
  }
}

// Auto-audit in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Run audit after DOM is ready
  window.addEventListener('load', () => {
    setTimeout(() => devHelpers.auditClasses(), 1000)
  })
}