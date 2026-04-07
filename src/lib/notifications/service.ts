import { NotificationType } from "@prisma/client";

import { createAuditLog } from "@/lib/audit/logger";
import { sendLifecycleEmail } from "@/lib/email/resend";
import { renderLifecycleEmail } from "@/lib/email/templates";
import { db } from "@/server/db";

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
}) {
  const user = await db.user.findUnique({
    where: { id: input.userId },
    include: { notificationPreference: true },
  });

  const notification = await db.notification.create({
    data: input,
  });

  if (user?.notificationPreference?.emailEnabled) {
    await sendLifecycleEmail({
      to: user.email,
      subject: input.title,
      html: renderLifecycleEmail({
        title: input.title,
        message: input.body,
        ctaLabel: input.href ? "Open TrustBridge" : undefined,
        ctaHref: input.href
          ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${input.href}`
          : undefined,
      }),
    });
  }

  await createAuditLog({
    actorUserId: input.userId,
    entityType: "NOTIFICATION",
    entityId: notification.id,
    actionType: "NOTIFICATION_CREATED",
    description: `Notification created: ${input.title}`,
    metadata: { type: input.type },
  });

  return notification;
}
