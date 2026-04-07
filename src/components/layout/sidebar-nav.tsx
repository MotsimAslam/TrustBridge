import Link from "next/link";
import { Role } from "@prisma/client";
import {
  CircleHelp,
  ClipboardCheck,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Bell,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navByRole: Record<Role, { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  DONOR: [
    { href: "/app/donor", label: "Overview", icon: LayoutDashboard },
    { href: "/app/donor/profile", label: "Profile", icon: UserRound },
    { href: "/app/notifications", label: "Notifications", icon: Bell },
    { href: "/campaigns", label: "Discover campaigns", icon: FolderKanban },
  ],
  BENEFICIARY: [
    { href: "/app/beneficiary", label: "Overview", icon: LayoutDashboard },
    { href: "/app/beneficiary/onboarding", label: "Onboarding", icon: ClipboardCheck },
    { href: "/app/beneficiary/documents", label: "Documents", icon: FileText },
    { href: "/app/beneficiary/campaigns", label: "Campaigns", icon: FolderKanban },
    { href: "/app/notifications", label: "Notifications", icon: Bell },
    { href: "/app/beneficiary/profile", label: "Profile", icon: UserRound },
  ],
  ADMIN: [
    { href: "/app/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/app/admin/verification-cases", label: "Verification cases", icon: ShieldCheck },
    { href: "/app/admin/audit-logs", label: "Audit logs", icon: FileText },
    { href: "/app/admin/reports", label: "Reports", icon: CircleHelp },
    { href: "/app/notifications", label: "Notifications", icon: Bell },
    { href: "/app/admin/profile", label: "Profile", icon: UserRound },
  ],
};

export function SidebarNav({
  role,
  pathname,
}: {
  role: Role;
  pathname: string;
}) {
  return (
    <nav className="space-y-2">
      {navByRole[role].map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
