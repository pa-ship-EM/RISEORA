import { useState, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDisputes } from "@/hooks/use-disputes";
import { useDisputeChecklist, useDisputeProgress, getDisputeStage, getStageLabel } from "@/hooks/use-dispute-progress";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { useLocation } from "wouter";
import { 
  FileText, Plus, Clock, CheckCircle, AlertCircle, Loader2, 
  ChevronDown, ChevronRight, Mail, Package, CalendarDays,
  Shield, FileCheck, Truck, Bell, ExternalLink, Sparkles, Scale, ListChecks, Copy, XCircle,
  Upload, Paperclip, Trash2, Image, File, AlertTriangle, ArrowRight, RefreshCw
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DisputeEvidence, DocumentType } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format, addDays, differenceInDays } from "date-fns";
import type { Dispute } from "@/lib/schema";

const BEST_PRACTICES = [
  {
    icon: Mail,
    title: "Send via Certified Mail",
    description: "Always use USPS Certified Mail with Return Receipt Requested. This provides proof of delivery that bureaus cannot dispute.",
    link: "https://www.usps.com/ship/insurance-extra-services.htm"
  },
  {
    icon: FileCheck,
    title: "Include Copy of ID",
    description: "Include a photocopy of your driver's license or state-issued ID. This verifies your identity to the credit bureau.",
  },
  {
    icon: Shield,
    title: "Include Proof of Address",
    description: "Attach a recent utility bill, bank statement, or lease agreement showing your current address.",
  },
  {
    icon: FileText,
    title: "Include SSN Verification",
    description: "Include a copy of your Social Security card with the first 5 digits blacked out for security.",
  },
  {
    icon: CalendarDays,
    title: "Track the 30-Day Deadline",
    description: "Under FCRA, credit bureaus must investigate and respond within 30 days of receiving your dispute letter.",
  },
  {
    icon: Package,
    title: "Keep All Records",
    description: "Save copies of everything you send, including the letter, documents, certified mail receipt, and tracking information.",
  }
];

function DeadlineCountdown({ dispute }: { dispute: Dispute }) {
  if (!dispute.responseDeadline) return null;
  
  const deadline = new Date(dispute.responseDeadline);
  const today = new Date();
  const daysRemaining = differenceInDays(deadline, today);
  
  // Determine urgency level and styling
  const getUrgencyStyles = () => {
    if (daysRemaining < 0) {
      return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "OVERDUE" };
    } else if (daysRemaining <= 3) {
      return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", label: "URGENT" };
    } else if (daysRemaining <= 7) {
      return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", label: "Soon" };
    } else if (daysRemaining <= 15) {
      return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", label: "Upcoming" };
    } else {
      return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "On Track" };
    }
  };
  
  const urgency = getUrgencyStyles();
  const deadlineDays = dispute.disputeType === "identity_theft" ? 45 : 30;
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${urgency.bg} ${urgency.border}`} data-testid={`countdown-${dispute.id}`}>
      <div className="flex items-center gap-3">
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-white border ${urgency.border}`}>
          <span className={`text-2xl font-bold ${urgency.text}`}>
            {Math.abs(daysRemaining)}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">
            {daysRemaining < 0 ? "days ago" : "days"}
          </span>
        </div>
        <div>
          <div className={`font-semibold ${urgency.text} flex items-center gap-1`}>
            <Clock className="h-4 w-4" />
            {daysRemaining < 0 ? "Response Overdue" : `${deadlineDays}-Day Response Deadline`}
          </div>
          <div className="text-sm text-muted-foreground">
            {daysRemaining < 0 
              ? `Was due ${format(deadline, 'MMM d, yyyy')}`
              : `Due by ${format(deadline, 'MMMM d, yyyy')}`
            }
          </div>
        </div>
      </div>
      <Badge className={`${urgency.bg} ${urgency.text} border ${urgency.border}`}>
        {urgency.label}
      </Badge>
    </div>
  );
}

