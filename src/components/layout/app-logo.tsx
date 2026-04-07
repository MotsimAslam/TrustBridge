import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AppLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
        <ShieldCheck className="size-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-lg font-semibold tracking-tight">TrustBridge</span>
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Verified giving
        </span>
      </span>
    </Link>
  );
}
