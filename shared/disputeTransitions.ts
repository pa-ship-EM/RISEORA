export enum DisputeStatus {
  DRAFT = "DRAFT",
  READY_TO_MAIL = "READY_TO_MAIL",
  MAILED = "MAILED",
  IN_INVESTIGATION = "IN_INVESTIGATION",
  RESPONSE_RECEIVED = "RESPONSE_RECEIVED",
  ESCALATION_AVAILABLE = "ESCALATION_AVAILABLE",
  CLOSED = "CLOSED"
}

export type DisputeAction = 
  | "mark_mailed"
  | "add_tracking"
  | "mark_delivered"
  | "mark_response_received"
  | "mark_no_response"
  | "mark_removed"
  | "mark_verified"
  | "mark_closed";

export const VALID_TRANSITIONS: Record<string, DisputeAction[]> = {
  "DRAFT": [],
  "READY_TO_MAIL": ["mark_mailed"],
  "MAILED": ["add_tracking", "mark_delivered"],
  "IN_INVESTIGATION": ["mark_response_received", "mark_no_response"],
  "RESPONSE_RECEIVED": ["mark_removed", "mark_verified"],
  "ESCALATION_AVAILABLE": ["mark_closed"],
  "CLOSED": []
};

export function getTargetStatus(action: DisputeAction): DisputeStatus | null {
  switch (action) {
    case "mark_mailed":
      return DisputeStatus.MAILED;
    case "mark_delivered":
      return DisputeStatus.IN_INVESTIGATION;
    case "mark_response_received":
      return DisputeStatus.RESPONSE_RECEIVED;
    case "mark_no_response":
      return DisputeStatus.ESCALATION_AVAILABLE;
    case "mark_removed":
      return DisputeStatus.CLOSED;
    case "mark_verified":
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
