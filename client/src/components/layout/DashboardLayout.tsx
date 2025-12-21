import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Users, 
  DollarSign,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Role } from "@/lib/schema";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation based on role
  const navItems = {
    CLIENT: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/disputes", label: "My Disputes", icon: FileText },
      { href: "/dashboard/documents", label: "Documents", icon: FileText },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
    AFFILIATE: [
      { href: "/affiliate", label: "Overview", icon: LayoutDashboard },
      { href: "/affiliate/referrals", label: "My Referrals", icon: Users },
      { href: "/affiliate/payouts", label: "Payouts", icon: DollarSign },
      { href: "/affiliate/settings", label: "Settings", icon: Settings },
    ],
    ADMIN: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/clients", label: "Clients", icon: Users },
      { href: "/admin/disputes", label: "Disputes", icon: ShieldCheck },
      { href: "/admin/affiliates", label: "Affiliates", icon: DollarSign },
      { href: "/admin/content", label: "Content", icon: FileText },
    ]
  };

  const currentNav = user?.role ? navItems[user.role as Role] || [] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-secondary" />
          <span className="font-serif font-bold text-xl text-primary">RiseOra</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive ? "bg-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-primary"}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-secondary" />
          <span className="font-serif font-bold text-lg text-primary">RiseOra</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-background pt-16 animate-in slide-in-from-top-10">
          <nav className="p-4 space-y-2">
            {currentNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-slate-50 text-slate-900 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
            <Button variant="destructive" className="w-full mt-8" onClick={() => logout()}>
              Sign Out
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
