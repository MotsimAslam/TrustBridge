"use server";

import { DocumentReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/audit/logger";
import { ensureAppUser, requireRole } from "@/lib/auth/session";
import { documentUploadSchema } from "@/features/documents/schemas";
import { db } from "@/server/db";

function normalizeFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
}

export async function registerDocument(formData: FormData) {
  const user = await ensureAppUser();
  const input = documentUploadSchema.parse({
    filename: formData.get("filename"),
    mimeType: formData.get("mimeType"),
    sizeBytes: Number(formData.get("sizeBytes")),
    type: formData.get("type"),
  });

  const verificationCaseId = formData.get("verificationCaseId")?.toString();
  const campaignId = formData.get("campaignId")?.toString();
  const id = crypto.randomUUID();
  const normalizedFilename = `${id}-${normalizeFilename(input.filename)}`;

  await db.document.create({
    data: {
      id,
      uploadedByUserId: user.id,
      verificationCaseId: verificationCaseId || undefined,
      campaignId: campaignId || undefined,
      type: input.type,
      storageProvider: process.env.STORAGE_PROVIDER ?? "s3",
      storageBucket: process.env.STORAGE_BUCKET ?? undefined,
      storageKey: `private/${user.id}/${normalizedFilename}`,
      originalFilename: input.filename,
      normalizedFilename,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      reviewStatus: DocumentReviewStatus.UPLOADED,
    },
  });

  await createAuditLog({
    actorUserId: user.id,
    entityType: "DOCUMENT",
    entityId: id,
    actionType: "DOCUMENT_UPLOADED",
    description: `Document registered: ${input.type}`,
  });

  revalidatePath("/app/beneficiary/documents");
  revalidatePath("/app/admin/verification-cases");
}

export async function deleteDocument(formData: FormData) {
  const user = await ensureAppUser();
  const documentId = formData.get("documentId")?.toString();

  if (!documentId) {
    return;
  }

  const document = await db.document.findUnique({ where: { id: documentId } });

  if (!document || document.uploadedByUserId !== user.id || document.reviewStatus !== "UPLOADED") {
    return;
  }

  await db.document.delete({ where: { id: documentId } });

  await createAuditLog({
    actorUserId: user.id,
    entityType: "DOCUMENT",
    entityId: documentId,
    actionType: "DOCUMENT_DELETED",
    description: "Document deleted before review.",
  });

  revalidatePath("/app/beneficiary/documents");
}

export async function reviewDocument(formData: FormData) {
  const admin = await requireRole("ADMIN");
  const documentId = formData.get("documentId")?.toString();
  const reviewStatus = formData.get("reviewStatus")?.toString() as DocumentReviewStatus | null;
  const rejectionReason = formData.get("rejectionReason")?.toString() || null;

  if (!documentId || !reviewStatus) {
    return;
  }

  await db.document.update({
    where: { id: documentId },
    data: {
      reviewStatus,
      reviewedById: admin.id,
      reviewedAt: new Date(),
      rejectionReason:
        reviewStatus === DocumentReviewStatus.REJECTED ||
        reviewStatus === DocumentReviewStatus.NEEDS_RESUBMISSION
          ? rejectionReason
          : null,
    },
  });

  await createAuditLog({
    actorUserId: admin.id,
    entityType: "DOCUMENT",
    entityId: documentId,
    actionType: "DOCUMENT_REVIEWED",
    description: `Document review updated to ${reviewStatus}.`,
  });

  revalidatePath("/app/admin/verification-cases");
}
