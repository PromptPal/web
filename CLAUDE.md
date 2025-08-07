# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PromptPal Web Application

## Project Overview

PromptPal is a comprehensive prompt management platform designed for AI projects. The web frontend is built with modern React technologies and provides a centralized interface for managing prompts, projects, and AI providers. This is a Web3-enabled application that uses MetaMask for authentication.

## Technology Stack

### Core Technologies
- **React 19** - Latest React with StrictMode
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe routing with file-based routing
- **Apollo Client** - GraphQL client for API communication
- **GraphQL Code Generator** - Automatic type generation from GraphQL schema

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Mantine UI** - React components library (dark theme forced)
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **@annatarhe/lake-ui** - Custom UI component library

### State Management & Data Fetching
- **Apollo Client** - GraphQL state management and caching
- **TanStack Query** - Additional data fetching and caching
- **Jotai** - Atomic state management
- **React Hook Form** - Form state management with Zod validation

### Web3 & Authentication
- **MetaMask SDK** - Web3 wallet integration
- **Web3.js** - Blockchain interactions
- **JWT-based authentication** - Token-based auth system

### Development Tools
- **ESLint** - Code linting with TypeScript and React plugins
- **Lefthook** - Git hooks for pre-commit linting
- **Storybook** - Component development and testing
- **PNPM** - Package manager

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/         # Button variants and loading states
│   ├── Calls/          # API call metrics and monitoring
│   ├── Header/         # Navigation and project selection
│   ├── Project/        # Project-specific components
│   ├── Prompt/         # Prompt management components
│   ├── Providers/      # AI provider configuration
│   └── layout/         # Layout components
├── pages/              # Page components (route-based)
│   ├── auth/           # Authentication pages
│   ├── landing/        # Landing page
│   ├── projects/       # Project management
│   ├── prompts/        # Prompt management
│   └── providers/      # Provider configuration
├── routes/             # TanStack Router route definitions
├── gql/                # Generated GraphQL types and queries
├── service/            # API services and configuration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Key Architecture Patterns

### 1. File-Based Routing
Uses TanStack Router with file-based routing:
- Routes defined in `src/routes/` directory
- Lazy loading for code splitting
- Type-safe route parameters and search params

### 2. GraphQL Integration
- schema is in `../server/schema/**/*.gql`
- Schema-first approach with code generation
- Queries and mutations co-located with components
- Apollo Client with error handling and caching
- Persisted document queries for optimization

### 3. Component Architecture
- **Compound Components**: Complex components broken into smaller, composable parts
- **Container/Presentation**: Logic separated from presentation
- **Custom Hooks**: Reusable logic extraction
- **TypeScript**: Strict typing throughout

### 4. State Management Strategy
- **Apollo Client**: GraphQL data and cache
- **Jotai**: Local component state and global atoms
- **React Hook Form**: Form state with validation
- **TanStack Query**: Additional REST API calls

## Development Workflow

### Available Scripts
```bash
# Development
pnpm dev                 # Start dev server on http://localhost:5173
pnpm build              # Production build with base path /public
pnpm build:cf           # Cloudflare build without base path
pnpm preview            # Preview production build

# Code Quality
pnpm lint               # Run ESLint on src/ directory (auto-fix enabled)
pnpm g                  # Generate GraphQL types from schema

# Testing
pnpm test               # Run tests in watch mode with Vitest
pnpm test:ui            # Open Vitest UI interface
pnpm test:run           # Run tests once (CI mode)
pnpm test:cov           # Run tests with coverage report

# Storybook
pnpm storybook          # Start Storybook dev server on port 6006
pnpm build-storybook    # Build Storybook for production
pnpm test:storybook     # Run Storybook tests
```

### Testing Configuration
- **Framework**: Vitest with happy-dom environment
- **Test Files**: `src/**/*.{test,spec}.{js,ts,jsx,tsx}`
- **Setup File**: `src/test/setup.ts`
- **Coverage**: V8 provider with HTML, JSON, and text reporters
- **Globals**: Test globals are enabled
- **Path Alias**: `@` maps to `src/` directory

### Environment Configuration
- **Development**: API calls to `http://localhost:7788`
- **Production**: Static files served from backend server
- **GraphQL endpoint**: `/api/v2/graphql`
- **REST API prefix**: `/api/v1`
- **Environment variable**: `VITE_HTTP_ENDPOINT` for custom API endpoints

### Git Hooks (Lefthook)
Pre-commit hooks automatically run ESLint with auto-fix on staged files:
- Files matched: `*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}`
- Auto-fixes are applied and re-staged

## Key Features & Modules

### 1. Project Management
- Create and manage AI projects
- Project-level configuration (OpenAI settings, providers)
- Project switching and selection
- Metrics and analytics