function DisputeProgressBar({ dispute }: { dispute: Dispute }) {
  const stage = getDisputeStage(dispute);
  const stages = [
    { label: "Draft", completed: stage >= 0 },
    { label: "Ready", completed: stage >= 1 },
    { label: "Mailed", completed: stage >= 2 },
    { label: "Delivered", completed: stage >= 3 },
    { label: "Investigation", completed: stage >= 4 },
    { label: "Response", completed: stage >= 5 },
    { label: "Decision", completed: stage >= 6 },
    { label: "Escalation", completed: stage >= 7 },
  ];
  const progressPercent = Math.round((stage / (stages.length - 1)) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{getStageLabel(stage)}</span>
        <span>{progressPercent}% Complete</span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="flex justify-between mt-1">
        {stages.map((s, i) => (
          <div key={i} className="flex flex-col items-center" style={{ width: `${100/stages.length}%` }}>
            <div className={`w-2 h-2 rounded-full ${s.completed ? 'bg-primary' : 'bg-muted'}`} />
            <span className="text-[10px] text-muted-foreground mt-1 text-center hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DisputeChecklist({ disputeId }: { disputeId: string }) {
  const { checklist, isLoading, toggleItem, progressPercent, completedCount, totalCount } = useDisputeChecklist(disputeId);
  
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading checklist...</div>;
  }
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Submission Checklist</span>
        <span className="text-sm text-muted-foreground">{completedCount}/{totalCount} completed</span>
      </div>
      <Progress value={progressPercent} className="h-1.5" />
      <div className="space-y-2">
        {checklist.map((item) => (
          <div 
            key={item.id} 
            className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
            data-testid={`checklist-item-${item.id}`}
          >
            <Checkbox
              id={item.id}
              checked={item.completed}
              onCheckedChange={(checked) => toggleItem({ id: item.id, completed: !!checked })}
              data-testid={`checkbox-checklist-${item.id}`}
            />
            <div className="flex-1">
              <label 
                htmlFor={item.id} 
                className={`text-sm font-medium cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {item.label}
              </label>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DOCUMENT_TYPES: { value: DocumentType; label: string; description: string }[] = [
  { value: 'ID', label: 'Government ID', description: 'Driver\'s license, state ID, or passport' },
  { value: 'PROOF_OF_ADDRESS', label: 'Proof of Address', description: 'Utility bill, bank statement, or lease' },
  { value: 'SSN_CARD', label: 'SSN Card', description: 'Copy with first 5 digits redacted' },
  { value: 'UTILITY_BILL', label: 'Utility Bill', description: 'Recent utility bill showing your address' },
  { value: 'FTC_REPORT', label: 'FTC Identity Theft Report', description: 'Report from identitytheft.gov' },
  { value: 'CREDIT_REPORT', label: 'Credit Report', description: 'Annual credit report or bureau report' },
  { value: 'OTHER', label: 'Other Document', description: 'Any other supporting evidence' },
];

const REQUIRED_DOCUMENTS: { type: DocumentType; label: string; required: boolean }[] = [
  { type: 'ID', label: 'Government ID', required: true },
  { type: 'PROOF_OF_ADDRESS', label: 'Proof of Address', required: true },
  { type: 'SSN_CARD', label: 'SSN Card (last 4 visible)', required: false },
];

function EvidenceManager({ disputeId }: { disputeId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('OTHER');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: evidence = [], isLoading } = useQuery<DisputeEvidence[]>({
    queryKey: ['/api/disputes', disputeId, 'evidence'],
    queryFn: async () => {
      const res = await fetch(`/api/disputes/${disputeId}/evidence`, { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const uploadedTypes = new Set(evidence.map(e => e.documentType));
  const missingRequired = REQUIRED_DOCUMENTS.filter(d => d.required && !uploadedTypes.has(d.type));
  const completionPercent = Math.round(((REQUIRED_DOCUMENTS.filter(d => d.required).length - missingRequired.length) / REQUIRED_DOCUMENTS.filter(d => d.required).length) * 100);

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File Too Large', description: 'Maximum file size is 10MB' });
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Only JPEG, PNG, GIF, and PDF are allowed' });
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    setUploadOpen(true);
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', selectedType);
      if (description) formData.append('description', description);
      
      const xhr = new XMLHttpRequest();
      
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || 'Upload failed'));
            } catch {
              reject(new Error('Upload failed'));
            }
          }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Network error')));
        
        xhr.open('POST', `/api/disputes/${disputeId}/evidence`);
        xhr.withCredentials = true;
        xhr.send(formData);
      });
      
      toast({ title: 'Document Uploaded', description: 'Your evidence has been attached to this dispute.' });
      queryClient.invalidateQueries({ queryKey: ['/api/disputes', disputeId, 'evidence'] });
      setUploadOpen(false);
      setSelectedFile(null);
      setDescription('');
      setSelectedType('OTHER');
      setPreviewUrl(null);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/evidence/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast({ title: 'Document Deleted' });
      queryClient.invalidateQueries({ queryKey: ['/api/disputes', disputeId, 'evidence'] });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Delete Failed' });
    },
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Evidence & Documents</span>
          {evidence.length > 0 && (
            <Badge variant="secondary" className="text-xs">{evidence.length}</Badge>
          )}
        </div>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="dropzone-evidence"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
            e.target.value = '';
          }}
          data-testid="input-evidence-file-hidden"
        />
        <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-sm font-medium">
          {isDragOver ? 'Drop file here' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPEG, PNG, GIF, or PDF up to 10MB
        </p>
      </div>

      {missingRequired.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Required Documents</span>
            </div>
            <span className="text-xs text-amber-600">{completionPercent}% complete</span>
          </div>
          <Progress value={completionPercent} className="h-1.5" />
          <div className="flex flex-wrap gap-2 mt-2">
            {REQUIRED_DOCUMENTS.filter(d => d.required).map((doc) => {
              const hasDoc = uploadedTypes.has(doc.type);
              return (
                <Badge 
                  key={doc.type}
                  variant={hasDoc ? "default" : "outline"}
                  className={`text-xs ${hasDoc ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'text-amber-700 border-amber-300'}`}
                  data-testid={`badge-doc-${doc.type}`}
                >
                  {hasDoc ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {doc.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading documents...</div>
      ) : evidence.length === 0 ? (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          No documents attached yet. Upload ID, proof of address, and other evidence.
        </div>
      ) : (
        <div className="grid gap-2">
          {evidence.map((doc) => (
            <div 
              key={doc.id} 
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
              data-testid={`evidence-${doc.id}`}
            >
              <div className="flex items-center gap-3">
                {doc.mimeType.startsWith('image/') ? (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                    <img 
                      src={`/api/evidence/${doc.id}/thumbnail`} 
                      alt={doc.fileName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium truncate max-w-[180px]">{doc.fileName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {DOCUMENT_TYPES.find(t => t.value === doc.documentType)?.label || doc.documentType}
                    </Badge>
                    <span>{formatFileSize(doc.fileSize)}</span>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => deleteMutation.mutate(doc.id)}
                disabled={deleteMutation.isPending}
                data-testid={`button-delete-evidence-${doc.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={(open) => {
        setUploadOpen(open);
        if (!open) {
          setSelectedFile(null);
          setPreviewUrl(null);
          setDescription('');
          setSelectedType('OTHER');
        }
      }}>
        <DialogContent className="w-[95vw] max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg">Upload Evidence Document</DialogTitle>
            <DialogDescription className="text-sm">
              Attach supporting documents to strengthen your dispute.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewUrl && (
              <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
            
            {selectedFile && !previewUrl && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as DocumentType)}>
                <SelectTrigger data-testid="select-document-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {uploadedTypes.has(type.value) && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {DOCUMENT_TYPES.find(t => t.value === selectedType)?.description}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input 
                placeholder="Brief description of this document"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-evidence-description"
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              data-testid="button-confirm-upload"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DisputeActions({ dispute }: { dispute: Dispute }) {
  const { updateProgress, isUpdating } = useDisputeProgress(dispute.id);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  
  const handleAddTracking = () => {
    if (trackingNumber.trim()) {
      updateProgress({ action: "add_tracking", trackingNumber: trackingNumber.trim() });
      setTrackingDialogOpen(false);
      setTrackingNumber("");
    }
  };
  
  const stage = getDisputeStage(dispute);
  
  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4">
        {dispute.status === "DRAFT" && dispute.letterContent && (
          <Button 
            size="sm" 
            variant="default"
            onClick={() => updateProgress({ action: "mark_ready" })}
            disabled={isUpdating}
            data-testid={`button-finalize-${dispute.id}`}
          >
            <FileCheck className="h-3 w-3 mr-1" />
            Finalize Letter
          </Button>
        )}
        
        {dispute.status === "READY_TO_MAIL" && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateProgress({ action: "mark_mailed" })}
            disabled={isUpdating}
            data-testid={`button-mark-mailed-${dispute.id}`}
          >
            <Mail className="h-3 w-3 mr-1" />
            Mark as Mailed
          </Button>
        )}
        
        {dispute.status === "MAILED" && !dispute.trackingNumber && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setTrackingDialogOpen(true)}
            disabled={isUpdating}
            data-testid={`button-add-tracking-${dispute.id}`}
          >
            <Package className="h-3 w-3 mr-1" />
            Add Tracking #
          </Button>
        )}
        
        {dispute.status === "MAILED" && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateProgress({ action: "mark_delivered" })}
            disabled={isUpdating}
            data-testid={`button-mark-delivered-${dispute.id}`}
          >
            <Truck className="h-3 w-3 mr-1" />
            Mark Delivered
          </Button>
        )}
        
        {dispute.status === "DELIVERED" && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateProgress({ action: "start_investigation" })}
            disabled={isUpdating}
            data-testid={`button-start-investigation-${dispute.id}`}
          >
            <Clock className="h-3 w-3 mr-1" />
            Start Investigation Timer
          </Button>
        )}
        
        {dispute.status === "IN_INVESTIGATION" && (
          <>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateProgress({ action: "mark_response_received" })}
              disabled={isUpdating}
              data-testid={`button-mark-response-${dispute.id}`}
            >
              <FileText className="h-3 w-3 mr-1" />
              Response Received
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateProgress({ action: "mark_no_response" })}
              disabled={isUpdating}
              data-testid={`button-no-response-${dispute.id}`}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              No Response (30+ days)
            </Button>
          </>
        )}
        
        {dispute.status === "RESPONSE_RECEIVED" && (
          <>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => updateProgress({ action: "mark_removed" })}
              disabled={isUpdating}
              data-testid={`button-mark-removed-${dispute.id}`}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Removed/Corrected
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateProgress({ action: "mark_verified" })}
              disabled={isUpdating}
              data-testid={`button-mark-verified-${dispute.id}`}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Verified by Bureau
            </Button>
          </>
        )}
        
        {dispute.status === "REMOVED" && (
          <Button 
            size="sm" 
            variant="default"
            onClick={() => updateProgress({ action: "mark_closed" })}
            disabled={isUpdating}
            data-testid={`button-close-removed-${dispute.id}`}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Close Dispute
          </Button>
        )}
        
        {(dispute.status === "VERIFIED" || dispute.status === "NO_RESPONSE") && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateProgress({ action: "mark_escalation" })}
            disabled={isUpdating}
            data-testid={`button-escalate-${dispute.id}`}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Ready to Escalate
          </Button>
        )}
        
      </div>
      
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tracking Number</DialogTitle>
            <DialogDescription>
              Enter the USPS Certified Mail tracking number for this dispute letter.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g., 9400 1234 5678 9012 3456 78"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            data-testid="input-tracking-number"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackingDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTracking} disabled={!trackingNumber.trim()}>
              Save Tracking Number
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface GuidanceData {
  id: string;
  disputeId: string;
  guidanceType: string;
  summary: string;
  nextSteps: string[];
  fcraRights: string[];
  followUpTemplate: string;
  timeline: string;
  createdAt: string;
}

