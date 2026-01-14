import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Server,
  Lock,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Save,
  RefreshCw
} from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [platformSettings, setPlatformSettings] = useState({
    siteName: "RiseOra",
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeoutDays: 7,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    enforceStrongPasswords: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    systemEmailsEnabled: true,
    disputeReminders: true,
    adminAlerts: true,
    weeklyReports: false,
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your platform settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Platform Settings
            </h1>
            <p className="text-muted-foreground">Configure system-wide settings and preferences.</p>
          </div>
          <Button onClick={handleSaveSettings} disabled={isSaving} data-testid="button-save-settings">
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>Basic platform configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Platform Name</Label>
                  <Input 
                    id="siteName"
                    value={platformSettings.siteName}
                    onChange={(e) => setPlatformSettings({...platformSettings, siteName: e.target.value})}
                    data-testid="input-site-name"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable access for non-admin users
                    </p>
                  </div>
                  <Switch
                    checked={platformSettings.maintenanceMode}
                    onCheckedChange={(checked) => setPlatformSettings({...platformSettings, maintenanceMode: checked})}
                    data-testid="switch-maintenance-mode"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable new user signups
                    </p>
                  </div>
                  <Switch
                    checked={platformSettings.allowNewRegistrations}
                    onCheckedChange={(checked) => setPlatformSettings({...platformSettings, allowNewRegistrations: checked})}
                    data-testid="switch-allow-registrations"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require users to verify their email before accessing features
                    </p>
                  </div>
                  <Switch
                    checked={platformSettings.requireEmailVerification}
                    onCheckedChange={(checked) => setPlatformSettings({...platformSettings, requireEmailVerification: checked})}
                    data-testid="switch-email-verification"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (days)</Label>
                  <Input 
                    id="sessionTimeout"
                    type="number"
                    min={1}
                    max={30}
                    value={securitySettings.sessionTimeoutDays}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeoutDays: parseInt(e.target.value) || 7})}
                    data-testid="input-session-timeout"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                  <Input 
                    id="maxAttempts"
                    type="number"
                    min={3}
                    max={10}
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value) || 5})}
                    data-testid="input-max-attempts"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lockout">Lockout Duration (min)</Label>
                  <Input 
                    id="lockout"
                    type="number"
                    min={5}
                    max={60}
                    value={securitySettings.lockoutDurationMinutes}
                    onChange={(e) => setSecuritySettings({...securitySettings, lockoutDurationMinutes: parseInt(e.target.value) || 30})}
                    data-testid="input-lockout-duration"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Enforce Strong Passwords
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require minimum 8 characters with letters and numbers
                  </p>
                </div>
                <Switch
                  checked={securitySettings.enforceStrongPasswords}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enforceStrongPasswords: checked})}
                  data-testid="switch-strong-passwords"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    System Emails
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable platform-wide email notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.systemEmailsEnabled}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemEmailsEnabled: checked})}
                  data-testid="switch-system-emails"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Dispute Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send automated reminders for dispute deadlines
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.disputeReminders}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, disputeReminders: checked})}
                  data-testid="switch-dispute-reminders"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Admin Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for important system events
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.adminAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, adminAlerts: checked})}
                  data-testid="switch-admin-alerts"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly platform activity summaries
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                  data-testid="switch-weekly-reports"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                System Status
              </CardTitle>
              <CardDescription>Current platform health and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Database</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Sessions</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">PostgreSQL Store</Badge>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Encryption</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">AES-256 Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
