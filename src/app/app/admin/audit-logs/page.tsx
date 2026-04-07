import { Role } from "@prisma/client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/server/db";

export default async function AuditLogsPage() {
  await requireRole(Role.ADMIN);
  const logs = await db.auditLog.findMany({
    include: { actor: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Audit trail"
        title="Audit logs"
        description="Human-readable audit entries make auth, onboarding, verification, and future campaign events traceable."
      />
      <SectionCard title="Audit viewer foundation">
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl border border-border/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{log.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.entityType} · {log.actionType} · {log.actor?.profile?.displayName ?? "System"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{log.createdAt.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
