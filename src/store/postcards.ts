import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'

// Types
export interface Postcard {
  id: string
  english_content: string
  swedish_content: string
  state: 'draft' | 'approved' | 'scheduled' | 'published'
  template: 'story' | 'tool'
  scheduled_date: Date | null
  published_date: Date | null
  translation_status?: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: Date
  updated_at: Date
}

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
  changeState: (id: string, newState: Postcard['state']) => Promise<void>
  generatePhaseContent: (phaseData: PhaseData) => Promise<void>
  clearError: () => void

  // Selectors
  getPostcardById: (id: string) => Postcard | undefined
  getPostcardsByState: (state: Postcard['state']) => Postcard[]
  getScheduledPostcards: () => Postcard[]
}

// Helper function to convert database records to Postcard type
function dbToPostcard(record: any): Postcard {
  return {
    id: record.id,
    english_content: record.english_content,
    swedish_content: record.swedish_content || '',
    state: record.state,
    template: record.template,
    scheduled_date: record.scheduled_date ? new Date(record.scheduled_date) : null,
    published_date: record.published_date ? new Date(record.published_date) : null,
    translation_status: record.translation_status,
    created_at: new Date(record.created_at),
    updated_at: new Date(record.updated_at),
  }
}

// Helper function to convert Postcard to database format
function postcardToDb(postcard: Partial<Postcard>): any {
  const dbRecord: any = {}
  
  if (postcard.english_content !== undefined) dbRecord.english_content = postcard.english_content
  if (postcard.swedish_content !== undefined) dbRecord.swedish_content = postcard.swedish_content
  if (postcard.state !== undefined) dbRecord.state = postcard.state
  if (postcard.template !== undefined) dbRecord.template = postcard.template
  if (postcard.translation_status !== undefined) dbRecord.translation_status = postcard.translation_status
  if (postcard.scheduled_date !== undefined) {
    dbRecord.scheduled_date = postcard.scheduled_date ? postcard.scheduled_date.toISOString() : null
  }
  if (postcard.published_date !== undefined) {
    dbRecord.published_date = postcard.published_date ? postcard.published_date.toISOString() : null
  }
  
  return dbRecord
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
          state.postcards = data ? data.map(dbToPostcard) : []
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
      // Generate temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`
      const now = new Date()
      
      const newPostcard: Postcard = {
        id: tempId,
        english_content: postcard.english_content || '',
        swedish_content: postcard.swedish_content || '',
        state: postcard.state || 'draft',
        template: postcard.template || 'story',
        scheduled_date: postcard.scheduled_date || null,
        published_date: postcard.published_date || null,
        created_at: now,
        updated_at: now,
      }

      // Optimistic update
      set((state) => {
        state.postcards.unshift(newPostcard)
        state.error = null
      })

      try {
        const dbData = postcardToDb(postcard)
        const { data, error } = await supabase
          .from('postcards')
          .insert([dbData])
          .select()
          .single()

        if (error) throw error

        // Replace temporary postcard with real one
        set((state) => {
          const index = state.postcards.findIndex(p => p.id === tempId)
          if (index !== -1) {
            state.postcards[index] = dbToPostcard(data)
          }
        })
      } catch (error) {
        console.error('Error creating postcard:', error)
        
        // Rollback optimistic update
        set((state) => {
          state.postcards = state.postcards.filter(p => p.id !== tempId)
          state.error = error instanceof Error ? error.message : 'Failed to create postcard'
        })
        
        throw error
      }
    },

    updatePostcard: async (id, updates) => {
      // Store original for rollback
      const original = get().postcards.find(p => p.id === id)
      if (!original) {
        set((state) => {
          state.error = 'Postcard not found'
        })
        return
      }

      // Optimistic update
      set((state) => {
        const index = state.postcards.findIndex(p => p.id === id)
        if (index !== -1) {
          state.postcards[index] = {
            ...state.postcards[index],
            ...updates,
            updated_at: new Date()
          }
        }
        state.error = null
      })

      try {
        const dbData = postcardToDb(updates)
        const { data, error } = await supabase
          .from('postcards')
          .update(dbData)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        // Update with server response
        set((state) => {
          const index = state.postcards.findIndex(p => p.id === id)
          if (index !== -1) {
            state.postcards[index] = dbToPostcard(data)
          }
        })
      } catch (error) {
        console.error('Error updating postcard:', error)
        
        // Rollback optimistic update
        set((state) => {
          const index = state.postcards.findIndex(p => p.id === id)
          if (index !== -1) {
            state.postcards[index] = original
          }
          state.error = error instanceof Error ? error.message : 'Failed to update postcard'
        })
        
        throw error
      }
    },

    deletePostcard: async (id) => {
      // Store original for rollback
      const original = get().postcards.find(p => p.id === id)
      if (!original) {
        set((state) => {
          state.error = 'Postcard not found'
        })
        return
      }

      // Optimistic update
      set((state) => {
        state.postcards = state.postcards.filter(p => p.id !== id)
        state.error = null
      })

      try {
        const { error } = await supabase
          .from('postcards')
          .delete()
          .eq('id', id)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting postcard:', error)
        
        // Rollback optimistic update
        set((state) => {
          const index = state.postcards.findIndex(p => p.id === original.id)
          if (index === -1) {
            state.postcards.push(original)
            // Re-sort by created_at
            state.postcards.sort((a, b) => 
              b.created_at.getTime() - a.created_at.getTime()
            )
          }
          state.error = error instanceof Error ? error.message : 'Failed to delete postcard'
        })
        
        throw error
      }
    },

    changeState: async (id, newState) => {
      // Store original for rollback
      const original = get().postcards.find(p => p.id === id)
      if (!original) {
        set((state) => {
          state.error = 'Postcard not found'
        })
        return
      }

      // Determine if we need to update published_date
      const updates: Partial<Postcard> = { state: newState }
      if (newState === 'published' && !original.published_date) {
        updates.published_date = new Date()
      }

      // Optimistic update
      set((state) => {
        const index = state.postcards.findIndex(p => p.id === id)
        if (index !== -1) {
          state.postcards[index] = {
            ...state.postcards[index],
            ...updates,
            updated_at: new Date()
          }
        }
        state.error = null
      })

      try {
        const dbData = postcardToDb(updates)
        const { data, error } = await supabase
          .from('postcards')
          .update(dbData)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        // Update with server response
        set((state) => {
          const index = state.postcards.findIndex(p => p.id === id)
          if (index !== -1) {
            state.postcards[index] = dbToPostcard(data)
          }
        })
      } catch (error) {
        console.error('Error changing postcard state:', error)
        
        // Rollback optimistic update
        set((state) => {
          const index = state.postcards.findIndex(p => p.id === id)
          if (index !== -1) {
            state.postcards[index] = original
          }
          state.error = error instanceof Error ? error.message : 'Failed to change postcard state'
        })
        
        throw error
      }
    },

    generatePhaseContent: async (phaseData) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        // Call the generate API endpoint
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(phaseData)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to generate content')
        }

        const result = await response.json()
        
        if (!result.postcards || !Array.isArray(result.postcards)) {
          throw new Error('Invalid response from generation API')
        }

        // Create postcards from generated content - save immediately without translation
        const now = new Date()
        const newPostcards: Partial<Postcard>[] = result.postcards.map((generated: any) => ({
          english_content: generated.english_content,
          swedish_content: '', // Empty initially
          template: generated.template,
          state: 'draft',
          translation_status: 'pending', // Mark as needing translation
          scheduled_date: null,
          published_date: null
        }))

        // Save all postcards to database immediately
        const { data, error } = await supabase
          .from('postcards')
          .insert(newPostcards.map(postcardToDb))
          .select()

        if (error) throw error

        // Add to store
        set((state) => {
          const postcards = data ? data.map(dbToPostcard) : []
          state.postcards = [...postcards, ...state.postcards]
          state.isLoading = false
        })

        // Trigger batch translation in the background
        if (data && data.length > 0) {
          const postIds = data.map(p => p.id)
          // Fire and forget - don't await
          fetch('/api/translate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postIds })
          }).catch(err => {
            console.error('Background translation failed:', err)
          })
        }

        return data ? data.length : 0
      } catch (error) {
        console.error('Error generating phase content:', error)
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to generate phase content'
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
      return get().postcards
        .filter(p => p.state === 'scheduled' && p.scheduled_date !== null)
        .sort((a, b) => {
          if (!a.scheduled_date || !b.scheduled_date) return 0
          return a.scheduled_date.getTime() - b.scheduled_date.getTime()
        })
    },
  }))
)

// Subscribe to real-time updates from Supabase
export function subscribeToPostcardUpdates() {
  const channel = supabase
    .channel('postcards-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'postcards'
      },
      (payload) => {
        const store = usePostcardStore.getState()
        
        switch (payload.eventType) {
          case 'INSERT':
            // Add new postcard if it doesn't exist locally
            if (!store.postcards.find(p => p.id === payload.new.id)) {
              store.fetchPostcards() // Refetch to ensure consistency
            }
            break
            
          case 'UPDATE':
            // Update existing postcard
            const index = store.postcards.findIndex(p => p.id === payload.new.id)
            if (index !== -1) {
              usePostcardStore.setState((state) => {
                state.postcards[index] = dbToPostcard(payload.new)
              })
            }
            break
            
          case 'DELETE':
            // Remove deleted postcard
            usePostcardStore.setState((state) => {
              state.postcards = state.postcards.filter(p => p.id !== payload.old.id)
            })
            break
        }
      }
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}