import { DisputeStatus } from "./disputeStates"

export const allowedTransitions: Record<DisputeStatus, DisputeStatus[]> = {
  [DisputeStatus.DRAFT]: [DisputeStatus.READY_TO_MAIL, DisputeStatus.ADVISOR_PENDING],
  [DisputeStatus.ADVISOR_PENDING]: [DisputeStatus.PENDING_CLIENT_APPROVAL, DisputeStatus.DRAFT],
  [DisputeStatus.PENDING_CLIENT_APPROVAL]: [DisputeStatus.READY_TO_MAIL, DisputeStatus.ADVISOR_PENDING],
  [DisputeStatus.READY_TO_MAIL]: [DisputeStatus.MAILED],
  [DisputeStatus.MAILED]: [DisputeStatus.DELIVERED],
  [DisputeStatus.DELIVERED]: [DisputeStatus.IN_INVESTIGATION],
  [DisputeStatus.IN_INVESTIGATION]: [DisputeStatus.RESPONSE_RECEIVED, DisputeStatus.NO_RESPONSE],
  [DisputeStatus.RESPONSE_RECEIVED]: [DisputeStatus.REMOVED, DisputeStatus.VERIFIED],
  [DisputeStatus.REMOVED]: [DisputeStatus.CLOSED],
  [DisputeStatus.VERIFIED]: [DisputeStatus.ESCALATION_AVAILABLE],
  [DisputeStatus.NO_RESPONSE]: [DisputeStatus.ESCALATION_AVAILABLE],
  [DisputeStatus.ESCALATION_AVAILABLE]: [],
  [DisputeStatus.CLOSED]: []
}

export function isValidStatusTransition(from: DisputeStatus, to: DisputeStatus): boolean {
  const allowed = allowedTransitions[from];
  return allowed ? allowed.includes(to) : false;
}

export function getNextStatuses(status: DisputeStatus): DisputeStatus[] {
  return allowedTransitions[status] || [];
}

export function validateTransition(from: DisputeStatus, to: DisputeStatus): void {
  if (!isValidStatusTransition(from, to)) {
    throw new Error(`Invalid transition: cannot move from '${from}' to '${to}'`);
  }
}
