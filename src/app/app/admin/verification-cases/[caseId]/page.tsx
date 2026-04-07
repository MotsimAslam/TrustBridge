import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { VerificationCasePanel } from "@/components/shared/verification-case-panel";
import { requireRole } from "@/lib/auth/session";
import { getVerificationCase } from "@/server/services/verification";

export default async function VerificationCaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  await requireRole(Role.ADMIN);
  const { caseId } = await params;
  const verificationCase = await getVerificationCase(caseId);

  if (!verificationCase) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Case detail"
        title="Verification case workspace"
        description="Beneficiary info, privacy settings, uploaded documents, notes, and decision history all connect here."
      />
      <VerificationCasePanel verificationCase={verificationCase} />
    </div>
  );
}
