import { redirect } from "next/navigation";

import { chooseRole } from "@/features/auth/actions";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { ensureAppUser } from "@/lib/auth/session";

export default async function SelectRolePage() {
  const user = await ensureAppUser();

  if (user.currentRole) {
    redirect("/app");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Role onboarding"
        title="Choose how you will use TrustBridge"
        description="Admin access cannot be self-assigned. Start as a donor or beneficiary and the platform will route you to the correct workspace."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Donor workspace" description="Browse verified campaigns, track future contributions, and manage donor preferences.">
          <form action={chooseRole}>
            <input type="hidden" name="role" value="DONOR" />
            <Button type="submit">Continue as donor</Button>
          </form>
        </SectionCard>
        <SectionCard title="Beneficiary workspace" description="Complete onboarding, manage verification documents, and prepare campaigns for review.">
          <form action={chooseRole}>
            <input type="hidden" name="role" value="BENEFICIARY" />
            <Button type="submit">Continue as beneficiary</Button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
