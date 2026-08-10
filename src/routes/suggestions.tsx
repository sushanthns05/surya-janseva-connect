import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { Lightbulb, Loader2, Plus, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/suggestions")({
  head: () => ({
    meta: [{ title: "Suggestions — Surya JanSeva" }],
  }),
  component: SuggestionsPage,
});

const suggestionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details (at least 20 characters)"),
  expected_benefit: z.string().min(10, "Please explain the expected benefit"),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

function SuggestionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .eq("is_hidden", false)
        .order("vote_count", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: userVotes } = useQuery({
    queryKey: ["suggestion_votes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suggestion_votes")
        .select("suggestion_id")
        .eq("user_id", user!.id);

      if (error) throw error;
      return new Set(data.map((v) => v.suggestion_id));
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: { title: "", description: "", expected_benefit: "" },
  });

  const onSubmit = async (data: SuggestionFormValues) => {
    if (!user) {
      toast.error("Please sign in to submit a suggestion");
      navigate({ to: "/auth" });
      return;
    }

    try {
      const { error } = await supabase.from("suggestions").insert({
        title: data.title,
        description: data.description,
        expected_benefit: data.expected_benefit,
        citizen_id: user.id,
        status: "submitted",
        vote_count: 1, // Start with 1 vote (from creator)
      });

      if (error) throw error;

      toast.success("Suggestion submitted successfully!");
      setIsDialogOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to submit suggestion");
    }
  };

  const voteMutation = useMutation({
    mutationFn: async ({
      suggestionId,
      currentVotes,
    }: {
      suggestionId: string;
      currentVotes: number;
    }) => {
      if (!user) throw new Error("Please sign in to vote");

      // Insert vote
      const { error: voteError } = await supabase.from("suggestion_votes").insert({
        suggestion_id: suggestionId,
        user_id: user.id,
      });

      if (voteError) throw voteError;

      // Optimistically increment (backend trigger might also do this, but just in case)
      await supabase
        .from("suggestions")
        .update({ vote_count: currentVotes + 1 })
        .eq("id", suggestionId);
    },
    onSuccess: () => {
      toast.success("Vote recorded!");
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["suggestion_votes", user?.id] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to vote");
    },
  });

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-yellow-500" />
              Community Suggestions
            </h1>
            <p className="mt-3 text-muted-foreground">
              Vote on ideas to improve your city or submit your own suggestions for public
              infrastructure and services.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                New Suggestion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Submit a Suggestion</DialogTitle>
                <DialogDescription>
                  Share your idea for civic improvement. All suggestions are public and can be voted
                  on by others.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Idea Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g. Build a new park in Sector 4"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your idea in detail..."
                    className="min-h-24"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected_benefit">Expected Benefit</Label>
                  <Textarea
                    id="expected_benefit"
                    placeholder="How will this benefit the community?"
                    className="min-h-20"
                    {...register("expected_benefit")}
                  />
                  {errors.expected_benefit && (
                    <p className="text-sm text-destructive">{errors.expected_benefit.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : suggestions?.length === 0 ? (
          <div className="flex flex-col h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            <Lightbulb className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <p>No suggestions yet. Be the first to share an idea!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions?.map((suggestion) => {
              const hasVoted = userVotes?.has(suggestion.id);

              return (
                <Card
                  key={suggestion.id}
                  className="flex flex-col shadow-sm transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl line-clamp-2 leading-tight">
                      {suggestion.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(suggestion.created_at), "MMM d, yyyy")}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {suggestion.description}
                    </p>
                    {suggestion.expected_benefit && (
                      <div className="bg-muted/50 p-3 rounded-md border border-border/50">
                        <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1 block">
                          Benefit
                        </span>
                        <p className="text-sm line-clamp-2">{suggestion.expected_benefit}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 border-t border-border/40 mt-auto flex items-center justify-between p-4">
                    <div className="flex items-center gap-2 font-medium text-lg">
                      {suggestion.vote_count}{" "}
                      <span className="text-sm text-muted-foreground font-normal">votes</span>
                    </div>
                    <Button
                      variant={hasVoted ? "secondary" : "outline"}
                      size="sm"
                      className={hasVoted ? "text-primary" : ""}
                      onClick={() => {
                        if (!user) {
                          toast.error("Please sign in to vote");
                          navigate({ to: "/auth" });
                          return;
                        }
                        if (!hasVoted) {
                          voteMutation.mutate({
                            suggestionId: suggestion.id,
                            currentVotes: suggestion.vote_count,
                          });
                        }
                      }}
                      disabled={hasVoted || voteMutation.isPending}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {hasVoted ? "Voted" : "Upvote"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
