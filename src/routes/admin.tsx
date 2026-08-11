import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ShieldCheck, Loader2, Search, ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Database } from "@/integrations/supabase/types";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal — Surya JanSeva" }],
  }),
  component: AdminPage,
});

const STATUS_OPTIONS = [
  "submitted",
  "under_verification",
  "verified",
  "assigned",
  "action_initiated",
  "in_progress",
  "resolved",
  "closed",
  "rejected",
  "duplicate",
];

function AdminPage() {
  const { user, isStaff, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isStaff)) {
      toast.error("You do not have permission to access this page.");
      navigate({ to: "/", replace: true });
    }
  }, [user, isStaff, authLoading, navigate]);

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["admin-complaints", search],
    enabled: !!user && isStaff,
    queryFn: async () => {
      let query = supabase.from("complaints").select("*").order("created_at", { ascending: false });

      if (search) {
        query = query.or(`grievance_id.ilike.%${search}%,title.ilike.%${search}%`);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("complaints")
        .update({
          status: status as Database["public"]["Enums"]["complaint_status"],
          ...(status === "resolved" || status === "closed"
            ? { resolved_at: new Date().toISOString() }
            : {}),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
    },
    onError: (error: unknown) => {
      toast.error(
        "Failed to update status: " + (error instanceof Error ? error.message : "Unknown error"),
      );
    },
  });

  if (authLoading || (!user && !isStaff)) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "in_progress":
      case "action_initiated":
      case "assigned":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "rejected":
      case "duplicate":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Admin Portal
            </h1>
            <p className="mt-2 text-muted-foreground">Manage and resolve citizen complaints.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID or Title..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader className="border-b border-border bg-muted/30 pb-4 pt-4">
            <CardTitle className="text-lg">Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : complaints?.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                <p>No complaints found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-30">Grievance ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-75">Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Current Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints?.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.grievance_id}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(complaint.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="max-w-75 truncate" title={complaint.title}>
                          {complaint.title}
                        </TableCell>
                        <TableCell className="truncate max-w-50">
                          {[complaint.address, complaint.city, complaint.district, complaint.state]
                            .filter(Boolean)
                            .filter((v) => v !== "Not Specified")
                            .join(", ") || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(complaint.status)}>
                            {formatStatus(complaint.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={complaint.status}
                            onValueChange={(value) =>
                              updateStatus.mutate({ id: complaint.id, status: value })
                            }
                            disabled={updateStatus.isPending}
                          >
                            <SelectTrigger className="w-40 h-8 text-xs ml-auto">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent align="end">
                              {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status} className="text-xs">
                                  {formatStatus(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
