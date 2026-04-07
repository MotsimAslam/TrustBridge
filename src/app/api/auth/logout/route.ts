import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { createAuditLog } from "@/lib/audit/logger";
import { db } from "@/server/db";

export async function POST() {
  const session = await auth();

  if (!session.userId) {
    return NextResponse.json({ ok: true });
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: session.userId },
  });

  if (user) {
    await createAuditLog({
      actorUserId: user.id,
      entityType: "USER",
      entityId: user.id,
      actionType: "LOGOUT",
      description: "User initiated sign out.",
    });
  }

  return NextResponse.json({ ok: true });
}
