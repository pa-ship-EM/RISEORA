import { useState } from "react";
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
  Shield, FileCheck, Truck, Bell, ExternalLink
} from "lucide-react";
import { formatDistanceToNow, format, addDays, differenceInDays } from "date-fns";
import type { Dispute } from "@shared/schema";

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

function DisputeProgressBar({ dispute }: { dispute: Dispute }) {
  const stage = getDisputeStage(dispute);
  const totalStages = 7;
  const progressPercent = Math.round((stage / totalStages) * 100);
  
  const stages = [
    { label: "Generated", completed: stage >= 1 },
    { label: "Printed", completed: stage >= 2 },
    { label: "Mailed", completed: stage >= 4 },
    { label: "Delivered", completed: stage >= 5 },
    { label: "Investigation", completed: stage >= 5 },
    { label: "Response", completed: stage >= 6 },
    { label: "Resolved", completed: stage >= 7 },
  ];
  
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
        {!dispute.mailedAt && (
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
        
        {dispute.mailedAt && !dispute.trackingNumber && (
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
        
        {dispute.mailedAt && !dispute.deliveredAt && (
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
        
        {dispute.deliveredAt && !dispute.responseReceivedAt && (
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
        )}
        
        {dispute.responseReceivedAt && dispute.status !== "RESOLVED" && dispute.status !== "ESCALATED" && (
          <>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => updateProgress({ action: "mark_resolved" })}
              disabled={isUpdating}
              data-testid={`button-mark-resolved-${dispute.id}`}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark Resolved
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateProgress({ action: "mark_escalated" })}
              disabled={isUpdating}
              data-testid={`button-escalate-${dispute.id}`}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Escalate
            </Button>
          </>
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

function DisputeCard({ dispute }: { dispute: Dispute }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewLetterOpen, setViewLetterOpen] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "MAILED":
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "RESPONSE_RECEIVED":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "ESCALATED":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "MAILED":
        return "bg-amber-100 text-amber-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "RESPONSE_RECEIVED":
        return "bg-purple-100 text-purple-800";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-800";
      case "ESCALATED":
        return "bg-red-100 text-red-800";
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
              {daysUntilDeadline !== null && daysUntilDeadline <= 5 && daysUntilDeadline > 0 && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Bell className="h-3 w-3 mr-1" />
                  {daysUntilDeadline} days left
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
            
            {dispute.responseDeadline && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Response deadline: {format(new Date(dispute.responseDeadline), 'MMMM d, yyyy')}</span>
              </div>
            )}
            
            <DisputeChecklist disputeId={dispute.id} />
            
            <DisputeActions dispute={dispute} />
            
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
