export const BLOCKED_SURFACES = [
  "CHECKOUT",
  "PAYMENT_CONFIRMATION",
  "BILLING_EMAIL",
  "UPGRADE_MODAL"
] as const;

export type BlockedSurface = typeof BLOCKED_SURFACES[number];

export function assertAffiliateAllowed(surface: string): void {
  const upperSurface = surface.toUpperCase();
  if (BLOCKED_SURFACES.includes(upperSurface as BlockedSurface)) {
    throw new Error(`Affiliate rendering blocked on surface: ${surface}`);
  }
}

export function isBlockedSurface(surface: string): boolean {
  return BLOCKED_SURFACES.includes(surface.toUpperCase() as BlockedSurface);
}
