"use client";

import { usePathname } from "next/navigation";
import { Role } from "@prisma/client";

import { AppLogo } from "@/components/layout/app-logo";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import type { AppLocale } from "@/config/app";

type ShellUser = {
  displayName: string;
  email: string;
};

export function AppShell({
  role,
  locale,
  user,
  children,
}: {
  role: Role;
  locale: AppLocale;
  user: ShellUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-0">
        <aside className="hidden w-80 flex-col border-r border-border/70 bg-card px-6 py-6 lg:flex">
          <AppLogo />
          <div className="mt-10 flex-1">
            <SidebarNav role={role} pathname={pathname} />
          </div>
          <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-muted/40 p-4">
            <p className="text-sm font-medium">Foundation milestone</p>
            <p className="text-sm text-muted-foreground">
              Module 1 and Module 2 are production-ready foundations. Future modules connect into this shell.
            </p>
          </div>
        </aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 px-4 py-4 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MobileNav role={role} />
                <div className="space-y-1">
                  <Breadcrumbs />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LocaleSwitcher locale={locale} />
                <ThemeToggle />
                <UserMenu user={user} />
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
