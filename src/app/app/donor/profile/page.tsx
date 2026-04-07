import { Role } from "@prisma/client";

import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/shared/profile-form";
import { SectionCard } from "@/components/shared/section-card";
import { requireRole } from "@/lib/auth/session";

export default async function DonorProfilePage() {
  const user = await requireRole(Role.DONOR);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Donor profile"
        title="Manage your donor identity"
        description="Keep donor-facing account details and future donation preferences up to date."
      />
      <SectionCard title="Profile settings">
        <ProfileForm user={user} />
      </SectionCard>
    </div>
  );
}
