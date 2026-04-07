import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { requireRole } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export default async function DonorDashboardPage() {
  const user = await requireRole(Role.DONOR);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Donor dashboard"
        title={`Welcome, ${user.profile?.displayName ?? "donor"}`}
        description="This shell is ready for discovery, saved campaigns, and future contribution history modules."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Verified campaigns" value="12" hint="Public discovery module is connected." />
        <StatCard label="Saved opportunities" value="0" hint="Saved campaign flows arrive in a future module." />
        <StatCard label="Notification readiness" value="On" hint="In-app notifications are wired at the foundation level." />
      </div>
      <SectionCard title="Next donor capabilities">
        <p className="text-sm text-muted-foreground">
          Donation checkout is intentionally disabled in this phase. The donor workspace focuses on trust, discovery, and account readiness.
        </p>
      </SectionCard>
    </div>
  );
}
