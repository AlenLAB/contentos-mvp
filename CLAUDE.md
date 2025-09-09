# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ContentOS MVP - A dual-platform content management system for creating and managing social media posts for Twitter/X (English) and LinkedIn (Swedish). Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture and Key Dependencies

### Technology Stack
- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Language**: TypeScript 5 with strict mode enabled
- **Styling**: Tailwind CSS v4 with CSS variables-based theming
- **UI Components**: shadcn/ui components (configured via components.json)
- **State Management**: Zustand 5.0.8 with immer middleware
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **AI Integration**: Anthropic Claude SDK for content generation and translation
- **Notifications**: Sonner for toast notifications
- **Themes**: next-themes for dark mode support
- **Drag & Drop**: react-dnd for calendar interactions
- **Utility Libraries**: 
  - clsx and tailwind-merge for className management (combined in `cn()` utility)
  - lucide-react for icons
  - date-fns for date formatting

### Project Structure
```
src/
├── app/                 # Next.js app router pages and layouts
│   ├── api/            # API routes for AI and database operations
│   ├── calendar/       # Calendar scheduling interface
│   ├── dashboard/      # Dashboard overview
│   ├── editor/         # Postcard editor pages
│   ├── generate/       # AI content generation
│   └── postcards/      # Postcard management
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── calendar/      # Calendar components
│   ├── editor/        # Editor components
│   └── layout/        # Layout components
├── lib/               # Utility functions and service clients
│   ├── supabase.ts    # Supabase client configuration
│   ├── claude.ts      # Anthropic/Claude AI integration
│   └── utils.ts       # Common utilities
├── store/             # Zustand state management
│   └── postcards.ts   # Postcard store with Supabase sync
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
    └── database.ts    # Database schema types
```

### Path Aliases
- `@/*` maps to `./src/*`
- `@/components` - Component directory
- `@/lib` - Library/utilities directory
- `@/hooks` - Custom hooks directory
- `@/store` - State management directory
- `@/types` - Type definitions directory

## Core Features

### Content Management System
- **Postcard Model**: Dual-language content posts with states (draft, approved, scheduled, published)
- **Content Templates**: Story and Tool templates for different post types
- **Character Limits**: 
  - Twitter/X: 280 characters (English)
  - LinkedIn: 3000 characters (Swedish)

### State Management with Zustand
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Real-time Sync**: Supabase real-time subscriptions for multi-client sync
- **Store Pattern**: Immer for immutable state updates
- **Key Actions**: fetchPostcards, createPostcard, updatePostcard, deletePostcard, changeState, generatePhaseContent

### AI Integration
- **Content Generation**: Generate multiple posts based on phase descriptions
- **Translation**: Automatic English to Swedish translation for LinkedIn
- **Templates**: Support for story and tool content templates
- **Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-latest)

### Key Integration Points

#### Supabase Integration
- **Client**: Configured in `src/lib/supabase.ts`
- **Database Types**: Defined in `src/types/database.ts`
- **Real-time**: Subscription to postcard changes via `subscribeToPostcardUpdates()`
- **Error Handling**: `handleSupabaseError()` helper function

#### Anthropic SDK Integration  
- **Client**: Configured in `src/lib/claude.ts`
- **Functions**: 
  - `generatePhaseContent()` - Bulk content generation
  - `translateToSwedish()` - Translation service
  - `createMessage()` - Generic message creation with error handling
  - `validateContentRequest()` - Pre-validation of content generation requests
- **Helpers**:
  - `estimateTokens()` - Token estimation for API usage planning
  - `createStreamingMessage()` - Streaming API support for real-time responses

#### shadcn/ui Components
This project uses shadcn/ui components. When adding new components:
- Components are configured for the "new-york" style with zinc as the base color
- Use the `cn()` utility from `src/lib/utils.ts` for className merging
- Components should be placed in `src/components/ui/`
- All components use CSS variables for theming

## Environment Variables

Required environment variables (create `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLAUDE_API_KEY=your_claude_api_key
```

## Development Patterns

### Optimistic Updates
The Zustand store implements optimistic updates:
1. Immediate UI update on action
2. Async database operation
3. Rollback on failure
4. Server response reconciliation

### Error Handling
- Try-catch blocks with specific error messages
- Toast notifications for user feedback
- Console logging for debugging
- Graceful fallbacks for failed operations

### Client-Side Routing
- App router with dynamic routes
- Layout component with persistent navigation
- Mobile-responsive sidebar
- Active route highlighting

### TypeScript Patterns
- Strict mode compliance
- Type guards for validation
- Database type generation
- Comprehensive interface definitions

## Important Development Notes

- **Client Components**: Use "use client" directive only when necessary (hooks, browser APIs, interactivity)
- **Turbopack**: Enabled by default for faster builds in dev and production
- **Real-time Updates**: Supabase channels handle multi-client synchronization
- **AI Rate Limits**: Consider Anthropic API rate limits when implementing bulk operations
- **Database Migrations**: Postcard schema changes require Supabase migration
- **State Persistence**: Zustand store syncs with Supabase, no local storage needed
- **Mobile First**: UI components designed for mobile-first responsiveness
- **Dark Mode**: Fully supported via CSS variables and next-themes

## Testing Infrastructure

### Playwright Integration
- **Playwright**: Configured for E2E testing with browser automation
- **Test Files**: Uses `@playwright/test` for cross-browser testing
- **Browser Support**: Chrome, Firefox, Safari, and Edge testing capabilities

### Running Tests
```bash
# Install Playwright browsers (first time setup)
npx playwright install

# Run Playwright tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/example.spec.ts
```

## API Routes Structure

The application uses Next.js 15 App Router API routes:

### Core API Endpoints
- **`/api/generate`** - AI content generation for bulk postcard creation
- **`/api/translate`** - Individual content translation service
- **`/api/translate-batch`** - Batch translation processing
- **`/api/postcards`** - CRUD operations for postcard management
- **`/api/postcards/[id]`** - Individual postcard operations
- **`/api/generation-status`** - Check content generation progress
- **`/api/test-ai`** - AI service health check and testing

### Real-time Features
- **Supabase Subscriptions**: Real-time postcard updates across clients
- **Background Processing**: Batch translation with status tracking
- **Optimistic Updates**: Immediate UI responses with database sync