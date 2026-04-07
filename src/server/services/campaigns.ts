import { CampaignStatus } from "@prisma/client";

import { getMaskedBeneficiaryLocation, getMaskedBeneficiaryName } from "@/features/shared/privacy";
import { db } from "@/server/db";
import { withDatabaseFallback } from "@/server/services/safe-db";

export async function listPublicCampaigns() {
  const campaigns = await withDatabaseFallback(
    () =>
      db.campaign.findMany({
        where: { status: CampaignStatus.PUBLISHED },
        include: {
          beneficiary: {
            include: {
              beneficiaryProfile: true,
              profile: true,
            },
          },
          updates: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          reports: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      }),
    [],
  );

  return campaigns.map((campaign) => {
    const privacy = campaign.beneficiary.beneficiaryProfile;
    return {
      ...campaign,
      safeBeneficiaryName: getMaskedBeneficiaryName({
        fullName: privacy?.legalFullName ?? campaign.beneficiary.profile?.fullName,
        showRealName: privacy?.showRealName,
      }),
      safeLocation: getMaskedBeneficiaryLocation({
        city: campaign.city ?? privacy?.city,
        country: campaign.country ?? privacy?.country,
        showExactLocation: privacy?.showExactLocation,
      }),
    };
  });
}

export async function getPublicCampaignBySlug(slug: string) {
  const campaign = await withDatabaseFallback(
    () =>
      db.campaign.findUnique({
        where: { slug },
        include: {
          beneficiary: {
            include: {
              beneficiaryProfile: true,
              profile: true,
            },
          },
          updates: {
            include: { author: { include: { profile: true } } },
            orderBy: { createdAt: "desc" },
          },
          documents: true,
          reports: true,
        },
      }),
    null,
  );

  if (!campaign || campaign.status !== CampaignStatus.PUBLISHED) {
    return null;
  }

  const privacy = campaign.beneficiary.beneficiaryProfile;

  return {
    ...campaign,
    safeBeneficiaryName: getMaskedBeneficiaryName({
      fullName: privacy?.legalFullName ?? campaign.beneficiary.profile?.fullName,
      showRealName: privacy?.showRealName,
    }),
    safeLocation: getMaskedBeneficiaryLocation({
      city: campaign.city ?? privacy?.city,
      country: campaign.country ?? privacy?.country,
      showExactLocation: privacy?.showExactLocation,
    }),
  };
}
