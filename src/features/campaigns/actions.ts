"use server";

import { CampaignStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAuditLog } from "@/lib/audit/logger";
import { ensureAppUser, requireRole } from "@/lib/auth/session";
import { createNotification } from "@/lib/notifications/service";
import { slugify } from "@/lib/utils/slug";
import { campaignSchema, moderationReportSchema } from "@/features/campaigns/schemas";
import { db } from "@/server/db";

function parseDocumentIds(raw: FormDataEntryValue | null) {
  const value = raw?.toString().trim();
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function saveCampaignDraft(formData: FormData) {
  const user = await requireRole("BENEFICIARY");

  if (user.verificationLevel !== "FULLY_APPROVED") {
    redirect("/forbidden");
  }

  const payload = campaignSchema.parse({
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    category: formData.get("category"),
    urgency: formData.get("urgency"),
    targetAmount: formData.get("targetAmount"),
    city: formData.get("city"),
    country: formData.get("country"),
    coverImageKey: formData.get("coverImageKey"),
    supportDocumentIds: parseDocumentIds(formData.get("supportDocumentIds")),
    privacyShowRealName: formData.get("privacyShowRealName") === "on",
    privacyShowExactLocation: formData.get("privacyShowExactLocation") === "on",
  });

  const campaignId = formData.get("campaignId")?.toString();
  const slugBase = slugify(payload.title);
  const slug = campaignId ? undefined : `${slugBase}-${crypto.randomUUID().slice(0, 6)}`;

  const campaign = campaignId
    ? await db.campaign.update({
        where: { id: campaignId },
        data: {
          title: payload.title,
          shortDescription: payload.shortDescription,
          description: payload.description,
          category: payload.category,
          urgency: payload.urgency,
          targetAmount: payload.targetAmount,
          city: payload.city,
          country: payload.country,
          coverImageKey: payload.coverImageKey,
          privacyShowRealName: payload.privacyShowRealName ?? false,
          privacyShowExactLocation: payload.privacyShowExactLocation ?? false,
          status: CampaignStatus.DRAFT,
        },
      })
    : await db.campaign.create({
        data: {
          beneficiaryId: user.id,
          slug: slug!,
          title: payload.title,
          shortDescription: payload.shortDescription,
          description: payload.description,
          category: payload.category,
          urgency: payload.urgency,
          targetAmount: payload.targetAmount,
          city: payload.city,
          country: payload.country,
          coverImageKey: payload.coverImageKey,
          privacyShowRealName: payload.privacyShowRealName ?? false,
          privacyShowExactLocation: payload.privacyShowExactLocation ?? false,
          status: CampaignStatus.DRAFT,
        },
      });

  await db.document.updateMany({
    where: { id: { in: payload.supportDocumentIds }, uploadedByUserId: user.id },
    data: { campaignId: campaign.id },
  });

  await createAuditLog({
    actorUserId: user.id,
    entityType: "CAMPAIGN",
    entityId: campaign.id,
    actionType: campaignId ? "CAMPAIGN_UPDATED" : "CAMPAIGN_CREATED",
    description: campaignId ? "Campaign draft updated." : "Campaign draft created.",
  });

  revalidatePath("/app/beneficiary/campaigns");
}

export async function submitCampaignForReview(formData: FormData) {
  const user = await requireRole("BENEFICIARY");
  const campaignId = formData.get("campaignId")?.toString();

  if (!campaignId) {
    return;
  }

  const campaign = await db.campaign.update({
    where: { id: campaignId, beneficiaryId: user.id },
    data: {
      status: CampaignStatus.SUBMITTED,
      submittedAt: new Date(),
    },
  });

  await createAuditLog({
    actorUserId: user.id,
    entityType: "CAMPAIGN",
    entityId: campaign.id,
    actionType: "CAMPAIGN_SUBMITTED",
    description: "Campaign submitted for review.",
  });

  const admins = await db.user.findMany({ where: { currentRole: "ADMIN" } });

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin.id,
        type: "CAMPAIGN_SUBMITTED",
        title: "Campaign submitted",
        body: `${campaign.title} is ready for review.`,
        href: "/app/admin/reports",
      }),
    ),
  );

  revalidatePath("/app/beneficiary/campaigns");
}

export async function adminUpdateCampaignStatus(formData: FormData) {
  const admin = await requireRole("ADMIN");
  const campaignId = formData.get("campaignId")?.toString();
  const status = formData.get("status")?.toString() as CampaignStatus | null;

  if (!campaignId || !status) {
    return;
  }

  const campaign = await db.campaign.update({
    where: { id: campaignId },
    data: {
      status,
      publishedAt: status === CampaignStatus.PUBLISHED ? new Date() : undefined,
    },
  });

  await createAuditLog({
    actorUserId: admin.id,
    entityType: "CAMPAIGN",
    entityId: campaign.id,
    actionType: "CAMPAIGN_STATUS_CHANGED",
    description: `Campaign status changed to ${status}.`,
  });

  await createNotification({
    userId: campaign.beneficiaryId,
    type:
      status === CampaignStatus.PUBLISHED
        ? "CAMPAIGN_PUBLISHED"
        : status === CampaignStatus.APPROVED
          ? "CAMPAIGN_APPROVED"
          : "CAMPAIGN_REJECTED",
    title: "Campaign status updated",
    body: `${campaign.title} is now ${status.toLowerCase().replaceAll("_", " ")}.`,
    href: "/app/beneficiary/campaigns",
  });

  revalidatePath("/app/admin");
  revalidatePath("/app/beneficiary/campaigns");
  revalidatePath("/campaigns");
}

export async function submitModerationReport(formData: FormData) {
  const user = await ensureAppUser().catch(() => null);
  const campaignId = formData.get("campaignId")?.toString();
  const payload = moderationReportSchema.parse({
    reason: formData.get("reason"),
    details: formData.get("details"),
  });

  if (!campaignId) {
    return;
  }

  const report = await db.moderationReport.create({
    data: {
      campaignId,
      reporterId: user?.id,
      reason: payload.reason,
      details: payload.details || null,
    },
  });

  await createAuditLog({
    actorUserId: user?.id,
    entityType: "REPORT",
    entityId: report.id,
    actionType: "REPORT_SUBMITTED",
    description: "Campaign moderation report submitted.",
  });

  revalidatePath("/campaigns");
}
