import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DisputeChecklist } from "@shared/schema";
import type { Dispute } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";

export function useDisputeChecklist(disputeId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: checklist = [], isLoading } = useQuery<DisputeChecklist[]>({
    queryKey: ["/api/disputes", disputeId, "checklist"],
    queryFn: async () => {
      const res = await fetch(`/api/disputes/${disputeId}/checklist`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch checklist");
      return res.json();
    },
    enabled: !!disputeId,
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await fetch(`/api/checklist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error("Failed to update checklist item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disputes", disputeId, "checklist"] });
    },
  });

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    checklist,
    isLoading,
    toggleItem: toggleItemMutation.mutate,
    isToggling: toggleItemMutation.isPending,
    completedCount,
    totalCount,
    progressPercent,
  };
}

export function useDisputeProgress(disputeId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateProgressMutation = useMutation({
    mutationFn: async ({ action, trackingNumber }: { action: string; trackingNumber?: string }) => {
      const res = await fetch(`/api/disputes/${disputeId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, trackingNumber }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update progress");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/disputes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Progress Updated",
        description: `Dispute status updated to ${data.status}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateProgress: updateProgressMutation.mutate,
    isUpdating: updateProgressMutation.isPending,
  };
}

export const STAGE_LABELS = [
  "Draft",
  "Ready to Mail",
  "Mailed",
  "Delivered",
  "In Investigation",
  "Response Received",
  "Decision Made",
  "Escalation Available",
  "Closed"
];

export function getDisputeStage(dispute: Dispute): number {
  const stages: Record<string, number> = {
    "DRAFT": 0,
    "READY_TO_MAIL": 1,
    "MAILED": 2,
    "DELIVERED": 3,
    "IN_INVESTIGATION": 4,
    "RESPONSE_RECEIVED": 5,
    "REMOVED": 6,
    "VERIFIED": 6,
    "NO_RESPONSE": 6,
    "ESCALATION_AVAILABLE": 7,
    "CLOSED": 8
  };
  return stages[dispute.status] ?? 0;
}

export const TOTAL_STAGES = STAGE_LABELS.length - 1;

export function getStageLabel(stage: number): string {
  return STAGE_LABELS[stage] || "Unknown";
}
