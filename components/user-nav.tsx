'use client'

import React from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function UserNav() {
  const { user, signOut, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-sage-light animate-pulse"></div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline" className="border-border">
          Sign In
        </Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">
          {user?.user_metadata?.name || 'User'}
        </span>
        <span className="text-xs text-muted-foreground">
          {user?.email || ''}
        </span>
      </div>
      
      <div className="relative">
        {user?.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="User avatar" 
            className="h-8 w-8 rounded-none border border-border"
          />
        ) : (
          <div className="h-8 w-8 flex items-center justify-center bg-sage-light border border-border">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => signOut()}
        className="h-8 w-8"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
