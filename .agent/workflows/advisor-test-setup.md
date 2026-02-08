---
description: Quickly set up a test advisor and dummy clients for dashboard verification.
---

1. Create a temporary advisor user in the database
```bash
# This uses the internal storage API via a small runner
npx tsx -e "import { storage } from './server/storage'; async function run() { const u = await storage.createUser({ email: 'test_advisor@example.com', password: 'password123', firstName: 'Test', lastName: 'Advisor', role: 'AFFILIATE', betaAccessCode: 'RISEORA2026' }); console.log('Advisor created:', u.id); } run();"
```

2. Populate sample clients for the advisor
```bash
# Optional: Add clients to test the multi-tenant dashboard
npx tsx -e "import { storage } from './server/storage'; async function run() { /* implementation logic */ } run();"
```

3. Instructions:
- Log in with `test_advisor@example.com` / `password123`
- Navigate to `/dashboard/advisor` (once UI is deployed)
