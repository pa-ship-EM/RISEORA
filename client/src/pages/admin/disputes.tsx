import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Loader2, Search, Eye, User, Paperclip, CheckSquare, Download, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";

interface AdminDispute {
  id: string;
  userId: string;
  creditorName: string;
  bureau: string;
  disputeReason: string;
  status: string;
  createdAt: string;
  accountNumber?: string;
  letterContent?: string;
}

interface DisputeDetail extends AdminDispute {
  user: { id: string; email: string; firstName: string; lastName: string } | null;
  evidence: Array<{ id: string; fileName: string; documentType: string; fileSize: number }>;
  checklist: Array<{ id: string; label: string; completed: boolean }>;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'READY_TO_MAIL', label: 'Ready to Mail' },
  { value: 'MAILED', label: 'Mailed' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'IN_INVESTIGATION', label: 'In Investigation' },
  { value: 'RESPONSE_RECEIVED', label: 'Response Received' },
  { value: 'REMOVED', label: 'Removed' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'NO_RESPONSE', label: 'No Response' },
  { value: 'ESCALATION_AVAILABLE', label: 'Escalation Available' },
  { value: 'CLOSED', label: 'Closed' },
];

const BUREAU_OPTIONS = [
  { value: 'all', label: 'All Bureaus' },
  { value: 'EQUIFAX', label: 'Equifax' },
  { value: 'EXPERIAN', label: 'Experian' },
  { value: 'TRANSUNION', label: 'TransUnion' },
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function exportToCSV(disputes: AdminDispute[]) {
  const headers = ['ID', 'Creditor', 'Bureau', 'Reason', 'Status', 'Created'];
  const rows = disputes.map(d => [
    d.id,
    d.creditorName,
    d.bureau,
    d.disputeReason.replace(/,/g, ';'),
    d.status,
    format(new Date(d.createdAt), 'yyyy-MM-dd HH:mm')
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `disputes-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDisputesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bureauFilter, setBureauFilter] = useState("all");
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  const { data: disputes = [], isLoading } = useQuery<AdminDispute[]>({
    queryKey: ["/api/admin/disputes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/disputes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch disputes");
      return res.json();
    },
  });

  const { data: disputeDetail, isLoading: detailLoading, error: detailError } = useQuery<DisputeDetail>({
    queryKey: ["/api/admin/disputes", selectedDisputeId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/disputes/${selectedDisputeId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dispute details");
      return res.json();
    },
    enabled: !!selectedDisputeId,
    retry: false,
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
      case 'CLOSED': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = searchQuery === "" || 
      d.creditorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.disputeReason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    const matchesBureau = bureauFilter === "all" || d.bureau === bureauFilter;
    return matchesSearch && matchesStatus && matchesBureau;
  });

  const terminalStatuses = ['REMOVED', 'VERIFIED', 'NO_RESPONSE', 'ESCALATION_AVAILABLE', 'CLOSED'];
  const pendingDisputes = disputes.filter(d => ['DRAFT', 'READY_TO_MAIL'].includes(d.status));
  const inProgressDisputes = disputes.filter(d => ['MAILED', 'DELIVERED', 'IN_INVESTIGATION', 'RESPONSE_RECEIVED'].includes(d.status));
  const resolvedDisputes = disputes.filter(d => terminalStatuses.includes(d.status));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">Dispute Queue</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Monitor all dispute letters across the platform.</p>
          </div>
          <Button 
            variant="outline" 
            className="h-11 w-full sm:w-auto"
            onClick={() => exportToCSV(filteredDisputes)}
            disabled={filteredDisputes.length === 0}
            data-testid="button-export-disputes"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
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
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">All Disputes</CardTitle>
                  <CardDescription>{filteredDisputes.length} of {disputes.length} disputes</CardDescription>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 sm:max-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-9 h-11 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-disputes"
                  />
                </div>
                <div className="flex gap-2 flex-1 sm:flex-none">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1 sm:w-40 h-11" data-testid="select-status-filter">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={bureauFilter} onValueChange={setBureauFilter}>
                    <SelectTrigger className="flex-1 sm:w-36 h-11" data-testid="select-bureau-filter">
                      <SelectValue placeholder="Bureau" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUREAU_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredDisputes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>{disputes.length === 0 ? "No disputes yet." : "No disputes match your filters."}</p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {filteredDisputes.map((dispute) => (
                    <button 
                      key={dispute.id} 
                      className="w-full text-left bg-slate-50 rounded-xl p-4 space-y-3 active:bg-slate-100 transition-colors"
                      onClick={() => setSelectedDisputeId(dispute.id)}
                      data-testid={`button-card-dispute-${dispute.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-base truncate">{dispute.creditorName}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{dispute.disputeReason}</p>
                        </div>
                        <Eye className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{dispute.bureau}</Badge>
                        <Badge className={`text-xs ${getStatusColor(dispute.status)}`}>
                          {dispute.status.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creditor</TableHead>
                        <TableHead>Bureau</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDisputes.map((dispute) => (
                        <TableRow key={dispute.id} data-testid={`row-dispute-${dispute.id}`}>
                          <TableCell className="font-medium">{dispute.creditorName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{dispute.bureau}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{dispute.disputeReason}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(dispute.status)}>
                              {dispute.status.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-10 w-10"
                              onClick={() => setSelectedDisputeId(dispute.id)}
                              data-testid={`button-view-dispute-${dispute.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedDisputeId} onOpenChange={(open) => !open && setSelectedDisputeId(null)}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg sm:text-xl">Dispute Details</DialogTitle>
            <DialogDescription className="text-sm">
              Full details for this dispute letter
            </DialogDescription>
          </DialogHeader>
          
          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : detailError ? (
            <div className="text-center py-12 text-destructive">
              <p className="text-sm">Failed to load dispute details. Please try again.</p>
            </div>
          ) : disputeDetail ? (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Creditor</p>
                    <p className="font-medium">{disputeDetail.creditorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bureau</p>
                    <Badge variant="outline">{disputeDetail.bureau}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(disputeDetail.status)}>
                      {disputeDetail.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(disputeDetail.createdAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>

                {disputeDetail.user && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">User</p>
                      </div>
                      <p className="text-sm">{disputeDetail.user.firstName} {disputeDetail.user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{disputeDetail.user.email}</p>
                    </div>
                  </>
                )}

                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dispute Reason</p>
                  <p className="text-sm">{disputeDetail.disputeReason}</p>
                </div>

                {disputeDetail.letterContent && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Letter Content</p>
                      <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap max-h-60 overflow-auto">
                        {disputeDetail.letterContent}
                      </div>
                    </div>
                  </>
                )}

                {disputeDetail.evidence.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Evidence ({disputeDetail.evidence.length})</p>
                      </div>
                      <div className="space-y-2">
                        {disputeDetail.evidence.map(e => (
                          <div key={e.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                            <span className="truncate">{e.fileName}</span>
                            <span className="text-muted-foreground">{formatFileSize(e.fileSize)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {disputeDetail.checklist.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Checklist ({disputeDetail.checklist.filter(c => c.completed).length}/{disputeDetail.checklist.length})
                        </p>
                      </div>
                      <div className="space-y-1">
                        {disputeDetail.checklist.map(c => (
                          <div key={c.id} className="flex items-center gap-2 text-sm">
                            <span className={c.completed ? "text-emerald-600" : "text-muted-foreground"}>
                              {c.completed ? "✓" : "○"}
                            </span>
                            <span className={c.completed ? "line-through text-muted-foreground" : ""}>
                              {c.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
