import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Parse URL params for default tab
  const params = new URLSearchParams(window.location.search);
  const defaultTab = params.get("tab") === "signup" ? "signup" : "login";

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof authSchema>, isSignup: boolean) => {
    setIsLoading(true);
    try {
      // Simulate role detection based on email for demo purposes
      let role: "client" | "admin" | "affiliate" = "client";
      if (values.email.includes("admin")) role = "admin";
      else if (values.email.includes("partner")) role = "affiliate";

      await login(role);
      
      toast({
        title: isSignup ? "Account created!" : "Welcome back!",
        description: "Securely logging you in...",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center cursor-pointer" onClick={() => setLocation("/")}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="h-10 w-10 text-secondary" />
          <span className="font-serif font-bold text-3xl text-primary">RiseOra</span>
        </div>
        <p className="text-muted-foreground">Secure Client Portal</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
                  {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...form.register("password")} />
                  {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Start your journey to financial freedom today.</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data, true))}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="you@example.com" {...form.register("email")} />
                  {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" {...form.register("password")} />
                  {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
                </div>
                <div className="text-xs text-muted-foreground bg-secondary/10 p-3 rounded text-center">
                  <span className="font-semibold text-secondary-foreground">Security Notice:</span> All data is encrypted with 256-bit SSL encryption.
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
      
      <p className="mt-8 text-xs text-center text-muted-foreground max-w-sm">
        By continuing, you agree to our Terms of Service and Privacy Policy. Protected by reCAPTCHA.
      </p>
    </div>
  );
}
