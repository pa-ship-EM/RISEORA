# RiseOra - Credit Education & Dispute Management Platform

## Overview

RiseOra is a credit education and guided support platform that empowers consumers to understand, manage, and assert their credit rights. The platform provides tools for generating dispute letters, tracking dispute progress, and educating users about credit repair — all while maintaining strict compliance with CROA, FCRA, and FTC regulations.

Key features include:
- **Credit Report Upload**: PDF upload with AI-powered account extraction using OpenAI GPT-4o, stores reports and accounts for dispute creation
- **Dispute Wizard™**: AI-assisted workflow for generating Metro 2-compliant dispute letters with multi-account selection
- **Dispute Progress Tracking**: Per-letter progress bars, user-updatable checklists, and stage management
- **AI Notifications**: Intelligent reminders for 30-day deadlines and follow-up actions
- **Best Practices Guidance**: Educational panel with FCRA-compliant dispute submission guidelines
- **Multi-role Dashboard**: Separate interfaces for clients, affiliates, and administrators
- **Secure Data Handling**: AES-256 encryption for sensitive user data (SSN, addresses, DOB)
- **Subscription Management**: Tiered access model (DIY Scholar, Self-Starter, Growth, Compliance+)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React Context for auth
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Design**: RESTful JSON API with session-based authentication
- **Session Management**: express-session with MemoryStore (development) or connect-pg-simple (production)
- **Password Security**: bcryptjs for password hashing

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Encryption**: Custom AES-256-GCM encryption for sensitive fields (SSN, address, DOB)

### Authentication & Authorization
- **Method**: Session-based authentication with HTTP-only cookies
- **Role System**: Three roles - CLIENT, AFFILIATE, ADMIN
- **Protected Routes**: Client-side route guards with role-based access control
- **Session Duration**: 7-day cookie expiration

### AI Integration & Safety
- **Guardrails**: Client-side validation prevents forbidden terms (guarantees, legal threats)
- **Narrative Validation**: Ensures FCRA-compliant language in dispute letters
- **Data Minimization**: Sensitive data patterns detected and handled appropriately
- **AI Notifications**: OpenAI-powered reminder generation for dispute deadlines
- **AI Escalation Guidance**: When disputes are escalated, GROWTH/COMPLIANCE_PLUS users can generate AI-powered educational guidance including FCRA rights, next steps, and follow-up templates (stored in `dispute_ai_guidance` table)

### 5-Step Dispute Template System
- **Template Location**: `shared/disputeTemplates.ts` - all 5 FCRA-compliant letter templates
- **Template Stages**: INVESTIGATION_REQUEST → PERSONAL_INFO_REMOVER → VALIDATION_OF_DEBT → FACTUAL_LETTER → TERMINATION_LETTER → AI_ESCALATION
- **Database Fields**: `templateStage` and `templateStageStartedAt` track current position in 5-step process
- **API Endpoints**: 
  - GET /api/dispute-templates - Template stage info
  - POST /api/disputes/:id/generate-letter - Generate letter from current template
  - POST /api/disputes/:id/advance-stage - Move to next template stage
- **Compliance**: All templates use educational language without outcome guarantees
- **AI Escalation**: Final stage uses OpenAI to generate custom escalation letters

### Dispute Progress Tracking
- **Database Tables**: `dispute_checklists`, `notifications`, `user_notification_settings`
- **Progress Stages**: GENERATED → MAILED → DELIVERED → INVESTIGATION → RESPONSE → RESOLVED
- **Default Checklist**: 7-step submission checklist auto-created for each dispute
- **Notification Scheduler**: Background job checks for approaching deadlines and creates AI-generated reminders

### Dynamic Affiliate System
- **Key Safety Point**: Affiliates are never hard-coded into pages - resolved dynamically by user state + surface
- **Key Compliance Rule**: Affiliates only appear after value has been delivered, never before
- **Affiliate Data**: `server/affiliates.ts` - centralized affiliate configurations with eligibility criteria
- **Eligibility Logic**: `server/affiliateEligibility.ts` - filters by tier, state, active disputes
- **State Matrix**: `server/affiliateStateMatrix.ts` - maps dispute states to allowed affiliate surfaces
- **Guard Logic**: `server/affiliateGuards.ts` - hard stop enforcement blocking CHECKOUT, PAYMENT_CONFIRMATION, BILLING_EMAIL, UPGRADE_MODAL
- **API Endpoint**: `GET /api/affiliates?surface=<surface>` - returns eligible affiliates for a given surface
- **Frontend Hook**: `useAffiliates(surface)` - React hook for consuming affiliate data
- **Allowed Surfaces**: dashboard, resources, dispute_wizard, onboarding, email
- **Blocked Surfaces**: CHECKOUT, PAYMENT_CONFIRMATION, BILLING_EMAIL, UPGRADE_MODAL (403 error)
- **Filtering Criteria**: minTier, excludeStates, requiresActiveDispute, active status
- **State-Based Surfaces**: WORKFLOW_COMPLETION (after letter generated), EDUCATION_FOLLOWUP (after mailed), RESOURCE_PAGE (after resolved)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui + custom)
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks (auth, disputes, toast)
│   ├── lib/             # Utilities, query client, schema types
│   └── ai/              # AI guardrails and validation
├── server/              # Express backend
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Database access layer
│   ├── encryption.ts    # Data encryption utilities
│   └── db.ts            # Database connection
├── shared/              # Shared between client/server
│   └── schema.ts        # Drizzle schema definitions
└── migrations/          # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Payment Processing
- **Stripe**: Payment processing (configured but not fully implemented in visible code)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `ENCRYPTION_KEY`: Key for AES-256 data encryption

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **React Hook Form + Zod**: Form handling and validation

### Development Tools
- **Vite**: Development server and build tool
- **TSX**: TypeScript execution for server
- **esbuild**: Production server bundling