'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Package, Download, Tag, Folder, ChevronRight, ChevronDown, Search, X } from 'lucide-react'
import ComponentCard from './ComponentCard'
import ComponentEditor from './ComponentEditor'
import ComponentViewer from './ComponentViewer'
import { testComponents } from '@/lib/test-components'

export interface Component {
  id: string
  name: string
  html: string
  css: string
  js: string
  tags: string[]
  project?: string
}

// Add tags to test components
const enhancedTestComponents = testComponents.map(comp => ({
  ...comp,
  tags: comp.id === 'test-component-1' 
    ? ['navigation', 'header'] 
    : comp.id === 'test-component-2'
      ? ['hero', 'banner']
      : ['interactive', 'counter'],
  project: 'Demo Project'
}));

const ComponentGrid: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([])
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set())
  const [editingComponent, setEditingComponent] = useState<Component | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [viewingComponent, setViewingComponent] = useState<Component | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [packagedFiles, setPackagedFiles] = useState<{html: string, css: string, js: string} | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<{type: 'all' | 'project' | 'tag', value: string}>({type: 'all', value: 'all'})
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['Demo Project']))
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Projects', 'Tags']))

  // Use useEffect to handle client-side only code
  useEffect(() => {
    setIsClient(true)
    setComponents(enhancedTestComponents as Component[])
  }, [])

  // Skip rendering anything that depends on client-side state until after hydration
  if (!isClient) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  const handleAddComponent = () => {
    setEditingComponent(null)
    setIsEditorOpen(true)
  }

  const handleEditComponent = (id: string) => {
    const component = components.find(c => c.id === id)
    if (component) {
      setEditingComponent(component)
      setIsEditorOpen(true)
    }
  }

  const handleMaximizeComponent = (id: string) => {
    const component = components.find(c => c.id === id)
    if (component) {
      setViewingComponent(component)
      setIsViewerOpen(true)
    }
  }

  const handleSaveComponent = (component: {
    id?: string
    name: string
    html: string
    css: string
    js: string
    tags?: string[]
    project?: string
  }) => {
    if (component.id) {
      // Update existing component
      setComponents(components.map(c => 
        c.id === component.id ? { 
          ...component, 
          id: c.id,
          tags: component.tags || c.tags,
          project: component.project || c.project
        } as Component : c
      ))
    } else {
      // Add new component
      const newComponent = {
        ...component,
        id: `component-${Date.now()}`,
        tags: component.tags || [],
        project: component.project || 'Unsorted'
      } as Component
      setComponents([...components, newComponent])
    }
    setIsEditorOpen(false)
  }

  const handleSelectComponent = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedComponents)
    if (selected) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedComponents(newSelected)
  }

  const handleUpdateTags = (id: string, newTags: string[]) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, tags: newTags } : c
    ))
  }

  const handlePackageComponents = () => {
    if (selectedComponents.size === 0) return

    // Create packaged files
    const selectedComponentsList = components.filter(c => selectedComponents.has(c.id))
    
    // Generate HTML file
    let packagedHtml = '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Packaged Components</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n'
    
    // Generate CSS file
    let packagedCss = '/* Packaged Components CSS */\n\n'
    
    // Generate JS file
    let packagedJs = '// Packaged Components JavaScript\n\n'
    
    // Add each component
    selectedComponentsList.forEach((component, index) => {
      // Add component container to HTML
      packagedHtml += `  <!-- Component: ${component.name} -->\n`
      packagedHtml += `  <div class="component component-${index}">\n`
      packagedHtml += `    ${component.html}\n`
      packagedHtml += `  </div>\n\n`
      
      // Add component CSS with namespacing
      packagedCss += `/* Component: ${component.name} */\n`
      packagedCss += `.component-${index} {\n  /* Component container */\n}\n\n`
      packagedCss += `${component.css}\n\n`
      
      // Add component JS with proper scoping
      packagedJs += `/* Component: ${component.name} */\n`
      packagedJs += `(function() {\n  // Component-specific code\n  ${component.js}\n})();\n\n`
    })
    
    // Close HTML tags
    packagedHtml += '</body>\n<script src="script.js"></script>\n</html>'
    
    // Save packaged files for download
    setPackagedFiles({
      html: packagedHtml,
      css: packagedCss,
      js: packagedJs
    })
  }

  // Function to create a download link for packaged files
  const createDownloadLink = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Get unique projects
  const projects = Array.from(new Set(components.map(c => c.project || 'Unsorted'))).sort()
  
  // Get unique tags
  const allTags = Array.from(new Set(components.flatMap(c => c.tags || []))).sort()

  // Toggle project expansion
  const toggleProject = (project: string) => {
    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(project)) {
      newExpanded.delete(project)
    } else {
      newExpanded.add(project)
    }
    setExpandedProjects(newExpanded)
  }

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  // Filter components based on active filter and search term
  const filteredComponents = components.filter(component => {
    // First apply search filter
    const matchesSearch = searchTerm === '' || 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (component.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Then apply category filter
    if (!matchesSearch) return false
    
    if (activeFilter.type === 'all') return true
    if (activeFilter.type === 'project') return component.project === activeFilter.value
    if (activeFilter.type === 'tag') return (component.tags || []).includes(activeFilter.value)
    
    return true
  })

  return (
    <div className="flex h-screen overflow-hidden font-mono">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 h-screen bg-sage-light border-r border-border overflow-hidden`}>
        <div className="p-4">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4">Components</h2>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              className="pl-8 border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[calc(100vh-130px)]">
            <div className="space-y-4">
              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer py-1"
                  onClick={() => toggleCategory('Projects')}
                >
                  <div className="flex items-center">
                    {expandedCategories.has('Projects') ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                    <span className="font-medium uppercase tracking-wider">Projects</span>
                  </div>
                </div>
                
                {expandedCategories.has('Projects') && (
                  <div className="ml-4 mt-1 space-y-1">
                    <div 
                      className={`flex items-center py-1 px-2 cursor-pointer ${activeFilter.type === 'all' && activeFilter.value === 'all' ? 'bg-terracotta text-white' : 'hover:bg-sage'}`}
                      onClick={() => setActiveFilter({type: 'all', value: 'all'})}
                    >
                      <span>All Components</span>
                    </div>
                    
                    {projects.map(project => (
                      <div key={project}>
                        <div 
                          className={`flex items-center justify-between py-1 px-2 cursor-pointer ${activeFilter.type === 'project' && activeFilter.value === project ? 'bg-terracotta text-white' : 'hover:bg-sage'}`}
                          onClick={() => setActiveFilter({type: 'project', value: project})}
                        >
                          <div className="flex items-center">
                            <Folder className="h-4 w-4 mr-2" />
                            <span>{project}</span>
                          </div>
                          <Badge variant="outline" className="text-xs border-border">
                            {components.filter(c => c.project === project).length}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator className="bg-border" />
              
              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer py-1"
                  onClick={() => toggleCategory('Tags')}
                >
                  <div className="flex items-center">
                    {expandedCategories.has('Tags') ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                    <span className="font-medium uppercase tracking-wider">Tags</span>
                  </div>
                </div>
                
                {expandedCategories.has('Tags') && (
                  <div className="ml-4 mt-1 space-y-1">
                    {allTags.map(tag => (
                      <div 
                        key={tag}
                        className={`flex items-center justify-between py-1 px-2 cursor-pointer ${activeFilter.type === 'tag' && activeFilter.value === tag ? 'bg-terracotta text-white' : 'hover:bg-sage'}`}
                        onClick={() => setActiveFilter({type: 'tag', value: tag})}
                      >
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2" />
                          <span>{tag}</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-border">
                          {components.filter(c => (c.tags || []).includes(tag)).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-sage">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-2"
              >
                <ChevronRight className={`h-5 w-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </Button>
              <h1 className="text-2xl font-bold uppercase tracking-wider">Component Sandbox</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePackageComponents}
                disabled={selectedComponents.size === 0}
                className="border-border"
              >
                <Package className="h-4 w-4 mr-2" />
                Package Selected ({selectedComponents.size})
              </Button>
              <Button 
                onClick={handleAddComponent}
                className="bg-terracotta hover:bg-terracotta-dark text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </div>
          </div>
          
          {activeFilter.type !== 'all' && (
            <div className="mb-4 flex items-center">
              <Badge className="mr-2 px-3 py-1 bg-terracotta text-white uppercase">
                {activeFilter.type === 'project' ? 'Project:' : 'Tag:'} {activeFilter.value}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveFilter({type: 'all', value: 'all'})}
              >
                Clear Filter
              </Button>
            </div>
          )}
          
          {packagedFiles && (
            <div className="mb-6 p-4 border border-border bg-sage-light relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2" 
                onClick={() => setPackagedFiles(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium uppercase tracking-wider mb-2">Packaged Files Ready for Download</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => createDownloadLink(packagedFiles.html, 'index.html')} className="border-border">
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML
                </Button>
                <Button variant="outline" size="sm" onClick={() => createDownloadLink(packagedFiles.css, 'styles.css')} className="border-border">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSS
                </Button>
                <Button variant="outline" size="sm" onClick={() => createDownloadLink(packagedFiles.js, 'script.js')} className="border-border">
                  <Download className="h-4 w-4 mr-2" />
                  Download JavaScript
                </Button>
              </div>
            </div>
          )}

          {filteredComponents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No components found. Add some components to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map(component => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onEdit={handleEditComponent}
                  onMaximize={handleMaximizeComponent}
                  onSelect={handleSelectComponent}
                  onUpdateTags={handleUpdateTags}
                  selected={selectedComponents.has(component.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Component Editor Dialog */}
      {isEditorOpen && (
        <ComponentEditor
          component={editingComponent}
          onSave={handleSaveComponent}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Component Viewer Dialog */}
      {isViewerOpen && viewingComponent && (
        <ComponentViewer
          component={viewingComponent}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  )
}

export default ComponentGrid