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
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    betaAccessCode: z.string().min(1, "Beta access code is required"),
    consent: z.boolean().refine(val => val === true, {
        message: "You must agree to the Terms of Service and Privacy Policy",
    }),
});

export default function AuthPage() {
    const [, setLocation] = useLocation();
    const { login, signup } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Parse URL params for default tab
    const params = new URLSearchParams(window.location.search);
    const defaultTab = params.get("tab") === "signup" ? "signup" : "login";

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "", betaAccessCode: "", consent: false },
    });

    const onLoginError = () => {
        const errors = loginForm.formState.errors;
        const errorMessages = Object.values(errors).map(e => e?.message).filter(Boolean);
        if (errorMessages.length > 0) {
            toast({
                variant: "destructive",
                title: "Please fix the following",
                description: errorMessages.join(". "),
            });
        }
    };

    const onSignupError = () => {
        const errors = signupForm.formState.errors;
        const errorMessages = Object.values(errors).map(e => e?.message).filter(Boolean);
        if (errorMessages.length > 0) {
            toast({
                variant: "destructive",
                title: "Please fix the following",
                description: errorMessages.join(". "),
            });
        }
    };

    const onLogin = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        try {
            await login(values.email, values.password);

            toast({
                title: "Welcome back!",
                description: "Securely logging you in...",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: error.message || "Invalid credentials. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSignup = async (values: z.infer<typeof signupSchema>) => {
        setIsLoading(true);
        try {
            await signup(values.email, values.password, values.firstName, values.lastName, values.betaAccessCode);

            toast({
                title: "Account created!",
                description: "Welcome to RiseOra. Let's get started!",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Signup failed",
                description: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center cursor-pointer" onClick={() => setLocation("/")}>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <img src={logoImage} alt="RiseOra" className="h-12 w-12 object-contain" />
                    <span className="font-serif font-bold text-3xl text-primary">RiseOra</span>
                </div>
                <p className="text-muted-foreground">Secure Client Portal</p>
            </div>

            <Card className="w-full max-w-md shadow-xl border-primary/10">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                        <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                        </CardHeader>
                        <form onSubmit={loginForm.handleSubmit(onLogin, onLoginError)}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        data-testid="input-email-login"
                                        {...loginForm.register("email")}
                                    />
                                    {loginForm.formState.errors.email && (
                                        <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        data-testid="input-password-login"
                                        {...loginForm.register("password")}
                                    />
                                    {loginForm.formState.errors.password && (
                                        <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90"
                                    disabled={isLoading}
                                    data-testid="button-login"
                                >
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
                        <form onSubmit={signupForm.handleSubmit(onSignup, onSignupError)}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            data-testid="input-firstname"
                                            {...signupForm.register("firstName")}
                                        />
                                        {signupForm.formState.errors.firstName && (
                                            <p className="text-xs text-destructive">{signupForm.formState.errors.firstName.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            data-testid="input-lastname"
                                            {...signupForm.register("lastName")}
                                        />
                                        {signupForm.formState.errors.lastName && (
                                            <p className="text-xs text-destructive">{signupForm.formState.errors.lastName.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        data-testid="input-email-signup"
                                        {...signupForm.register("email")}
                                    />
                                    {signupForm.formState.errors.email && (
                                        <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        data-testid="input-password-signup"
                                        {...signupForm.register("password")}
                                    />
                                    {signupForm.formState.errors.password && (
                                        <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="betaAccessCode">Beta Access Code</Label>
                                    <Input
                                        id="betaAccessCode"
                                        placeholder="Enter your invite code"
                                        {...signupForm.register("betaAccessCode")}
                                    />
                                    <p className="text-xs text-muted-foreground italic">Required for early access.</p>
                                    {signupForm.formState.errors.betaAccessCode && (
                                        <p className="text-xs text-destructive">{signupForm.formState.errors.betaAccessCode.message}</p>
                                    )}
                                </div>
                                <div className="flex items-start space-x-3 mt-4">
                                    <Checkbox
                                        id="consent"
                                        data-testid="checkbox-consent"
                                        checked={signupForm.watch("consent")}
                                        onCheckedChange={(checked) => signupForm.setValue("consent", checked === true)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="consent"
                                            className="text-sm text-muted-foreground cursor-pointer"
                                        >
                                            I agree to the{" "}
                                            <Link href="/legal" className="text-secondary hover:underline">Terms of Service</Link>,{" "}
                                            <Link href="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>, and{" "}
                                            <Link href="/ai-disclosure" className="text-secondary hover:underline">AI Usage Disclosure</Link>.
                                            I consent to the collection and processing of my data as described.
                                        </label>
                                        {signupForm.formState.errors.consent && (
                                            <p className="text-xs text-destructive">{signupForm.formState.errors.consent.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground bg-secondary/10 p-3 rounded text-center space-y-1">
                                    <div className="font-semibold text-secondary-foreground flex items-center justify-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Bank-level encryption
                                    </div>
                                    <div>We never sell your data.</div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90"
                                    disabled={isLoading}
                                    data-testid="button-signup"
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>

            <p className="mt-8 text-xs text-center text-muted-foreground max-w-sm">
                By continuing, you agree to our <Link href="/legal" className="text-secondary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>.
            </p>
        </div>
    );
}
