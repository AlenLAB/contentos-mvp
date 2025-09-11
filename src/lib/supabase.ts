import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client with lazy initialization (similar to Claude pattern)
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in environment variables')
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Function to get Supabase client instance
export function getSupabaseClient() {
  return createSupabaseClient()
}

// Keep the old export for backward compatibility but create client lazily
export const supabase = (() => {
  try {
    return createSupabaseClient()
  } catch {
    // Return null during build/server initialization when env vars might not be available
    return null as any
  }
})()

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error)
  return {
    error: error?.message || 'An unexpected error occurred',
    details: error,
  }
}