import Link from "next/link";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listPublicCampaigns } from "@/server/services/campaigns";

const trustFeatures = [
  "Role-based charity operations with donor, beneficiary, and admin experiences.",
  "Verification-first architecture to protect donors and beneficiaries before campaigns go live.",
  "Privacy-safe identity handling with reusable masking helpers and audit trails.",
];

const roleCards = [
  {
    title: "Donors",
    description: "Discover verified stories, follow campaign progress, and prepare for secure giving flows in later modules.",
    href: "/sign-up",
  },
  {
    title: "Beneficiaries",
    description: "Complete onboarding, manage documents, and prepare campaigns for review and publication.",
    href: "/sign-up",
  },
  {
    title: "Admins",
    description: "Review verification cases, inspect audit history, and manage trust operations from a single control center.",
    href: "/sign-in",
  },
];

export default async function LandingPage() {
  const featuredCampaigns = await listPublicCampaigns();

  return (
    <main>
      <section className="surface-grid relative overflow-hidden">
        <div className="mx-auto grid min-h-[78vh] max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Trusted giving infrastructure
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-tight md:text-6xl">
                Verify need. Build trust. Support with confidence.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                TrustBridge is the production-ready SaaS foundation for verified charity operations, bridging donors, beneficiaries, and administrators with secure workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Launch your workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/campaigns">Browse campaign shell</Link>
              </Button>
            </div>
          </div>
          <Card className="bg-card/90">
            <CardHeader className="space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-7" />
              </div>
              <CardTitle className="text-2xl">Platform snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-3xl border border-border/70 bg-muted/40 p-5">
                <p className="text-sm font-medium text-muted-foreground">Roles enabled</p>
                <p className="mt-2 text-3xl font-semibold">3</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-background p-5">
                  <p className="text-sm font-medium text-muted-foreground">Verification-ready</p>
                  <p className="mt-2 text-lg font-semibold">Beneficiary onboarding</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background p-5">
                  <p className="text-sm font-medium text-muted-foreground">Audit trail</p>
                  <p className="mt-2 text-lg font-semibold">Every critical action logged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight">A verification-first operating system for modern charity teams.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ["1", "Authenticate and assign a role", "Users enter through Clerk, sync into Prisma, and are routed into role-specific workflows."],
            ["2", "Collect secure beneficiary information", "Onboarding, privacy controls, and document readiness are built for verification before public visibility."],
            ["3", "Review, publish, and monitor", "Admins approve cases, beneficiaries prepare campaigns, and donors browse trust-centered public stories."]
          ].map(([step, title, description]) => (
            <Card key={step}>
              <CardContent className="space-y-4 px-6 py-8">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                  {step}
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="trust-features" className="bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Trust features</p>
            <h2 className="text-3xl font-semibold tracking-tight">Security and transparency are part of the product foundation, not bolted on later.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {trustFeatures.map((feature, index) => (
              <Card key={feature}>
                <CardContent className="space-y-4 px-6 py-8">
                  {index === 0 ? <HeartHandshake className="size-6 text-primary" /> : index === 1 ? <ShieldCheck className="size-6 text-primary" /> : <UserRoundCheck className="size-6 text-primary" />}
                  <p className="text-base text-muted-foreground">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Latest campaigns</p>
          <h2 className="text-3xl font-semibold tracking-tight">Verified stories ready for public discovery</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredCampaigns.slice(0, 3).map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="space-y-4 px-6 py-8">
                <div className="h-40 rounded-[1.5rem] bg-gradient-to-br from-primary/15 via-background to-secondary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.shortDescription}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/campaigns/${campaign.slug}`}>View campaign</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Choose your path</p>
          <h2 className="text-3xl font-semibold tracking-tight">Built for every role in the charity verification journey.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {roleCards.map((role) => (
            <Card key={role.title}>
              <CardContent className="space-y-6 px-6 py-8">
                <h3 className="text-xl font-semibold">{role.title}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
                <Button asChild variant="outline">
                  <Link href={role.href}>
                    Continue
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
