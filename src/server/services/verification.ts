import { VerificationStatus } from "@prisma/client";

import { db } from "@/server/db";

export async function listVerificationCases(filters?: {
  status?: VerificationStatus | "ALL";
  city?: string;
}) {
  return db.verificationCase.findMany({
    where: {
      status: filters?.status && filters.status !== "ALL" ? filters.status : undefined,
      beneficiary: filters?.city
        ? {
            beneficiaryProfile: {
              city: {
                contains: filters.city,
                mode: "insensitive",
              },
            },
          }
        : undefined,
    },
    include: {
      beneficiary: {
        include: {
          profile: true,
          beneficiaryProfile: true,
        },
      },
      documents: true,
      assignedAdmin: {
        include: { profile: true },
      },
      adminNotes: {
        orderBy: { createdAt: "desc" },
        include: { author: { include: { profile: true } } },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getVerificationCase(caseId: string) {
  return db.verificationCase.findUnique({
    where: { id: caseId },
    include: {
      beneficiary: {
        include: {
          profile: true,
          beneficiaryProfile: true,
        },
      },
      documents: true,
      assignedAdmin: {
        include: { profile: true },
      },
      adminNotes: {
        include: { author: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
