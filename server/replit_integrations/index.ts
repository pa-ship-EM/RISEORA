import type { Express } from "express";
import { registerChatRoutes } from "./chat/routes";
import { registerImageRoutes } from "./image/routes";

/**
 * Central registry for all Replit AI integrations.
 * Call this from the main routes registration function.
 */
export function registerReplitIntegrations(app: Express): void {
    registerChatRoutes(app);
    registerImageRoutes(app);
}

export * from "./batch";
export * from "./chat";
export * from "./image";
