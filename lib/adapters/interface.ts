/**
 * Database Adapter Interface
 *
 * Defines the contract for database operations.
 * Allows switching between localStorage, Supabase, or any other storage backend
 * without changing application code.
 */

import type { Component, Project, Tag } from '../database-context'

/**
 * Input types for creating new entities (without system-generated fields)
 */
export type ComponentInput = Omit<Component, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type ProjectInput = Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type TagInput = Omit<Tag, 'id' | 'user_id' | 'created_at'>

/**
 * Update types (all fields optional except what's being updated)
 */
export type ComponentUpdate = Partial<Omit<Component, 'id' | 'user_id' | 'created_at'>>
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>

/**
 * Database Adapter Interface
 * All methods return Promises to support both sync (localStorage) and async (Supabase) operations
 */
export interface IDatabaseAdapter {
  // ==================== Component Operations ====================

  /**
   * Get all components for a user
   */
  getComponents(userId: string): Promise<Component[]>

  /**
   * Get a single component by ID
   */
  getComponent(id: string, userId: string): Promise<Component | null>

  /**
   * Create a new component
   */
  createComponent(userId: string, data: ComponentInput): Promise<Component>

  /**
   * Update an existing component
   */
  updateComponent(id: string, userId: string, data: ComponentUpdate): Promise<Component>

  /**
   * Delete a component
   */
  deleteComponent(id: string, userId: string): Promise<void>

  // ==================== Project Operations ====================

  /**
   * Get all projects for a user
   */
  getProjects(userId: string): Promise<Project[]>

  /**
   * Get a single project by ID
   */
  getProject(id: string, userId: string): Promise<Project | null>

  /**
   * Create a new project
   */
  createProject(userId: string, data: ProjectInput): Promise<Project>

  /**
   * Update an existing project
   */
  updateProject(id: string, userId: string, data: ProjectUpdate): Promise<Project>

  /**
   * Delete a project
   */
  deleteProject(id: string, userId: string): Promise<void>

  // ==================== Tag Operations ====================

  /**
   * Get all tags for a user
   */
  getTags(userId: string): Promise<Tag[]>

  /**
   * Get a single tag by ID
   */
  getTag(id: string, userId: string): Promise<Tag | null>

  /**
   * Create a new tag
   */
  createTag(userId: string, data: TagInput): Promise<Tag>

  /**
   * Delete a tag
   */
  deleteTag(id: string, userId: string): Promise<void>

  // ==================== Component-Tag Relationship Operations ====================

  /**
   * Add a tag to a component
   */
  addTagToComponent(componentId: string, tagId: string, userId: string): Promise<void>

  /**
   * Remove a tag from a component
   */
  removeTagFromComponent(componentId: string, tagId: string, userId: string): Promise<void>

  // ==================== Initialization ====================

  /**
   * Initialize the adapter (e.g., load test data, connect to database)
   */
  initialize?(): Promise<void>

  /**
   * Clean up resources
   */
  cleanup?(): Promise<void>
}

/**
 * Error types for adapter operations
 */
export class AdapterError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AdapterError'
  }
}

export class NotFoundError extends AdapterError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AdapterError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends AdapterError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}
