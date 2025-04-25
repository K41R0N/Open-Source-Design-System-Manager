'use client'

import React, { useRef, useEffect, useState } from 'react'

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

  // Function to sanitize HTML content
  const sanitizeHtml = (html: string): string => {
    // Basic sanitization - in a production app, use a proper sanitizer library
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, 'data-blocked-event=')
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
