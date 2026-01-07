import { AffiliateSurfaceByState, type AffiliateStateSurface } from "./affiliateStateMatrix";
import { AFFILIATES, type Affiliate } from "./affiliates";
import { DisputeStatus } from "@shared/disputeStates";

export function resolveAffiliatesForDispute(disputeState: DisputeStatus): Affiliate[] {
  const allowedSurfaces = AffiliateSurfaceByState[disputeState] || [];

  if (allowedSurfaces.length === 0) {
    return [];
  }

  return AFFILIATES.filter(affiliate => {
    if (!affiliate.active) return false;
    if (!affiliate.allowedStateSurfaces) return false;
    
    return affiliate.allowedStateSurfaces.some((surface: AffiliateStateSurface) =>
      allowedSurfaces.includes(surface)
    );
  });
}

export function getAffiliatesForStateSurface(
  disputeState: DisputeStatus,
  surface: AffiliateStateSurface
): Affiliate[] {
  const allowedSurfaces = AffiliateSurfaceByState[disputeState] || [];
  
  if (!allowedSurfaces.includes(surface)) {
    return [];
  }

  return AFFILIATES.filter(affiliate => {
    if (!affiliate.active) return false;
    if (!affiliate.allowedStateSurfaces) return false;
    
    return affiliate.allowedStateSurfaces.includes(surface);
  });
}
