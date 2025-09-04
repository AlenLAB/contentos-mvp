import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface UseCopyToClipboardReturn {
  copyToClipboard: (text: string, platform?: 'X' | 'LinkedIn') => Promise<void>
  isCopied: boolean
  error: string | null
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const copyToClipboard = useCallback(async (text: string, platform?: 'X' | 'LinkedIn'): Promise<void> => {
    // Reset previous state
    setError(null)
    setIsCopied(false)
    
    try {
      // Try using the modern Clipboard API first
      if (navigator?.clipboard?.writeText) {
        // Check permissions if available
        if (navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({
              name: 'clipboard-write' as PermissionName,
            })
            
            if (permission.state === 'denied') {
              throw new Error('Clipboard permission denied. Please enable clipboard access.')
            }
          } catch (permError) {
            // Some browsers don't support clipboard-write permission query
            // Continue anyway as the actual write might still work
            console.log('Permission query not supported, attempting copy anyway')
          }
        }

        // Copy text to clipboard
        await navigator.clipboard.writeText(text)
        
        // Success!
        setIsCopied(true)
        
        // Show success toast with platform info
        const platformName = platform || 'clipboard'
        toast.success(
          platform ? `Copied for ${platform}!` : 'Copied to clipboard!',
          {
            duration: 2000,
            position: 'bottom-right',
            description: platform === 'X' 
              ? 'Ready to paste on X (Twitter)' 
              : platform === 'LinkedIn'
              ? 'Ready to paste on LinkedIn'
              : undefined
          }
        )
        
        // Reset isCopied after 2 seconds
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
        
      } else {
        // Fallback for older browsers using execCommand
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        textArea.setAttribute('readonly', '') // Prevent keyboard from showing on mobile
        document.body.appendChild(textArea)
        
        // Select the text
        textArea.focus()
        textArea.select()
        
        // For iOS devices
        if (navigator.userAgent.match(/ipad|iphone/i)) {
          const range = document.createRange()
          range.selectNodeContents(textArea)
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            selection.addRange(range)
          }
          textArea.setSelectionRange(0, text.length)
        }
        
        // Execute copy command
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (!successful) {
          throw new Error('Failed to copy text using fallback method')
        }
        
        // Success with fallback!
        setIsCopied(true)
        
        // Show success toast
        toast.success(
          platform ? `Copied for ${platform}!` : 'Copied to clipboard!',
          {
            duration: 2000,
            position: 'bottom-right',
            description: platform === 'X' 
              ? 'Ready to paste on X (Twitter)' 
              : platform === 'LinkedIn'
              ? 'Ready to paste on LinkedIn'
              : undefined
          }
        )
        
        // Reset isCopied after 2 seconds
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      }
      
    } catch (err) {
      // Handle errors
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard'
      setError(errorMessage)
      
      // Show error toast
      toast.error('Failed to copy', {
        duration: 3000,
        position: 'bottom-right',
        description: errorMessage,
        action: {
          label: 'Try again',
          onClick: () => copyToClipboard(text, platform)
        }
      })
      
      // Log error for debugging
      console.error('Copy to clipboard failed:', err)
    }
  }, [])

  return {
    copyToClipboard,
    isCopied,
    error
  }
}

// Specialized hook for copying social media content with platform-specific formatting
export function usePlatformCopy() {
  const { copyToClipboard, isCopied, error } = useCopyToClipboard()

  const copyForX = useCallback(async (content: string): Promise<void> => {
    // Ensure content doesn't exceed X/Twitter's limit
    const trimmedContent = content.length > 280 
      ? content.slice(0, 277) + '...' 
      : content
    
    if (content.length > 280) {
      toast.warning('Content trimmed to 280 characters for X', {
        duration: 3000,
        position: 'bottom-right'
      })
    }
    
    await copyToClipboard(trimmedContent, 'X')
  }, [copyToClipboard])

  const copyForLinkedIn = useCallback(async (content: string): Promise<void> => {
    // Ensure content doesn't exceed LinkedIn's limit
    const trimmedContent = content.length > 3000 
      ? content.slice(0, 2997) + '...' 
      : content
    
    if (content.length > 3000) {
      toast.warning('Content trimmed to 3000 characters for LinkedIn', {
        duration: 3000,
        position: 'bottom-right'
      })
    }
    
    await copyToClipboard(trimmedContent, 'LinkedIn')
  }, [copyToClipboard])

  const copyWithHashtags = useCallback(async (
    content: string,
    hashtags: string[],
    platform?: 'X' | 'LinkedIn'
  ): Promise<void> => {
    const hashtagString = hashtags
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      .join(' ')
    
    const fullContent = hashtags.length > 0 
      ? `${content}\n\n${hashtagString}`
      : content
    
    if (platform === 'X') {
      await copyForX(fullContent)
    } else if (platform === 'LinkedIn') {
      await copyForLinkedIn(fullContent)
    } else {
      await copyToClipboard(fullContent)
    }
  }, [copyToClipboard, copyForX, copyForLinkedIn])

  return {
    copyForX,
    copyForLinkedIn,
    copyWithHashtags,
    copyToClipboard,
    isCopied,
    error
  }
}

// Simple one-line copy function for quick usage
export async function copyText(text: string, showToast: boolean = true): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    if (showToast) {
      toast.success('Copied!', { duration: 1500, position: 'bottom-right' })
    }
    return true
  } catch (err) {
    if (showToast) {
      toast.error('Failed to copy', { duration: 2000, position: 'bottom-right' })
    }
    return false
  }
}