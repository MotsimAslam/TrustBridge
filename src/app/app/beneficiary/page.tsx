import { Role } from "@prisma/client";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { requireRole } from "@/lib/auth/session";

export default async function BeneficiaryDashboardPage() {
  const user = await requireRole(Role.BENEFICIARY);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Beneficiary dashboard"
        title={user.profile?.displayName ?? "Beneficiary workspace"}
        description="Track onboarding, privacy controls, documents, and campaign readiness from one place."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Onboarding" value={user.beneficiaryOnboardingComplete ? "Complete" : "In progress"} />
        <StatCard label="Verification level" value={user.verificationLevel.replaceAll("_", " ")} />
        <StatCard label="Privacy mode" value={user.beneficiaryProfile?.showRealName ? "Open" : "Protected"} />
      </div>
      <SectionCard title="Verification readiness" description="Final submission creates a verification case with status pending.">
        <div className="flex items-center gap-3">
          <StatusBadge value={user.beneficiaryProfile?.onboardingStatus ?? "DRAFT"} />
          <p className="text-sm text-muted-foreground">
            Continue onboarding to add identity, address, and internal payment placeholders.
          </p>
        </div>
      </SectionCard>
      <EmptyState
        title="Campaign drafting comes next"
        description="Once verification is approved, beneficiaries can create campaigns from this workspace."
        actionLabel="Open onboarding"
        actionHref="/app/beneficiary/onboarding"
      />
    </div>
  );
}
