import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import AuthPage from "@/pages/auth";
import ClientDashboard from "@/pages/dashboard/client";
import AffiliateDashboard from "@/pages/dashboard/affiliate";
import AdminDashboard from "@/pages/dashboard/admin";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/about" component={About} />
      <Route path="/auth" component={AuthPage} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute allowedRoles={['client']}>
          <ClientDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/affiliate">
        <ProtectedRoute allowedRoles={['affiliate']}>
          <AffiliateDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute allowedRoles={['admin']}>
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
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
