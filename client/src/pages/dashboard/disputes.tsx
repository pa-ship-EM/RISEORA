import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDisputes } from "@/hooks/use-disputes";
import { useSubscription } from "@/hooks/use-subscription";
import { FileText, Plus, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

export default function DisputesPage() {
  const { disputes, isLoading } = useDisputes();
  const { subscription } = useSubscription();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "SENT":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">My Disputes</h1>
            <p className="text-muted-foreground">Track and manage your credit dispute letters.</p>
          </div>
        </div>

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
                <Button className="bg-primary text-white" data-testid="button-start-dispute">
                  <Plus className="h-4 w-4 mr-2" /> Start Dispute Wizard
                </Button>
              </SubscriptionGate>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="hover:shadow-md transition-shadow" data-testid={`card-dispute-${dispute.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStatusIcon(dispute.status)}
                        {dispute.creditorName}
                      </CardTitle>
                      <CardDescription>
                        {dispute.bureau} • Account #{dispute.accountNumber?.slice(-4) || "****"}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(dispute.status)}>
                      {dispute.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Reason: {dispute.disputeReason}
                    </span>
                    <span className="text-muted-foreground">
                      Created {dispute.createdAt ? formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true }) : 'recently'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
