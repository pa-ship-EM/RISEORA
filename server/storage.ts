import { users, disputes, type User, type InsertUser, type Dispute, type InsertDispute } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined>;
  
  // Dispute methods
  getDisputesForUser(userId: string): Promise<Dispute[]>;
  getDispute(id: string): Promise<Dispute | undefined>;
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute | undefined>;
  deleteDispute(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Dispute methods
  async getDisputesForUser(userId: string): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.userId, userId));
  }

  async getDispute(id: string): Promise<Dispute | undefined> {
    const [dispute] = await db.select().from(disputes).where(eq(disputes.id, id));
    return dispute || undefined;
  }

  async createDispute(insertDispute: InsertDispute): Promise<Dispute> {
    const [dispute] = await db
      .insert(disputes)
      .values(insertDispute)
      .returning();
    return dispute;
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
}

export const storage = new DatabaseStorage();
