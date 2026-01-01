import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Building2, Search, MoreVertical, Trash2, Loader2, AlertTriangle, UserPlus } from "lucide-react";
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

export default function AdminAffiliatesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [addAffiliateOpen, setAddAffiliateOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState<AdminUser | null>(null);
  const [newAffiliate, setNewAffiliate] = useState({ email: "", password: "", firstName: "", lastName: "" });

  const { data: affiliates = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/affiliates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/affiliates", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch affiliates");
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
        throw new Error(error.message || "Failed to delete affiliate");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setDeleteUserOpen(null);
      toast({ title: "Affiliate Deleted", description: "The affiliate account has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredAffiliates = affiliates.filter(a => 
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">Affiliate Management</h1>
            <p className="text-muted-foreground">Manage affiliate partners and their accounts.</p>
          </div>
          <Button onClick={() => setAddAffiliateOpen(true)} data-testid="button-add-affiliate">
            <UserPlus className="h-4 w-4 mr-2" /> Add Affiliate
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Affiliates</CardTitle>
              <CardDescription>{affiliates.length} registered affiliates</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search affiliates..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-affiliates"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
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
              Delete Affiliate
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
