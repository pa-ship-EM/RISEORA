# RiseOra Production Frontend

This is a standalone, production-ready frontend application for RiseOra. It is built with a modern tech stack and optimized for performance, security, and developer experience.

## Tech Stack

- **Core**: React 19, TypeScript, Vite 7
- **Routing**: [Wouter](https://github.com/molefrog/wouter) (lightweight, hook-based)
- **Styling**: Tailwind CSS 4, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```bash
VITE_API_URL=https://your-backend-api.com
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deployment

This project is designed for a modern "Headless" deployment:

### 1. Backend (Railway)
- Use **Railway** for the Express backend.
- It handles the AI "Dispute Wizard" without timeouts.
- Set `CLIENT_URL` to your Vercel URL.
- Set `DATABASE_URL` to your Supabase connection string.

### 2. Frontend (Vercel)
- Deploy the `riseora-frontend` folder to **Vercel**.
- Set `VITE_API_URL` to your Railway domain.
- Set Supabase environment variables as defined in `.env.example`.

## Project Structure

- `src/components/ui/`: Base UI components (shadcn/ui style).
- `src/components/layout/`: Global layout components (Navbar, Footer).
- `src/pages/`: Page-level components.
- `src/hooks/`: Custom React hooks (Auth, Toasts, etc.).
- `src/lib/`: Utilities and API client configuration.
- `src/assets/`: Images and other static assets.

## Core Features (Client-Facing)

- [x] High-performance landing page.
- [x] Secure authentication flow (Login/Signup).
- [x] Role-based protected routes.
- [x] Branded theme with glassmorphism and animations.
- [x] Mobile-optimized responsive design.
