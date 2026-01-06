export enum DisputeStatus {
  DRAFT = "DRAFT",
  READY_TO_MAIL = "READY_TO_MAIL",
  MAILED = "MAILED",
  DELIVERED = "DELIVERED",
  IN_INVESTIGATION = "IN_INVESTIGATION",
  RESPONSE_RECEIVED = "RESPONSE_RECEIVED",
  REMOVED = "REMOVED",
  VERIFIED = "VERIFIED",
  NO_RESPONSE = "NO_RESPONSE",
  ESCALATION_AVAILABLE = "ESCALATION_AVAILABLE",
  CLOSED = "CLOSED"
}

export type DisputeAction = 
  | "mark_ready"
  | "mark_mailed"
  | "add_tracking"
  | "mark_delivered"
  | "start_investigation"
  | "mark_response_received"
  | "mark_no_response"
  | "mark_removed"
  | "mark_verified"
  | "mark_escalation"
  | "mark_closed";

export const VALID_TRANSITIONS: Record<string, DisputeAction[]> = {
  "DRAFT": ["mark_ready"],
  "READY_TO_MAIL": ["mark_mailed"],
  "MAILED": ["add_tracking", "mark_delivered"],
  "DELIVERED": ["start_investigation"],
  "IN_INVESTIGATION": ["mark_response_received", "mark_no_response"],
  "RESPONSE_RECEIVED": ["mark_removed", "mark_verified"],
  "REMOVED": ["mark_closed"],
  "VERIFIED": ["mark_escalation"],
  "NO_RESPONSE": ["mark_escalation"],
  "ESCALATION_AVAILABLE": ["mark_closed"],
  "CLOSED": []
};

export function getTargetStatus(action: DisputeAction): DisputeStatus | null {
  switch (action) {
    case "mark_ready":
      return DisputeStatus.READY_TO_MAIL;
    case "mark_mailed":
      return DisputeStatus.MAILED;
    case "mark_delivered":
      return DisputeStatus.DELIVERED;
    case "start_investigation":
      return DisputeStatus.IN_INVESTIGATION;
    case "mark_response_received":
      return DisputeStatus.RESPONSE_RECEIVED;
    case "mark_no_response":
      return DisputeStatus.NO_RESPONSE;
    case "mark_removed":
      return DisputeStatus.REMOVED;
    case "mark_verified":
      return DisputeStatus.VERIFIED;
    case "mark_escalation":
      return DisputeStatus.ESCALATION_AVAILABLE;
    case "mark_closed":
      return DisputeStatus.CLOSED;
    case "add_tracking":
      return null;
    default:
      return null;
  }
}

export function isValidTransition(currentStatus: string, action: DisputeAction): boolean {
  const allowedActions = VALID_TRANSITIONS[currentStatus] || [];
  return allowedActions.includes(action);
}

export function isTerminalStatus(status: DisputeStatus): boolean {
  return status === DisputeStatus.CLOSED;
}

export function canGenerateGuidance(status: DisputeStatus): boolean {
  return status === DisputeStatus.ESCALATION_AVAILABLE;
}

export function getInvestigationDeadlineDays(disputeType: string): number {
  return disputeType === "identity_theft" ? 45 : 30;
}

export function getStatusStage(status: string): number {
  const stages: Record<string, number> = {
    "DRAFT": 0,
    "READY_TO_MAIL": 1,
    "MAILED": 2,
    "DELIVERED": 3,
    "IN_INVESTIGATION": 4,
    "RESPONSE_RECEIVED": 5,
    "REMOVED": 6,
    "VERIFIED": 6,
    "NO_RESPONSE": 6,
    "ESCALATION_AVAILABLE": 7,
    "CLOSED": 8
  };
  return stages[status] ?? 0;
}

export const TOTAL_STAGES = 8;
