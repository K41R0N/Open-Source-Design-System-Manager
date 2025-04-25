'use client'

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ClientOnly({ 
  children,
  fallback = <div className="min-h-screen flex items-center justify-center">Loading...</div>
}: { 
  children: React.ReactNode,
  fallback?: React.ReactNode
}) {
  const [hasMounted, setHasMounted] = React.useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Reset mounted state when route changes
  useEffect(() => {
    setHasMounted(false)
    const timeout = setTimeout(() => setHasMounted(true), 10)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  if (!hasMounted) {
    return fallback
  }

  return <>{children}</>
}
