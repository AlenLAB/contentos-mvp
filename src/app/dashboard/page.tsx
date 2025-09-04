'use client'

import { useEffect } from 'react'
import { usePostcardStore } from '@/store/postcards'
import { ContentOSDashboard } from '@/components/Dashboard'
import { AppLayout } from '@/components/AppLayout'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { 
    postcards, 
    isLoading, 
    error, 
    fetchPostcards, 
    clearError,
    getPostcardsByState 
  } = usePostcardStore()

  useEffect(() => {
    // Fetch postcards on mount
    fetchPostcards().catch((err) => {
      toast.error('Failed to load postcards', {
        description: 'Please refresh the page to try again'
      })
    })
  }, [fetchPostcards])

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      toast.error('Error loading data', {
        description: error,
        action: {
          label: 'Retry',
          onClick: () => {
            clearError()
            fetchPostcards()
          }
        }
      })
    }
  }, [error, clearError, fetchPostcards])

  // Calculate stats
  const stats = {
    total: postcards.length,
    scheduled: getPostcardsByState('scheduled').length,
    published: getPostcardsByState('published').length,
    drafts: getPostcardsByState('draft').length
  }

  // Sort postcards by creation date for recent activity
  const recentPostcards = [...postcards]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <AppLayout>
      <ContentOSDashboard 
        stats={stats}
        postcards={recentPostcards}
      />
    </AppLayout>
  )
}