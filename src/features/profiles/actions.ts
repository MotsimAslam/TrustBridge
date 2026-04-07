"use server";

import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/audit/logger";
import { ensureAppUser } from "@/lib/auth/session";
import { profileSchema } from "@/features/profiles/schemas";
import { db } from "@/server/db";

export async function updateProfile(formData: FormData) {
  const user = await ensureAppUser();

  const payload = profileSchema.parse({
    fullName: formData.get("fullName"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio"),
    country: formData.get("country"),
    city: formData.get("city"),
    preferredLanguage: formData.get("preferredLanguage"),
    showRealName: formData.get("showRealName") === "on",
    showProfilePhoto: formData.get("showProfilePhoto") === "on",
    showExactLocation: formData.get("showExactLocation") === "on",
    allowDirectContact: formData.get("allowDirectContact") === "on",
    publicDonationHistoryEnabled:
      formData.get("publicDonationHistoryEnabled") === "on",
    preferredCategories: formData.getAll("preferredCategories"),
  });

  await db.user.update({
    where: { id: user.id },
    data: {
      preferredLanguage: payload.preferredLanguage,
      profile: {
        upsert: {
          update: {
            fullName: payload.fullName,
            displayName: payload.displayName,
            bio: payload.bio || null,
            country: payload.country || null,
            city: payload.city || null,
            preferredCategories: payload.preferredCategories ?? [],
            publicDonationHistoryEnabled:
              payload.publicDonationHistoryEnabled ?? false,
            completionPercentage: [
              payload.fullName,
              payload.displayName,
              payload.country,
              payload.city,
            ].filter(Boolean).length * 25,
          },
          create: {
            fullName: payload.fullName,
            displayName: payload.displayName,
            bio: payload.bio || null,
            country: payload.country || null,
            city: payload.city || null,
            preferredCategories: payload.preferredCategories ?? [],
            publicDonationHistoryEnabled:
              payload.publicDonationHistoryEnabled ?? false,
            completionPercentage: 50,
          },
        },
      },
      beneficiaryProfile:
        user.currentRole === "BENEFICIARY"
          ? {
              upsert: {
                update: {
                  showRealName: payload.showRealName ?? false,
                  showProfilePhoto: payload.showProfilePhoto ?? false,
                  showExactLocation: payload.showExactLocation ?? false,
                  allowDirectContact: payload.allowDirectContact ?? false,
                },
                create: {
                  showRealName: payload.showRealName ?? false,
                  showProfilePhoto: payload.showProfilePhoto ?? false,
                  showExactLocation: payload.showExactLocation ?? false,
                  allowDirectContact: payload.allowDirectContact ?? false,
                },
              },
            }
          : undefined,
    },
  });

  await createAuditLog({
    actorUserId: user.id,
    entityType: "PROFILE",
    entityId: user.profile?.id ?? user.id,
    actionType: "PROFILE_UPDATED",
    description: "User profile updated.",
  });

  revalidatePath("/app");
  revalidatePath("/app/settings");
  revalidatePath("/app/donor/profile");
  revalidatePath("/app/beneficiary/profile");
  revalidatePath("/app/admin/profile");
}
