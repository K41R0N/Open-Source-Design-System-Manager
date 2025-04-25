'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Maximize2, Code, Save, Tag as TagIcon, Plus, X } from 'lucide-react'
import IframeRenderer from './IframeRenderer'

interface ComponentCardProps {
  id: string
  name: string
  html: string
  css: string
  js: string
  tags?: string[]
  project?: string
  onSelect: (id: string, selected: boolean) => void
  onEdit: (id: string) => void
  onMaximize: (id: string) => void
  onUpdateTags?: (id: string, tags: string[]) => void
  selected: boolean
  allTags?: string[]
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  id,
  name,
  html,
  css,
  js,
  tags = [],
  project,
  onSelect,
  onEdit,
  onMaximize,
  onUpdateTags,
  selected,
  allTags = []
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag) && onUpdateTags) {
      onUpdateTags(id, [...tags, newTag]);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (onUpdateTags) {
      onUpdateTags(id, tags.filter(tag => tag !== tagToRemove));
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col bg-sage-light border-border">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`select-${id}`} 
            checked={selected}
            onCheckedChange={(checked) => onSelect(id, !!checked)}
            className="border-border"
          />
          <CardTitle className="text-sm font-medium uppercase">{name}</CardTitle>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onMaximize(id)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <div className="w-full h-[200px] overflow-hidden border border-border">
          <IframeRenderer 
            html={html} 
            css={css} 
            js={js} 
            height="100%" 
            width="100%" 
          />
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex flex-col gap-2 w-full">
        <div className="flex flex-wrap gap-1 w-full">
          {project && (
            <Badge variant="outline" className="text-xs border-border uppercase">
              {project}
            </Badge>
          )}
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1 group bg-sage border-border">
              <TagIcon className="h-3 w-3" />
              {tag}
              {onUpdateTags && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-3 w-3 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag);
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              )}
            </Badge>
          ))}
          
          {onUpdateTags && !isAddingTag && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-5 w-5 border-border" 
              onClick={() => setIsAddingTag(true)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {isAddingTag && (
          <div className="flex items-center gap-1 w-full">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              className="h-7 text-xs border-border"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              autoFocus
            />
            <Button size="sm" className="h-7 px-2 bg-terracotta hover:bg-terracotta-dark text-white" onClick={handleAddTag}>
              <Plus className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2" 
              onClick={() => {
                setNewTag('');
                setIsAddingTag(false);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {isAddingTag && allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {allTags
              .filter(tag => !tags.includes(tag))
              .slice(0, 5)
              .map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-sage border-border"
                  onClick={() => {
                    if (onUpdateTags) {
                      onUpdateTags(id, [...tags, tag]);
                      setIsAddingTag(false);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default ComponentCard
