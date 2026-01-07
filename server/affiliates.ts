export type AffiliateSurface = 
  | "dashboard"
  | "resources"
  | "dispute_wizard"
  | "onboarding"
  | "email";

export type AffiliateCategory = 
  | "credit_monitoring"
  | "credit_builder"
  | "banking"
  | "credit_cards"
  | "loans"
  | "education";

export interface Affiliate {
  id: string;
  name: string;
  category: AffiliateCategory;
  description: string;
  url: string;
  surfaces: AffiliateSurface[];
  minTier?: "FREE" | "SELF_STARTER" | "GROWTH" | "COMPLIANCE_PLUS";
  excludeStates?: string[];
  requiresActiveDispute?: boolean;
  priority: number;
  active: boolean;
}

export const AFFILIATES: Affiliate[] = [
  {
    id: "credit_karma",
    name: "Credit Karma",
    category: "credit_monitoring",
    description: "Free credit monitoring tool to track your score.",
    url: "https://www.creditkarma.com/r/your-affiliate-code",
    surfaces: ["dashboard", "resources", "onboarding"],
    priority: 100,
    active: true
  },
  {
    id: "experian_boost",
    name: "Experian Boost",
    category: "credit_builder",
    description: "Add positive payment history to your credit file with Experian Boost.",
    url: "https://www.experian.com/boost?ref=your-code",
    surfaces: ["dashboard", "resources", "dispute_wizard"],
    priority: 90,
    active: true
  },
  {
    id: "chime",
    name: "Chime Bank",
    category: "banking",
    description: "No-fee banking and early direct deposit.",
    url: "https://www.chime.com/?ref=your-affiliate-code",
    surfaces: ["dashboard", "resources"],
    priority: 80,
    active: true
  },
  {
    id: "nerdwallet",
    name: "NerdWallet Credit Tools",
    category: "credit_cards",
    description: "Compare credit cards and track rewards.",
    url: "https://www.nerdwallet.com/best/credit-cards?ref=your-code",
    surfaces: ["dashboard", "resources"],
    priority: 70,
    active: true
  },
  {
    id: "self_lender",
    name: "Self Credit Builder",
    category: "credit_builder",
    description: "Build credit with a credit-builder loan. No credit check required.",
    url: "https://www.self.inc/?ref=your-code",
    surfaces: ["dashboard", "resources", "onboarding"],
    minTier: "SELF_STARTER",
    priority: 85,
    active: true
  },
  {
    id: "discover_secured",
    name: "Discover Secured Card",
    category: "credit_cards",
    description: "Build credit with no annual fee. Get your deposit back automatically.",
    url: "https://www.discover.com/credit-cards/secured/?ref=your-code",
    surfaces: ["resources"],
    priority: 75,
    active: true
  }
];
