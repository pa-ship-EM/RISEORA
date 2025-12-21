import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, CheckCircle, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage users, disputes, and system settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>Add New User</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,284</div>
            <p className="text-primary-foreground/70 text-sm mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">432</div>
            <p className="text-slate-500 text-sm mt-1">85 requiring attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">$42.5k</div>
            <p className="text-slate-500 text-sm mt-1">On track to beat target</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Client", status: "Active", joined: "Jan 12, 2024" },
                  { name: "Sarah Partner", email: "sarah@partner.com", role: "Affiliate", status: "Active", joined: "Feb 04, 2024" },
                  { name: "Michael Smith", email: "mike@test.com", role: "Client", status: "Review", joined: "Mar 20, 2024" },
                  { name: "Emily Admin", email: "admin@riseora.org", role: "Admin", status: "Active", joined: "Dec 01, 2023" },
                  { name: "Robert Jones", email: "bob@gmail.com", role: "Client", status: "Inactive", joined: "Apr 05, 2024" },
                ].map((user, i) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 group">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="font-normal">{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.status === "Active" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        {user.status === "Review" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {user.status === "Inactive" && <div className="h-2 w-2 rounded-full bg-slate-300 ml-1" />}
                        <span className="text-slate-700">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{user.joined}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
