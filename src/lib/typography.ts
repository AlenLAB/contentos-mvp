/**
 * ContentOS Typography System
 * Utility functions and classes for consistent typography
 */

import { cn } from '@/lib/utils'

// Typography scale utility classes
export const typography = {
  // Display text - for hero sections and major headings
  display: 'text-display', // text-4xl font-bold tracking-tight leading-tight
  
  // Heading hierarchy
  h1: 'text-heading-1', // text-3xl font-bold tracking-tight leading-tight
  h2: 'text-heading-2', // text-2xl font-bold leading-snug
  h3: 'text-heading-3', // text-xl font-medium leading-snug
  
  // Body text variants
  bodyLarge: 'text-body-large', // text-lg leading-relaxed
  body: 'text-body', // text-base leading-normal
  bodySmall: 'text-body-small', // text-sm leading-normal
  
  // Special purpose
  caption: 'text-caption', // text-xs font-medium uppercase tracking-wide
  
  // Interactive text
  link: 'text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline transition-colors',
  linkSubtle: 'text-zinc-400 hover:text-white transition-colors',
  
  // Code and monospace
  code: 'font-mono text-sm bg-zinc-800 px-2 py-1 rounded text-emerald-400',
  codeBlock: 'font-mono text-sm bg-zinc-800 p-4 rounded-lg text-zinc-200 border border-zinc-700',
} as const

// Typography component generator functions
export const createTypographyClass = (
  variant: keyof typeof typography,
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'white',
  additionalClasses?: string
) => {
  const baseClass = typography[variant]
  
  const colorClass = color ? {
    primary: 'text-white',
    secondary: 'text-zinc-400', 
    muted: 'text-zinc-500',
    accent: 'text-emerald-400',
    white: 'text-white'
  }[color] : ''
  
  return cn(baseClass, colorClass, additionalClasses)
}

// Semantic typography for specific use cases
export const semanticTypography = {
  // Page structure
  pageTitle: createTypographyClass('h1', 'primary'),
  sectionTitle: createTypographyClass('h2', 'primary'),
  subsectionTitle: createTypographyClass('h3', 'primary'),
  
  // Content
  paragraph: createTypographyClass('body', 'primary'),
  description: createTypographyClass('bodySmall', 'secondary'),
  caption: createTypographyClass('caption', 'muted'),
  
  // Navigation
  navItem: 'text-sm font-medium text-zinc-400 hover:text-white transition-colors',
  navItemActive: 'text-sm font-medium text-emerald-400',
  
  // Forms
  label: 'text-sm font-medium text-zinc-400',
  input: 'text-base text-white placeholder:text-zinc-500',
  error: 'text-xs text-red-400',
  hint: 'text-xs text-zinc-500',
  
  // Cards and components
  cardTitle: createTypographyClass('h3', 'primary'),
  cardDescription: createTypographyClass('bodySmall', 'secondary'),
  
  // Status and feedback
  success: 'text-sm font-medium text-emerald-400',
  warning: 'text-sm font-medium text-amber-400', 
  error: 'text-sm font-medium text-red-400',
  info: 'text-sm font-medium text-blue-400',
  
  // Buttons
  buttonPrimary: 'text-sm font-medium text-white',
  buttonSecondary: 'text-sm font-medium text-zinc-400',
  buttonSmall: 'text-xs font-medium',
}

// Typography validation function
export const validateTypography = (element: HTMLElement): {
  isValid: boolean
  issues: string[]
  suggestions: string[]
} => {
  const issues: string[] = []
  const suggestions: string[] = []
  
  const computedStyle = window.getComputedStyle(element)
  const fontSize = computedStyle.fontSize
  const fontWeight = computedStyle.fontWeight
  const lineHeight = computedStyle.lineHeight
  const fontFamily = computedStyle.fontFamily
  
  // Check font family
  if (!fontFamily.includes('Inter')) {
    issues.push('Font family should be Inter')
    suggestions.push('Apply font-family: Inter or use typography classes')
  }
  
  // Check for arbitrary font sizes
  const standardSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px']
  if (!standardSizes.includes(fontSize)) {
    issues.push(`Non-standard font size: ${fontSize}`)
    suggestions.push('Use typography scale classes')
  }
  
  // Check line height
  const pxLineHeight = parseFloat(lineHeight)
  const pxFontSize = parseFloat(fontSize)
  const ratio = pxLineHeight / pxFontSize
  
  if (ratio < 1.2 || ratio > 1.7) {
    issues.push(`Line height ratio ${ratio.toFixed(2)} is outside optimal range (1.2-1.7)`)
    suggestions.push('Use typography classes with proper line heights')
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  }
}

// Development helper to audit typography
export const auditTypography = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button')
    const issues: string[] = []
    
    textElements.forEach((element, index) => {
      const validation = validateTypography(element as HTMLElement)
      if (!validation.isValid) {
        issues.push(`Element ${index + 1} (${element.tagName}): ${validation.issues.join(', ')}`)
      }
    })
    
    if (issues.length > 0) {
      console.group('🔤 Typography Audit Results')
      console.log(`Found ${issues.length} typography issues:`)
      issues.slice(0, 10).forEach(issue => console.warn('⚠️', issue))
      if (issues.length > 10) {
        console.log(`... and ${issues.length - 10} more`)
      }
      console.groupEnd()
    } else {
      console.log('✅ No typography issues found!')
    }
  }
}

// Character count utilities for content
export const characterCount = {
  twitter: 280,
  linkedin: 3000,
  
  getWarningColor: (count: number, limit: number) => {
    const percentage = (count / limit) * 100
    if (percentage > 95) return 'text-red-500'
    if (percentage > 80) return 'text-amber-500'
    return 'text-zinc-400'
  },
  
  formatCount: (count: number, limit: number) => {
    return `${count} / ${limit}`
  }
}

// Form & Feedback Utilities

export const getCharacterCountClass = (
  current: number,
  max: number,
  warningThreshold = 0.8
): 'success' | 'warning' | 'error' => {
  const percentage = current / max
  
  if (current > max) return 'error'
  if (percentage >= warningThreshold) return 'warning'
  return 'success'
}

export const getCharacterProgress = (current: number, max: number): number => {
  return Math.min((current / max) * 100, 100)
}

export const formValidation = {
  // Email validation
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  
  // Required field validation
  required: (value: string | number | boolean): boolean => {
    if (typeof value === 'string') return value.trim().length > 0
    if (typeof value === 'number') return !isNaN(value)
    return Boolean(value)
  },
  
  // Length validation
  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },
  
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },
  
  // Character count for social media
  twitterLimit: (value: string): boolean => {
    return value.length <= 280
  },
  
  linkedinLimit: (value: string): boolean => {
    return value.length <= 3000
  }
}

export const feedbackClasses = {
  success: 'feedback-message feedback-success',
  error: 'feedback-message feedback-error',
  warning: 'feedback-message feedback-warning',
  info: 'feedback-message feedback-info'
}

export const formFieldClasses = {
  container: 'form-field',
  label: 'form-label',
  input: 'input-field',
  feedback: 'feedback-message',
  characterCount: 'character-count',
  characterProgress: 'character-progress'
}

// Export everything
export default {
  typography,
  createTypographyClass,
  semanticTypography,
  validateTypography,
  auditTypography,
  characterCount,
}