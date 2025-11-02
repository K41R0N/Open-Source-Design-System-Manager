'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { testComponents, testProjects, testTags } from '@/lib/test-components'
import { ENV } from '@/lib/constants'

// Load test data based on environment variable
const useTestData = ENV.USE_TEST_DATA;

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
  const [projects, setProjects] = useState<Project[]>([{ 
    id: 'default-project',
    name: 'Demo Project',
    user_id: 'loading',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }])
  const [tags, setTags] = useState<Tag[]>([
    {
      id: 'tag-navigation',
      name: 'navigation',
      user_id: 'loading',
      created_at: new Date().toISOString()
    },
    {
      id: 'tag-header',
      name: 'header',
      user_id: 'loading',
      created_at: new Date().toISOString()
    },
    {
      id: 'tag-hero',
      name: 'hero',
      user_id: 'loading',
      created_at: new Date().toISOString()
    }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data when user is authenticated
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Use test data in development mode
        if (useTestData) {
          setComponents(testComponents);
          setProjects(testProjects);
          setTags(testTags);
          setLoading(false);
          setError(null);
          return;
        }
        
        // In a real implementation, this would fetch data from Supabase
        // For now, we'll use localStorage for demo purposes
        
        // Load components
        const storedComponents = localStorage.getItem('sb-components')
        if (storedComponents) {
          const parsedComponents = JSON.parse(storedComponents)
          // Filter to only show user's components
          const userComponents = parsedComponents.filter((c: Component) => c.user_id === user.id)
          setComponents(userComponents)
        } else {
          // Initialize with empty array if no components exist
          setComponents([])
          localStorage.setItem('sb-components', JSON.stringify([]))
        }
        
        // Load projects
        const storedProjects = localStorage.getItem('sb-projects')
        if (storedProjects) {
          const parsedProjects = JSON.parse(storedProjects)
          // Filter to only show user's projects
          const userProjects = parsedProjects.filter((p: Project) => p.user_id === user.id)
          setProjects(userProjects)
        } else {
          // Initialize with default project
          const defaultProject: Project = {
            id: 'default-project',
            name: 'Demo Project',
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setProjects([defaultProject])
          localStorage.setItem('sb-projects', JSON.stringify([defaultProject]))
        }
        
        // Load tags
        const storedTags = localStorage.getItem('sb-tags')
        if (storedTags) {
          const parsedTags = JSON.parse(storedTags)
          // Filter to only show user's tags
          const userTags = parsedTags.filter((t: Tag) => t.user_id === user.id)
          setTags(userTags)
        } else {
          // Initialize with default tags
          const defaultTags: Tag[] = [
            {
              id: 'tag-navigation',
              name: 'navigation',
              user_id: user.id,
              created_at: new Date().toISOString()
            },
            {
              id: 'tag-header',
              name: 'header',
              user_id: user.id,
              created_at: new Date().toISOString()
            },
            {
              id: 'tag-hero',
              name: 'hero',
              user_id: user.id,
              created_at: new Date().toISOString()
            }
          ]
          setTags(defaultTags)
          localStorage.setItem('sb-tags', JSON.stringify(defaultTags))
        }
        
        setError(null)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, user])

  // Add a new component
  const addComponent = async (component: Omit<Component, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Component> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      // In a real implementation, this would insert into Supabase
      // For now, we'll use localStorage
      
      const newComponent: Component = {
        ...component,
        id: `component-${Math.random().toString(36).substring(2, 9)}`,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const updatedComponents = [...components, newComponent]
      setComponents(updatedComponents)
      localStorage.setItem('sb-components', JSON.stringify(updatedComponents))
      
      return newComponent
    } catch (err) {
      console.error('Error adding component:', err)
      throw new Error('Failed to add component')
    }
  }

  // Update an existing component
  const updateComponent = async (id: string, component: Partial<Component>): Promise<Component> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      console.log('Updating component:', id, component);
      
      const componentIndex = components.findIndex(c => c.id === id)
      if (componentIndex === -1) {
        throw new Error('Component not found')
      }
      
      // Ensure user owns this component (RLS simulation)
      if (components[componentIndex].user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      // Create a clean copy with valid values
      const updatedComponent: Component = {
        ...components[componentIndex],
        name: component.name || components[componentIndex].name,
        html: component.html !== undefined ? component.html : components[componentIndex].html,
        css: component.css !== undefined ? component.css : components[componentIndex].css,
        js: component.js !== undefined ? component.js : components[componentIndex].js,
        tags: Array.isArray(component.tags) ? [...component.tags] : (components[componentIndex].tags || []),
        project_id: component.project_id || components[componentIndex].project_id,
        user_id: components[componentIndex].user_id,
        created_at: components[componentIndex].created_at,
        updated_at: new Date().toISOString()
      }
      
      const updatedComponents = [...components]
      updatedComponents[componentIndex] = updatedComponent
      
      try {
        // Test if object is serializable
        JSON.stringify(updatedComponents);
        
        // Update state and localStorage
        setComponents(updatedComponents)
        localStorage.setItem('sb-components', JSON.stringify(updatedComponents))
        
        return updatedComponent
      } catch (jsonError) {
        console.error('JSON serialization error:', jsonError)
        throw new Error('Component contains data that cannot be saved')
      }
    } catch (err) {
      console.error('Error updating component:', err)
      throw new Error(`Failed to update component: ${err.message || 'Unknown error'}`)
    }
  }

  // Delete a component
  const deleteComponent = async (id: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const component = components.find(c => c.id === id)
      if (!component) {
        throw new Error('Component not found')
      }
      
      // Ensure user owns this component (RLS simulation)
      if (component.user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      const updatedComponents = components.filter(c => c.id !== id)
      setComponents(updatedComponents)
      localStorage.setItem('sb-components', JSON.stringify(updatedComponents))
    } catch (err) {
      console.error('Error deleting component:', err)
      throw new Error('Failed to delete component')
    }
  }

  // Add a new project
  const addProject = async (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const newProject: Project = {
        ...project,
        id: `project-${Math.random().toString(36).substring(2, 9)}`,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const updatedProjects = [...projects, newProject]
      setProjects(updatedProjects)
      localStorage.setItem('sb-projects', JSON.stringify(updatedProjects))
      
      return newProject
    } catch (err) {
      console.error('Error adding project:', err)
      throw new Error('Failed to add project')
    }
  }

  // Update an existing project
  const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const projectIndex = projects.findIndex(p => p.id === id)
      if (projectIndex === -1) {
        throw new Error('Project not found')
      }
      
      // Ensure user owns this project (RLS simulation)
      if (projects[projectIndex].user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      const updatedProject: Project = {
        ...projects[projectIndex],
        ...project,
        updated_at: new Date().toISOString()
      }
      
      const updatedProjects = [...projects]
      updatedProjects[projectIndex] = updatedProject
      
      setProjects(updatedProjects)
      localStorage.setItem('sb-projects', JSON.stringify(updatedProjects))
      
      return updatedProject
    } catch (err) {
      console.error('Error updating project:', err)
      throw new Error('Failed to update project')
    }
  }

  // Delete a project
  const deleteProject = async (id: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const project = projects.find(p => p.id === id)
      if (!project) {
        throw new Error('Project not found')
      }
      
      // Ensure user owns this project (RLS simulation)
      if (project.user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      const updatedProjects = projects.filter(p => p.id !== id)
      setProjects(updatedProjects)
      localStorage.setItem('sb-projects', JSON.stringify(updatedProjects))
      
      // Update components that were in this project to have no project
      const updatedComponents = components.map(c => {
        if (c.project_id === id) {
          return { ...c, project_id: undefined, updated_at: new Date().toISOString() }
        }
        return c
      })
      
      setComponents(updatedComponents)
      localStorage.setItem('sb-components', JSON.stringify(updatedComponents))
    } catch (err) {
      console.error('Error deleting project:', err)
      throw new Error('Failed to delete project')
    }
  }

  // Add a new tag
  const addTag = async (tag: Omit<Tag, 'id' | 'user_id' | 'created_at'>): Promise<Tag> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const newTag: Tag = {
        ...tag,
        id: `tag-${Math.random().toString(36).substring(2, 9)}`,
        user_id: user.id,
        created_at: new Date().toISOString()
      }
      
      const updatedTags = [...tags, newTag]
      setTags(updatedTags)
      localStorage.setItem('sb-tags', JSON.stringify(updatedTags))
      
      return newTag
    } catch (err) {
      console.error('Error adding tag:', err)
      throw new Error('Failed to add tag')
    }
  }

  // Delete a tag
  const deleteTag = async (id: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const tag = tags.find(t => t.id === id)
      if (!tag) {
        throw new Error('Tag not found')
      }
      
      // Ensure user owns this tag (RLS simulation)
      if (tag.user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      const updatedTags = tags.filter(t => t.id !== id)
      setTags(updatedTags)
      localStorage.setItem('sb-tags', JSON.stringify(updatedTags))
      
      // Remove this tag from all components
      const updatedComponents = components.map(c => {
        if (c.tags && c.tags.includes(id)) {
          return {
            ...c,
            tags: c.tags.filter(t => t !== id),
            updated_at: new Date().toISOString()
          }
        }
        return c
      })
      
      setComponents(updatedComponents)
      localStorage.setItem('sb-components', JSON.stringify(updatedComponents))
    } catch (err) {
      console.error('Error deleting tag:', err)
      throw new Error('Failed to delete tag')
    }
  }

  // Add a tag to a component
  const addTagToComponent = async (componentId: string, tagId: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const componentIndex = components.findIndex(c => c.id === componentId)
      if (componentIndex === -1) {
        throw new Error('Component not found')
      }
      
      // Ensure user owns this component (RLS simulation)
      if (components[componentIndex].user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      const tag = tags.find(t => t.id === tagId)
      if (!tag) {
        throw new Error('Tag not found')
      }
      
      // Ensure user owns this tag (RLS simulation)
      if (tag.user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      const component = components[componentIndex]
      const updatedTags = component.tags ? [...component.tags] : []
      
      // Only add if not already present (check both ID and name for backward compatibility)
      if (!updatedTags.includes(tagId) && !updatedTags.includes(tag.name)) {
        updatedTags.push(tagId)
      }
      
      const updatedComponent = {
        ...component,
        tags: updatedTags,
        updated_at: new Date().toISOString()
      }
      
      const updatedComponents = [...components]
      updatedComponents[componentIndex] = updatedComponent
      
      setComponents(updatedComponents)
      localStorage.setItem('sb-components', JSON.stringify(updatedComponents))
    } catch (err) {
      console.error('Error adding tag to component:', err)
      throw new Error(`Failed to add tag to component: ${err.message || 'Unknown error'}`)
    }
  }

  // Remove a tag from a component
  const removeTagFromComponent = async (componentId: string, tagId: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated')
    }

    try {
      const componentIndex = components.findIndex(c => c.id === componentId)
      if (componentIndex === -1) {
        throw new Error('Component not found')
      }
      
      // Ensure user owns this component (RLS simulation)
      if (components[componentIndex].user_id !== user.id) {
        throw new Error('Unauthorized')
      }
      
      // Get tag info for name-based checking
      const tag = tags.find(t => t.id === tagId)
      
      // Remove the tag from the component (check both ID and name)
      const component = components[componentIndex]
      const updatedTags = component.tags ? 
        component.tags.filter(t => t !== tagId && (tag ? t !== tag.name : true)) : 
        []
      
      // Update the component
      components[componentIndex] = {
        ...component,
        tags: updatedTags,
        updated_at: new Date().toISOString()
      }
      
      setComponents([...components])
      localStorage.setItem('sb-components', JSON.stringify(components))
    } catch (err) {
      console.error('Error removing tag from component:', err)
      throw new Error(`Failed to remove tag from component: ${err.message || 'Unknown error'}`)
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