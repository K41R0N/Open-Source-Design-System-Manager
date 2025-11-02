/**
 * Supabase Database Adapter (STUB)
 *
 * This is a stub implementation showing the structure for Supabase integration.
 * Replace the NotImplementedError throws with actual Supabase client calls.
 *
 * Setup Instructions:
 * 1. Install Supabase client: npm install @supabase/supabase-js
 * 2. Add environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 3. Initialize Supabase client in this file
 * 4. Implement each method using Supabase queries
 * 5. Update ENV constant in factory.ts to use this adapter
 */

import type { Component, Project, Tag } from '../database-context'
import {
  IDatabaseAdapter,
  ComponentInput,
  ProjectInput,
  TagInput,
  ComponentUpdate,
  ProjectUpdate,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from './interface'
import { ENV } from '../constants'

// Placeholder for Supabase client
// import { createClient, SupabaseClient } from '@supabase/supabase-js'

class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method} is not yet implemented. This is a stub for future Supabase integration.`)
    this.name = 'NotImplementedError'
  }
}

/**
 * Supabase implementation of the database adapter
 *
 * TODO: Implement all methods using Supabase client
 * Each method should:
 * 1. Use RLS (Row Level Security) - Supabase automatically enforces this
 * 2. Handle errors appropriately
 * 3. Return proper types
 */
export class SupabaseAdapter implements IDatabaseAdapter {
  // private supabase: SupabaseClient

  constructor() {
    // TODO: Initialize Supabase client
    // this.supabase = createClient(
    //   ENV.SUPABASE_URL!,
    //   ENV.SUPABASE_ANON_KEY!
    // )
  }

  async initialize(): Promise<void> {
    // TODO: Any initialization logic (e.g., check connection, load initial data)
    // For Supabase, this might just be a no-op since the client is already initialized
    throw new NotImplementedError('initialize')
  }

  // ==================== Component Operations ====================

  async getComponents(userId: string): Promise<Component[]> {
    // TODO: Implement using Supabase
    // Example:
    // const { data, error } = await this.supabase
    //   .from('components')
    //   .select('*')
    //   .eq('user_id', userId)
    // if (error) throw new Error(error.message)
    // return data || []
    throw new NotImplementedError('getComponents')
  }

  async getComponent(id: string, userId: string): Promise<Component | null> {
    // TODO: Implement using Supabase
    // Example:
    // const { data, error } = await this.supabase
    //   .from('components')
    //   .select('*')
    //   .eq('id', id)
    //   .eq('user_id', userId)
    //   .single()
    // if (error && error.code !== 'PGRST116') throw new Error(error.message)
    // return data || null
    throw new NotImplementedError('getComponent')
  }

  async createComponent(userId: string, data: ComponentInput): Promise<Component> {
    // TODO: Implement using Supabase
    // Example:
    // const { data: component, error } = await this.supabase
    //   .from('components')
    //   .insert({
    //     ...data,
    //     user_id: userId,
    //   })
    //   .select()
    //   .single()
    // if (error) throw new Error(error.message)
    // return component
    throw new NotImplementedError('createComponent')
  }

  async updateComponent(id: string, userId: string, data: ComponentUpdate): Promise<Component> {
    // TODO: Implement using Supabase
    // Example:
    // const { data: component, error } = await this.supabase
    //   .from('components')
    //   .update(data)
    //   .eq('id', id)
    //   .eq('user_id', userId)
    //   .select()
    //   .single()
    // if (error) {
    //   if (error.code === 'PGRST116') throw new NotFoundError('Component', id)
    //   throw new Error(error.message)
    // }
    // return component
    throw new NotImplementedError('updateComponent')
  }

  async deleteComponent(id: string, userId: string): Promise<void> {
    // TODO: Implement using Supabase
    // Example:
    // const { error } = await this.supabase
    //   .from('components')
    //   .delete()
    //   .eq('id', id)
    //   .eq('user_id', userId)
    // if (error) throw new Error(error.message)
    throw new NotImplementedError('deleteComponent')
  }

  // ==================== Project Operations ====================

  async getProjects(userId: string): Promise<Project[]> {
    // TODO: Implement using Supabase
    throw new NotImplementedError('getProjects')
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    // TODO: Implement using Supabase
    throw new NotImplementedError('getProject')
  }

  async createProject(userId: string, data: ProjectInput): Promise<Project> {
    // TODO: Implement using Supabase
    throw new NotImplementedError('createProject')
  }

  async updateProject(id: string, userId: string, data: ProjectUpdate): Promise<Project> {
    // TODO: Implement using Supabase
    throw new NotImplementedError('updateProject')
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    // TODO: Implement using Supabase
    // Don't forget to handle cascade deletion of component references
    throw new NotImplementedError('deleteProject')
  }

  // ==================== Tag Operations ====================

  async getTags(userId: string): Promise<Tag[]> {
    // TODO: Implement using Supabase
    throw new NotImplementedError('getTags')
  }

  async getTag(id: string, userId: string): Promise<Tag | null> {
    // TODO: Implement using Supabase
    throw new NotImplementedError('getTag')
  }

  async createTag(userId: string, data: TagInput): Promise<Tag> {
    // TODO: Implement using Supabase
    throw new NotImplementedError('createTag')
  }

  async deleteTag(id: string, userId: string): Promise<void> {
    // TODO: Implement using Supabase
    // Don't forget to handle cascade deletion from component_tags junction table
    throw new NotImplementedError('deleteTag')
  }

  // ==================== Component-Tag Relationship Operations ====================

  async addTagToComponent(componentId: string, tagId: string, userId: string): Promise<void> {
    // TODO: Implement using Supabase
    // Note: This uses the component_tags junction table in Supabase
    // Unlike localStorage where tags are stored as an array, Supabase uses a proper many-to-many relationship
    // Example:
    // const { error } = await this.supabase
    //   .from('component_tags')
    //   .insert({
    //     component_id: componentId,
    //     tag_id: tagId,
    //   })
    // if (error && error.code !== '23505') throw new Error(error.message) // 23505 is unique violation (tag already exists)
    throw new NotImplementedError('addTagToComponent')
  }

  async removeTagFromComponent(componentId: string, tagId: string, userId: string): Promise<void> {
    // TODO: Implement using Supabase
    // Example:
    // const { error } = await this.supabase
    //   .from('component_tags')
    //   .delete()
    //   .eq('component_id', componentId)
    //   .eq('tag_id', tagId)
    // if (error) throw new Error(error.message)
    throw new NotImplementedError('removeTagFromComponent')
  }
}

/**
 * Helper function to get components with their tags (for Supabase)
 *
 * In Supabase, you'll want to join the component_tags table to get tags
 * Example query:
 *
 * const { data, error } = await supabase
 *   .from('components')
 *   .select(`
 *     *,
 *     component_tags (
 *       tag_id,
 *       tags (
 *         id,
 *         name
 *       )
 *     )
 *   `)
 *   .eq('user_id', userId)
 *
 * Then transform the data to match the Component type with tags as string[]
 */
