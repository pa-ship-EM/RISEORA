import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export function SubscriptionGate({ children, featureName = "Premium Features" }: SubscriptionGateProps) {
  // Mock subscription state - in a real app, this would check the user's subscription status
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    // Simulate Stripe Checkout redirect/processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsLoading(false);
    
    toast({
      title: "Welcome to RiseOra Pro!",
      description: "You now have full access to all premium features.",
    });
  };

  if (isSubscribed) {
    return <>{children}</>;
  }

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
              Upgrade to RiseOra Pro to access the Dispute Wizard™ and more.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Unlimited AI Disputes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Metro 2 Compliance Checks</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Instant PDF Generation & Email</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button 
              className="w-full h-12 text-lg font-bold bg-secondary hover:bg-secondary/90 text-primary"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Upgrade Now - $49/mo
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
