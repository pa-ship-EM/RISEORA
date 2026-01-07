import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Users, Search, MoreVertical, Trash2, Loader2, AlertTriangle, Eye, Download, FileText, Crown, Activity } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface UserDetail extends AdminUser {
  subscription: { id: string; tier: string; status: string } | null;
  disputes: Array<{ id: string; creditorName: string; status: string; createdAt: string }>;
  recentActivity: Array<{ id: string; action: string; createdAt: string }>;
}

const TIER_OPTIONS = [
  { value: 'FREE', label: 'Free', color: 'bg-slate-100 text-slate-700' },
  { value: 'SELF_STARTER', label: 'Self-Starter ($49/mo)', color: 'bg-blue-100 text-blue-700' },
  { value: 'GROWTH', label: 'Growth / Pro ($99/mo)', color: 'bg-purple-100 text-purple-700' },
  { value: 'COMPLIANCE_PLUS', label: 'Compliance+ / Elite ($149/mo)', color: 'bg-amber-100 text-amber-700' },
];

function getTierColor(tier: string) {
  return TIER_OPTIONS.find(t => t.value === tier)?.color || 'bg-slate-100 text-slate-700';
}

function getTierLabel(tier: string) {
  return TIER_OPTIONS.find(t => t.value === tier)?.label || tier;
}

function exportToCSV(clients: AdminUser[]) {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Created'];
  const rows = clients.map(c => [
    c.id,
    c.firstName,
    c.lastName,
    c.email,
    c.role,
    format(new Date(c.createdAt), 'yyyy-MM-dd HH:mm')
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clients-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminClientsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUserOpen, setDeleteUserOpen] = useState<AdminUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newTier, setNewTier] = useState<string>("");

  const { data: clients = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/clients"],
    queryFn: async () => {
      const res = await fetch("/api/admin/clients", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch clients");
      return res.json();
    },
  });

  const { data: userDetail, isLoading: detailLoading, error: detailError } = useQuery<UserDetail>({
    queryKey: ["/api/admin/users", selectedUserId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${selectedUserId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch user details");
      return res.json();
    },
    enabled: !!selectedUserId,
    retry: false,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setDeleteUserOpen(null);
      toast({ title: "Client Deleted", description: "The client account has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, tier }: { userId: string; tier: string }) => {
      const res = await fetch(`/api/admin/users/${userId}/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update subscription");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users", selectedUserId] });
      toast({ title: "Subscription Updated", description: "The user's subscription tier has been changed." });
      setNewTier("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredClients = clients.filter(c => 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenUserDetail = (userId: string) => {
    setSelectedUserId(userId);
    setNewTier("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">Client Manager</h1>
            <p className="text-sm sm:text-base text-muted-foreground">View and manage all registered clients.</p>
          </div>
          <Button 
            variant="outline" 
            className="h-11 w-full sm:w-auto"
            onClick={() => exportToCSV(filteredClients)}
            disabled={filteredClients.length === 0}
            data-testid="button-export-clients"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">All Clients</CardTitle>
                  <CardDescription>{filteredClients.length} of {clients.length} clients</CardDescription>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search clients..." 
                  className="pl-9 h-11 text-base w-full sm:max-w-xs" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-clients"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>{clients.length === 0 ? "No clients found." : "No clients match your search."}</p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {filteredClients.map((client) => (
                    <div 
                      key={client.id} 
                      className="bg-slate-50 rounded-xl p-4 space-y-3"
                      data-testid={`card-client-${client.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-base">{client.firstName} {client.lastName}</p>
                          <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs flex-shrink-0">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Joined {formatDistanceToNow(new Date(client.createdAt), { addSuffix: true })}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-9 px-3"
                            onClick={() => handleOpenUserDetail(client.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-9 px-3 text-destructive hover:text-destructive"
                            onClick={() => setDeleteUserOpen(client)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
                          <TableCell className="font-medium">{client.firstName} {client.lastName}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Active</Badge>
                          </TableCell>
                          <TableCell>{formatDistanceToNow(new Date(client.createdAt), { addSuffix: true })}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-10 w-10">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenUserDetail(client.id)}>
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => setDeleteUserOpen(client)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      <Dialog open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[85vh] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              View and manage this client's account
            </DialogDescription>
          </DialogHeader>
          
          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : detailError ? (
            <div className="text-center py-12 text-destructive">
              <p className="text-sm">Failed to load client details. Please try again.</p>
            </div>
          ) : userDetail ? (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{userDetail.firstName} {userDetail.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userDetail.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{format(new Date(userDetail.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant="outline">{userDetail.role}</Badge>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-medium">Subscription</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Tier</p>
                      <Badge className={getTierColor(userDetail.subscription?.tier || 'FREE')}>
                        {getTierLabel(userDetail.subscription?.tier || 'FREE')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm">Change Subscription Tier</Label>
                    <div className="flex gap-2 mt-2">
                      <Select value={newTier} onValueChange={setNewTier}>
                        <SelectTrigger className="flex-1" data-testid="select-new-tier">
                          <SelectValue placeholder="Select new tier..." />
                        </SelectTrigger>
                        <SelectContent>
                          {TIER_OPTIONS.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={() => newTier && updateSubscriptionMutation.mutate({ userId: userDetail.id, tier: newTier })}
                        disabled={!newTier || updateSubscriptionMutation.isPending}
                        data-testid="button-update-tier"
                      >
                        {updateSubscriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Disputes ({userDetail.disputes.length})</p>
                  </div>
                  {userDetail.disputes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No disputes created yet</p>
                  ) : (
                    <div className="space-y-2">
                      {userDetail.disputes.slice(0, 5).map(d => (
                        <div key={d.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                          <span className="truncate">{d.creditorName}</span>
                          <Badge variant="outline" className="text-xs">{d.status.replace(/_/g, ' ')}</Badge>
                        </div>
                      ))}
                      {userDetail.disputes.length > 5 && (
                        <p className="text-xs text-muted-foreground">+{userDetail.disputes.length - 5} more disputes</p>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Recent Activity</p>
                  </div>
                  {userDetail.recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  ) : (
                    <div className="space-y-2">
                      {userDetail.recentActivity.map(a => (
                        <div key={a.id} className="flex items-center justify-between text-sm">
                          <span>{a.action.replace(/_/g, ' ')}</span>
                          <span className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUserId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteUserOpen} onOpenChange={() => setDeleteUserOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Client
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteUserOpen?.firstName} {deleteUserOpen?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserOpen(null)}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={() => deleteUserOpen && deleteUserMutation.mutate(deleteUserOpen.id)}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
