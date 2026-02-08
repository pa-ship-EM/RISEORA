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
  birthYearEncrypted: text("birth_year_encrypted"), // Birth year only (not full DOB) for compliance
  ssnLast4Encrypted: text("ssn_last4_encrypted"), // Last 4 SSN digits only

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
  status: text("status").notNull().default("DRAFT"), // DRAFT, READY_TO_MAIL, MAILED, DELIVERED, IN_INVESTIGATION, RESPONSE_RECEIVED, REMOVED, VERIFIED, NO_RESPONSE, ESCALATION_AVAILABLE, CLOSED
  disputeReason: text("dispute_reason").notNull(),
  customReason: text("custom_reason"),

  // Metro 2 compliance
  metro2Compliant: boolean("metro2_compliant").notNull().default(true),

  // 5-Step Template Tracking
  templateStage: text("template_stage").notNull().default("INVESTIGATION_REQUEST"), // INVESTIGATION_REQUEST, PERSONAL_INFO_REMOVER, VALIDATION_OF_DEBT, FACTUAL_LETTER, TERMINATION_LETTER, AI_ESCALATION
  templateStageStartedAt: timestamp("template_stage_started_at"),

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

  // Advisor & Compliance Workflow
  preparedBy: varchar("prepared_by").references(() => users.id), // ID of advisor who prepared the letter
  approvedBy: varchar("approved_by").references(() => users.id), // ID of client who approved the letter
  approvalIp: text("approval_ip"),
  approvalUserAgent: text("approval_user_agent"),
  approvedAt: timestamp("approved_at"),

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
  summary: text("summary").notNull(), // Customer-facing educational summary (no internal notes)
  nextSteps: text("next_steps").array().notNull(), // Array of action steps
  fcraRights: text("fcra_rights").array().notNull(), // Relevant FCRA rights
  followUpTemplate: text("follow_up_template").notNull(), // Template for follow-up letter
  timeline: text("timeline").notNull(), // Suggested timeline for actions
  internalNotes: text("internal_notes"), // Backend-only notes (not shown to customer)

  aiModel: text("ai_model").default("gpt-4o-mini"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Evidence documents attached to disputes
export const disputeEvidence = pgTable("dispute_evidence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  disputeId: varchar("dispute_id").notNull().references(() => disputes.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),

  documentType: text("document_type").notNull(), // ID, PROOF_OF_ADDRESS, SSN_CARD, UTILITY_BILL, FTC_REPORT, CREDIT_REPORT, OTHER
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // bytes
  mimeType: text("mime_type").notNull(),
  storagePath: text("storage_path").notNull(), // path to file in storage

  description: text("description"), // optional user note
  bureau: text("bureau"), // optional: attach to specific bureau (EXPERIAN, TRANSUNION, EQUIFAX)

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Audit log for user actions (user-visible activity tracking)
export const auditLog = pgTable("audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),

  action: text("action").notNull(), // LETTER_GENERATED, DISPUTE_CREATED, FILE_UPLOADED, STATUS_UPDATED, etc.
  resourceType: text("resource_type").notNull(), // DISPUTE, DOCUMENT, PROFILE, etc.
  resourceId: varchar("resource_id"), // ID of the affected resource

  details: text("details"), // JSON string with action-specific details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

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

export const insertDisputeEvidenceSchema = createInsertSchema(disputeEvidence, {
  documentType: z.enum(["ID", "PROOF_OF_ADDRESS", "SSN_CARD", "UTILITY_BILL", "FTC_REPORT", "CREDIT_REPORT", "OTHER"]),
  bureau: z.enum(["EXPERIAN", "TRANSUNION", "EQUIFAX"]).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLog, {
  action: z.enum([
    "LETTER_GENERATED",
    "DISPUTE_CREATED",
    "DISPUTE_UPDATED",
    "FILE_UPLOADED",
    "FILE_DELETED",
    "FILE_VIEWED",
    "FILE_DOWNLOADED",
    "STATUS_UPDATED",
    "PROFILE_UPDATED",
    "PASSWORD_CHANGED",
    "LOGIN",
    "LOGOUT",
    "DISPUTE_APPROVED",
    "ADVISOR_PREPARATION"
  ]),
  resourceType: z.enum(["DISPUTE", "DOCUMENT", "PROFILE", "SESSION", "ADVISOR"]),
}).omit({
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
export type InsertDisputeEvidence = z.infer<typeof insertDisputeEvidenceSchema>;
export type DisputeEvidence = typeof disputeEvidence.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLog.$inferSelect;

// Default checklist items for new disputes
export const DEFAULT_DISPUTE_CHECKLIST = [
  { label: "Print the dispute letter", description: "Print your generated letter on plain white paper" },
  { label: "Gather ID documents", description: "Make copies of your driver's license or state ID" },
  { label: "Include proof of address", description: "Utility bill, bank statement, or lease agreement" },
  { label: "Include partial SSN proof", description: "Copy of SSN card with first 5 digits redacted" },
  { label: "Add supporting documents from credit report", description: "Include highlighted pages from your credit report showing the disputed accounts" },
  { label: "Send via Certified Mail", description: "Use USPS Certified Mail with Return Receipt Requested" },
  { label: "Save tracking number", description: "Record your certified mail tracking number" },
  { label: "Set calendar reminder", description: "Mark 30 days from mail date for follow-up" },
];

// Dispute progress stages for UI
export const DISPUTE_STAGES = [
  { id: "DRAFT", label: "Draft", description: "Your dispute letter is being prepared" },
  { id: "READY_TO_MAIL", label: "Ready to Mail", description: "Letter generated and ready to send" },
  { id: "MAILED", label: "Mailed", description: "Sent via Certified Mail" },
  { id: "DELIVERED", label: "Delivered", description: "Confirmed delivery to bureau" },
  { id: "IN_INVESTIGATION", label: "In Investigation", description: "Bureau is investigating (30 days)" },
  { id: "RESPONSE_RECEIVED", label: "Response Received", description: "Bureau has responded" },
  { id: "REMOVED", label: "Removed", description: "Item removed from credit report" },
  { id: "VERIFIED", label: "Verified", description: "Bureau verified the account" },
  { id: "NO_RESPONSE", label: "No Response", description: "Bureau failed to respond in 30 days" },
  { id: "ESCALATION_AVAILABLE", label: "Escalation Available", description: "Ready for next steps" },
  { id: "CLOSED", label: "Closed", description: "Dispute process complete" },
] as const;

// Tier feature definitions
export const TIER_FEATURES = {
  FREE: {
    name: "Free Trial",
    price: 0,
    disputesPerMonth: 0,
    hasDisputeWizard: false,
    hasAdvancedAnalysis: false,
    hasUnlimitedDocs: false,
    hasMetro2Education: false,
    hasPrioritySupport: false,
    hasEscalationPrep: false,
    hasStrategyIntelligence: false,
    hasAdvancedTemplates: false,
    hasAdvisorSupport: false,
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
    hasEscalationPrep: false,
    hasStrategyIntelligence: false,
    hasAdvancedTemplates: false,
    hasAdvisorSupport: false,
  },
  GROWTH: {
    name: "RiseOra Pro",
    price: 99,
    disputesPerMonth: -1, // unlimited
    hasDisputeWizard: true,
    hasAdvancedAnalysis: true,
    hasUnlimitedDocs: true,
    hasMetro2Education: false,
    hasPrioritySupport: true,
    hasEscalationPrep: false,
    hasStrategyIntelligence: false,
    hasAdvancedTemplates: false,
    hasAdvisorSupport: false,
  },
  COMPLIANCE_PLUS: {
    name: "RiseOra Elite",
    price: 149,
    disputesPerMonth: -1, // unlimited
    hasDisputeWizard: true,
    hasAdvancedAnalysis: true,
    hasUnlimitedDocs: true,
    hasMetro2Education: true,
    hasPrioritySupport: true,
    hasEscalationPrep: true,
    hasStrategyIntelligence: true,
    hasAdvancedTemplates: true,
    hasAdvisorSupport: true,
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

// Credit Reports table - stores uploaded credit report files
export const creditReports = pgTable("credit_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),

  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  bureau: text("bureau"), // EXPERIAN, TRANSUNION, EQUIFAX, or null if unknown
  reportDate: timestamp("report_date"), // Date the report was generated

  // Processing status
  status: text("status").notNull().default("PENDING"), // PENDING, PROCESSING, COMPLETED, FAILED
  errorMessage: text("error_message"),

  // Extracted summary (high-level stats)
  totalAccounts: integer("total_accounts"),
  negativeAccounts: integer("negative_accounts"),

  storagePath: text("storage_path"), // path to file in secure storage

  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Credit Report Accounts - extracted account info from reports
export const creditReportAccounts = pgTable("credit_report_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportId: varchar("report_id").notNull().references(() => creditReports.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),

  // Account details
  creditorName: text("creditor_name").notNull(),
  accountNumber: text("account_number"), // Last 4 or masked
  accountType: text("account_type"), // CREDIT_CARD, MORTGAGE, AUTO_LOAN, COLLECTION, etc.

  // Status indicators
  accountStatus: text("account_status"), // OPEN, CLOSED, COLLECTION, CHARGE_OFF, etc.
  paymentStatus: text("payment_status"), // CURRENT, LATE_30, LATE_60, LATE_90, LATE_120+
  isNegative: boolean("is_negative").notNull().default(false),

  // Financial details
  balance: integer("balance"), // Current balance in cents
  creditLimit: integer("credit_limit"), // Credit limit in cents
  highBalance: integer("high_balance"), // Highest balance in cents
  monthlyPayment: integer("monthly_payment"), // Monthly payment in cents

  // Dates
  dateOpened: timestamp("date_opened"),
  lastReportedDate: timestamp("last_reported_date"),

  // Raw extracted text for reference
  rawText: text("raw_text"),

  // Dispute linkage
  disputeId: varchar("dispute_id").references(() => disputes.id),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCreditReportSchema = createInsertSchema(creditReports).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertCreditReportAccountSchema = createInsertSchema(creditReportAccounts).omit({
  id: true,
  createdAt: true,
});

export type CreditReport = typeof creditReports.$inferSelect;
export type InsertCreditReport = z.infer<typeof insertCreditReportSchema>;
export type CreditReportAccount = typeof creditReportAccounts.$inferSelect;
export type InsertCreditReportAccount = z.infer<typeof insertCreditReportAccountSchema>;

// Education Modules table for free tier
export const educationModules = pgTable("education_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(), // Markdown or HTML content
  orderIndex: integer("order_index").notNull().default(0),
  estimatedMinutes: integer("estimated_minutes").notNull().default(5),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Quizzes for education modules
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull().references(() => educationModules.id, { onDelete: "cascade" }),
  questions: text("questions").notNull(), // JSON string of questions
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User learning progress tracking
export const userLearningProgress = pgTable("user_learning_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: varchar("module_id").notNull().references(() => educationModules.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  quizScore: integer("quiz_score"), // percentage or raw score
  lastAccessedAt: timestamp("last_accessed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas for new tables
export const insertEducationModuleSchema = createInsertSchema(educationModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertUserLearningProgressSchema = createInsertSchema(userLearningProgress).omit({
  id: true,
  createdAt: true,
});

export type EducationModule = typeof educationModules.$inferSelect;
export type InsertEducationModule = z.infer<typeof insertEducationModuleSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type UserLearningProgress = typeof userLearningProgress.$inferSelect;
export type InsertUserLearningProgress = z.infer<typeof insertUserLearningProgressSchema>;
