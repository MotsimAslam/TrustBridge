import { Role } from "@prisma/client";

import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/shared/profile-form";
import { SectionCard } from "@/components/shared/section-card";
import { requireRole } from "@/lib/auth/session";

export default async function BeneficiaryProfilePage() {
  const user = await requireRole(Role.BENEFICIARY);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Beneficiary profile"
        title="Manage your public-safe identity"
        description="Privacy settings here control what future public campaign surfaces are allowed to reveal."
      />
      <SectionCard title="Profile and privacy">
        <ProfileForm user={user} />
      </SectionCard>
    </div>
  );
}