### 2. Prompt Management
- Create, edit, and version prompts
- Support for multiple prompt roles (system, user, assistant)
- Variable templating system
- Prompt testing and preview
- Usage analytics and metrics

### 3. Provider Management
- Configure AI providers (OpenAI, Gemini, custom endpoints)
- Provider-specific settings and headers
- Model parameter configuration
- Provider switching per project

### 4. Authentication & Security
- MetaMask-based Web3 authentication
- JWT token management
- User profile management
- Role-based access control

### 5. Analytics & Monitoring
- Real-time prompt usage metrics
- Performance monitoring (p50, p90, p99)
- Cost tracking and analysis
- Usage history and trends

## Code Style & Conventions

### Commit Rules
You must follow the Conventional Commits rules, ensuring that the scope and module are included.

For example:
```md
fix(home): add price link on home page
feat(ai): add AI module
refactor(cell): update cell module for better maintenance
perf(parser): improve parser performance by over 30%
```

### ESLint Configuration
- TypeScript strict rules
- React best practices
- Stylistic preferences (no semicolons, single quotes for JSX)
- Auto-fix on commit via Lefthook

### Component Patterns
```typescript
// Typical component structure
import { useQuery } from '@apollo/client'
import { graphql } from '../../gql'

const QUERY = graphql(`
  query ExampleQuery($id: Int!) {
    example(id: $id) {
      id
      name
    }
  }
`)

function ExampleComponent({ id }: { id: number }) {
  const { data, loading } = useQuery(QUERY, { variables: { id } })
  
  if (loading) return <LoadingState />
  
  return <div>{data?.example?.name}</div>
}
```

### File Naming
- Components: PascalCase (e.g., `ProjectCard.tsx`)
- Pages: kebab-case with `.page.tsx` suffix
- Hooks: camelCase starting with `use`
- Utils: camelCase

## API Integration

### GraphQL Configuration
- **Schema location**: `../PromptPal/schema/schema.gql` (relative to web directory)
- **Generated types**: `src/gql/` directory (auto-generated, do not edit)
- **Code generation config**: `codegen.ts`
- **Persisted queries**: Enabled for production optimization
- **Document sources**: All `*.ts` and `*.tsx` files in `src/`
- Run `pnpm g` after schema changes to regenerate types

### Key GraphQL Operations
- **Projects**: CRUD operations, metrics, token management
- **Prompts**: CRUD operations, history, calls, testing
- **Providers**: Configuration, model parameters
- **Auth**: MetaMask authentication, user profiles

## Build & Deployment

### Build Configuration
- **Build tool**: Vite with React SWC plugin
- **Base path**: `/public` for production builds (configurable via `pnpm build:cf` for Cloudflare)
- **Code splitting**: Automatic via TanStack Router
- **Bundle analysis**: Available in development mode
- **ZIP packaging**: Automatic in production builds
- **Build info**: Injected via unplugin-info

### Package Manager
- **PNPM**: Version 10.12.1 (enforced via packageManager field)
- Always use `pnpm` instead of `npm` or `yarn`

### Development Setup
1. Install dependencies: `pnpm install`
2. Ensure backend GraphQL schema is available at `../PromptPal/schema/schema.gql`
3. Generate GraphQL types: `pnpm g`
4. Start development server: `pnpm dev`
5. Access application at `http://localhost:5173`

## Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route definition in `src/routes/`
3. Update navigation if needed
4. Add GraphQL queries/mutations as required

### Adding a New Component
1. Create component directory in `src/components/`
2. Export from component and add types
3. Add Storybook story if complex
4. Update parent components as needed

### Working with GraphQL
1. Write query/mutation in component
2. Run `pnpm g` to generate types
3. Use generated types for type safety
4. Handle loading and error states

### Styling Guidelines
- Use Tailwind v4 utility classes
- Follow design system colors and spacing
- Use `lake-ui` for complex UI
- Apply consistent hover and focus states
- Support dark theme (forced in this app)

## Testing Strategy
- **Storybook**: Component isolation and testing
- **ESLint**: Static code analysis
- **TypeScript**: Compile-time type checking
- **Git hooks**: Pre-commit quality checks

## Performance Considerations
- **Code splitting**: Lazy route loading
- **GraphQL caching**: Apollo Client normalization
- **Image optimization**: Proper asset handling
- **Bundle analysis**: Monitor build size
- **Persisted queries**: Reduced network overhead

## Backend Integration

The web application expects a PromptPal backend server running locally:
- Default backend URL: `http://localhost:7788`
- GraphQL endpoint: `http://localhost:7788/api/v2/graphql`
- REST API: `http://localhost:7788/api/v1/*`

To run the backend locally:
```bash
cd ../PromptPal
# Follow the backend setup instructions in that directory
```

This architecture provides a solid foundation for rapid feature development while maintaining code quality and type safety throughout the application.