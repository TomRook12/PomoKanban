# FocusFlow - Task Management with Pomodoro Timer

## Overview

FocusFlow is a productivity application that combines task management with the Pomodoro Technique. The application features a Kanban-style task board where users can organize tasks across different stages (To-Do, In Progress, Clarification, Complete) and an integrated Pomodoro timer to help maintain focus during work sessions.

The application is built as a full-stack web application with a React frontend and Express.js backend, designed to help users manage their workflow efficiently while incorporating proven productivity techniques.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **API Design**: RESTful API following conventional HTTP methods and status codes
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Validation**: Zod schemas for request/response validation shared between client and server

### Database Schema Design
The application uses Drizzle ORM with PostgreSQL dialect, featuring:
- **Tasks Table**: Stores task information with UUID primary keys, descriptions, priority levels (low/medium/high), stages (todo/in-progress/clarification/complete), and timestamps
- **Users Table**: Basic user management with username/password authentication structure
- **Migration System**: Drizzle Kit for schema migrations and database management

### Component Architecture
- **Kanban Board**: Drag-and-drop interface for task management with real-time updates
- **Pomodoro Timer**: Configurable work/break sessions with visual progress indicators
- **Task Management**: Modal-based task creation and editing with priority and stage assignment
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

### Additional Libraries
- **date-fns**: Date utility library for time formatting and manipulation
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: Compact URL-safe unique string ID generator