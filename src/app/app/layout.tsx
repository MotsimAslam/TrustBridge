import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentLocale } from "@/lib/i18n/locale";
import { ensureAppUser } from "@/lib/auth/session";

export default async function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getCurrentLocale();
  const user = await ensureAppUser();

  if (!user.currentRole) {
    redirect("/app/select-role");
  }

  return (
    <AppShell
      role={user.currentRole}
      locale={locale}
      user={{
        email: user.email,
        displayName: user.profile?.displayName ?? user.profile?.fullName ?? user.email,
      }}
    >
      {children}
    </AppShell>
  );
}
