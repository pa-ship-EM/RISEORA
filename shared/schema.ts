import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, serial, integer } from "drizzle-orm/pg-core";
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

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  
  tier: text("tier").notNull().default("FREE"), // FREE, SELF_STARTER, GROWTH, COMPLIANCE_PLUS
  status: text("status").notNull().default("ACTIVE"), // ACTIVE, CANCELED, PAST_DUE
  
  // Stripe integration (for future use)
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  
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
  status: text("status").notNull().default("DRAFT"), // DRAFT, GENERATED, MAILED, IN_PROGRESS, RESPONSE_RECEIVED, RESOLVED, ESCALATED
  disputeReason: text("dispute_reason").notNull(),
  customReason: text("custom_reason"),
  
  // Metro 2 compliance
  metro2Compliant: boolean("metro2_compliant").notNull().default(true),
  
  // Generated letter content
  letterContent: text("letter_content"),
  
  // Progress tracking
  mailedAt: timestamp("mailed_at"),
  trackingNumber: text("tracking_number"),
  deliveredAt: timestamp("delivered_at"),
  responseDeadline: timestamp("response_deadline"), // 30 days from mailed date
  responseReceivedAt: timestamp("response_received_at"),
  
  // Dispute workflow state fields (required for AI guidance)
  disputeType: text("dispute_type").notNull().default("inaccurate_reporting"), // inaccurate_reporting, identity_theft, mixed_file, etc.
  dvSent: boolean("dv_sent").notNull().default(false),
  dvResponseReceived: boolean("dv_response_received").notNull().default(false),
  dvResponseQuality: text("dv_response_quality").notNull().default("unknown"), // unknown, deficient, sufficient
  craDisputeSent: boolean("cra_dispute_sent").notNull().default(false),
  craResponseReceived: boolean("cra_response_received").notNull().default(false),
  craResponseResult: text("cra_response_result"), // deleted, corrected, verified, no_response
  movSent: boolean("mov_sent").notNull().default(false),
  directDisputeSent: boolean("direct_dispute_sent").notNull().default(false),
  inaccuracyPersists: boolean("inaccuracy_persists").notNull().default(true),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Dispute checklist items - user-maintained next steps
