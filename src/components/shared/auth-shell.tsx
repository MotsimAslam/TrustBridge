import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-border/70 bg-primary text-primary-foreground">
        <CardContent className="flex h-full flex-col justify-between gap-10 px-8 py-10">
          <div className="space-y-6">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/15">
              <ShieldCheck className="size-7" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
              <p className="text-primary-foreground/80">{description}</p>
            </div>
          </div>
          <p className="max-w-md text-sm text-primary-foreground/80">
            Authentication is powered by Clerk, while TrustBridge keeps authorization, role routing, and database synchronization on the server.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="px-6 py-8 sm:px-10">{children}</CardContent>
      </Card>
    </div>
  );
}
