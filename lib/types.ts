/**
 * Centralized type definitions for the application
 * Re-exports database types and defines utility types
 */

// Re-export database types for convenience
export type {
  Component,
  Project,
  Tag,
  DatabaseContextType,
} from './database-context'

/**
 * Helper types for form operations
 */
export type ComponentInput = {
  name: string
  html: string
  css: string
  js: string
  tags?: string[]
  project_id?: string
}

export type ProjectInput = {
  name: string
  description?: string
}

export type TagInput = {
  name: string
}

/**
 * UI State types
 */
export type SizeWarning = {
  level: 'info' | 'warning' | 'error'
  message: string
}

export type LoadingState = {
  isLoading: boolean
  message?: string
}

export type ErrorState = {
  hasError: boolean
  message?: string
}

/**
 * Validation result types
 */
export type ValidationResult = {
  isValid: boolean
  errors: string[]
  warnings?: SizeWarning[]
}

/**
 * Search and filter types
 */
export type ComponentFilter = {
  search?: string
  tags?: string[]
  project_id?: string
}

export type SortOrder = 'asc' | 'desc'
export type SortField = 'name' | 'created_at' | 'updated_at'

/**
 * Pagination types
 */
export type PaginationState = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export type PaginatedResult<T> = {
  items: T[]
  pagination: PaginationState
}
