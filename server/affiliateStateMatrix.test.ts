import { DisputeStatus } from "../shared/disputeStates"
import { AffiliateSurfaceByState, getAllowedAffiliateSurfaces, canShowAffiliateForDispute } from "./affiliateStateMatrix"

describe("Affiliate State Matrix", () => {

  describe("State to Surface Mapping", () => {

    test("DRAFT has no allowed surfaces (no value delivered yet)", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.DRAFT)
      expect(surfaces).toHaveLength(0)
    })

    test("READY_TO_MAIL allows WORKFLOW_COMPLETION (letter generated)", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.READY_TO_MAIL)
      expect(surfaces).toContain("WORKFLOW_COMPLETION")
    })

    test("MAILED allows EDUCATION_FOLLOWUP", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.MAILED)
      expect(surfaces).toContain("EDUCATION_FOLLOWUP")
    })

    test("DELIVERED allows EDUCATION_FOLLOWUP", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.DELIVERED)
      expect(surfaces).toContain("EDUCATION_FOLLOWUP")
    })

    test("IN_INVESTIGATION allows EDUCATION_FOLLOWUP", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.IN_INVESTIGATION)
      expect(surfaces).toContain("EDUCATION_FOLLOWUP")
    })

    test("REMOVED allows RESOURCE_PAGE (dispute resolved)", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.REMOVED)
      expect(surfaces).toContain("RESOURCE_PAGE")
    })

    test("CLOSED allows RESOURCE_PAGE", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.CLOSED)
      expect(surfaces).toContain("RESOURCE_PAGE")
    })

    test("VERIFIED allows both EDUCATION_FOLLOWUP and RESOURCE_PAGE", () => {
      const surfaces = getAllowedAffiliateSurfaces(DisputeStatus.VERIFIED)
      expect(surfaces).toContain("EDUCATION_FOLLOWUP")
      expect(surfaces).toContain("RESOURCE_PAGE")
    })

  })

  describe("canShowAffiliateForDispute", () => {

    test("returns true when surface is allowed for state", () => {
      expect(canShowAffiliateForDispute(DisputeStatus.READY_TO_MAIL, "WORKFLOW_COMPLETION")).toBe(true)
      expect(canShowAffiliateForDispute(DisputeStatus.MAILED, "EDUCATION_FOLLOWUP")).toBe(true)
      expect(canShowAffiliateForDispute(DisputeStatus.CLOSED, "RESOURCE_PAGE")).toBe(true)
    })

    test("returns false when surface is not allowed for state", () => {
      expect(canShowAffiliateForDispute(DisputeStatus.DRAFT, "WORKFLOW_COMPLETION")).toBe(false)
      expect(canShowAffiliateForDispute(DisputeStatus.DRAFT, "EDUCATION_FOLLOWUP")).toBe(false)
      expect(canShowAffiliateForDispute(DisputeStatus.DRAFT, "RESOURCE_PAGE")).toBe(false)
    })

    test("WORKFLOW_COMPLETION not allowed after mailing", () => {
      expect(canShowAffiliateForDispute(DisputeStatus.MAILED, "WORKFLOW_COMPLETION")).toBe(false)
      expect(canShowAffiliateForDispute(DisputeStatus.DELIVERED, "WORKFLOW_COMPLETION")).toBe(false)
    })

  })

  describe("Compliance Rule: Value Delivered First", () => {

    test("no affiliates before letter is ready", () => {
      const draftSurfaces = getAllowedAffiliateSurfaces(DisputeStatus.DRAFT)
      expect(draftSurfaces).toHaveLength(0)
    })

    test("affiliates only appear after value milestone", () => {
      const valueMilestones = [
        DisputeStatus.READY_TO_MAIL,
        DisputeStatus.MAILED,
        DisputeStatus.DELIVERED,
        DisputeStatus.REMOVED,
        DisputeStatus.CLOSED
      ]

      valueMilestones.forEach(status => {
        const surfaces = getAllowedAffiliateSurfaces(status)
        expect(surfaces.length).toBeGreaterThan(0)
      })
    })

  })

  describe("Matrix Completeness", () => {

    test("all dispute statuses have entries in the matrix", () => {
      const allStatuses = Object.values(DisputeStatus)
      
      allStatuses.forEach(status => {
        expect(AffiliateSurfaceByState).toHaveProperty(status)
      })
    })

  })

})
