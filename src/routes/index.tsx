import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accessibility,
  Bell,
  Building2,
  Bus,
  ChartNoAxesCombined,
  CircleEllipsis,
  Construction,
  Droplets,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  Lightbulb,
  MapPin,
  MessageSquareHeart,
  Paperclip,
  Send,
  ShieldAlert,
  SprayCan,
  Trash2,
  Zap,
  type LucideIcon,
} from "lucide-react";

import heroImage from "@/assets/hero-civic.jpg";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n";
import { useCategories, usePlatformStats } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Surya JanSeva — Report & Track Civic Issues in India" },
      {
        name: "description",
        content:
          "Report public-service problems, civic infrastructure issues and improvement suggestions anywhere in India. Get a grievance ID and track it end to end.",
      },
      { property: "og:title", content: "Surya JanSeva — Report & Track Civic Issues in India" },
      {
        property: "og:description",
        content: "Your Voice. Your City. A Better India. Report. Track. Improve.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  construction: Construction,
  lightbulb: Lightbulb,
  droplets: Droplets,
  sprayCan: SprayCan,
  trash2: Trash2,
  bus: Bus,
  heartPulse: HeartPulse,
  graduationCap: GraduationCap,
  zap: Zap,
  leaf: Leaf,
  shieldAlert: ShieldAlert,
  accessibility: Accessibility,
  landmark: Landmark,
  building2: Building2,
  circleEllipsis: CircleEllipsis,
};

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number | undefined;
  loading: boolean;
}) {

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      {loading ? (
        <Skeleton className="h-9 w-16" />
      ) : (
        <p className="font-display text-3xl font-bold tabular-nums text-foreground">{value ?? 0}</p>
      )}
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function LandingPage() {
  const { t } = useI18n();
  const stats = usePlatformStats();
  const categories = useCategories();

  const steps = [
    { icon: Send, title: t("how.report"), body: t("how.reportBody") },
    { icon: FileCheck2, title: t("how.verify"), body: t("how.verifyBody") },
    { icon: Landmark, title: t("how.forward"), body: t("how.forwardBody") },
    { icon: ChartNoAxesCombined, title: t("how.resolve"), body: t("how.resolveBody") },
    { icon: MessageSquareHeart, title: t("how.feedback"), body: t("how.feedbackBody") },
  ];

  const reasons = [
    { icon: Send, title: t("why.easy"), body: t("why.easyBody") },
    { icon: MapPin, title: t("why.location"), body: t("why.locationBody") },
    { icon: Paperclip, title: t("why.evidence"), body: t("why.evidenceBody") },
    { icon: FileCheck2, title: t("why.tracking"), body: t("why.trackingBody") },
    { icon: Bell, title: t("why.notify"), body: t("why.notifyBody") },
    { icon: MessageSquareHeart, title: t("why.feedback"), body: t("why.feedbackBody") },
    { icon: ChartNoAxesCombined, title: t("why.data"), body: t("why.dataBody") },
  ];

  return (
    <AppShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("brand.short")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/report">{t("cta.report")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/track">{t("cta.track")}</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link to="/explore">{t("cta.explore")}</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link to="/how-it-works">{t("cta.how")}</Link>
              </Button>
            </div>
            <p className="mt-8 max-w-xl text-xs leading-relaxed text-muted-foreground/80">
              {t("hero.disclaimer")}
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-primary-foreground/15 shadow-lift">
              <img
                src={heroImage}
                alt="Indian streets, streetlights, public water taps and public transport at golden hour"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-lg border border-border bg-card p-4 shadow-lift sm:left-8 sm:right-8">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-display text-xl font-bold tabular-nums">
                    {stats.data?.total ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t("stats.total")}</p>
                </div>
                <div className="border-x border-border">
                  <p className="font-display text-xl font-bold tabular-nums">
                    {stats.data?.inProgress ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t("stats.progress")}</p>
                </div>
                <div>
                  <p className="font-display text-xl font-bold tabular-nums">
                    {stats.data?.resolved ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t("stats.resolved")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 w-full tricolor-rule" aria-hidden />
      </section>

      {/* STATS */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("stats.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("stats.subtitle")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={t("stats.total")} value={stats.data?.total} loading={stats.isLoading} />
          <StatCard
            label={t("stats.review")}
            value={stats.data?.underReview}
            loading={stats.isLoading}
          />
          <StatCard
            label={t("stats.forwarded")}
            value={stats.data?.forwarded}
            loading={stats.isLoading}
          />
          <StatCard
            label={t("stats.progress")}
            value={stats.data?.inProgress}
            loading={stats.isLoading}
          />
          <StatCard
            label={t("stats.resolved")}
            value={stats.data?.resolved}
            loading={stats.isLoading}
          />
          <StatCard
            label={t("stats.suggestions")}
            value={stats.data?.suggestions}
            loading={stats.isLoading}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-surface py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("how.title")}</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
                    <step.icon className="size-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Step {index + 1}
                  </span>
                </div>
                <p className="mt-3 font-display text-base font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("categories.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("categories.subtitle")}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.isLoading
            ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-24" />)
            : categories.data?.map((category) => {
                const Icon = CATEGORY_ICONS[category.icon] ?? CircleEllipsis;
                return (
                  <Link
                    key={category.id}
                    to="/explore"
                    className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-card"
                  >
                    <Icon className="size-5 text-accent" />
                    <p className="mt-3 text-sm font-semibold leading-tight">{category.name}</p>
                  </Link>
                );
              })}
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("why.title")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <Card key={reason.title} className="border-border">
                <CardContent className="pt-6">
                  <reason.icon className="size-5 text-accent" />
                  <p className="mt-3 font-display text-base font-semibold">{reason.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{reason.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/report">{t("cta.report")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/suggest">{t("cta.suggest")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
