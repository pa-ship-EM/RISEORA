export type Role = 'CLIENT' | 'AFFILIATE' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  passwordHash?: string; // Mock only
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: 'STARTER' | 'PROFESSIONAL' | 'PREMIER';
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Dispute {
  id: string;
  userId: string;
  creditorName: string;
  accountNumber?: string;
  bureau: 'EXPERIAN' | 'TRANSUNION' | 'EQUIFAX' | 'ALL';
  status: 'DRAFT' | 'GENERATED' | 'SENT' | 'IN_PROGRESS' | 'RESOLVED' | 'DELETED';
  disputeReason: string;
  dateCreated: string;
  lastUpdated: string;
  metro2Compliant: boolean; // Field for Premium tier feature
}

export interface EducationModule {
  id: string;
  title: string;
  description: string;
  contentUrl: string;
  order: number;
}

export interface ModuleProgress {
  id: string;
  userId: string;
  moduleId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

// Mock Database State Interface
export interface MockDatabase {
  users: User[];
  subscriptions: Subscription[];
  disputes: Dispute[];
  educationModules: EducationModule[];
  moduleProgress: ModuleProgress[];
  passwordResetTokens: PasswordResetToken[];
}
