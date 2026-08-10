import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Citizen Dashboard — Surya JanSeva" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: complaints, isLoading: complaintsLoading } = useQuery({
    queryKey: ["my-complaints", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("citizen_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isAuthLoading || !user) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const total = complaints?.length || 0;
  const resolved =
    complaints?.filter((c) => c.status === "resolved" || c.status === "closed").length || 0;
  const pending = total - resolved;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "text-emerald-500 bg-emerald-500/10";
      case "in_progress":
      case "action_initiated":
        return "text-amber-500 bg-amber-500/10";
      case "rejected":
      case "duplicate":
        return "text-destructive bg-destructive/10";
      default:
        return "text-blue-500 bg-blue-500/10";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">
            Welcome back, {profile?.full_name || "Citizen"}
          </h1>
          <p className="text-muted-foreground">
            Manage your civic issues and track their progress.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          <Card className="shadow-card border-none bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-none bg-amber-50 dark:bg-amber-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pending}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-none bg-emerald-50 dark:bg-emerald-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Recent Complaints</h2>
          {complaintsLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : complaints?.length === 0 ? (
            <Card className="flex h-40 flex-col items-center justify-center border-dashed shadow-none">
              <p className="text-muted-foreground">You haven't submitted any complaints yet.</p>
              <a href="/report" className="mt-2 text-sm font-medium text-primary hover:underline">
                Report an Issue
              </a>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {complaints?.map((complaint) => (
                <Card key={complaint.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {complaint.grievance_id}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(complaint.status)}`}
                      >
                        {formatStatus(complaint.status)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1 text-base mt-2">{complaint.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {complaint.description}
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Submitted on {format(new Date(complaint.created_at), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
