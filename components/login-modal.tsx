'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Github, Mail } from 'lucide-react'

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { signIn, loading } = useAuth()
  
  const handleGithubLogin = async () => {
    try {
      await signIn('github')
      onClose()
    } catch (error) {
      console.error('GitHub login error:', error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn('google')
      onClose()
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-sage-light border border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] p-0 max-w-md">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-2xl font-bold uppercase tracking-wider text-center">Sign In</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <p className="mb-8 text-center">
            Sign in to save and manage your component library
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-6 h-auto flex items-center justify-center gap-2"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>
            
            <Button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black border border-gray-300 py-6 h-auto flex items-center justify-center gap-2"
            >
              <Mail className="h-5 w-5" />
              Continue with Google
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
