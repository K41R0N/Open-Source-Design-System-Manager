/**
 * LocalStorage Database Adapter
 *
 * Implements the IDatabaseAdapter interface using browser localStorage.
 * This is the current implementation used before migrating to Supabase.
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
import { componentStorage, projectStorage, tagStorage } from '../storage'
import { testComponents, testProjects, testTags } from '../test-components'
import { ENV } from '../constants'

/**
 * LocalStorage implementation of the database adapter
 */
export class LocalStorageAdapter implements IDatabaseAdapter {
  private initialized = false

  /**
   * Initialize the adapter (load test data if configured)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    // Load test data if configured
    if (ENV.USE_TEST_DATA) {
      // Only load if storage is empty
      const existingComponents = componentStorage.getAll()
      if (existingComponents.length === 0) {
        componentStorage.setAll(testComponents)
        projectStorage.setAll(testProjects)
        tagStorage.setAll(testTags)
      }
    }

    this.initialized = true
  }

  // ==================== Component Operations ====================

  async getComponents(userId: string): Promise<Component[]> {
    return componentStorage.getByUserId(userId)
  }

  async getComponent(id: string, userId: string): Promise<Component | null> {
    const component = componentStorage.getById(id)
    if (!component) return null
    if (component.user_id !== userId) {
      throw new UnauthorizedError()
    }
    return component
  }

  async createComponent(userId: string, data: ComponentInput): Promise<Component> {
    // Validate input
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Component name is required')
    }

    // Generate new component
    const newComponent: Component = {
      id: `component-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    }

    // Save to storage
    const allComponents = componentStorage.getAll()
    allComponents.push(newComponent)
    componentStorage.setAll(allComponents)

    return newComponent
  }

  async updateComponent(id: string, userId: string, data: ComponentUpdate): Promise<Component> {
    const allComponents = componentStorage.getAll()
    const index = allComponents.findIndex(c => c.id === id)

    if (index === -1) {
      throw new NotFoundError('Component', id)
    }

    // Check ownership
    if (allComponents[index].user_id !== userId) {
      throw new UnauthorizedError()
    }

    // Update component
    const updatedComponent: Component = {
      ...allComponents[index],
      ...data,
      id: allComponents[index].id, // Ensure ID doesn't change
      user_id: allComponents[index].user_id, // Ensure user_id doesn't change
      created_at: allComponents[index].created_at, // Ensure created_at doesn't change
      updated_at: new Date().toISOString(),
    }

    allComponents[index] = updatedComponent
    componentStorage.setAll(allComponents)

    return updatedComponent
  }

  async deleteComponent(id: string, userId: string): Promise<void> {
    const allComponents = componentStorage.getAll()
    const component = allComponents.find(c => c.id === id)

    if (!component) {
      throw new NotFoundError('Component', id)
    }

    // Check ownership
    if (component.user_id !== userId) {
      throw new UnauthorizedError()
    }

    // Remove component
    const filtered = allComponents.filter(c => c.id !== id)
    componentStorage.setAll(filtered)
  }

  // ==================== Project Operations ====================

  async getProjects(userId: string): Promise<Project[]> {
    return projectStorage.getByUserId(userId)
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    const project = projectStorage.getById(id)
    if (!project) return null
    if (project.user_id !== userId) {
      throw new UnauthorizedError()
    }
    return project
  }

  async createProject(userId: string, data: ProjectInput): Promise<Project> {
    // Validate input
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Project name is required')
    }

    // Generate new project
    const newProject: Project = {
      id: `project-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    }

    // Save to storage
    const allProjects = projectStorage.getAll()
    allProjects.push(newProject)
    projectStorage.setAll(allProjects)

    return newProject
  }

  async updateProject(id: string, userId: string, data: ProjectUpdate): Promise<Project> {
    const allProjects = projectStorage.getAll()
    const index = allProjects.findIndex(p => p.id === id)

    if (index === -1) {
      throw new NotFoundError('Project', id)
    }

    // Check ownership
    if (allProjects[index].user_id !== userId) {
      throw new UnauthorizedError()
    }

    // Update project
    const updatedProject: Project = {
      ...allProjects[index],
      ...data,
      id: allProjects[index].id,
      user_id: allProjects[index].user_id,
      created_at: allProjects[index].created_at,
      updated_at: new Date().toISOString(),
    }

    allProjects[index] = updatedProject
    projectStorage.setAll(allProjects)

    return updatedProject
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const allProjects = projectStorage.getAll()
    const project = allProjects.find(p => p.id === id)

    if (!project) {
      throw new NotFoundError('Project', id)
    }

    // Check ownership
    if (project.user_id !== userId) {
      throw new UnauthorizedError()
    }

    // Remove project
    const filtered = allProjects.filter(p => p.id !== id)
    projectStorage.setAll(filtered)

    // Update components in this project to have no project
    const allComponents = componentStorage.getAll()
    const updatedComponents = allComponents.map(c => {
      if (c.project_id === id) {
        return { ...c, project_id: undefined, updated_at: new Date().toISOString() }
      }
      return c
    })
    componentStorage.setAll(updatedComponents)
  }

  // ==================== Tag Operations ====================

  async getTags(userId: string): Promise<Tag[]> {
    return tagStorage.getByUserId(userId)
  }

  async getTag(id: string, userId: string): Promise<Tag | null> {
    const tag = tagStorage.getById(id)
    if (!tag) return null
    if (tag.user_id !== userId) {
      throw new UnauthorizedError()
    }
    return tag
  }

  async createTag(userId: string, data: TagInput): Promise<Tag> {
    // Validate input
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Tag name is required')
    }

    // Check for duplicate tag name (case-insensitive)
    const existingTags = tagStorage.getByUserId(userId)
    const duplicate = existingTags.find(
      t => t.name.toLowerCase() === data.name.toLowerCase()
    )
    if (duplicate) {
      return duplicate // Return existing tag instead of creating duplicate
    }

    // Generate new tag
    const newTag: Tag = {
      id: `tag-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      ...data,
    }

    // Save to storage
    const allTags = tagStorage.getAll()
    allTags.push(newTag)
    tagStorage.setAll(allTags)

    return newTag
  }

  async deleteTag(id: string, userId: string): Promise<void> {
    const allTags = tagStorage.getAll()
    const tag = allTags.find(t => t.id === id)

    if (!tag) {
      throw new NotFoundError('Tag', id)
    }

    // Check ownership
    if (tag.user_id !== userId) {
      throw new UnauthorizedError()
    }

    // Remove tag
    const filtered = allTags.filter(t => t.id !== id)
    tagStorage.setAll(filtered)

    // Remove this tag from all components
    const allComponents = componentStorage.getAll()
    const updatedComponents = allComponents.map(c => {
      if (c.tags && c.tags.includes(id)) {
        return {
          ...c,
          tags: c.tags.filter(t => t !== id),
          updated_at: new Date().toISOString(),
        }
      }
      return c
    })
    componentStorage.setAll(updatedComponents)
  }

  // ==================== Component-Tag Relationship Operations ====================

  async addTagToComponent(componentId: string, tagId: string, userId: string): Promise<void> {
    // Verify tag exists and user owns it
    const tag = await this.getTag(tagId, userId)
    if (!tag) {
      throw new NotFoundError('Tag', tagId)
    }

    // Get component
    const allComponents = componentStorage.getAll()
    const index = allComponents.findIndex(c => c.id === componentId)

    if (index === -1) {
      throw new NotFoundError('Component', componentId)
    }

    // Check ownership
    if (allComponents[index].user_id !== userId) {
      throw new UnauthorizedError()
    }

    // Add tag if not already present
    const component = allComponents[index]
    const tags = component.tags || []

    if (!tags.includes(tagId) && !tags.includes(tag.name)) {
      tags.push(tagId)
      allComponents[index] = {
        ...component,
        tags,
        updated_at: new Date().toISOString(),
      }
      componentStorage.setAll(allComponents)
    }
  }

  async removeTagFromComponent(componentId: string, tagId: string, userId: string): Promise<void> {
    // Get component
    const allComponents = componentStorage.getAll()
    const index = allComponents.findIndex(c => c.id === componentId)

    if (index === -1) {
      throw new NotFoundError('Component', componentId)
    }

    // Check ownership
    if (allComponents[index].user_id !== userId) {
      throw new UnauthorizedError()
    }

    // Get tag info for name-based checking
    const tag = tagStorage.getById(tagId)

    // Remove tag
    const component = allComponents[index]
    const tags = component.tags || []
    const filteredTags = tags.filter(t => t !== tagId && (tag ? t !== tag.name : true))

    allComponents[index] = {
      ...component,
      tags: filteredTags,
      updated_at: new Date().toISOString(),
    }
    componentStorage.setAll(allComponents)
  }
}
