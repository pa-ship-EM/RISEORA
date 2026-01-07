import { transitionDispute, setSecurityLogger, advanceDispute, canAdvance, getValidEvents, type SecurityEvent } from "./disputeTransitions"
import { DisputeStatus, DisputeEvent, isTerminalStatus, TERMINAL_STATES } from "./disputeStates"
import { allowedTransitions, isValidStatusTransition, getNextStatuses, validateTransition } from "./transitionMap"

describe("Dispute State Machine", () => {

  describe("Valid Transitions (Happy Path)", () => {
    
    test("DRAFT → READY_TO_MAIL is valid", () => {
      const dispute = { disputeId: "D1", userId: "U1", bureau: "Equifax", status: DisputeStatus.DRAFT }
      const result = transitionDispute(dispute, DisputeStatus.READY_TO_MAIL)
      expect(result.status).toBe(DisputeStatus.READY_TO_MAIL)
    })

    test("READY_TO_MAIL → MAILED is valid", () => {
      const dispute = { disputeId: "D2", userId: "U1", bureau: "Equifax", status: DisputeStatus.READY_TO_MAIL }
      const result = transitionDispute(dispute, DisputeStatus.MAILED)
      expect(result.status).toBe(DisputeStatus.MAILED)
    })

    test("MAILED → DELIVERED is valid", () => {
      const dispute = { disputeId: "D3", userId: "U1", bureau: "Experian", status: DisputeStatus.MAILED }
      const result = transitionDispute(dispute, DisputeStatus.DELIVERED)
      expect(result.status).toBe(DisputeStatus.DELIVERED)
    })

    test("DELIVERED → IN_INVESTIGATION is valid", () => {
      const dispute = { disputeId: "D4", userId: "U1", bureau: "TransUnion", status: DisputeStatus.DELIVERED }
      const result = transitionDispute(dispute, DisputeStatus.IN_INVESTIGATION)
      expect(result.status).toBe(DisputeStatus.IN_INVESTIGATION)
    })

    test("IN_INVESTIGATION → RESPONSE_RECEIVED is valid", () => {
      const dispute = { disputeId: "D5", userId: "U1", bureau: "Equifax", status: DisputeStatus.IN_INVESTIGATION }
      const result = transitionDispute(dispute, DisputeStatus.RESPONSE_RECEIVED)
      expect(result.status).toBe(DisputeStatus.RESPONSE_RECEIVED)
    })

    test("IN_INVESTIGATION → NO_RESPONSE is valid", () => {
      const dispute = { disputeId: "D6", userId: "U1", bureau: "Experian", status: DisputeStatus.IN_INVESTIGATION }
      const result = transitionDispute(dispute, DisputeStatus.NO_RESPONSE)
      expect(result.status).toBe(DisputeStatus.NO_RESPONSE)
    })

    test("RESPONSE_RECEIVED → REMOVED is valid", () => {
      const dispute = { disputeId: "D7", userId: "U1", bureau: "TransUnion", status: DisputeStatus.RESPONSE_RECEIVED }
      const result = transitionDispute(dispute, DisputeStatus.REMOVED)
      expect(result.status).toBe(DisputeStatus.REMOVED)
    })

    test("RESPONSE_RECEIVED → VERIFIED is valid", () => {
      const dispute = { disputeId: "D8", userId: "U1", bureau: "Equifax", status: DisputeStatus.RESPONSE_RECEIVED }
      const result = transitionDispute(dispute, DisputeStatus.VERIFIED)
      expect(result.status).toBe(DisputeStatus.VERIFIED)
    })

    test("REMOVED → CLOSED is valid", () => {
      const dispute = { disputeId: "D9", userId: "U1", bureau: "Experian", status: DisputeStatus.REMOVED }
      const result = transitionDispute(dispute, DisputeStatus.CLOSED)
      expect(result.status).toBe(DisputeStatus.CLOSED)
    })

    test("VERIFIED → ESCALATION_AVAILABLE is valid", () => {
      const dispute = { disputeId: "D10", userId: "U1", bureau: "TransUnion", status: DisputeStatus.VERIFIED }
      const result = transitionDispute(dispute, DisputeStatus.ESCALATION_AVAILABLE)
      expect(result.status).toBe(DisputeStatus.ESCALATION_AVAILABLE)
    })

    test("NO_RESPONSE → ESCALATION_AVAILABLE is valid", () => {
      const dispute = { disputeId: "D11", userId: "U1", bureau: "Equifax", status: DisputeStatus.NO_RESPONSE }
      const result = transitionDispute(dispute, DisputeStatus.ESCALATION_AVAILABLE)
      expect(result.status).toBe(DisputeStatus.ESCALATION_AVAILABLE)
    })

  })

  describe("Event-Driven Transitions (advanceDispute)", () => {

    test("DRAFT + ALL_DOCS_UPLOADED → READY_TO_MAIL", () => {
      const dispute = { disputeId: "E1", userId: "U1", bureau: "Equifax", status: DisputeStatus.DRAFT }
      const result = advanceDispute(dispute, "ALL_DOCS_UPLOADED")
      expect(result.status).toBe(DisputeStatus.READY_TO_MAIL)
    })

    test("READY_TO_MAIL + USER_CONFIRMED_MAILING → MAILED", () => {
      const dispute = { disputeId: "E2", userId: "U1", bureau: "Equifax", status: DisputeStatus.READY_TO_MAIL }
      const result = advanceDispute(dispute, "USER_CONFIRMED_MAILING")
      expect(result.status).toBe(DisputeStatus.MAILED)
    })

    test("MAILED + TRACKING_SHOWS_DELIVERED → DELIVERED", () => {
      const dispute = { disputeId: "E3", userId: "U1", bureau: "Experian", status: DisputeStatus.MAILED }
      const result = advanceDispute(dispute, "TRACKING_SHOWS_DELIVERED")
      expect(result.status).toBe(DisputeStatus.DELIVERED)
    })

    test("DELIVERED + INVESTIGATION_STARTED → IN_INVESTIGATION", () => {
      const dispute = { disputeId: "E4", userId: "U1", bureau: "TransUnion", status: DisputeStatus.DELIVERED }
      const result = advanceDispute(dispute, "INVESTIGATION_STARTED")
      expect(result.status).toBe(DisputeStatus.IN_INVESTIGATION)
    })

    test("IN_INVESTIGATION + BUREAU_RESPONDED → RESPONSE_RECEIVED", () => {
      const dispute = { disputeId: "E5", userId: "U1", bureau: "Equifax", status: DisputeStatus.IN_INVESTIGATION }
      const result = advanceDispute(dispute, "BUREAU_RESPONDED")
      expect(result.status).toBe(DisputeStatus.RESPONSE_RECEIVED)
    })

    test("IN_INVESTIGATION + DEADLINE_PASSED → NO_RESPONSE", () => {
      const dispute = { disputeId: "E6", userId: "U1", bureau: "Experian", status: DisputeStatus.IN_INVESTIGATION }
      const result = advanceDispute(dispute, "DEADLINE_PASSED")
      expect(result.status).toBe(DisputeStatus.NO_RESPONSE)
    })

    test("RESPONSE_RECEIVED + ITEM_REMOVED → REMOVED", () => {
      const dispute = { disputeId: "E7", userId: "U1", bureau: "TransUnion", status: DisputeStatus.RESPONSE_RECEIVED }
      const result = advanceDispute(dispute, "ITEM_REMOVED")
      expect(result.status).toBe(DisputeStatus.REMOVED)
    })

    test("RESPONSE_RECEIVED + ITEM_VERIFIED → VERIFIED", () => {
      const dispute = { disputeId: "E8", userId: "U1", bureau: "Equifax", status: DisputeStatus.RESPONSE_RECEIVED }
      const result = advanceDispute(dispute, "ITEM_VERIFIED")
      expect(result.status).toBe(DisputeStatus.VERIFIED)
    })

    test("VERIFIED + USER_ESCALATED → ESCALATION_AVAILABLE", () => {
      const dispute = { disputeId: "E9", userId: "U1", bureau: "Experian", status: DisputeStatus.VERIFIED }
      const result = advanceDispute(dispute, "USER_ESCALATED")
      expect(result.status).toBe(DisputeStatus.ESCALATION_AVAILABLE)
    })

    test("NO_RESPONSE + USER_ESCALATED → ESCALATION_AVAILABLE", () => {
      const dispute = { disputeId: "E10", userId: "U1", bureau: "TransUnion", status: DisputeStatus.NO_RESPONSE }
      const result = advanceDispute(dispute, "USER_ESCALATED")
      expect(result.status).toBe(DisputeStatus.ESCALATION_AVAILABLE)
    })

    test("REMOVED + USER_CLOSED → CLOSED", () => {
      const dispute = { disputeId: "E11", userId: "U1", bureau: "Equifax", status: DisputeStatus.REMOVED }
      const result = advanceDispute(dispute, "USER_CLOSED")
      expect(result.status).toBe(DisputeStatus.CLOSED)
    })

    test("invalid event for state throws error", () => {
      const dispute = { disputeId: "E12", userId: "U1", bureau: "Equifax", status: DisputeStatus.DRAFT }
      expect(() => advanceDispute(dispute, "USER_CLOSED")).toThrow("Invalid transition")
    })

    test("applying wrong event to state throws error", () => {
      const dispute = { disputeId: "E13", userId: "U1", bureau: "Experian", status: DisputeStatus.MAILED }
      expect(() => advanceDispute(dispute, "ITEM_REMOVED")).toThrow()
    })

  })

  describe("Event Validation Helpers", () => {

    test("canAdvance returns true for valid event on state", () => {
      expect(canAdvance(DisputeStatus.DRAFT, "ALL_DOCS_UPLOADED")).toBe(true)
      expect(canAdvance(DisputeStatus.IN_INVESTIGATION, "BUREAU_RESPONDED")).toBe(true)
      expect(canAdvance(DisputeStatus.IN_INVESTIGATION, "DEADLINE_PASSED")).toBe(true)
    })

    test("canAdvance returns false for invalid event on state", () => {
      expect(canAdvance(DisputeStatus.DRAFT, "USER_CLOSED")).toBe(false)
      expect(canAdvance(DisputeStatus.CLOSED, "ALL_DOCS_UPLOADED")).toBe(false)
    })

    test("getValidEvents returns correct events for each state", () => {
      const draftEvents = getValidEvents(DisputeStatus.DRAFT)
      expect(draftEvents).toContain("ALL_DOCS_UPLOADED")
      expect(draftEvents).toHaveLength(1)

      const investigationEvents = getValidEvents(DisputeStatus.IN_INVESTIGATION)
      expect(investigationEvents).toContain("BUREAU_RESPONDED")
      expect(investigationEvents).toContain("DEADLINE_PASSED")
      expect(investigationEvents).toHaveLength(2)
    })

    test("terminal states have no valid events", () => {
      const closedEvents = getValidEvents(DisputeStatus.CLOSED)
      expect(closedEvents).toHaveLength(0)

      const escalationEvents = getValidEvents(DisputeStatus.ESCALATION_AVAILABLE)
      expect(escalationEvents).toHaveLength(0)
    })

  })

  describe("Illegal Transitions", () => {

    test("cannot skip from DRAFT to MAILED", () => {
      const dispute = { disputeId: "D1", userId: "U1", bureau: "Equifax", status: DisputeStatus.DRAFT }
      expect(() => transitionDispute(dispute, DisputeStatus.MAILED)).toThrow("Illegal transition")
    })

    test("cannot go from MAILED directly to REMOVED", () => {
      const dispute = { disputeId: "D2", userId: "U2", bureau: "Experian", status: DisputeStatus.MAILED }
      expect(() => transitionDispute(dispute, DisputeStatus.REMOVED)).toThrow()
    })

    test("cannot escalate before verification or timeout", () => {
      const dispute = { disputeId: "D3", userId: "U3", bureau: "TransUnion", status: DisputeStatus.IN_INVESTIGATION }
      expect(() => transitionDispute(dispute, DisputeStatus.ESCALATION_AVAILABLE)).toThrow()
    })

    test("cannot change state after CLOSED", () => {
      const dispute = { disputeId: "D4", userId: "U4", bureau: "Equifax", status: DisputeStatus.CLOSED }
      expect(() => transitionDispute(dispute, DisputeStatus.VERIFIED)).toThrow()
    })

    test("cannot go backwards from DELIVERED to MAILED", () => {
      const dispute = { disputeId: "D5", userId: "U5", bureau: "Experian", status: DisputeStatus.DELIVERED }
      expect(() => transitionDispute(dispute, DisputeStatus.MAILED)).toThrow()
    })

    test("cannot skip from DRAFT directly to CLOSED", () => {
      const dispute = { disputeId: "D6", userId: "U6", bureau: "TransUnion", status: DisputeStatus.DRAFT }
      expect(() => transitionDispute(dispute, DisputeStatus.CLOSED)).toThrow()
    })

  })

  describe("Terminal States", () => {

    test("CLOSED is a terminal state", () => {
      expect(isTerminalStatus(DisputeStatus.CLOSED)).toBe(true)
    })

    test("DRAFT is not a terminal state", () => {
      expect(isTerminalStatus(DisputeStatus.DRAFT)).toBe(false)
    })

    test("ESCALATION_AVAILABLE has no allowed transitions", () => {
      const nextStatuses = getNextStatuses(DisputeStatus.ESCALATION_AVAILABLE)
      expect(nextStatuses).toHaveLength(0)
    })

    test("CLOSED has no allowed transitions", () => {
      const nextStatuses = getNextStatuses(DisputeStatus.CLOSED)
      expect(nextStatuses).toHaveLength(0)
    })

    test("TERMINAL_STATES contains CLOSED", () => {
      expect(TERMINAL_STATES).toContain(DisputeStatus.CLOSED)
    })

  })

  describe("Transition Validation Helpers", () => {

    test("isValidStatusTransition returns true for valid transitions", () => {
      expect(isValidStatusTransition(DisputeStatus.DRAFT, DisputeStatus.READY_TO_MAIL)).toBe(true)
      expect(isValidStatusTransition(DisputeStatus.MAILED, DisputeStatus.DELIVERED)).toBe(true)
    })

    test("isValidStatusTransition returns false for invalid transitions", () => {
      expect(isValidStatusTransition(DisputeStatus.DRAFT, DisputeStatus.MAILED)).toBe(false)
      expect(isValidStatusTransition(DisputeStatus.CLOSED, DisputeStatus.DRAFT)).toBe(false)
    })

    test("getNextStatuses returns correct options for branching states", () => {
      const fromInvestigation = getNextStatuses(DisputeStatus.IN_INVESTIGATION)
      expect(fromInvestigation).toContain(DisputeStatus.RESPONSE_RECEIVED)
      expect(fromInvestigation).toContain(DisputeStatus.NO_RESPONSE)
      expect(fromInvestigation).toHaveLength(2)
    })

    test("validateTransition throws for invalid transitions", () => {
      expect(() => validateTransition(DisputeStatus.DRAFT, DisputeStatus.CLOSED)).toThrow("Invalid transition")
    })

    test("validateTransition does not throw for valid transitions", () => {
      expect(() => validateTransition(DisputeStatus.DRAFT, DisputeStatus.READY_TO_MAIL)).not.toThrow()
    })

  })

  describe("Security Logging", () => {

    test("illegal transitions trigger security logger", () => {
      const loggedEvents: SecurityEvent[] = []
      setSecurityLogger((event) => loggedEvents.push(event))

      const dispute = { disputeId: "SEC1", userId: "U1", bureau: "Equifax", status: DisputeStatus.DRAFT }
      
      try {
        transitionDispute(dispute, DisputeStatus.MAILED)
      } catch (e) {
        // Expected to throw
      }

      expect(loggedEvents).toHaveLength(1)
      expect(loggedEvents[0].reason).toBe("ILLEGAL_TRANSITION")
      expect(loggedEvents[0].attemptedFrom).toBe(DisputeStatus.DRAFT)
      expect(loggedEvents[0].attemptedTo).toBe(DisputeStatus.MAILED)
    })

  })

  describe("Transition Map Completeness", () => {

    test("all dispute statuses have transition rules defined", () => {
      const allStatuses = Object.values(DisputeStatus)
      
      allStatuses.forEach(status => {
        expect(allowedTransitions).toHaveProperty(status)
      })
    })

    test("all statuses have well-defined transition arrays (even if empty)", () => {
      const allStatuses = Object.values(DisputeStatus)
      
      allStatuses.forEach(status => {
        const transitions = allowedTransitions[status]
        expect(Array.isArray(transitions)).toBe(true)
      })
    })

  })

})
