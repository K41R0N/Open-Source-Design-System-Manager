/**
 * localStorage utility wrapper
 * Provides type-safe storage operations with error handling
 */

import { STORAGE_KEYS } from './constants'
import type { Component, Project, Tag } from './database-context'

/**
 * Generic storage operations
 */
class StorageManager {
  /**
   * Get data from localStorage with type safety
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  }

  /**
   * Set data in localStorage with error handling
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error)
      return false
    }
  }

  /**
   * Clear all localStorage (use with caution)
   */
  clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }
}

// Create singleton instance
const storage = new StorageManager()

/**
 * Domain-specific storage operations
 */

export const componentStorage = {
  getAll(): Component[] {
    return storage.get<Component[]>(STORAGE_KEYS.COMPONENTS) || []
  },

  setAll(components: Component[]): boolean {
    return storage.set(STORAGE_KEYS.COMPONENTS, components)
  },

  getById(id: string): Component | null {
    const components = this.getAll()
    return components.find(c => c.id === id) || null
  },

  getByUserId(userId: string): Component[] {
    const components = this.getAll()
    return components.filter(c => c.user_id === userId)
  },
}

export const projectStorage = {
  getAll(): Project[] {
    return storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || []
  },

  setAll(projects: Project[]): boolean {
    return storage.set(STORAGE_KEYS.PROJECTS, projects)
  },

  getById(id: string): Project | null {
    const projects = this.getAll()
    return projects.find(p => p.id === id) || null
  },

  getByUserId(userId: string): Project[] {
    const projects = this.getAll()
    return projects.filter(p => p.user_id === userId)
  },
}

export const tagStorage = {
  getAll(): Tag[] {
    return storage.get<Tag[]>(STORAGE_KEYS.TAGS) || []
  },

  setAll(tags: Tag[]): boolean {
    return storage.set(STORAGE_KEYS.TAGS, tags)
  },

  getById(id: string): Tag | null {
    const tags = this.getAll()
    return tags.find(t => t.id === id) || null
  },

  getByUserId(userId: string): Tag[] {
    const tags = this.getAll()
    return tags.filter(t => t.user_id === userId)
  },

  getByName(name: string): Tag | null {
    const tags = this.getAll()
    return tags.find(t => t.name.toLowerCase() === name.toLowerCase()) || null
  },
}

export const userStorage = {
  get() {
    return storage.get<any>(STORAGE_KEYS.USER)
  },

  set(user: any): boolean {
    return storage.set(STORAGE_KEYS.USER, user)
  },

  remove(): boolean {
    return storage.remove(STORAGE_KEYS.USER)
  },
}

// Export base storage for advanced use cases
export { storage }
