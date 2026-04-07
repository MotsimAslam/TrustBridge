import { Role } from "@prisma/client";

import { BeneficiaryOnboardingForm } from "@/components/shared/beneficiary-onboarding-form";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { requireRole } from "@/lib/auth/session";

export default async function BeneficiaryOnboardingPage() {
  const user = await requireRole(Role.BENEFICIARY);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Beneficiary onboarding"
        title="Verification intake wizard"
        description="This flow collects personal, identity, address, internal settlement placeholders, and privacy settings before review."
        badge={user.beneficiaryProfile?.onboardingCompleted ? "Submitted" : "Draft"}
      />
      <SectionCard title="Guided intake" description="Draft save and final submission are handled through secure server actions with Zod validation.">
        <BeneficiaryOnboardingForm profile={user.beneficiaryProfile} />
      </SectionCard>
    </div>
  );
}
