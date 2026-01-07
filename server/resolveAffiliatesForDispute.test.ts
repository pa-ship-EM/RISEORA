import { DisputeStatus } from "../shared/disputeStates"
import { resolveAffiliatesForDispute, getAffiliatesForStateSurface } from "./resolveAffiliatesForDispute"
import { AFFILIATES } from "./affiliates"

describe("resolveAffiliatesForDispute", () => {

  describe("State-Based Resolution", () => {

    test("DRAFT returns no affiliates (no value delivered)", () => {
      const affiliates = resolveAffiliatesForDispute(DisputeStatus.DRAFT)
      expect(affiliates).toHaveLength(0)
    })

    test("READY_TO_MAIL returns affiliates with WORKFLOW_COMPLETION surface", () => {
      const affiliates = resolveAffiliatesForDispute(DisputeStatus.READY_TO_MAIL)
      
      affiliates.forEach(a => {
        expect(a.allowedStateSurfaces).toContain("WORKFLOW_COMPLETION")
      })
    })

    test("MAILED returns affiliates with EDUCATION_FOLLOWUP surface", () => {
      const affiliates = resolveAffiliatesForDispute(DisputeStatus.MAILED)
      
      affiliates.forEach(a => {
        expect(a.allowedStateSurfaces).toContain("EDUCATION_FOLLOWUP")
      })
    })

    test("CLOSED returns affiliates with RESOURCE_PAGE surface", () => {
      const affiliates = resolveAffiliatesForDispute(DisputeStatus.CLOSED)
      
      affiliates.forEach(a => {
        expect(a.allowedStateSurfaces).toContain("RESOURCE_PAGE")
      })
    })

  })

  describe("Affiliate Filtering", () => {

    test("only returns active affiliates", () => {
      const affiliates = resolveAffiliatesForDispute(DisputeStatus.MAILED)
      
      affiliates.forEach(a => {
        expect(a.active).toBe(true)
      })
    })

    test("only returns affiliates with allowedStateSurfaces defined", () => {
      const affiliates = resolveAffiliatesForDispute(DisputeStatus.READY_TO_MAIL)
      
      affiliates.forEach(a => {
        expect(a.allowedStateSurfaces).toBeDefined()
        expect(Array.isArray(a.allowedStateSurfaces)).toBe(true)
      })
    })

  })

  describe("getAffiliatesForStateSurface", () => {

    test("returns empty for disallowed surface on state", () => {
      const affiliates = getAffiliatesForStateSurface(DisputeStatus.DRAFT, "WORKFLOW_COMPLETION")
      expect(affiliates).toHaveLength(0)
    })

    test("returns affiliates for allowed surface on state", () => {
      const affiliates = getAffiliatesForStateSurface(DisputeStatus.READY_TO_MAIL, "WORKFLOW_COMPLETION")
      expect(affiliates.length).toBeGreaterThan(0)
    })

    test("returns only affiliates matching the specific surface", () => {
      const affiliates = getAffiliatesForStateSurface(DisputeStatus.CLOSED, "RESOURCE_PAGE")
      
      affiliates.forEach(a => {
        expect(a.allowedStateSurfaces).toContain("RESOURCE_PAGE")
      })
    })

  })

  describe("Bypass Prevention", () => {

    test("unknown states return empty array", () => {
      const affiliates = resolveAffiliatesForDispute("UNKNOWN_STATE" as any)
      expect(affiliates).toHaveLength(0)
    })

    test("null/undefined state returns empty array", () => {
      const affiliates1 = resolveAffiliatesForDispute(null as any)
      const affiliates2 = resolveAffiliatesForDispute(undefined as any)
      
      expect(affiliates1).toHaveLength(0)
      expect(affiliates2).toHaveLength(0)
    })

  })

  describe("Data Integrity", () => {

    test("all returned affiliates have required fields", () => {
      const allStates = Object.values(DisputeStatus)
      
      allStates.forEach(status => {
        const affiliates = resolveAffiliatesForDispute(status)
        
        affiliates.forEach(a => {
          expect(a.id).toBeDefined()
          expect(a.name).toBeDefined()
          expect(a.description).toBeDefined()
          expect(a.url).toBeDefined()
          expect(a.category).toBeDefined()
        })
      })
    })

    test("affiliate URLs are valid format", () => {
      const affiliates = resolveAffiliatesForDispute(DisputeStatus.MAILED)
      
      affiliates.forEach(a => {
        expect(a.url).toMatch(/^https?:\/\//)
      })
    })

  })

})
