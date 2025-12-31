import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  TrendingUp
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { DisputeWizard } from "@/components/dashboard/DisputeWizard";
import DashboardTools from "@/components/dashboard/DashboardTools";
import { useState, useEffect } from "react";
import { mockDb } from "@/lib/mock-db";
import { formatDistanceToNow } from "date-fns";
import { Dispute } from "@/lib/schema";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const creditData = [
  { month: "Jan", score: 580 },
  { month: "Feb", score: 592 },
  { month: "Mar", score: 605 },
  { month: "Apr", score: 610 },
  { month: "May", score: 625 },
  { month: "Jun", score: 642 },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const disputes = user ? mockDb.getDisputesForUser(user.id) : [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

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
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">Client Learning Portal</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName}. Continue your journey to financial freedom.</p>
          </div>
          <Button 
            onClick={() => setShowWizard(true)}
            className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-6 font-bold transition-transform hover:scale-105"
          >
            <Wand2 className="mr-2 h-5 w-5" /> Start Dispute Wizard™
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white border p-1 h-auto grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <GraduationCap className="h-4 w-4 mr-2" /> Modules
            </TabsTrigger>
            <TabsTrigger value="explainers" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <ShieldCheck className="h-4 w-4 mr-2" /> Legal Guides
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <Calculator className="h-4 w-4 mr-2" /> Tools
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <History className="h-4 w-4 mr-2" /> Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Credit Score History</CardTitle>
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
                  <Progress value={65} className="h-2 w-full bg-white/20" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Dispute Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {disputes.length > 0 ? (
                    <div className="space-y-4">
                      {disputes.map((dispute, i) => (
                        <DisputeItem key={i} dispute={dispute} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No active disputes.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Action Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <AlertCircle className="h-5 w-5 text-amber-600 mb-2" />
                    <h4 className="font-semibold text-amber-900">Upload ID Document</h4>
                    <p className="text-sm text-amber-700 mb-3">We need a copy of your ID.</p>
                    <Button size="sm" variant="outline" className="border-amber-200">Upload</Button>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                    <BookOpen className="h-5 w-5 text-emerald-600 mb-2" />
                    <h4 className="font-semibold text-emerald-900">E-Book Unlocked</h4>
                    <p className="text-sm text-emerald-700 mb-3">Your RiseOra Guide is ready.</p>
                    <Button size="sm" variant="outline" className="border-emerald-200">Download PDF</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DashboardTools />
          </TabsContent>

          <TabsContent value="education" className="space-y-6 outline-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: "Credit Fundamentals", 
                  lessons: 4, 
                  status: "Completed", 
                  progress: 100,
                  tier: "Free"
                },
                { 
                  title: "Building New Credit", 
                  lessons: 6, 
                  status: "In Progress", 
                  progress: 45,
                  tier: "Pro"
                },
                { 
                  title: "Advanced Scoring Tactics", 
                  lessons: 5, 
                  status: "Locked", 
                  progress: 0,
                  tier: "Pro"
                },
              ].map((mod, i) => (
                <Card key={i} className={`hover:shadow-md transition-all border-2 ${mod.status === 'Locked' ? 'bg-slate-50/50 border-dashed' : 'border-transparent shadow-sm'}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-xl ${mod.status === 'Locked' ? 'bg-slate-200 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={mod.status === 'Completed' ? 'default' : mod.status === 'In Progress' ? 'secondary' : 'outline'} className="font-bold">
                          {mod.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-primary/20 text-primary font-bold">
                          {mod.tier} Access
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-xl font-serif">{mod.title}</CardTitle>
                    <CardDescription>{mod.lessons} Lessons • Interactive Quizzes</CardDescription>
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
                      {mod.status === 'Locked' ? (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" /> Upgrade to Pro
                        </>
                      ) : 'Continue Learning'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explainers" className="space-y-6 outline-none">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>FCRA: Your Rights as a Consumer</CardTitle>
                  <CardDescription>A plain-language guide to the Fair Credit Reporting Act.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The FCRA protects your right to accurate, fair, and private credit reporting. Under this law, bureaus must investigate any item you dispute within 30 days.
                  </p>
                  <Button variant="outline">Read Detailed Explainer</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Metro 2: The Creditor Standard</CardTitle>
                  <CardDescription>How reporting formats impact your score.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Metro 2 is the standard format used by creditors to report your data. Our tools help you identify formatting errors.
                  </p>
                  <Button variant="outline">View Format Guide</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6 outline-none">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-secondary/5 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Utilization Calculator
                  </CardTitle>
                  <CardDescription>Calculate your ideal usage targets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-secondary text-primary font-bold">Open Tool</Button>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Report Checklist
                  </CardTitle>
                  <CardDescription>Step-by-step audit guide.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary text-white">Download Checklist</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 outline-none">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Learning Progress Tracker</CardTitle>
                    <CardDescription>Visualizing your journey to credit mastery.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl border-slate-100">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-secondary/30 mx-auto mb-4" />
                      <p className="text-slate-400">Progression Chart View</p>
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
                       <span className="text-white/70">Audit Log Status</span>
                       <Badge variant="outline" className="text-white border-white/20 text-[10px]">VERIFIED</Badge>
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

function DisputeItem({ dispute }: { dispute: Dispute }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'GENERATED': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'SENT': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const Icon = Wand2;
  const colorClass = getStatusColor(dispute.status);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-md border ${colorClass} bg-opacity-20`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-primary text-base">{dispute.creditorName}</p>
          <p className="text-sm text-muted-foreground">{dispute.disputeReason}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge variant="outline" className={`mb-1 font-medium ${colorClass}`}>
          {dispute.status}
        </Badge>
      </div>
    </div>
  );
}