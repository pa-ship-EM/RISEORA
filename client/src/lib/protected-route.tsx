import { useAuth } from "@/hooks/use-auth";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("client" | "affiliate" | "admin")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role!)) {
      // Redirect to appropriate dashboard if wrong role
      if (user.role === "admin") setLocation("/admin");
      else if (user.role === "affiliate") setLocation("/affiliate");
      else setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
