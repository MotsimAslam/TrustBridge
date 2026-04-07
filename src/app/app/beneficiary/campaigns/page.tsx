import { Role } from "@prisma/client";

import { BeneficiaryCampaignManager } from "@/components/shared/campaign-form";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/server/db";

export default async function BeneficiaryCampaignsPage() {
  const user = await requireRole(Role.BENEFICIARY);
  const campaigns = await db.campaign.findMany({
    where: { beneficiaryId: user.id },
    include: { documents: true },
    orderBy: { updatedAt: "desc" },
  });
  const availableDocuments = await db.document.findMany({
    where: { uploadedByUserId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Campaign workflow"
        title="Campaign drafts and review pipeline"
        description="Campaign schema and status enums are ready so draft creation and admin review can plug into this workspace cleanly."
      />
      <SectionCard title="Draft manager" description="Only fully approved beneficiaries can submit campaigns for review.">
        <BeneficiaryCampaignManager campaigns={campaigns} availableDocuments={availableDocuments} />
      </SectionCard>
    </div>
  );
}
