import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  Upload, 
  FileText, 
  AlertCircle, 
  Clock, 
  Wand2, 
  ShieldCheck, 
  X,
  BookOpen,
  Calculator,
  CheckSquare,
  GraduationCap,
  LayoutDashboard,
  History,
  TrendingUp,
  Bell,
  CheckCircle,
  Mail,
  Package,
  CalendarDays,
  ArrowRight
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { DisputeWizard } from "@/components/dashboard/DisputeWizard";
import DashboardTools from "@/components/dashboard/DashboardTools";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useDisputes } from "@/hooks/use-disputes";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { Dispute } from "@/lib/schema";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { useSubscription } from "@/hooks/use-subscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDisputeStage, getStageLabel } from "@/hooks/use-dispute-progress";

const creditData = [
  { month: "Jan", score: 580 },
  { month: "Feb", score: 592 },
  { month: "Mar", score: 605 },
  { month: "Apr", score: 610 },
  { month: "May", score: 625 },
  { month: "Jun", score: 642 },
];

const QUICK_TIPS = [
  { icon: Mail, title: "Send via Certified Mail", desc: "Always use USPS Certified Mail with Return Receipt" },
  { icon: FileText, title: "Include ID Copy", desc: "Attach a photocopy of your driver's license" },
  { icon: ShieldCheck, title: "Keep Records", desc: "Save copies of everything you send" },
  { icon: CalendarDays, title: "Track Deadlines", desc: "Bureaus must respond within 30 days" },
];

