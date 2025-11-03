'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase-client'
import { ENV } from '@/lib/constants'

export default function DebugPage() {
  const [checks, setChecks] = useState({
    useTestData: ENV.USE_TEST_DATA,
    supabaseUrl: ENV.SUPABASE_URL,
    supabaseKeyExists: !!ENV.SUPABASE_ANON_KEY,
    supabaseKeyLength: ENV.SUPABASE_ANON_KEY?.length || 0,
    isConfigured: isSupabaseConfigured(),
    clientExists: false,
    authAvailable: false
  })

  useEffect(() => {
    const client = getSupabaseClient()
    setChecks(prev => ({
      ...prev,
      clientExists: !!client,
      authAvailable: !!client?.auth
    }))
  }, [])

  return (
    <div className="min-h-screen bg-sage p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Figaro Debug Panel</h1>

        <Card className="p-6 mb-6 bg-white">
          <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>NEXT_PUBLIC_USE_TEST_DATA:</span>
              <span className={checks.useTestData ? 'text-orange-600 font-bold' : 'text-green-600 font-bold'}>
                {String(checks.useTestData)}
                {checks.useTestData && ' ⚠️ PROBLEM: Should be false for production!'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className={checks.supabaseUrl ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {checks.supabaseUrl ? `${checks.supabaseUrl.substring(0, 30)}...` : '❌ NOT SET'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className={checks.supabaseKeyExists ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {checks.supabaseKeyExists ? `✅ Set (${checks.supabaseKeyLength} characters)` : '❌ NOT SET'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 bg-white">
          <h2 className="text-2xl font-bold mb-4">Configuration Status</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Supabase Configured:</span>
              <span className={checks.isConfigured ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {checks.isConfigured ? '✅ YES' : '❌ NO'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Supabase Client Created:</span>
              <span className={checks.clientExists ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {checks.clientExists ? '✅ YES' : '❌ NO'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Auth Available:</span>
              <span className={checks.authAvailable ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {checks.authAvailable ? '✅ YES' : '❌ NO'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-400">
          <h2 className="text-2xl font-bold mb-4">🎯 Expected Configuration for Production</h2>
          <div className="space-y-2 text-sm">
            <p>✅ NEXT_PUBLIC_USE_TEST_DATA = <code className="bg-yellow-100 px-2 py-1 rounded">false</code></p>
            <p>✅ NEXT_PUBLIC_SUPABASE_URL = <code className="bg-yellow-100 px-2 py-1 rounded">https://xxxxx.supabase.co</code></p>
            <p>✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = <code className="bg-yellow-100 px-2 py-1 rounded">eyJhbGc...</code></p>
          </div>
        </Card>

        <Card className="p-6 mt-6 bg-blue-50 border-blue-400">
          <h2 className="text-xl font-bold mb-3">📋 Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to Netlify Dashboard → Site Settings → Environment Variables</li>
            <li>Verify all three variables are set correctly (no typos!)</li>
            <li>Make sure variables start with NEXT_PUBLIC_ (required for client-side access)</li>
            <li>After updating variables, trigger a new deploy</li>
            <li>Clear your browser cache and refresh this page</li>
          </ol>
        </Card>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-terracotta text-black border border-black font-bold"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sage-light text-black border border-black font-bold"
          >
            🔄 Refresh Debug
          </button>
        </div>
      </div>
    </div>
  )
}
