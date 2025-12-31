import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { User, CreditCard, Shield, Bell, Lock, Loader2, CheckCircle, Crown } from "lucide-react";
import { TIER_FEATURES } from "@shared/schema";

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { subscription, isLoading: subLoading } = useSubscription();

  if (authLoading || subLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const tierInfo = subscription?.tier ? TIER_FEATURES[subscription.tier as keyof typeof TIER_FEATURES] : TIER_FEATURES.FREE;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your personal details and profile information.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={user?.firstName || ""} disabled className="bg-slate-50" data-testid="input-first-name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={user?.lastName || ""} disabled className="bg-slate-50" data-testid="input-last-name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled className="bg-slate-50" data-testid="input-email" />
              </div>
              <div className="space-y-2">
                <Label>Account Created</Label>
                <Input 
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ""} 
                  disabled 
                  className="bg-slate-50" 
                />
              </div>
              <Button variant="outline" className="mt-2">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Crown className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>Subscription</CardTitle>
                    <Badge className={subscription?.tier === "FREE" ? "bg-slate-100 text-slate-600" : "bg-secondary text-slate-900"}>
                      {tierInfo.name}
                    </Badge>
                  </div>
                  <CardDescription>Your current plan and billing information.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">{tierInfo.name} Plan</p>
                    <p className="text-muted-foreground text-sm">
                      {tierInfo.price === 0 ? "Free forever" : `$${tierInfo.price}/month`}
                    </p>
                  </div>
                  {subscription?.tier !== "COMPLIANCE_PLUS" && (
                    <Button className="bg-secondary text-slate-900 font-bold">Upgrade Plan</Button>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${tierInfo.hasDisputeWizard ? "text-emerald-500" : "text-slate-300"}`} />
                    <span className={tierInfo.hasDisputeWizard ? "" : "text-muted-foreground"}>Dispute Wizard™ Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${tierInfo.hasAdvancedAnalysis ? "text-emerald-500" : "text-slate-300"}`} />
                    <span className={tierInfo.hasAdvancedAnalysis ? "" : "text-muted-foreground"}>Advanced Analysis Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${tierInfo.hasUnlimitedDocs ? "text-emerald-500" : "text-slate-300"}`} />
                    <span className={tierInfo.hasUnlimitedDocs ? "" : "text-muted-foreground"}>Unlimited Documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${tierInfo.hasPrioritySupport ? "text-emerald-500" : "text-slate-300"}`} />
                    <span className={tierInfo.hasPrioritySupport ? "" : "text-muted-foreground"}>Priority Support</span>
                  </div>
                </div>
              </div>
              {subscription?.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and security settings.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed: Never</p>
                  </div>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your disputes</p>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                </div>
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
