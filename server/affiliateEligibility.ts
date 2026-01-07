import type { Affiliate, AffiliateSurface } from "./affiliates";

type UserTier = "FREE" | "SELF_STARTER" | "GROWTH" | "COMPLIANCE_PLUS";

interface UserContext {
  tier: UserTier;
  state?: string;
  hasActiveDispute?: boolean;
}

const TIER_HIERARCHY: Record<UserTier, number> = {
  FREE: 0,
  SELF_STARTER: 1,
  GROWTH: 2,
  COMPLIANCE_PLUS: 3
};

export function canShowAffiliate(
  user: UserContext | null,
  affiliate: Affiliate,
  surface: AffiliateSurface
): boolean {
  if (!affiliate.active) {
    return false;
  }

  if (!affiliate.surfaces.includes(surface)) {
    return false;
  }

  if (affiliate.minTier) {
    const userTier = user?.tier || "FREE";
    if (TIER_HIERARCHY[userTier] < TIER_HIERARCHY[affiliate.minTier]) {
      return false;
    }
  }

  if (affiliate.excludeStates && user?.state) {
    if (affiliate.excludeStates.includes(user.state.toUpperCase())) {
      return false;
    }
  }

  if (affiliate.requiresActiveDispute && !user?.hasActiveDispute) {
    return false;
  }

  return true;
}

export function getEligibleAffiliates(
  user: UserContext | null,
  affiliates: Affiliate[],
  surface: AffiliateSurface
): Affiliate[] {
  return affiliates
    .filter(a => canShowAffiliate(user, a, surface))
    .sort((a, b) => b.priority - a.priority);
}
