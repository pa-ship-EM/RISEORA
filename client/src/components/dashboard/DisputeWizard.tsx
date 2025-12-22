import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronRight, Wand2, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { mockDb } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface DisputeWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "select-bureau" | "identify-item" | "reason" | "review" | "success";

export function DisputeWizard({ onComplete, onCancel }: DisputeWizardProps) {
  const [step, setStep] = useState<WizardStep>("select-bureau");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    bureau: "",
    creditorName: "",
    accountNumber: "",
    disputeReason: "",
    customReason: "",
    metro2Check: false
  });

  const handleNext = async () => {
    if (step === "select-bureau" && formData.bureau) setStep("identify-item");
    else if (step === "identify-item" && formData.creditorName) setStep("reason");
    else if (step === "reason" && formData.disputeReason) setStep("review");
    else if (step === "review") {
      setIsLoading(true);
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to mock DB
      if (user) {
        mockDb.createDispute({
          userId: user.id,
          creditorName: formData.creditorName,
          accountNumber: formData.accountNumber,
          bureau: formData.bureau as any,
          status: "GENERATED",
          disputeReason: formData.disputeReason === "other" ? formData.customReason : formData.disputeReason,
          metro2Compliant: true // Premium feature enabled by wizard
        });
      }
      
      setIsLoading(false);
      setStep("success");
      toast({
        title: "Dispute Generated!",
        description: "Your dispute letter has been created successfully.",
      });
    }
  };

  const handleBack = () => {
    if (step === "identify-item") setStep("select-bureau");
    else if (step === "reason") setStep("identify-item");
    else if (step === "review") setStep("reason");
  };

  const progress = {
    "select-bureau": 25,
    "identify-item": 50,
    "reason": 75,
    "review": 100,
    "success": 100
  };

  if (step === "success") {
    return (
      <Card className="border-secondary/20 shadow-lg bg-background">
        <CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Dispute Generated Successfully!</h2>
          <p className="text-muted-foreground max-w-md mb-8 text-lg">
            Our Dispute Wizard™ has analyzed your inputs and generated a Metro 2 compliant challenge letter for {formData.creditorName}.
          </p>
          
          <div className="grid gap-4 w-full max-w-sm">
            <Button size="lg" className="w-full bg-secondary text-primary font-bold hover:bg-secondary/90 h-12 text-lg" onClick={onComplete}>
              Return to Dashboard
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg" onClick={() => setLocation("/dashboard/documents")}>
              View Generated Letter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-secondary/20 shadow-lg bg-background">
      <CardHeader className="border-b border-border/50 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Wand2 className="h-5 w-5 text-secondary" />
            </div>
            <CardTitle className="text-xl">Dispute Wizard™</CardTitle>
          </div>
          <span className="text-sm font-medium text-muted-foreground">Step {Object.keys(progress).indexOf(step) + 1} of 4</span>
        </div>
        <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out" 
            style={{ width: `${progress[step]}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-8 pb-8 min-h-[300px]">
        {step === "select-bureau" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">Select Credit Bureau</h3>
              <p className="text-muted-foreground">Which bureau is reporting this inaccurate item?</p>
            </div>
            
            <RadioGroup value={formData.bureau} onValueChange={(v) => setFormData({...formData, bureau: v})}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['EXPERIAN', 'TRANSUNION', 'EQUIFAX'].map((bureau) => (
                  <Label
                    key={bureau}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer hover:bg-muted/50 transition-all ${
                      formData.bureau === bureau ? 'border-secondary bg-secondary/5' : 'border-border'
                    }`}
                  >
                    <RadioGroupItem value={bureau} className="sr-only" />
                    <span className="font-bold text-lg capitalize">{bureau.toLowerCase()}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === "identify-item" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
              <h3 className="text-lg font-bold text-primary mb-2">Identify the Negative Item</h3>
              <p className="text-muted-foreground">Enter the details exactly as they appear on your report.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditor">Creditor Name</Label>
                <Input 
                  id="creditor" 
                  placeholder="e.g. Chase Bank, Midland Funding" 
                  value={formData.creditorName}
                  onChange={(e) => setFormData({...formData, creditorName: e.target.value})}
                  className="h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account Number (Optional)</Label>
                <Input 
                  id="account" 
                  placeholder="Partial number is okay (e.g. XXXX-1234)" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="h-12 text-lg"
                />
              </div>
            </div>
          </div>
        )}

        {step === "reason" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
              <h3 className="text-lg font-bold text-primary mb-2">Select Dispute Reason</h3>
              <p className="text-muted-foreground">Why is this item inaccurate? This determines the legal language used.</p>
            </div>

            <Select value={formData.disputeReason} onValueChange={(v) => setFormData({...formData, disputeReason: v})}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not mine">Not my account / Identity Theft</SelectItem>
                <SelectItem value="Late payment incorrect">Never late / Late payment incorrect</SelectItem>
                <SelectItem value="Balance incorrect">Balance is incorrect</SelectItem>
                <SelectItem value="Account closed">Account is closed</SelectItem>
                <SelectItem value="Duplicate">Duplicate account</SelectItem>
                <SelectItem value="other">Other (Custom Reason)</SelectItem>
              </SelectContent>
            </Select>

            {formData.disputeReason === "other" && (
              <Textarea 
                placeholder="Describe the error in detail..."
                value={formData.customReason}
                onChange={(e) => setFormData({...formData, customReason: e.target.value})}
                className="h-32 text-base"
              />
            )}
            
            <div className="bg-secondary/10 p-4 rounded-lg flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5" />
              <p className="text-sm text-primary/80">
                <strong>Metro 2 Compliance Check:</strong> The Wizard will automatically cross-reference this reason against Metro 2 reporting standards for maximum effectiveness.
              </p>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">Review & Generate</h3>
              <p className="text-muted-foreground">Please confirm the details below before generating your letter.</p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 space-y-4 border border-border">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Bureau</span>
                <span className="font-semibold">{formData.bureau}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Creditor</span>
                <span className="font-semibold">{formData.creditorName}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Account #</span>
                <span className="font-semibold">{formData.accountNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reason</span>
                <span className="font-semibold">{formData.disputeReason}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/50 pt-6">
        <Button 
          variant="ghost" 
          onClick={step === "select-bureau" ? onCancel : handleBack}
          className="text-muted-foreground hover:text-primary"
        >
          {step === "select-bureau" ? "Cancel" : (
            <span className="flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back</span>
          )}
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={
            (step === "select-bureau" && !formData.bureau) ||
            (step === "identify-item" && !formData.creditorName) ||
            (step === "reason" && !formData.disputeReason) ||
            isLoading
          }
          className="bg-primary hover:bg-primary/90 min-w-[120px]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            step === "review" ? "Generate Letter" : <span className="flex items-center gap-1">Next <ChevronRight className="h-4 w-4" /></span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
