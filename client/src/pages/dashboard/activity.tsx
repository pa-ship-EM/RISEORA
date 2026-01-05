import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, Upload, Trash2, Edit, Lock, LogIn, LogOut, 
  Loader2, Clock, Activity
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { AuditLog, AuditAction } from "@/lib/schema";

const ACTION_CONFIG: Record<AuditAction, { icon: React.ElementType; label: string; color: string }> = {
  LETTER_GENERATED: { icon: FileText, label: "Letter Generated", color: "bg-blue-100 text-blue-700" },
  DISPUTE_CREATED: { icon: FileText, label: "Dispute Created", color: "bg-emerald-100 text-emerald-700" },
  DISPUTE_UPDATED: { icon: Edit, label: "Dispute Updated", color: "bg-amber-100 text-amber-700" },
  FILE_UPLOADED: { icon: Upload, label: "File Uploaded", color: "bg-purple-100 text-purple-700" },
  FILE_DELETED: { icon: Trash2, label: "File Deleted", color: "bg-red-100 text-red-700" },
  STATUS_UPDATED: { icon: Edit, label: "Status Updated", color: "bg-amber-100 text-amber-700" },
  PROFILE_UPDATED: { icon: Edit, label: "Profile Updated", color: "bg-slate-100 text-slate-700" },
  PASSWORD_CHANGED: { icon: Lock, label: "Password Changed", color: "bg-orange-100 text-orange-700" },
  LOGIN: { icon: LogIn, label: "Logged In", color: "bg-green-100 text-green-700" },
  LOGOUT: { icon: LogOut, label: "Logged Out", color: "bg-slate-100 text-slate-700" },
};

function ActivityItem({ log }: { log: AuditLog }) {
  const config = ACTION_CONFIG[log.action] || { 
    icon: Activity, 
    label: log.action, 
    color: "bg-slate-100 text-slate-700" 
  };
  const Icon = config.icon;
  
  const parseDetails = () => {
    if (!log.details) return null;
    try {
      return JSON.parse(log.details);
    } catch {
      return null;
    }
  };
  
  const details = parseDetails();

  return (
    <div 
      className="flex items-start gap-4 p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
      data-testid={`activity-${log.id}`}
    >
      <div className={`p-2 rounded-full ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{config.label}</span>
          <Badge variant="outline" className="text-xs">
            {log.resourceType}
          </Badge>
        </div>
        {details && (
          <div className="text-sm text-muted-foreground mt-1">
            {details.fileName && <span>File: {details.fileName}</span>}
            {details.creditorName && <span>Creditor: {details.creditorName}</span>}
            {details.documentType && <span> ({details.documentType})</span>}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}</span>
        </div>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ['/api/audit-log'],
    queryFn: async () => {
      const res = await fetch('/api/audit-log', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary mb-2">Activity Log</h1>
          <p className="text-muted-foreground">
            A record of all your actions on the platform for compliance and audit purposes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your last 100 actions are shown below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No activity recorded yet.</p>
                <p className="text-sm mt-1">Your actions will appear here as you use the platform.</p>
              </div>
            ) : (
              <div className="divide-y">
                {logs.map((log) => (
                  <ActivityItem key={log.id} log={log} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
