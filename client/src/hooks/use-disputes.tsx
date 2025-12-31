import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dispute } from "@/lib/schema";

export function useDisputes() {
  const queryClient = useQueryClient();

  const { data: disputes = [], isLoading } = useQuery<Dispute[]>({
    queryKey: ["/api/disputes"],
    queryFn: async () => {
      const res = await fetch("/api/disputes", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch disputes");
      return res.json();
    },
  });

  const createDispute = useMutation({
    mutationFn: async (disputeData: Partial<Dispute>) => {
      const res = await apiRequest("POST", "/api/disputes", disputeData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disputes"] });
    },
  });

  const updateDispute = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Dispute> }) => {
      const res = await apiRequest("PATCH", `/api/disputes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disputes"] });
    },
  });

  const deleteDispute = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/disputes/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disputes"] });
    },
  });

  return {
    disputes,
    isLoading,
    createDispute: createDispute.mutateAsync,
    updateDispute: updateDispute.mutateAsync,
    deleteDispute: deleteDispute.mutateAsync,
  };
}
