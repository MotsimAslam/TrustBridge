"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Sheet = Dialog;
export const SheetTrigger = DialogTrigger;

export function SheetContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogContent
      className={cn(
        "left-auto right-0 top-0 h-screen max-w-sm translate-x-0 translate-y-0 rounded-none rounded-l-[1.5rem]",
        className,
      )}
    >
      <DialogTitle className="sr-only">Navigation</DialogTitle>
      <DialogDescription className="sr-only">
        Mobile navigation for the TrustBridge application.
      </DialogDescription>
      {children}
    </DialogContent>
  );
}
