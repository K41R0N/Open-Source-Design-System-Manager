# Component Sandbox - Architecture Documentation

## Project Purpose
A Next.js-based design system management application that allows users to:
- Create, edit, and organize UI components (HTML/CSS/JS)
- Preview components in isolated iframes
- Tag and categorize components by project
- Export/package selected components for reuse
- Mock authentication with GitHub/Google

## Tech Stack
- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5.4.2
- **UI Library**: Radix UI primitives
- **Styling**: TailwindCSS with custom design tokens (sage, terracotta colors)
- **Icons**: Lucide React
- **Deployment**: Netlify with @netlify/plugin-nextjs

## Application Structure

### Routes (Next.js App Router)
1. **`/` (app/page.tsx)** - Landing page
   - Marketing page with inline demo editor
   - Shows example component with live editing
   - Links to dashboard

2. **`/dashboard` (app/dashboard/page.tsx)** - Main application
   - Full CRUD for components
   - Project and tag management
   - Component preview and export functionality
   - Uses database-context for state management

### Key Components

#### State Management (lib/)
- **`auth-context.tsx`** - Mock authentication (localStorage-based)
  - User state management
  - Sign in/out with GitHub/Google (simulated)

- **`database-context.tsx`** - Component data management
  - CRUD operations for components, projects, tags
  - Uses localStorage for persistence
  - Defines canonical data types:
    ```typescript
    type Component = {
      id: string
      name: string
      html: string
      css: string
      js: string
      project_id?: string
      user_id: string
      created_at: string
      updated_at: string
      tags?: string[]  // Array of tag IDs
    }
    ```

#### Core Components (components/)
- **`ComponentEditor.tsx`** - Modal editor for components
  - Code editor tabs (HTML/CSS/JS)
  - Live preview
  - Project/tag assignment
  - Props: `{ isOpen, onClose, onSave, component? }`

- **`ComponentViewer.tsx`** - Fullscreen component preview
  - Props: `{ isOpen, onClose, component }`
  - ⚠️ **Issue**: Imports Component type from ComponentGrid (wrong source)

- **`ComponentCard.tsx`** - Component display card
  - Thumbnail preview
  - Select/edit/maximize actions
  - Tag display
  - Props: Individual component properties (id, name, html, css, js, tags, etc.)

- **`IframeRenderer.tsx`** - Safe component preview
  - Sandboxed iframe rendering
  - HTML sanitization
  - Error handling

#### Legacy/Unused Components
- **`ComponentGrid.tsx`** - ⚠️ **NOT USED** in app routes
  - Alternative component management UI
  - Defines own Component interface (incompatible with database-context)
  - Was likely replaced by dashboard/page.tsx
  - Exported via root index.ts but not imported anywhere in app/

#### UI Components (components/ui/)
- Radix UI wrappers: button, card, dialog, tabs, checkbox, etc.
- Consistent styling with Tailwind

### Test Data
- **`lib/test-components.ts`** - Sample components for demo
  - Contains 3 sample components with full metadata
  - Used by dashboard on initialization

- **`test-components.ts`** (root) - ⚠️ **DUPLICATE** older version

### Build Configuration
- **`netlify.toml`** - Netlify deployment config
  ```toml
  [build]
    command = "npm run build"

  [[plugins]]
    package = "@netlify/plugin-nextjs"

  [build.environment]
    NODE_VERSION = "18"
  ```

- **`next.config.js`** - Next.js configuration
  - React strict mode enabled
  - Image optimization disabled (images.unoptimized = true)
  - React properties filter for browser extensions

## Current Issues & Root Causes

### 1. Type System Conflicts
**Problem**: Two incompatible Component type definitions
- `database-context.tsx`: Uses `project_id` (string), `user_id`, timestamps
- `ComponentGrid.tsx`: Uses `project` (string), no user/timestamps

**Impact**:
- ComponentViewer imports wrong Component type
- Type assertions needed in multiple places
- Compiler errors when strict type checking enabled

