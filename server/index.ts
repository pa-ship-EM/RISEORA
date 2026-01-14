import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import { startNotificationScheduler } from "./notification-scheduler";
import { pool } from "./db";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Trust proxy for secure cookies behind reverse proxy (Replit)
app.set("trust proxy", 1);

// Health check endpoint - must be early in middleware chain for fast response
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

// Health check for root path - only for non-browser requests (deployment health checks)
app.use((req, res, next) => {
  if (req.path === "/" && req.method === "GET") {
    const acceptHeader = req.get("Accept") || "";
    // If not requesting HTML (likely a health check), return 200 immediately
    if (!acceptHeader.includes("text/html")) {
      return res.status(200).send("OK");
    }
  }
  next();
});

// CORS configuration for external device access
const allowedOrigins = [
  "https://riseora.org",
  "https://www.riseora.org",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

// Trusted domain suffixes (verified via URL parsing)
const trustedDomainSuffixes = [
  ".replit.dev",
  ".replit.app",
];

function isAllowedOrigin(origin: string): boolean {
  // Check exact matches in allowlist
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  
  // Parse origin to validate domain properly
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    
    // Allow localhost for development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }
    
    // Check trusted domain suffixes using proper endsWith validation
    for (const suffix of trustedDomainSuffixes) {
      if (hostname.endsWith(suffix) || hostname === suffix.slice(1)) {
        return true;
      }
    }
  } catch {
    // Invalid URL, reject
    return false;
  }
  
  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, same-origin requests)
      if (!origin) return callback(null, true);
      
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      
      // Reject unknown origins
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Session configuration with PostgreSQL store
const PgSession = connectPgSimple(session);
const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "riseora-dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      pool: pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: isProduction ? "none" : "lax", // 'none' required for cross-origin in production
    },
  }),
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Non-negotiable port binding
  const PORT = Number(process.env.PORT) || 5000;
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on ${PORT}`);
    // Start the notification scheduler for AI-powered reminders
    startNotificationScheduler();
  });
})();
