import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with encrypted sensitive fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("CLIENT"), // CLIENT, AFFILIATE, ADMIN
  
  // Encrypted sensitive fields (stored encrypted at rest)
  addressEncrypted: text("address_encrypted"), // Full address
  cityEncrypted: text("city_encrypted"),
  stateEncrypted: text("state_encrypted"),
  zipEncrypted: text("zip_encrypted"),
  dobEncrypted: text("dob_encrypted"), // Date of birth
  ssnLast4Encrypted: text("ssn_last4_encrypted"), // Last 4 SSN digits
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Disputes table
export const disputes = pgTable("disputes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Dispute details
  creditorName: text("creditor_name").notNull(),
  accountNumber: text("account_number"),
  bureau: text("bureau").notNull(), // EXPERIAN, TRANSUNION, EQUIFAX
  status: text("status").notNull().default("DRAFT"), // DRAFT, GENERATED, SENT, IN_PROGRESS, RESOLVED
  disputeReason: text("dispute_reason").notNull(),
  customReason: text("custom_reason"),
  
  // Metro 2 compliance
  metro2Compliant: boolean("metro2_compliant").notNull().default(true),
  
  // Generated letter content
  letterContent: text("letter_content"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas with validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  passwordHash: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputes.$inferSelect;
