# Technical Architecture Overview

RiseOra is architected for scalability, maintainability, and enterprise-grade performance. This document outlines the technical decisions that make RiseOra a robust software asset.

## 🏛 System Design

### 1. Frontend: Premium & Motion-Centric
- **Framework:** React 18 with TypeScript for rigorous type safety.
- **Styling:** Tailwind CSS 4 for modern, utility-first design with high performance.
- **Animations:** Framer Motion for premium micro-interactions and smooth state transitions.
- **State Management:** TanStack Query (React Query) for efficient server-state synchronization and caching.
- **UI Components:** shadcn/ui built on Radix UI primitives, ensuring accessibility (WCAG).

### 2. Backend: Scalable & Feature-Rich
- **Runtime:** Node.js with Express, optimized for AI-driven workflows.
- **ORM:** Drizzle ORM providing type-safe interaction with PostgreSQL.
- **Validation:** Zod-powered schema validation for end-to-end data integrity.
- **Integrations:** 
  - **OpenAI:** Powering AI-driven dispute guidance and personalized recommendations.
  - **Documint:** Enterprise-grade PDF generation for legal dispute letters.

### 3. Business Logic: Specialized Modules
- **Free Education Tier:** Comprehensive learning management system with modules, quizzes, and progress tracking.
- **Premium Dispute Wizard:** Multi-step guided workflow for complex credit repair scenarios.
- **Secure Vault:** AES-256-GCM encrypted storage for PII (Personally Identifiable Information) and sensitive documents.

### 4. Data Strategy
- **Relational Integrity:** PostgreSQL handles complex relationships between Users, Disputes, Education, and Subscriptions.
- **Storage Scoping:** Decoupled storage (Supabase) ensures that large binary files do not bloat the primary database.

### 5. Legal Integrity & Compliance
- **User-Centric Submission:** The platform enforces that only consumers can finalize and submit disputes, shielding the system from CROA requirements.
- **Audit Traceability:** Every compliance-critical event (like dispute approval) is signed with the user's IP and User Agent.
- **Coaching Model:** Architecture is strictly built around "Education + Document Prep," ensuring zero direct communication with credit bureaus.
- **Refer to [SAFEGUARDS.md](file:///Users/amos/Desktop/11/SAFEGUARDS.md) for the full compliance framework.**

## 🚀 Scalability Path
- **Stateless Design:** The API is designed to be horizontally scalable across containerized environments.
- **Vercel & Railway Deployment:** Optimized for serverless frontend (Vercel) and robust backend (Railway) communication.
- **AI Pipelines:** Decoupled OpenAI integrations allow for easy migration to private LLM instances as the user base grows.

---
*Developed for performance. Engineered for growth.*
