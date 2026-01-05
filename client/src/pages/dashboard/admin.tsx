import { useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { 
  Users, 
  ShieldCheck, 
  FileText, 
  Search,
  CheckCircle2,
  Clock,
  Lock,
  MoreVertical,
  UserPlus,
  Trash2,
  Loader2,
  Building2,
  AlertTriangle,
  Settings
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface AdminDispute {
  id: string;
  userId: string;
  creditorName: string;
  bureau: string;
  disputeReason: string;
  status: string;
  createdAt: string;
}

interface AdminStats {
  totalClients: number;
  totalAffiliates: number;
  totalDisputes: number;
  pendingDisputes: number;
  resolvedDisputes: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [addAffiliateOpen, setAddAffiliateOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState<AdminUser | null>(null);
  const [newAffiliate, setNewAffiliate] = useState({ email: "", password: "", firstName: "", lastName: "" });

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/clients"],
    queryFn: async () => {
      const res = await fetch("/api/admin/clients", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch clients");
      return res.json();
    },
  });

  const { data: affiliates = [], isLoading: affiliatesLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/affiliates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/affiliates", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch affiliates");
      return res.json();
    },
  });

  const { data: disputes = [], isLoading: disputesLoading } = useQuery<AdminDispute[]>({
    queryKey: ["/api/admin/disputes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/disputes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch disputes");
      return res.json();
    },
  });

  const createAffiliateMutation = useMutation({
    mutationFn: async (data: typeof newAffiliate) => {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create affiliate");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setAddAffiliateOpen(false);
      setNewAffiliate({ email: "", password: "", firstName: "", lastName: "" });
      toast({ title: "Affiliate Created", description: "New affiliate account has been created." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setDeleteUserOpen(null);
      toast({ title: "User Deleted", description: "The user account has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredClients = clients.filter(c => 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAffiliates = affiliates.filter(a => 
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage clients, affiliates, and monitor platform activity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Clients" value={stats?.totalClients ?? 0} icon={Users} isLoading={statsLoading} />
          <StatCard title="Affiliates" value={stats?.totalAffiliates ?? 0} icon={Building2} isLoading={statsLoading} />
          <StatCard title="Total Disputes" value={stats?.totalDisputes ?? 0} icon={FileText} isLoading={statsLoading} />
          <StatCard title="Pending Review" value={stats?.pendingDisputes ?? 0} icon={Clock} color="text-amber-600" isLoading={statsLoading} />
          <StatCard title="Resolved" value={stats?.resolvedDisputes ?? 0} icon={CheckCircle2} color="text-emerald-600" isLoading={statsLoading} />
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="bg-white border p-1 h-auto grid grid-cols-4 gap-2">
            <TabsTrigger value="clients" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <Users className="h-4 w-4 mr-2" /> Clients
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <Building2 className="h-4 w-4 mr-2" /> Affiliates
            </TabsTrigger>
            <TabsTrigger value="disputes" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <FileText className="h-4 w-4 mr-2" /> Disputes
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>View and manage all registered clients.</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search clients..." 
                    className="pl-9 bg-slate-50 border-none" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-clients"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {clientsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No clients found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
                          <TableCell className="font-medium">{client.firstName} {client.lastName}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{formatDistanceToNow(new Date(client.createdAt), { addSuffix: true })}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Affiliate Management</CardTitle>
                  <CardDescription>Manage affiliate partners and their accounts.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search affiliates..." 
                      className="pl-9 bg-slate-50 border-none" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-affiliates"
                    />
                  </div>
                  <Button onClick={() => setAddAffiliateOpen(true)} data-testid="button-add-affiliate">
                    <UserPlus className="h-4 w-4 mr-2" /> Add Affiliate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {affiliatesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredAffiliates.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No affiliates found.</p>
                    <Button className="mt-4" onClick={() => setAddAffiliateOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" /> Add First Affiliate
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAffiliates.map((affiliate) => (
                        <TableRow key={affiliate.id} data-testid={`row-affiliate-${affiliate.id}`}>
                          <TableCell className="font-medium">{affiliate.firstName} {affiliate.lastName}</TableCell>
                          <TableCell>{affiliate.email}</TableCell>
                          <TableCell>{formatDistanceToNow(new Date(affiliate.createdAt), { addSuffix: true })}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => setDeleteUserOpen(affiliate)}
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Disputes</CardTitle>
                <CardDescription>Monitor all dispute letters across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {disputesLoading ? (
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
                          <TableCell>{dispute.bureau}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{dispute.disputeReason}</TableCell>
                          <TableCell>
                            <Badge variant={dispute.status === 'RESOLVED' ? 'default' : 'secondary'}>
                              {dispute.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">CROA Compliance</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">FCRA Guidelines</span>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Platform Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <p className="font-medium mb-1">Support Email</p>
                    <p className="text-sm text-muted-foreground">support@riseora.org</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <p className="font-medium mb-1">Business Address</p>
                    <p className="text-sm text-muted-foreground">5820 E WT Harris Blvd, Ste 109 PMB 1100, Charlotte, NC 28215</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <p className="font-medium mb-1">Phone</p>
                    <p className="text-sm text-muted-foreground">(828) 377-9388</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <p className="font-medium mb-1">Logged in as</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation("/admin/settings")}
                    data-testid="button-admin-change-password"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={addAffiliateOpen} onOpenChange={setAddAffiliateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Affiliate</DialogTitle>
            <DialogDescription>Create a new affiliate partner account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  value={newAffiliate.firstName}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, firstName: e.target.value })}
                  data-testid="input-affiliate-firstname"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  value={newAffiliate.lastName}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, lastName: e.target.value })}
                  data-testid="input-affiliate-lastname"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={newAffiliate.email}
                onChange={(e) => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
                data-testid="input-affiliate-email"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password"
                value={newAffiliate.password}
                onChange={(e) => setNewAffiliate({ ...newAffiliate, password: e.target.value })}
                data-testid="input-affiliate-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAffiliateOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => createAffiliateMutation.mutate(newAffiliate)}
              disabled={createAffiliateMutation.isPending || !newAffiliate.email || !newAffiliate.password || !newAffiliate.firstName || !newAffiliate.lastName}
              data-testid="button-create-affiliate"
            >
              {createAffiliateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Affiliate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteUserOpen} onOpenChange={() => setDeleteUserOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteUserOpen?.firstName} {deleteUserOpen?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              All data associated with this user will be permanently deleted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserOpen(null)}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={() => deleteUserOpen && deleteUserMutation.mutate(deleteUserOpen.id)}
              disabled={deleteUserMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-primary", isLoading = false }: { 
  title: string; 
  value: number; 
  icon: any; 
  color?: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <div className="text-2xl font-bold font-serif">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
