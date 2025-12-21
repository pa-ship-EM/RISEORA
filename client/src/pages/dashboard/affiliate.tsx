import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, DollarSign, Users, TrendingUp, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AffiliateDashboard() {
  const { toast } = useToast();
  const referralLink = "https://riseora.org/ref/sarah-p";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">Track your referrals and earnings.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
          <Input value={referralLink} readOnly className="w-64 border-0 bg-transparent focus-visible:ring-0" />
          <Button size="sm" onClick={copyLink}>
            <Copy className="h-4 w-4 mr-2" /> Copy Link
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={DollarSign} label="Total Earnings" value="$1,250.00" color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={CreditCard} label="Pending Payout" value="$450.00" color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Users} label="Total Referrals" value="24" color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={TrendingUp} label="Conversion Rate" value="12%" color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Referrals */}
        <Card className="col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
            <CardDescription>Latest signups using your link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { user: "m...k@gmail.com", date: "Today", plan: "Professional", status: "Active", comm: "$30.00" },
                    { user: "j...d@yahoo.com", date: "Yesterday", plan: "Premier", status: "Active", comm: "$40.00" },
                    { user: "s...t@outlook.com", date: "May 18", plan: "Starter", status: "Pending", comm: "$20.00" },
                    { user: "b...g@gmail.com", date: "May 15", plan: "Professional", status: "Active", comm: "$30.00" },
                  ].map((row, i) => (
                    <tr key={i} className="bg-white hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{row.user}</td>
                      <td className="px-4 py-3 text-slate-500">{row.date}</td>
                      <td className="px-4 py-3 text-slate-500">{row.plan}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600">{row.comm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Materials */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Marketing assets to help you promote.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <h4 className="font-semibold text-primary mb-1">Social Media Kit</h4>
              <p className="text-sm text-muted-foreground">Instagram posts, stories, and copy.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <h4 className="font-semibold text-primary mb-1">Email Templates</h4>
              <p className="text-sm text-muted-foreground">Pre-written emails for your list.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <h4 className="font-semibold text-primary mb-1">Banner Ads</h4>
              <p className="text-sm text-muted-foreground">Web banners in standard sizes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
