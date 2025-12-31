import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Services from "@/pages/services";
import Resources from "@/pages/resources";
import About from "@/pages/about";
import AuthPage from "@/pages/auth";
import InvestorOverview from "@/pages/investor";
import TermsAndLegal from "@/pages/legal/terms";
import SecurityPage from "@/pages/legal/security";
import BusinessPartnerships from "@/pages/partnerships";
import ClientDashboard from "@/pages/dashboard/client";
import AffiliateDashboard from "@/pages/dashboard/affiliate";
import AdminDashboard from "@/pages/dashboard/admin";
import DisputesPage from "@/pages/dashboard/disputes";
import DocumentsPage from "@/pages/dashboard/documents";
import SettingsPage from "@/pages/dashboard/settings";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/resources" component={Resources} />
      <Route path="/about" component={About} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/investors" component={InvestorOverview} />
      <Route path="/legal" component={TermsAndLegal} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/partnerships" component={BusinessPartnerships} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <ClientDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/disputes">
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <DisputesPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/documents">
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <DocumentsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/settings">
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <SettingsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/affiliate">
        <ProtectedRoute allowedRoles={['AFFILIATE']}>
          <AffiliateDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
