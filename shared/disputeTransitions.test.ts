import { transitionDispute } from "./disputeTransitions"
import { DisputeStatus } from "./disputeStates"

describe("Illegal Dispute State Transitions", () => {

  test("cannot skip from DRAFT to MAILED", () => {
    const dispute = {
      disputeId: "D1",
      userId: "U1",
      bureau: "Equifax",
      status: DisputeStatus.DRAFT
    }

    expect(() =>
      transitionDispute(dispute, DisputeStatus.MAILED)
    ).toThrow("Illegal transition")
  })

  test("cannot go from MAILED directly to REMOVED", () => {
    const dispute = {
      disputeId: "D2",
      userId: "U2",
      bureau: "Experian",
      status: DisputeStatus.MAILED
    }

    expect(() =>
      transitionDispute(dispute, DisputeStatus.REMOVED)
    ).toThrow()
  })

  test("cannot escalate before verification or timeout", () => {
    const dispute = {
      disputeId: "D3",
      userId: "U3",
      bureau: "TransUnion",
      status: DisputeStatus.IN_INVESTIGATION
    }

    expect(() =>
      transitionDispute(dispute, DisputeStatus.ESCALATION_AVAILABLE)
    ).toThrow()
  })

  test("cannot change state after CLOSED", () => {
    const dispute = {
      disputeId: "D4",
      userId: "U4",
      bureau: "Equifax",
      status: DisputeStatus.CLOSED
    }

    expect(() =>
      transitionDispute(dispute, DisputeStatus.VERIFIED)
    ).toThrow()
  })

})
