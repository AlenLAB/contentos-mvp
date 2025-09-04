export type PostState = 'draft' | 'approved' | 'scheduled' | 'published'
export type PostTemplate = 'story' | 'tool' | null
export type TranslationStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Postcard {
  id: string
  english_content: string
  swedish_content: string
  state: PostState
  template: PostTemplate
  scheduled_date: string | null
  published_date: string | null
  translation_status?: TranslationStatus
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      postcards: {
        Row: Postcard
        Insert: Omit<Postcard, 'id' | 'created_at' | 'updated_at' | 'translation_status'> & {
          id?: string
          created_at?: string
          updated_at?: string
          // translation_status?: TranslationStatus // Uncomment after migration
        }
        Update: Partial<Omit<Postcard, 'id' | 'created_at'>> & {
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      post_state: PostState
      post_template: PostTemplate
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type PostcardRow = Database['public']['Tables']['postcards']['Row']
export type PostcardInsert = Database['public']['Tables']['postcards']['Insert']
export type PostcardUpdate = Database['public']['Tables']['postcards']['Update']

// Validation helpers
export const POST_STATES: PostState[] = ['draft', 'approved', 'scheduled', 'published']
export const POST_TEMPLATES: (PostTemplate | null)[] = ['story', 'tool', null]

export const CONTENT_LIMITS = {
  twitter: {
    maxLength: 280,
    platform: 'Twitter/X',
    language: 'English',
  },
  linkedin: {
    maxLength: 3000,
    platform: 'LinkedIn',
    language: 'Swedish',
  },
} as const

// Type guard functions
export function isValidPostState(state: string): state is PostState {
  return POST_STATES.includes(state as PostState)
}

export function isValidPostTemplate(template: string | null): template is PostTemplate {
  return POST_TEMPLATES.includes(template as PostTemplate)
}

// Content validation functions
export function validateTwitterContent(content: string): {
  isValid: boolean
  length: number
  remaining: number
} {
  const length = content.length
  return {
    isValid: length <= CONTENT_LIMITS.twitter.maxLength,
    length,
    remaining: CONTENT_LIMITS.twitter.maxLength - length,
  }
}

export function validateLinkedInContent(content: string): {
  isValid: boolean
  length: number
  remaining: number
} {
  const length = content.length
  return {
    isValid: length <= CONTENT_LIMITS.linkedin.maxLength,
    length,
    remaining: CONTENT_LIMITS.linkedin.maxLength - length,
  }
}