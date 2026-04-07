"use server";

import { VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAuditLog } from "@/lib/audit/logger";
import { ensureAppUser, requireRole } from "@/lib/auth/session";
import {
  beneficiaryOnboardingSchema,
  type BeneficiaryOnboardingInput,
} from "@/features/onboarding/schemas";
import { db } from "@/server/db";

async function persistOnboarding(
  userId: string,
  payload: BeneficiaryOnboardingInput,
  submitted: boolean,
) {
  const beneficiaryProfile = await db.beneficiaryProfile.upsert({
    where: { userId },
    update: {
      ...payload,
      dateOfBirth: new Date(payload.dateOfBirth),
      onboardingCompleted: submitted,
      onboardingStatus: submitted ? VerificationStatus.PENDING : VerificationStatus.DRAFT,
      submittedAt: submitted ? new Date() : undefined,
    },
    create: {
      userId,
      ...payload,
      dateOfBirth: new Date(payload.dateOfBirth),
      onboardingCompleted: submitted,
      onboardingStatus: submitted ? VerificationStatus.PENDING : VerificationStatus.DRAFT,
      submittedAt: submitted ? new Date() : undefined,
    },
  });

  await db.user.update({
    where: { id: userId },
    data: {
      beneficiaryOnboardingComplete: submitted,
      onboardingCompleted: submitted,
    },
  });

  return beneficiaryProfile;
}

export async function saveBeneficiaryDraft(formData: FormData) {
  const user = await requireRole("BENEFICIARY");
  const payload = beneficiaryOnboardingSchema.parse({
    legalFullName: formData.get("legalFullName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    nationalIdNumber: formData.get("nationalIdNumber"),
    phoneNumber: formData.get("phoneNumber"),
    addressLine1: formData.get("addressLine1"),
    city: formData.get("city"),
    provinceOrState: formData.get("provinceOrState"),
    country: formData.get("country"),
    nearbyLandmark: formData.get("nearbyLandmark"),
    bankName: formData.get("bankName"),
    accountTitle: formData.get("accountTitle"),
    accountNumberMasked: formData.get("accountNumberMasked"),
    mobileWalletType: formData.get("mobileWalletType"),
    showRealName: formData.get("showRealName") === "on",
    showProfilePhoto: formData.get("showProfilePhoto") === "on",
    showExactLocation: formData.get("showExactLocation") === "on",
    allowDirectContact: formData.get("allowDirectContact") === "on",
  });

  await persistOnboarding(user.id, payload, false);

  await createAuditLog({
    actorUserId: user.id,
    entityType: "BENEFICIARY_PROFILE",
    entityId: user.id,
    actionType: "ONBOARDING_DRAFT_SAVED",
    description: "Beneficiary onboarding draft saved.",
  });

  revalidatePath("/app/beneficiary/onboarding");
}

export async function submitBeneficiaryOnboarding(formData: FormData) {
  const user = await ensureAppUser();

  if (user.currentRole !== "BENEFICIARY") {
    redirect("/forbidden");
  }

  const payload = beneficiaryOnboardingSchema.parse({
    legalFullName: formData.get("legalFullName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    nationalIdNumber: formData.get("nationalIdNumber"),
    phoneNumber: formData.get("phoneNumber"),
    addressLine1: formData.get("addressLine1"),
    city: formData.get("city"),
    provinceOrState: formData.get("provinceOrState"),
    country: formData.get("country"),
    nearbyLandmark: formData.get("nearbyLandmark"),
    bankName: formData.get("bankName"),
    accountTitle: formData.get("accountTitle"),
    accountNumberMasked: formData.get("accountNumberMasked"),
    mobileWalletType: formData.get("mobileWalletType"),
    showRealName: formData.get("showRealName") === "on",
    showProfilePhoto: formData.get("showProfilePhoto") === "on",
    showExactLocation: formData.get("showExactLocation") === "on",
    allowDirectContact: formData.get("allowDirectContact") === "on",
  });

  await persistOnboarding(user.id, payload, true);

  const verificationCase = await db.verificationCase.create({
    data: {
      beneficiaryId: user.id,
      status: VerificationStatus.PENDING,
      submissionNotes: "Created from beneficiary onboarding submission.",
    },
  });

  await createAuditLog({
    actorUserId: user.id,
    entityType: "VERIFICATION_CASE",
    entityId: verificationCase.id,
    actionType: "ONBOARDING_SUBMITTED",
    description: "Beneficiary onboarding submitted for review.",
  });

  revalidatePath("/app/beneficiary");
  redirect("/app/beneficiary");
}
