import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Upload, FileText, AlertCircle, CheckCircle2, Trash2,
  ChevronRight, Loader2, X, FileWarning, Eye, FolderOpen
} from "lucide-react";
import type { CreditReport, CreditReportAccount } from "@shared/schema";

interface ParsedResult {
  accounts: Array<{
    creditorName: string;
    accountNumber?: string;
    accountType?: string;
    balance?: string;
    status?: string;
    recommendedReasons: string[];
    confidence: "HIGH" | "MEDIUM" | "LOW";
  }>;
  summary: string;
  reportId: string;
}

const BUREAUS = [
  { value: "EXPERIAN", label: "Experian" },
  { value: "EQUIFAX", label: "Equifax" },
  { value: "TRANSUNION", label: "TransUnion" },
];

export default function CreditReportsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedBureau, setSelectedBureau] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { data: reports = [], isLoading } = useQuery<CreditReport[]>({
    queryKey: ["/api/credit-reports"],
  });

  const { data: reportDetail } = useQuery<{ report: CreditReport; accounts: CreditReportAccount[] }>({
    queryKey: ["/api/credit-reports", selectedReportId],
    enabled: !!selectedReportId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/credit-reports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete report");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credit-reports"] });
      toast({ title: "Report deleted", description: "Credit report has been removed." });
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleUpload(file);
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
    }
  }, [selectedBureau]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!selectedBureau) {
      toast({ title: "Select bureau", description: "Please select which credit bureau this report is from.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setParsedResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bureau", selectedBureau);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 50);
          setUploadProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setUploadProgress(100);
          const result = JSON.parse(xhr.responseText);
          setParsedResult(result);
          queryClient.invalidateQueries({ queryKey: ["/api/credit-reports"] });
          toast({ title: "Report analyzed", description: `Found ${result.accounts?.length || 0} accounts in your report.` });
        } else {
          const error = JSON.parse(xhr.responseText);
          toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        }
        setIsUploading(false);
      });

      xhr.addEventListener("error", () => {
        toast({ title: "Upload failed", description: "Network error occurred.", variant: "destructive" });
        setIsUploading(false);
      });

      xhr.open("POST", "/api/upload-credit-report");
      xhr.withCredentials = true;
      xhr.send(formData);

      setUploadProgress(50);
    } catch (error) {
      toast({ title: "Upload failed", description: "An error occurred while uploading.", variant: "destructive" });
      setIsUploading(false);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return <Badge className="bg-emerald-100 text-emerald-700">High Confidence</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-100 text-amber-700">Medium Confidence</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Low Confidence</Badge>;
    }
  };

  const handleViewReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/vault/signed-url/report/${reportId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to get signed URL');
      const { url } = await res.json();
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'Could not generate a secure access link.' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary" data-testid="page-title">
              RiseOra Secure Vault
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage your credit reports securely. All documents are stored with end-to-end encryption.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Vault Secure
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload Credit Report</CardTitle>
            <CardDescription>
              Select the credit bureau and upload your report PDF. We'll analyze it and extract account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedBureau} onValueChange={setSelectedBureau}>
                <SelectTrigger className="w-full sm:w-48 h-11" data-testid="select-bureau">
                  <SelectValue placeholder="Select Bureau" />
                </SelectTrigger>
                <SelectContent>
                  {BUREAUS.map(b => (
                    <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                } ${!selectedBureau ? "opacity-50 pointer-events-none" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              data-testid="upload-dropzone"
            >
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                  <div className="space-y-2">
                    <p className="font-medium">
                      {uploadProgress < 50 ? "Uploading to Vault..." : "Analyzing your report..."}
                    </p>
                    <Progress value={uploadProgress} className="max-w-xs mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      This may take a minute depending on the size of your report.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium mb-2">Drag & drop your credit report PDF here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    disabled={!selectedBureau}
                    data-testid="input-file"
                  />
                  <Button variant="outline" className="pointer-events-none">
                    Choose File
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-start gap-2 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-900">
                <p className="font-medium">Vault Protection Enabled</p>
                <p>Your data is processed in a secure environment. We do not store unencrypted copies of your sensitive information.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {parsedResult && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>{parsedResult.summary}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleViewReport(parsedResult.reportId)}>
                  <FileText className="h-4 w-4" /> View Original
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setParsedResult(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedResult.accounts.map((account, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200" data-testid={`result-account-${idx}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium">{account.creditorName}</p>
                        {account.accountNumber && (
                          <p className="text-sm text-muted-foreground">Account: {account.accountNumber}</p>
                        )}
                      </div>
                      {getConfidenceBadge(account.confidence)}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {account.accountType && <Badge variant="outline">{account.accountType}</Badge>}
                      {account.status && <Badge variant="outline">{account.status}</Badge>}
                      {account.balance && <Badge variant="outline">{account.balance}</Badge>}
                    </div>
                    {account.recommendedReasons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Suggested dispute reasons:</p>
                        <div className="flex flex-wrap gap-1">
                          {account.recommendedReasons.map((reason, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{reason}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button asChild>
                  <a href="/dashboard/disputes">
                    Create Disputes from Accounts
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Vault Storage</CardTitle>
            <CardDescription>Securely stored credit reports and extracted metadata.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No documents in your vault yet.</p>
                <p className="text-sm">Upload your first report above to secure it.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border" data-testid={`report-${report.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{report.fileName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="bg-white">{report.bureau}</Badge>
                          <span>{report.totalAccounts} accounts</span>
                          {report.negativeAccounts ? (
                            <span className="text-red-600 font-medium">{report.negativeAccounts} negative</span>
                          ) : null}
                          <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleViewReport(report.id)} data-testid={`button-view-${report.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View Securely</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedReportId(report.id)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(report.id)} data-testid={`button-delete-${report.id}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedReportId} onOpenChange={(open) => !open && setSelectedReportId(null)}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Credit Report Details</DialogTitle>
            <DialogDescription>
              {reportDetail?.report.fileName} - {reportDetail?.report.bureau}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {reportDetail?.accounts.map((account) => (
              <div key={account.id} className="p-4 bg-slate-50 rounded-lg border" data-testid={`detail-account-${account.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{account.creditorName}</p>
                    {account.accountNumber && (
                      <p className="text-sm text-muted-foreground">Account: {account.accountNumber}</p>
                    )}
                  </div>
                  {account.isNegative && (
                    <Badge className="bg-red-100 text-red-700">Negative</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {account.accountType && <Badge variant="outline">{account.accountType}</Badge>}
                  {account.accountStatus && <Badge variant="outline">{account.accountStatus}</Badge>}
                  {account.balance && <Badge variant="outline">${(account.balance / 100).toLocaleString()}</Badge>}
                </div>
                {account.disputeId ? (
                  <div className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Dispute created
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <a href={`/dashboard/disputes?creditor=${encodeURIComponent(account.creditorName)}`}>
                      Create Dispute
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
