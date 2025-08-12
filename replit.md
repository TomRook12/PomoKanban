# FocusFlow - Task Management with Pomodoro Timer

## Overview

FocusFlow is a multi-user productivity application that combines task management with the Pomodoro Technique. The application features user authentication via Replit's OpenID Connect system, a personal Kanban-style task board where users can organize tasks across different stages (To-Do, In Progress, Clarification, Complete), and an integrated Pomodoro timer to help maintain focus during work sessions.

The application is built as a full-stack web application with a React frontend and Express.js backend, using PostgreSQL for persistent data storage and secure user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Updated: August 12, 2025)

### Complete Authentication System Implementation
- ✓ Integrated Replit OpenID Connect authentication system
- ✓ Implemented user-specific task management with database relationships
- ✓ Added comprehensive error handling for unauthorized access across all components
- ✓ Created landing page for unauthenticated users with feature overview
- ✓ Added user profile dropdown with logout functionality
- ✓ Migrated from in-memory storage to PostgreSQL with proper user scoping
- ✓ Updated all API endpoints to require authentication and scope to user data
- ✓ Implemented session management with PostgreSQL-backed storage

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system tokens and CSS variables
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API following conventional HTTP methods and status codes with authentication middleware
- **Data Storage**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Authentication**: Replit OpenID Connect integration with session-based authentication
- **Validation**: Zod schemas for request/response validation shared between client and server
- **Security**: User-scoped data access with authentication checks on all protected endpoints

### Database Schema Design
The application uses Drizzle ORM with PostgreSQL dialect, featuring:
- **Users Table**: Stores user information from Replit authentication with id, email, firstName, lastName, profileImageUrl, and timestamps
- **Sessions Table**: Manages user sessions for Replit authentication with session data and expiration
- **Tasks Table**: Stores user-specific task information with userId foreign key, descriptions, priority levels (low/medium/high), stages (todo/in-progress/clarification/complete), archive status, and timestamps
- **Migration System**: Drizzle Kit for schema migrations and database management

### Component Architecture
- **Authentication System**: Landing page for unauthenticated users, login/logout flow via Replit OAuth
- **User Interface**: Authenticated home page with user profile dropdown and logout functionality
- **Kanban Board**: Drag-and-drop interface for personal task management with real-time updates
- **Pomodoro Timer**: Configurable work/break sessions with auto-run mode, skip functionality, and visual progress indicators
- **Task Management**: Modal-based task creation and editing with priority and stage assignment
- **Archive System**: Comprehensive archive functionality for individual and bulk task archiving
- **Error Handling**: Comprehensive unauthorized error handling with automatic redirect to login
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Development Environment
- **Hot Reloading**: Vite development server with HMR support
- **Error Handling**: Runtime error overlays and comprehensive error boundaries
- **Path Aliases**: Configured TypeScript path mapping for clean imports
- **Build Process**: Optimized production builds with ESBuild for server-side code

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL adapter
- **Drizzle Zod**: Schema validation integration between Drizzle and Zod

### UI & Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating type-safe component variants

### State Management & Data Fetching
- **TanStack Query**: Powerful data synchronization for React applications
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation library

### Development Tools
- **Vite**: Fast build tool with optimized development experience
- **TypeScript**: Static type checking for better developer experience
- **ESLint/Prettier**: Code formatting and linting (implied by project structure)
- **Replit Integration**: Development environment plugins for Replit platform

### Authentication & Security
- **OpenID Client**: Replit OpenID Connect integration for secure authentication
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **Session Management**: PostgreSQL-backed session store with 7-day TTL
- **User Management**: Automatic user creation/updates from authentication claims

### Additional Libraries
- **date-fns**: Date utility library for time formatting and manipulation
- **clsx**: Utility for constructing className strings conditionally
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **memoizee**: Function memoization for OpenID configuration caching