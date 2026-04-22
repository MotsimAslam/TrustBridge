import { CheckCircle2, CircleOff } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { getClerkStatusLabel } from "@/lib/auth/clerk-config";
import { isStorageConfigured } from "@/lib/storage/adapter";

async function getDatabaseStatus() {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  return true;
}

export default async function InternalStatusPage() {
  const databaseConfigured = await getDatabaseStatus();

  const checks = [
    ["Environment", process.env.NODE_ENV ?? "development"],
    ["Database", databaseConfigured ? "Configured" : "Missing DATABASE_URL"],
    ["Clerk", getClerkStatusLabel()],
    ["Storage", isStorageConfigured() ? "Configured" : "Not configured"],
    ["Email", process.env.RESEND_API_KEY ? "Configured" : "Not configured"],
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="space-y-8">
        <PageHeader
          eyebrow="Internal status"
          title="Operational readiness"
          description="This page helps staging and admin users confirm environment readiness without exposing secrets."
        />
        <SectionCard title="Service checks" description="Foundation health for local and staging environments.">
          <div className="grid gap-4">
            {checks.map(([label, value]) => {
              const ok = !String(value).toLowerCase().includes("missing") && !String(value).toLowerCase().includes("not configured");

              return (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/30 px-4 py-4">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                  {ok ? <CheckCircle2 className="size-5 text-emerald-600" /> : <CircleOff className="size-5 text-amber-600" />}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
