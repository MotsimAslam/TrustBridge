import { Role } from "@prisma/client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { requireRole } from "@/lib/auth/session";
import {
  getAdminOverviewStats,
  getCampaignStatusDistribution,
  getOnboardingCompletionRate,
  getVerificationTrend,
} from "@/server/services/dashboard";

export default async function AdminDashboardPage() {
  await requireRole(Role.ADMIN);
  const stats = await getAdminOverviewStats();
  const trend = await getVerificationTrend();
  const distribution = await getCampaignStatusDistribution();
  const onboarding = await getOnboardingCompletionRate();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin dashboard"
        title="Verification operations center"
        description="This dashboard is structured for verification, reporting, health visibility, and future moderation workflows."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Pending verification" value={String(stats.pendingVerificationCases)} />
        <StatCard label="Approved beneficiaries" value={String(stats.approvedBeneficiaries)} />
        <StatCard label="Published campaigns" value={String(stats.publishedCampaigns)} />
        <StatCard label="Reports submitted" value={String(stats.reportsSubmitted)} />
      </div>
      <SectionCard title="Operational readiness" description="Use the internal status page to validate environment health and foundational services.">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-5">
            <p className="font-medium">Verification trend</p>
            <div className="mt-4 space-y-3">
              {Object.entries(trend).slice(-5).map(([date, values]) => (
                <div key={date} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{date}</span>
                    <span>{values.submitted} submitted</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(values.submitted * 20, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-5">
            <p className="font-medium">Campaign status distribution</p>
            <div className="mt-4 space-y-3">
              {distribution.map((item) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <span>{item.status.replaceAll("_", " ")}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-5">
            <p className="font-medium">Onboarding completion rate</p>
            <p className="mt-4 text-4xl font-semibold">{onboarding.percent}%</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {onboarding.completed} of {onboarding.total} beneficiary accounts completed onboarding.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
