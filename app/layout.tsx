import React from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { DatabaseProvider } from '@/lib/database-context'
import { ToastProvider } from '@/lib/toast-context'
import './globals.css'

export const metadata = {
  title: 'Component Sandbox',
  description: 'A playground for UI components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <AuthProvider>
            <DatabaseProvider>
              {children}
            </DatabaseProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
