import type { Prisma } from "@prisma/client";
import type { AuditActionType, AuditEntityType } from "@prisma/client";
import { headers } from "next/headers";

import { db } from "@/server/db";

export async function createAuditLog(input: {
  actorUserId?: string | null;
  entityType: AuditEntityType;
  entityId: string;
  actionType: AuditActionType;
  description: string;
  metadata?: Record<string, unknown>;
}) {
  const requestHeaders = await headers();

  return db.auditLog.create({
    data: {
      actorUserId: input.actorUserId ?? undefined,
      entityType: input.entityType,
      entityId: input.entityId,
      actionType: input.actionType,
      description: input.description,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      ipAddress:
        requestHeaders.get("x-forwarded-for") ??
        requestHeaders.get("x-real-ip") ??
        undefined,
      userAgent: requestHeaders.get("user-agent") ?? undefined,
    },
  });
}
