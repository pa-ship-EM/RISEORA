import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronRight, Wand2, ArrowLeft, Loader2, FileCheck, Mail, AlertTriangle, ShieldCheck, Upload, FileText, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDisputes } from "@/hooks/use-disputes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

import wizardLogo from "@assets/ChatGPT_Image_Dec_30,_2025,_03_41_14_PM_1767131297375.png";

interface DisputeWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "safety-check" | "personal-info" | "select-bureau" | "upload-report" | "identify-item" | "reason" | "review" | "success";

interface ParsedAccount {
  creditorName: string;
  accountNumber: string | null;
  accountType: string;
  balance: string | null;
  status: string;
  recommendedReasons: string[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export function DisputeWizard({ onComplete, onCancel }: DisputeWizardProps) {
  const [step, setStep] = useState<WizardStep>("safety-check");
  const [isLoading, setIsLoading] = useState(false);
  const [safetyAgreed, setSafetyAgreed] = useState(false);
  const { user, refreshUser } = useAuth();
  const { createDispute } = useDisputes();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    ssnLast4: "",
    bureau: "",
    creditorName: "",
    accountNumber: "",
    disputeReason: "",
    customReason: "",
    metro2Check: false
  });
  
  const [reportText, setReportText] = useState("");
  const [parsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<"pdf" | "paste">("pdf");

  const handleNext = async () => {
    if (step === "safety-check") setStep("personal-info");
    else if (step === "personal-info" && formData.address && formData.city && formData.state && formData.zip && formData.dob && formData.ssnLast4) {
      // Save personal info to user profile
      setIsLoading(true);
      try {
        await apiRequest("PATCH", "/api/user/profile", {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          dob: formData.dob,
          ssnLast4: formData.ssnLast4,
        });
        await refreshUser();
        setIsLoading(false);
        setStep("select-bureau");
      } catch (error: any) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save personal information",
        });
      }
    }
    else if (step === "select-bureau" && formData.bureau) setStep("upload-report");
    else if (step === "upload-report") {
      if (useManualEntry) {
        setStep("identify-item");
      } else if (selectedFile) {
        // Handle PDF file upload
        setIsParsing(true);
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('file', selectedFile);
          formDataUpload.append('bureau', formData.bureau);
          
          const response = await fetch('/api/upload-credit-report', {
            method: 'POST',
            body: formDataUpload,
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload file');
          }
          
          const data = await response.json();
          setParsedAccounts(data.accounts || []);
          setIsParsing(false);
          setStep("identify-item");
        } catch (error: any) {
          setIsParsing(false);
          toast({
            variant: "destructive",
            title: "Error parsing PDF",
            description: error.message || "Failed to analyze credit report. You can enter details manually.",
          });
        }
      } else if (reportText.trim()) {
        // Handle text paste
        setIsParsing(true);
        try {
          const response = await apiRequest("POST", "/api/parse-credit-report", {
            reportText: reportText.trim(),
            bureau: formData.bureau,
          });
          const data = await response.json();
          setParsedAccounts(data.accounts || []);
          setIsParsing(false);
          setStep("identify-item");
        } catch (error: any) {
          setIsParsing(false);
          toast({
            variant: "destructive",
            title: "Error parsing report",
            description: error.message || "Failed to analyze credit report. You can enter details manually.",
          });
        }
      } else {
        setStep("identify-item");
      }
    }
    else if (step === "identify-item" && formData.creditorName) setStep("reason");
    else if (step === "reason" && formData.disputeReason) setStep("review");
    else if (step === "review") {
      setIsLoading(true);
      try {
        const letterContent = generateLetter();
        
        await createDispute({
          creditorName: formData.creditorName,
          accountNumber: formData.accountNumber || undefined,
          bureau: formData.bureau as "EXPERIAN" | "TRANSUNION" | "EQUIFAX",
          status: "GENERATED",
          disputeReason: formData.disputeReason,
          customReason: formData.disputeReason === "other" ? formData.customReason : undefined,
          metro2Compliant: true,
          letterContent,
        });
        
        setIsLoading(false);
        setStep("success");
        toast({
          title: "Dispute Generated!",
          description: `Your draft letter has been prepared for your review.`,
        });
      } catch (error: any) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to create dispute",
        });
      }
    }
  };

  const handleBack = () => {
    if (step === "personal-info") setStep("safety-check");
    else if (step === "select-bureau") setStep("personal-info");
    else if (step === "upload-report") setStep("select-bureau");
    else if (step === "identify-item") setStep("upload-report");
    else if (step === "reason") setStep("identify-item");
    else if (step === "review") setStep("reason");
  };
  
  const selectParsedAccount = (index: number) => {
    const account = parsedAccounts[index];
    setSelectedAccountIndex(index);
    setFormData(prev => ({
      ...prev,
      creditorName: account.creditorName,
      accountNumber: account.accountNumber || "",
    }));
  };

  const progress = {
    "safety-check": 5,
    "personal-info": 15,
    "select-bureau": 30,
    "upload-report": 45,
    "identify-item": 60,
    "reason": 80,
    "review": 95,
    "success": 100
  };

  const getComplianceNotice = () => (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 italic space-y-2">
      <p><strong>CROA Disclosure:</strong> You have a right to dispute inaccurate information in your credit report by contacting the credit bureau directly. You are not required to purchase credit repair services to do so.</p>
      <p><strong>FCRA Notice:</strong> This letter is a request for investigation under the Fair Credit Reporting Act, 15 U.S.C. § 1681i.</p>
    </div>
  );

  const generateLetter = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const reasonText = formData.disputeReason === "other" ? formData.customReason : formData.disputeReason;
    
    return `${formData.firstName} ${formData.lastName}
${formData.address}
${formData.city}, ${formData.state} ${formData.zip}
DOB: ${formData.dob}
SSN: ***-**-${formData.ssnLast4}

${today}

${formData.bureau}
Dispute Department

RE: Dispute of Inaccurate Information - Account # ${formData.accountNumber || "Unknown"}

To Whom It May Concern:

I am writing to dispute the following information in my file, which I have identified as inaccurate and/or unverifiable. I have circled the items on the attached copy of the report I received.

Dispute Item:
Creditor Name: ${formData.creditorName}
Account Number: ${formData.accountNumber || "Not Provided"}

Reason for Dispute:
${reasonText}

Under the Fair Credit Reporting Act (FCRA), specifically 15 U.S.C. § 1681i, you are required to conduct a reasonable investigation into this matter within 30 days. If you cannot verify this item with the furnisher using the Metro 2 standard for accuracy and completeness, it must be deleted from my file.

Please provide me with a description of the procedures used to determine the accuracy and completeness of the information, including the name, business address, and telephone number of any furnisher of information contacted in connection with such information as required by 15 U.S.C. § 1681i(a)(6)(B)(iii).

I request that you update my file to reflect accurate information or delete the unverified item entirely. Please send me an updated copy of my credit report upon completion of your investigation.

Sincerely,

${formData.firstName} ${formData.lastName}`;
  };

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
                <span>Download or copy the generated letter below.</span>
              </li>
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <span>Attach a copy of your ID and proof of address.</span>
              </li>
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <span>Mail via Certified Mail to the bureau.</span>
              </li>
            </ul>
          </div>

          <div className="w-full max-w-2xl mb-8">
            <Label className="block text-left mb-2 font-bold text-primary">Preview Generated Letter</Label>
            <Textarea 
              readOnly 
              value={generateLetter()} 
              className="h-[300px] font-mono text-sm bg-white border-slate-200 p-4"
            />
          </div>

          <div className="grid gap-4 w-full max-w-sm">
            <Button size="lg" className="w-full bg-secondary text-slate-900 font-bold hover:bg-secondary/90 h-12 text-lg" onClick={onComplete}>
              Return to Dashboard
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg bg-white" onClick={() => {
              navigator.clipboard.writeText(generateLetter());
              toast({ title: "Copied to clipboard" });
            }}>
              Copy to Clipboard
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

        {step === "personal-info" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">Confirm Personal Information</h3>
                <p className="text-muted-foreground">Required for the bureau to verify your identity.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 font-medium">
                <ShieldCheck className="h-3 w-3" />
                AES-256 Encrypted
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input 
                id="address" 
                placeholder="123 Main St, Apt 4B"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="bg-white"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  maxLength={2}
                  placeholder="NC"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                  className="bg-white"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input 
                  id="zip" 
                  maxLength={5}
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssn">Last 4 SSN</Label>
                <Input 
                  id="ssn" 
                  maxLength={4}
                  placeholder="1234"
                  type="password"
                  value={formData.ssnLast4}
                  onChange={(e) => setFormData({...formData, ssnLast4: e.target.value})}
                  className="bg-white"
                />
              </div>
            </div>
            {getComplianceNotice()}
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

        {step === "upload-report" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">Upload Your Credit Report</h3>
                <p className="text-muted-foreground">Upload your PDF or paste report text for AI analysis.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100 font-medium">
                <Sparkles className="h-3 w-3" />
                AI-Powered
              </div>
            </div>

            {!useManualEntry ? (
              <>
                {/* Upload mode toggle */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      uploadMode === "pdf" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => {
                      setUploadMode("pdf");
                      setReportText(""); // Clear text when switching to PDF mode
                    }}
                    data-testid="button-upload-pdf-mode"
                  >
                    <Upload className="h-4 w-4 inline-block mr-2" />
                    Upload PDF
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      uploadMode === "paste" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => {
                      setUploadMode("paste");
                      setSelectedFile(null); // Clear file when switching to paste mode
                    }}
                    data-testid="button-paste-text-mode"
                  >
                    <FileText className="h-4 w-4 inline-block mr-2" />
                    Paste Text
                  </button>
                </div>

                {uploadMode === "pdf" ? (
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 bg-slate-50/50 transition-colors cursor-pointer ${
                      selectedFile ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 hover:border-secondary/50"
                    }`}
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type === 'application/pdf') {
                        setSelectedFile(file);
                      } else {
                        toast({
                          variant: "destructive",
                          title: "Invalid file",
                          description: "Please upload a PDF file.",
                        });
                      }
                    }}
                  >
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                        }
                      }}
                      data-testid="input-pdf-upload"
                    />
                    <div className="text-center">
                      {selectedFile ? (
                        <>
                          <div className="w-14 h-14 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <FileCheck className="h-7 w-7 text-emerald-600" />
                          </div>
                          <p className="font-semibold text-primary mb-1">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                          >
                            Remove file
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                            <Upload className="h-7 w-7 text-secondary" />
                          </div>
                          <p className="font-semibold text-primary mb-1">Drop your PDF here or click to browse</p>
                          <p className="text-sm text-muted-foreground">
                            Upload your {formData.bureau.toLowerCase()} credit report (max 10MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:border-secondary/50 transition-colors">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                        <FileText className="h-6 w-6 text-secondary" />
                      </div>
                      <p className="font-semibold text-primary">Paste Credit Report Text</p>
                      <p className="text-sm text-muted-foreground">Copy and paste the text from your {formData.bureau.toLowerCase()} PDF</p>
                    </div>
                    <Textarea
                      placeholder="Paste the text content from your credit report PDF here...

Example:
CHASE BANK USA NA
Account Number: XXXX-XXXX-XXXX-1234
Account Type: Credit Card
Balance: $2,450
Status: Open
Payment History: 30 days late (Mar 2024)"
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      className="min-h-[200px] bg-white text-sm"
                      data-testid="textarea-report"
                    />
                  </div>
                )}

                {(selectedFile || reportText.trim()) && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm text-emerald-700">
                      {selectedFile ? "PDF ready for upload!" : "Report text detected!"} Click Next to analyze with AI.
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setUseManualEntry(true)}
                    data-testid="button-manual-entry"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Skip - I'll enter details manually
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <FileText className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-primary mb-2">Manual Entry Mode</p>
                <p className="text-sm text-muted-foreground mb-4">You'll enter the account details on the next screen.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUseManualEntry(false)}
                >
                  Switch to AI Analysis
                </Button>
              </div>
            )}

            {getComplianceNotice()}
          </div>
        )}

        {step === "identify-item" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  {parsedAccounts.length > 0 ? "Select an Account to Dispute" : "Identify the Item"}
                </h3>
                <p className="text-muted-foreground">
                  {parsedAccounts.length > 0 
                    ? "Our AI found these accounts in your report. Select one or enter manually below."
                    : "Enter details as they appear on your educational credit report."}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 font-medium">
                <ShieldCheck className="h-3 w-3" />
                AES-256 Encrypted
              </div>
            </div>

            {parsedAccounts.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">AI-Detected Accounts</Label>
                <div className="grid gap-3 max-h-[250px] overflow-y-auto pr-1">
                  {parsedAccounts.map((account, index) => (
                    <div
                      key={index}
                      onClick={() => selectParsedAccount(index)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedAccountIndex === index 
                          ? 'border-secondary bg-secondary/5' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      data-testid={`card-account-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-primary">{account.creditorName}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.accountType} {account.accountNumber ? `• #${account.accountNumber}` : ''}
                          </p>
                          {account.balance && (
                            <p className="text-sm text-muted-foreground">Balance: {account.balance}</p>
                          )}
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          account.confidence === 'HIGH' ? 'bg-emerald-100 text-emerald-700' :
                          account.confidence === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {account.confidence}
                        </div>
                      </div>
                      {account.recommendedReasons.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {account.recommendedReasons.slice(0, 2).map((reason, i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] rounded-full">
                              {reason}
                            </span>
                          ))}
                          {account.recommendedReasons.length > 2 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full">
                              +{account.recommendedReasons.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Or enter manually:</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditor">Creditor Name</Label>
                <Input 
                  id="creditor" 
                  placeholder="e.g. Chase Bank, Midland Funding" 
                  value={formData.creditorName}
                  onChange={(e) => {
                    setFormData({...formData, creditorName: e.target.value});
                    setSelectedAccountIndex(null);
                  }}
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

            {selectedAccountIndex !== null && parsedAccounts[selectedAccountIndex]?.recommendedReasons?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <Label className="text-sm font-medium text-purple-700">AI-Recommended Reasons</Label>
                </div>
                <div className="grid gap-2">
                  {parsedAccounts[selectedAccountIndex].recommendedReasons.map((reason, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className={`justify-start h-auto py-3 px-4 text-left ${
                        formData.disputeReason === reason 
                          ? 'border-secondary bg-secondary/10 text-primary' 
                          : 'hover:border-secondary/50'
                      }`}
                      onClick={() => setFormData({...formData, disputeReason: reason})}
                      data-testid={`button-reason-${i}`}
                    >
                      <CheckCircle2 className={`h-4 w-4 mr-2 shrink-0 ${formData.disputeReason === reason ? 'text-secondary' : 'text-muted-foreground'}`} />
                      {reason}
                    </Button>
                  ))}
                </div>
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Or choose from standard reasons:</p>
                </div>
              </div>
            )}

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
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
              </div>
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
              (step === "personal-info" && (!formData.address || !formData.zip || !formData.ssnLast4)) ||
              (step === "select-bureau" && !formData.bureau) ||
              (step === "upload-report" && isParsing) ||
              (step === "identify-item" && !formData.creditorName) ||
              (step === "reason" && !formData.disputeReason) ||
              isLoading ||
              isParsing
            }
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
          >
            {isLoading || isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              step === "review" ? "Generate Letter" : 
              step === "upload-report" && reportText.trim() ? <span className="flex items-center gap-1"><Sparkles className="h-4 w-4 mr-1" /> Analyze with AI</span> :
              <span className="flex items-center gap-1">Next <ChevronRight className="h-4 w-4" /></span>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

