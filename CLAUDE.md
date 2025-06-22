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
pnpm dev                 # Start dev server
pnpm build              # Production build
pnpm preview            # Preview production build

# Code Quality
pnpm lint               # Run ESLint
pnpm g                  # Generate GraphQL types

# Testing & Storybook
pnpm storybook          # Start Storybook dev server
pnpm build-storybook    # Build Storybook
pnpm test:storybook     # Run Storybook tests
```

### Environment Configuration
- **Development**: API calls to `http://localhost:7788`
- **Production**: Static files served from backend server
- GraphQL endpoint: `/api/v2/graphql`
- REST API prefix: `/api/v1`

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

### GraphQL Schema
- Located at `../PromptPal/schema/schema.gql`
- Auto-generated types in `src/gql/`
- Supports persisted queries for optimization

### Key GraphQL Operations
- **Projects**: CRUD operations, metrics, token management
- **Prompts**: CRUD operations, history, calls, testing
- **Providers**: Configuration, model parameters
- **Auth**: MetaMask authentication, user profiles

## Build & Deployment

### Build Configuration
- **Vite** with React SWC plugin for fast builds
- **Base path**: `/public` for production builds
- **ZIP packaging** in production for easy deployment
- **Source maps** and build info injection

### Development Setup
1. Install dependencies: `pnpm install`
2. Ensure backend GraphQL schema is available
3. Start development server: `pnpm dev`
4. Generate GraphQL types: `pnpm g`

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

This architecture provides a solid foundation for rapid feature development while maintaining code quality and type safety throughout the application.