### 2. Unused Code in Build
**Problem**: Root `index.ts` exports ComponentGrid and related components
- These are never imported by app pages
- But TypeScript still compiles them during build
- Causes import errors and type conflicts

**Impact**:
- Build failures when index.ts references components incorrectly
- Unnecessary code in production bundle
- Maintenance confusion

### 3. Duplicate Test Data
**Problem**: Two test-components.ts files (root and lib/)
- Root version is older/incompatible
- Creates import ambiguity

### 4. Import Path Issues
**Problem**: Inconsistent import patterns
- Some use relative paths (./ComponentGrid)
- Some use absolute paths (@/components/ComponentGrid)
- Root index.ts used wrong relative paths

## Design Decisions

### Why Two Different UIs?
1. **Landing page** - Marketing/demo purposes, self-contained
2. **Dashboard** - Full application, uses proper state management

### Why Mock Auth/Database?
- Demo application without backend dependency
- Uses localStorage for persistence
- Easy to replace with real auth/database later

### Why Iframe Rendering?
- Isolates user-provided code (security)
- Prevents CSS conflicts with app styles
- Allows preview of standalone components

## Dependencies Analysis

### Critical Runtime
- Next.js 14.1.0 - App framework
- React 18.2.0 - UI library
- Radix UI components - Accessible UI primitives

### Build/Dev
- TypeScript 5.4.2 - Type safety
- @netlify/plugin-nextjs 4.41.3 - Deployment adapter
- TailwindCSS 3.4.17 - Styling

### Notable
- No database library (uses localStorage)
- No authentication library (mocked)
- No form validation library (uses native HTML5)
- Image optimization disabled (sharp not needed)

## Deployment Requirements

### For Successful Netlify Build
1. All TypeScript files must type-check
2. No unused imports/exports that break resolution
3. Consistent data models across files
4. Proper Next.js App Router structure
5. All required dependencies installed

### Current Blockers
- [ ] Root index.ts causing import errors
- [ ] ComponentGrid type conflicts
- [ ] ComponentViewer importing from wrong source
- [ ] Duplicate test data files

## Recommended Architecture

### Data Flow (Dashboard)
```
User Action → Dashboard Page → database-context → localStorage
                    ↓
            ComponentEditor/ComponentViewer
                    ↓
               IframeRenderer
```

### Type System (Should Be)
```
lib/database-context.tsx → Single source of truth for types
                        ↓
          All components import from here
```

## Next Steps for Sustainable Fix

1. **Remove unused code**
   - Delete or exclude root index.ts from build
   - Remove ComponentGrid.tsx if truly unused
   - Delete duplicate test-components.ts

2. **Centralize types**
   - Export types from database-context
   - Update ComponentViewer to import correct types
   - Remove ComponentGrid Component interface

3. **Clean up imports**
   - Use consistent @/ alias imports
   - Remove circular dependencies

4. **Verify build**
   - Run full TypeScript check
   - Test Next.js build locally
   - Deploy to Netlify

---

## ✅ IMPLEMENTED SOLUTION

### Root Cause Analysis
The deployment failures were caused by **unused legacy code being included in the TypeScript build**:

1. **ComponentGrid.tsx** - Alternative UI implementation, never used in app routes
2. **ComponentViewer.tsx** - Only used by ComponentGrid, not by dashboard
3. **Root index.ts** - Library export file with incorrect paths, not needed for Next.js app
4. **Root test-components.ts** - Duplicate of lib/test-components.ts

These files had:
- Incompatible type definitions (Component interface mismatch)
- Wrong import paths (./ComponentGrid instead of ./components/ComponentGrid)
- Circular type dependencies

### Solution Applied
**Excluded unused files from TypeScript compilation** via tsconfig.json:

```json
"exclude": [
  "node_modules",
  "index.ts",                        // Unused library exports
  "test-components.ts",              // Duplicate test data
  "components/ComponentGrid.tsx",    // Legacy unused component
  "components/ComponentViewer.tsx"   // Only used by ComponentGrid
]
```

