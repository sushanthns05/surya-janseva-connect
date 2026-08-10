import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2, MapPin, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Complaint — Surya JanSeva" },
      { name: "description", content: "Track the status of your civic grievance." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [grievanceId, setGrievanceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceId.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("grievance_id", grievanceId.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;
      setComplaint(data);
      if (!data) {
        toast.error("No complaint found with this ID");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch complaint";
      toast.error(errorMessage);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "submitted":
        return { label: "Submitted", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" };
      case "in_progress":
      case "action_initiated":
      case "assigned":
        return { label: "In Progress", icon: Loader2, color: "text-amber-500", bg: "bg-amber-500/10" };
      case "resolved":
      case "closed":
        return { label: "Resolved", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "rejected":
      case "duplicate":
        return { label: "Closed/Rejected", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" };
      default:
        return { label: status.replace("_", " "), icon: Clock, color: "text-muted-foreground", bg: "bg-muted" };
    }
  };

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold">Track Your Complaint</h1>
          <p className="mt-3 text-muted-foreground">
            Enter your grievance ID to check the current status and updates.
          </p>
        </div>

        <Card className="mx-auto max-w-2xl shadow-card">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
              <Input
                placeholder="Enter Grievance ID (e.g., SJS-X7Y8Z9)"
                value={grievanceId}
                onChange={(e) => setGrievanceId(e.target.value)}
                className="flex-1 uppercase"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !grievanceId.trim()}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Track Status
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && !loading && complaint && (
          <div className="mt-12">
            <Card className="overflow-hidden shadow-card">
              <CardHeader className="border-b border-border bg-muted/30 pb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {complaint.grievance_id}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(complaint.created_at), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-2xl font-bold">{complaint.title}</CardTitle>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${getStatusDisplay(complaint.status).bg}`}>
                    {(() => {
                      const StatusIcon = getStatusDisplay(complaint.status).icon;
                      return <StatusIcon className={`h-5 w-5 ${getStatusDisplay(complaint.status).color} ${complaint.status === "in_progress" ? "animate-spin" : ""}`} />;
                    })()}
                    <span className={`font-semibold ${getStatusDisplay(complaint.status).color}`}>
                      {getStatusDisplay(complaint.status).label}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div className="sm:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</h3>
                      <p className="mt-2 text-foreground leading-relaxed whitespace-pre-wrap">
                        {complaint.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Location</h3>
                      <div className="mt-2 flex items-start gap-2 text-foreground">
                        <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <span>
                          {complaint.address || "No specific address provided."}
                          {complaint.district && complaint.district !== "Not Specified" && `, ${complaint.district}`}
                          {complaint.state && complaint.state !== "Not Specified" && `, ${complaint.state}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 rounded-lg bg-muted/50 p-4">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Timeline</h3>
                      <div className="mt-4 space-y-4">
                        <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:-ml-px before:h-full before:w-0.5 before:bg-border last:before:hidden">
                          <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                          <p className="text-sm font-medium">Complaint Submitted</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(complaint.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                        {complaint.status === "resolved" && complaint.resolved_at && (
                          <div className="relative pl-6">
                            <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-emerald-500 bg-emerald-500" />
                            <p className="text-sm font-medium">Complaint Resolved</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(complaint.resolved_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        )}
                        {complaint.status !== "resolved" && complaint.status !== "closed" && complaint.status !== "rejected" && (
                          <div className="relative pl-6">
                            <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-muted bg-muted" />
                            <p className="text-sm font-medium text-muted-foreground">Resolution Pending</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </AppShell>
  );
}
