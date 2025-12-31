import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronRight, Wand2, ArrowLeft, Loader2, FileCheck, Mail, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { mockDb } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

import wizardLogo from "@assets/ChatGPT_Image_Dec_30,_2025,_03_41_14_PM_1767131297375.png";

interface DisputeWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "safety-check" | "select-bureau" | "identify-item" | "reason" | "review" | "success";

export function DisputeWizard({ onComplete, onCancel }: DisputeWizardProps) {
  const [step, setStep] = useState<WizardStep>("safety-check");
  const [isLoading, setIsLoading] = useState(false);
  const [safetyAgreed, setSafetyAgreed] = useState(false);
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
    if (step === "safety-check") setStep("select-bureau");
    else if (step === "select-bureau" && formData.bureau) setStep("identify-item");
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
        description: `Your draft letter has been prepared for your review.`,
      });
    }
  };

  const handleBack = () => {
    if (step === "select-bureau") setStep("safety-check");
    else if (step === "identify-item") setStep("select-bureau");
    else if (step === "reason") setStep("identify-item");
    else if (step === "review") setStep("reason");
  };

  const progress = {
    "safety-check": 10,
    "select-bureau": 25,
    "identify-item": 50,
    "reason": 70,
    "preview": 85,
    "review": 100,
    "success": 100
  };

  const getComplianceNotice = () => (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 italic space-y-2">
      <p><strong>CROA Disclosure:</strong> You have a right to dispute inaccurate information in your credit report by contacting the credit bureau directly. You are not required to purchase credit repair services to do so.</p>
      <p><strong>FCRA Notice:</strong> This letter is a request for investigation under the Fair Credit Reporting Act, 15 U.S.C. § 1681i.</p>
    </div>
  );

  if (step === "success") {
    return (
      <Card className="border-secondary/20 shadow-lg bg-[#faf9f6]">
        <CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Your dispute letter is ready</h2>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-left w-full max-w-md">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              Next Steps Checklist:
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <span>Download the generated PDF from your documents.</span>
              </li>
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <span>Carefully review the letter for accuracy.</span>
              </li>
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <span>Print and mail the letter via Certified Mail to the bureau.</span>
              </li>
            </ul>
          </div>

          <div className="grid gap-4 w-full max-w-sm">
            <Button size="lg" className="w-full bg-secondary text-primary font-bold hover:bg-secondary/90 h-12 text-lg" onClick={onComplete}>
              Return to Dashboard
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg bg-white" onClick={() => setLocation("/dashboard/documents")}>
              View Generated Letter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-secondary/20 shadow-lg bg-[#faf9f6]">
      <CardHeader className="border-b border-border/50 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1">
              <img src={wizardLogo} alt="Wizard" className="h-8 w-auto" />
            </div>
            <CardTitle className="text-xl">Dispute Wizard™ (Beta)</CardTitle>
          </div>
          <span className="text-sm font-medium text-muted-foreground">Step {Object.keys(progress).indexOf(step) + 1} of 5</span>
        </div>
        <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out" 
            style={{ width: `${progress[step]}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-8 pb-8 min-h-[300px]">
        {step === "safety-check" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900">Important Safety & Compliance Notice</h3>
                <p className="text-sm text-amber-800">Please read and acknowledge the following platform terms before proceeding.</p>
              </div>
            </div>

            <div className="space-y-4 py-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-primary/80"><strong>Educational Use:</strong> This wizard is an educational tool designed to help you understand and draft credit challenges.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-primary/80"><strong>Self-Submission:</strong> RiseOra is a software provider only. We do not submit disputes to bureaus on your behalf. You must print and mail letters yourself.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-primary/80"><strong>Review & Accuracy:</strong> Letters generated are drafts for your personal review. You are responsible for the accuracy of all submitted information.</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className={`w-full h-14 text-lg font-bold transition-all ${safetyAgreed ? 'bg-primary shadow-lg' : 'bg-slate-200 text-slate-400'}`}
              disabled={!safetyAgreed}
              onClick={handleNext}
            >
              I Understand & Proceed
            </Button>
            
            <div className="flex items-center gap-2 justify-center">
              <input 
                type="checkbox" 
                id="safety-agree" 
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                checked={safetyAgreed}
                onChange={(e) => setSafetyAgreed(e.target.checked)}
              />
              <Label htmlFor="safety-agree" className="text-sm font-medium cursor-pointer">
                I acknowledge the statements above
              </Label>
            </div>
          </div>
        )}

        {step === "select-bureau" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">Select Reporting Bureau</h3>
              <p className="text-muted-foreground">Which bureau is reporting the item you wish to challenge?</p>
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
            {getComplianceNotice()}
          </div>
        )}

        {step === "identify-item" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
              <h3 className="text-lg font-bold text-primary mb-2">Identify the Item</h3>
              <p className="text-muted-foreground">Enter details as they appear on your educational credit report.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditor">Creditor Name</Label>
                <Input 
                  id="creditor" 
                  placeholder="e.g. Chase Bank, Midland Funding" 
                  value={formData.creditorName}
                  onChange={(e) => setFormData({...formData, creditorName: e.target.value})}
                  className="h-12 text-lg bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account Number (Optional)</Label>
                <Input 
                  id="account" 
                  placeholder="Partial number is okay (e.g. XXXX-1234)" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="h-12 text-lg bg-white"
                />
              </div>
            </div>
            {getComplianceNotice()}
          </div>
        )}

        {step === "reason" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
              <h3 className="text-lg font-bold text-primary mb-2">Educational Reason for Challenge</h3>
              <p className="text-muted-foreground">Why do you believe this item is inaccurate or unverifiable?</p>
            </div>

            <Select value={formData.disputeReason} onValueChange={(v) => setFormData({...formData, disputeReason: v})}>
              <SelectTrigger className="h-12 text-lg bg-white">
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not mine">Not my account / Identity Theft</SelectItem>
                <SelectItem value="Late payment incorrect">Never late / Late payment incorrect</SelectItem>
                <SelectItem value="Balance incorrect">Balance is incorrect</SelectItem>
                <SelectItem value="Account closed">Account is closed</SelectItem>
                <SelectItem value="Duplicate">Duplicate account</SelectItem>
                <SelectItem value="other">Other (Provide Detail)</SelectItem>
              </SelectContent>
            </Select>

            {formData.disputeReason === "other" && (
              <Textarea 
                placeholder="Describe the inaccuracy in your own words..."
                value={formData.customReason}
                onChange={(e) => setFormData({...formData, customReason: e.target.value})}
                className="h-32 text-base bg-white"
              />
            )}
            
            <div className="bg-secondary/10 p-4 rounded-lg flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5" />
              <p className="text-sm text-primary/80">
                <strong>Education Point:</strong> These reasons align with Metro 2 and FCRA standards for accurate credit reporting.
              </p>
            </div>
            {getComplianceNotice()}
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">Review Your Draft</h3>
              <p className="text-muted-foreground">Please confirm the educational details before generating your draft letter.</p>
            </div>

            <div className="bg-white rounded-xl p-6 space-y-4 border border-border shadow-sm">
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
            
            <div className="text-center text-sm text-muted-foreground bg-amber-50 p-3 rounded border border-amber-100 italic">
              By clicking "Generate Draft", you acknowledge this is a tool for your personal review and submission.
            </div>
            {getComplianceNotice()}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/50 pt-6">
        <Button 
          variant="ghost" 
          onClick={step === "safety-check" ? onCancel : handleBack}
          className="text-muted-foreground hover:text-primary"
        >
          {step === "safety-check" ? "Cancel" : (
            <span className="flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back</span>
          )}
        </Button>
        {step !== "safety-check" && (
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
        )}
      </CardFooter>
    </Card>
  );
}

