import { CampaignStatus, VerificationStatus } from "@prisma/client";

import { db } from "@/server/db";
import { withDatabaseFallback } from "@/server/services/safe-db";

export async function getAdminOverviewStats() {
  const [totalBeneficiaries, pendingVerificationCases, approvedBeneficiaries, draftCampaigns, submittedCampaigns, publishedCampaigns, rejectedCampaigns, reportsSubmitted] =
    await withDatabaseFallback(
      () =>
        Promise.all([
          db.user.count({ where: { currentRole: "BENEFICIARY" } }),
          db.verificationCase.count({
            where: { status: { in: [VerificationStatus.PENDING, VerificationStatus.IN_REVIEW] } },
          }),
          db.user.count({ where: { currentRole: "BENEFICIARY", verificationLevel: "FULLY_APPROVED" } }),
          db.campaign.count({ where: { status: CampaignStatus.DRAFT } }),
          db.campaign.count({ where: { status: CampaignStatus.SUBMITTED } }),
          db.campaign.count({ where: { status: CampaignStatus.PUBLISHED } }),
          db.campaign.count({ where: { status: CampaignStatus.REJECTED } }),
          db.moderationReport.count(),
        ]),
      [0, 0, 0, 0, 0, 0, 0, 0],
    );

  return {
    totalBeneficiaries,
    pendingVerificationCases,
    approvedBeneficiaries,
    draftCampaigns,
    submittedCampaigns,
    publishedCampaigns,
    rejectedCampaigns,
    reportsSubmitted,
  };
}

export async function getVerificationTrend() {
  const cases = await withDatabaseFallback(
    () =>
      db.verificationCase.findMany({
        orderBy: { submittedAt: "asc" },
        select: { submittedAt: true, status: true },
      }),
    [],
  );

  return cases.reduce<Record<string, { submitted: number; approved: number }>>((acc, item) => {
    const key = item.submittedAt.toISOString().slice(0, 10);
    acc[key] ??= { submitted: 0, approved: 0 };
    acc[key].submitted += 1;
    if (item.status === VerificationStatus.APPROVED) {
      acc[key].approved += 1;
    }
    return acc;
  }, {});
}

export async function getCampaignStatusDistribution() {
  const campaigns = await withDatabaseFallback(
    () =>
      db.campaign.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    [],
  );

  return campaigns.map((entry) => ({
    status: entry.status,
    count: entry._count.status,
  }));
}

export async function getOnboardingCompletionRate() {
  const [total, completed] = await withDatabaseFallback(
    () =>
      Promise.all([
        db.user.count({ where: { currentRole: "BENEFICIARY" } }),
        db.user.count({
          where: { currentRole: "BENEFICIARY", beneficiaryOnboardingComplete: true },
        }),
      ]),
    [0, 0],
  );

  return {
    total,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
