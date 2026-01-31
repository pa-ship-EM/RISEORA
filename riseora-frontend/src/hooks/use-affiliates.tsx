import { useQuery } from "@tanstack/react-query";

type AffiliateSurface = "dashboard" | "resources" | "dispute_wizard" | "onboarding" | "email";

interface Affiliate {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
}

interface AffiliatesResponse {
  surface: string;
  affiliates: Affiliate[];
}

async function fetchAffiliates(surface: AffiliateSurface): Promise<AffiliatesResponse> {
  const response = await fetch(`/api/affiliates?surface=${surface}`, {
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch affiliates");
  }
  
  return response.json();
}

export function useAffiliates(surface: AffiliateSurface) {
  const query = useQuery({
    queryKey: ["affiliates", surface],
    queryFn: () => fetchAffiliates(surface),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  return {
    affiliates: query.data?.affiliates || [],
    isLoading: query.isLoading,
    error: query.error
  };
}
