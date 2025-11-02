'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useDatabase, type Component } from '@/lib/database-context'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Expand, Edit, ChevronDown, ChevronRight, Package, Search, Plus, Tag, X } from 'lucide-react'
import ComponentEditor from '@/components/ComponentEditor'
import IframeRenderer from '@/components/IframeRenderer'

// Add new project dialog
const NewProjectDialog = ({ isOpen, onClose, onSave }: { 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  
  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name, description)
      setName('')
      setDescription('')
      onClose()
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-sage-light border-black max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-wider uppercase">New Project</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider">Project Name</label>
            <Input 
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-sage border-black rounded-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm uppercase tracking-wider">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full h-24 bg-sage border-black rounded-none p-2 font-mono text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              onClick={onClose}
              className="bg-sage hover:bg-sage-dark text-black border border-black rounded-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-terracotta hover:bg-terracotta-dark text-black border border-black rounded-none"
            >
              Create Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Define the login dialog component
const LoginDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { signIn } = useAuth()
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-sage-light border-black max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-wider uppercase">SIGN IN TO CONTINUE</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <p className="text-sm">Sign in to access your component library and start building.</p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => signIn('github')} 
              className="flex items-center gap-2 bg-[#333] hover:bg-[#222] text-white border border-black rounded-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </Button>
            <Button 
              onClick={() => signIn('google')} 
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black border border-black rounded-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Define the main dashboard page
export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const { 
    components, 
    projects, 
    tags, 
    addComponent, 
    updateComponent, 
    addProject,
    deleteProject,
    deleteTag,
    addTagToComponent,
    removeTagFromComponent 
  } = useDatabase()
  
  // State for login dialog
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  
  // State for component editor
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null)

  // State for preview dialog
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewComponent, setPreviewComponent] = useState<Component | null>(null)
  
  // State for new project dialog
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false)
  
  // State for selected components (for export)
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  
  // State for expanded folders
  const [expandedProjects, setExpandedProjects] = useState<string[]>(['all'])
  const [expandedTags, setExpandedTags] = useState<string[]>(['all'])
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  
  // Check if user is authenticated when the page loads
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginDialog(true)
    }
  }, [isAuthenticated])
  
  // Handle opening the component editor
  const handleEditComponent = (component: Component) => {
    setCurrentComponent(component)
    setIsEditorOpen(true)
  }

  // Handle opening the preview dialog
  const handlePreviewComponent = (component: Component) => {
    setPreviewComponent(component)
    setIsPreviewOpen(true)
  }
  
  // Handle toggling a project expansion
  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }
  
  // Handle toggling a tag expansion
  const toggleTag = (tag: string) => {
    setExpandedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }
  
  // Handle component selection for export
  const toggleComponentSelection = (componentId: string) => {
    setSelectedComponents(prev => 
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    )
  }
  
  // Handle creating a new project
  const handleCreateProject = (name: string, description?: string) => {
    addProject({ name, description })
  }
  
  // Handle deleting a project
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? Components will be kept but moved to the default project.')) {
      deleteProject(projectId)
    }
  }
  
  // Handle deleting a tag
  const handleDeleteTag = (tagId: string) => {
    if (window.confirm('Are you sure you want to delete this tag? It will be removed from all components.')) {
      deleteTag(tagId)
    }
  }
  
  // Filter components based on search and active filter
  const filteredComponents = components.filter(comp => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by active filter (project or tag)
    let matchesFilter = activeFilter === 'all'
    
    if (!matchesFilter && activeFilter.startsWith('project:')) {
      const projectId = activeFilter.replace('project:', '')
      matchesFilter = comp.project_id === projectId
    }
    
    if (!matchesFilter && activeFilter.startsWith('tag:')) {
      const tagName = activeFilter.replace('tag:', '')
      const tagObj = tags.find(t => t.name === tagName)
      
      // Handle both tag IDs and tag names for backwards compatibility
      matchesFilter = tagObj ? 
        (comp.tags?.includes(tagObj.id) || comp.tags?.includes(tagName)) : 
        false
    }
    
    return matchesSearch && matchesFilter
  })
  
  // Function to handle packaging and downloading selected components
  const handlePackageDownload = () => {
    // Get all selected components
    const selectedComponentsData = components.filter(comp => 
      selectedComponents.includes(comp.id)
    )
    
    if (selectedComponentsData.length === 0) {
      alert('Please select at least one component to package')
      return
    }
    
    // Create consolidated files
    let consolidatedHTML = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Packaged Components</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n'
    let consolidatedCSS = '/* Consolidated styles from all selected components */\n\n'
    let consolidatedJS = '// Consolidated JavaScript from all selected components\n\ndocument.addEventListener("DOMContentLoaded", function() {\n'
    
    // Add each component's code
    selectedComponentsData.forEach((comp, index) => {
      // Add a component wrapper with ID for the HTML
      consolidatedHTML += `\n<!-- Component: ${comp.name} -->\n<div id="component-${index}" class="component-wrapper">\n${comp.html}\n</div>\n`
      
      // Add the CSS with component-specific scope
      consolidatedCSS += `\n/* Styles for ${comp.name} */\n${comp.css}\n`
      
      // Add the JS with proper scoping
      if (comp.js && comp.js.trim() !== '') {
        consolidatedJS += `\n// JavaScript for ${comp.name}\n(function() {\n  const componentContainer = document.getElementById("component-${index}");\n  ${comp.js}\n})();\n`
      }
    })
    
    // Close the HTML and JS files
    consolidatedHTML += '\n<script src="scripts.js"></script>\n</body>\n</html>'
    consolidatedJS += '\n});'
    
    // Create the file downloads
    const htmlBlob = new Blob([consolidatedHTML], { type: 'text/html' })
    const cssBlob = new Blob([consolidatedCSS], { type: 'text/css' })
    const jsBlob = new Blob([consolidatedJS], { type: 'text/javascript' })
    
    // Create download links
    const htmlUrl = URL.createObjectURL(htmlBlob)
    const cssUrl = URL.createObjectURL(cssBlob)
    const jsUrl = URL.createObjectURL(jsBlob)
    
    // Function to trigger downloads
    const downloadFile = (url: string, filename: string) => {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    // Download each file
    downloadFile(htmlUrl, 'index.html')
    setTimeout(() => downloadFile(cssUrl, 'styles.css'), 100)
    setTimeout(() => downloadFile(jsUrl, 'scripts.js'), 200)
  }
  
  return (
    <div className="flex h-screen bg-[#f0f0e4] font-mono">
      {/* Sidebar */}
      <div className="w-[300px] border-r border-black bg-sage-light overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 uppercase">Components</h1>
          
          {/* Search */}
          <div className="relative mb-6">
            <Input 
              type="text"
              placeholder="Search components..."
              className="pl-10 bg-sage border-black rounded-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          
          {/* Projects section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <button 
                className="flex items-center gap-2 text-lg font-bold mb-3"
                onClick={() => toggleProject('all')}
              >
                {expandedProjects.includes('all') ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <span className="uppercase">Projects</span>
              </button>
              
              <button 
                className="text-sm p-1 hover:bg-sage"
                onClick={() => setIsNewProjectDialogOpen(true)}
                title="New Project"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {expandedProjects.includes('all') && (
              <div className="ml-2 space-y-1">
                <button 
                  className={`flex items-center gap-2 py-2 px-3 w-full text-left ${activeFilter === 'all' ? 'bg-terracotta-light text-black' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All Components
                </button>
                
                {projects.map(project => (
                  <div 
                    key={project.id}
                    className="flex items-center justify-between"
                  >
                    <button 
                      className={`flex items-center gap-2 py-2 px-3 flex-1 text-left ${activeFilter === `project:${project.id}` ? 'bg-terracotta-light text-black' : ''}`}
                      onClick={() => setActiveFilter(`project:${project.id}`)}
                    >
                      <span className="flex-1">{project.name}</span>
                      <span className="bg-sage border border-black py-0.5 px-2 text-xs">
                        {components.filter(c => c.project_id === project.id).length}
                      </span>
                    </button>
                    
                    {/* Don't show delete for first/default project */}
                    {project.id !== projects[0]?.id && (
                      <button 
                        className="p-1 text-sm hover:bg-sage mr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        title="Delete Project"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Tags section */}
          <div>
            <button 
              className="flex items-center gap-2 text-lg font-bold mb-3 w-full text-left"
              onClick={() => toggleTag('all')}
            >
              {expandedTags.includes('all') ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span className="uppercase">Tags</span>
            </button>
            
            {expandedTags.includes('all') && (
              <div className="ml-2 space-y-1">
                {tags.map(tag => (
                  <div 
                    key={tag.id}
                    className="flex items-center justify-between"
                  >
                    <button 
                      className={`flex items-center gap-2 py-2 px-3 flex-1 text-left ${activeFilter === `tag:${tag.name}` ? 'bg-terracotta-light text-black' : ''}`}
                      onClick={() => setActiveFilter(`tag:${tag.name}`)}
                    >
                      <Tag size={16} className="mr-1" />
                      <span className="flex-1">{tag.name}</span>
                      <span className="bg-sage border border-black py-0.5 px-2 text-xs">
                        {components.filter(c => 
                          c.tags?.includes(tag.id) || c.tags?.includes(tag.name)
                        ).length}
                      </span>
                    </button>
                    
                    <button 
                      className="p-1 text-sm hover:bg-sage mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTag(tag.id);
                      }}
                      title="Delete Tag"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header with back button and actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <a href="/" className="text-lg">←</a>
              <h1 className="text-2xl font-bold uppercase">Component Sandbox</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePackageDownload}
                className="flex items-center gap-2 border border-black px-4 py-2 h-auto bg-sage hover:bg-terracotta text-black relative overflow-hidden group"
                disabled={selectedComponents.length === 0}
              >
                <Package size={18} />
                <span className="group-hover:opacity-0 group-hover:translate-y-10 transition-all duration-200">
                  Package Selected ({selectedComponents.length})
                </span>
                <span className="absolute opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-10 transition-all duration-200">
                  Download Package
                </span>
              </Button>
              
              <Button
                onClick={() => {
                  setCurrentComponent(null)
                  setIsEditorOpen(true)
                }}
                className="bg-terracotta hover:bg-terracotta-dark text-black border border-black rounded-none flex items-center gap-2 px-4 py-2 h-auto"
              >
                <span className="text-lg mr-1">+</span>
                Add Component
              </Button>
            </div>
          </div>
          
          {/* Components grid */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">
              {activeFilter === 'all' 
                ? 'All Components' 
                : activeFilter.startsWith('project:')
                  ? `Project: ${projects.find(p => p.id === activeFilter.replace('project:', ''))?.name}`
                  : `Tag: ${activeFilter.replace('tag:', '')}`
              }
            </h2>
            
            {filteredComponents.length === 0 ? (
              <div className="text-center py-12 border border-black bg-sage-light">
                <p className="text-lg mb-4">No components found.</p>
                <Button
                  onClick={() => {
                    setCurrentComponent(null)
                    setIsEditorOpen(true)
                  }}
                  className="bg-terracotta hover:bg-terracotta-dark text-black border border-black rounded-none"
                >
                  Create Your First Component
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComponents.map(component => (
                  <div key={component.id} className="border border-black bg-sage-light overflow-hidden">
                    {/* Component header */}
                    <div className="flex items-center justify-between p-3 border-b border-black">
                      <h3 className="font-bold truncate">{component.name}</h3>
                      <div className="flex items-center">
                        <Checkbox 
                          id={`select-${component.id}`}
                          checked={selectedComponents.includes(component.id)}
                          onCheckedChange={() => toggleComponentSelection(component.id)}
                          className="border-black rounded-none mr-3 h-5 w-5"
                        />
                        <button 
                          className="p-1 hover:bg-sage"
                          onClick={() => handleEditComponent(component)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="p-1 hover:bg-sage ml-1"
                          onClick={() => handlePreviewComponent(component)}
                        >
                          <Expand size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Component preview */}
                    <div 
                      className="flex-1 overflow-hidden cursor-pointer relative h-64"
                      onClick={() => handlePreviewComponent(component)}
                      style={{ minHeight: '12rem' }}
                    >
                      <IframeRenderer 
                        html={component.html}
                        css={component.css}
                        js={component.js}
                        height="100%"
                        width="100%"
                      />
                    </div>
                    
                    {/* Component tags */}
                    <div className="p-3 border-t border-black">
                      <div className="flex flex-wrap gap-2">
                        {component.tags?.map(tagId => {
                          const tagObj = tags.find(t => t.id === tagId)
                          return tagObj ? (
                            <button
                              key={tagId}
                              className="text-xs bg-sage border border-black px-2 py-1 hover:bg-terracotta-light"
                              onClick={() => setActiveFilter(`tag:${tagObj.name}`)}
                            >
                              {tagObj.name}
                            </button>
                          ) : null
                        })}
                        
                        {(!component.tags || component.tags.length === 0) && (
                          <span className="text-xs text-gray-500">No tags</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
      
      {/* Component Editor Dialog */}
      {currentComponent && (
        <ComponentEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={(updatedComponent) => {
            if (updatedComponent.id) {
              // Update existing component
              try {
                // Create a clean copy of the component with only the fields we need
                const cleanComponent = {
                  id: updatedComponent.id,
                  name: updatedComponent.name || 'Untitled Component',
                  html: updatedComponent.html || '',
                  css: updatedComponent.css || '',
                  js: updatedComponent.js || '',
                  tags: Array.isArray(updatedComponent.tags) ? updatedComponent.tags : [],
                  project_id: updatedComponent.project_id || (projects.length > 0 ? projects[0].id : undefined)
                };
                
                // Update the component
                updateComponent(cleanComponent.id, cleanComponent)
                  .then(() => {
                    // Force refresh UI
                    setTimeout(() => {
                      const newActiveFilter = activeFilter;
                      setActiveFilter('temp');
                      setTimeout(() => setActiveFilter(newActiveFilter), 10);
                    }, 100);
                  })
                  .catch(error => {
                    console.error("Failed to update component:", error);
                    alert("Failed to update component. Please try again.");
                  });
              } catch (error) {
                console.error("Error preparing component for update:", error);
                alert("Failed to update component. Please try again.");
              }
            } else {
              // Add new component
              try {
                // Create a clean copy of the component with only the fields we need
                const componentToAdd = {
                  name: updatedComponent.name || 'Untitled Component',
                  html: updatedComponent.html || '',
                  css: updatedComponent.css || '',
                  js: updatedComponent.js || '',
                  tags: Array.isArray(updatedComponent.tags) ? updatedComponent.tags : [],
                  project_id: updatedComponent.project_id || (projects.length > 0 ? projects[0].id : undefined)
                };
                
                // Add the component
                addComponent(componentToAdd)
                  .then(() => {
                    // Force refresh UI
                    setTimeout(() => {
                      const newActiveFilter = activeFilter;
                      setActiveFilter('temp');
                      setTimeout(() => setActiveFilter(newActiveFilter), 10);
                    }, 100);
                  })
                  .catch(error => {
                    console.error("Failed to add component:", error);
                    alert("Failed to add component. Please try again.");
                  });
              } catch (error) {
                console.error("Error preparing component for adding:", error);
                alert("Failed to add component. Please try again.");
              }
            }
            setIsEditorOpen(false);
          }}
          component={currentComponent}
        />
      )}
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={(open) => !open && setIsPreviewOpen(false)}>
        <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] p-0 bg-sage-light border-black" onInteractOutside={(e) => e.preventDefault()}>
          <div className="flex flex-col h-full">
            <DialogHeader className="px-4 py-2 border-b border-black flex flex-row items-center justify-between">
              <DialogTitle className="uppercase tracking-wider">
                {previewComponent?.name || 'Component Preview'}
              </DialogTitle>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="h-8 w-8 flex items-center justify-center border border-black"
              >
                ×
              </button>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto bg-white">
              {previewComponent && (
                <div className="w-full h-full p-4">
                  <IframeRenderer 
                    html={previewComponent.html}
                    css={previewComponent.css}
                    js={previewComponent.js}
                    height="100%"
                    width="100%"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* New Project Dialog */}
      <NewProjectDialog 
        isOpen={isNewProjectDialogOpen} 
        onClose={() => setIsNewProjectDialogOpen(false)} 
        onSave={handleCreateProject}
      />
    </div>
  )
} 