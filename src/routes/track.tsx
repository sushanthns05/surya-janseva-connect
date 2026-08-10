import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track — Surya JanSeva" },
      { name: "description", content: "Track on Surya JanSeva, India's civic grievance platform." },
      { property: "og:title", content: "Track — Surya JanSeva" },
      { property: "og:description", content: "Track on Surya JanSeva, India's civic grievance platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Track,
});

function Track() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Track</h1>
        <p className="mt-3 text-muted-foreground">This section is being built next.</p>
      </section>
    </AppShell>
  );
}
