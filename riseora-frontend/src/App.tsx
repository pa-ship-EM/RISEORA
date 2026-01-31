import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import Home from "@/pages/home";
import Services from "@/pages/services";
import Resources from "@/pages/resources";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AuthPage from "@/pages/auth";

// Placeholder for dashboard
const ClientDashboard = () => (
    <div className="flex items-center justify-center min-h-screen pt-20">
        <h1 className="text-2xl font-bold">Dashboard (Coming Soon)</h1>
    </div>
);

const NotFound = () => (
    <div className="flex items-center justify-center min-h-screen pt-20">
        <h1 className="text-2xl font-bold">Not Found</h1>
    </div>
);

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

            {/* Protected Routes */}
            <Route path="/dashboard">
                <ProtectedRoute allowedRoles={['CLIENT']}>
                    <ClientDashboard />
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
