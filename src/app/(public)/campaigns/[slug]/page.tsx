import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModerationReportForm } from "@/components/shared/campaign-form";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPublicCampaignBySlug } from "@/server/services/campaigns";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getPublicCampaignBySlug(slug);

  if (!campaign) {
    return { title: "Campaign not found" };
  }

  return {
    title: campaign.title,
    description: campaign.shortDescription ?? campaign.description ?? undefined,
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getPublicCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Campaign detail"
          title={campaign.title}
          description={campaign.description ?? ""}
          badge={campaign.status.replaceAll("_", " ")}
        />
        <div className="h-[28rem] rounded-[2rem] bg-gradient-to-br from-primary/15 via-background to-secondary" />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard title="Campaign story" description="Full story, breakdown, and translations connect here in later modules.">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>{campaign.description}</p>
              <p>Beneficiary: {campaign.safeBeneficiaryName}</p>
              <p>Location: {campaign.safeLocation}</p>
              <p>Category: {campaign.category} · Urgency: {campaign.urgency}</p>
              <p>Target amount: PKR {campaign.targetAmount?.toString() ?? "0"}</p>
            </div>
          </SectionCard>
          <div className="space-y-6">
            <SectionCard title="Verification state">
              <div className="flex items-center gap-3">
                <StatusBadge value={campaign.beneficiary.verificationLevel} />
                <p className="text-sm text-muted-foreground">Identity reviewed by TrustBridge admin team.</p>
              </div>
            </SectionCard>
            <SectionCard title="Donations" description="Future-ready call-to-action architecture without checkout in this phase.">
              <StatusBadge value="COMING_SOON" />
            </SectionCard>
            <SectionCard title="Campaign updates">
              <div className="space-y-4">
                {campaign.updates.map((update) => (
                  <div key={update.id} className="rounded-2xl border border-border/70 p-4">
                    <p className="font-medium">{update.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{update.content}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Report this campaign" description="Reports are stored for admin moderation review.">
              <ModerationReportForm campaignId={campaign.id} />
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
