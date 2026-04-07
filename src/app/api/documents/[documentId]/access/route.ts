import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth/session";
import { getSignedReadUrl } from "@/lib/storage/adapter";
import { db } from "@/server/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const session = await requireAuth();
  const { documentId } = await params;

  const user = await db.user.findUnique({
    where: { clerkUserId: session.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = await db.document.findUnique({
    where: { id: documentId },
    include: {
      verificationCase: true,
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const canAccess =
    document.uploadedByUserId === user.id ||
    user.currentRole === "ADMIN" ||
    document.verificationCase?.beneficiaryId === user.id;

  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.STORAGE_BUCKET) {
    return NextResponse.json({
      mode: "metadata-only",
      storageKey: document.storageKey,
      message: "Storage provider is not configured yet. Metadata access is available, file delivery will activate once bucket credentials are provided.",
    });
  }

  const signedUrl = await getSignedReadUrl(document.storageKey);

  return NextResponse.json({
    mode: "signed-url",
    signedUrl,
    expiresInSeconds: 120,
  });
}
