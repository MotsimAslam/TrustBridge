import { Role } from "@prisma/client";

import { DocumentCenter } from "@/components/shared/document-center";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/server/db";

export default async function BeneficiaryDocumentsPage() {
  const user = await requireRole(Role.BENEFICIARY);
  const verificationCase = await db.verificationCase.findFirst({
    where: { beneficiaryId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const documents = await db.document.findMany({
    where: { uploadedByUserId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Document center"
        title="Secure document center"
        description="Storage, signed access, and document workflow contracts are wired so upload processing can connect in the next module."
      />
      <SectionCard title="Private storage architecture" description="Raw public URLs are never exposed. Signed read and upload flows live behind the storage adapter.">
        <DocumentCenter documents={documents} verificationCaseId={verificationCase?.id} />
      </SectionCard>
    </div>
  );
}
