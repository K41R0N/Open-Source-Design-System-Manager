/**
 * Application-wide constants
 * Centralizes magic strings and configuration values
 */

/**
 * localStorage keys for data persistence
 */
export const STORAGE_KEYS = {
  COMPONENTS: 'sb-components',
  PROJECTS: 'sb-projects',
  TAGS: 'sb-tags',
  USER: 'sb-user',
} as const

/**
 * Default entity IDs
 */
export const DEFAULT_IDS = {
  PROJECT: 'default-project',
  TAG_NAVIGATION: 'tag-navigation',
  TAG_HEADER: 'tag-header',
  TAG_HERO: 'tag-hero',
} as const

/**
 * Default entity names
 */
export const DEFAULT_NAMES = {
  PROJECT: 'Demo Project',
  TAG_NAVIGATION: 'navigation',
  TAG_HEADER: 'header',
  TAG_HERO: 'hero',
} as const

/**
 * Content size thresholds for soft warnings (no hard limits)
 * These are generous limits to warn users about potential performance impacts
 */
export const SIZE_THRESHOLDS = {
  HTML_WARNING: 500_000,   // 500KB - warn but don't block
  CSS_WARNING: 250_000,    // 250KB
  JS_WARNING: 250_000,     // 250KB
  TOTAL_WARNING: 1_000_000, // 1MB total component size
} as const

/**
 * Rate limiting configuration
 * Prevents abuse without limiting legitimate use
 */
export const RATE_LIMITS = {
  COMPONENT_CREATE: { max: 10, window: 60_000 },  // 10 creates per minute
  COMPONENT_UPDATE: { max: 30, window: 60_000 },  // 30 updates per minute
  COMPONENT_DELETE: { max: 20, window: 60_000 },  // 20 deletes per minute
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const

/**
 * Debounce delays (milliseconds)
 */
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  PREVIEW: 500,
  AUTO_SAVE: 1000,
} as const

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

/**
 * Mock authentication provider names
 */
export const AUTH_PROVIDERS = {
  GITHUB: 'github',
  GOOGLE: 'google',
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'User not authenticated',
  COMPONENT_NOT_FOUND: 'Component not found',
  PROJECT_NOT_FOUND: 'Project not found',
  TAG_NOT_FOUND: 'Tag not found',
  UNAUTHORIZED: 'Unauthorized',
  SAVE_FAILED: 'Failed to save changes',
  LOAD_FAILED: 'Failed to load data',
  INVALID_INPUT: 'Invalid input',
  SERIALIZATION_ERROR: 'Component contains data that cannot be saved',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  COMPONENT_CREATED: 'Component created successfully',
  COMPONENT_UPDATED: 'Component updated successfully',
  COMPONENT_DELETED: 'Component deleted successfully',
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_DELETED: 'Project deleted successfully',
  TAG_CREATED: 'Tag created successfully',
  TAG_DELETED: 'Tag deleted successfully',
} as const

/**
 * Validation rules
 */
export const VALIDATION = {
  COMPONENT_NAME_MIN_LENGTH: 1,
  COMPONENT_NAME_MAX_LENGTH: 100,
  PROJECT_NAME_MIN_LENGTH: 1,
  PROJECT_NAME_MAX_LENGTH: 100,
  PROJECT_DESCRIPTION_MAX_LENGTH: 500,
  TAG_NAME_MIN_LENGTH: 1,
  TAG_NAME_MAX_LENGTH: 50,
} as const

/**
 * Environment variables
 */
export const ENV = {
  USE_TEST_DATA: process.env.NEXT_PUBLIC_USE_TEST_DATA === 'true',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const
