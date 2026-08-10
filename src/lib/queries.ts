import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { ComplaintStatus } from "@/lib/civic";

export type PlatformStats = {
  total: number;
  underReview: number;
  forwarded: number;
  inProgress: number;
  resolved: number;
  suggestions: number;
};

async function countComplaints(statuses?: ComplaintStatus[]) {
  let query = supabase.from("public_complaints").select("id", { count: "exact", head: true });
  if (statuses) query = query.in("status", statuses);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const [total, underReview, forwarded, inProgress, resolved, suggestions] = await Promise.all([
    countComplaints(),
    countComplaints(["submitted", "under_verification"]),
    countComplaints(["forwarded", "assigned"]),
    countComplaints(["action_initiated", "in_progress", "escalated"]),
    countComplaints(["resolved", "closed"]),
    supabase
      .from("suggestions")
      .select("id", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (error) throw error;
        return count ?? 0;
      }),
  ]);
  return { total, underReview, forwarded, inProgress, resolved, suggestions };
}

export function usePlatformStats() {
  return useQuery({ queryKey: ["platform-stats"], queryFn: fetchPlatformStats });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaint_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}
