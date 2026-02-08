import { DisputeStatus } from "@shared/disputeStates";

export type AffiliateStateSurface =
  | "WORKFLOW_COMPLETION"
  | "EDUCATION_FOLLOWUP"
  | "RESOURCE_PAGE";

export const AffiliateSurfaceByState: Record<DisputeStatus, AffiliateStateSurface[]> = {
  [DisputeStatus.DRAFT]: [],
  [DisputeStatus.ADVISOR_PENDING]: [],
  [DisputeStatus.PENDING_CLIENT_APPROVAL]: ["WORKFLOW_COMPLETION"],
  [DisputeStatus.READY_TO_MAIL]: ["WORKFLOW_COMPLETION"],
  [DisputeStatus.MAILED]: ["EDUCATION_FOLLOWUP"],
  [DisputeStatus.DELIVERED]: ["EDUCATION_FOLLOWUP"],
  [DisputeStatus.IN_INVESTIGATION]: ["EDUCATION_FOLLOWUP"],
  [DisputeStatus.RESPONSE_RECEIVED]: ["EDUCATION_FOLLOWUP"],
  [DisputeStatus.REMOVED]: ["RESOURCE_PAGE"],
  [DisputeStatus.VERIFIED]: ["EDUCATION_FOLLOWUP", "RESOURCE_PAGE"],
  [DisputeStatus.NO_RESPONSE]: ["EDUCATION_FOLLOWUP"],
  [DisputeStatus.ESCALATION_AVAILABLE]: ["EDUCATION_FOLLOWUP"],
  [DisputeStatus.CLOSED]: ["RESOURCE_PAGE"],
};

export function getAllowedAffiliateSurfaces(disputeStatus: DisputeStatus): AffiliateStateSurface[] {
  return AffiliateSurfaceByState[disputeStatus] || [];
}

export function canShowAffiliateForDispute(
  disputeStatus: DisputeStatus,
  surface: AffiliateStateSurface
): boolean {
  const allowedSurfaces = AffiliateSurfaceByState[disputeStatus];
  return allowedSurfaces.includes(surface);
}
