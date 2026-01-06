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

export function getDisputeStage(dispute: Dispute): number {
  const terminalStatuses = ["REMOVED", "VERIFIED", "NO_RESPONSE", "ESCALATION_AVAILABLE", "CLOSED"];
  if (terminalStatuses.includes(dispute.status)) return 7;
  if (dispute.status === "RESPONSE_RECEIVED") return 6;
  if (dispute.status === "IN_INVESTIGATION") return 5;
  if (dispute.status === "DELIVERED" || dispute.deliveredAt) return 4;
  if (dispute.status === "MAILED" || dispute.mailedAt) return 3;
  if (dispute.status === "READY_TO_MAIL" || dispute.letterContent) return 2;
  if (dispute.status === "DRAFT") return 1;
  return 0;
}

export const TOTAL_STAGES = 7;

export function getStageLabel(stage: number): string {
  const labels: Record<number, string> = {
    0: "Not Started",
    1: "Draft",
    2: "Ready to Mail",
    3: "Mailed",
    4: "Delivered",
    5: "In Investigation",
    6: "Response Received",
    7: "Complete"
  };
  return labels[stage] || "Unknown";
}