function EscalationGuidance({ dispute }: { dispute: Dispute }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if dispute is resolved - no guidance needed
  const isResolved = !dispute.inaccuracyPersists || 
    dispute.craResponseResult === 'deleted' || 
    dispute.craResponseResult === 'corrected';
  
  // Check if dispute state allows AI guidance generation
  // Requirements: status=ESCALATION_AVAILABLE, dvSent=true, dvResponseReceived=true, not resolved
  const canGenerateGuidance = dispute.status === 'ESCALATION_AVAILABLE' && 
    dispute.dvSent && 
    dispute.dvResponseReceived &&
    !isResolved;
  
  // Determine what's missing for guidance - mirrors backend validation exactly
  const getMissingStateMessage = () => {
    // Resolved disputes don't need guidance
    if (isResolved) return "This dispute has been resolved. No further guidance is needed.";
    
    // Basic requirements
    if (!dispute.dvSent) return "Please update this dispute to indicate that a debt validation request was sent.";
    if (!dispute.dvResponseReceived) return "Please update this dispute to indicate that a response was received.";
    
    // DV response quality check for inaccurate_reporting disputes
    if (dispute.dvResponseQuality === 'unknown' && dispute.disputeType === 'inaccurate_reporting') {
      return "Please update the quality of the validation response (deficient or sufficient).";
    }
    
    // CRA dispute sent but awaiting response
    if (dispute.craDisputeSent && !dispute.craResponseReceived) {
      return "Your CRA dispute has been sent but no response has been recorded yet. Please update once you receive a response.";
    }
    
    return null;
  };
  
  const { data: guidance, isLoading: loadingGuidance } = useQuery<GuidanceData | null>({
    queryKey: ['/api/disputes', dispute.id, 'guidance'],
    queryFn: async () => {
      const res = await fetch(`/api/disputes/${dispute.id}/guidance`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch guidance');
      return res.json();
    },
    enabled: dispute.status === 'ESCALATION_AVAILABLE',
  });

  const generateGuidance = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/disputes/${dispute.id}/generate-guidance`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to generate guidance');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/disputes', dispute.id, 'guidance'] });
      toast({ title: "Guidance Generated", description: "AI escalation guidance is now available." });
    },
    onError: (error: Error) => {
      if (error.message.includes('requires Growth')) {
        toast({ 
          title: "Upgrade Required", 
          description: "AI escalation guidance requires Growth or Compliance+ subscription.",
          variant: "destructive"
        });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const copyTemplate = () => {
    if (guidance?.followUpTemplate) {
      navigator.clipboard.writeText(guidance.followUpTemplate);
      toast({ title: "Copied", description: "Follow-up template copied to clipboard." });
    }
  };

  // Don't show anything if not in escalation available state
  if (dispute.status !== 'ESCALATION_AVAILABLE') return null;

  if (loadingGuidance) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading guidance...
      </div>
    );
  }

  if (!guidance) {
    const missingMessage = getMissingStateMessage();
    
    // If state is incomplete, show info message (not the Generate button)
    if (!canGenerateGuidance || missingMessage) {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-slate-500" />
            <span className="font-medium text-slate-700">Additional Information Needed</span>
          </div>
          <p className="text-sm text-slate-600">
            {missingMessage || "We need more information about your dispute status to provide appropriate guidance."}
          </p>
        </div>
      );
    }
    
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <span className="font-medium text-amber-800">Escalation Guidance Available</span>
        </div>
        <p className="text-sm text-amber-700">
          Get AI-powered educational guidance on next steps for your escalated dispute, including FCRA rights and follow-up templates.
        </p>
        <Button 
          size="sm" 
          onClick={() => generateGuidance.mutate()}
          disabled={generateGuidance.isPending}
          data-testid={`button-generate-guidance-${dispute.id}`}
        >
          {generateGuidance.isPending ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              Generate AI Guidance
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-blue-800">AI Escalation Guidance</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-1">Summary</h4>
          <p className="text-sm text-slate-600">{guidance.summary}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <ListChecks className="h-4 w-4" />
            Recommended Next Steps
          </h4>
          <ul className="text-sm text-slate-600 space-y-1">
            {guidance.nextSteps?.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <Scale className="h-4 w-4" />
            Your FCRA Rights
          </h4>
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-0.5">
            {guidance.fcraRights?.map((right, i) => (
              <li key={i}>{right}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-700 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Next Step Letter Template
            </h4>
            <Button variant="ghost" size="sm" onClick={copyTemplate} data-testid={`button-copy-template-${dispute.id}`}>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <div className="bg-white border rounded-md p-3 text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
            {guidance.followUpTemplate}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          <span>Suggested Timeline: {guidance.timeline}</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 italic mt-2">
        This is educational guidance only, not legal advice. Consider consulting a consumer rights attorney for complex cases.
      </p>
    </div>
  );
}

const TEMPLATE_STAGES = [
  { id: 'INVESTIGATION_REQUEST', label: 'Investigation Request', description: 'Initial dispute letter requesting investigation under FCRA' },
  { id: 'PERSONAL_INFO_REMOVER', label: 'Personal Info Remover', description: 'Request removal of outdated personal information' },
  { id: 'VALIDATION_OF_DEBT', label: 'Validation of Debt', description: 'Demand verification that the debt is valid' },
  { id: 'FACTUAL_LETTER', label: 'Factual Dispute', description: 'Dispute with specific factual errors identified' },
  { id: 'TERMINATION_LETTER', label: 'Termination Letter', description: 'Final demand for removal citing violations' },
  { id: 'AI_ESCALATION', label: 'AI Escalation', description: 'AI-powered escalation letter' },
] as const;

function TemplateStageTracker({ dispute }: { dispute: Dispute }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  const currentStage = (dispute as any).templateStage || 'INVESTIGATION_REQUEST';
  const currentIndex = TEMPLATE_STAGES.findIndex(s => s.id === currentStage);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
  
  const generateLetter = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/disputes/${dispute.id}/generate-letter`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to generate letter');
      }
      return res.json();
    },
    onSuccess: (data) => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['/api/disputes'] });
      toast({ 
        title: "Letter Generated", 
        description: `${data.templateInfo.title} has been generated.` 
      });
    },
    onError: (err: Error) => {
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const advanceStage = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/disputes/${dispute.id}/advance-stage`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to advance stage');
      }
      return res.json();
    },
    onSuccess: (data) => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['/api/disputes'] });
      toast({ 
        title: "Stage Advanced", 
        description: `Now at: ${data.templateInfo.title}` 
      });
    },
    onError: (err: Error) => {
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const isLastStage = safeCurrentIndex >= TEMPLATE_STAGES.length - 1;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          5-Step Dispute Template Process
        </h4>
        <Badge variant="outline" className="bg-white">
          Step {safeCurrentIndex + 1} of {TEMPLATE_STAGES.length}
        </Badge>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {TEMPLATE_STAGES.map((stage, index) => {
          const isCompleted = index < safeCurrentIndex;
          const isCurrent = index === safeCurrentIndex;
          const isPending = index > safeCurrentIndex;
          
          return (
            <div key={stage.id} className="flex items-center">
              <div 
                className={`flex flex-col items-center min-w-[80px] ${isCurrent ? 'scale-105' : ''}`}
                data-testid={`stage-${stage.id}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${isCompleted ? 'bg-emerald-500 text-white' : 
                      isCurrent ? 'bg-primary text-white ring-2 ring-primary/30' : 
                      'bg-slate-200 text-slate-500'}`}
                >
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className={`text-[10px] text-center mt-1 max-w-[70px] leading-tight
                  ${isCurrent ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                  {stage.label.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
              {index < TEMPLATE_STAGES.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg p-3 border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h5 className="font-medium text-slate-800">
              {TEMPLATE_STAGES[safeCurrentIndex]?.label || 'Unknown'}
            </h5>
            <p className="text-sm text-muted-foreground mt-0.5">
              {TEMPLATE_STAGES[safeCurrentIndex]?.description || ''}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => generateLetter.mutate()}
              disabled={generateLetter.isPending}
              data-testid={`button-generate-letter-${dispute.id}`}
            >
              {generateLetter.isPending ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Generate
            </Button>
            {!isLastStage && (
              <Button 
                size="sm"
                onClick={() => advanceStage.mutate()}
                disabled={advanceStage.isPending || !dispute.letterContent}
                data-testid={`button-advance-stage-${dispute.id}`}
              >
                {advanceStage.isPending ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <ArrowRight className="h-3 w-3 mr-1" />
                )}
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Work through each step in order. Generate a letter, mail it, wait for response, then advance to the next step if needed.
      </p>
    </div>
  );
}

function DisputeCard({ dispute }: { dispute: Dispute }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewLetterOpen, setViewLetterOpen] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
      case "READY_TO_MAIL":
        return <FileText className="h-4 w-4 text-slate-400" />;
      case "MAILED":
      case "DELIVERED":
      case "IN_INVESTIGATION":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "RESPONSE_RECEIVED":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "REMOVED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "VERIFIED":
      case "NO_RESPONSE":
      case "ESCALATION_AVAILABLE":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "CLOSED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-100 text-slate-800";
      case "READY_TO_MAIL":
        return "bg-purple-100 text-purple-800";
      case "MAILED":
        return "bg-amber-100 text-amber-800";
      case "DELIVERED":
        return "bg-yellow-100 text-yellow-800";
      case "IN_INVESTIGATION":
        return "bg-blue-100 text-blue-800";
      case "RESPONSE_RECEIVED":
        return "bg-indigo-100 text-indigo-800";
      case "REMOVED":
        return "bg-emerald-100 text-emerald-800";
      case "VERIFIED":
        return "bg-orange-100 text-orange-800";
      case "NO_RESPONSE":
        return "bg-red-100 text-red-800";
      case "ESCALATION_AVAILABLE":
        return "bg-rose-100 text-rose-800";
      case "CLOSED":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };
  
  const daysUntilDeadline = dispute.responseDeadline 
    ? differenceInDays(new Date(dispute.responseDeadline), new Date())
    : null;
  
  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-dispute-${dispute.id}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(dispute.status)}
                {dispute.creditorName}
              </CardTitle>
              <CardDescription>
                {dispute.bureau} • Account #{dispute.accountNumber?.slice(-4) || "****"} • {dispute.disputeReason}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {daysUntilDeadline !== null && daysUntilDeadline <= 7 && (
                <Badge 
                  variant="outline" 
                  className={
                    daysUntilDeadline < 0 ? "bg-red-100 text-red-700 border-red-200" :
                    daysUntilDeadline <= 3 ? "bg-red-50 text-red-600 border-red-200" :
                    "bg-orange-50 text-orange-700 border-orange-200"
                  }
                >
                  <Bell className="h-3 w-3 mr-1" />
                  {daysUntilDeadline < 0 ? "Overdue" : `${daysUntilDeadline}d left`}
                </Badge>
              )}
              <Badge className={getStatusColor(dispute.status)}>
                {dispute.status.replace(/_/g, ' ')}
              </Badge>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" data-testid={`button-expand-${dispute.id}`}>
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <div className="mt-4">
            <DisputeProgressBar dispute={dispute} />
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {dispute.trackingNumber && (
              <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-md">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tracking:</span>
                <span className="font-mono">{dispute.trackingNumber}</span>
                <a 
                  href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${dispute.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Track <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            
            <DeadlineCountdown dispute={dispute} />
            
            <TemplateStageTracker dispute={dispute} />
            
            <DisputeChecklist disputeId={dispute.id} />
            
            <EvidenceManager disputeId={dispute.id} />
            
            <DisputeActions dispute={dispute} />
            
            <EscalationGuidance dispute={dispute} />
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Created {dispute.createdAt ? formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true }) : 'recently'}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewLetterOpen(true)}
                data-testid={`button-view-letter-${dispute.id}`}
              >
                <FileText className="h-3 w-3 mr-1" />
                View Letter
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
      
      <Dialog open={viewLetterOpen} onOpenChange={setViewLetterOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dispute Letter - {dispute.creditorName}
            </DialogTitle>
            <DialogDescription>
              {dispute.bureau} • {dispute.disputeReason}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 border rounded-lg p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {dispute.letterContent || "Letter content not available."}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                if (dispute.letterContent) {
                  navigator.clipboard.writeText(dispute.letterContent);
                }
              }}
              data-testid="button-copy-letter"
            >
              Copy to Clipboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (dispute.letterContent) {
                  const blob = new Blob([dispute.letterContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `dispute-letter-${dispute.creditorName.replace(/\s+/g, '-').toLowerCase()}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              data-testid="button-download-letter"
            >
              Download
            </Button>
            <Button onClick={() => setViewLetterOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function BestPracticesPanel() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <Card className="bg-primary/5 border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Best Practices for Sending Disputes
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="button-toggle-best-practices">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CardDescription>
            Follow these guidelines to maximize the effectiveness of your dispute letters.
          </CardDescription>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BEST_PRACTICES.map((practice, index) => (
                <div 
                  key={index} 
                  className="flex gap-3 p-3 rounded-lg bg-background border"
                  data-testid={`best-practice-${index}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <practice.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{practice.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{practice.description}</p>
                    {practice.link && (
                      <a 
                        href={practice.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        Learn more <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function DisputesPage() {
  const { disputes, isLoading } = useDisputes();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">My Disputes</h1>
            <p className="text-muted-foreground">Track and manage your credit dispute letters.</p>
          </div>
          <SubscriptionGate requiredTier="GROWTH" featureName="Dispute Wizard">
            <Button 
              className="bg-primary text-white" 
              data-testid="button-new-dispute"
              onClick={() => setLocation("/dashboard?wizard=open")}
            >
              <Plus className="h-4 w-4 mr-2" /> New Dispute
            </Button>
          </SubscriptionGate>
        </div>

        <BestPracticesPanel />

        {disputes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">No Disputes Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You haven't created any dispute letters yet. Use the Dispute Wizard™ to generate your first dispute letter.
              </p>
              <SubscriptionGate requiredTier="GROWTH" featureName="Dispute Wizard">
                <Button 
                  className="bg-primary text-white" 
                  data-testid="button-start-dispute"
                  onClick={() => setLocation("/dashboard?wizard=open")}
                >
                  <Plus className="h-4 w-4 mr-2" /> Start Dispute Wizard
                </Button>
              </SubscriptionGate>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {disputes.map((dispute) => (
              <DisputeCard key={dispute.id} dispute={dispute} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
