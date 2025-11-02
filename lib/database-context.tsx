'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getAdapter, initializeAdapter } from '@/lib/adapters'

// Define types for our database models
export type Component = {
  id: string
  name: string
  html: string
  css: string
  js: string
  project_id?: string
  user_id: string
  created_at: string
  updated_at: string
  tags?: string[]
}

export type Project = {
  id: string
  name: string
  description?: string
  user_id: string
  created_at: string
  updated_at: string
}

export type Tag = {
  id: string
  name: string
  user_id: string
  created_at: string
}

// Create a context for database operations
export type DatabaseContextType = {
  components: Component[]
  projects: Project[]
  tags: Tag[]
  loading: boolean
  error: string | null
  addComponent: (component: Omit<Component, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Component>
  updateComponent: (id: string, component: Partial<Component>) => Promise<Component>
  deleteComponent: (id: string) => Promise<void>
  addProject: (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Project>
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
  addTag: (tag: Omit<Tag, 'id' | 'user_id' | 'created_at'>) => Promise<Tag>
  deleteTag: (id: string) => Promise<void>
  addTagToComponent: (componentId: string, tagId: string) => Promise<void>
  removeTagFromComponent: (componentId: string, tagId: string) => Promise<void>
}

const DatabaseContext = React.createContext<DatabaseContextType>({
  components: [],
  projects: [],
  tags: [],
  loading: true,
  error: null,
  addComponent: async () => ({ id: '', name: '', html: '', css: '', js: '', user_id: '', created_at: '', updated_at: '' }),
  updateComponent: async () => ({ id: '', name: '', html: '', css: '', js: '', user_id: '', created_at: '', updated_at: '' }),
  deleteComponent: async () => {},
  addProject: async () => ({ id: '', name: '', user_id: '', created_at: '', updated_at: '' }),
  updateProject: async () => ({ id: '', name: '', user_id: '', created_at: '', updated_at: '' }),
  deleteProject: async () => {},
  addTag: async () => ({ id: '', name: '', user_id: '', created_at: '' }),
  deleteTag: async () => {},
  addTagToComponent: async () => {},
  removeTagFromComponent: async () => {}
})

export const useDatabase = () => React.useContext(DatabaseContext)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [components, setComponents] = useState<Component[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the database adapter
  const adapter = getAdapter()

  // Load data when user is authenticated
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false)
        setComponents([])
        setProjects([])
        setTags([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Initialize adapter if not already done
        await initializeAdapter()

        // Load all data using the adapter
        const [loadedComponents, loadedProjects, loadedTags] = await Promise.all([
          adapter.getComponents(user.id),
          adapter.getProjects(user.id),
          adapter.getTags(user.id),
        ])

        setComponents(loadedComponents)
        setProjects(loadedProjects)
        setTags(loadedTags)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, user])

  // Component operations
  const addComponent = async (componentData: Omit<Component, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Component> => {
    if (!user) throw new Error('User not authenticated')

    try {
      const newComponent = await adapter.createComponent(user.id, componentData)
      setComponents(prev => [...prev, newComponent])
      return newComponent
    } catch (err) {
      console.error('Error adding component:', err)
      throw err
    }
  }

  const updateComponent = async (id: string, componentData: Partial<Component>): Promise<Component> => {
    if (!user) throw new Error('User not authenticated')

    try {
      const updatedComponent = await adapter.updateComponent(id, user.id, componentData)
      setComponents(prev => prev.map(c => c.id === id ? updatedComponent : c))
      return updatedComponent
    } catch (err) {
      console.error('Error updating component:', err)
      throw err
    }
  }

  const deleteComponent = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    try {
      await adapter.deleteComponent(id, user.id)
      setComponents(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting component:', err)
      throw err
    }
  }

  // Project operations
  const addProject = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    if (!user) throw new Error('User not authenticated')

    try {
      const newProject = await adapter.createProject(user.id, projectData)
      setProjects(prev => [...prev, newProject])
      return newProject
    } catch (err) {
      console.error('Error adding project:', err)
      throw err
    }
  }

  const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
    if (!user) throw new Error('User not authenticated')

    try {
      const updatedProject = await adapter.updateProject(id, user.id, projectData)
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
      return updatedProject
    } catch (err) {
      console.error('Error updating project:', err)
      throw err
    }
  }

  const deleteProject = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    try {
      await adapter.deleteProject(id, user.id)
      setProjects(prev => prev.filter(p => p.id !== id))
      // Refresh components since deleteProject updates them
      const updatedComponents = await adapter.getComponents(user.id)
      setComponents(updatedComponents)
    } catch (err) {
      console.error('Error deleting project:', err)
      throw err
    }
  }

  // Tag operations
  const addTag = async (tagData: Omit<Tag, 'id' | 'user_id' | 'created_at'>): Promise<Tag> => {
    if (!user) throw new Error('User not authenticated')

    try {
      const newTag = await adapter.createTag(user.id, tagData)
      // Check if tag already exists (adapter might return existing tag)
      const exists = tags.some(t => t.id === newTag.id)
      if (!exists) {
        setTags(prev => [...prev, newTag])
      }
      return newTag
    } catch (err) {
      console.error('Error adding tag:', err)
      throw err
    }
  }

  const deleteTag = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    try {
      await adapter.deleteTag(id, user.id)
      setTags(prev => prev.filter(t => t.id !== id))
      // Refresh components since deleteTag updates them
      const updatedComponents = await adapter.getComponents(user.id)
      setComponents(updatedComponents)
    } catch (err) {
      console.error('Error deleting tag:', err)
      throw err
    }
  }

  // Component-Tag relationship operations
  const addTagToComponent = async (componentId: string, tagId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    try {
      await adapter.addTagToComponent(componentId, tagId, user.id)
      // Refresh the component to get updated tags
      const updatedComponent = await adapter.getComponent(componentId, user.id)
      if (updatedComponent) {
        setComponents(prev => prev.map(c => c.id === componentId ? updatedComponent : c))
      }
    } catch (err) {
      console.error('Error adding tag to component:', err)
      throw err
    }
  }

  const removeTagFromComponent = async (componentId: string, tagId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    try {
      await adapter.removeTagFromComponent(componentId, tagId, user.id)
      // Refresh the component to get updated tags
      const updatedComponent = await adapter.getComponent(componentId, user.id)
      if (updatedComponent) {
        setComponents(prev => prev.map(c => c.id === componentId ? updatedComponent : c))
      }
    } catch (err) {
      console.error('Error removing tag from component:', err)
      throw err
    }
  }

  return (
    <DatabaseContext.Provider
      value={{
        components,
        projects,
        tags,
        loading,
        error,
        addComponent,
        updateComponent,
        deleteComponent,
        addProject,
        updateProject,
        deleteProject,
        addTag,
        deleteTag,
        addTagToComponent,
        removeTagFromComponent
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}
