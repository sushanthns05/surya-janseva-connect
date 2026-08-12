import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/guidelines")({
  head: () => ({
    meta: [
      { title: "Submission Guidelines — Surya JanSeva" },
      {
        name: "description",
        content:
          "How to write a clear grievance, what evidence to attach and what content is not allowed on Surya JanSeva.",
      },
      { property: "og:title", content: "Submission Guidelines — Surya JanSeva" },
      {
        property: "og:description",
        content: "How to write a clear grievance and what evidence to attach.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuidelinesPage,
});

const DOS = [
  "Describe one issue per grievance, with the exact location pin or address.",
  "Attach clear photos or short videos taken at the spot.",
  "Mention how many people are affected and since when the problem exists.",
  "Check the tracking page before filing — the issue may already be reported.",
];

const DONTS = [
  "Do not include other people's personal details, phone numbers or ID numbers.",
  "Do not submit abusive, defamatory or political content.",
  "Do not file duplicate grievances to increase priority.",
  "Do not upload files unrelated to the reported issue.",
];

function GuidelinesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold">Submission Guidelines</h1>
        <p className="mt-4 text-muted-foreground">
          Well-written grievances are verified and assigned faster. Follow these guidelines before
          you submit.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <section>
            <h2 className="font-display text-lg font-semibold">What helps</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {DOS.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold">What to avoid</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {DONTS.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
