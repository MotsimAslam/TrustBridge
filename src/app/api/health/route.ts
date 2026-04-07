import { NextResponse } from "next/server";

import { db } from "@/server/db";

export async function GET() {
  let database = "not_configured";

  if (process.env.DATABASE_URL) {
    try {
      await db.$queryRaw`SELECT 1`;
      database = "ok";
    } catch {
      database = "error";
    }
  }

  return NextResponse.json({
    status: "ok",
    service: "trustbridge",
    timestamp: new Date().toISOString(),
    database,
    clerkConfigured: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
    storageConfigured: Boolean(process.env.STORAGE_BUCKET),
  });
}
