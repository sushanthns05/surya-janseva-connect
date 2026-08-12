import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Surya JanSeva" },
      {
        name: "description",
        content:
          "The terms that govern the use of the Surya JanSeva public grievance and civic improvement platform.",
      },
      { property: "og:title", content: "Terms of Use — Surya JanSeva" },
      {
        property: "og:description",
        content: "Terms governing use of the Surya JanSeva grievance platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold">Terms of Use</h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            Surya JanSeva is a civic grievance platform operated by Surya Group of Industries. By
            creating an account you agree to use it in good faith and to submit information that is
            accurate to the best of your knowledge.
          </p>
          <p>
            Accounts require a verified mobile number. Filing knowingly false, abusive or duplicate
            grievances may result in the grievance being rejected and the account being suspended.
          </p>
          <p>
            The platform routes grievances to the relevant departments and tracks their progress. It
            does not guarantee a specific outcome or timeline, as resolution depends on the
            concerned authority.
          </p>
          <p>
            Content you publish on public pages, such as improvement suggestions, may be moderated
            or hidden if it violates these terms.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
