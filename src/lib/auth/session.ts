import "server-only";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { createAuditLog } from "@/lib/audit/logger";
import { getDashboardPath, isRole } from "@/lib/auth/roles";
import { db } from "@/server/db";

export async function requireAuth() {
  const session = await auth();

  if (!session.userId) {
    redirect("/unauthorized");
  }

  return session;
}

export async function getCurrentAppUser() {
  const session = await auth();

  if (!session.userId) {
    return null;
  }

  return db.user.findUnique({
    where: { clerkUserId: session.userId },
    include: {
      profile: true,
      beneficiaryProfile: true,
      adminProfile: true,
      notificationPreference: true,
    },
  });
}

export async function ensureAppUser() {
  const session = await requireAuth();
  const clerkIdentity = await currentUser();

  if (!clerkIdentity?.primaryEmailAddress?.emailAddress) {
    redirect("/forbidden");
  }

  const email = clerkIdentity.primaryEmailAddress.emailAddress.toLowerCase();
  const fullName =
    `${clerkIdentity.firstName ?? ""} ${clerkIdentity.lastName ?? ""}`.trim() ||
    email.split("@")[0];
  const displayName =
    clerkIdentity.username ?? clerkIdentity.firstName ?? email.split("@")[0];

  let appUser = await db.user.findUnique({
    where: { clerkUserId: session.userId },
    include: {
      profile: true,
      beneficiaryProfile: true,
      adminProfile: true,
      notificationPreference: true,
    },
  });

  if (!appUser) {
    appUser = await db.user.create({
      data: {
        clerkUserId: session.userId,
        email,
        preferredLanguage: "en",
        verificationLevel: clerkIdentity.emailAddresses.some(
          (address) => address.verification?.status === "verified",
        )
          ? "EMAIL_VERIFIED"
          : "UNVERIFIED",
        profile: {
          create: {
            fullName,
            displayName,
          },
        },
        notificationPreference: {
          create: {},
        },
      },
      include: {
        profile: true,
        beneficiaryProfile: true,
        adminProfile: true,
        notificationPreference: true,
      },
    });

    await createAuditLog({
      actorUserId: appUser.id,
      entityType: "USER",
      entityId: appUser.id,
      actionType: "SIGNUP",
      description: "User account created from Clerk authentication.",
    });
  }

  appUser = await db.user.update({
    where: { id: appUser.id },
    data: {
      email,
      lastSeenAt: new Date(),
      profile: {
        upsert: {
          update: {
            fullName,
            displayName,
          },
          create: {
            fullName,
            displayName,
          },
        },
      },
    },
    include: {
      profile: true,
      beneficiaryProfile: true,
      adminProfile: true,
      notificationPreference: true,
    },
  });

  await createAuditLog({
    actorUserId: appUser.id,
    entityType: "USER",
    entityId: appUser.id,
    actionType: "LOGIN",
    description: "Authenticated session confirmed.",
  });

  return appUser;
}

export async function requireRole(expectedRole: Role) {
  const user = await ensureAppUser();

  if (user.currentRole !== expectedRole) {
    redirect("/forbidden");
  }

  return user;
}

export async function hasRole(role: Role) {
  const user = await getCurrentAppUser();
  return user?.currentRole === role;
}

export async function assignRole(role: Role) {
  const session = await requireAuth();
  const user = await ensureAppUser();

  if (!isRole(role) || role === Role.ADMIN) {
    redirect("/forbidden");
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      currentRole: role,
      roles: {
        create: {
          role,
        },
      },
    },
  });

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(session.userId, {
    publicMetadata: {
      role,
    },
  });

  await createAuditLog({
    actorUserId: updatedUser.id,
    entityType: "USER",
    entityId: updatedUser.id,
    actionType: "ROLE_ASSIGNED",
    description: `Role assigned: ${role}`,
  });

  redirect(getDashboardPath(role, updatedUser.beneficiaryOnboardingComplete));
}
