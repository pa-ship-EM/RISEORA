import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ShieldCheck, CheckCircle2, Lock, FileText, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const auditLogs = [
  { id: 1, action: "User Login", user: "admin@riseora.org", timestamp: new Date(Date.now() - 1000 * 60 * 5), status: "success" },
  { id: 2, action: "Dispute Generated", user: "client@example.com", timestamp: new Date(Date.now() - 1000 * 60 * 30), status: "success" },
  { id: 3, action: "Password Changed", user: "john@example.com", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "success" },
  { id: 4, action: "Document Uploaded", user: "jane@example.com", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), status: "success" },
  { id: 5, action: "Subscription Upgraded", user: "mike@example.com", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), status: "success" },
];

export default function AdminCompliancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">Audit Logs & Compliance</h1>
          <p className="text-muted-foreground">Monitor platform activity and compliance status.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-700">CROA Compliant</p>
                <p className="text-sm text-emerald-600">All disclosures current</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-700">FCRA Compliant</p>
                <p className="text-sm text-emerald-600">Guidelines followed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-center gap-3">
              <Lock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-bold text-blue-700">AES-256 Encryption</p>
                <p className="text-sm text-blue-600">All data secured</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest platform actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.user}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-700">
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Compliance Checklist
              </CardTitle>
              <CardDescription>Required regulatory items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">CROA Disclosure</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Consumer Rights Notice</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">No Guarantees Policy</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Educational Model Compliance</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Data Encryption</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">AES-256</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
