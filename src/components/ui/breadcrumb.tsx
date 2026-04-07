"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const labelMap: Record<string, string> = {
  app: "App",
  donor: "Donor",
  beneficiary: "Beneficiary",
  admin: "Admin",
  onboarding: "Onboarding",
  profile: "Profile",
  settings: "Settings",
  campaigns: "Campaigns",
  documents: "Documents",
  notifications: "Notifications",
  "verification-cases": "Verification cases",
  "audit-logs": "Audit logs",
  reports: "Reports",
  "select-role": "Choose role",
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
      <Link href="/" className="transition hover:text-foreground">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = labelMap[segment] ?? segment.replace(/-/g, " ");

        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="size-4" />
            {isLast ? (
              <span className="font-medium capitalize text-foreground">{label}</span>
            ) : (
              <Link href={href} className="capitalize transition hover:text-foreground">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
