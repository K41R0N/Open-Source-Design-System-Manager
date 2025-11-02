'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSupabaseClient, isSupabaseConfigured } from './supabase-client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { ENV } from './constants'

// Define types for our auth context
type User = {
  id: string
  email?: string
  user_metadata?: {
    avatar_url?: string
    full_name?: string
    name?: string
    provider?: string
  }
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (provider: 'github' | 'google') => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

/**
 * Convert Supabase user to our User type
 */
function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    user_metadata: supabaseUser.user_metadata
  }
}

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const useSupabase = isSupabaseConfigured() && !ENV.USE_TEST_DATA
  const supabase = useSupabase ? getSupabaseClient() : null

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (useSupabase && supabase) {
          // Real Supabase authentication
          const { data: { session } } = await supabase.auth.getSession()

          if (session?.user) {
            setUser(mapSupabaseUser(session.user))
          }

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser(mapSupabaseUser(session.user))
            } else {
              setUser(null)
            }
          })

          return () => {
            subscription.unsubscribe()
          }
        } else {
          // Mock authentication (localStorage)
          const storedUser = localStorage.getItem('sb-user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [useSupabase, supabase])

  // Sign in with a provider
  const signIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true)

      if (useSupabase && supabase) {
        // Real Supabase OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: `${window.location.origin}/dashboard`
          }
        })

        if (error) {
          console.error('Supabase sign in error:', error)
          throw error
        }
        // Note: Supabase will redirect, so loading state stays true
      } else {
        // Mock authentication
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Create mock user based on provider
        // Use consistent user-1 ID to match test data
        const mockUser: User = {
          id: 'user-1',
          email: `user@example.com`,
          user_metadata: {
            avatar_url: `https://ui-avatars.com/api/?name=Test+User&background=random`,
            full_name: 'Test User',
            name: 'Test User',
            provider
          }
        }

        // Store user in localStorage for persistence
        localStorage.setItem('sb-user', JSON.stringify(mockUser))
        setUser(mockUser)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error signing in:', error)
      setLoading(false)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)

      if (useSupabase && supabase) {
        // Real Supabase sign out
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Supabase sign out error:', error)
          throw error
        }
        setUser(null)
      } else {
        // Mock authentication
        localStorage.removeItem('sb-user')
        setUser(null)
      }

      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
