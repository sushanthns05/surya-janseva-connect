import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Navigation, CheckCircle2, Search, Zap, MessageSquare } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Surya JanSeva" },
      {
        name: "description",
        content: "Learn how Surya JanSeva helps you report and track civic issues in your area.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. Report an Issue",
    description:
      "Notice a civic problem like a broken street light, pothole, or garbage dump? Fill out a simple form with details and location to lodge a formal complaint on the platform.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Navigation,
    title: "2. Get a Tracking ID",
    description:
      "Once submitted, you'll immediately receive a unique Grievance ID. You can use this ID at any time to track the live progress and status of your complaint.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Search,
    title: "3. Verification & Assignment",
    description:
      "Our administrators and nodal officers verify the complaint and assign it to the appropriate local department (e.g. Water Board, Electricity Dept, PWD) for resolution.",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Zap,
    title: "4. Action Initiated",
    description:
      "The responsible department takes action on the ground. You will see the status update to 'In Progress' or 'Action Initiated' in your dashboard.",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: CheckCircle2,
    title: "5. Resolution",
    description:
      "Once the issue is fixed, the complaint is marked as Resolved. You can review the outcome and optionally provide feedback on the quality of the resolution.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: MessageSquare,
    title: "6. Community Suggestions",
    description:
      "Have a broader idea for city improvement? Use our Suggestions hub to propose new infrastructure or policies, and let the community upvote the best ideas.",
    color: "bg-pink-500/10 text-pink-600",
  },
];

function HowItWorks() {
  return (
    <AppShell>
      <section className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:py-24">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            How Surya JanSeva Works
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A transparent, 6-step process to bridge the gap between citizens and local
            administration. Here is how your voice drives real change.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className={`mb-4 inline-flex rounded-lg p-3 ${step.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold font-display">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-20 rounded-3xl bg-primary/5 px-6 py-12 text-center border border-primary/10 sm:px-12 sm:py-16">
          <h2 className="font-display text-3xl font-bold">Ready to make a difference?</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of active citizens reporting issues and suggesting improvements to make
            our cities better, safer, and cleaner.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/report">Report an Issue Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/suggestions">Browse Suggestions</Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
