# Contributing to RiseOra

Welcome to the RiseOra development team. This platform is built for high reliability and security. Follow these guidelines to ensure a smooth handover.

## 🛠 Prerequisites
- Node.js 18+
- PostgreSQL
- Supabase Account (for Vault storage)
- OpenAI API Key

## 🏗 Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your credentials.
4. Push database schema: `npm run db:push`
5. Start development: `npm run dev`

## 📐 Standards
- **TypeScript:** No `any`. Use strict typing for all interfaces.
- **UI:** Use `shadcn/ui` components. Custom CSS should be minimal and utility-based (Tailwind).
- **Security:** Never log PII. Ensure all new entities are scoped by `user_id`.
- **Commits:** Use descriptive, imperative commit messages (e.g., "Add encryption to email field").

## 🧪 Testing
- Verify all routes are protected by `requireAuth`.
- Test storage flows with a valid Supabase configuration.
- Ensure `npm run build` succeeds before pushing.

---
*Thank you for helping us empower consumers through better credit education.*
