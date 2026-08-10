import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, MapPin, Search } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Issues — Surya JanSeva" },
      { name: "description", content: "Explore civic issues reported in your area." },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["public_complaints", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("public_complaints")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20";
      case "in_progress":
      case "action_initiated":
        return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "rejected":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      default:
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
    }
  };

  const formatStatus = (status: string | null) => {
    if (!status) return "Unknown";
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold">Explore Issues</h1>
            <p className="mt-3 text-muted-foreground">
              Discover and monitor public civic issues reported across India.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues by title..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : complaints?.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <p className="text-lg font-medium text-muted-foreground">No issues found.</p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">Try adjusting your search terms.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {complaints?.map((complaint) => (
              <Card key={complaint.id} className="flex flex-col shadow-card hover:shadow-lift transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant="secondary" className={getStatusColor(complaint.status)}>
                      {formatStatus(complaint.status)}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      {complaint.created_at ? format(new Date(complaint.created_at), "MMM d, yyyy") : ""}
                    </span>
                  </div>
                  <CardTitle className="mt-4 line-clamp-2 text-lg">
                    {complaint.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-6">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {complaint.summary || "No description provided."}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">
                      {[complaint.locality, complaint.city, complaint.district, complaint.state]
                        .filter(Boolean)
                        .filter(v => v !== "Not Specified")
                        .join(", ") || "Location not specified"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-4 text-xs font-semibold">
                    <span className="text-muted-foreground/70">ID: {complaint.grievance_id}</span>
                    <span className="text-primary">{complaint.category_name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
