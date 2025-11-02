/**
 * Supabase Database Adapter
 *
 * Implements the IDatabaseAdapter interface using Supabase as the backend.
 * Uses Row Level Security (RLS) for automatic user-scoped data access.
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
import { getSupabaseClient } from '../supabase-client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../supabase-client'

/**
 * Supabase implementation of the database adapter
 *
 * Note: We use 'any' for Supabase client types in some places to work around
 * TypeScript inference issues with the generic Database type. This is safe because:
 * 1. We control the database schema
 * 2. RLS policies enforce security
 * 3. We map all results to our strongly-typed Component/Project/Tag types
 */
export class SupabaseAdapter implements IDatabaseAdapter {
  private supabase: SupabaseClient<Database> | null

  constructor() {
    this.supabase = getSupabaseClient()
    if (!this.supabase) {
      console.error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.')
    }
  }

  async initialize(): Promise<void> {
    // Supabase client is already initialized in constructor
    // Just verify the connection is working
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }

    // Test connection by checking auth status
    const { data: { session } } = await this.supabase.auth.getSession()
    console.log('Supabase adapter initialized', session ? 'with session' : 'without session')
  }

  private ensureClient(): SupabaseClient<any> {
    if (!this.supabase) {
      throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.')
    }
    return this.supabase as SupabaseClient<any>
  }

  // ==================== Component Operations ====================

  async getComponents(userId: string): Promise<Component[]> {
    const supabase = this.ensureClient()

    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching components:', error)
      throw new Error(`Failed to fetch components: ${error.message}`)
    }

    // Transform Supabase data to Component type
    return (data || []).map(row => ({
      id: row.id,
      user_id: row.user_id,
      project_id: row.project_id || undefined,
      name: row.name,
      html: row.html,
      css: row.css,
      js: row.js,
      tags: row.tags || undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  async getComponent(id: string, userId: string): Promise<Component | null> {
    const supabase = this.ensureClient()

    const result = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle()

    const { data, error } = result

    // Check for errors (excluding "no rows" which is handled by maybeSingle)
    if (error) {
      console.error('Error fetching component:', error)
      throw new Error(`Failed to fetch component: ${error.message}`)
    }

    if (!data) {
      return null
    }

    // Map to our Component type
    // Type assertion is safe because we control the schema
    const row = data as Database['public']['Tables']['components']['Row']
    return {
      id: row.id,
      user_id: row.user_id,
      project_id: row.project_id || undefined,
      name: row.name,
      html: row.html,
      css: row.css,
      js: row.js,
      tags: row.tags || undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  async createComponent(userId: string, data: ComponentInput): Promise<Component> {
    const supabase = this.ensureClient()

    // Validate input
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Component name is required')
    }

    const { data: component, error } = await supabase
      .from('components')
      .insert({
        user_id: userId,
        project_id: data.project_id || null,
        name: data.name,
        html: data.html || '',
        css: data.css || '',
        js: data.js || '',
        tags: data.tags || [],
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating component:', error)
      throw new Error(`Failed to create component: ${error.message}`)
    }

    return {
      id: component.id,
      user_id: component.user_id,
      project_id: component.project_id || undefined,
      name: component.name,
      html: component.html,
      css: component.css,
      js: component.js,
      tags: component.tags || undefined,
      created_at: component.created_at,
      updated_at: component.updated_at,
    }
  }

  async updateComponent(id: string, userId: string, data: ComponentUpdate): Promise<Component> {
    const supabase = this.ensureClient()

    const { data: component, error } = await supabase
      .from('components')
      .update({
        name: data.name,
        html: data.html,
        css: data.css,
        js: data.js,
        project_id: data.project_id === undefined ? undefined : (data.project_id || null),
        tags: data.tags,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Component', id)
      }
      console.error('Error updating component:', error)
      throw new Error(`Failed to update component: ${error.message}`)
    }

    return {
      id: component.id,
      user_id: component.user_id,
      project_id: component.project_id || undefined,
      name: component.name,
      html: component.html,
      css: component.css,
      js: component.js,
      tags: component.tags || undefined,
      created_at: component.created_at,
      updated_at: component.updated_at,
    }
  }

  async deleteComponent(id: string, userId: string): Promise<void> {
    const supabase = this.ensureClient()

    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting component:', error)
      throw new Error(`Failed to delete component: ${error.message}`)
    }
  }

  // ==================== Project Operations ====================

  async getProjects(userId: string): Promise<Project[]> {
    const supabase = this.ensureClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      throw new Error(`Failed to fetch projects: ${error.message}`)
    }

    return (data || []).map(row => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      description: row.description || undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    const supabase = this.ensureClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching project:', error)
      throw new Error(`Failed to fetch project: ${error.message}`)
    }

    if (!data) return null

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  async createProject(userId: string, data: ProjectInput): Promise<Project> {
    const supabase = this.ensureClient()

    // Validate input
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Project name is required')
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: data.name,
        description: data.description || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return {
      id: project.id,
      user_id: project.user_id,
      name: project.name,
      description: project.description || undefined,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }
  }

  async updateProject(id: string, userId: string, data: ProjectUpdate): Promise<Project> {
    const supabase = this.ensureClient()

    const { data: project, error } = await supabase
      .from('projects')
      .update({
        name: data.name,
        description: data.description === undefined ? undefined : (data.description || null),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Project', id)
      }
      console.error('Error updating project:', error)
      throw new Error(`Failed to update project: ${error.message}`)
    }

    return {
      id: project.id,
      user_id: project.user_id,
      name: project.name,
      description: project.description || undefined,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const supabase = this.ensureClient()

    // Note: The database schema has ON DELETE SET NULL for project_id in components
    // So components will have their project_id set to null automatically
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting project:', error)
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  }

  // ==================== Tag Operations ====================

  async getTags(userId: string): Promise<Tag[]> {
    const supabase = this.ensureClient()

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching tags:', error)
      throw new Error(`Failed to fetch tags: ${error.message}`)
    }

    return (data || []).map(row => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      created_at: row.created_at,
    }))
  }

  async getTag(id: string, userId: string): Promise<Tag | null> {
    const supabase = this.ensureClient()

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching tag:', error)
      throw new Error(`Failed to fetch tag: ${error.message}`)
    }

    if (!data) return null

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      created_at: data.created_at,
    }
  }

  async createTag(userId: string, data: TagInput): Promise<Tag> {
    const supabase = this.ensureClient()

    // Validate input
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Tag name is required')
    }

    // Check for duplicate (case-insensitive)
    const { data: existingTags } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .ilike('name', data.name)

    if (existingTags && existingTags.length > 0) {
      // Return existing tag instead of creating duplicate
      const existing = existingTags[0]
      return {
        id: existing.id,
        user_id: existing.user_id,
        name: existing.name,
        created_at: existing.created_at,
      }
    }

    const { data: tag, error } = await supabase
      .from('tags')
      .insert({
        user_id: userId,
        name: data.name,
      })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (23505)
      if (error.code === '23505') {
        // Tag was created by another request, fetch it
        const { data: existingTag } = await supabase
          .from('tags')
          .select('*')
          .eq('user_id', userId)
          .ilike('name', data.name)
          .single()

        if (existingTag) {
          return {
            id: existingTag.id,
            user_id: existingTag.user_id,
            name: existingTag.name,
            created_at: existingTag.created_at,
          }
        }
      }
      console.error('Error creating tag:', error)
      throw new Error(`Failed to create tag: ${error.message}`)
    }

    return {
      id: tag.id,
      user_id: tag.user_id,
      name: tag.name,
      created_at: tag.created_at,
    }
  }

  async deleteTag(id: string, userId: string): Promise<void> {
    const supabase = this.ensureClient()

    // First, remove this tag from all components
    // Get all components that have this tag
    const { data: componentsWithTag } = await supabase
      .from('components')
      .select('id, tags')
      .eq('user_id', userId)
      .contains('tags', [id])

    if (componentsWithTag && componentsWithTag.length > 0) {
      // Update each component to remove the tag
      for (const component of componentsWithTag) {
        const updatedTags = (component.tags || []).filter(t => t !== id)
        await supabase
          .from('components')
          .update({ tags: updatedTags })
          .eq('id', component.id)
      }
    }

    // Now delete the tag
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting tag:', error)
      throw new Error(`Failed to delete tag: ${error.message}`)
    }
  }

  // ==================== Component-Tag Relationship Operations ====================

  async addTagToComponent(componentId: string, tagId: string, userId: string): Promise<void> {
    const supabase = this.ensureClient()

    // Verify tag exists and user owns it
    const tag = await this.getTag(tagId, userId)
    if (!tag) {
      throw new NotFoundError('Tag', tagId)
    }

    // Get component
    const { data: component, error: fetchError } = await supabase
      .from('components')
      .select('id, tags')
      .eq('id', componentId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !component) {
      if (fetchError?.code === 'PGRST116') {
        throw new NotFoundError('Component', componentId)
      }
      throw new Error('Failed to fetch component')
    }

    // Add tag if not already present
    const currentTags = component.tags || []
    if (!currentTags.includes(tagId)) {
      const updatedTags = [...currentTags, tagId]
      const { error: updateError } = await supabase
        .from('components')
        .update({ tags: updatedTags })
        .eq('id', componentId)
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error adding tag to component:', updateError)
        throw new Error(`Failed to add tag to component: ${updateError.message}`)
      }
    }
  }

  async removeTagFromComponent(componentId: string, tagId: string, userId: string): Promise<void> {
    const supabase = this.ensureClient()

    // Get component
    const { data: component, error: fetchError } = await supabase
      .from('components')
      .select('id, tags')
      .eq('id', componentId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !component) {
      if (fetchError?.code === 'PGRST116') {
        throw new NotFoundError('Component', componentId)
      }
      throw new Error('Failed to fetch component')
    }

    // Remove tag
    const currentTags = component.tags || []
    const updatedTags = currentTags.filter(t => t !== tagId)

    const { error: updateError } = await supabase
      .from('components')
      .update({ tags: updatedTags })
      .eq('id', componentId)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error removing tag from component:', updateError)
      throw new Error(`Failed to remove tag from component: ${updateError.message}`)
    }
  }
}
