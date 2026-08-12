import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Surya JanSeva" },
      {
        name: "description",
        content:
          "How Surya JanSeva collects, stores and protects the personal data of citizens filing grievances.",
      },
      { property: "og:title", content: "Privacy Policy — Surya JanSeva" },
      {
        property: "og:description",
        content: "How Surya JanSeva collects, stores and protects citizen data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            Surya JanSeva collects only the information needed to register a grievance and route it
            to the right department: your name, email address, mobile number, location and the
            details or evidence you choose to submit.
          </p>
          <p>
            Your contact details are never shown publicly. Grievances listed on public pages show
            only the title, category, status and approximate area — never your identity, full
            address or attachments.
          </p>
          <p>
            Data is stored securely with row-level access controls so that only you and the
            authorised officers handling your grievance can view it. You may request correction or
            deletion of your profile data at any time.
          </p>
          <p>
            Evidence files are kept in private storage and are accessible only to you and the
            assigned department for as long as the grievance remains open.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
