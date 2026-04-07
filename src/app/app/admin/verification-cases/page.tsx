import Link from "next/link";
import { Role, VerificationStatus } from "@prisma/client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { listVerificationCases } from "@/server/services/verification";

export default async function VerificationCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; city?: string }>;
}) {
  await requireRole(Role.ADMIN);
  const params = await searchParams;
  const rows = await listVerificationCases({
    status: (params.status as VerificationStatus | "ALL" | undefined) ?? "ALL",
    city: params.city,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verification cases"
        title="Admin verification queue"
        description="Filters, notes, assignment, and decision rationale attach to these cases in the admin review module."
      />
      <SectionCard title="Case list">
        <form className="mb-6 grid gap-3 md:grid-cols-[180px_1fr_auto]">
          <select name="status" defaultValue={params.status ?? "ALL"} className="h-11 rounded-2xl border border-input bg-background px-4 text-sm">
            <option value="ALL">All statuses</option>
            {Object.values(VerificationStatus).map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <input name="city" defaultValue={params.city ?? ""} placeholder="Filter by city" className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" />
          <Button type="submit" variant="outline">Apply filters</Button>
        </form>
        <div className="overflow-hidden rounded-[1.5rem] border border-border/70">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Case ID</th>
                <th className="px-4 py-3 font-medium">Beneficiary</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Docs</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border/70">
                  <td className="px-4 py-4">{row.id.slice(0, 8)}</td>
                  <td className="px-4 py-4">
                    {row.beneficiary.beneficiaryProfile?.legalFullName ?? row.beneficiary.profile?.fullName ?? row.beneficiary.email}
                  </td>
                  <td className="px-4 py-4">
                    {row.beneficiary.beneficiaryProfile?.city ?? "Unknown"},{" "}
                    {row.beneficiary.beneficiaryProfile?.country ?? "Unknown"}
                  </td>
                  <td className="px-4 py-4">{row.submittedAt.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-4">{row.documents.length} docs</td>
                  <td className="px-4 py-4"><StatusBadge value={row.status} /></td>
                  <td className="px-4 py-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/app/admin/verification-cases/${row.id}`}>Open</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