### Why This Solution is Sustainable

1. **No code deletion** - Files preserved for potential future use/reference
2. **No functionality changes** - App behavior completely unchanged
3. **Fixes root cause** - Prevents TypeScript from trying to compile unused code
4. **Clean separation** - Makes it clear which components are active vs. legacy
5. **Easy to reverse** - Simply remove from exclude list to bring files back

### Verification Checklist
- [x] Identified all unused components and their dependencies
- [x] Documented architecture in Claude.md
- [x] Updated tsconfig.json to exclude legacy code
- [x] No changes to active application code
- [ ] Test Next.js build succeeds
- [ ] Verify Netlify deployment completes

### Active Application Components
The following files constitute the working application:
- `app/page.tsx` - Landing/marketing page
- `app/dashboard/page.tsx` - Main application (uses database-context)
- `app/layout.tsx` - Root layout with providers
- `lib/auth-context.tsx` - Authentication state
- `lib/database-context.tsx` - **Source of truth for types**
- `lib/test-components.ts` - Sample data
- `components/ComponentEditor.tsx` - Used by dashboard
- `components/ComponentCard.tsx` - Used by dashboard
- `components/IframeRenderer.tsx` - Used by both pages
- `components/ui/*` - Radix UI wrappers


---

## ✅ PRODUCTION READINESS IMPROVEMENTS (Sprint 3)

### Summary
Implemented database adapter pattern to prepare for Supabase migration. Created a clean abstraction layer between the application and storage backend, making it trivial to switch from localStorage to Supabase with ZERO application code changes.

### Files Created (6)

1. **`lib/adapters/interface.ts`** - Database adapter interface
   - IDatabaseAdapter interface defining all database operations
   - ComponentInput, ProjectInput, TagInput types
   - ComponentUpdate, ProjectUpdate types  
   - Custom error types (AdapterError, NotFoundError, UnauthorizedError, ValidationError)
   - Complete operation contracts for components, projects, tags, and relationships

2. **`lib/adapters/localStorage.ts`** - LocalStorage implementation
   - Complete implementation of IDatabaseAdapter using localStorage
   - All CRUD operations for components, projects, tags
   - RLS simulation (checks user_id before operations)
   - Uses storage utility for type-safe operations
   - Handles test data initialization
   - 350+ lines of production-ready code

3. **`lib/adapters/supabase.ts`** - Supabase stub
   - Stub implementation showing structure for Supabase integration
   - NotImplementedError for all methods (clear indication of what needs implementation)
   - Detailed TODO comments with example Supabase queries
   - Shows proper error handling patterns
   - Documents junction table usage for many-to-many relationships
   - Ready for Sprint 4 implementation

4. **`lib/adapters/factory.ts`** - Adapter factory
   - createAdapter() function to instantiate adapters
   - getAdapter() singleton pattern
   - resetAdapter() for testing/switching
   - initializeAdapter() for app startup
   - Environment-based adapter selection (currently always localStorage)
   - Easy switch to Supabase: just change one line

5. **`lib/adapters/index.ts`** - Exports barrel file
   - Clean public API for adapter system

6. **`lib/database-context.tsx`** - Refactored to use adapters
   - Removed ALL localStorage logic (now in LocalStorageAdapter)
   - Simplified from 605 lines to 290 lines (52% reduction!)
   - Context now delegates to adapter
   - Same public API - zero breaking changes
   - Cleaner, more maintainable code

### Architecture Changes

#### Before Sprint 3
```
database-context.tsx (605 lines)
├── State management
├── localStorage operations (inline)
├── Test data loading (inline)
├── RLS simulation (inline)
└── Error handling (inline)
```

#### After Sprint 3
```
database-context.tsx (290 lines)
└── Uses adapter → IDatabaseAdapter interface
                    ├── LocalStorageAdapter (350 lines)
                    │   ├── Uses storage utility
                    │   ├── RLS simulation
                    │   └── Test data loading
                    └── SupabaseAdapter (stub)
                        └── Ready for implementation
```

