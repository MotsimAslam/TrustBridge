import { PrismaClient, Role, VerificationLevel, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const donor = await prisma.user.upsert({
    where: { email: "donor@trustbridge.local" },
    update: {},
    create: {
      clerkUserId: "seed_donor_clerk",
      email: "donor@trustbridge.local",
      currentRole: Role.DONOR,
      preferredLanguage: "en",
      verificationLevel: VerificationLevel.EMAIL_VERIFIED,
      onboardingCompleted: true,
      roles: { create: { role: Role.DONOR } },
      profile: {
        create: {
          fullName: "Demo Donor",
          displayName: "Aisha Donor",
          city: "Lahore",
          country: "Pakistan",
          preferredCategories: ["health", "education"],
          completionPercentage: 80,
        },
      },
      notificationPreference: { create: {} },
    },
  });

  const beneficiary = await prisma.user.upsert({
    where: { email: "beneficiary@trustbridge.local" },
    update: {},
    create: {
      clerkUserId: "seed_beneficiary_clerk",
      email: "beneficiary@trustbridge.local",
      currentRole: Role.BENEFICIARY,
      preferredLanguage: "en",
      verificationLevel: VerificationLevel.IDENTITY_REVIEWED,
      onboardingCompleted: true,
      beneficiaryOnboardingComplete: true,
      roles: { create: { role: Role.BENEFICIARY } },
      profile: {
        create: {
          fullName: "Demo Beneficiary",
          displayName: "Family Support Case",
          city: "Karachi",
          country: "Pakistan",
          completionPercentage: 92,
        },
      },
      beneficiaryProfile: {
        create: {
          legalFullName: "Demo Beneficiary",
          phoneNumber: "+92-300-0000000",
          addressLine1: "Street 1",
          city: "Karachi",
          provinceOrState: "Sindh",
          country: "Pakistan",
          onboardingStatus: VerificationStatus.APPROVED,
          onboardingCompleted: true,
        },
      },
      notificationPreference: { create: {} },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@trustbridge.local" },
    update: {},
    create: {
      clerkUserId: "seed_admin_clerk",
      email: "admin@trustbridge.local",
      currentRole: Role.ADMIN,
      preferredLanguage: "en",
      verificationLevel: VerificationLevel.FULLY_APPROVED,
      onboardingCompleted: true,
      roles: { create: { role: Role.ADMIN } },
      profile: {
        create: {
          fullName: "Platform Admin",
          displayName: "Admin Team",
          city: "Islamabad",
          country: "Pakistan",
          completionPercentage: 100,
        },
      },
      adminProfile: {
        create: {
          title: "Operations Lead",
          department: "Verification",
        },
      },
      notificationPreference: { create: {} },
    },
  });

  await prisma.verificationCase.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      beneficiaryId: beneficiary.id,
      assignedAdminId: admin.id,
      status: VerificationStatus.IN_REVIEW,
      submissionNotes: "Seed verification case for internal demos.",
      documents: {
        create: {
          uploadedByUserId: beneficiary.id,
          reviewedById: admin.id,
          type: "NATIONAL_ID_FRONT",
          storageKey: "seed/documents/id-front.pdf",
          originalFilename: "id-front.pdf",
          normalizedFilename: "0001-id-front.pdf",
          mimeType: "application/pdf",
          sizeBytes: 184023,
          reviewStatus: "UNDER_REVIEW",
        },
      },
    },
  });

  await prisma.campaign.upsert({
    where: { slug: "medical-support-demo" },
    update: {},
    create: {
      beneficiaryId: beneficiary.id,
      title: "Medical Support for Emergency Treatment",
      slug: "medical-support-demo",
      shortDescription: "A demo campaign showing the TrustBridge publication shell.",
      description:
        "This seeded campaign exists so the public listing, donor dashboard, and admin reporting pages have realistic foundation data during local setup.",
      category: "Health",
      urgency: "High",
      targetAmount: "250000",
      city: "Karachi",
      country: "Pakistan",
      status: "PUBLISHED",
      updates: {
        create: {
          authorId: beneficiary.id,
          title: "Initial verification complete",
          content: "TrustBridge created this update as seeded demo content.",
        },
      },
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorUserId: donor.id,
        entityType: "USER",
        entityId: donor.id,
        actionType: "SIGNUP",
        description: "Seed donor account created.",
      },
      {
        actorUserId: admin.id,
        entityType: "VERIFICATION_CASE",
        entityId: "00000000-0000-0000-0000-000000000001",
        actionType: "VERIFICATION_STATUS_CHANGED",
        description: "Seed verification case placed into review.",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
