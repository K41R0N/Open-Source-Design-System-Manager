# Figaro

**Build once. Use forever.**

Figaro is a modern design system manager and component library built for developers who are tired of rebuilding the same components over and over. Store, organize, and reuse your best work—anywhere.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)

## Features

### 🎨 Component Management
- **Create & Edit**: Live editor with HTML, CSS, and JavaScript support
- **Live Preview**: See your components in action as you build
- **Tag System**: Organize with custom tags (navigation, forms, hero, etc.)
- **Project Organization**: Group components by project for easy management
- **Export Ready**: Copy component code instantly

### 🔒 Security First
- **Row Level Security (RLS)**: Supabase-powered data isolation
- **XSS Protection**: DOMPurify sanitization for all user content
- **OAuth Authentication**: GitHub and Google sign-in support
- **CSP Headers**: Content Security Policy for defense in depth

### ⚡ Performance Optimized
- **Pagination**: Handle thousands of components efficiently (20 items per page)
- **Memoization**: Optimized React rendering with useMemo
- **GIN Indexes**: Fast tag-based searching in PostgreSQL
- **Code Splitting**: Optimized bundle sizes (29.2 KB dashboard)

### 🎯 Developer Experience
- **100% TypeScript**: Fully typed codebase for better DX
- **Toast Notifications**: Non-blocking user feedback
- **Error Boundaries**: Graceful error handling
- **Dual Storage**: LocalStorage for dev, Supabase for production
- **Environment-Based Switching**: Automatic adapter selection

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) Supabase account for production deployment

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/figaro.git
   cd figaro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   For local development, use test data mode:
   ```env
   NEXT_PUBLIC_USE_TEST_DATA=true
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Architecture

Figaro uses a modern, scalable architecture:

```
┌─────────────────────────────────────────────┐
│           Next.js 14 (App Router)           │
├─────────────────────────────────────────────┤
│  React 18 + TypeScript + Tailwind CSS      │
├─────────────────────────────────────────────┤
│           Adapter Pattern Layer             │
│  ┌───────────────┐    ┌─────────────────┐  │
│  │  LocalStorage │ OR │ Supabase (Prod) │  │
│  │  (Dev Mode)   │    │   + OAuth       │  │
│  └───────────────┘    └─────────────────┘  │
└─────────────────────────────────────────────┘
```

### Key Design Patterns

- **Adapter Pattern**: Seamless switching between localStorage and Supabase
- **Singleton Pattern**: Single adapter instance for optimal performance
- **Row Level Security**: User-scoped data access at the database level
- **Type Safety**: Strongly typed throughout with TypeScript
- **Component-Based**: Modular, reusable React components

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **DOMPurify** - XSS sanitization

### Backend & Database
- **Supabase** - PostgreSQL database with RLS
- **Auth** - OAuth (GitHub, Google) via Supabase
- **Storage Adapters** - Dual-mode (localStorage/Supabase)

### Development Tools
- **ESLint** - Code linting
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

---

## Project Structure

```
figaro/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Main app dashboard
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # UI primitives (Radix)
│   ├── ComponentEditor.tsx       # Live code editor
│   ├── IframeRenderer.tsx        # Sandboxed preview
│   └── ErrorBoundary.tsx         # Error handling
├── lib/                          # Core libraries
│   ├── adapters/                 # Database adapters
│   │   ├── interface.ts          # Adapter contract
│   │   ├── localStorage.ts       # Dev storage
│   │   ├── supabase.ts           # Production storage
│   │   └── factory.ts            # Adapter selector
│   ├── auth-context.tsx          # Authentication
│   ├── database-context.tsx      # Data management
│   ├── toast-context.tsx         # Notifications
│   ├── supabase-client.ts        # Supabase config
│   ├── types.ts                  # Type definitions
│   ├── constants.ts              # App constants
│   └── storage.ts                # Storage utilities
├── supabase/                     # Database migrations
│   └── migrations/
│       └── 20250102_initial_schema.sql
├── DEPLOYMENT.md                 # Deployment guide
├── SPRINTS_SUMMARY.md            # Development history
└── README.md                     # You are here
```

---

## Configuration

### Environment Variables

Figaro uses environment variables for configuration. See `.env.example` for all options.

#### Development Mode (Test Data)
```env
NEXT_PUBLIC_USE_TEST_DATA=true
```
- Uses localStorage
- Mock authentication (user-1)
- Pre-loaded demo components
- Perfect for local development

#### Production Mode (Supabase)
```env
NEXT_PUBLIC_USE_TEST_DATA=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
- Uses Supabase PostgreSQL
- Real OAuth authentication
- Persistent data across devices
- Required for production deployment

