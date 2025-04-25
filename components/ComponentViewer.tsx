'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import IframeRenderer from './IframeRenderer'
import { Component } from './ComponentGrid'
import { Badge } from '@/components/ui/badge'
import { Tag as TagIcon, Folder } from 'lucide-react'

interface ComponentViewerProps {
  isOpen: boolean
  onClose: () => void
  component: Component
}

const ComponentViewer: React.FC<ComponentViewerProps> = ({
  isOpen,
  onClose,
  component
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] w-[1000px] h-[80vh] flex flex-col bg-background/90 backdrop-blur-md">
        <DialogHeader>
          <div className="flex flex-col gap-2">
            <DialogTitle>{component.name}</DialogTitle>
            <div className="flex flex-wrap gap-1 mt-1">
              {component.project && (
                <Badge variant="outline" className="text-xs bg-primary/10 flex items-center gap-1">
                  <Folder className="h-3 w-3" />
                  {component.project}
                </Badge>
              )}
              {component.tags && component.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                  <TagIcon className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden p-4 bg-background/50 rounded-md">
          <IframeRenderer
            html={component.html}
            css={component.css}
            js={component.js}
            height="100%"
            width="100%"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ComponentViewer