export const disputeChecklists = pgTable("dispute_checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  disputeId: varchar("dispute_id").notNull().references(() => disputes.id, { onDelete: "cascade" }),
  
  label: text("label").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User notification preferences
export const userNotificationSettings = pgTable("user_notification_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  
  emailEnabled: boolean("email_enabled").notNull().default(true),
  inAppEnabled: boolean("in_app_enabled").notNull().default(true),
  reminderLeadDays: integer("reminder_lead_days").notNull().default(5), // Days before deadline to remind
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Notifications table for AI-generated reminders
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  disputeId: varchar("dispute_id").references(() => disputes.id, { onDelete: "cascade" }),
  
  type: text("type").notNull(), // DEADLINE_APPROACHING, NO_RESPONSE, FOLLOW_UP, STATUS_UPDATE
  title: text("title").notNull(),
  message: text("message").notNull(),
  
  read: boolean("read").notNull().default(false),
  readAt: timestamp("read_at"),
  
  scheduledFor: timestamp("scheduled_for"),
  deliveredAt: timestamp("delivered_at"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// AI-generated escalation guidance for disputes
export const disputeAiGuidance = pgTable("dispute_ai_guidance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  disputeId: varchar("dispute_id").notNull().references(() => disputes.id, { onDelete: "cascade" }),
  
  guidanceType: text("guidance_type").notNull().default("ESCALATION"), // ESCALATION, FOLLOW_UP, etc.
  summary: text("summary").notNull(), // Brief analysis of the situation
  nextSteps: text("next_steps").array().notNull(), // Array of action steps
  fcraRights: text("fcra_rights").array().notNull(), // Relevant FCRA rights
  followUpTemplate: text("follow_up_template").notNull(), // Template for follow-up letter
  timeline: text("timeline").notNull(), // Suggested timeline for actions
  
  aiModel: text("ai_model").default("gpt-4o-mini"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas with validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  passwordHash: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertDisputeSchema = createInsertSchema(disputes, {
  bureau: z.enum(["EXPERIAN", "TRANSUNION", "EQUIFAX"]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions, {
  tier: z.enum(["FREE", "SELF_STARTER", "GROWTH", "COMPLIANCE_PLUS"]),
  status: z.enum(["ACTIVE", "CANCELED", "PAST_DUE"]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert schemas for new tables
export const insertDisputeChecklistSchema = createInsertSchema(disputeChecklists).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserNotificationSettingsSchema = createInsertSchema(userNotificationSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDisputeAiGuidanceSchema = createInsertSchema(disputeAiGuidance).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputes.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertDisputeChecklist = z.infer<typeof insertDisputeChecklistSchema>;
export type DisputeChecklist = typeof disputeChecklists.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertUserNotificationSettings = z.infer<typeof insertUserNotificationSettingsSchema>;
export type UserNotificationSettings = typeof userNotificationSettings.$inferSelect;
export type InsertDisputeAiGuidance = z.infer<typeof insertDisputeAiGuidanceSchema>;
export type DisputeAiGuidance = typeof disputeAiGuidance.$inferSelect;

// Default checklist items for new disputes
export const DEFAULT_DISPUTE_CHECKLIST = [
  { label: "Print the dispute letter", description: "Print your generated letter on plain white paper" },
  { label: "Gather ID documents", description: "Make copies of your driver's license or state ID" },
  { label: "Include proof of address", description: "Utility bill, bank statement, or lease agreement" },
  { label: "Include partial SSN proof", description: "Copy of SSN card with first 5 digits redacted" },
  { label: "Send via Certified Mail", description: "Use USPS Certified Mail with Return Receipt Requested" },
  { label: "Save tracking number", description: "Record your certified mail tracking number" },
  { label: "Set calendar reminder", description: "Mark 30 days from mail date for follow-up" },
];

// Dispute progress stages for UI
export const DISPUTE_STAGES = [
  { id: "generated", label: "Letter Generated", description: "Your dispute letter has been created" },
  { id: "printed", label: "Printed & Ready", description: "Letter printed with required documents" },
  { id: "mailed", label: "Mailed", description: "Sent via Certified Mail" },
  { id: "delivered", label: "Delivered", description: "Confirmed delivery to bureau" },
  { id: "investigation", label: "30-Day Investigation", description: "Bureau is investigating your dispute" },
  { id: "response", label: "Response Received", description: "Bureau has responded to your dispute" },
  { id: "resolved", label: "Resolved", description: "Dispute has been resolved" },
] as const;

// Tier feature definitions
export const TIER_FEATURES = {
  FREE: {
    name: "DIY Scholar",
    price: 0,
    disputesPerMonth: 0,
    hasDisputeWizard: false,
    hasAdvancedAnalysis: false,
    hasUnlimitedDocs: false,
    hasMetro2Education: false,
    hasPrioritySupport: false,
  },
  SELF_STARTER: {
    name: "Self-Starter",
    price: 49,
    disputesPerMonth: 3,
    hasDisputeWizard: true,
    hasAdvancedAnalysis: false,
    hasUnlimitedDocs: false,
    hasMetro2Education: false,
    hasPrioritySupport: false,
  },
  GROWTH: {
    name: "Growth",
    price: 99,
    disputesPerMonth: -1, // unlimited
    hasDisputeWizard: true,
    hasAdvancedAnalysis: true,
    hasUnlimitedDocs: true,
    hasMetro2Education: false,
    hasPrioritySupport: true,
  },
  COMPLIANCE_PLUS: {
    name: "Compliance+",
    price: 149,
    disputesPerMonth: -1, // unlimited
    hasDisputeWizard: true,
    hasAdvancedAnalysis: true,
    hasUnlimitedDocs: true,
    hasMetro2Education: true,
    hasPrioritySupport: true,
  },
} as const;

// AI Chat tables for OpenAI integration
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
