import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { mockDb } from "@/lib/mock-db";
import { User, Role } from "@/lib/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Use Mock DB to find user
    const dbUser = mockDb.getUserByEmail(email);
    
    if (dbUser) {
      setUser(dbUser);
      setIsLoading(false);
      
      // Redirect based on role
      if (dbUser.role === "ADMIN") setLocation("/admin");
      else if (dbUser.role === "AFFILIATE") setLocation("/affiliate");
      else setLocation("/dashboard");
    } else {
      // Fallback for demo if email doesn't match predefined users
      const mockUser: User = { 
        id: "temp-user", 
        email, 
        firstName: "New", 
        lastName: "User", 
        role: "CLIENT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(mockUser);
      setIsLoading(false);
      setLocation("/dashboard");
    }
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
