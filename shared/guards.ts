export function canCreateDispute(
  disputesPerBureauLast30Days: number
): boolean {
  return disputesPerBureauLast30Days < 3
}

export function isFirstDispute(
  totalDisputes: number
): boolean {
  return totalDisputes === 0
}

export function escalationAllowed(status: string): boolean {
  return status === "VERIFIED" || status === "NO_RESPONSE"
}
