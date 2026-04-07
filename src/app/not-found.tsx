import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="max-w-lg">
        <CardContent className="space-y-6 px-8 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">404</p>
          <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground">
            The route exists in TrustBridge only if the relevant module has been wired.
          </p>
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
