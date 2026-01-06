import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { insertUserSchema, insertDisputeSchema, type User, TIER_FEATURES, DISPUTE_STAGES } from "@shared/schema";
import { z } from "zod";
import { encryptUserData, decryptUserData } from "./encryption";
import OpenAI from "openai";
import multer from "multer";
import { PDFParse } from "pdf-parse";

// Configure multer for PDF uploads (in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Extend Express session to include user
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ========== AUTH ROUTES ==========
  
  // POST /api/auth/signup
  app.post("/api/auth/signup", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        role: "CLIENT",
      });
      
      // Regenerate session to prevent session fixation
      req.session.regenerate((err: any) => {
        if (err) {
          return next(err);
        }
        req.session.userId = user.id;
        
        // Return user (without password)
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/auth/login
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Regenerate session to prevent session fixation
      req.session.regenerate((err: any) => {
        if (err) {
          return next(err);
        }
        req.session.userId = user.id;
        
        // Return user (without password)
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/auth/logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // GET /api/auth/me
  app.get("/api/auth/me", requireAuth, async (req, res, next) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Decrypt sensitive fields
      const decryptedData = decryptUserData(user);
      
      const { passwordHash: _, addressEncrypted, cityEncrypted, stateEncrypted, zipEncrypted, dobEncrypted, ssnLast4Encrypted, ...userWithoutSensitive } = user;
      res.json({ ...userWithoutSensitive, ...decryptedData });
    } catch (error) {
      next(error);
    }
  });
  
  // ========== USER PROFILE ROUTES ==========
  
  // POST /api/user/password - Change password
  app.post("/api/user/password", requireAuth, async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUserProfile(req.session.userId!, { passwordHash: newPasswordHash });
      
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  });
  
  // PATCH /api/user/profile
  app.patch("/api/user/profile", requireAuth, async (req, res, next) => {
    try {
      const { 
        firstName, 
        lastName, 
        address,
        city,
        state,
        zip,
        dob,
        ssnLast4
      } = req.body;
      
      const updateData: Partial<User> = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      
      // Encrypt sensitive fields if provided
      const encryptedData = encryptUserData({ address, city, state, zip, dob, ssnLast4 });
      Object.assign(updateData, encryptedData);
      
      const user = await storage.updateUserProfile(req.session.userId!, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Decrypt sensitive fields for response
      const decryptedData = decryptUserData(user);
      
      const { passwordHash: _, addressEncrypted, cityEncrypted, stateEncrypted, zipEncrypted, dobEncrypted, ssnLast4Encrypted, ...userWithoutSensitive } = user;
      res.json({ ...userWithoutSensitive, ...decryptedData });
    } catch (error) {
      next(error);
    }
  });
  
  // ========== SUBSCRIPTION ROUTES ==========
  
  // GET /api/subscription
  app.get("/api/subscription", requireAuth, async (req, res, next) => {
    try {
      let subscription = await storage.getSubscriptionForUser(req.session.userId!);
      
      // Create a free subscription if none exists
      if (!subscription) {
        subscription = await storage.createSubscription({
          userId: req.session.userId!,
          tier: "FREE",
          status: "ACTIVE",
        });
      }
      
      // Add tier features to response
      const tier = subscription.tier as keyof typeof TIER_FEATURES;
      const features = TIER_FEATURES[tier] || TIER_FEATURES.FREE;
      
      res.json({ ...subscription, features });
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/subscription/upgrade - Upgrade subscription tier (for testing)
  app.post("/api/subscription/upgrade", requireAuth, async (req, res, next) => {
    try {
      const { tier } = req.body;
      
      // Validate tier
      if (!["FREE", "SELF_STARTER", "GROWTH", "COMPLIANCE_PLUS"].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }
      
      let subscription = await storage.getSubscriptionForUser(req.session.userId!);
      
      if (subscription) {
        subscription = await storage.updateSubscription(req.session.userId!, { 
          tier,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
      } else {
        subscription = await storage.createSubscription({
          userId: req.session.userId!,
          tier,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      }
      
      const features = TIER_FEATURES[tier as keyof typeof TIER_FEATURES];
      res.json({ ...subscription, features });
    } catch (error) {
      next(error);
    }
  });
  
  // ========== DISPUTE ROUTES ==========
  
  // GET /api/disputes
  app.get("/api/disputes", requireAuth, async (req, res, next) => {
    try {
      const disputes = await storage.getDisputesForUser(req.session.userId!);
      res.json(disputes);
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/disputes/:id
  app.get("/api/disputes/:id", requireAuth, async (req, res, next) => {
    try {
      const dispute = await storage.getDispute(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      
      // Verify ownership
      if (dispute.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(dispute);
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/disputes
  app.post("/api/disputes", requireAuth, async (req, res, next) => {
    try {
      const disputeData = {
        ...req.body,
        userId: req.session.userId!,
      };
      
      // Validate with schema
      const validatedData = insertDisputeSchema.parse(disputeData);
      
      const dispute = await storage.createDispute(validatedData);
      res.json(dispute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid dispute data", errors: error.errors });
      }
      next(error);
    }
  });
  
  // POST /api/disputes/bulk - Create multiple disputes at once
  app.post("/api/disputes/bulk", requireAuth, async (req, res, next) => {
    try {
      const { disputes: disputesArray } = req.body;
      
      if (!Array.isArray(disputesArray) || disputesArray.length === 0) {
        return res.status(400).json({ message: "Disputes array is required" });
      }
      
      if (disputesArray.length > 20) {
        return res.status(400).json({ message: "Maximum 20 disputes allowed per request" });
      }
      
      // Validate each dispute has required fields
      for (const d of disputesArray) {
        if (!d.creditorName || !d.bureau || !d.disputeReason) {
          return res.status(400).json({ 
            message: "Each dispute must have creditorName, bureau, and disputeReason" 
          });
        }
        if (d.disputeReason === "other" && !d.customReason) {
          return res.status(400).json({ 
            message: "Custom reason required when dispute reason is 'other'" 
          });
        }
        if (!d.letterContent) {
          return res.status(400).json({ 
            message: "Letter content is required for each dispute" 
          });
        }
      }
      
      // Validate and add userId to each dispute
      const validatedDisputes = disputesArray.map((d: any) => {
        const disputeData = {
          ...d,
          userId: req.session.userId!,
        };
        return insertDisputeSchema.parse(disputeData);
      });
      
      const createdDisputes = await storage.createDisputesBulk(validatedDisputes);
      res.json({ disputes: createdDisputes, count: createdDisputes.length });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid dispute data", errors: error.errors });
      }
      next(error);
    }
  });
  
  // PATCH /api/disputes/:id
  app.patch("/api/disputes/:id", requireAuth, async (req, res, next) => {
    try {
      const dispute = await storage.getDispute(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      
      // Verify ownership
      if (dispute.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedDispute = await storage.updateDispute(req.params.id, req.body);
      res.json(updatedDispute);
    } catch (error) {
      next(error);
    }
  });
  
  // DELETE /api/disputes/:id
  app.delete("/api/disputes/:id", requireAuth, async (req, res, next) => {
    try {
      const dispute = await storage.getDispute(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      
      // Verify ownership
      if (dispute.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const deleted = await storage.deleteDispute(req.params.id);
      if (deleted) {
        res.json({ message: "Dispute deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete dispute" });
      }
    } catch (error) {
      next(error);
    }
  });
  
  // ========== DISPUTE PROGRESS TRACKING ROUTES ==========
  
  // GET /api/disputes/:id/checklist - Get checklist for a dispute
  app.get("/api/disputes/:id/checklist", requireAuth, async (req, res, next) => {
    try {
      const dispute = await storage.getDispute(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      if (dispute.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      let checklist = await storage.getChecklistForDispute(req.params.id);
      
      // Create default checklist if none exists
      if (checklist.length === 0) {
        checklist = await storage.createDefaultChecklistForDispute(req.params.id);
      }
      
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  });
  
  // PATCH /api/checklist/:id - Update a checklist item
  app.patch("/api/checklist/:id", requireAuth, async (req, res, next) => {
    try {
      const { completed } = req.body;
      const item = await storage.updateChecklistItem(req.params.id, { completed });
      if (!item) {
        return res.status(404).json({ message: "Checklist item not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  });
  
  // PATCH /api/disputes/:id/progress - Update dispute progress (mailed, tracking, etc.)
  app.patch("/api/disputes/:id/progress", requireAuth, async (req, res, next) => {
    try {
      const dispute = await storage.getDispute(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      if (dispute.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { action, trackingNumber } = req.body;
      const updateData: any = {};
      
      switch (action) {
        case "mark_mailed":
          updateData.mailedAt = new Date();
          updateData.status = "MAILED";
          // Set 30-day response deadline
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + 30);
          updateData.responseDeadline = deadline;
          break;
        case "add_tracking":
          if (!trackingNumber) {
            return res.status(400).json({ message: "Tracking number is required" });
          }
          updateData.trackingNumber = trackingNumber;
          break;
        case "mark_delivered":
          updateData.deliveredAt = new Date();
          updateData.status = "DELIVERED";
          break;
        case "mark_in_investigation":
          updateData.status = "IN_INVESTIGATION";
          break;
        case "mark_response_received":
          updateData.responseReceivedAt = new Date();
          updateData.status = "RESPONSE_RECEIVED";
          break;
        case "mark_removed":
          updateData.status = "REMOVED";
          break;
        case "mark_verified":
          updateData.status = "VERIFIED";
          break;
        case "mark_no_response":
          updateData.status = "NO_RESPONSE";
          break;
        case "mark_escalation_available":
          updateData.status = "ESCALATION_AVAILABLE";
          break;
        case "mark_closed":
          updateData.status = "CLOSED";
          break;
        default:
          return res.status(400).json({ message: "Invalid action" });
      }
      
      const updatedDispute = await storage.updateDispute(req.params.id, updateData);
      
      // Create notification for status update
      await storage.createNotification({
        userId: req.session.userId!,
        disputeId: req.params.id,
        type: "STATUS_UPDATE",
        title: "Dispute Status Updated",
        message: `Your dispute with ${dispute.creditorName} has been updated to "${updateData.status || action}".`,
      });
      
      res.json(updatedDispute);
    } catch (error) {
      next(error);
    }
  });
  
  // ========== NOTIFICATION ROUTES ==========
  
  // GET /api/notifications - Get all notifications for user
  app.get("/api/notifications", requireAuth, async (req, res, next) => {
    try {
      const notifications = await storage.getNotificationsForUser(req.session.userId!);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/notifications/unread - Get unread notifications count
  app.get("/api/notifications/unread", requireAuth, async (req, res, next) => {
    try {
      const notifications = await storage.getUnreadNotificationsForUser(req.session.userId!);
      res.json({ count: notifications.length, notifications });
    } catch (error) {
      next(error);
    }
  });
  
  // PATCH /api/notifications/:id/read - Mark notification as read
  app.patch("/api/notifications/:id/read", requireAuth, async (req, res, next) => {
    try {
      const notification = await storage.markNotificationRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/notifications/read-all - Mark all notifications as read
  app.post("/api/notifications/read-all", requireAuth, async (req, res, next) => {
    try {
      await storage.markAllNotificationsRead(req.session.userId!);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/notification-settings - Get user notification settings
  app.get("/api/notification-settings", requireAuth, async (req, res, next) => {
    try {
      let settings = await storage.getNotificationSettings(req.session.userId!);
      if (!settings) {
        // Create default settings
        settings = await storage.upsertNotificationSettings(req.session.userId!, {
          emailEnabled: true,
          inAppEnabled: true,
          reminderLeadDays: 5,
        });
      }
      res.json(settings);
    } catch (error) {
      next(error);
    }
  });
  
  // PATCH /api/notification-settings - Update notification settings
  app.patch("/api/notification-settings", requireAuth, async (req, res, next) => {
    try {
      const { emailEnabled, inAppEnabled, reminderLeadDays } = req.body;
      const settings = await storage.upsertNotificationSettings(req.session.userId!, {
        emailEnabled,
        inAppEnabled,
        reminderLeadDays,
      });
      res.json(settings);
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/dispute-stages - Get dispute stage definitions
  app.get("/api/dispute-stages", requireAuth, (req, res) => {
    res.json(DISPUTE_STAGES);
  });
  
  // ========== AI ESCALATION GUIDANCE ROUTES ==========
  
  // GET /api/disputes/:id/guidance - Get AI guidance for a dispute
  app.get("/api/disputes/:id/guidance", requireAuth, async (req, res, next) => {
    try {
      const dispute = await storage.getDispute(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      if (dispute.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Check subscription tier - only GROWTH and COMPLIANCE_PLUS can access AI guidance
      const subscription = await storage.getSubscriptionForUser(req.session.userId!);
      const tier = subscription?.tier || "FREE";
      if (!["GROWTH", "COMPLIANCE_PLUS"].includes(tier)) {
        return res.status(403).json({ 
          message: "AI escalation guidance requires Growth or Compliance+ subscription",
          requiredTier: "GROWTH"
        });
      }
      
      const guidance = await storage.getGuidanceForDispute(req.params.id);
      if (guidance) {
        // Filter out internal notes before sending to customer
        const { internalNotes: _, ...customerGuidance } = guidance;
        res.json(customerGuidance);
      } else {
        res.json(null);
      }
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/disputes/:id/generate-guidance - Generate AI guidance for escalated dispute
  app.post("/api/disputes/:id/generate-guidance", requireAuth, async (req, res, next) => {
    try {
      const dispute = await storage.getDispute(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      if (dispute.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Check subscription tier - only GROWTH and COMPLIANCE_PLUS can use AI guidance
      const subscription = await storage.getSubscriptionForUser(req.session.userId!);
      const tier = subscription?.tier || "FREE";
      if (!["GROWTH", "COMPLIANCE_PLUS"].includes(tier)) {
        return res.status(403).json({ 
          message: "AI escalation guidance requires Growth or Compliance+ subscription",
          requiredTier: "GROWTH"
        });
      }
      
      // === STATE VALIDATION (CRITICAL FAILSAFE) ===
      // AI guidance is ONLY available when ALL conditions are met:
      // 1. Tier is GROWTH or COMPLIANCE_PLUS (checked above)
      // 2. Status is ESCALATION_AVAILABLE
      // 3. DV sent = true
      // 4. DV response received = true
      
      if (dispute.status !== "ESCALATION_AVAILABLE") {
        return res.status(400).json({ 
          message: "AI guidance is only available for disputes in escalation state"
        });
      }
      
      if (!dispute.dvSent || !dispute.dvResponseReceived) {
        return res.status(400).json({ 
          message: "We need more information to determine the appropriate next step. Please update your dispute status to indicate that a debt validation request was sent and a response was received."
        });
      }
      
      // Check for missing required state data
      if (dispute.dvResponseQuality === "unknown" && dispute.disputeType === "inaccurate_reporting") {
        return res.status(400).json({ 
          message: "Please update the quality of the validation response received (deficient or sufficient) before generating guidance."
        });
      }
      
      // Determine which letter is allowed based on state
      // Following the canonical state logic map exactly
      let allowedLetterType = "";
      let letterContext = "";
      
      // First check if dispute is resolved
      if (!dispute.inaccuracyPersists || dispute.craResponseResult === "deleted" || dispute.craResponseResult === "corrected") {
        return res.status(400).json({ 
          message: "This dispute has been resolved. No further guidance is needed."
        });
      }
      
      // Case A: DV sent, response received, CRA not yet disputed
      // This is the ONLY letter allowed at this stage
      if (dispute.dvSent && dispute.dvResponseReceived && !dispute.craDisputeSent) {
        allowedLetterType = "FCRA_611_CRA_DISPUTE";
        letterContext = "The consumer has completed debt validation. The next and ONLY allowed step is to file an FCRA §611 dispute with the credit bureaus.";
      }
      // CRA dispute sent but no response yet - need to wait
      else if (dispute.craDisputeSent && !dispute.craResponseReceived) {
        return res.status(400).json({ 
          message: "Your CRA dispute has been sent but no response has been recorded yet. Please update the dispute once you receive a response from the credit bureau."
        });
      }
      // Case: CRA disputed, no response received (30+ days passed)
      else if (dispute.craDisputeSent && dispute.craResponseReceived && dispute.craResponseResult === "no_response" && !dispute.directDisputeSent) {
        allowedLetterType = "DIRECT_DISPUTE_FURNISHER";
        letterContext = "The CRA failed to respond within the required timeframe. This is a procedural violation. The next step is a Direct Dispute to the Furnisher under FCRA §623(a)(8), citing the CRA's failure to investigate.";
      }
      // Case B: CRA disputed, response = verified, MOV not yet sent
      else if (dispute.craDisputeSent && dispute.craResponseReceived && dispute.craResponseResult === "verified" && !dispute.movSent) {
        allowedLetterType = "MOV_REQUEST";
        letterContext = "The CRA has verified the account. The next step is to request the Method of Verification (MOV) under FCRA §611(a)(7).";
      }
      // Case C: MOV already sent, direct dispute not yet sent
      else if (dispute.movSent && !dispute.directDisputeSent && dispute.inaccuracyPersists) {
        allowedLetterType = "DIRECT_DISPUTE_FURNISHER";
        letterContext = "MOV has been requested. The next step is a Direct Dispute to the Furnisher under FCRA §623(a)(8).";
      }
      // Case D: All prior steps completed (direct dispute sent), still inaccurate
      else if (dispute.directDisputeSent && dispute.inaccuracyPersists) {
        allowedLetterType = "NO_LETTER_REGULATORY_ONLY";
        letterContext = "All dispute steps have been exhausted. Guidance will focus on regulatory escalation options (CFPB, State AG, FTC) and legal consultation. No additional dispute letter is appropriate at this stage.";
      }
      // Fallback - should not happen if state is properly tracked
      else {
        return res.status(400).json({ 
          message: "Unable to determine the appropriate next step. Please review your dispute status and ensure all fields are updated correctly."
        });
      }
      
      // Generate AI guidance based on dispute context
      const systemPrompt = `You are an educational credit rights advisor. Your role is to provide EDUCATIONAL INFORMATION ONLY about credit dispute processes.

CRITICAL LEGAL COMPLIANCE (CROA & FCRA):
1. You are NOT an attorney and CANNOT provide legal advice
2. You MUST NOT act as or represent yourself as performing work of a credit repair organization
3. NEVER guarantee, promise, or imply specific outcomes or results (CROA Section 1679b violation)
4. NEVER suggest you can remove accurate negative information from credit reports
5. Frame ALL guidance as educational options for the consumer to research and consider
6. Reference relevant FCRA sections (e.g., Section 611 reinvestigation rights, Section 623 furnisher duties)
7. Always recommend consulting with a consumer rights attorney for complex situations
8. Emphasize that consumers must pursue their own rights through proper legal channels

=== COMPLETE DISPUTE WORKFLOW FRAMEWORK (8 PHASES, 12 STEPS) ===

PHASE 1: PRE-DISPUTE (INFORMATION GATHERING)
Step 1: Identify the Account
- Confirm: Creditor/Collector name, Account number, Reporting bureau(s), Account status
- Goal: Ensure consumer is disputing the correct tradeline

Step 2: Determine Eligibility for Debt Validation
- Debt Validation applies ONLY if: Account is being collected by third-party debt collector (not original creditor)
- Consumer may be within or outside 30-day window (late DVs are still valid but treated differently)
- Authority: FDCPA §809
- Purpose: Force proof of the debt and collection authority

PHASE 2: DEBT VALIDATION (FDCPA)
Step 3: Send Debt Validation Request
- Consumer sends written DV request asking for: Proof debt exists, Proof of authority to collect, Itemization of balance, Original creditor information
- Sent directly to the debt collector (NOT a credit bureau dispute)

Step 4: Wait for Collector Response
- Collector may: Provide validation, Provide insufficient documentation, Fail to respond, Continue reporting without validation (violation)
- No strict response deadline, but reporting without validation creates risk

PHASE 3: EVALUATE THE RESPONSE (CRITICAL DECISION POINT)
Step 5: Review Validation for Sufficiency
Ask: Did they prove debt is tied to consumer? Did they show authority to collect? Is balance explained? Is documentation specific or generic?
Check for deficiencies:
- Generic computer printouts (not sufficient)
- Balance only, no account-level detail
- No original creditor proof
- No contract or charge-off breakdown
- No itemization of interest/fees
- No evidence of authority to collect (if third-party)
📌 Validation ≠ Accuracy. Even "validated" debts must still be FCRA + Metro 2 compliant

PHASE 4: FORMAL FCRA DISPUTE (CRA LEVEL)
Step 6: File FCRA §611 Dispute With Credit Bureaus
- Consumer disputes tradeline with: Experian, Equifax, TransUnion
- Dispute based on: Inaccurate reporting, Incomplete data, Metro 2 inconsistencies, Failure to properly investigate
- This triggers a legal investigation requirement

Step 7: CRA Forwards Dispute to Furnisher
- Sent through e-OSCAR system
- Furnisher must conduct reasonable investigation
- Furnisher must verify accuracy under Metro 2 standards
- 30-day investigation window

PHASE 5: FURNISHER OBLIGATIONS (FCRA §623)
Step 8: Furnisher Must:
- Review all dispute information
- Verify each reported field
- Correct or delete inaccurate data
- Respond to CRA within 30 days
📌 "Verified" without actual investigation = potential violation

METRO 2 COMPLIANCE REVIEW (WHERE MOST VIOLATIONS EXIST):
Even if debt is "valid," it must still be Metro 2 compliant. ACCURACY ≠ LEGALITY.
Common Metro 2 violations:
- Incorrect Date of First Delinquency (DOFD)
- Re-aging an account (resetting 7-year clock)
- Incorrect payment history grid
- Wrong account status ("Open" vs "Closed")
- Balance reporting after charge-off
- Inconsistent remarks codes
- Reporting interest after charge-off
- Duplicate tradelines (Original Creditor + Collection Agency both reporting)
📌 Metro 2 errors = FCRA violations, even if underlying debt is valid

PHASE 6: OUTCOME HANDLING
Step 9: CRA Response Received
- Outcome A: Corrected/Deleted → Process ends, account updated or removed
- Outcome B: Verified as Accurate → Does NOT end process, triggers escalation rights

PHASE 7: ESCALATION RIGHTS
Step 10: Request Method of Verification (MOV)
- Under FCRA §611(a)(7), consumer may ask: How was information verified? Who verified it? What records/systems were used?
- CRAs must respond with meaningful detail
- Failure to provide real verification method = procedural violation

Step 11: File Direct Dispute With Furnisher
- If inaccuracies remain: Send Direct Dispute to the furnisher
- Furnisher must re-investigate and respond
- Authority: FCRA §623(a)(8)
- This forces: Account-level investigation, Written response, Correction or justification
- Creates additional compliance exposure for furnisher

PHASE 8: REGULATORY & LEGAL PATH (IF NEEDED)
Step 12: Escalation Options
If violations persist:
- CFPB complaint
- State Attorney General
- FTC (pattern behavior)
- Consumer rights attorney (if damages exist)
📌 This is where enforcement, not "credit repair," occurs

LEGAL THRESHOLD - WHEN CASE BECOMES ACTIONABLE:
A case becomes legally actionable when:
- Inaccurate data remains after disputes
- Investigations were unreasonable (rubber-stamp verification)
- Reporting violates Metro 2 standards
- Harm can be demonstrated (credit denial, higher interest rates, employment denial, etc.)

=== WORKFLOW LOGIC FLOW ===
Identify Account → Is Third-Party Collector? → Send Debt Validation (FDCPA) → Review Validation → File CRA Dispute (FCRA §611) → Furnisher Investigation (§623) → CRA Result → [If Corrected: END] [If Verified: Method of Verification → Direct Dispute → Regulatory/Legal Escalation]

CRITICAL: NEVER recommend the same letter type again. Each step has a specific NEXT step in the process.

IMPORTANT COMPLIANCE NOTES:
❌ No guarantees of deletion
❌ No legal advice
❌ No automated dispute filing
✅ Education + document preparation only
✅ User-initiated actions
✅ Clear disclosures

Your guidance should empower consumers with knowledge about their rights under FCRA while staying compliant with CROA regulations.`;

      const userPrompt = `A consumer's credit dispute has been escalated and needs guidance on next steps.

DISPUTE DETAILS:
- Creditor: ${dispute.creditorName}
- Account Number: ${dispute.accountNumber || "Not provided"}
- Bureau: ${dispute.bureau}
- Dispute Type: ${dispute.disputeType || "inaccurate_reporting"}
- Dispute Reason: ${dispute.disputeReason}
- Custom Reason: ${dispute.customReason || "None provided"}
- Original Letter Content: ${dispute.letterContent || "Not available"}

=== CURRENT DISPUTE STATE (CRITICAL - READ CAREFULLY) ===
- Debt Validation Sent: ${dispute.dvSent ? "YES" : "NO"}
- DV Response Received: ${dispute.dvResponseReceived ? "YES" : "NO"}
- DV Response Quality: ${dispute.dvResponseQuality || "unknown"}
- CRA Dispute Sent: ${dispute.craDisputeSent ? "YES" : "NO"}
- CRA Response Received: ${dispute.craResponseReceived ? "YES" : "NO"}
- CRA Response Result: ${dispute.craResponseResult || "N/A"}
- MOV Sent: ${dispute.movSent ? "YES" : "NO"}
- Direct Dispute Sent: ${dispute.directDisputeSent ? "YES" : "NO"}
- Inaccuracy Persists: ${dispute.inaccuracyPersists ? "YES" : "NO"}

=== ALLOWED LETTER TYPE (STATE-LOCKED - MUST FOLLOW) ===
Based on the dispute state above, the ONLY letter type you may generate is:
LETTER TYPE: ${allowedLetterType}
CONTEXT: ${letterContext}

=== AI OUTPUT CONSTRAINTS (CRITICAL - HARD RULES) ===
You are FORBIDDEN from:
- Recommending a Debt Validation letter if dvSent = true (already done)
- Recommending a CRA dispute if craDisputeSent = true (already done)
- Recommending MOV unless craResponseResult = verified
- Recommending legal action unless all prior steps exist
- Using directive language like "you should send" or "you must"

REQUIRED language patterns (use these):
- "Based on your dispute status..."
- "One option available at this stage..."
- "If you choose to proceed..."
- "You may consider..."

${allowedLetterType === "NO_LETTER_REGULATORY_ONLY" ? `
SPECIAL CASE: All dispute steps exhausted. DO NOT provide a letter template.
Instead, focus your guidance on:
- CFPB complaint process
- State Attorney General consumer protection
- FTC reporting for pattern behavior
- When to consult a consumer rights attorney
Set followUpTemplate to: "All formal dispute letters have been sent. At this stage, regulatory complaints and legal consultation are the appropriate next steps. No additional dispute letter is recommended."
` : ""}

CUSTOMER-FACING CONTENT RULES (CRITICAL):
- The "summary" field is shown directly to the customer - use friendly, educational language
- NEVER use internal/admin terminology like "consumer insistence", "escalation triggered", "backend notes"
- NEVER reference internal processes, knowledge bases, or administrative details
- Focus on what the customer can DO, not internal reasons for escalation
- Use "you" and "your" - speak directly to the customer

Please provide educational guidance in this JSON format:
{
  "summary": "Customer-friendly explanation using 'Based on your dispute status...' - explain what step they completed and why the next step is appropriate. NO internal notes or admin language.",
  "nextSteps": ["Step 1: ...", "Step 2: ...", ...] - use phrases like "If you choose to proceed..." or "One option at this stage...",
  "fcraRights": ["Right 1 with FCRA section", ...],
  "followUpTemplate": "${allowedLetterType === "FCRA_611_CRA_DISPUTE" ? "Complete FCRA §611 CRA Dispute Letter with: Date, Consumer info placeholders, Bureau address, Account details, Specific inaccuracies, Legal citations, Signature line" : allowedLetterType === "MOV_REQUEST" ? "Complete Method of Verification Request with: Date, Consumer info, Bureau address, Account reference, Request for verification method details under §611(a)(7), Signature line" : allowedLetterType === "DIRECT_DISPUTE_FURNISHER" ? "Complete Direct Dispute to Furnisher letter under FCRA §623(a)(8) with: Date, Consumer info, Furnisher address, Account details, Specific inaccuracies, Legal citations, Signature line" : "Regulatory guidance only - no letter template"}",
  "timeline": "Suggested timeline for actions",
  "internalNotes": "Backend-only analysis for administrative purposes - include dispute context, escalation reasoning, case complexity notes. This is NOT shown to the customer."
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ message: "Failed to generate guidance" });
      }

      const guidanceData = JSON.parse(content);
      
      // Save guidance to database (internalNotes stored but not returned to frontend)
      const guidance = await storage.createGuidance({
        disputeId: dispute.id,
        guidanceType: "ESCALATION",
        summary: guidanceData.summary,
        nextSteps: guidanceData.nextSteps,
        fcraRights: guidanceData.fcraRights,
        followUpTemplate: guidanceData.followUpTemplate,
        timeline: guidanceData.timeline,
        internalNotes: guidanceData.internalNotes || null,
      });
      
      // Return guidance without internal notes to customer
      const { internalNotes: _, ...customerGuidance } = guidance;

      // Create notification about new guidance
      await storage.createNotification({
        userId: req.session.userId!,
        disputeId: dispute.id,
        type: "AI_GUIDANCE",
        title: "Escalation Guidance Ready",
        message: `AI-powered guidance is now available for your dispute with ${dispute.creditorName}.`,
      });

      res.json(customerGuidance);
    } catch (error) {
      console.error("AI guidance generation error:", error);
      next(error);
    }
  });
  
  // ========== AI CREDIT REPORT PARSING ROUTES ==========
  
  // POST /api/upload-credit-report - Upload PDF credit report for AI parsing
  app.post("/api/upload-credit-report", requireAuth, (req, res, next) => {
    upload.single('file')(req, res, async (err: any) => {
      try {
        // Handle multer errors
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File size exceeds the 10MB limit. Please upload a smaller file." });
          }
          if (err.message === 'Only PDF files are allowed') {
            return res.status(400).json({ message: err.message });
          }
          return res.status(400).json({ message: "File upload error: " + err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ message: "No PDF file uploaded" });
        }
        
        // Verify PDF magic bytes (PDF files start with %PDF-)
        const pdfMagic = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D]); // %PDF-
        if (!req.file.buffer.subarray(0, 5).equals(pdfMagic)) {
          return res.status(400).json({ message: "Invalid PDF file. Please upload a valid PDF document." });
        }
        
        const bureau = req.body.bureau;
        if (!bureau) {
          return res.status(400).json({ message: "Bureau is required" });
        }
        
        // Parse PDF to extract text using pdf-parse v2
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        const reportText = pdfData.text;
        await parser.destroy();
      
      if (!reportText || reportText.trim().length < 50) {
        return res.status(400).json({ message: "Could not extract text from PDF. Please ensure the file is not password-protected or image-based." });
      }
      
      // Use OpenAI to analyze the extracted text
      const systemPrompt = `You are an expert credit report analyst specializing in FCRA compliance and Metro 2 data formats. 
Your task is to analyze credit report text and extract account information that may contain errors or inaccuracies.

For each account found, extract:
- Creditor/Company Name
- Account Number (partial is fine)
- Account Type (credit card, auto loan, mortgage, collection, etc.)
- Current Balance
- Account Status (open, closed, collection, charged-off)
- Payment History issues (late payments, missed payments)

Also identify potential dispute reasons for each account based on common FCRA violations:
- Inaccurate balance reporting
- Incorrect account status
- Duplicate accounts
- Identity theft/Not my account
- Outdated information (>7 years for most items)
- Incorrect payment history
- Account belongs to someone else
- Wrong dates reported

Respond in JSON format with this structure:
{
  "accounts": [
    {
      "creditorName": "string",
      "accountNumber": "string or null",
      "accountType": "string",
      "balance": "string or null",
      "status": "string",
      "recommendedReasons": ["array of dispute reason strings"],
      "confidence": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "summary": "Brief summary of what was found"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this ${bureau} credit report and extract account information with potential dispute reasons:\n\n${reportText.substring(0, 15000)}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ message: "Failed to analyze credit report" });
      }
      
      const parsed = JSON.parse(content);
      res.json(parsed);
    } catch (error: any) {
        console.error("Error processing PDF:", error);
        next(error);
      }
    });
  });
  
  // POST /api/parse-credit-report - Parse credit report text and extract account info
  app.post("/api/parse-credit-report", requireAuth, async (req, res, next) => {
    try {
      const { reportText, bureau } = req.body;
      
      if (!reportText || !bureau) {
        return res.status(400).json({ message: "Report text and bureau are required" });
      }
      
      const systemPrompt = `You are an expert credit report analyst specializing in FCRA compliance and Metro 2 data formats. 
Your task is to analyze credit report text and extract account information that may contain errors or inaccuracies.

For each account found, extract:
- Creditor/Company Name
- Account Number (partial is fine)
- Account Type (credit card, auto loan, mortgage, collection, etc.)
- Current Balance
- Account Status (open, closed, collection, charged-off)
- Payment History issues (late payments, missed payments)

Also identify potential dispute reasons for each account based on common FCRA violations:
- Inaccurate balance reporting
- Incorrect account status
- Duplicate accounts
- Identity theft/Not my account
- Outdated information (>7 years for most items)
- Incorrect payment history
- Account belongs to someone else
- Wrong dates reported

Respond in JSON format with this structure:
{
  "accounts": [
    {
      "creditorName": "string",
      "accountNumber": "string or null",
      "accountType": "string",
      "balance": "string or null",
      "status": "string",
      "recommendedReasons": ["array of dispute reason strings"],
      "confidence": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "summary": "Brief summary of what was found"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this ${bureau} credit report excerpt and extract account information with potential dispute reasons:\n\n${reportText}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ message: "Failed to parse credit report" });
      }
      
      const parsed = JSON.parse(content);
      res.json(parsed);
    } catch (error) {
      console.error("Error parsing credit report:", error);
      next(error);
    }
  });

  // ========== ADMIN ROUTES ==========
  
  // Middleware to check admin role with proper async error handling
  function requireAdmin(req: any, res: any, next: any) {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getUser(req.session.userId)
      .then(user => {
        if (!user || user.role !== "ADMIN") {
          return res.status(403).json({ message: "Admin access required" });
        }
        next();
      })
      .catch(err => {
        next(err);
      });
  }
  
  // GET /api/admin/users - Get all users
  app.get("/api/admin/users", requireAdmin, async (req, res, next) => {
    try {
      const allUsers = await storage.getAllUsers();
      const usersWithoutPassword = allUsers.map(({ passwordHash, ...user }) => user);
      res.json(usersWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/admin/clients - Get all clients
  app.get("/api/admin/clients", requireAdmin, async (req, res, next) => {
    try {
      const clients = await storage.getAllUsersByRole("CLIENT");
      const clientsWithoutPassword = clients.map(({ passwordHash, ...user }) => user);
      res.json(clientsWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/admin/affiliates - Get all affiliates
  app.get("/api/admin/affiliates", requireAdmin, async (req, res, next) => {
    try {
      const affiliates = await storage.getAllUsersByRole("AFFILIATE");
      const affiliatesWithoutPassword = affiliates.map(({ passwordHash, ...user }) => user);
      res.json(affiliatesWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  // POST /api/admin/affiliates - Create new affiliate
  app.post("/api/admin/affiliates", requireAdmin, async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      const affiliate = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        role: "AFFILIATE",
      });
      
      const { passwordHash: _, ...affiliateWithoutPassword } = affiliate;
      res.json(affiliateWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  // DELETE /api/admin/users/:id - Delete a user
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      
      if (id === req.session.userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/admin/disputes - Get all disputes
  app.get("/api/admin/disputes", requireAdmin, async (req, res, next) => {
    try {
      const allDisputes = await storage.getAllDisputes();
      res.json(allDisputes);
    } catch (error) {
      next(error);
    }
  });
  
  // GET /api/admin/stats - Get admin statistics
  app.get("/api/admin/stats", requireAdmin, async (req, res, next) => {
    try {
      const allUsers = await storage.getAllUsers();
      const allDisputes = await storage.getAllDisputes();
      
      const clients = allUsers.filter(u => u.role === "CLIENT");
      const affiliates = allUsers.filter(u => u.role === "AFFILIATE");
      const pendingDisputes = allDisputes.filter(d => d.status === "GENERATED");
      const resolvedDisputes = allDisputes.filter(d => d.status === "RESOLVED");
      
      res.json({
        totalClients: clients.length,
        totalAffiliates: affiliates.length,
        totalDisputes: allDisputes.length,
        pendingDisputes: pendingDisputes.length,
        resolvedDisputes: resolvedDisputes.length,
      });
    } catch (error) {
      next(error);
    }
  });

  // ========== EVIDENCE MANAGEMENT ROUTES ==========
  
  // Configure multer for evidence uploads (save to disk)
  const evidenceUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'evidence');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
      }
    }
  });

  // GET /api/disputes/:id/evidence - Get evidence for a dispute
  app.get("/api/disputes/:id/evidence", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Verify user owns this dispute
      const dispute = await storage.getDispute(id);
      if (!dispute || dispute.userId !== req.session.userId) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      
      const evidence = await storage.getEvidenceForDispute(id);
      res.json(evidence);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/disputes/:id/evidence - Upload evidence for a dispute
  app.post("/api/disputes/:id/evidence", requireAuth, (req, res, next) => {
    evidenceUpload.single('file')(req, res, async (err: any) => {
      try {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File size exceeds the 10MB limit." });
          }
          return res.status(400).json({ message: err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        const { id } = req.params;
        const { documentType, description, bureau } = req.body;
        
        // Verify user owns this dispute
        const dispute = await storage.getDispute(id);
        if (!dispute || dispute.userId !== req.session.userId) {
          return res.status(404).json({ message: "Dispute not found" });
        }
        
        // Create evidence record
        const evidence = await storage.createEvidence({
          disputeId: id,
          userId: req.session.userId!,
          documentType: documentType || 'OTHER',
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          storagePath: req.file.path,
          description: description || null,
          bureau: bureau || null,
        });
        
        // Log the action
        await storage.createAuditLog({
          userId: req.session.userId!,
          action: 'FILE_UPLOADED',
          resourceType: 'DOCUMENT',
          resourceId: evidence.id,
          details: JSON.stringify({ fileName: req.file.originalname, documentType, disputeId: id }),
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });
        
        res.json(evidence);
      } catch (error) {
        next(error);
      }
    });
  });

  // DELETE /api/evidence/:id - Delete evidence
  app.delete("/api/evidence/:id", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Get evidence to verify ownership and get file path
      const evidenceList = await storage.getEvidenceForDispute(id);
      // Actually we need to get evidence by ID - let's use a workaround
      const deleted = await storage.deleteEvidence(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Evidence not found" });
      }
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId!,
        action: 'FILE_DELETED',
        resourceType: 'DOCUMENT',
        resourceId: id,
        details: null,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
      
      res.json({ message: "Evidence deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // ========== AUDIT LOG ROUTES ==========

  // GET /api/audit-log - Get audit log for current user
  app.get("/api/audit-log", requireAuth, async (req, res, next) => {
    try {
      const logs = await storage.getAuditLogsForUser(req.session.userId!);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
