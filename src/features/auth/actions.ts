"use server";

import { Role } from "@prisma/client";

import { assignRole } from "@/lib/auth/session";

export async function chooseRole(formData: FormData) {
  const role = formData.get("role");

  if (role === Role.DONOR || role === Role.BENEFICIARY) {
    await assignRole(role);
  }
}
