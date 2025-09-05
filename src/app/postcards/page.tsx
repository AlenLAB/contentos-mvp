'use client'

import { useEffect } from 'react'
import { usePostcardStore } from '@/store/postcards'
import { PostcardListSimple } from '@/components/PostcardListSimple'
import { AppLayout } from '@/components/AppLayout'
import { toast } from 'sonner'

export default function PostcardsPage() {
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

  return (
    <AppLayout>
      <PostcardListSimple />
    </AppLayout>
  )
}