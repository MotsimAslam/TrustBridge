import { Role } from "@prisma/client";

import { AdminCampaignStatusControls } from "@/components/shared/campaign-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/server/db";

export default async function AdminReportsPage() {
  await requireRole(Role.ADMIN);
  const campaigns = await db.campaign.findMany({
    include: {
      beneficiary: { include: { profile: true } },
      reports: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reporting"
        title="Operational reporting"
        description="Verification trends, campaign distribution, onboarding completion, and moderation reports will connect here."
      />
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="rounded-[1.5rem] border border-border/70 bg-background p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{campaign.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {campaign.beneficiary.profile?.displayName ?? campaign.beneficiary.email} · {campaign.status.replaceAll("_", " ")} · {campaign.reports.length} reports
                </p>
              </div>
              <AdminCampaignStatusControls campaignId={campaign.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
