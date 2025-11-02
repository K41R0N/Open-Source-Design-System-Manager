'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // In a real implementation, this would check the session from Supabase
        // For now, we'll check localStorage for demo purposes
        const storedUser = localStorage.getItem('sb-user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Sign in with a provider
  const signIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true)
      
      // In a real implementation, this would redirect to Supabase auth
      // For now, we'll simulate a successful login for demo purposes
      
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
      
      // Don't redirect, just stay on the current page
      // The app will handle showing the correct content based on auth state
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      
      // In a real implementation, this would call Supabase signOut
      // For now, we'll just clear localStorage
      localStorage.removeItem('sb-user')
      setUser(null)
      
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
