import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'
import type { Postcard, PostState } from '@/types/database'

// Types
interface PhaseData {
  phaseTitle: string
  phaseDescription: string
  postsPerDay?: number
  duration?: number
  template?: 'story' | 'tool' | 'mixed'
}

interface PostcardStore {
  // State
  postcards: Postcard[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchPostcards: () => Promise<void>
  createPostcard: (postcard: Partial<Postcard>) => Promise<void>
  updatePostcard: (id: string, updates: Partial<Postcard>) => Promise<void>
  deletePostcard: (id: string) => Promise<void>
  changeState: (id: string, newState: PostState) => Promise<void>
  generatePhaseContent: (phaseData: PhaseData) => Promise<void>
  clearError: () => void

  // Selectors
  getPostcardById: (id: string) => Postcard | undefined
  getPostcardsByState: (state: PostState) => Postcard[]
  getScheduledPostcards: () => Postcard[]
}

// Helper function to convert database records to Postcard type
function convertDbRecordToPostcard(record: any): Postcard {
  return {
    id: record.id,
    english_content: record.english_content,
    swedish_content: record.swedish_content,
    state: record.state,
    template: record.template,
    scheduled_date: record.scheduled_date,
    published_date: record.published_date,
    translation_status: record.translation_status,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }
}

export const usePostcardStore = create<PostcardStore>()(
  immer((set, get) => ({
    // Initial state
    postcards: [],
    isLoading: false,
    error: null,

    // Actions
    fetchPostcards: async () => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const { data, error } = await supabase
          .from('postcards')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        set((state) => {
          state.postcards = data ? data.map(convertDbRecordToPostcard) : []
          state.isLoading = false
        })
      } catch (error) {
        console.error('Error fetching postcards:', error)
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to fetch postcards'
          state.isLoading = false
        })
      }
    },

    createPostcard: async (postcard) => {
      try {
        const { data, error } = await supabase
          .from('postcards')
          .insert([{
            english_content: postcard.english_content || '',
            swedish_content: postcard.swedish_content || '',
            state: postcard.state || 'draft',
            template: postcard.template || null,
            scheduled_date: postcard.scheduled_date || null,
            published_date: postcard.published_date || null,
          }])
          .select()
          .single()

        if (error) throw error

        if (data) {
          const newPostcard = convertDbRecordToPostcard(data)
          set((state) => {
            state.postcards.unshift(newPostcard)
          })
        }
      } catch (error) {
        console.error('Error creating postcard:', error)
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to create postcard'
        })
        throw error
      }
    },

    updatePostcard: async (id, updates) => {
      // Optimistic update
      set((state) => {
        const index = state.postcards.findIndex(p => p.id === id)
        if (index !== -1) {
          Object.assign(state.postcards[index], updates)
        }
      })

      try {
        const { error } = await supabase
          .from('postcards')
          .update(updates)
          .eq('id', id)

        if (error) throw error
      } catch (error) {
        console.error('Error updating postcard:', error)
        // Revert optimistic update
        await get().fetchPostcards()
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to update postcard'
        })
        throw error
      }
    },

    deletePostcard: async (id) => {
      // Optimistic update
      const originalPostcards = get().postcards
      set((state) => {
        state.postcards = state.postcards.filter(p => p.id !== id)
      })

      try {
        const { error } = await supabase
          .from('postcards')
          .delete()
          .eq('id', id)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting postcard:', error)
        // Revert optimistic update
        set((state) => {
          state.postcards = originalPostcards
          state.error = error instanceof Error ? error.message : 'Failed to delete postcard'
        })
        throw error
      }
    },

    changeState: async (id, newState) => {
      await get().updatePostcard(id, { state: newState })
    },

    generatePhaseContent: async (phaseData) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const reqId = `cli_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-request-id': reqId,
          },
          body: JSON.stringify(phaseData),
        })

        if (!response.ok) {
          // Try to get detailed error from response
          let errorDetails = 'Failed to generate content'
          try {
            const errorData = await response.json()
            errorDetails = errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`
          } catch {
            errorDetails = `HTTP ${response.status}: ${response.statusText}`
          }
          console.error('[store][generatePhaseContent] API error:', {
            requestId: reqId,
            status: response.status,
            statusText: response.statusText,
            error: errorDetails
          })
          throw new Error(errorDetails)
        }

        const result = await response.json()
        console.log('[store][generatePhaseContent] API success:', {
          requestId: reqId,
          status: response.status,
          inserted: result?.metadata?.insertedCount,
          generated: result?.metadata?.generatedCount,
          failures: result?.metadata?.failureCount,
        })
        
        if (result.success && result.postcards) {
          // Add generated postcards to the store
          set((state) => {
            state.postcards = [...result.postcards, ...state.postcards]
            state.isLoading = false
          })
        }
      } catch (error) {
        console.error('[store][generatePhaseContent] Generation failed:', {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          requestId: reqId,
          phaseData: {
            title: phaseData.phaseTitle,
            descriptionLength: phaseData.phaseDescription?.length || 0,
            postsPerDay: phaseData.postsPerDay,
            duration: phaseData.duration,
            template: phaseData.template
          }
        })
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to generate content'
          state.isLoading = false
        })
        throw error
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null
      })
    },

    // Selectors
    getPostcardById: (id) => {
      return get().postcards.find(p => p.id === id)
    },

    getPostcardsByState: (state) => {
      return get().postcards.filter(p => p.state === state)
    },

    getScheduledPostcards: () => {
      return get().postcards.filter(p => 
        p.state === 'scheduled' && 
        p.scheduled_date &&
        new Date(p.scheduled_date) > new Date()
      )
    },
  }))
)

// Helper function to initialize real-time subscriptions
export function subscribeToPostcardUpdates() {
  const channel = supabase
    .channel('postcard_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'postcards',
      },
      (payload) => {
        const store = usePostcardStore.getState()
        
        switch (payload.eventType) {
          case 'INSERT':
            if (payload.new) {
              const newPostcard = convertDbRecordToPostcard(payload.new)
              usePostcardStore.setState((state) => ({
                postcards: [newPostcard, ...state.postcards]
              }))
            }
            break
            
          case 'UPDATE':
            if (payload.new) {
              const updatedPostcard = convertDbRecordToPostcard(payload.new)
              usePostcardStore.setState((state) => ({
                postcards: state.postcards.map(p => 
                  p.id === updatedPostcard.id ? updatedPostcard : p
                )
              }))
            }
            break
            
          case 'DELETE':
            if (payload.old) {
              usePostcardStore.setState((state) => ({
                postcards: state.postcards.filter(p => p.id !== payload.old.id)
              }))
            }
            break
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Helper function for handling Supabase errors
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}
