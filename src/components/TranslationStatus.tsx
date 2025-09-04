import React from 'react'
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type TranslationStatus = 'pending' | 'processing' | 'completed' | 'failed'

interface TranslationStatusProps {
  status?: TranslationStatus
  className?: string
  showLabel?: boolean
}

export function TranslationStatus({ 
  status, 
  className,
  showLabel = true 
}: TranslationStatusProps) {
  if (!status) return null

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Translation pending',
      className: 'text-yellow-600 dark:text-yellow-400',
      bgClassName: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    processing: {
      icon: Loader2,
      label: 'Translating...',
      className: 'text-blue-600 dark:text-blue-400',
      bgClassName: 'bg-blue-100 dark:bg-blue-900/20',
      animate: true,
    },
    completed: {
      icon: CheckCircle,
      label: 'Translation complete',
      className: 'text-green-600 dark:text-green-400',
      bgClassName: 'bg-green-100 dark:bg-green-900/20',
    },
    failed: {
      icon: AlertCircle,
      label: 'Translation failed',
      className: 'text-red-600 dark:text-red-400',
      bgClassName: 'bg-red-100 dark:bg-red-900/20',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        config.bgClassName,
        config.className,
        className
      )}
    >
      <Icon 
        className={cn(
          'h-3 w-3',
          config.animate && 'animate-spin'
        )} 
      />
      {showLabel && (
        <span>{config.label}</span>
      )}
    </div>
  )
}

// Badge version for compact display
export function TranslationBadge({ status }: { status?: TranslationStatus }) {
  if (!status || status === 'completed') return null

  const badges = {
    pending: { text: 'T', title: 'Translation pending', className: 'bg-yellow-500' },
    processing: { text: '...', title: 'Translating', className: 'bg-blue-500 animate-pulse' },
    failed: { text: '!', title: 'Translation failed', className: 'bg-red-500' },
  }

  const badge = badges[status as keyof typeof badges]
  if (!badge) return null

  return (
    <span 
      className={cn(
        'inline-flex items-center justify-center h-5 w-5 rounded-full text-white text-[10px] font-bold',
        badge.className
      )}
      title={badge.title}
    >
      {badge.text}
    </span>
  )
}