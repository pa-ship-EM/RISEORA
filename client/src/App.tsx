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
import Contact from "@/pages/contact";
import InvestorOverview from "@/pages/investor";
import TermsAndLegal from "@/pages/legal/terms";
import SecurityPage from "@/pages/legal/security";
import PrivacyPolicy from "@/pages/legal/privacy";
import AffiliateDisclosure from "@/pages/legal/affiliate-disclosure";
import AIDisclosure from "@/pages/legal/ai-disclosure";
import CookiePolicy from "@/pages/legal/cookies";
import BusinessPartnerships from "@/pages/partnerships";
import ClientDashboard from "@/pages/dashboard/client";
import AffiliateDashboard from "@/pages/dashboard/affiliate";
import AdminDashboard from "@/pages/dashboard/admin";
import DisputesPage from "@/pages/dashboard/disputes";
import DocumentsPage from "@/pages/dashboard/documents";
import SettingsPage from "@/pages/dashboard/settings";
import AdminClientsPage from "@/pages/admin/clients";
import AdminAffiliatesPage from "@/pages/admin/affiliates";
import AdminDisputesPage from "@/pages/admin/disputes";
import AdminCompliancePage from "@/pages/admin/compliance";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminIotPage from "@/pages/admin/iot";
import ActivityPage from "@/pages/dashboard/activity";
import CreditReportsPage from "@/pages/dashboard/credit-reports";
import AnalyticsPage from "@/pages/dashboard/analytics";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/resources" component={Resources} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/investors" component={InvestorOverview} />
      <Route path="/legal" component={TermsAndLegal} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/affiliate-disclosure" component={AffiliateDisclosure} />
      <Route path="/ai-disclosure" component={AIDisclosure} />
      <Route path="/cookies" component={CookiePolicy} />
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

      <Route path="/dashboard/activity">
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <ActivityPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/credit-reports">
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <CreditReportsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/analytics">
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <AnalyticsPage />
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

      <Route path="/admin/clients">
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminClientsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/affiliates">
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminAffiliatesPage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/disputes">
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDisputesPage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/compliance">
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminCompliancePage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/settings">
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminSettingsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/iot">
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminIotPage />
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
