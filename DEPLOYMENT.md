# RiseOra Final Deployment Guide 🚀

Your codebase is now hardened, stabilized, and configured for a production-grade deployment using **Railway** (Backend & Database) and **Vercel** (Frontend).

## 🏛️ Deployment Architecture
- **Backend (Railway)**: Handles the API, AI integrations, PDF generation, and PostgreSQL database.
- **Frontend (Vercel)**: Serves the premium, motion-centric React application.

---

## 🛠️ Step 1: Backend & Database (Railway)

1. **Connect Repository**: Point Railway to your GitHub repository: `pa-ship-EM/RISEORA`.
2. **Provision Database**: Add a PostgreSQL instance to your project.
3. **Set Environment Variables**:
   - `DATABASE_URL`: (Auto-filled by Railway)
   - `SESSION_SECRET`: A long, random string.
   - `AI_INTEGRATIONS_OPENAI_API_KEY`: Your OpenAI key.
   - `AI_INTEGRATIONS_OPENAI_BASE_URL`: (Optional, for private LLM proxies).
   - `CLIENT_URL`: `https://your-app.vercel.app` (Once you have it).
   - `NODE_ENV`: `production`
4. **Build Command**: `npm run build`
5. **Start Command**: `npm run start` (Mapped in `Procfile`).

---

## ⚡ Step 2: Frontend (Vercel)

1. **Connect Repository**: Point Vercel to the same GitHub repository.
2. **Set Environment Variables**:
   - `VITE_API_URL`: `https://your-backend.railway.app` (The URL Railway provided).
3. **Framework Preset**: Vercel will auto-detect **Vite**.
4. **Build Settings**:
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist/public`

---

## 🛡️ Step 3: Final Compliance Sweep

Before going live, ensure your **SAFEGUARDS.md** and **Compliance Disclaimers** are visible to your advisors and clients.

- [x] **Legal Check**: Ensure all templates in `shared/disputeTemplates.ts` align with your current legal strategy.
- [x] **State Machine**: Confirm that only the client can move a dispute to `READY_TO_MAIL`.

---

## ✅ Deployment Status
- [x] **Environment**: Node.js 20 Fixed.
- [x] **Build Verification**: `tsc`, `vite`, `esbuild` all passing.
- [x] **CORS & Sessions**: Hardened for cross-domain auth.

*Rise Inward. Rise Upward. You are ready to launch.* 🏛️🕊️
