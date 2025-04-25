'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import IframeRenderer from '@/components/IframeRenderer'

export default function LandingPage() {
  // Sample navigation component for the preview
  const [sampleComponent, setSampleComponent] = useState({
    name: 'Navigation Bar',
    html: `<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="mobile-toggle">≡</button>
</nav>`,
    css: `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #333;
  color: white;
}
.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links a {
  color: white;
  text-decoration: none;
}
.mobile-toggle {
  display: none;
}
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
}`,
    js: '',
    tags: ['navigation', 'responsive'],
  })

  // Inline editor state
  const [html, setHtml] = useState(sampleComponent.html)
  const [css, setCss] = useState(sampleComponent.css)
  const [js, setJs] = useState(sampleComponent.js)

  const handleSave = () => {
    setSampleComponent({
      ...sampleComponent,
      html,
      css,
      js
    })
    // In a real app, this would save to a database
    alert('Component saved! In a real app, this would be stored in your library.')
  }

  return (
    <div className="min-h-screen bg-sage font-mono">
      {/* Hero Section */}
      <section className="container mx-auto px-6 sm:px-8 py-12 relative vertical-lines">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left side - Text content */}
          <div className="lg:col-span-4 pt-8 order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-none">
              Build once.
              <br />
              Use forever.
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl leading-relaxed">
              A sandbox for your most interesting, creative, and useful components.
              Store them, tag them, reuse them—anywhere.
            </p>
            <Button 
              onClick={() => {
                // Navigate to the dashboard page
                window.location.href = '/dashboard';
              }}
              className="w-full sm:w-auto bg-terracotta hover:bg-terracotta-dark text-black rounded-none border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-6 py-6 h-auto text-lg"
            >
              Start Sandboxing
            </Button>
          </div>

          {/* Right side - Inline Component Editor */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-sage-light h-[500px] sm:h-[550px] md:h-[600px] w-full overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="px-4 py-2 border-b border-black flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 mb-2 sm:mb-0">
                    <h2 className="uppercase tracking-wider font-bold">Edit Component</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <p className="text-sm font-semibold">Sign Up to Start Storing your components</p>
                    <Button 
                      onClick={() => {
                        // Navigate to the dashboard page
                        window.location.href = '/dashboard';
                      }}
                      className="bg-terracotta hover:bg-terracotta-dark text-black border border-black h-9 px-4"
                    >
                      Save
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 flex-1 overflow-hidden">
                  <div className="flex flex-col h-64 md:h-full">
                    <Tabs defaultValue="html" className="flex flex-col h-full">
                      <TabsList className="bg-sage border-black border-t border-l border-r">
                        <TabsTrigger value="html" className="uppercase">HTML</TabsTrigger>
                        <TabsTrigger value="css" className="uppercase">CSS</TabsTrigger>
                        <TabsTrigger value="javascript" className="uppercase">JavaScript</TabsTrigger>
                      </TabsList>
                      <TabsContent value="html" className="flex-1 border border-black p-0 h-full">
                        <textarea
                          value={html}
                          onChange={(e) => setHtml(e.target.value)}
                          className="w-full h-full p-4 font-mono text-sm bg-sage-light resize-none focus:outline-none"
                        />
                      </TabsContent>
                      <TabsContent value="css" className="flex-1 border border-black p-0 h-full">
                        <textarea
                          value={css}
                          onChange={(e) => setCss(e.target.value)}
                          className="w-full h-full p-4 font-mono text-sm bg-sage-light resize-none focus:outline-none"
                        />
                      </TabsContent>
                      <TabsContent value="javascript" className="flex-1 border border-black p-0 h-full">
                        <textarea
                          value={js}
                          onChange={(e) => setJs(e.target.value)}
                          className="w-full h-full p-4 font-mono text-sm bg-sage-light resize-none focus:outline-none"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="flex flex-col h-64 md:h-full">
                    <div className="uppercase tracking-wider bg-sage border-black border-t border-l border-r px-4 py-2">
                      PREVIEW
                    </div>
                    <div className="flex-1 border border-black overflow-hidden relative">
                      <div className="w-full h-full">
                        {/* Simple preview renderer */}
                        <div 
                          className="w-full h-full flex items-center justify-center bg-white"
                          dangerouslySetInnerHTML={{ 
                            __html: `
                              <style>${css}</style>
                              ${html}
                            `
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 sm:px-8 py-16 sm:py-24 border-t border-black vertical-lines-light">
        <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-12 tracking-widest uppercase">HOW IT WORKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h3 className="flex items-baseline gap-2 text-xl font-bold mb-4">
              <span className="text-terracotta">1</span>
              Drop Your Code
            </h3>
            <p className="leading-relaxed">Upload or paste your reusable components into the sandbox.</p>
          </div>
          <div>
            <h3 className="flex items-baseline gap-2 text-xl font-bold mb-4">
              <span className="text-terracotta">2</span>
              Tag and Organize
            </h3>
            <p className="leading-relaxed">Sort by project or function, add tags like hero, interactive, forms, auth.</p>
          </div>
          <div>
            <h3 className="flex items-baseline gap-2 text-xl font-bold mb-4">
              <span className="text-terracotta">3</span>
              Export Your Build
            </h3>
            <p className="leading-relaxed">Select what you need. Export as a single code package, ready for your next project.</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-6 sm:px-8 py-16 sm:py-24 border-t border-black">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Your design system — but cooler.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="p-4 sm:p-6 bg-sage-light rounded-none border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Internal Component Library</h3>
            <p className="leading-relaxed">Finally a space to keep all your reusage code. No more digging through old repos.</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-sage-light rounded-none border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Design-to-Dev Handoff</h3>
            <p className="leading-relaxed">Designers mock it, Devs sandbox it, keep things modular, clean, and consistent.</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-sage-light rounded-none border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Playground for Weird Ideas</h3>
            <p className="leading-relaxed">Experimental layouts? CSS Art? Keep the chaos. Ship the good stuff later.</p>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 sm:px-8 py-16 sm:py-24 border-t border-black vertical-lines-light">
        <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-12 tracking-widest uppercase">WHY DEVELOPERS LOVE IT</h2>
        <div className="space-y-6 sm:space-y-8 max-w-2xl">
          <blockquote className="text-lg sm:text-xl font-mono">" This is like Notion for code components. "</blockquote>
          <blockquote className="text-lg sm:text-xl font-mono">" I finally stopped rewriting my nav bar for the i/th time. "</blockquote>
          <blockquote className="text-lg sm:text-xl font-mono">" Looks sick, Works even better. "</blockquote>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-black text-white py-16 sm:py-24 border-t border-black">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center md:text-left">Ready to stop reinventing the button?</h2>
            <Button 
              onClick={() => {
                // Navigate to the dashboard page
                window.location.href = '/dashboard';
              }}
              className="w-full md:w-auto bg-terracotta hover:bg-terracotta-dark text-black rounded-none border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-4 sm:px-6 py-4 sm:py-6 h-auto text-base sm:text-lg flex items-center justify-center md:justify-start gap-2"
            >
              Start Sandboxing
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