---

## Deployment

### Option 1: Netlify (Recommended)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for comprehensive step-by-step instructions.

**Quick overview:**
1. Create Supabase project
2. Run database migration
3. Configure OAuth providers
4. Set Netlify environment variables
5. Deploy!

### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Option 3: Self-Hosted

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Database Schema

Figaro uses PostgreSQL with Row Level Security:

### Tables
- **components** - User components (HTML, CSS, JS, tags)
- **projects** - Project organization
- **tags** - Component categorization

### Security
- RLS enabled on all tables
- Users can only access their own data
- OAuth authentication required
- UUID-based primary keys

### Indexes
- User ID indexes for fast filtering
- GIN indexes for array-based tag searching
- Unique indexes for data integrity
- Timestamp indexes for sorting

See `supabase/migrations/20250102_initial_schema.sql` for full schema.

---

## API Documentation

Figaro uses a context-based API powered by React hooks.

### useDatabase()

Manage components, projects, and tags:

```typescript
import { useDatabase } from '@/lib/database-context'

function MyComponent() {
  const {
    components,
    addComponent,
    updateComponent,
    deleteComponent,
    projects,
    tags
  } = useDatabase()

  // Create a component
  const handleCreate = async () => {
    await addComponent({
      name: 'My Button',
      html: '<button>Click me</button>',
      css: 'button { background: blue; }',
      js: '',
      tags: ['buttons', 'ui']
    })
  }
}
```

### useAuth()

Handle authentication:

```typescript
import { useAuth } from '@/lib/auth-context'

function AuthButton() {
  const { user, isAuthenticated, signIn, signOut } = useAuth()

  if (isAuthenticated) {
    return <button onClick={signOut}>Sign Out</button>
  }

  return <button onClick={() => signIn('github')}>Sign In</button>
}
```

### useToast()

Show notifications:

```typescript
import { useToast } from '@/lib/toast-context'

function SaveButton() {
  const toast = useToast()

  const handleSave = () => {
    toast.success('Component saved!')
    // or
    toast.error('Save failed')
    toast.warning('Name already exists')
    toast.info('Processing...')
  }
}
```

---

## Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and build**
   ```bash
   npm run build
   ```
5. **Commit with clear message**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- ✅ Use TypeScript for all new code
- ✅ Follow existing code style
- ✅ Add comments for complex logic
- ✅ Test in both dev and production modes
- ✅ Update documentation as needed

---

## Troubleshooting

### Build Errors

**Problem**: TypeScript errors during build
```bash
npm run build
```
**Solution**: Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

**Problem**: Can't sign in with OAuth
**Solution**: Check:
1. Supabase OAuth is configured
2. Redirect URLs are correct
3. Environment variables are set
4. `NEXT_PUBLIC_USE_TEST_DATA=false` in production

### Database Connection

**Problem**: "Supabase not configured" error
**Solution**: Verify environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### Missing Components

**Problem**: Components not showing after creation
**Solution**:
- In dev mode: Check browser console
- In prod mode: Verify RLS policies in Supabase
- Check user is authenticated

---

## Performance

Figaro is optimized for scale:

- ⚡ **Dashboard bundle**: 29.2 KB (optimized)
- ⚡ **First Load JS**: 183 KB (gzipped)
- ⚡ **Pagination**: 20 items per page (configurable)
- ⚡ **Memoization**: useMemo for expensive calculations
- ⚡ **Lazy Loading**: Components load on demand

---

## Security

Security is a top priority:

- 🔒 **XSS Protection**: DOMPurify sanitizes all user HTML
- 🔒 **CSP Headers**: Content Security Policy configured
- 🔒 **RLS Policies**: Database-level access control
- 🔒 **OAuth Only**: No password storage
- 🔒 **HTTPS Only**: All production traffic encrypted
- 🔒 **Environment Isolation**: Separate dev/prod configs

---

## Roadmap

### v1.1 (Q2 2025)
- [ ] Component versioning
- [ ] Bulk export (zip download)
- [ ] Component search by content
- [ ] Collaborative editing

### v1.2 (Q3 2025)
- [ ] Component marketplace
- [ ] Team workspaces
- [ ] API access for programmatic usage
- [ ] Component templates library

### v2.0 (Q4 2025)
- [ ] React/Vue/Svelte component parsing
- [ ] AI-powered component suggestions
- [ ] Design system documentation generator
- [ ] Figma plugin integration

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **GitHub Issues**: Report bugs or request features
- **Email**: support@figaro.app (coming soon)

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Figaro** - Stop reinventing the button. Start building better. 🎭
