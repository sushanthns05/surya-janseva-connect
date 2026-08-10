import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — Surya JanSeva" }],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    onError: (error: unknown) => {
      toast.error("Failed to mark as read: " + error.message);
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
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

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Bell className="h-7 w-7 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-2">
              Stay updated on your complaint statuses and announcements.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Mark all as read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications?.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <Bell className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">You have no notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications?.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "overflow-hidden transition-colors hover:bg-muted/50",
                  !notification.is_read ? "border-l-4 border-l-primary bg-primary/5" : "",
                )}
              >
                <CardContent className="p-4 sm:p-6 flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={cn("font-semibold", !notification.is_read && "text-primary")}>
                        {notification.title}
                      </h3>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {format(new Date(notification.created_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                    {notification.body && (
                      <p className="mt-2 text-sm text-muted-foreground">{notification.body}</p>
                    )}
                  </div>

                  {!notification.is_read && (
                    <div className="flex shrink-0 items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Mark as read"
                        onClick={() => markAsRead.mutate(notification.id)}
                        disabled={markAsRead.isPending}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
