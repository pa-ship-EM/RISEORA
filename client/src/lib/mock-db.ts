import { MockDatabase, User, Dispute } from "./schema";

// Initial Mock Data
const initialUsers: User[] = [
  {
    id: "user-1",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "CLIENT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user-test",
    email: "test@riseora.org",
    firstName: "Test",
    lastName: "Account",
    role: "CLIENT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user-2",
    email: "sarah@partner.com",
    firstName: "Sarah",
    lastName: "Partner",
    role: "AFFILIATE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user-3",
    email: "admin@riseora.org",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialDisputes: Dispute[] = [
  {
    id: "disp-1",
    userId: "user-1",
    creditorName: "Chase Bank",
    bureau: "EXPERIAN",
    status: "IN_PROGRESS",
    disputeReason: "Late Payment",
    dateCreated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    lastUpdated: new Date().toISOString(),
    metro2Compliant: true
  },
  {
    id: "disp-2",
    userId: "user-1",
    creditorName: "Midland Credit",
    bureau: "ALL",
    status: "SENT",
    disputeReason: "Collection",
    dateCreated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    lastUpdated: new Date().toISOString(),
    metro2Compliant: true
  }
];

// Singleton Mock DB
class MockDBService {
  private db: MockDatabase;

  constructor() {
    this.db = {
      users: initialUsers,
      subscriptions: [],
      disputes: initialDisputes,
      educationModules: [],
      moduleProgress: [],
      passwordResetTokens: []
    };
  }

  // User Methods
  getUserByEmail(email: string): User | undefined {
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  // Dispute Methods
  getDisputesForUser(userId: string): Dispute[] {
    return this.db.disputes.filter(d => d.userId === userId);
  }

  createDispute(dispute: Omit<Dispute, "id" | "dateCreated" | "lastUpdated">): Dispute {
    const newDispute: Dispute = {
      ...dispute,
      id: `disp-${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    this.db.disputes.push(newDispute);
    return newDispute;
  }
}

export const mockDb = new MockDBService();
