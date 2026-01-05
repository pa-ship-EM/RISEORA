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

export type SubscriptionTier = 'FREE' | 'PRO' | 'ELITE';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Dispute {
  id: string;
  userId: string;
  creditorName: string;
  accountNumber?: string | null;
  bureau: 'EXPERIAN' | 'TRANSUNION' | 'EQUIFAX' | 'ALL';
  status: 'DRAFT' | 'GENERATED' | 'MAILED' | 'SENT' | 'IN_PROGRESS' | 'RESPONSE_RECEIVED' | 'RESOLVED' | 'ESCALATED' | 'DELETED';
  disputeReason: string;
  customReason?: string | null;
  letterContent?: string | null;
  dateCreated?: string;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  metro2Compliant: boolean;
  mailedAt?: string | null;
  trackingNumber?: string | null;
  deliveredAt?: string | null;
  responseDeadline?: string | null;
  responseReceivedAt?: string | null;
  
  // Dispute workflow state fields (for AI guidance)
  disputeType?: string;
  dvSent?: boolean;
  dvResponseReceived?: boolean;
  dvResponseQuality?: string; // unknown, deficient, sufficient
  craDisputeSent?: boolean;
  craResponseReceived?: boolean;
  craResponseResult?: string | null; // deleted, corrected, verified, no_response
  movSent?: boolean;
  directDisputeSent?: boolean;
  inaccuracyPersists?: boolean;
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

export type DocumentType = 'ID' | 'PROOF_OF_ADDRESS' | 'SSN_CARD' | 'UTILITY_BILL' | 'FTC_REPORT' | 'CREDIT_REPORT' | 'OTHER';

export interface DisputeEvidence {
  id: string;
  disputeId: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  description?: string | null;
  bureau?: 'EXPERIAN' | 'TRANSUNION' | 'EQUIFAX' | null;
  createdAt: string;
}

export type AuditAction = 
  | 'LETTER_GENERATED' 
  | 'DISPUTE_CREATED' 
  | 'DISPUTE_UPDATED'
  | 'FILE_UPLOADED' 
  | 'FILE_DELETED'
  | 'STATUS_UPDATED' 
  | 'PROFILE_UPDATED'
  | 'PASSWORD_CHANGED'
  | 'LOGIN'
  | 'LOGOUT';

export type AuditResourceType = 'DISPUTE' | 'DOCUMENT' | 'PROFILE' | 'SESSION';

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
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