export default function ClientDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { disputes, isLoading: disputesLoading } = useDisputes();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { unreadCount, unreadNotifications } = useNotifications();
  const [showWizard, setShowWizard] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("wizard") === "open") {
      setShowWizard(true);
      setLocation("/dashboard", { replace: true });
    }
  }, [location, setLocation]);

  if (authLoading || disputesLoading || subscriptionLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const activeDisputes = disputes.filter(d => !["RESOLVED", "ESCALATED"].includes(d.status));
  const resolvedDisputes = disputes.filter(d => ["RESOLVED", "ESCALATED"].includes(d.status));
  const pendingDeadlines = disputes.filter(d => {
    if (!d.responseDeadline) return false;
    const days = differenceInDays(new Date(d.responseDeadline), new Date());
    return days >= 0 && days <= 7;
  });

  return (
    <DashboardLayout>
      <main className="space-y-8 animate-in fade-in duration-500">
        {showWizard && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl relative my-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -top-12 right-0 text-white hover:bg-white/20"
                onClick={() => setShowWizard(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <SubscriptionGate featureName="Dispute Wizard™">
                <DisputeWizard 
                  onComplete={() => setShowWizard(false)} 
                  onCancel={() => setShowWizard(false)} 
                />
              </SubscriptionGate>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">Welcome back, {user?.firstName}!</h1>
            <p className="text-muted-foreground">Track your disputes, learn about your rights, and take control of your credit.</p>
          </div>
          <Button 
            onClick={() => setShowWizard(true)}
            className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-6 font-bold transition-transform hover:scale-105"
            data-testid="button-start-wizard"
          >
            <Wand2 className="mr-2 h-5 w-5" /> Start Dispute Wizard™
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Active Disputes</p>
                  <p className="text-3xl font-bold">{activeDisputes.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Resolved</p>
                  <p className="text-3xl font-bold">{resolvedDisputes.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`border-none ${pendingDeadlines.length > 0 ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' : 'bg-slate-100'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${pendingDeadlines.length > 0 ? 'text-white/70' : 'text-muted-foreground'}`}>Upcoming Deadlines</p>
                  <p className="text-3xl font-bold">{pendingDeadlines.length}</p>
                </div>
                <div className={`p-3 rounded-full ${pendingDeadlines.length > 0 ? 'bg-white/20' : 'bg-slate-200'}`}>
                  <CalendarDays className={`h-6 w-6 ${pendingDeadlines.length > 0 ? '' : 'text-slate-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`border-none ${unreadCount > 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-slate-100'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${unreadCount > 0 ? 'text-white/70' : 'text-muted-foreground'}`}>Notifications</p>
                  <p className="text-3xl font-bold">{unreadCount}</p>
                </div>
                <div className={`p-3 rounded-full ${unreadCount > 0 ? 'bg-white/20' : 'bg-slate-200'}`}>
                  <Bell className={`h-6 w-6 ${unreadCount > 0 ? '' : 'text-slate-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white border p-1 h-auto grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="disputes" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <FileText className="h-4 w-4 mr-2" /> My Disputes
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <GraduationCap className="h-4 w-4 mr-2" /> Learning
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <Calculator className="h-4 w-4 mr-2" /> Tools
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <History className="h-4 w-4 mr-2" /> Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Dispute Activity</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard/disputes")}>
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {disputes.length > 0 ? (
                    <div className="space-y-4">
                      {disputes.slice(0, 3).map((dispute) => (
                        <DisputeProgressCard key={dispute.id} dispute={dispute} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p className="font-medium">No disputes yet</p>
                      <p className="text-sm">Start the Dispute Wizard to create your first letter</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Quick Tips
                  </CardTitle>
                  <CardDescription>Best practices for sending disputes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {QUICK_TIPS.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                      <tip.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{tip.title}</p>
                        <p className="text-xs text-muted-foreground">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {unreadNotifications.length > 0 && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {unreadNotifications.slice(0, 3).map((notif) => (
                      <div key={notif.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                        <Bell className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200 bg-white">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Credit Score History</CardTitle>
                  <CardDescription>Track your score improvements over time</CardDescription>
                </CardHeader>
                <CardContent className="p-2 md:p-6 pt-0">
                  <div className="h-[250px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={creditData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[500, 850]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} hide={window.innerWidth < 768} />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200 bg-primary text-white">
                <CardHeader>
                  <CardTitle className="text-white">Current Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-secondary/30 mb-4 animate-in zoom-in duration-700">
                    <div className="text-4xl font-bold font-serif text-white">642</div>
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm text-white/80">
                      <span>Progress</span>
                      <span>+62 pts</span>
                    </div>
                    <Progress value={65} className="h-2 bg-white/20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-6 outline-none">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">All Disputes</h2>
                <p className="text-muted-foreground">Track progress on all your dispute letters</p>
              </div>
              <Button onClick={() => setLocation("/dashboard/disputes")} variant="outline">
                Go to Full View <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            {disputes.length > 0 ? (
              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <DisputeProgressCard key={dispute.id} dispute={dispute} showDetails />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Disputes Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Start the Dispute Wizard to create your first dispute letter.
                  </p>
                  <Button onClick={() => setShowWizard(true)}>
                    <Wand2 className="h-4 w-4 mr-2" /> Start Dispute Wizard
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="education" className="space-y-6 outline-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Credit Fundamentals", lessons: 4, status: "Completed", progress: 100, tier: "Free" },
                { title: "Building New Credit", lessons: 6, status: "In Progress", progress: 45, tier: "Pro" },
                { title: "Advanced Scoring Tactics", lessons: 5, status: "Locked", progress: 0, tier: "Pro" },
              ].map((mod, i) => (
                <Card key={i} className={`hover:shadow-md transition-all border-2 ${mod.status === 'Locked' ? 'bg-slate-50/50 border-dashed' : 'border-transparent shadow-sm'}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-xl ${mod.status === 'Locked' ? 'bg-slate-200 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <Badge variant={mod.status === 'Completed' ? 'default' : mod.status === 'In Progress' ? 'secondary' : 'outline'} className="font-bold">
                        {mod.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl font-serif">{mod.title}</CardTitle>
                    <CardDescription>{mod.lessons} Lessons</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mod.status !== 'Locked' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Progress</span>
                          <span>{mod.progress}%</span>
                        </div>
                        <Progress value={mod.progress} className="h-1.5" />
                      </div>
                    )}
                    <Button className="w-full h-11 font-bold" variant={mod.status === 'Locked' ? 'outline' : 'default'} disabled={mod.status === 'Locked'}>
                      {mod.status === 'Locked' ? 'Upgrade to Unlock' : 'Continue Learning'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6 outline-none">
            <DashboardTools />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Your Journey</CardTitle>
                  <CardDescription>Track your credit improvement progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                      <div>
                        <p className="font-medium text-emerald-900">Account Created</p>
                        <p className="text-sm text-emerald-700">Started your credit education journey</p>
                      </div>
                    </div>
                    {disputes.length > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                        <div>
                          <p className="font-medium text-emerald-900">First Dispute Created</p>
                          <p className="text-sm text-emerald-700">Generated {disputes.length} dispute letter(s)</p>
                        </div>
                      </div>
                    )}
                    {resolvedDisputes.length > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                        <div>
                          <p className="font-medium text-emerald-900">Disputes Resolved</p>
                          <p className="text-sm text-emerald-700">{resolvedDisputes.length} dispute(s) successfully resolved</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="h-8 w-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                        <ArrowUp className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-600">Score Improvement</p>
                        <p className="text-sm text-slate-500">Continue disputing to improve your score</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-primary text-white border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-secondary" />
                    <CardTitle className="text-white text-lg">Privacy & Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-xs font-medium text-white/90">Your data is protected with 256-bit AES encryption. Sensitive fields like SSN and Address are only visible to you.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Data Encryption</span>
                      <Badge variant="outline" className="text-white border-white/20 text-[10px]">AES-256</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">CROA Compliance</span>
                      <Badge variant="outline" className="text-white border-white/20 text-[10px]">ACTIVE</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

function DisputeProgressCard({ dispute, showDetails = false }: { dispute: Dispute; showDetails?: boolean }) {
  const stage = getDisputeStage(dispute);
  const totalStages = 7;
  const progressPercent = Math.round((stage / totalStages) * 100);
  
  const daysUntilDeadline = dispute.responseDeadline 
    ? differenceInDays(new Date(dispute.responseDeadline), new Date())
    : null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'GENERATED': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'MAILED': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'RESPONSE_RECEIVED': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'ESCALATED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow" data-testid={`dispute-card-${dispute.id}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${getStatusColor(dispute.status)}`}>
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-primary">{dispute.creditorName}</p>
            <p className="text-sm text-muted-foreground">{dispute.bureau} • {dispute.disputeReason}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {daysUntilDeadline !== null && daysUntilDeadline <= 5 && daysUntilDeadline > 0 && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Bell className="h-3 w-3 mr-1" />
              {daysUntilDeadline}d left
            </Badge>
          )}
          <Badge className={getStatusColor(dispute.status)}>
            {dispute.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{getStageLabel(stage)}</span>
          <span className="font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs text-muted-foreground">
          {dispute.trackingNumber && (
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              Tracking: {dispute.trackingNumber}
            </span>
          )}
          <span>Created {formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}</span>
        </div>
      )}
    </div>
  );
}
