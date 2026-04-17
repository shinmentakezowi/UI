// Plan definitions and app-wide constants.
// NOTE: Placeholder pricing/IDs for UI development. Real values live elsewhere.

export interface PlanTier {
  name: string;
  price: number;
  dailyAccrual: number;
  rpm: number;
  tierKey: string;
  planId: number;
  modelAccess: "standard_models" | "full" | "full_priority";
  modelDescription: string;
  features: string[];
  paymentProductId?: string;
}

export const PLAN_TIERS: Record<string, PlanTier> = {
  free: {
    name: "Free",
    price: 0,
    dailyAccrual: 100_000,
    rpm: 100,
    tierKey: "free",
    planId: 0,
    modelAccess: "standard_models",
    modelDescription: "Limited models",
    features: ["100K daily credits", "Limited models", "100 RPM"],
  },
  lite: {
    name: "Lite",
    price: 0,
    dailyAccrual: 1_000_000,
    rpm: 100,
    tierKey: "lite",
    planId: 0,
    modelAccess: "standard_models",
    modelDescription: "Standard models",
    features: ["Standard models", "1M daily credits", "100 RPM", "Usage dashboard"],
  },
  standard: {
    name: "Standard",
    price: 0,
    dailyAccrual: 4_000_000,
    rpm: 100,
    tierKey: "standard",
    planId: 0,
    modelAccess: "full",
    modelDescription: "All 105+ models",
    features: ["All 105+ models", "4M daily credits", "100 RPM", "Usage dashboard"],
  },
  pro: {
    name: "Pro",
    price: 0,
    dailyAccrual: 0,
    rpm: 100,
    tierKey: "pro",
    planId: 0,
    modelAccess: "full_priority",
    modelDescription: "All 105+ models + priority routing",
    features: [
      "All 105+ models + priority routing",
      "Credit pack — no daily limit",
      "100 RPM",
      "Priority routing",
      "Usage dashboard",
    ],
  },
};

export type PlanKey = keyof typeof PLAN_TIERS;

export function groupToPlanKey(group: string): PlanKey {
  if (group in PLAN_TIERS) return group as PlanKey;
  return "free";
}

export function determinePlan(productId?: string, tierName?: string | null): PlanKey {
  if (productId) {
    for (const [key, tier] of Object.entries(PLAN_TIERS)) {
      if (tier.paymentProductId && tier.paymentProductId === productId) return key as PlanKey;
    }
  }
  if (tierName) {
    const lower = tierName.toLowerCase();
    if (lower.includes("pro")) return "pro";
    if (lower.includes("standard")) return "standard";
    if (lower.includes("lite")) return "lite";
  }
  return "free";
}

export const RESET_HOUR_UTC = 16;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// ─── Credit Packs (one-time purchase → vault) ─────────────────────────────

export interface CreditPack {
  name: string;
  credits: number;
  price: number;
  priceCNY: number;
  description: string;
  features: string[];
  popular?: boolean;
  paymentProductId: string;
}

export const CREDIT_PACKS: Record<string, CreditPack> = {
  lite_pack: {
    name: "Lite",
    credits: 30_000_000,
    price: 0,
    priceCNY: 0,
    description: "30M credits",
    features: ["30M credits", "All 105+ models", "Never expires"],
    paymentProductId: "",
  },
  standard_pack: {
    name: "Standard",
    credits: 120_000_000,
    price: 0,
    priceCNY: 0,
    description: "120M credits",
    popular: true,
    features: ["120M credits", "All 105+ models", "Never expires"],
    paymentProductId: "",
  },
  pro_pack: {
    name: "Pro",
    credits: 240_000_000,
    price: 0,
    priceCNY: 0,
    description: "240M credits",
    features: ["240M credits", "All 105+ models", "Priority routing", "Never expires"],
    paymentProductId: "",
  },
};

export function findCreditPack(productId: string): [string, CreditPack] | undefined {
  for (const [key, pack] of Object.entries(CREDIT_PACKS)) {
    if (pack.paymentProductId && pack.paymentProductId === productId) {
      return [key, pack];
    }
  }
  return undefined;
}
