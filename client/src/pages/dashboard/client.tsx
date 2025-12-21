import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, Upload, FileText, AlertCircle, Clock, Wand2, ShieldCheck } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

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
  
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Welcome back, {user?.firstName}</h1>
          <p className="text-muted-foreground">Dispute Wizard™ is tracking your progress.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button className="bg-secondary text-primary hover:bg-secondary/90 shadow-sm font-semibold">
              <Wand2 className="mr-2 h-4 w-4" /> Start New Dispute
           </Button>
        </div>
      </div>

      {/* Credit Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Credit Score History</CardTitle>
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

        <Card className="shadow-sm border-slate-200 bg-primary text-white">
          <CardHeader>
            <CardTitle className="text-white">Current Score</CardTitle>
            <CardDescription className="text-primary-foreground/70">Updated 2 days ago</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-8 border-secondary/30 mb-4">
              <div className="text-5xl font-bold font-serif text-white">642</div>
              <div className="absolute -bottom-2 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ArrowUp className="h-3 w-3" /> +62 pts
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-primary-foreground/80">Next Update: 28 Days</p>
              <Progress value={65} className="h-2 w-full bg-white/20" />
              <div className="flex justify-between text-xs text-primary-foreground/60 w-full pt-1">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dispute Wizard™ Activity</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { creditor: "Chase Bank", item: "Late Payment", status: "Metro 2 Analysis", date: "Just now", icon: Wand2, color: "text-purple-600" },
                { creditor: "Midland Credit", item: "Collection", status: "Reviewing", date: "May 10", icon: ShieldCheck, color: "text-emerald-600" },
                { creditor: "Capital One", item: "Inquiry", status: "Letter Sent", date: "May 02", icon: FileText, color: "text-blue-600" },
              ].map((dispute, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md border border-slate-100">
                      <dispute.icon className={`h-4 w-4 ${dispute.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-primary">{dispute.creditor}</p>
                      <p className="text-xs text-muted-foreground">{dispute.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1 bg-white">{dispute.status}</Badge>
                    <p className="text-xs text-muted-foreground">{dispute.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Action Required</CardTitle>
            <CardDescription>Please complete these items to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900">Upload ID Document</h4>
                  <p className="text-sm text-amber-700 mb-2">We need a clear copy of your driver's license.</p>
                  <Button size="sm" variant="outline" className="border-amber-200 hover:bg-amber-100 text-amber-900">
                    <Upload className="mr-2 h-4 w-4" /> Upload Now
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Schedule Strategy Call</h4>
                  <p className="text-sm text-slate-600 mb-2">Book your monthly review with your advisor.</p>
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
