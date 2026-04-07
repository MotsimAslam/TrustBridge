import { Role } from "@prisma/client";

export const APP_ROLES = [Role.DONOR, Role.BENEFICIARY, Role.ADMIN] as const;

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && APP_ROLES.includes(value as Role);
}

export function getDashboardPath(role: Role, onboardingComplete?: boolean) {
  if (role === Role.BENEFICIARY && !onboardingComplete) {
    return "/app/beneficiary/onboarding";
  }

  if (role === Role.ADMIN) {
    return "/app/admin";
  }

  if (role === Role.BENEFICIARY) {
    return "/app/beneficiary";
  }

  return "/app/donor";
}
