import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useNotificationSettings } from "@/hooks/use-notifications";
import { useToast } from "@/hooks/use-toast";
import { User, CreditCard, Shield, Bell, Lock, Loader2, CheckCircle, Crown, AlertTriangle } from "lucide-react";
import { TIER_FEATURES } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { subscription, isLoading: subLoading, upgrade } = useSubscription();
  const { settings, updateSettings, isLoading: settingsLoading } = useNotificationSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setEditProfileOpen(false);
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to change password");
      }
      return res.json();
    },
    onSuccess: () => {
      setChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleUpgrade = (tier: string) => {
    upgrade(tier);
    setUpgradeOpen(false);
  };

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
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => {
                  setFirstName(user?.firstName || "");
                  setLastName(user?.lastName || "");
                  setEditProfileOpen(true);
                }}
                data-testid="button-edit-profile"
              >
                Edit Profile
              </Button>
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
                    <Button 
                      className="bg-secondary text-slate-900 font-bold"
                      onClick={() => setUpgradeOpen(true)}
                      data-testid="button-upgrade-plan"
                    >
                      Upgrade Plan
                    </Button>
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
                <Button 
                  variant="outline" 
                  onClick={() => setChangePasswordOpen(true)}
                  data-testid="button-change-password"
                >
                  Change Password
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your disputes</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setNotificationsOpen(true)}
                  data-testid="button-configure-notifications"
                >
                  Configure
                </Button>
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
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setDeleteOpen(true)}
                  data-testid="button-delete-account"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                data-testid="input-edit-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                data-testid="input-edit-last-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => updateProfileMutation.mutate({ firstName, lastName })}
              disabled={updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and a new password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input 
                type="password"
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)}
                data-testid="input-current-password"
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input 
                type="password"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input 
                type="password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-testid="input-confirm-password"
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => changePasswordMutation.mutate({ currentPassword, newPassword })}
              disabled={changePasswordMutation.isPending || !currentPassword || !newPassword || newPassword !== confirmPassword}
              data-testid="button-save-password"
            >
              {changePasswordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>Configure how you receive notifications.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates about your disputes</p>
              </div>
              <Switch 
                checked={settings?.emailEnabled ?? true}
                onCheckedChange={(checked) => updateSettings({ emailEnabled: checked })}
                data-testid="switch-email-notifications"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">In-App Notifications</p>
                <p className="text-sm text-muted-foreground">Show notifications in the dashboard</p>
              </div>
              <Switch 
                checked={settings?.inAppEnabled ?? true}
                onCheckedChange={(checked) => updateSettings({ inAppEnabled: checked })}
                data-testid="switch-inapp-notifications"
              />
            </div>
            <div className="space-y-2">
              <Label>Reminder Lead Time (days before deadline)</Label>
              <Input 
                type="number"
                min={1}
                max={14}
                value={settings?.reminderLeadDays ?? 5}
                onChange={(e) => updateSettings({ reminderLeadDays: parseInt(e.target.value) || 5 })}
                data-testid="input-reminder-days"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setNotificationsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>Choose a plan that fits your needs.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-4">
            {(["SELF_STARTER", "GROWTH", "COMPLIANCE_PLUS"] as const).map((tier) => {
              const info = TIER_FEATURES[tier];
              const isCurrentTier = subscription?.tier === tier;
              const isRecommended = tier === "GROWTH";
              return (
                <div 
                  key={tier} 
                  className={`p-4 rounded-lg border-2 ${isRecommended ? 'border-secondary' : 'border-slate-200'} ${isCurrentTier ? 'bg-slate-50' : ''}`}
                >
                  {isRecommended && (
                    <Badge className="bg-secondary text-slate-900 mb-2">Recommended</Badge>
                  )}
                  <h3 className="font-semibold text-lg">{info.name}</h3>
                  <p className="text-2xl font-bold mt-1">${info.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Dispute Wizard™
                    </li>
                    {info.hasAdvancedAnalysis && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Advanced Analysis
                      </li>
                    )}
                    {info.hasUnlimitedDocs && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Unlimited Documents
                      </li>
                    )}
                    {info.hasPrioritySupport && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Priority Support
                      </li>
                    )}
                    {info.hasMetro2Education && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Metro 2 Education
                      </li>
                    )}
                  </ul>
                  <Button 
                    className={`w-full mt-4 ${isRecommended ? 'bg-secondary text-slate-900' : ''}`}
                    variant={isRecommended ? "default" : "outline"}
                    disabled={isCurrentTier}
                    onClick={() => handleUpgrade(tier)}
                    data-testid={`button-select-${tier.toLowerCase()}`}
                  >
                    {isCurrentTier ? "Current Plan" : "Select Plan"}
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              All your disputes, documents, and personal information will be permanently deleted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={() => {
                toast({ 
                  title: "Contact Support", 
                  description: "Please contact support@riseora.org to delete your account." 
                });
                setDeleteOpen(false);
              }}
              data-testid="button-confirm-delete"
            >
              I understand, delete my account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
