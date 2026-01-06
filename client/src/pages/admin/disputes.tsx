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
import { FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface AdminDispute {
  id: string;
  userId: string;
  creditorName: string;
  bureau: string;
  disputeReason: string;
  status: string;
  createdAt: string;
}

export default function AdminDisputesPage() {
  const { data: disputes = [], isLoading } = useQuery<AdminDispute[]>({
    queryKey: ["/api/admin/disputes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/disputes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch disputes");
      return res.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-700';
      case 'READY_TO_MAIL': return 'bg-purple-100 text-purple-700';
      case 'MAILED': return 'bg-amber-100 text-amber-700';
      case 'DELIVERED': return 'bg-yellow-100 text-yellow-700';
      case 'IN_INVESTIGATION': return 'bg-blue-100 text-blue-700';
      case 'RESPONSE_RECEIVED': return 'bg-indigo-100 text-indigo-700';
      case 'REMOVED': return 'bg-emerald-100 text-emerald-700';
      case 'VERIFIED': return 'bg-orange-100 text-orange-700';
      case 'NO_RESPONSE': return 'bg-red-100 text-red-700';
      case 'ESCALATION_AVAILABLE': return 'bg-rose-100 text-rose-700';
      case 'CLOSED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const terminalStatuses = ['REMOVED', 'VERIFIED', 'NO_RESPONSE', 'ESCALATION_AVAILABLE', 'CLOSED'];
  const pendingDisputes = disputes.filter(d => ['DRAFT', 'READY_TO_MAIL'].includes(d.status));
  const inProgressDisputes = disputes.filter(d => ['MAILED', 'DELIVERED', 'IN_INVESTIGATION', 'RESPONSE_RECEIVED'].includes(d.status));
  const resolvedDisputes = disputes.filter(d => terminalStatuses.includes(d.status));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">Dispute Queue</h1>
          <p className="text-muted-foreground">Monitor all dispute letters across the platform.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-700">{pendingDisputes.length}</div>
              <p className="text-sm text-purple-600">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-700">{inProgressDisputes.length}</div>
              <p className="text-sm text-blue-600">In Progress</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-700">{resolvedDisputes.length}</div>
              <p className="text-sm text-emerald-600">Resolved</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Disputes</CardTitle>
            <CardDescription>{disputes.length} total disputes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : disputes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No disputes yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creditor</TableHead>
                    <TableHead>Bureau</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id} data-testid={`row-dispute-${dispute.id}`}>
                      <TableCell className="font-medium">{dispute.creditorName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{dispute.bureau}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{dispute.disputeReason}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
