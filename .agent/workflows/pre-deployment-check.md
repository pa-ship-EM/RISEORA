---
description: Run comprehensive system checks before deployment to ensure stability.
---

// turbo-all
1. Run TypeScript type checking
```bash
npm run check
```

2. Run frontend build verification
```bash
npm run build:client
```

3. Run server build verification
```bash
npm run build:server
```

4. Final check: verify all critical files exist
```bash
ls -la dist/public/index.html dist/index.js
```
