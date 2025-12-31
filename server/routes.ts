import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { insertUserSchema, insertDisputeSchema, type User } from "@shared/schema";
import { z } from "zod";
import { encryptUserData, decryptUserData } from "./encryption";

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
      
      // Set session
      req.session.userId = user.id;
      
      // Return user (without password)
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
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
      
      // Set session
      req.session.userId = user.id;
      
      // Return user (without password)
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
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

  return httpServer;
}
