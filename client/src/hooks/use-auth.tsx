import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";

type UserRole = "client" | "affiliate" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const login = async (role: UserRole) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let mockUser: User;
    switch(role) {
      case "admin":
        mockUser = { id: "1", name: "Admin User", email: "admin@riseora.org", role: "admin" };
        break;
      case "affiliate":
        mockUser = { id: "2", name: "Sarah Partner", email: "sarah@partner.com", role: "affiliate" };
        break;
      default:
        mockUser = { id: "3", name: "John Doe", email: "john@example.com", role: "client" };
    }
    
    setUser(mockUser);
    setIsLoading(false);

    // Redirect based on role
    if (role === "admin") setLocation("/admin");
    else if (role === "affiliate") setLocation("/affiliate");
    else setLocation("/dashboard");
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    setIsLoading(false);
    setLocation("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
