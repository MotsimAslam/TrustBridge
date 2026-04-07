"use server";

import { revalidatePath } from "next/cache";

import { ensureAppUser } from "@/lib/auth/session";
import { markNotificationRead } from "@/server/services/notifications";
import { notificationPreferenceSchema } from "@/features/notifications/schemas";
import { db } from "@/server/db";

export async function updateNotificationPreferences(formData: FormData) {
  const user = await ensureAppUser();

  const payload = notificationPreferenceSchema.parse({
    inAppEnabled: formData.get("inAppEnabled") === "on",
    emailEnabled: formData.get("emailEnabled") === "on",
    securityEmailsOnly: formData.get("securityEmailsOnly") === "on",
    marketingEnabled: formData.get("marketingEnabled") === "on",
  });

  await db.notificationPreference.upsert({
    where: { userId: user.id },
    update: payload,
    create: {
      userId: user.id,
      ...payload,
    },
  });

  revalidatePath("/app/notifications");
  revalidatePath("/app/settings");
}

export async function readNotification(formData: FormData) {
  const user = await ensureAppUser();
  const notificationId = formData.get("notificationId")?.toString();

  if (!notificationId) {
    return;
  }

  await markNotificationRead(notificationId, user.id);
  revalidatePath("/app/notifications");
}
