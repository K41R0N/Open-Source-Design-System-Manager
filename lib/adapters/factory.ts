/**
 * Database Adapter Factory
 *
 * Creates the appropriate database adapter based on environment configuration.
 * This allows seamless switching between localStorage (development) and Supabase (production).
 */

import { IDatabaseAdapter } from './interface'
import { LocalStorageAdapter } from './localStorage'
import { SupabaseAdapter } from './supabase'
import { ENV } from '../constants'

/**
 * Adapter type configuration
 */
export type AdapterType = 'localStorage' | 'supabase'

/**
 * Get the adapter type from environment
 * Automatically chooses between localStorage and Supabase based on configuration
 */
function getAdapterType(): AdapterType {
  // If explicitly using test data, always use localStorage
  if (ENV.USE_TEST_DATA) {
    console.log('[Adapter Factory] Using localStorage adapter (test data mode)')
    return 'localStorage'
  }

  // If Supabase is configured, use it
  if (ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY) {
    console.log('[Adapter Factory] Using Supabase adapter')
    return 'supabase'
  }

  // Fallback to localStorage
  console.log('[Adapter Factory] Using localStorage adapter (fallback - Supabase not configured)')
  return 'localStorage'
}

/**
 * Create a database adapter instance
 *
 * @param type Optional adapter type to use (defaults to environment-based selection)
 * @returns Database adapter instance
 */
export function createAdapter(type?: AdapterType): IDatabaseAdapter {
  const adapterType = type || getAdapterType()

  switch (adapterType) {
    case 'localStorage':
      return new LocalStorageAdapter()

    case 'supabase':
      return new SupabaseAdapter()

    default:
      console.warn(`Unknown adapter type: ${adapterType}, falling back to localStorage`)
      return new LocalStorageAdapter()
  }
}

/**
 * Singleton adapter instance
 * Created once and reused throughout the application
 */
let adapterInstance: IDatabaseAdapter | null = null

/**
 * Get the singleton adapter instance
 * Creates it on first call, then returns the same instance
 */
export function getAdapter(): IDatabaseAdapter {
  if (!adapterInstance) {
    adapterInstance = createAdapter()
  }
  return adapterInstance
}

/**
 * Reset the adapter instance (useful for testing or switching adapters)
 */
export function resetAdapter(): void {
  if (adapterInstance && adapterInstance.cleanup) {
    adapterInstance.cleanup()
  }
  adapterInstance = null
}

/**
 * Initialize the adapter
 * Call this once when the app starts
 */
export async function initializeAdapter(): Promise<void> {
  const adapter = getAdapter()
  if (adapter.initialize) {
    await adapter.initialize()
  }
}
