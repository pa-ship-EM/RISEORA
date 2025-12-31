import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Check, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/use-subscription";

interface SubscriptionGateProps {
  children: React.ReactNode;
  featureName?: string;
  requiredTier?: "SELF_STARTER" | "GROWTH" | "COMPLIANCE_PLUS";
}

const TIER_ORDER = ["FREE", "SELF_STARTER", "GROWTH", "COMPLIANCE_PLUS"];
const TIER_PRICES = {
  SELF_STARTER: 49,
  GROWTH: 99,
  COMPLIANCE_PLUS: 149,
};

export function SubscriptionGate({ 
  children, 
  featureName = "Premium Features",
  requiredTier = "GROWTH"
}: SubscriptionGateProps) {
  const { subscription, isLoading, upgrade, isUpgrading } = useSubscription();
  const { toast } = useToast();

  // Check if user has required tier or higher
  const currentTierIndex = TIER_ORDER.indexOf(subscription?.tier || "FREE");
  const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
  const hasAccess = currentTierIndex >= requiredTierIndex;

  const handleUpgrade = async () => {
    try {
      await upgrade(requiredTier);
      toast({
        title: `Upgraded to ${requiredTier.replace("_", " ")}!`,
        description: "You now have full access to this feature.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upgrade failed",
        description: "Please try again or contact support.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  const price = TIER_PRICES[requiredTier];
  const tierName = requiredTier.replace("_", " ");

  return (
    <div className="relative">
      <div className="filter blur-sm pointer-events-none opacity-50 select-none" aria-hidden="true">
        {children}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        <Card className="w-full max-w-md shadow-2xl border-secondary/20 bg-background/95 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-secondary/10 p-3 rounded-full w-fit mb-4">
              <Lock className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-serif">Unlock {featureName}</CardTitle>
            <CardDescription className="text-lg">
              Upgrade to {tierName} to access this feature.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {requiredTier === "GROWTH" || requiredTier === "COMPLIANCE_PLUS" ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Full Dispute Wizard™ Workflow</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Advanced Credit Analysis Tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Unlimited Document Generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>All 3 Bureaus Guided Paths</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Priority Support (24h Response)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Access to Dispute Wizard™</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>3 Bureau Audit Workflows/Month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Standard Template Library</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button 
              className="w-full h-12 text-lg font-bold bg-secondary hover:bg-secondary/90 text-slate-900"
              onClick={handleUpgrade}
              disabled={isUpgrading}
              data-testid="button-upgrade"
            >
              {isUpgrading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Upgrade Now - ${price}/mo
                </span>
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Bank-level encryption</span>
              <span>•</span>
              <span>We never sell your data</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
