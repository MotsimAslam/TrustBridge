"use server";

import { revalidatePath } from "next/cache";

import { adminNoteSchema, verificationDecisionSchema } from "@/features/admin/schemas";
import { createAuditLog } from "@/lib/audit/logger";
import { requireRole } from "@/lib/auth/session";
import { createNotification } from "@/lib/notifications/service";
import { db } from "@/server/db";

export async function updateVerificationCase(formData: FormData) {
  const admin = await requireRole("ADMIN");

  const payload = verificationDecisionSchema.parse({
    caseId: formData.get("caseId"),
    status: formData.get("status"),
    decisionNotes: formData.get("decisionNotes"),
    assignedAdminId: formData.get("assignedAdminId"),
  });

  const verificationCase = await db.verificationCase.update({
    where: { id: payload.caseId },
    data: {
      status: payload.status,
      decisionNotes: payload.decisionNotes,
      assignedAdminId: payload.assignedAdminId || admin.id,
      resolvedAt: payload.status === "APPROVED" || payload.status === "REJECTED" ? new Date() : null,
    },
    include: { beneficiary: true },
  });

  if (payload.status === "APPROVED") {
    await db.user.update({
      where: { id: verificationCase.beneficiaryId },
      data: { verificationLevel: "FULLY_APPROVED" },
    });
  }

  await db.adminNote.create({
    data: {
      verificationCaseId: verificationCase.id,
      authorId: admin.id,
      body: payload.decisionNotes,
      decisionStatus: payload.status,
    },
  });

  await createAuditLog({
    actorUserId: admin.id,
    entityType: "VERIFICATION_CASE",
    entityId: verificationCase.id,
    actionType: "VERIFICATION_STATUS_CHANGED",
    description: `Verification case updated to ${payload.status}.`,
  });

  await createNotification({
    userId: verificationCase.beneficiaryId,
    type:
      payload.status === "APPROVED"
        ? "VERIFICATION_APPROVED"
        : payload.status === "REJECTED"
          ? "VERIFICATION_REJECTED"
          : "MORE_INFO_REQUESTED",
    title: "Verification update",
    body: `Your verification case is now ${payload.status.toLowerCase().replaceAll("_", " ")}.`,
    href: "/app/beneficiary",
  });

  revalidatePath("/app/admin/verification-cases");
  revalidatePath(`/app/admin/verification-cases/${verificationCase.id}`);
  revalidatePath("/app/beneficiary");
}

export async function addAdminNote(formData: FormData) {
  const admin = await requireRole("ADMIN");
  const payload = adminNoteSchema.parse({
    caseId: formData.get("caseId"),
    body: formData.get("body"),
  });

  const note = await db.adminNote.create({
    data: {
      verificationCaseId: payload.caseId,
      authorId: admin.id,
      body: payload.body,
    },
  });

  await createAuditLog({
    actorUserId: admin.id,
    entityType: "VERIFICATION_CASE",
    entityId: payload.caseId,
    actionType: "VERIFICATION_STATUS_CHANGED",
    description: "Admin note added to verification case.",
    metadata: { noteId: note.id },
  });

  revalidatePath(`/app/admin/verification-cases/${payload.caseId}`);
}
