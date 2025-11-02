/**
 * Supabase Client Configuration
 *
 * Creates and exports a configured Supabase client for use throughout the app.
 * The client is created as a singleton to ensure consistent state.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ENV } from './constants'

// Type for our database schema
export type Database = {
  public: {
    Tables: {
      components: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          name: string
          html: string
          css: string
          js: string
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          name: string
          html?: string
          css?: string
          js?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          name?: string
          html?: string
          css?: string
          js?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
    }
  }
}

let supabaseInstance: SupabaseClient<Database> | null = null

/**
 * Get or create the Supabase client
 * Returns null if Supabase is not configured (missing URL or key)
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Check if Supabase is configured
  const supabaseUrl = ENV.SUPABASE_URL
  const supabaseAnonKey = ENV.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Missing SUPABASE_URL or SUPABASE_ANON_KEY.')
    return null
  }

  // Create and cache the client
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY)
}
