import {
  type User, type InsertUser, type Dispute, type InsertDispute, type Subscription, type InsertSubscription,
  type DisputeChecklist, type InsertDisputeChecklist, type Notification, type InsertNotification,
  type UserNotificationSettings, type InsertUserNotificationSettings,
  type DisputeAiGuidance, type InsertDisputeAiGuidance,
  type DisputeEvidence, type InsertDisputeEvidence,
  type AuditLog, type InsertAuditLog,
  type CreditReport, type InsertCreditReport,
  type CreditReportAccount, type InsertCreditReportAccount,
  type EducationModule, type InsertEducationModule, type Quiz, type InsertQuiz,
  type UserLearningProgress, type InsertUserLearningProgress,
  DEFAULT_DISPUTE_CHECKLIST,
  users, disputes, subscriptions, disputeChecklists, notifications, userNotificationSettings, disputeAiGuidance,
  disputeEvidence, auditLog, creditReports, creditReportAccounts, educationModules, quizzes, userLearningProgress
} from "@shared/schema";
import { db, withRetry } from "./db";
import { eq, and, lt, isNull, desc, inArray } from "drizzle-orm";
import { supabase, VAULT_BUCKET } from "./supabase";
import { maskSensitiveData } from "./encryption";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  countUsers(): Promise<number>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined>;

  // Subscription methods
  getSubscriptionForUser(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(userId: string, data: Partial<Subscription>): Promise<Subscription | undefined>;

  // Dispute methods
  getDisputesForUser(userId: string): Promise<Dispute[]>;
  getDispute(id: string): Promise<Dispute | undefined>;
  getDisputesByAdvisor(advisorId: string): Promise<Dispute[]>;
  getAdvisorClients(advisorId: string): Promise<User[]>;
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  createDisputesBulk(disputesData: InsertDispute[]): Promise<Dispute[]>;
  updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute | undefined>;
  deleteDispute(id: string): Promise<boolean>;
  countDisputesForUser(userId: string): Promise<number>;
  countDisputesByBureauLast30Days(userId: string, bureau: string): Promise<number>;

  // Dispute checklist methods
  getChecklistForDispute(disputeId: string): Promise<DisputeChecklist[]>;
  createChecklistItems(items: InsertDisputeChecklist[]): Promise<DisputeChecklist[]>;
  updateChecklistItem(id: string, data: Partial<DisputeChecklist>): Promise<DisputeChecklist | undefined>;
  createDefaultChecklistForDispute(disputeId: string): Promise<DisputeChecklist[]>;

  // Notification methods
  getNotificationsForUser(userId: string): Promise<Notification[]>;
  getUnreadNotificationsForUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsRead(userId: string): Promise<void>;

  // Notification settings methods
  getNotificationSettings(userId: string): Promise<UserNotificationSettings | undefined>;
  upsertNotificationSettings(userId: string, data: Partial<InsertUserNotificationSettings>): Promise<UserNotificationSettings>;

  // Get disputes needing deadline reminders
  getDisputesNeedingReminders(): Promise<Dispute[]>;

  // Admin methods
  getAllUsers(): Promise<User[]>;
  getAllUsersByRole(role: string): Promise<User[]>;
  getAllDisputes(): Promise<Dispute[]>;
  deleteUser(id: string): Promise<boolean>;

  // AI Guidance methods
  getGuidanceForDispute(disputeId: string): Promise<DisputeAiGuidance | undefined>;
  createGuidance(guidance: InsertDisputeAiGuidance): Promise<DisputeAiGuidance>;

  // Evidence methods
  getEvidenceForDispute(disputeId: string): Promise<DisputeEvidence[]>;
  createEvidence(evidence: InsertDisputeEvidence): Promise<DisputeEvidence>;
  deleteEvidence(id: string): Promise<boolean>;
  getEvidenceById(id: string): Promise<DisputeEvidence | undefined>;
  getAllEvidenceForUser(userId: string): Promise<DisputeEvidence[]>;

  // Audit log methods
  getAuditLogsForUser(userId: string): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  // Credit report methods
  getCreditReportsForUser(userId: string): Promise<CreditReport[]>;
  getCreditReport(id: string): Promise<CreditReport | undefined>;
  createCreditReport(report: InsertCreditReport): Promise<CreditReport>;
  updateCreditReport(id: string, data: Partial<CreditReport>): Promise<CreditReport | undefined>;
  deleteCreditReport(id: string): Promise<boolean>;

  // Credit report account methods
  getAccountsForReport(reportId: string): Promise<CreditReportAccount[]>;
  getAccountsForUser(userId: string): Promise<CreditReportAccount[]>;
  createCreditReportAccounts(accounts: InsertCreditReportAccount[]): Promise<CreditReportAccount[]>;
  linkAccountToDispute(accountId: string, disputeId: string): Promise<CreditReportAccount | undefined>;

  // Education methods
  getAllEducationModules(): Promise<EducationModule[]>;
  getEducationModule(id: string): Promise<EducationModule | undefined>;
  getUserLearningProgress(userId: string): Promise<UserLearningProgress[]>;
  getModuleProgressForUser(userId: string, moduleId: string): Promise<UserLearningProgress | undefined>;
  updateUserLearningProgress(userId: string, moduleId: string, data: Partial<InsertUserLearningProgress>): Promise<UserLearningProgress>;
  getQuizForModule(moduleId: string): Promise<Quiz | undefined>;
  createEducationModule(module: InsertEducationModule): Promise<EducationModule>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Signed URL methods
  getSignedUrl(path: string): Promise<string | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return withRetry(async () => {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return withRetry(async () => {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return withRetry(async () => {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    });
  }

  async countUsers(): Promise<number> {
    return withRetry(async () => {
      const result = await db.select().from(users);
      return result.length;
    });
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Subscription methods
  async getSubscriptionForUser(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subscription || undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async updateSubscription(userId: string, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptions.userId, userId))
      .returning();
    return subscription || undefined;
  }

  // Dispute methods
  async getDisputesForUser(userId: string): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.userId, userId));
  }

  async countDisputesForUser(userId: string): Promise<number> {
    const result = await db.select().from(disputes).where(eq(disputes.userId, userId));
    return result.length;
  }

  async countDisputesByBureauLast30Days(userId: string, bureau: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = await db.select().from(disputes).where(
      and(
        eq(disputes.userId, userId),
        eq(disputes.bureau, bureau)
      )
    );
    return result.filter(d => d.createdAt && new Date(d.createdAt) >= thirtyDaysAgo).length;
  }

  async getDispute(id: string): Promise<Dispute | undefined> {
    const [dispute] = await db.select().from(disputes).where(eq(disputes.id, id));
    return dispute || undefined;
  }

  async getDisputesByAdvisor(advisorId: string): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.preparedBy, advisorId));
  }

  async getAdvisorClients(advisorId: string): Promise<User[]> {
    // Get unique userIds from disputes prepared by this advisor
    const advisorDisputes = await this.getDisputesByAdvisor(advisorId);
    const clientIds = Array.from(new Set(advisorDisputes.map(d => d.userId)));
    if (clientIds.length === 0) return [];

    return await db.select().from(users).where(inArray(users.id, clientIds));
  }

  async createDispute(insertDispute: InsertDispute): Promise<Dispute> {
    const [dispute] = await db
      .insert(disputes)
      .values(insertDispute)
      .returning();
    return dispute;
  }

  async createDisputesBulk(disputesData: InsertDispute[]): Promise<Dispute[]> {
    if (disputesData.length === 0) return [];
    const result = await db
      .insert(disputes)
      .values(disputesData)
      .returning();
    return result;
  }

  async updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute | undefined> {
    const [dispute] = await db
      .update(disputes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(disputes.id, id))
      .returning();
    return dispute || undefined;
  }

  async deleteDispute(id: string): Promise<boolean> {
    const result = await db.delete(disputes).where(eq(disputes.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Dispute checklist methods
  async getChecklistForDispute(disputeId: string): Promise<DisputeChecklist[]> {
    return await db.select().from(disputeChecklists)
      .where(eq(disputeChecklists.disputeId, disputeId))
      .orderBy(disputeChecklists.orderIndex);
  }

  async createChecklistItems(items: InsertDisputeChecklist[]): Promise<DisputeChecklist[]> {
    if (items.length === 0) return [];
    const result = await db.insert(disputeChecklists).values(items).returning();
    return result;
  }

  async updateChecklistItem(id: string, data: Partial<DisputeChecklist>): Promise<DisputeChecklist | undefined> {
    const updateData = { ...data };
    if (data.completed === true && !data.completedAt) {
      updateData.completedAt = new Date();
    }
    if (data.completed === false) {
      updateData.completedAt = null;
    }
    const [item] = await db.update(disputeChecklists)
      .set(updateData)
      .where(eq(disputeChecklists.id, id))
      .returning();
    return item || undefined;
  }

  async createDefaultChecklistForDispute(disputeId: string): Promise<DisputeChecklist[]> {
    const items = DEFAULT_DISPUTE_CHECKLIST.map((item, index) => ({
      disputeId,
      label: item.label,
      description: item.description,
      orderIndex: index,
      completed: false,
    }));
    return await this.createChecklistItems(items);
  }

  // Notification methods
  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationsForUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [notif] = await db.insert(notifications).values(notification).returning();
    return notif;
  }

  async markNotificationRead(id: string): Promise<Notification | undefined> {
    const [notif] = await db.update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return notif || undefined;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db.update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ));
  }

  // Notification settings methods
  async getNotificationSettings(userId: string): Promise<UserNotificationSettings | undefined> {
    const [settings] = await db.select().from(userNotificationSettings)
      .where(eq(userNotificationSettings.userId, userId));
    return settings || undefined;
  }

  async upsertNotificationSettings(userId: string, data: Partial<InsertUserNotificationSettings>): Promise<UserNotificationSettings> {
    const existing = await this.getNotificationSettings(userId);
    if (existing) {
      const [updated] = await db.update(userNotificationSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userNotificationSettings.userId, userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userNotificationSettings)
      .values({ userId, ...data })
      .returning();
    return created;
  }

  // Get disputes needing deadline reminders (30-day response deadline approaching)
  async getDisputesNeedingReminders(): Promise<Dispute[]> {
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

    return await db.select().from(disputes)
      .where(and(
        lt(disputes.responseDeadline, fiveDaysFromNow),
        isNull(disputes.responseReceivedAt)
      ));
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users)
      .where(eq(users.role, role))
      .orderBy(desc(users.createdAt));
  }

  async getAllDisputes(): Promise<Dispute[]> {
    return await db.select().from(disputes).orderBy(desc(disputes.createdAt));
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // AI Guidance methods
  async getGuidanceForDispute(disputeId: string): Promise<DisputeAiGuidance | undefined> {
    const [guidance] = await db.select().from(disputeAiGuidance)
      .where(eq(disputeAiGuidance.disputeId, disputeId))
      .orderBy(desc(disputeAiGuidance.createdAt))
      .limit(1);
    return guidance || undefined;
  }

  async createGuidance(guidance: InsertDisputeAiGuidance): Promise<DisputeAiGuidance> {
    const [created] = await db.insert(disputeAiGuidance)
      .values(guidance)
      .returning();
    return created;
  }

  // Evidence methods
  async getEvidenceForDispute(disputeId: string): Promise<DisputeEvidence[]> {
    return await db.select().from(disputeEvidence)
      .where(eq(disputeEvidence.disputeId, disputeId))
      .orderBy(desc(disputeEvidence.createdAt));
  }

  async createEvidence(evidence: InsertDisputeEvidence): Promise<DisputeEvidence> {
    const [created] = await db.insert(disputeEvidence)
      .values(evidence)
      .returning();
    return created;
  }

  async deleteEvidence(id: string): Promise<boolean> {
    const result = await db.delete(disputeEvidence)
      .where(eq(disputeEvidence.id, id))
      .returning();
    return result.length > 0;
  }

  async getEvidenceById(id: string): Promise<DisputeEvidence | undefined> {
    const [evidence] = await db.select().from(disputeEvidence)
      .where(eq(disputeEvidence.id, id));
    return evidence || undefined;
  }

  async getAllEvidenceForUser(userId: string): Promise<DisputeEvidence[]> {
    return await db.select().from(disputeEvidence)
      .where(eq(disputeEvidence.userId, userId))
      .orderBy(desc(disputeEvidence.createdAt));
  }

  // Audit log methods
  async getAuditLogsForUser(userId: string): Promise<AuditLog[]> {
    return await db.select().from(auditLog)
      .where(eq(auditLog.userId, userId))
      .orderBy(desc(auditLog.createdAt))
      .limit(100);
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    // Sanitize details if present
    const sanitizedLog = { ...log };
    if (sanitizedLog.details) {
      try {
        const detailsObj = JSON.parse(sanitizedLog.details);
        sanitizedLog.details = JSON.stringify(maskSensitiveData(detailsObj));
      } catch (e) {
        // Not JSON, just keep as is or log warning
      }
    }
    const [created] = await db.insert(auditLog)
      .values(sanitizedLog)
      .returning();
    return created;
  }

  // Credit report methods
  async getCreditReportsForUser(userId: string): Promise<CreditReport[]> {
    return await db.select().from(creditReports)
      .where(eq(creditReports.userId, userId))
      .orderBy(desc(creditReports.createdAt));
  }

  async getCreditReport(id: string): Promise<CreditReport | undefined> {
    const [report] = await db.select().from(creditReports)
      .where(eq(creditReports.id, id));
    return report || undefined;
  }

  async createCreditReport(report: InsertCreditReport): Promise<CreditReport> {
    const [created] = await db.insert(creditReports)
      .values(report)
      .returning();
    return created;
  }

  async updateCreditReport(id: string, data: Partial<CreditReport>): Promise<CreditReport | undefined> {
    const [updated] = await db.update(creditReports)
      .set(data)
      .where(eq(creditReports.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCreditReport(id: string): Promise<boolean> {
    const result = await db.delete(creditReports)
      .where(eq(creditReports.id, id))
      .returning();
    return result.length > 0;
  }

  // Credit report account methods
  async getAccountsForReport(reportId: string): Promise<CreditReportAccount[]> {
    return await db.select().from(creditReportAccounts)
      .where(eq(creditReportAccounts.reportId, reportId))
      .orderBy(desc(creditReportAccounts.createdAt));
  }

  async getAccountsForUser(userId: string): Promise<CreditReportAccount[]> {
    return await db.select().from(creditReportAccounts)
      .where(eq(creditReportAccounts.userId, userId))
      .orderBy(desc(creditReportAccounts.createdAt));
  }

  async createCreditReportAccounts(accounts: InsertCreditReportAccount[]): Promise<CreditReportAccount[]> {
    if (accounts.length === 0) return [];
    return await db.insert(creditReportAccounts)
      .values(accounts)
      .returning();
  }

  async linkAccountToDispute(accountId: string, disputeId: string): Promise<CreditReportAccount | undefined> {
    const [updated] = await db.update(creditReportAccounts)
      .set({ disputeId })
      .where(eq(creditReportAccounts.id, accountId))
      .returning();
    return updated || undefined;
  }

  // Education methods
  async getAllEducationModules(): Promise<EducationModule[]> {
    return await db.select().from(educationModules).orderBy(educationModules.orderIndex);
  }

  async getEducationModule(id: string): Promise<EducationModule | undefined> {
    const [module] = await db.select().from(educationModules).where(eq(educationModules.id, id));
    return module || undefined;
  }

  async getUserLearningProgress(userId: string): Promise<UserLearningProgress[]> {
    return await db.select().from(userLearningProgress).where(eq(userLearningProgress.userId, userId));
  }

  async getModuleProgressForUser(userId: string, moduleId: string): Promise<UserLearningProgress | undefined> {
    const [progress] = await db.select()
      .from(userLearningProgress)
      .where(and(eq(userLearningProgress.userId, userId), eq(userLearningProgress.moduleId, moduleId)));
    return progress || undefined;
  }

  async updateUserLearningProgress(userId: string, moduleId: string, data: Partial<InsertUserLearningProgress>): Promise<UserLearningProgress> {
    const existing = await this.getModuleProgressForUser(userId, moduleId);
    if (existing) {
      const [updated] = await db.update(userLearningProgress)
        .set({ ...data, lastAccessedAt: new Date() })
        .where(eq(userLearningProgress.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userLearningProgress)
      .values({ userId, moduleId, ...data })
      .returning();
    return created;
  }

  async getQuizForModule(moduleId: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.moduleId, moduleId));
    return quiz || undefined;
  }

  async createEducationModule(module: InsertEducationModule): Promise<EducationModule> {
    const [created] = await db.insert(educationModules).values(module).returning();
    return created;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [created] = await db.insert(quizzes).values(quiz).returning();
    return created;
  }

  async getSignedUrl(path: string): Promise<string | undefined> {
    const { data, error } = await supabase.storage
      .from(VAULT_BUCKET)
      .createSignedUrl(path, 3600); // 1 hour expiration

    if (error || !data) {
      console.error("Error creating signed URL:", error);
      return undefined;
    }

    return data.signedUrl;
  }
}

export const storage = new DatabaseStorage();
