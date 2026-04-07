import { Role } from "@prisma/client";

import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/shared/profile-form";
import { SectionCard } from "@/components/shared/section-card";
import { requireRole } from "@/lib/auth/session";

export default async function AdminProfilePage() {
  const user = await requireRole(Role.ADMIN);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin profile"
        title="Admin account settings"
        description="Admin profile fields are stored in Prisma and ready for future MFA and team-management extensions."
      />
      <SectionCard title="Profile settings">
        <ProfileForm user={user} />
      </SectionCard>
    </div>
  );
}
