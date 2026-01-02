import type { Express } from "express";
import { createServer, type Server } from "http";
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
          updateData.status = "IN_PROGRESS";
          break;
        case "mark_response_received":
          updateData.responseReceivedAt = new Date();
          updateData.status = "RESPONSE_RECEIVED";
          break;
        case "mark_resolved":
          updateData.status = "RESOLVED";
          break;
        case "mark_escalated":
          updateData.status = "ESCALATED";
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
      
      const guidance = await storage.getGuidanceForDispute(req.params.id);
      res.json(guidance || null);
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
      
      // Generate AI guidance based on dispute context
      const systemPrompt = `You are an expert credit dispute advisor focused on FCRA and CROA compliance. 
Your role is to provide educational guidance on next steps when a credit dispute has not been resolved satisfactorily.

IMPORTANT COMPLIANCE RULES:
- You are providing educational information only, NOT legal advice
- You must never guarantee specific outcomes or results
- All suggestions must be framed as educational options for the consumer to consider
- Reference relevant FCRA sections when applicable (e.g., Section 611, Section 623)
- Emphasize that consumers have rights but must pursue them through proper channels

Provide structured, actionable educational guidance that empowers the consumer to understand their options.`;

      const userPrompt = `A consumer's credit dispute has been escalated and needs guidance on next steps.

DISPUTE DETAILS:
- Creditor: ${dispute.creditorName}
- Account Number: ${dispute.accountNumber || "Not provided"}
- Bureau: ${dispute.bureau}
- Dispute Type: ${dispute.disputeType}
- Reason: ${dispute.disputeReason}
- Original Letter Content: ${dispute.letterContent || "Not available"}

Please provide:
1. A brief summary of why the dispute may have been escalated
2. 3-5 specific next steps the consumer can take (educational guidance)
3. Relevant FCRA rights that apply to this situation
4. Template language they might use in follow-up communications
5. Estimated timeline for next actions

Format your response as a JSON object with these exact fields:
{
  "summary": "Brief analysis of the situation",
  "nextSteps": ["Step 1", "Step 2", ...],
  "fcraRights": ["Right 1 with FCRA section", ...],
  "followUpTemplate": "Template language for follow-up letter",
  "timeline": "Suggested timeline for actions"
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
      
      // Save guidance to database
      const guidance = await storage.createGuidance({
        disputeId: dispute.id,
        guidanceType: "ESCALATION",
        summary: guidanceData.summary,
        nextSteps: guidanceData.nextSteps,
        fcraRights: guidanceData.fcraRights,
        followUpTemplate: guidanceData.followUpTemplate,
        timeline: guidanceData.timeline,
      });

      // Create notification about new guidance
      await storage.createNotification({
        userId: req.session.userId!,
        disputeId: dispute.id,
        type: "AI_GUIDANCE",
        title: "Escalation Guidance Ready",
        message: `AI-powered guidance is now available for your dispute with ${dispute.creditorName}.`,
      });

      res.json(guidance);
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

  return httpServer;
}
