import { DisputeStatus, DisputeEvent } from "./disputeStates";
import { isValidStatusTransition, validateTransition, getNextStatuses } from "./transitionMap";

export { DisputeStatus } from "./disputeStates";
export type { DisputeEvent } from "./disputeStates";
export { isValidStatusTransition, validateTransition, getNextStatuses } from "./transitionMap";

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

interface DisputeState {
  disputeId?: string;
  userId?: string;
  bureau?: string;
  status: DisputeStatus;
  [key: string]: any;
}

const STATE_MACHINE: Record<DisputeStatus, Partial<Record<DisputeEvent, DisputeStatus>>> = {
  [DisputeStatus.DRAFT]: {
    "ALL_DOCS_UPLOADED": DisputeStatus.READY_TO_MAIL,
  },
  [DisputeStatus.READY_TO_MAIL]: {
    "USER_CONFIRMED_MAILING": DisputeStatus.MAILED,
  },
  [DisputeStatus.MAILED]: {
    "TRACKING_SHOWS_DELIVERED": DisputeStatus.DELIVERED,
  },
  [DisputeStatus.DELIVERED]: {
    "INVESTIGATION_STARTED": DisputeStatus.IN_INVESTIGATION,
  },
  [DisputeStatus.IN_INVESTIGATION]: {
    "BUREAU_RESPONDED": DisputeStatus.RESPONSE_RECEIVED,
    "DEADLINE_PASSED": DisputeStatus.NO_RESPONSE,
  },
  [DisputeStatus.RESPONSE_RECEIVED]: {
    "ITEM_REMOVED": DisputeStatus.REMOVED,
    "ITEM_VERIFIED": DisputeStatus.VERIFIED,
  },
  [DisputeStatus.REMOVED]: {
    "USER_CLOSED": DisputeStatus.CLOSED,
  },
  [DisputeStatus.VERIFIED]: {
    "USER_ESCALATED": DisputeStatus.ESCALATION_AVAILABLE,
  },
  [DisputeStatus.NO_RESPONSE]: {
    "USER_ESCALATED": DisputeStatus.ESCALATION_AVAILABLE,
  },
  [DisputeStatus.ESCALATION_AVAILABLE]: {},
  [DisputeStatus.CLOSED]: {},
};

const EVENT_TO_ACTION: Record<DisputeEvent, DisputeAction> = {
  "ALL_DOCS_UPLOADED": "mark_ready",
  "USER_CONFIRMED_MAILING": "mark_mailed",
  "TRACKING_SHOWS_DELIVERED": "mark_delivered",
  "INVESTIGATION_STARTED": "start_investigation",
  "BUREAU_RESPONDED": "mark_response_received",
  "DEADLINE_PASSED": "mark_no_response",
  "ITEM_REMOVED": "mark_removed",
  "ITEM_VERIFIED": "mark_verified",
  "USER_ESCALATED": "mark_escalation",
  "USER_CLOSED": "mark_closed",
};

export function advanceDispute<T extends DisputeState>(dispute: T, event: DisputeEvent): T {
  const currentStatus = dispute.status;
  const transitions = STATE_MACHINE[currentStatus];
  
  if (!transitions || !(event in transitions)) {
    throw new Error(`Invalid transition: cannot apply '${event}' when status is '${currentStatus}'`);
  }
  
  const newStatus = transitions[event]!;
  
  validateTransition(currentStatus, newStatus);
  
  return { ...dispute, status: newStatus };
}

export function canAdvance(status: DisputeStatus, event: DisputeEvent): boolean {
  const transitions = STATE_MACHINE[status];
  return transitions !== undefined && event in transitions;
}

export function getValidEvents(status: DisputeStatus): DisputeEvent[] {
  const transitions = STATE_MACHINE[status];
  if (!transitions) return [];
  return Object.keys(transitions) as DisputeEvent[];
}

export function eventToAction(event: DisputeEvent): DisputeAction {
  return EVENT_TO_ACTION[event];
}

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
  "ESCALATION_AVAILABLE": [],
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