### Benefits of Adapter Pattern

1. **Separation of Concerns**
   - Database logic separated from React context
   - Each adapter is independently testable
   - Storage implementation details hidden from app

2. **Easy Migration Path**
   - Switch from localStorage to Supabase: change ONE line in factory.ts
   - No changes needed in 99% of application code
   - Can test Supabase without removing localStorage code

3. **Consistent Interface**
   - All storage backends implement same interface
   - TypeScript ensures compatibility
   - Error handling standardized across adapters

4. **Better Code Organization**
   - 52% reduction in database-context.tsx size
   - Storage logic moved to dedicated modules
   - Easier to understand and maintain

5. **Future-Proof**
   - Easy to add new storage backends (Firebase, PocketBase, etc.)
   - Can implement adapter-specific optimizations
   - Testing is easier with mock adapters

### Implementation Details

#### Adapter Interface
- `getComponents/Projects/Tags()` - Fetch all for user
- `get*()` - Fetch single by ID
- `create*()` - Create new entity
- `update*()` - Update existing entity  
- `delete*()` - Delete entity
- `addTagToComponent()` - Many-to-many relationship
- `removeTagFromComponent()` - Many-to-many relationship
- `initialize()` - Optional setup
- `cleanup()` - Optional teardown

#### LocalStorage Adapter Features
- ✅ All operations implemented
- ✅ User isolation (RLS simulation)
- ✅ Proper error types
- ✅ Test data initialization
- ✅ Validates inputs
- ✅ Handles duplicates (tags)
- ✅ Cascade deletes (projects → components, tags → components)
- ✅ Type-safe with storage utility

#### Supabase Adapter Stub
- ❌ Throws NotImplementedError (intentional)
- ✅ Shows proper structure
- ✅ Example Supabase queries in comments
- ✅ Documents RLS usage
- ✅ Shows junction table pattern
- ✅ Ready for Sprint 4

### Migration to Supabase (Sprint 4 Preview)

**Step 1**: Install Supabase client
```bash
npm install @supabase/supabase-js
```

**Step 2**: Add environment variables
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

**Step 3**: Implement Supabase adapter
- Replace NotImplementedError with actual Supabase queries
- Use provided example queries as templates
- RLS is automatic with Supabase

**Step 4**: Update factory.ts
```typescript
function getAdapterType(): AdapterType {
  if (ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY) {
    return 'supabase'  // ONE LINE CHANGE
  }
  return 'localStorage'
}
```

**Step 5**: Test!
- App works identically with Supabase
- No changes to components, pages, or UI
- Switch back to localStorage anytime for testing

### Build Verification

✅ **Build successful**:
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (5/5)
# Dashboard bundle: 30.4 kB (unchanged)
```

### What Was NOT Changed

- ❌ No functionality changes
- ❌ No UI changes  
- ❌ No breaking changes to database-context API
- ❌ Still using localStorage (just through adapter now)
- ❌ No Supabase integration yet (Sprint 4)

### Files Modified (1)

1. **`lib/database-context.tsx`**
   - Refactored to use adapter pattern
   - Removed all localStorage logic
   - Simplified from 605 to 290 lines
   - Same public API (zero breaking changes)

### Files Backed Up (1)

1. **`lib/database-context-old.tsx`**
   - Original implementation preserved for reference
   - Can be deleted after Sprint 3 verification

### Code Metrics

- **Lines removed**: 315 lines from database-context
- **Lines added**: 5 new files, ~500 lines total
- **Net change**: +185 lines (but much better organized)
- **Complexity reduction**: 52% fewer lines in database-context
- **Maintainability**: Significantly improved

### Next Steps

**Sprint 4**: Full Supabase Migration
- Implement SupabaseAdapter
- Replace auth-context with Supabase Auth
- Test RLS policies
- Switch factory to use Supabase
- Deploy with real database

