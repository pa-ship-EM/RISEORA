import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, Upload, FileText, AlertCircle, Clock, Wand2, ShieldCheck, X } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { DisputeWizard } from "@/components/dashboard/DisputeWizard";
import { useState, useEffect } from "react";
import { mockDb } from "@/lib/mock-db";
import { formatDistanceToNow } from "date-fns";
import { Dispute } from "@/lib/schema";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

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
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get real disputes from mock DB
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
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl relative">
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

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Welcome back, {user?.firstName}</h1>
          <p className="text-muted-foreground text-lg">Dispute Wizard™ is tracking your progress.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button 
            onClick={() => setShowWizard(true)}
            className="bg-secondary text-primary hover:bg-secondary/90 shadow-sm font-bold text-md h-12 px-6 transition-transform hover:scale-105"
           >
              <Wand2 className="mr-2 h-5 w-5" /> Start New Dispute
           </Button>
        </div>
      </div>

      {/* Credit Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in slide-in-from-bottom-8 duration-500 delay-100">
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Credit Score History</CardTitle>
            <CardDescription>Experian • TransUnion • Equifax</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={creditData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(215 50% 23%)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(215 50% 23%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[500, 850]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: 'hsl(215 50% 23%)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(215 50% 23%)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-primary text-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-white text-xl">Current Score</CardTitle>
            <CardDescription className="text-primary-foreground/70">Updated 2 days ago</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-8 border-secondary/30 mb-4 animate-in zoom-in duration-700">
              <div className="text-5xl font-bold font-serif text-white">642</div>
              <div className="absolute -bottom-2 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ArrowUp className="h-3 w-3" /> +62 pts
              </div>
            </div>
            <div className="text-center space-y-1 w-full">
              <p className="text-sm text-primary-foreground/80 mb-2">Next Update: 28 Days</p>
              <Progress value={65} className="h-2 w-full bg-white/20" />
              <div className="flex justify-between text-xs text-primary-foreground/60 w-full pt-2 font-medium">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items & Disputes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-500 delay-200">
        <Card className="shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Dispute Wizard™ Activity</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
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
                <Button variant="link" onClick={() => setShowWizard(true)}>Start your first dispute</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Action Required</CardTitle>
            <CardDescription>Please complete these items to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100 hover:bg-amber-100/50 transition-colors">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 text-lg">Upload ID Document</h4>
                  <p className="text-sm text-amber-700 mb-3">We need a clear copy of your driver's license.</p>
                  <Button size="sm" variant="outline" className="border-amber-200 hover:bg-amber-100 text-amber-900">
                    <Upload className="mr-2 h-4 w-4" /> Upload Now
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">Schedule Strategy Call</h4>
                  <p className="text-sm text-slate-600 mb-3">Book your monthly review with your advisor.</p>
                  <Button size="sm" variant="outline">Book Call</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function DisputeItem({ dispute }: { dispute: Dispute }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'GENERATED': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'SENT': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'IN_PROGRESS': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getIcon = (status: string) => {
    switch(status) {
      case 'GENERATED': return Wand2;
      case 'SENT': return FileText;
      case 'RESOLVED': return ShieldCheck;
      default: return Clock;
    }
  };

  const Icon = getIcon(dispute.status);
  const colorClass = getStatusColor(dispute.status);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
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
        <Badge variant="outline" className={`mb-1 font-medium ${colorClass} border-opacity-50`}>
          {dispute.status.replace('_', ' ')}
        </Badge>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(dispute.dateCreated), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
