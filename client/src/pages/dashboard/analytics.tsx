import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Clock, CheckCircle2, XCircle, BarChart3, PieChart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface AnalyticsData {
  summary: {
    total: number;
    inProgress: number;
    removed: number;
    verified: number;
    successRate: number;
    avgResolutionDays: number;
  };
  statusBreakdown: Array<{ status: string; count: number }>;
  bureauBreakdown: Array<{ bureau: string; count: number }>;
  monthlyTrend: Array<{ month: string; created: number; resolved: number }>;
  reasonBreakdown: Array<{ reason: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const STATUS_COLORS: Record<string, string> = {
  'DRAFT': '#94a3b8',
  'READY TO MAIL': '#60a5fa',
  'MAILED': '#a78bfa',
  'DELIVERED': '#c084fc',
  'IN INVESTIGATION': '#fbbf24',
  'RESPONSE RECEIVED': '#fb923c',
  'REMOVED': '#22c55e',
  'VERIFIED': '#ef4444',
  'NO RESPONSE': '#f97316',
  'ESCALATION AVAILABLE': '#8b5cf6',
  'CLOSED': '#6b7280',
};

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/disputes/analytics"],
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p>No analytics data available yet.</p>
          <p className="text-sm">Start creating disputes to see your progress.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary" data-testid="page-title">
            Progress Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your dispute progress, success rates, and improvement over time.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card data-testid="stat-total">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.summary.total}</p>
                  <p className="text-sm text-muted-foreground">Total Disputes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-progress">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.summary.inProgress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-removed">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.summary.removed}</p>
                  <p className="text-sm text-muted-foreground">Removed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-success-rate">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.summary.successRate}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Trend</CardTitle>
              <CardDescription>Disputes created vs resolved over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {data.monthlyTrend.some(m => m.created > 0 || m.resolved > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="created" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Created"
                      dot={{ fill: '#3b82f6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Resolved"
                      dot={{ fill: '#22c55e' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <p>No trend data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
              <CardDescription>Current status of all your disputes</CardDescription>
            </CardHeader>
            <CardContent>
              {data.statusBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={data.statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="status"
                      label={({ status, count }) => `${status}: ${count}`}
                      labelLine={false}
                    >
                      {data.statusBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.status.toUpperCase()] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <p>No disputes yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">By Credit Bureau</CardTitle>
              <CardDescription>Distribution of disputes across bureaus</CardDescription>
            </CardHeader>
            <CardContent>
              {data.bureauBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.bureauBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="bureau" tick={{ fontSize: 12 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <p>No bureau data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Dispute Reasons</CardTitle>
              <CardDescription>Most common reasons for your disputes</CardDescription>
            </CardHeader>
            <CardContent>
              {data.reasonBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {data.reasonBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.reason}</p>
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[150px] flex items-center justify-center text-muted-foreground">
                  <p>No reason data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {data.summary.avgResolutionDays > 0 && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">{data.summary.avgResolutionDays} days</p>
                  <p className="text-muted-foreground">Average resolution time for your disputes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
