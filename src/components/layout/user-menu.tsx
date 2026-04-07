"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { Settings, LogOut, UserCircle2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MenuUser = {
  email: string;
  displayName: string;
};

export function UserMenu({ user }: { user: MenuUser }) {
  const clerk = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-11 rounded-full px-3">
          <Avatar className="size-8">
            <AvatarFallback>{user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden text-left md:block">
            <span className="block text-sm font-medium">{user.displayName}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{user.displayName}</p>
            <p className="text-xs normal-case tracking-normal text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/settings">
            <Settings className="size-4" />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/donor/profile">
            <UserCircle2 className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
            } finally {
              await clerk.signOut({ redirectUrl: "/sign-in" });
            }
          }}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
