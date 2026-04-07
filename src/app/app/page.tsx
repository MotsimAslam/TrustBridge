import { redirect } from "next/navigation";

import { ensureAppUser } from "@/lib/auth/session";
import { getDashboardPath } from "@/lib/auth/roles";

export default async function AppIndexPage() {
  const user = await ensureAppUser();

  if (!user.currentRole) {
    redirect("/app/select-role");
  }

  redirect(getDashboardPath(user.currentRole, user.beneficiaryOnboardingComplete));
}
