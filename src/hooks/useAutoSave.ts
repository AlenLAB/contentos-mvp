import { useEffect, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UseAutoSaveProps {
  data: any
  onSave: (data: any) => Promise<void>
  delay?: number // default 2000ms
  enabled?: boolean // to enable/disable auto-save
  localStorageKey?: string // key for localStorage backup
}

interface UseAutoSaveReturn {
  isSaving: boolean
  lastSaved: Date | null
  error: string | null
  saveNow: () => Promise<void> // manual save trigger
  clearError: () => void
}

export function useAutoSave({
  data,
  onSave,
  delay = 2000,
  enabled = true,
  localStorageKey
}: UseAutoSaveProps): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dataRef = useRef(data)
  const isMountedRef = useRef(true)
  const hasUnsavedChangesRef = useRef(false)
  const router = useRouter()

  // Update the data ref whenever data changes
  useEffect(() => {
    dataRef.current = data
  }, [data])

  // Save to localStorage for backup
  const saveToLocalStorage = useCallback((dataToSave: any) => {
    if (!localStorageKey) return
    
    try {
      const backupData = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
      localStorage.setItem(localStorageKey, JSON.stringify(backupData))
    } catch (err) {
      console.warn('Failed to save backup to localStorage:', err)
    }
  }, [localStorageKey])

  // Clear localStorage backup after successful save
  const clearLocalStorageBackup = useCallback(() => {
    if (!localStorageKey) return
    
    try {
      localStorage.removeItem(localStorageKey)
    } catch (err) {
      console.warn('Failed to clear localStorage backup:', err)
    }
  }, [localStorageKey])

  // Restore from localStorage if available
  const restoreFromLocalStorage = useCallback((): any | null => {
    if (!localStorageKey) return null
    
    try {
      const stored = localStorage.getItem(localStorageKey)
      if (!stored) return null
      
      const backup = JSON.parse(stored)
      const backupDate = new Date(backup.timestamp)
      const hoursSinceBackup = (Date.now() - backupDate.getTime()) / (1000 * 60 * 60)
      
      // Only restore if backup is less than 24 hours old
      if (hoursSinceBackup < 24) {
        return backup.data
      } else {
        // Clear old backup
        clearLocalStorageBackup()
        return null
      }
    } catch (err) {
      console.warn('Failed to restore from localStorage:', err)
      return null
    }
  }, [localStorageKey, clearLocalStorageBackup])

  // Main save function
  const performSave = useCallback(async (dataToSave?: any) => {
    if (!isMountedRef.current) return
    
    const saveData = dataToSave || dataRef.current
    
    setIsSaving(true)
    setError(null)
    hasUnsavedChangesRef.current = false
    
    try {
      await onSave(saveData)
      
      if (!isMountedRef.current) return
      
      setLastSaved(new Date())
      clearLocalStorageBackup()
      
      // Show success feedback
      toast.success('Changes saved', {
        duration: 1500,
        position: 'bottom-right'
      })
    } catch (err) {
      if (!isMountedRef.current) return
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes'
      setError(errorMessage)
      
      // Keep the backup in localStorage on error
      saveToLocalStorage(saveData)
      
      // Show error feedback
      toast.error(errorMessage, {
        duration: 4000,
        position: 'bottom-right',
        action: {
          label: 'Retry',
          onClick: () => performSave(saveData)
        }
      })
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false)
      }
    }
  }, [onSave, saveToLocalStorage, clearLocalStorageBackup])

  // Manual save trigger
  const saveNow = useCallback(async () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    await performSave()
  }, [performSave])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Auto-save effect with debouncing
  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Mark that we have unsaved changes
    hasUnsavedChangesRef.current = true
    
    // Save to localStorage immediately as backup
    saveToLocalStorage(data)

    // Set up new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      performSave(data)
    }, delay)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, enabled, performSave, saveToLocalStorage])

  // Handle beforeunload event to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current || isSaving) {
        const message = 'You have unsaved changes. Are you sure you want to leave?'
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isSaving])

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      
      // If there are unsaved changes and we're unmounting, save to localStorage
      if (hasUnsavedChangesRef.current && localStorageKey) {
        saveToLocalStorage(dataRef.current)
      }
      
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [localStorageKey, saveToLocalStorage])

  // Check for and restore from localStorage on mount
  useEffect(() => {
    const restored = restoreFromLocalStorage()
    if (restored) {
      toast.info('Restored unsaved changes from backup', {
        duration: 4000,
        position: 'bottom-right',
        action: {
          label: 'Discard',
          onClick: () => {
            clearLocalStorageBackup()
            toast.success('Backup discarded')
          }
        }
      })
    }
  }, [restoreFromLocalStorage, clearLocalStorageBackup])

  // Keyboard shortcut for manual save (Ctrl/Cmd + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveNow()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [saveNow])

  return {
    isSaving,
    lastSaved,
    error,
    saveNow,
    clearError
  }
}

// Additional hook for displaying save status
export function useAutoSaveStatus(lastSaved: Date | null, isSaving: boolean) {
  const [statusText, setStatusText] = useState<string>('All changes saved')
  
  useEffect(() => {
    if (isSaving) {
      setStatusText('Saving...')
      return
    }
    
    if (!lastSaved) {
      setStatusText('Not saved')
      return
    }
    
    const updateStatus = () => {
      const now = new Date()
      const diff = now.getTime() - lastSaved.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      
      if (seconds < 5) {
        setStatusText('All changes saved')
      } else if (seconds < 60) {
        setStatusText(`Saved ${seconds} seconds ago`)
      } else if (minutes < 60) {
        setStatusText(`Saved ${minutes} minute${minutes === 1 ? '' : 's'} ago`)
      } else {
        setStatusText(`Saved ${hours} hour${hours === 1 ? '' : 's'} ago`)
      }
    }
    
    updateStatus()
    const interval = setInterval(updateStatus, 10000) // Update every 10 seconds
    
    return () => clearInterval(interval)
  }, [lastSaved, isSaving])
  
  return statusText
}

// Helper hook to check for unsaved changes before navigation
export function useUnsavedChangesWarning(
  hasUnsavedChanges: boolean,
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
) {
  const router = useRouter()
  
  useEffect(() => {
    if (!hasUnsavedChanges) return
    
    const handleRouteChange = (url: string) => {
      if (!window.confirm(message)) {
        router.push(url)
        throw 'Route change aborted by user'
      }
    }
    
    // Note: Next.js 13+ with app router doesn't have router events
    // You might need to implement a custom solution or use a different approach
    // This is a placeholder for the concept
    
    return () => {
      // Cleanup
    }
  }, [hasUnsavedChanges, message, router])
}

// Export a simplified version for basic use cases
export function useSimpleAutoSave(
  data: any,
  onSave: (data: any) => Promise<void>
): UseAutoSaveReturn {
  return useAutoSave({
    data,
    onSave,
    delay: 2000,
    enabled: true
  })
}