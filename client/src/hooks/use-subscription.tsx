import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SubscriptionFeatures {
  name: string;
  price: number;
  disputesPerMonth: number;
  hasDisputeWizard: boolean;
  hasAdvancedAnalysis: boolean;
  hasUnlimitedDocs: boolean;
  hasMetro2Education: boolean;
  hasPrioritySupport: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: "FREE" | "SELF_STARTER" | "GROWTH" | "COMPLIANCE_PLUS";
  status: "ACTIVE" | "CANCELED" | "PAST_DUE";
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  features: SubscriptionFeatures;
}

export function useSubscription() {
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery<Subscription>({
    queryKey: ["/api/subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription", {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch subscription");
      }
      return res.json();
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (tier: string) => {
      const res = await apiRequest("POST", "/api/subscription/upgrade", { tier });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
  });

  const upgrade = async (tier: string) => {
    return upgradeMutation.mutateAsync(tier);
  };

  // Helper functions to check feature access
  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    if (!subscription?.features) return false;
    return !!subscription.features[feature];
  };

  const canUseDisputeWizard = (): boolean => {
    return subscription?.features?.hasDisputeWizard ?? false;
  };

  const canUseAdvancedAnalysis = (): boolean => {
    return subscription?.features?.hasAdvancedAnalysis ?? false;
  };

  const hasUnlimitedDocs = (): boolean => {
    return subscription?.features?.hasUnlimitedDocs ?? false;
  };

  const isGrowthOrAbove = (): boolean => {
    return subscription?.tier === "GROWTH" || subscription?.tier === "COMPLIANCE_PLUS";
  };

  return {
    subscription,
    isLoading,
    upgrade,
    isUpgrading: upgradeMutation.isPending,
    hasFeature,
    canUseDisputeWizard,
    canUseAdvancedAnalysis,
    hasUnlimitedDocs,
    isGrowthOrAbove,
  };
}
