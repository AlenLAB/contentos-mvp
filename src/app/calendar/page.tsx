'use client'

import { useEffect } from 'react'
import { usePostcardStore } from '@/store/postcards'
import { ContentCalendar } from '@/components/Calendar'
import { AppLayout } from '@/components/AppLayout'
import { toast } from 'sonner'

export default function CalendarPage() {
  const { 
    postcards, 
    isLoading, 
    error, 
    fetchPostcards, 
    updatePostcard,
    deletePostcard,
    clearError 
  } = usePostcardStore()

  useEffect(() => {
    fetchPostcards()
  }, [fetchPostcards])

  useEffect(() => {
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

  const handleUpdatePostcard = async (id: string, updates: any) => {
    try {
      await updatePostcard(id, updates)
      toast.success('Post updated successfully')
    } catch (error) {
      toast.error('Failed to update post')
    }
  }

  const handleDeletePostcard = async (id: string) => {
    try {
      await deletePostcard(id)
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  return (
    <AppLayout>
      <ContentCalendar 
        postcards={postcards}
        onUpdatePostcard={handleUpdatePostcard}
        onDeletePostcard={handleDeletePostcard}
      />
    </AppLayout>
  )
}