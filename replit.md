# AISG - Audit Intelligence SG

## Overview

AISG (Audit Intelligence SG) is a corporate enterprise performance auditing platform designed to evaluate employee performance and leadership using a standardized 18 Pilar framework. The system processes quarterly performance metrics and behavioral assessments to generate comprehensive audit reports with ProDem (Promotion-Demotion) recommendations. Key capabilities include a 5-step multi-form for data input, 12-section professional audit reports, AI Chat integration with GPT-4o, and PDF export functionality. It also features a "Magic Section" for personalized motivational content. The system is fully operational and production-ready, supporting a quarterly-based audit system with a Reality Score Calculator.

## User Preferences

**Communication Style**: Simple, everyday language (Bahasa Indonesia)

**Design Preferences**:
- Professional corporate aesthetic
- Dark mode as primary theme
- Zone-based color coding (Success 🟩, Warning 🟨, Critical 🟥)
- Radio buttons preferred over sliders for familiarity
- Clear, prominent UI elements (no tiny icons)

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite.
**UI Component System**: shadcn/ui components (Radix UI primitives) with "new-york" style, adapted Material Design principles, and dark mode primary theme. Custom color system for zone-based status indicators.
**State Management**: TanStack Query for server state, React Hook Form with Zod validation for forms.
**Routing**: Wouter for client-side routing.
**Key Design Decisions**: Prioritization of dark mode for eye strain, zone color-coding for visual feedback, professional corporate aesthetic with Inter font, minimal decorative elements, and prominent chat button with animation.

### Backend Architecture

**Runtime**: Node.js with Express.js.
**API Design**: RESTful JSON API for audit management and AI chat.
**Business Logic Layer**: Centralized in `server/business-logic.ts`, handling Reality Score Calculation, Performance/Behavioral/Final Zone Analysis, Employee Profile Generation, SWOT Analysis, ProDem Recommendation, Action Plan 30-60-90, EWS, and the Magic Section.
**Validation**: Zod schemas shared between client and server.
**Key Architectural Patterns**: Storage interface abstraction, separation of business logic, schema-driven development, and user-friendly error handling.

### Data Storage

**Database**: PostgreSQL 16 (Neon serverless) using Drizzle ORM.
**Schema Design**: Includes `users`, `branches`, `audits` (core table with employee, performance, team structure, assessment, and report data), and `chatMessages` tables. Uses JSONB for flexible data, UUID primary keys, and denormalized audit results.
**Migration Strategy**: Drizzle Kit for schema migrations.

### Authentication & Authorization

**Current State**: Basic user table exists, authentication not fully implemented.
**Planned Approach**: Session-based authentication with role-based access control (auditors, managers, admin) and audit ownership.

## External Dependencies

**AI Service**:
- **OpenAI GPT-4o**: Used for the AI Coach chat assistant, providing context-aware responses and chat history persistence.

**Database Services**:
- **Neon Serverless PostgreSQL**: Cloud-native PostgreSQL with connection pooling.

**UI Component Libraries**:
- **Radix UI**: Unstyled accessible component primitives.
- **shadcn/ui**: Pre-styled component system built on Radix UI.
- **Lucide React**: Icon library.

**Form & Validation**:
- **React Hook Form**: Performant form state management.
- **Zod**: Runtime type validation and schema definition.

**Utility Libraries**:
- **date-fns**: Date manipulation.
- **clsx & tailwind-merge**: Conditional CSS class management.
- **class-variance-authority**: Type-safe component variants.
- **PDFKit**: PDF generation for audit reports.

**Development Tools**:
- **Vite**: Fast build tool.
- **TypeScript**: Type safety.
- **Tailwind CSS**: Utility-first CSS framework.
- **PostCSS with Autoprefixer**: CSS processing.
- **Drizzle Kit**: Database migrations.

**Knowledge Base Files** (in `attached_assets/`):
- 18 Pilar framework definitions
- ProDem (Promotion-Demotion) standards
- Zodiac booster templates
- Motivational quotes database
- Server specification and system blueprints
- AISG_Manual_Book.txt (comprehensive system documentation)