import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Languages, LogOut, Menu, Moon, Sun, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth, useSignOut } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { LOCALES, useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/report", key: "nav.report" },
  { to: "/track", key: "nav.track" },
  { to: "/explore", key: "nav.explore" },
  { to: "/suggestions", key: "nav.suggestions" },
  { to: "/how-it-works", key: "nav.how" },
] as const;

function useUnreadCount(userId?: string) {
  return useQuery({
    queryKey: ["notifications", "unread", userId],
    enabled: !!userId,
    refetchInterval: 60_000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId!)
        .eq("is_read", false);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export function SiteHeader() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const { user, isStaff } = useAuth();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const unread = useUnreadCount(user?.id);
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="Surya JanSeva home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Change language">
                <Languages className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              {LOCALES.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onSelect={() => setLocale(l.code)}
                  className={cn(locale === l.code && "font-semibold")}
                >
                  {l.native}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild aria-label={t("nav.notifications")}>
                <Link to="/notifications" className="relative">
                  <Bell className="size-4" />
                  {unread.data ? (
                    <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {unread.data > 9 ? "9+" : unread.data}
                    </span>
                  ) : null}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    <LayoutDashboard className="size-4" />
                    <span className="max-w-28 truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">{t("nav.dashboard")}</Link>
                  </DropdownMenuItem>
                  {isStaff ? (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <ShieldCheck className="size-4" /> {t("nav.admin")}
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut className="size-4" /> {t("nav.signout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/auth">{t("nav.signin")}</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                    >
                      {t("nav.dashboard")}
                    </Link>
                    {isStaff ? (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                      >
                        {t("nav.admin")}
                      </Link>
                    ) : null}
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setOpen(false);
                        void handleSignOut();
                      }}
                    >
                      {t("nav.signout")}
                    </Button>
                  </>
                ) : (
                  <Button asChild className="mt-2">
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      {t("nav.signin")}
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
