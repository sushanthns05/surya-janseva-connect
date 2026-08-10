import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details (at least 20 characters)"),
  categoryId: z.string().min(1, "Please select a category"),
  address: z.string().min(5, "Please provide an address or landmark"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [{ title: "Report an Issue — Surya JanSeva" }],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaint_categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: "", description: "", categoryId: "", address: "" },
  });

  const onSubmit = async (data: ReportFormValues) => {
    if (!user) {
      toast.error("Please sign in to report an issue");
      navigate({ to: "/auth" });
      return;
    }

    setLoading(true);
    try {
      // Generate a tracking ID
      const trackingId = "SJS-" + Math.random().toString(36).substr(2, 6).toUpperCase();

      const { error } = await supabase.from("complaints").insert({
        grievance_id: trackingId,
        citizen_id: user.id,
        category_id: data.categoryId,
        title: data.title,
        description: data.description,
        address: data.address,
        status: "submitted",
        district: "Not Specified",
        state: "Not Specified",
      });

      if (error) throw error;

      toast.success(`Complaint submitted successfully! Your tracking ID is ${trackingId}`);
      navigate({ to: "/track" });
    } catch (error: unknown) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold">Report an Issue</h1>
          <p className="mt-3 text-muted-foreground">
            Fill out the form below to report a civic issue in your area.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-card sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="E.g. Broken street light in Sector 4"
                {...register("title")}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(value) => setValue("categoryId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                className="min-h-30"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Location / Address</Label>
              <Input
                id="address"
                placeholder="E.g. Near City Park, Main Road"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
