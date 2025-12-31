import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const mockClients = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active", disputes: 3, plan: "Pro" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Action Required", disputes: 1, plan: "Free" },
  { id: 3, name: "Michael Ross", email: "mike@example.com", status: "Active", disputes: 5, plan: "Pro" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Advisor Command Center</h1>
            <p className="text-muted-foreground">Managing {mockClients.length} active clients with full compliance tracking.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white border-primary/20 text-primary">
              <History className="mr-2 h-4 w-4" /> Compliance Logs
            </Button>
            <Button className="bg-primary text-white">
              <Users className="mr-2 h-4 w-4" /> Add New Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Clients" value="124" icon={Users} trend="+12%" />
          <StatCard title="Pending Review" value="18" icon={Clock} color="text-amber-600" />
          <StatCard title="Approved for Mail" value="32" icon={CheckCircle2} color="text-emerald-600" />
          <StatCard title="Encrypted Vaults" value="Active" icon={Lock} color="text-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>Monitor progress and approve pending disputes.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-9 bg-slate-50 border-none" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead>Pending Approval</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-bold text-slate-900">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'Active' ? 'secondary' : 'destructive'} className="bg-opacity-10 text-opacity-100 font-bold">
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{client.disputes} letters</span>
                          {client.disputes > 0 && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Awaiting Consent</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="font-bold text-primary">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-[#faf9f6]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                Compliance Tracker
              </CardTitle>
              <CardDescription>CROA & FCRA Audit Status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Missing Client Signature</h4>
                    <p className="text-xs text-slate-600 mb-3">John Doe has 2 disputes prepared but hasn't signed the required CROA disclosure.</p>
                    <Button size="sm" variant="default" className="h-8">Request Signature</Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-900">Audit Logs Clean</h4>
                    <p className="text-xs text-emerald-700">Daily sync with compliance engine completed successfully. All data encrypted.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button variant="outline" className="w-full bg-white text-primary font-bold">
                  View Full Audit History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, trend, color = "text-primary" }: any) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-serif">{value}</div>
        {trend && (
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {trend} <span className="text-muted-foreground font-normal">vs last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}