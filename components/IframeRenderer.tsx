'use client'

import React, { useRef, useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

interface IframeRendererProps {
  html: string
  css: string
  js: string
  height?: string
  width?: string
}

const IframeRenderer: React.FC<IframeRendererProps> = ({
  html,
  css,
  js,
  height = '300px',
  width = '100%'
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [key, setKey] = useState<number>(0)
  const [isClient, setIsClient] = useState(false)

  // Function to sanitize HTML content using DOMPurify
  const sanitizeHtml = (html: string): string => {
    // Only sanitize on client-side where DOMPurify has access to window
    if (typeof window === 'undefined') return html

    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'button', 'input', 'form', 'label', 'select', 'option',
        'table', 'thead', 'tbody', 'tr', 'td', 'th', 'nav', 'header', 'footer',
        'section', 'article', 'aside', 'main', 'figure', 'figcaption', 'br', 'hr',
        'strong', 'em', 'b', 'i', 'u', 'code', 'pre', 'blockquote', 'svg', 'path',
        'circle', 'rect', 'line', 'polygon', 'polyline', 'g', 'text', 'video', 'audio'
      ],
      ALLOWED_ATTR: [
        'class', 'id', 'style', 'href', 'src', 'alt', 'title', 'width', 'height',
        'target', 'rel', 'type', 'value', 'placeholder', 'name', 'for', 'checked',
        'disabled', 'readonly', 'required', 'aria-*', 'data-*', 'role', 'tabindex',
        'viewBox', 'fill', 'stroke', 'stroke-width', 'd', 'cx', 'cy', 'r', 'x', 'y',
        'x1', 'y1', 'x2', 'y2', 'points', 'transform'
      ],
      ALLOW_DATA_ATTR: true,
      ALLOW_ARIA_ATTR: true,
    })
  }

  // Instead of manipulating the iframe directly, we'll create the full HTML content
  // and set it as the srcdoc attribute, which avoids cross-origin issues
  const generateSrcDoc = () => {
    const safeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
          <base target="_blank">
        </head>
        <body>
          ${sanitizeHtml(html)}
          <script>
            try {
              // Execute the JavaScript code
              ${js}
            } catch (error) {
              document.body.innerHTML += '<div style="color: red; padding: 10px; background: rgba(255,0,0,0.1); margin-top: 10px; border: 1px solid red;">JavaScript Error: ' + error.message + '</div>';
            }
          </script>
        </body>
      </html>
    `
    return safeHtml
  }

  useEffect(() => {
    setIsClient(true)
    // Force re-render iframe when content changes
    setKey(prevKey => prevKey + 1)
  }, [html, css, js])

  // Skip rendering until client-side to avoid hydration issues
  if (!isClient) {
    return <div style={{ height, width, border: '1px solid #ddd', borderRadius: '4px' }}></div>
  }

  return (
    <iframe
      key={key}
      ref={iframeRef}
      srcDoc={generateSrcDoc()}
      style={{ 
        height, 
        width, 
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: 'white'
      }}
      sandbox="allow-scripts"
      title="Component Preview"
    />
  )
}

export default IframeRenderer
