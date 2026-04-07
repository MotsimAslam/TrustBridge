"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Role } from "@prisma/client";

import { AppLogo } from "@/components/layout/app-logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <div className="space-y-8">
          <AppLogo />
          <SidebarNav role={role} pathname={pathname} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
