'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Settings, Play, Save } from 'lucide-react'
import IframeRenderer from './IframeRenderer'
import { useDatabase } from '@/lib/database-context'

interface ComponentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (component: any) => void;
  component?: {
    id?: string;
    name: string;
    html: string;
    css: string;
    js: string;
    tags?: string[];
    project?: string;
    project_id?: string;
  };
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  component = {
    name: '',
    html: '',
    css: '',
    js: '',
    tags: [],
    project: 'Demo Project'
  }
}) => {
  const { projects, tags, addTag } = useDatabase()
  const [name, setName] = useState(component.name)
  const [html, setHtml] = useState(component.html)
  const [css, setCss] = useState(component.css)
  const [js, setJs] = useState(component.js)
  const [selectedProject, setSelectedProject] = useState(component.project_id || projects[0]?.id || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(component.tags || [])
  const [newTagName, setNewTagName] = useState('')
  const [isMetadataOpen, setIsMetadataOpen] = useState(false)
  
  // Update editor state when component prop changes
  useEffect(() => {
    if (component) {
      setName(component.name)
      setHtml(component.html)
      setCss(component.css)
      setJs(component.js)
      setSelectedProject(component.project_id || projects[0]?.id || '')
      setSelectedTags(component.tags || [])
    }
  }, [component, projects])
  
  // Handle adding a new tag
  const handleAddTag = async () => {
    if (!newTagName.trim()) return

    try {
      // Check if tag already exists
      const existingTag = tags.find(tag => tag.name.toLowerCase() === newTagName.toLowerCase())
      
      if (existingTag) {
        // Use existing tag if it exists
        if (!selectedTags.includes(existingTag.id)) {
          setSelectedTags([...selectedTags, existingTag.id])
        }
      } else {
        // Create new tag if it doesn't exist
        const newTag = await addTag({ name: newTagName.trim() })
        setSelectedTags([...selectedTags, newTag.id])
      }
      
      setNewTagName('')
    } catch (error) {
      console.error("Error adding tag:", error)
    }
  }
  
  // Handle removing a tag
  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId))
  }
  
  // Handle selecting a suggested tag
  const handleSelectSuggestedTag = async (tagName: string) => {
    // Check if tag already exists
    let tagId = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase())?.id
    
    // If tag doesn't exist, create it
    if (!tagId) {
      try {
        const newTag = await addTag({ name: tagName })
        tagId = newTag.id
      } catch (error) {
        console.error("Error creating suggested tag:", error)
        return
      }
    }
    
    // Add tag to selected tags if not already there
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId])
    }
  }
  
  const handleSave = () => {
    // Always ensure project_id is set to a valid project
    const finalProjectId = selectedProject || projects[0]?.id || '';
    
    onSave({
      ...component,
      name,
      html,
      css,
      js,
      tags: selectedTags,
      project_id: finalProjectId
    })
  }
  
  const handleClose = () => {
    setIsMetadataOpen(false); // Close metadata panel when editor is closed
    onClose();
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] p-0 bg-sage-light border-border" onInteractOutside={(e) => e.preventDefault()}>
        <div className="flex flex-col h-full">
          <DialogHeader className="px-4 py-2 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <DialogTitle className="uppercase tracking-wider">Edit Component</DialogTitle>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-sage border border-border px-2 py-1 ml-4"
                placeholder="Component Name"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="border-border flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Metadata
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute right-0 top-12 z-10 w-80 bg-sage-light border border-border shadow-md p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 uppercase text-sm tracking-wider">Project</label>
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-full bg-sage border border-border p-2"
                      >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 uppercase text-sm tracking-wider">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          className="flex-1 bg-sage border border-border p-2"
                          placeholder="Add tag..."
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button 
                          onClick={handleAddTag}
                          className="border border-border bg-sage-light hover:bg-sage"
                        >
                          +
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedTags.map(tagId => {
                          const tagObj = tags.find(t => t.id === tagId)
                          return tagObj ? (
                            <div key={tagId} className="flex items-center bg-sage border border-border px-2 py-1">
                              <span className="mr-2">{tagObj.name}</span>
                              <button 
                                onClick={() => handleRemoveTag(tagId)}
                                className="text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ) : null
                        })}
                      </div>
                      
                      <div className="text-sm mb-2">Suggested:</div>
                      <div className="flex flex-wrap gap-2">
                        {['navigation', 'header', 'hero', 'banner', 'interactive', 'counter'].map(tagName => {
                          // Check if tag is already selected
                          const tagObj = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase())
                          const isSelected = tagObj ? selectedTags.includes(tagObj.id) : false
                          
                          return (
                            <button
                              key={tagName}
                              onClick={() => handleSelectSuggestedTag(tagName)}
                              className={`text-sm ${isSelected ? 'bg-terracotta-light' : 'bg-sage-light'} border border-border px-2 py-1 hover:bg-sage`}
                            >
                              {tagName}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Button 
                variant="outline" 
                className="border-border flex items-center gap-1"
                onClick={() => {}}
              >
                <Play className="h-4 w-4" />
                Preview
              </Button>
              
              <Button 
                onClick={handleSave}
                className="bg-terracotta hover:bg-terracotta-dark text-black border border-border"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <DialogClose asChild>
                <button className="h-8 w-8 flex items-center justify-center border border-border">
                  ×
                </button>
              </DialogClose>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 p-4 flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              <Tabs defaultValue="html" className="flex flex-col h-full">
                <TabsList className="bg-sage border-border border-t border-l border-r">
                  <TabsTrigger value="html" className="uppercase">HTML</TabsTrigger>
                  <TabsTrigger value="css" className="uppercase">CSS</TabsTrigger>
                  <TabsTrigger value="javascript" className="uppercase">JavaScript</TabsTrigger>
                </TabsList>
                <TabsContent value="html" className="flex-1 border border-border p-0 h-full">
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm bg-sage-light resize-none focus:outline-none"
                  />
                </TabsContent>
                <TabsContent value="css" className="flex-1 border border-border p-0 h-full">
                  <textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm bg-sage-light resize-none focus:outline-none"
                  />
                </TabsContent>
                <TabsContent value="javascript" className="flex-1 border border-border p-0 h-full">
                  <textarea
                    value={js}
                    onChange={(e) => setJs(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm bg-sage-light resize-none focus:outline-none"
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex flex-col h-full">
              <div className="uppercase tracking-wider bg-sage border-border border-t border-l border-r px-4 py-2">
                PREVIEW
              </div>
              <div className="flex-1 border border-border overflow-hidden relative">
                <div className="w-full h-full">
                  <IframeRenderer 
                    html={html}
                    css={css}
                    js={js}
                    height="100%"
                    width="100%"
                  />
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button className="h-6 w-6 flex items-center justify-center border border-border bg-sage-light">
                    ▲
                  </button>
                  <button className="h-6 w-6 flex items-center justify-center border border-border bg-sage-light">
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ComponentEditor;
