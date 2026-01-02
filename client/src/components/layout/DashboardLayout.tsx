import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
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
  X,
  Bell,
  Check
} from "lucide-react";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/lib/schema";
import { formatDistanceToNow } from "date-fns";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function NotificationBell() {
  const { unreadCount, unreadNotifications, markRead, markAllRead } = useNotifications();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs"
              onClick={() => markAllRead()}
              data-testid="button-mark-all-read"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {unreadNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          unreadNotifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className="flex flex-col items-start gap-1 p-3 cursor-pointer"
              onClick={() => markRead(notification.id)}
              data-testid={`notification-${notification.id}`}
            >
              <div className="flex items-start gap-2 w-full">
                <Bell className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        {unreadNotifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 text-center text-xs text-muted-foreground">
              +{unreadNotifications.length - 5} more notifications
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
      { href: "/admin/clients", label: "Client Manager", icon: Users },
      { href: "/admin/disputes", label: "Dispute Queue", icon: ShieldCheck },
      { href: "/admin/compliance", label: "Audit Logs", icon: FileText },
      { href: "/admin/affiliates", label: "Affiliates", icon: DollarSign },
    ]
  };

  const currentNav = user?.role ? navItems[user.role as Role] || [] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <img src={logoImage} alt="RiseOra" className="h-10 w-10 object-contain" />
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
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
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
            <NotificationBell />
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
          <img src={logoImage} alt="RiseOra" className="h-8 w-8 object-contain" />
          <span className="font-serif font-bold text-lg text-primary">RiseOra</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
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
