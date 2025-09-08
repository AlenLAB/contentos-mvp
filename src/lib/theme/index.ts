/**
 * ContentOS Design System - Theme Configuration
 * Single source of truth for all design tokens
 */

export const theme = {
  // Color System - Consolidated RGB values
  colors: {
    // Background System
    background: '#09090b',      // zinc-950
    card: '#18181b',           // zinc-900  
    cardMuted: '#0e0f12',      // zinc-800/50
    button: '#27272a',         // zinc-800
    
    // Border System
    border: {
      default: '#27272a',      // zinc-800
      hover: '#3f3f46',        // zinc-700
      focus: '#10b981',        // emerald-500
    },
    
    // Text System
    text: {
      primary: '#ffffff',       // white
      secondary: '#a1a1aa',     // zinc-400
      muted: '#71717a',        // zinc-500
      disabled: '#52525b',      // zinc-600
    },
    
    // Accent System - Emerald only
    accent: {
      primary: '#10b981',       // emerald-500 - primary actions
      hover: '#059669',         // emerald-600 - hover states only
      light: '#34d399',         // emerald-400 - success indicators
      background: '#10b98133',  // emerald-500/20 - backgrounds
    },
    
    // Status System
    status: {
      success: '#22c55e',       // green-500
      warning: '#f59e0b',       // amber-500
      error: '#ef4444',         // red-500
      info: '#3b82f6',          // blue-500
    },
    
    // Shadow System
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      premium: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      premiumLg: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
    },
  },

  // Typography System - 8 consistent scales
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',      // 12px - captions, fine print
      sm: '0.875rem',     // 14px - body text minimum
      base: '1rem',       // 16px - standard body text
      lg: '1.125rem',     // 18px - large body text
      xl: '1.25rem',      // 20px - small headings
      '2xl': '1.5rem',    // 24px - section headings
      '3xl': '1.875rem',  // 30px - page headings
      '4xl': '2.25rem',   // 36px - hero headings, KPI numbers
    },
    lineHeight: {
      tight: 1.25,       // For large headings
      snug: 1.375,       // For medium headings
      normal: 1.5,       // For body text - optimal readability
      relaxed: 1.625,    // For longer content
    },
    letterSpacing: {
      tight: '-0.025em', // For large headings
      normal: '0em',     // Default
      wide: '0.025em',   // For small caps, labels
    },
    fontWeight: {
      normal: 400,       // Regular text
      medium: 500,       // Emphasis, labels
      bold: 700,         // Headings, strong emphasis
    },
  },

  // Spacing System - 8px base grid
  spacing: {
    xs: '0.25rem',      // 4px - minimal spacing, borders
    sm: '0.5rem',       // 8px - base unit, tight spacing
    md: '1rem',         // 16px - standard spacing between elements
    lg: '1.5rem',       // 24px - section spacing, card padding
    xl: '2rem',         // 32px - large section spacing
    '2xl': '3rem',      // 48px - major section breaks
    '3xl': '4rem',      // 64px - page-level spacing
    '4xl': '6rem',      // 96px - hero sections, major breaks
    
    // Component-specific tokens
    cardPadding: '1.5rem',    // 24px - standard card internal padding
    sectionGap: '2rem',       // 32px - gap between major sections
    elementGap: '1rem',       // 16px - gap between related elements
    tightGap: '0.5rem',       // 8px - gap between tightly related items
  },

  // Border Radius System
  radius: {
    none: '0',
    sm: '0.125rem',     // 2px
    default: '0.375rem', // 6px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    full: '9999px',
  },

  // Animation System
  transitions: {
    default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Interaction States System
  states: {
    // Button States
    button: {
      default: {
        background: 'var(--color-primary)',
        text: 'var(--color-primary-foreground)',
        border: 'var(--color-primary)',
      },
      hover: {
        background: 'var(--color-primary-hover)',
        text: 'var(--color-primary-foreground)',
        border: 'var(--color-primary-hover)',
        transform: 'translateY(-1px)',
        shadow: 'var(--shadow-md)',
      },
      focus: {
        background: 'var(--color-primary)',
        text: 'var(--color-primary-foreground)',
        border: 'var(--color-accent-primary)',
        outline: '2px solid var(--color-accent-primary)',
        outlineOffset: '2px',
      },
      active: {
        background: 'var(--color-primary-hover)',
        text: 'var(--color-primary-foreground)',
        transform: 'translateY(0px)',
        shadow: 'var(--shadow-sm)',
      },
      disabled: {
        background: 'var(--color-muted)',
        text: 'var(--color-muted-foreground)',
        border: 'var(--color-muted)',
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    
    // Navigation States
    nav: {
      default: {
        background: 'transparent',
        text: 'var(--color-text-secondary)',
        border: 'transparent',
      },
      hover: {
        background: 'var(--color-card)',
        text: 'var(--color-text-primary)',
        border: 'var(--color-border-hover)',
      },
      active: {
        background: 'var(--color-accent-primary)',
        text: 'var(--color-primary-foreground)',
        border: 'var(--color-accent-primary)',
      },
      focus: {
        outline: '2px solid var(--color-accent-primary)',
        outlineOffset: '2px',
      },
    },

    // Input States
    input: {
      default: {
        background: 'var(--color-background)',
        text: 'var(--color-text-primary)',
        border: 'var(--color-border-default)',
      },
      hover: {
        border: 'var(--color-border-hover)',
      },
      focus: {
        border: 'var(--color-border-focus)',
        outline: '2px solid var(--color-accent-primary)',
        outlineOffset: '2px',
      },
      error: {
        border: 'var(--color-error)',
        outline: '2px solid var(--color-error)',
      },
      disabled: {
        background: 'var(--color-muted)',
        text: 'var(--color-muted-foreground)',
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
  },

  // Z-Index System
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    toast: 70,
    tooltip: 80,
    max: 9999,
  },

  // Breakpoints
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

// Type exports for TypeScript
export type Theme = typeof theme
export type ThemeColors = typeof theme.colors
export type ThemeSpacing = typeof theme.spacing
export type ThemeTypography = typeof theme.typography

// Helper function to get theme values
export const getThemeValue = (path: string): string => {
  const keys = path.split('.')
  let value: any = theme
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      console.warn(`Theme value not found: ${path}`)
      return ''
    }
  }
  
  return typeof value === 'string' ? value : ''
}

// CSS Variable generators
export const generateCSSVariables = (): Record<string, string> => {
  const cssVars: Record<string, string> = {}
  
  // Colors
  cssVars['--color-background'] = theme.colors.background
  cssVars['--color-card'] = theme.colors.card
  cssVars['--color-border'] = theme.colors.border.default
  cssVars['--color-text-primary'] = theme.colors.text.primary
  cssVars['--color-text-secondary'] = theme.colors.text.secondary
  cssVars['--color-accent-primary'] = theme.colors.accent.primary
  cssVars['--color-accent-hover'] = theme.colors.accent.hover
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars[`--space-${key}`] = value
  })
  
  // Typography
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value
  })
  
  return cssVars
}